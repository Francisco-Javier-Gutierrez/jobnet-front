import { ref, computed, nextTick, onMounted } from "vue";
import { useRoute, useRuntimeConfig } from "#app";
import { useAuth } from "#imports";
import { useWebSocketChat } from "~/composables/useWebSocketChat";
import { useChatAttachments } from "~/composables/useChatAttachments";

export const useMessages = () => {
  const route = useRoute();
  const config = useRuntimeConfig();
  const { data: session, status } = useAuth();
  
  // Use generic websocket composable
  const { wsStatus, connectWebSocket, sendWsMessage } = useWebSocketChat();
  
  // Use generic chat attachments composable
  const {
    fileInput,
    isUploading,
    pendingAttachment,
    triggerFileInput,
    handleFileUpload: baseHandleFileUpload,
    isImageUrl,
    openImagePreview,
    formatTime,
  } = useChatAttachments("chat");

  const userId = computed(() => (session.value?.user as any)?.id || "organizaci├│n-user");
  const userRole = computed(() => (session.value?.user as any)?.tipoUsuario || "");

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

  const filteredChats = computed(() => {
    if (!searchQuery.value.trim()) return chats.value;
    const q = searchQuery.value.toLowerCase();
  const scrollToBottom = async () => {
    await nextTick();
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  };

  // Select and load chat messages
  const selectChat = async (chat: any) => {
    activeChat.value = chat;
    isLoadingMessages.value = true;
    }
  };

  // Select and load chat messages
  const selectChat = async (chat: any) => {
    activeChat.value = chat;
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
      const allJobs = await $fetch<any[]>(`${config.public.apiUrl}/jobs`).catch(() => []);
      const role = (userRole.value || "").toUpperCase();

      if (role === "CANDIDATO" || role === "CANDIDATE") {
        const apps = await $fetch<any[]>(
          `${config.public.apiUrl}/applications?candidateId=${userId.value}`,
        ).catch(() => []);

        for (const app of apps) {
          const job = allJobs.find((j) => j.id === app.jobId);
          const statusMap: Record<string, string> = {
            PENDIENTE: "Pendiente",
            EN_CONTACTO: "En Contacto",

    try {
      const list: any[] = [];
      const allJobs = await $fetch<any[]>(`${config.public.apiUrl}/jobs`).catch(() => []);
      const role = (userRole.value || "").toUpperCase();

      if (role === "CANDIDATO" || role === "CANDIDATE") {
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

        }
      } else {
        // Organization / Company Role
        let myCompanyJobs = allJobs.filter((j) => j.empresaUuid === userId.value);

        if (myCompanyJobs.length === 0) {
          myCompanyJobs = allJobs;
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

      if (route.query.jobId && route.query.candidateId) {
        const qJobId = route.query.jobId as string;
        const qCandidateId = route.query.candidateId as string;
        const targetId = `${qJobId}#${qCandidateId}`;

        let found = chats.value.find((c) => c.id === targetId);

        if (!found) {
          const jobDetail = await $fetch<any>(`${config.public.apiUrl}/jobs/${qJobId}`).catch(() => ({}));
          const profile = await $fetch<any>(`${config.public.apiUrl}/profile/${qCandidateId}`).catch(() => ({}));

          found = {
            id: targetId,
            jobId: qJobId,
            candidateId: qCandidateId,
            name:
              profile.nombre ||
              profile.name ||

      chats.value = list;

      if (route.query.jobId && route.query.candidateId) {
        const qJobId = route.query.jobId as string;
        const qCandidateId = route.query.candidateId as string;

          chats.value.unshift(found);
        let found = chats.value.find((c) => c.id === targetId);

        if (!found) {
          const jobDetail = await $fetch<any>(`${config.public.apiUrl}/jobs/${qJobId}`).catch(() => ({}));
          const profile = await $fetch<any>(`${config.public.apiUrl}/profile/${qCandidateId}`).catch(() => ({}));

          found = {
            id: targetId,
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
    }
  };

  const initWebSocket = () => {
    if (status.value !== "authenticated") return;
    const token = (session.value as any)?.idToken || (session.value as any)?.accessToken || "";
    
    connectWebSocket({
      url: `${config.public.wsUrl}?token=${token}`,
      onMessageReceived: (payload) => {
        if (payload.action === "receiveMessage") {
          const {
            jobId,
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
            activeChat.value.jobId === jobId &&
            activeChat.value.candidateId === candidateId
          ) {
            // Deduplicate
            const isDuplicate = messages.value.some((m) => {
              if (m.createdAt && createdAt && m.createdAt === createdAt) return true;
              if (attachmentUrl && m.attachmentUrl === attachmentUrl) return true;
              const incText = (text || "").trim();
              if (incText && (m.text || "").trim() === incText && m.senderId === senderId && !attachmentUrl && !m.attachmentUrl)
                return true;
              return false;
            });
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
            chat.time = formatTime(createdAt);
          }
        }
      }
    });
  };

  // Wrapper around generic file upload logic
  const handleFileUpload = (event: Event) => {
    baseHandleFileUpload(event, userId.value, handleSend);
  };

  // Handle sending message
  const handleSend = async () => {
    if ((!newMessage.value.trim() && !pendingAttachment.value) || !activeChat.value) return;

    const text = newMessage.value;
    const timestamp = new Date().toISOString();
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
      msgPayload.attachmentName = attachment.name;
    }

    // Optimistically push to local UI
    messages.value.push(msgPayload);
    activeChat.value.lastMessage = text || attachment?.name || "Archivo adjunto";
    activeChat.value.time = formatTime(timestamp);

    newMessage.value = "";
    pendingAttachment.value = null;
    await scrollToBottom();

    // Try WS send
    const sent = sendWsMessage({
      action: "sendMessage",
      jobId: activeChat.value.jobId,
      candidateId: activeChat.value.candidateId,
    userRole,
      attachmentUrl: attachment?.url,
      attachmentType: attachment?.type,
      attachmentName: attachment?.name,
    });

    if (!sent) {
      await sendRestHttpFallback(text, attachment);
    }
  };
    handleSend,
    handleFileUpload,
    triggerFileInput,
    isImageUrl,
    openImagePreview,
    formatTime,
  };
};

  onMounted(async () => {
    await fetchConversations();
    initWebSocket();
  });

  return {
