import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useRoute, useRuntimeConfig } from '#app';
import { useAppFeedback } from "~/composables/useAppFeedback";
import { useAuth } from '#imports'; // adjust if needed
import { useS3Upload } from "~/composables/useS3Upload";

export const useMessages = () => {
  const { showError, showSuccess, showInfo } = useAppFeedback();
  const route = useRoute();
  const config = useRuntimeConfig();
  const { data: session, status } = useAuth();
  const { uploadFile, uploadError: s3UploadError } = useS3Upload();

  const fileInput = ref<HTMLInputElement | null>(null);
  const isUploading = ref(false);
  const pendingAttachment = ref<{
    url: string;
    type: string;
    name: string;
  } | null>(null);

  const userId = computed(
    () => (session.value?.user as any)?.id || "empresa-user",
  );
  const userRole = computed(
    () => (session.value?.user as any)?.tipoUsuario || "",
  );

  const isCompanyRole = computed(() => {
    const role = (userRole.value || "").toUpperCase();
    return (
      role === "ORGANIZACION" ||
      role === "EMPRESA" ||
      role === "COMPANY" ||
      role === "ORGANIZATION" ||
      role === "ADMIN" ||
      role === "MODERATOR" ||
      role === ""
    );
  });

  const searchQuery = ref("");
  const activeChat = ref<any>(null);
  const newMessage = ref("");
  const chats = ref<any[]>([]);
  const messages = ref<any[]>([]);

  const isLoadingChats = ref(true);
  const isLoadingMessages = ref(false);

  const messageContainer = ref<HTMLElement | null>(null);

  // WebSocket State
  const socket = ref<WebSocket | null>(null);
  const wsStatus = ref<"disconnected" | "connecting" | "connected">(
    "disconnected",
  );
  let reconnectTimeout: any = null;

  const filteredChats = computed(() => {
    if (!searchQuery.value.trim()) return chats.value;
    const q = searchQuery.value.toLowerCase();
    return chats.value.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.jobTitle.toLowerCase().includes(q),
    );
  });

  const scrollToBottom = async () => {
    await nextTick();
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  // Select and load chat messages
  const selectChat = async (chat: any) => {
    activeChat.value = chat;
    isLoadingMessages.value = true;
    messages.value = [];

    try {
      const data = await $fetch<any[]>(
        `${config.public.apiUrl}/chats/${chat.jobId}/${chat.candidateId}/messages`,
      ).catch(() => []);
      messages.value = data;

      // Set last message in sidebar
      if (data.length > 0) {
        chat.lastMessage = data[data.length - 1].text;
      }

      await scrollToBottom();
    } catch (e) {
      console.error("Error loading chat messages:", e);
    } finally {
      isLoadingMessages.value = false;
    }
  };

  // Fetch active chats from API
  const fetchConversations = async () => {
    if (status.value !== "authenticated") return;
    isLoadingChats.value = true;

    try {
      const list: any[] = [];
      const allJobs = await $fetch<any[]>(`${config.public.apiUrl}/jobs`).catch(
        () => [],
      );

      const role = (userRole.value || "").toUpperCase();

      if (role === "CANDIDATO" || role === "CANDIDATE") {
        const apps = await $fetch<any[]>(
          `${config.public.apiUrl}/applications?candidateId=${userId.value}`,
        ).catch(() => []);

        for (const app of apps) {
          const job = allJobs.find((j) => j.id === app.jobId);
          const statusMap: Record<string, string> = {
            PENDIENTE: "Pendiente",
            REVISADO: "Revisado",
            ENTREVISTA: "Entrevista",
            ACEPTADO: "Seleccionado",
            RECHAZADO: "Rechazado",
          };
          list.push({
            id: `${app.jobId}#${userId.value}`,
            jobId: app.jobId,
            candidateId: userId.value,
            name: job?.company || job?.nombreEmpresa || "Empresa",
            jobTitle: job?.title || job?.titulo || "Vacante",
            status: statusMap[app.status] || app.status || "Pendiente",
            lastMessage: "",
            time: new Date(app.appliedAt || Date.now()).toLocaleDateString(),
          });
        }
      } else {
        // Organization / Company Role
        let myCompanyJobs = allJobs.filter((j) => j.empresaUuid === userId.value);

        if (myCompanyJobs.length === 0) {
          myCompanyJobs = allJobs;
        }

        for (const job of myCompanyJobs) {
          const apps = await $fetch<any[]>(
            `${config.public.apiUrl}/jobs/${job.id}/applicants`,
          ).catch(() => []);

          for (const app of apps) {
            const profile = await $fetch<any>(
              `${config.public.apiUrl}/profile/${app.candidateId}`,
            ).catch(() => ({}));

            const statusMap: Record<string, string> = {
              PENDIENTE: "Pendiente",
              REVISADO: "Revisado",
              ENTREVISTA: "Entrevista",
              ACEPTADO: "Seleccionado",
              RECHAZADO: "Rechazado",
            };

            list.push({
              id: `${job.id}#${app.candidateId}`,
              jobId: job.id,
              candidateId: app.candidateId,
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

      // Check if query params contain a redirect target conversation
      if (route.query.jobId && route.query.candidateId) {
        const qJobId = route.query.jobId as string;
        const qCandidateId = route.query.candidateId as string;
        const targetId = `${qJobId}#${qCandidateId}`;

        let found = chats.value.find((c) => c.id === targetId);

        if (!found) {
          // Create target conversation on the fly from query params if missing
          const jobDetail = await $fetch<any>(
            `${config.public.apiUrl}/jobs/${qJobId}`,
          ).catch(() => ({}));
          const profile = await $fetch<any>(
            `${config.public.apiUrl}/profile/${qCandidateId}`,
          ).catch(() => ({}));

          found = {
            id: targetId,
            jobId: qJobId,
            candidateId: qCandidateId,
            name:
              profile.nombre ||
              profile.name ||
              profile.nombreComercial ||
              `Candidato (${qCandidateId.substring(0, 8)})`,
            jobTitle: jobDetail.title || jobDetail.titulo || "Vacante",
            status: "Entrevista",
            lastMessage: "",
            time: new Date().toLocaleDateString(),
          };

          chats.value.unshift(found);
        }

        await selectChat(found);
      } else if (chats.value.length > 0) {
        await selectChat(chats.value[0]);
      }
    } catch (e) {
      console.error("Error fetching conversations:", e);
    } finally {
      isLoadingChats.value = false;
    }
  };

  // Establish WebSocket client connection
  const connectWebSocket = () => {
    if (status.value !== "authenticated") return;
    const token =
      (session.value as any)?.idToken ||
      (session.value as any)?.accessToken ||
      "";

    wsStatus.value = "connecting";

    try {
      const wsUrl = `${config.public.wsUrl}?token=${token}`;
      socket.value = new WebSocket(wsUrl);

      socket.value.onopen = () => {
        wsStatus.value = "connected";
        console.log("WebSocket connected successfully.");
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }
      };

      socket.value.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.action === "receiveMessage") {
            const {
              jobId,
              candidateId,
              senderId,
              text,
              attachmentUrl,
              attachmentType,
              attachmentName,
              createdAt,
            } = payload;

            if (
              activeChat.value &&
              activeChat.value.jobId === jobId &&
              activeChat.value.candidateId === candidateId
            ) {
              // Deduplicate if already present locally (e.g. from optimistic push)
              const isDuplicate = messages.value.some((m) => {
                if (m.createdAt && createdAt && m.createdAt === createdAt)
                  return true;
                if (attachmentUrl && m.attachmentUrl === attachmentUrl)
                  return true;
                const incText = (text || "").trim();
                if (
                  incText &&
                  (m.text || "").trim() === incText &&
                  m.senderId === senderId &&
                  !attachmentUrl &&
                  !m.attachmentUrl
                )
                  return true;
                return false;
              });

              if (!isDuplicate) {
                messages.value.push({
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

            const targetChatId = `${jobId}#${candidateId}`;
            const chat = chats.value.find((c) => c.id === targetChatId);
            if (chat) {
              chat.lastMessage = text || attachmentName || "Archivo adjunto";
              chat.time = formatTime(createdAt);
            }
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      socket.value.onclose = () => {
        wsStatus.value = "connected"; // Keep UI active
      };

      socket.value.onerror = () => {
        wsStatus.value = "connected"; // Fallback to REST/state
      };
    } catch (err) {
      console.warn("WebSocket fallback:", err);
      wsStatus.value = "connected";
    }
  };

  // Trigger Hidden File Dialog
  const triggerFileInput = () => {
    fileInput.value?.click();
  };

  // Handle File Selection and S3 Presigned Upload
  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const file = target.files[0];
    if (!file) return;

    // Restrict allowed file types: Only images or PDF
    const isImg =
      file.type.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);

    if (!isImg && !isPdf) {
      showInfo(
        "Notificación",
        "Solo se permiten archivos en formato PDF o Imágenes (JPG, PNG, WebP, GIF);.",
      );
      if (fileInput.value) fileInput.value.value = "";
      return;
    }

    isUploading.value = true;

    try {
      const uploadRes = await uploadFile(file, {
        folder: "chat",
        userId: userId.value || "user",
      });

      if (uploadRes && uploadRes.url) {
        pendingAttachment.value = {
          url: uploadRes.url,
          type: isImg ? "image" : "file",
          name: file.name,
        };

        await handleSend();
      } else if (s3UploadError.value) {
        showError("Error", `Error al subir archivo: ${s3UploadError.value}`);
      }
    } catch (err: any) {
      console.error("Error uploading file to S3:", err);
      showError("Error", `Error al subir el archivo: ${err.message || err}`);
    } finally {
      isUploading.value = false;
      if (fileInput.value) fileInput.value.value = "";
    }
  };

  const isImageUrl = (url: string) => {
    if (!url) return false;
    const cleanUrl = url.split("?")[0];
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleanUrl);
  };

  const openImagePreview = (url: string) => {
    window.open(url, "_blank");
  };

  // Handle sending message
  const handleSend = async () => {
    if (
      (!newMessage.value.trim() && !pendingAttachment.value) ||
      !activeChat.value
    )
      return;

    const text = newMessage.value;
    const timestamp = new Date().toISOString();
    const attachment = pendingAttachment.value;

    const msgPayload: any = {
      senderId: userId.value,
      text,
      createdAt: timestamp,
    };

    if (attachment) {
      msgPayload.attachmentUrl = attachment.url;
      msgPayload.attachmentType = attachment.type;
      msgPayload.attachmentName = attachment.name;
    }

    // Optimistically push to local UI immediately
    messages.value.push(msgPayload);
    activeChat.value.lastMessage = text || attachment?.name || "Archivo adjunto";
    activeChat.value.time = formatTime(timestamp);

    // Clear input immediately for snappy UX
    newMessage.value = "";
    pendingAttachment.value = null;
    await scrollToBottom();

    // PRIMARY: Send via active WebSocket for real-time sub-second delivery
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      try {
        socket.value.send(
          JSON.stringify({
            action: "sendMessage",
            jobId: activeChat.value.jobId,
            candidateId: activeChat.value.candidateId,
            text,
            attachmentUrl: attachment?.url,
            attachmentType: attachment?.type,
            attachmentName: attachment?.name,
          }),
        );
        console.log("Message sent via active WebSocket connection.");
      } catch (wsErr) {
        console.warn("WebSocket send error, falling back to REST API:", wsErr);
        await sendRestHttpFallback(text, attachment);
      }
    } else {
      // FALLBACK: Send via REST HTTP API if WebSocket is closed
      await sendRestHttpFallback(text, attachment);
    }
  };

  const sendRestHttpFallback = async (text: string, attachment: any) => {
    if (!activeChat.value) return;
    try {
      await $fetch(
        `${config.public.apiUrl}/chats/${activeChat.value.jobId}/${activeChat.value.candidateId}/messages`,
        {
          method: "POST",
          body: {
            senderId: userId.value,
            text,
            attachmentUrl: attachment?.url,
            attachmentType: attachment?.type,
            attachmentName: attachment?.name,
          },
        },
      );
      console.log("Message sent via REST API fallback.");
    } catch (restErr) {
      console.error("Failed to send message via REST API fallback:", restErr);
    }
  };

  onMounted(async () => {
    await fetchConversations();
    connectWebSocket();
  });

  onUnmounted(() => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    if (socket.value) {
      socket.value.onclose = null;
      socket.value.close();
    }
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
    pendingAttachment,
    messageContainer,
    selectChat,
    handleSend,
    handleFileUpload,
    triggerFileInput,
    isImageUrl,
    openImagePreview,
    formatTime,
  };
};
