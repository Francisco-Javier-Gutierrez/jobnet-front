import { useRoute, useRuntimeConfig, useAuth } from "#imports";
import { useAppFeedback } from "~/composables/useAppFeedback";
import { useMockSession } from "~/composables/useMockSession";
import { MOCK_CHATS, MOCK_MESSAGES_TECHSOLUTIONS } from "~/utils/mockData";
import { useS3Upload } from "~/composables/useS3Upload";
import { getAuthHeaders } from "~/composables/useApiClient";
import { WebSocketClient, type WebSocketStatus } from "~/utils/wsClient";
import type { ChatConversation, ChatMessage } from "~/types";

export interface StagedFile {
  file: File;
  previewUrl: string;
  name: string;
  sizeFormatted: string;
  isImage: boolean;
  isPdf: boolean;
}

export interface FilePreviewModalState {
  isOpen: boolean;
  type: "image" | "pdf";
  url: string;
  name: string;
  isLoading: boolean;
}

export const useMessages = () => {
  const { showError, showSuccess, showInfo } = useAppFeedback();
  const route = useRoute();
  const config = useRuntimeConfig();
  const { data: session, status } = useAuth();
  const {
    uploadFile,
    uploadError: s3UploadError,
    getSecureViewUrl,
  } = useS3Upload();

  const fileInput = ref<HTMLInputElement | null>(null);
  const isUploading = ref(false);
  const stagedFile = ref<StagedFile | null>(null);

  // In-app modal viewer state for images and PDFs
  const previewModal = ref<FilePreviewModalState>({
    isOpen: false,
    type: "image",
    url: "",
    name: "",
    isLoading: false,
  });

  const userId = computed(() => session.value?.user?.id || "");
  const userRole = computed(() => session.value?.user?.tipoUsuario || "");

  const isCompanyRole = computed(() => {
    const role = (userRole.value || "").toUpperCase();
    return (
      role === "ORGANIZACION" ||
      role === "ADMIN" ||
      role === "MODERATOR" ||
      role === "MODERADOR"
    );
  });

  const searchQuery = ref("");
  const activeChat = ref<ChatConversation | null>(null);
  const newMessage = ref("");
  const chats = ref<ChatConversation[]>([]);
  const messages = ref<ChatMessage[]>([]);

  const isLoadingChats = ref(true);
  const isLoadingMessages = ref(false);

  const messageContainer = ref<HTMLElement | null>(null);

  // WebSocket Client with exponential backoff
  const wsStatus = ref<WebSocketStatus>("disconnected");
  let wsClient: WebSocketClient | null = null;
  let activeAbortController: AbortController | null = null;

  const filteredChats = computed(() => {
    if (!searchQuery.value.trim()) return chats.value;
    const q = searchQuery.value.toLowerCase();
    return chats.value.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.jobTitle.toLowerCase().includes(q),
    );
  });

  const scrollToBottom = async () => {
    await nextTick();
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  // Select and load chat messages with AbortController to prevent race conditions
  const selectChat = async (chat: ChatConversation) => {
    // 1. Cancel previous in-flight chat request
    if (activeAbortController) {
      activeAbortController.abort();
    }
    activeAbortController = new AbortController();
    const currentSignal = activeAbortController.signal;

    activeChat.value = chat;
    isLoadingMessages.value = true;
    messages.value = [];

    try {
      const token =
        (session.value as any)?.idToken ||
        (session.value as any)?.accessToken ||
        "";
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const data = await $fetch<any[]>(
        `${config.public.apiUrl}/chats/${chat.jobId}/${chat.candidateId}/messages`,
        {
          headers,
          signal: currentSignal,
        },
      ).catch((err) => {
        if (err?.name === "AbortError") return null;
        console.error("Error loading chat messages:", err);
        return [];
      });

      // If user switched to another chat while fetching, ignore stale result
      if (currentSignal.aborted || activeChat.value?.id !== chat.id) {
        return;
      }

      messages.value = Array.isArray(data) ? data : [];

      // Update last message in sidebar
      if (messages.value.length > 0) {
        const last = messages.value[messages.value.length - 1];
        chat.lastMessage =
          last.text || last.attachmentName || "Archivo adjunto";
        chat.time = formatTime(last.createdAt);
      }

      await scrollToBottom();
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        console.error("Error loading chat messages:", e);
        messages.value = [];
      }
    } finally {
      if (activeChat.value?.id === chat.id) {
        isLoadingMessages.value = false;
      }
    }
  };

  // Helper to dynamically add conversation if new message arrives for unknown chat
  const fetchNewChatDetails = async (
    jobId: string,
    candidateId: string,
    lastMsg: string,
    timeIso: string,
  ) => {
    const targetId = `${jobId}#${candidateId}`;
    if (chats.value.some((c) => c.id === targetId)) return;

    try {
      const [jobDetail, profile] = await Promise.all([
        $fetch<any>(`${config.public.apiUrl}/jobs/${jobId}`).catch(() => ({})),
        $fetch<any>(`${config.public.apiUrl}/profile/${candidateId}`).catch(
          () => ({}),
        ),
      ]);

      const isCand = !isCompanyRole.value;
      const conversationName = isCand
        ? jobDetail?.company || jobDetail?.nombreEmpresa || "Organización"
        : profile?.nombre ||
          profile?.name ||
          `Candidato (${candidateId.substring(0, 8)})`;

      const newConv: ChatConversation = {
        id: targetId,
        jobId,
        candidateId,
        companyId: jobDetail?.empresaUuid || jobDetail?.companyId || "",
        name: conversationName,
        jobTitle: jobDetail?.title || jobDetail?.titulo || "Vacante",
        status: "En Contacto",
        lastMessage: lastMsg,
        time: formatTime(timeIso),
      };

      chats.value.unshift(newConv);
    } catch (err) {
      console.warn(
        "Could not dynamically resolve new conversation metadata:",
        err,
      );
    }
  };

  // Fetch active chats for authenticated user strictly scoped to their own jobs/applications
  const fetchConversations = async () => {
const { isMockEnabled } = useMockSession();
    if (status.value !== "authenticated" && !isMockEnabled.value && !userId.value) return;
    isLoadingChats.value = true;
    if (isMockEnabled.value) {
      chats.value = MOCK_CHATS;
      if (chats.value.length > 0) {
        await selectChat(chats.value[0]);
      }
      isLoadingChats.value = false;
      return;
    }

    try {
      const headers = getAuthHeaders();

      const list: ChatConversation[] = [];
      const allJobs = await $fetch<any[]>(`${config.public.apiUrl}/jobs`, {
        headers,
      }).catch(() => []);

      const role = (userRole.value || "").toUpperCase();

      if (role === "CANDIDATO" || role === "CANDIDATE") {
        const apps = await $fetch<any[]>(
          `${config.public.apiUrl}/applications?candidateId=${userId.value}`,
          { headers },
        ).catch(() => []);

        for (const app of apps) {
          const job = allJobs.find((j) => j.id === app.jobId);
          const statusMap: Record<string, string> = {
            PENDIENTE: "Pendiente",
            EN_CONTACTO: "En Contacto",
            SELECCIONADO: "Seleccionado",
            CONTRATADO: "Contratado",
            RECHAZADO: "Rechazado",
          };
          list.push({
            id: `${app.jobId}#${userId.value}`,
            jobId: app.jobId,
            candidateId: userId.value,
            companyId: job?.empresaUuid || job?.companyId || "",
            name: job?.company || job?.nombreEmpresa || "Organización",
            jobTitle: job?.title || job?.titulo || "Vacante",
            status: statusMap[app.status] || app.status || "Pendiente",
            lastMessage: "",
            time: new Date(app.appliedAt || Date.now()).toLocaleDateString(),
          });
        }
      } else {
        // Scoped strictly to vacancies belonging to THIS company
        const myCompanyJobs = allJobs.filter(
          (j) => j.empresaUuid === userId.value,
        );

        for (const job of myCompanyJobs) {
          const apps = await $fetch<any[]>(
            `${config.public.apiUrl}/jobs/${job.id}/applicants`,
            { headers },
          ).catch(() => []);

          for (const app of apps) {
            const profile = await $fetch<any>(
              `${config.public.apiUrl}/profile/${app.candidateId}`,
              { headers },
            ).catch(() => ({}));

            const statusMap: Record<string, string> = {
              PENDIENTE: "Pendiente",
              EN_CONTACTO: "En Contacto",
              SELECCIONADO: "Seleccionado",
              CONTRATADO: "Contratado",
              RECHAZADO: "Rechazado",
            };

            list.push({
              id: `${job.id}#${app.candidateId}`,
              jobId: job.id,
              candidateId: app.candidateId,
              companyId: job.empresaUuid || job.companyId || userId.value,
              name:
                profile.nombre ||
                profile.name ||
                `Candidato (${app.candidateId.substring(0, 8)})`,
              jobTitle: job.title || job.titulo || "Vacante",
              status: statusMap[app.status] || app.status || "Pendiente",
              lastMessage: "",
              time: new Date(app.appliedAt || Date.now()).toLocaleDateString(),
            });
          }
        }
      }

      chats.value = list;

      // Handle redirect query params if directed from another view
      if (route.query.jobId && route.query.candidateId) {
        const qJobId = route.query.jobId as string;
        const qCandidateId = route.query.candidateId as string;
        const targetId = `${qJobId}#${qCandidateId}`;

        let found = chats.value.find((c) => c.id === targetId);

        if (!found) {
          await fetchNewChatDetails(
            qJobId,
            qCandidateId,
            "",
            new Date().toISOString(),
          );
          found = chats.value.find((c) => c.id === targetId);
        }

        if (found) {
          await selectChat(found);
        }
      } else if (chats.value.length > 0 && !activeChat.value) {
        await selectChat(chats.value[0]);
      }
    } catch (e) {
      console.error("Error fetching conversations:", e);
    } finally {
      isLoadingChats.value = false;
    }
  };

  // Handle incoming real-time WebSocket messages
  const handleWsMessage = (payload: any) => {
    if (payload.action === "receiveMessage") {
      const {
        messageId,
        jobId,
        candidateId,
        senderId,
        text,
        attachmentUrl,
        attachmentType,
        attachmentName,
        createdAt,
      } = payload;

      const targetChatId = `${jobId}#${candidateId}`;

      // If viewing the conversation right now, append to chat history
      if (
        activeChat.value &&
        activeChat.value.jobId === jobId &&
        activeChat.value.candidateId === candidateId
      ) {
        // Reconcile by messageId or exact timestamp + sender
        const isDuplicate = messages.value.some((m) => {
          if (messageId && m.messageId && m.messageId === messageId)
            return true;
          if (
            m.createdAt &&
            createdAt &&
            m.createdAt === createdAt &&
            m.senderId === senderId
          )
            return true;
          return false;
        });

        if (!isDuplicate) {
          messages.value.push({
            messageId: messageId || null,
            senderId,
            text: text || "",
            attachmentUrl: attachmentUrl || null,
            attachmentType: attachmentType || null,
            attachmentName: attachmentName || null,
            createdAt,
          });
          scrollToBottom();
        }
      }

      // Update sidebar
      const existingChat = chats.value.find((c) => c.id === targetChatId);
      if (existingChat) {
        existingChat.lastMessage = text || attachmentName || "Archivo adjunto";
        existingChat.time = formatTime(createdAt);
        // Bump conversation to the top
        chats.value = [
          existingChat,
          ...chats.value.filter((c) => c.id !== targetChatId),
        ];
      } else {
        // Conversation not yet in list; fetch metadata and insert
        fetchNewChatDetails(
          jobId,
          candidateId,
          text || attachmentName || "Archivo adjunto",
          createdAt,
        );
      }
    }
  };

  // Connect to WebSocket using resilient WebSocketClient
  const connectWebSocket = () => {
    if (status.value !== "authenticated") return;
    const token =
      (session.value as any)?.idToken ||
      (session.value as any)?.accessToken ||
      "";

    if (!token) return;

    if (wsClient) {
      wsClient.disconnect();
    }

    const wsUrl = `${config.public.wsUrl}?token=${token}`;
    wsClient = new WebSocketClient({
      url: wsUrl,
      reconnect: true,
      maxReconnectAttempts: 10,
      baseReconnectDelay: 2000,
      onMessage: handleWsMessage,
      onStatusChange: (s) => {
        wsStatus.value = s;
      },
    });

    wsClient.connect();
  };

  // Trigger file picker
  const triggerFileInput = () => {
    fileInput.value?.click();
  };

  // Two-step file selection (Staged preview before sending)
  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const file = target.files[0];
    if (!file) return;

    // Strict 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      showError(
        "Límite de Tamaño Excedido",
        `El archivo supera el límite de 5MB (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
      );
      if (fileInput.value) fileInput.value.value = "";
      return;
    }

    // Restrict to images and PDFs (SVGs excluded for security)
    const isImg =
      file.type.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);

    if (!isImg && !isPdf) {
      showInfo(
        "Formato no admitido",
        "Solo se permiten archivos en formato PDF o Imágenes (JPG, PNG, WebP, GIF).",
      );
      if (fileInput.value) fileInput.value.value = "";
      return;
    }

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const previewUrl = isImg ? URL.createObjectURL(file) : "";

    stagedFile.value = {
      file,
      previewUrl,
      name: file.name,
      sizeFormatted,
      isImage: isImg,
      isPdf,
    };

    if (fileInput.value) fileInput.value.value = "";
  };

  const cancelStagedFile = () => {
    if (stagedFile.value?.previewUrl) {
      URL.revokeObjectURL(stagedFile.value.previewUrl);
    }
    stagedFile.value = null;
  };

  const isImageUrl = (url?: string) => {
    if (!url) return false;
    const cleanUrl = url.split("?")[0];
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(cleanUrl);
  };

  // Open In-App Lightbox or PDF Viewer using signed view URLs
  const openImagePreview = async (url: string, name: string = "Imagen") => {
    previewModal.value = {
      isOpen: true,
      type: "image",
      url,
      name,
      isLoading: true,
    };

    try {
      const secureUrl = await getSecureViewUrl(url);
      if (previewModal.value.isOpen && previewModal.value.url === url) {
        previewModal.value.url = secureUrl || url;
      }
    } catch {
      // Fallback to original URL
    } finally {
      previewModal.value.isLoading = false;
    }
  };

  const openPdfViewer = async (url: string, name: string = "Documento PDF") => {
    previewModal.value = {
      isOpen: true,
      type: "pdf",
      url,
      name,
      isLoading: true,
    };

    try {
      const secureUrl = await getSecureViewUrl(url);
      if (previewModal.value.isOpen && previewModal.value.url === url) {
        previewModal.value.url = secureUrl || url;
      }
    } catch {
      // Fallback to original URL
    } finally {
      previewModal.value.isLoading = false;
    }
  };

  const closePreviewModal = () => {
    previewModal.value.isOpen = false;
    previewModal.value.url = "";
  };

  const downloadAttachment = async (
    url: string,
    filename: string = "archivo",
  ) => {
    try {
      const secureUrl = await getSecureViewUrl(url);
      const link = document.createElement("a");
      link.href = secureUrl || url;
      link.download = filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.open(url, "_blank");
    }
  };

  // Handle message sending (combining text and staged attachment)
  const handleSend = async () => {
    if (
      (!newMessage.value.trim() && !stagedFile.value) ||
      !activeChat.value ||
      isUploading.value
    )
      return;

    const text = newMessage.value.trim();
    const timestamp = new Date().toISOString();
    const messageId = crypto.randomUUID();
    let attachmentData: any = null;

    // 1. If a file is staged, upload to S3 first
    if (stagedFile.value) {
      isUploading.value = true;
      try {
        const uploadRes = await uploadFile(stagedFile.value.file, {
          folder: "chat",
          userId: userId.value || "user",
        });

        if (uploadRes && uploadRes.url) {
          attachmentData = {
            url: uploadRes.url,
            type: stagedFile.value.isImage ? "image" : "file",
            name: stagedFile.value.name,
          };
        } else {
          showError(
            "Error al adjuntar",
            "No se pudo subir el archivo adjunto.",
          );
          isUploading.value = false;
          return;
        }
      } catch (err: any) {
        showError(
          "Error al adjuntar",
          `Error al subir archivo: ${err.message || err}`,
        );
        isUploading.value = false;
        return;
      } finally {
        cancelStagedFile();
        isUploading.value = false;
      }
    }

    const msgPayload: ChatMessage = {
      messageId,
      senderId: userId.value,
      text,
      createdAt: timestamp,
      ...(attachmentData
        ? {
            attachmentUrl: attachmentData.url,
            attachmentType: attachmentData.type,
            attachmentName: attachmentData.name,
          }
        : {}),
    };

    // Optimistically push to local UI
    messages.value.push(msgPayload);
    activeChat.value.lastMessage =
      text || attachmentData?.name || "Archivo adjunto";
    activeChat.value.time = formatTime(timestamp);

    newMessage.value = "";
    await scrollToBottom();

    // Send payload
    const sendPayload = {
      action: "sendMessage",
      messageId,
      jobId: activeChat.value.jobId,
      candidateId: activeChat.value.candidateId,
      text,
      attachmentUrl: attachmentData?.url,
      attachmentType: attachmentData?.type,
      attachmentName: attachmentData?.name,
    };

    if (wsClient && wsClient.getStatus() === "connected") {
      const sent = wsClient.send(sendPayload);
      if (!sent) {
        await sendRestHttpFallback(text, attachmentData, messageId);
      }
    } else {
      await sendRestHttpFallback(text, attachmentData, messageId);
    }
  };

  const sendRestHttpFallback = async (
    text: string,
    attachment: any,
    messageId: string,
  ) => {
    if (!activeChat.value) return;
    try {
      const token =
        (session.value as any)?.idToken ||
        (session.value as any)?.accessToken ||
        "";
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      await $fetch(
        `${config.public.apiUrl}/chats/${activeChat.value.jobId}/${activeChat.value.candidateId}/messages`,
        {
          method: "POST",
          headers,
          body: {
            messageId,
            senderId: userId.value,
            text,
            attachmentUrl: attachment?.url,
            attachmentType: attachment?.type,
            attachmentName: attachment?.name,
          },
        },
      );
    } catch (restErr) {
      console.error("Failed to send message via REST API fallback:", restErr);
    }
  };

  onMounted(async () => {
    await fetchConversations();
    connectWebSocket();
  });

  onUnmounted(() => {
    if (activeAbortController) {
      activeAbortController.abort();
    }
    if (wsClient) {
      wsClient.disconnect();
      wsClient = null;
    }
    cancelStagedFile();
  });

  return {
    userId,
    userRole,
    isCompanyRole,
    searchQuery,
    activeChat,
    newMessage,
    chats,
    messages,
    isLoadingChats,
    isLoadingMessages,
    wsStatus,
    filteredChats,
    fileInput,
    isUploading,
    stagedFile,
    previewModal,
    messageContainer,
    selectChat,
    handleSend,
    handleFileUpload,
    cancelStagedFile,
    triggerFileInput,
    isImageUrl,
    openImagePreview,
    openPdfViewer,
    closePreviewModal,
    downloadAttachment,
    formatTime,
  };
};
