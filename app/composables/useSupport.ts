import { ref, computed, nextTick } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuth } from "#imports";
import { useS3Upload } from "~/composables/useS3Upload";
import { useAppFeedback } from "~/composables/useAppFeedback";

export function useSupport() {
  const config = useRuntimeConfig();
  const { data: session, getSession, status } = useAuth();
  const { uploadFile, uploadError: s3UploadError } = useS3Upload();
  const { showError, showSuccess, showInfo } = useAppFeedback();

  const fileInput = ref<HTMLInputElement | null>(null);
  const isUploading = ref(false);
  const pendingAttachment = ref<{
    url: string;
    type: string;
    name: string;
  } | null>(null);

  const userId = computed(() => (session.value?.user as any)?.id || "");

  const userRole = computed(() => {
    const user = session.value?.user as any;
    return (user?.tipoUsuario || user?.role || "").toUpperCase();
  });

  const isOrganization = computed(
    () =>
      userRole.value === "ORGANIZACION" ||
      userRole.value === "EMPRESA" ||
      userRole.value === "RECRUITER",
  );

  const isModeratorRole = computed(
    () => userRole.value === "MODERATOR" || userRole.value === "ADMIN",
  );

  const searchQuery = ref("");
  const activeChat = ref<any>(null);
  const newMessageText = ref("");
  const chatContainer = ref<HTMLDivElement | null>(null);

  const chats = ref<any[]>([]);
  const messages = ref<any[]>([]);

  const isLoadingChats = ref(true);
  const isLoadingMessages = ref(false);
  const isSending = ref(false);
  const isProcessingAction = ref(false);

  const socket = ref<WebSocket | null>(null);
  const wsConnected = ref(false);

  const orgMessageCount = computed(() => {
    if (!activeChat.value) return 0;
    const companyId = activeChat.value.companyId || activeChat.value.id;
    return messages.value.filter((m) => m.senderId === companyId).length;
  });

  const filteredChats = computed(() => {
    if (!searchQuery.value.trim()) return chats.value;
    const q = searchQuery.value.toLowerCase();
    return chats.value.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.reason.toLowerCase().includes(q),
    );
  });

  const isMyMessage = (msg: any) => {
    if (isOrganization.value) {
      const compId = activeChat.value?.companyId || userId.value;
      return msg.senderId === compId;
    } else {
      const compId = activeChat.value?.companyId || activeChat.value?.id;
      return msg.senderId !== compId;
    }
  };

  const fetchConversations = async () => {
    if (status.value !== "authenticated") return;
    isLoadingChats.value = true;

    try {
      if (isOrganization.value) {
        await $fetch(
          `${config.public.apiUrl}/moderator/organizations/${userId.value}/join-appeal`,
          { method: "POST" },
        ).catch(() => {});

        const statusRes = await $fetch<any>(
          `${config.public.apiUrl}/moderator/organizations/${userId.value}/suspension-status`,
        ).catch(() => null);

        chats.value = [
          {
            id: userId.value,
            companyId: userId.value,
            name: "Soporte y Moderación JobNet",
            reason:
              statusRes?.reason ||
              "Atención directa de apelación e infracciones",
            status: statusRes?.status || "En revisión",
            lastMessage: "",
            time: new Date().toLocaleDateString(),
          },
        ];
      } else {
        const data = await $fetch<any[]>(
          `${config.public.apiUrl}/moderator/appeals`,
        ).catch(() => []);

        chats.value = (data || []).map((item) => ({
          id: item.id || item.companyId,
          companyId: item.companyId || item.id,
          name: item.name || "Organización en Apelación",
          reason: item.reason || "Revisión de infracción",
          status: item.status || "En revisión",
          lastMessage: "",
          time: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "Reciente",
        }));
      }

      if (chats.value.length > 0) {
        await selectChat(chats.value[0]);
      }
    } catch (err) {
      console.error("Error fetching appeal conversations:", err);
    } finally {
      isLoadingChats.value = false;
    }
  };

  const scrollToBottom = () => {
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    });
  };

  const selectChat = async (chat: any) => {
    activeChat.value = chat;
    isLoadingMessages.value = true;
    messages.value = [];

    const compId = chat.companyId || chat.id;

    try {
      const data = await $fetch<any[]>(
        `${config.public.apiUrl}/moderator/organizations/${compId}/appeal-messages`,
      ).catch(() => []);

      messages.value = (data || []).map((m) => ({
        id: `m-${m.createdAt}`,
        companyId: m.companyId || compId,
        senderId: m.senderId,
        text: m.text,
        attachmentUrl: m.attachmentUrl || null,
        attachmentType: m.attachmentType || null,
        attachmentName: m.attachmentName || null,
        createdAt: m.createdAt,
        time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      if (messages.value.length > 0) {
        chat.lastMessage = messages.value[messages.value.length - 1].text;
      }

      scrollToBottom();
    } catch (e) {
      console.error("Error loading appeal messages:", e);
    } finally {
      isLoadingMessages.value = false;
    }
  };

  const resolveOrgAppeal = async (action: "approve" | "confirm") => {
    if (!activeChat.value || isProcessingAction.value) return;
    isProcessingAction.value = true;
    const compId = activeChat.value.companyId || activeChat.value.id;

    try {
      if (action === "approve") {
        await $fetch(
          `${config.public.apiUrl}/moderator/organizations/${compId}/cancel-suspension`,
          {
            method: "POST",
            body: { notes: "Apelación aprobada tras revisión en tiempo real" },
          },
        );
        showSuccess(
          "Éxito",
          "Apelación aprobada con éxito. La organización ha sido reactivada.",
        );
      } else {
        await $fetch(
          `${config.public.apiUrl}/moderator/organizations/${compId}/confirm-suspension`,
          {
            method: "POST",
            body: {
              reason: "Confirmación de suspensión tras evaluación de apelación",
            },
          },
        );
        showInfo(
          "Notificación",
          "Suspensión confirmada. La organización ha sido suspendida definitivamente.",
        );
      }
      chats.value = chats.value.filter((c) => (c.companyId || c.id) !== compId);
      activeChat.value = chats.value[0] || null;
      if (activeChat.value) {
        await selectChat(activeChat.value);
      }
    } catch (e) {
      console.error("Error resolving organization appeal:", e);
      showError("Error", "Hubo un error al procesar el dictamen.");
    } finally {
      isProcessingAction.value = false;
    }
  };

  const connectWebSocket = async () => {
    const currentSession = await getSession().catch(() => null);
    const token =
      (currentSession as any)?.idToken || (session.value as any)?.idToken || "";
    if (!token) return;

    try {
      const wsUrl = `${config.public.wsUrl}?token=${token}`;
      socket.value = new WebSocket(wsUrl);

      socket.value.onopen = () => {
        wsConnected.value = true;
      };

      socket.value.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (
            payload.type === "APPEAL_MESSAGE" ||
            payload.action === "receiveMessage"
          ) {
            const {
              appealCompanyId,
              senderId,
              text,
              attachmentUrl,
              createdAt,
              messageId: incomingMsgId,
            } = payload;

            const activeCompId =
              activeChat.value?.companyId || activeChat.value?.id;

            if (
              activeCompId &&
              (appealCompanyId === activeCompId || !appealCompanyId)
            ) {
              const timeStr = new Date(
                createdAt || Date.now(),
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              const isDuplicate = messages.value.some((m) => {
                if (
                  incomingMsgId &&
                  m.messageId &&
                  m.messageId === incomingMsgId
                )
                  return true;
                if (m.createdAt && createdAt && m.createdAt === createdAt)
                  return true;
                return false;
              });

              if (!isDuplicate) {
                messages.value.push({
                  id: `m-ws-${Date.now()}`,
                  messageId: incomingMsgId || null,
                  companyId: activeCompId,
                  senderId,
                  text: text || "",
                  attachmentUrl: attachmentUrl || null,
                  createdAt: createdAt || new Date().toISOString(),
                  time: timeStr,
                });
                scrollToBottom();
              }
            }
          } else if (payload.type === "APPEAL_RESOLVED") {
            const { appealCompanyId, status } = payload;
            const activeCompId =
              activeChat.value?.companyId || activeChat.value?.id;

            if (activeCompId && appealCompanyId === activeCompId) {
              activeChat.value.status = status;
            }

            const chatInList = chats.value.find(
              (c) => (c.companyId || c.id) === appealCompanyId,
            );
            if (chatInList) {
              chatInList.status = status;
            }
          }
        } catch (e) {
          console.error("Error handling appeal WS message:", e);
        }
      };

      socket.value.onclose = () => {
        wsConnected.value = false;
        console.log("Support WebSocket closed. Attempting reconnect in 3s...");
        setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };
    } catch (err) {
      console.warn("WebSocket connection error:", err);
    }
  };

  const triggerFileInput = () => {
    fileInput.value?.click();
  };

  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const file = target.files[0];
    if (!file) return;

    const isImg =
      file.type.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);

    if (!isImg && !isPdf) {
      showInfo(
        "Notificación",
        "Solo se permiten archivos en formato PDF o Imágenes (JPG, PNG, WebP, GIF);",
      );
      if (fileInput.value) fileInput.value.value = "";
      return;
    }

    isUploading.value = true;

    try {
      const uploadRes = await uploadFile(file, {
        folder: "appeal",
        userId: userId.value || "user",
      });

      if (uploadRes && uploadRes.url) {
        pendingAttachment.value = {
          url: uploadRes.url,
          type: isImg ? "image" : "file",
          name: file.name,
        };

        await sendMessage();
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

  const sendHttpFallback = async (
    compId: string,
    text: string,
    attachment: any,
    messageId?: string,
  ) => {
    try {
      const token =
        (session.value as any)?.idToken ||
        (session.value as any)?.accessToken ||
        "";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      await $fetch(
        `${config.public.apiUrl}/moderator/organizations/${compId}/appeal-messages`,
        {
          method: "POST",
          headers,
          body: {
            text: text || "",
            senderId: userId.value,
            messageId: messageId || undefined,
            attachmentUrl: attachment?.url || undefined,
          },
        },
      );
    } catch (e) {
      console.warn("HTTP appeal message post notice:", e);
    }
  };

  const sendMessage = async () => {
    const text = newMessageText.value.trim();
    const attachment = pendingAttachment.value;
    if ((!text && !attachment) || !activeChat.value || isSending.value) return;
    isSending.value = true;

    const compId = activeChat.value.companyId || activeChat.value.id;
    const now = new Date().toISOString();
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const messageId = crypto.randomUUID();

    const localMsg = {
      id: `m-user-${Date.now()}`,
      messageId,
      companyId: compId,
      senderId: userId.value,
      text,
      attachmentUrl: attachment?.url || null,
      attachmentType: attachment?.type || null,
      attachmentName: attachment?.name || null,
      createdAt: now,
      time: timeStr,
    };

    messages.value.push(localMsg);
    newMessageText.value = "";
    pendingAttachment.value = null;

    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      try {
        socket.value.send(
          JSON.stringify({
            action: "sendMessage",
            appealCompanyId: compId,
            messageId,
            text: text || "",
            attachmentUrl: attachment?.url || null,
            attachmentType: attachment?.type || null,
            attachmentName: attachment?.name || null,
          }),
        );
      } catch (wsErr) {
        console.warn(
          "WebSocket send exception, executing HTTP fallback:",
          wsErr,
        );
        await sendHttpFallback(compId, text, attachment, messageId);
      }
    } else {
      await sendHttpFallback(compId, text, attachment, messageId);
    }

    isSending.value = false;
    scrollToBottom();
  };

  const isImageUrl = (url?: string) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
  };

  const openImagePreview = (url: string) => {
    window.open(url, "_blank");
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "Reciente";
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    fileInput,
    isUploading,
    pendingAttachment,
    searchQuery,
    activeChat,
    newMessageText,
    chatContainer,
    chats,
    messages,
    isLoadingChats,
    isLoadingMessages,
    isSending,
    isProcessingAction,
    socket,
    wsConnected,
    orgMessageCount,
    filteredChats,
    isOrganization,
    isModeratorRole,
    isMyMessage,
    fetchConversations,
    selectChat,
    resolveOrgAppeal,
    connectWebSocket,
    triggerFileInput,
    handleFileUpload,
    sendMessage,
    isImageUrl,
    openImagePreview,
    formatTime,
  };
}
