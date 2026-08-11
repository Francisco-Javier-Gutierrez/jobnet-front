import { ref, computed, nextTick } from "vue";
import { useAppFeedback } from "~/composables/useAppFeedback";

export const useAppeals = () => {
  const { showError, showSuccess, showInfo } = useAppFeedback();
  const config = useRuntimeConfig();
  const { data: session, getSession } = useAuth();

  const userId = computed(() => (session.value?.user as any)?.id || "mod-user");
  const searchQuery = ref("");
  const filterType = ref<"ALL" | "ORGANIZACION" | "VACANTE">("ALL");

  const appeals = ref<any[]>([]);
  const selectedAppealId = ref<string | null>(null);
  const isLoading = ref(true);
  const isProcessingAction = ref(false);

  const socket = ref<WebSocket | null>(null);
  const wsConnected = ref(false);

  const chatContainer = ref<HTMLDivElement | null>(null);

  const filteredAppeals = computed(() => {
    let result = appeals.value;
    if (filterType.value !== "ALL") {
      result = result.filter((a) => a.type === filterType.value);
    }
    const q = searchQuery.value.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.reason.toLowerCase().includes(q),
      );
    }
    return result;
  });

  const activeAppeal = computed(() => {
    return appeals.value.find((a) => a.id === selectedAppealId.value) || null;
  });

  const isModeratorSender = (msg: any) => {
    if (!activeAppeal.value) return true;
    const compId = activeAppeal.value.id;
    return (
      msg.sender === "MODERATOR" ||
      (msg.senderId && msg.senderId !== activeAppeal.value.companyId)
    );
  };

  const orgMessageCount = computed(() => {
    if (!activeAppeal.value || !activeAppeal.value.messages) return 0;
    return activeAppeal.value.messages.filter(
      (m: any) =>
        m.sender === "USER" || m.senderId === activeAppeal.value.companyId,
    ).length;
  });

  const scrollToBottom = () => {
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    });
  };

  const fetchAppeals = async () => {
    isLoading.value = true;
    try {
      const data = await $fetch<any[]>(
        `${config.public.apiUrl}/moderator/appeals`,
      ).catch(() => []);

      appeals.value = (data || []).map((item) => ({
        ...item,
        messages: item.messages || [],
      }));

      if (appeals.value.length > 0 && !selectedAppealId.value) {
        await selectAppeal(appeals.value[0]);
      }
    } catch (err) {
      console.error("Error fetching appeals:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const connectWebSocket = async () => {
    if (socket.value) {
      socket.value.onclose = null;
      socket.value.close();
      socket.value = null;
    }

    const currentSession = await getSession().catch(() => null);
    const s = currentSession || session.value;
    const token =
      (s as any)?.idToken ||
      (s as any)?.accessToken ||
      (s as any)?.token ||
      (s as any)?.user?.idToken ||
      (s as any)?.user?.token ||
      "";

    if (!token) {
      console.warn("No token found for moderator WebSocket connection.");
      return;
    }

    try {
      const wsUrl = `${config.public.wsUrl}?token=${token}&role=MODERATOR`;
      socket.value = new WebSocket(wsUrl);

      socket.value.onopen = () => {
        wsConnected.value = true;
        console.log("Moderator WebSocket connected successfully.");
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
              attachmentType,
              attachmentName,
              createdAt,
              messageId: incomingMsgId,
            } = payload;

            const messageId = incomingMsgId;

            const target = appeals.value.find((a) => a.id === appealCompanyId);
            if (target) {
              const compId = target.id;
              const timeStr = new Date(
                createdAt || Date.now(),
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              const isDuplicate = target.messages.some((m: any) => {
                if (messageId && m.messageId && m.messageId === messageId)
                  return true;
                if (m.createdAt && createdAt && m.createdAt === createdAt)
                  return true;
                return false;
              });

              if (!isDuplicate) {
                target.messages.push({
                  id: `m-ws-${Date.now()}`,
                  messageId: messageId || null,
                  senderId,
                  sender: senderId === target.companyId ? "USER" : "MODERATOR",
                  text: text || "",
                  attachmentUrl: attachmentUrl || null,
                  attachmentType: attachmentType || null,
                  attachmentName: attachmentName || null,
                  createdAt: createdAt || new Date().toISOString(),
                  time: timeStr,
                });
                scrollToBottom();
              }
            }
          } else if (payload.action === "appealResolved") {
            const { appealCompanyId } = payload;
            appeals.value = appeals.value.filter(
              (a) => a.id !== appealCompanyId,
            );
            if (
              selectedAppealId.value === appealCompanyId ||
              (activeAppeal.value && activeAppeal.value.id === appealCompanyId)
            ) {
              selectedAppealId.value = null;
            }
          }
        } catch (e) {
          console.error("Error handling appeal WS message:", e);
        }
      };

      socket.value.onclose = () => {
        wsConnected.value = false;
        console.log(
          "Moderator WebSocket closed. Attempting reconnect in 3s...",
        );
        setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };
    } catch (err) {
      console.warn("WebSocket error:", err);
    }
  };

  const selectAppeal = async (appeal: any) => {
    selectedAppealId.value = appeal.id;
    const compId = appeal.id;

    try {
      const msgs = await $fetch<any[]>(
        `${config.public.apiUrl}/moderator/organizations/${compId}/appeal-messages`,
      ).catch(() => []);

      appeal.messages = (msgs || []).map((m) => ({
        id: `m-${m.createdAt}`,
        senderId: m.senderId,
        sender: m.senderId === appeal.companyId ? "USER" : "MODERATOR",
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
    } catch (e) {
      console.error("Error loading appeal messages:", e);
    }

    scrollToBottom();
  };

  const processAppealAction = async (actionType: "cancel" | "confirm") => {
    if (!activeAppeal.value || isProcessingAction.value) return;
    isProcessingAction.value = true;
    const compId = activeAppeal.value.id;

    try {
      if (actionType === "cancel") {
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
      appeals.value = appeals.value.filter(
        (a) => a.id !== activeAppeal.value?.id,
      );
      selectedAppealId.value = appeals.value[0]?.id || null;
    } catch (e) {
      console.error("Error resolving organization appeal:", e);
      showError("Error", "Hubo un error al procesar el dictamen.");
    } finally {
      isProcessingAction.value = false;
    }
  };

  const resolveVacancyAppeal = async (action: "approve" | "block") => {
    if (!activeAppeal.value || isProcessingAction.value) return;
    isProcessingAction.value = true;

    try {
      await $fetch(
        `${config.public.apiUrl}/moderator/incidents/${activeAppeal.value.id}/resolve`,
        {
          method: "POST",
          body: { action },
        },
      ).catch(() => {});

      showInfo(
        "Notificación",
        action === "approve"
          ? "Vacante aprobada y reactivada en el Job Board."
          : "Vacante sancionada y cerrada definitivamente.",
      );

      appeals.value = appeals.value.filter(
        (a) => a.id !== activeAppeal.value?.id,
      );
      selectedAppealId.value = appeals.value[0]?.id || null;
    } catch (e) {
      console.error("Error resolving vacancy appeal:", e);
      showError(
        "Error",
        "Hubo un error al procesar la resolución de la vacante.",
      );
    } finally {
      isProcessingAction.value = false;
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
            attachmentType: attachment?.type || undefined,
            attachmentName: attachment?.name || undefined,
          },
        },
      );
    } catch (e) {
      console.warn("HTTP appeal message post notice:", e);
    }
  };

  const sendMessage = async (
    newMessageText: string,
    pendingAttachment: any,
  ) => {
    const text = newMessageText.trim();
    const attachment = pendingAttachment;
    if ((!text && !attachment) || !activeAppeal.value) return;

    const compId = activeAppeal.value.id;
    if (!compId) return;

    const now = new Date().toISOString();
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const messageId = crypto.randomUUID();

    activeAppeal.value.messages.push({
      id: `m-mod-${Date.now()}`,
      messageId,
      senderId: userId.value,
      sender: "MODERATOR",
      text,
      attachmentUrl: attachment?.url || null,
      attachmentType: attachment?.type || null,
      attachmentName: attachment?.name || null,
      createdAt: now,
      time: timeStr,
    });

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

    scrollToBottom();
  };

  const closeWebSocket = () => {
    if (socket.value) {
      socket.value.close();
    }
  };

  return {
    searchQuery,
    filterType,
    appeals,
    selectedAppealId,
    isLoading,
    isProcessingAction,
    wsConnected,
    filteredAppeals,
    activeAppeal,
    orgMessageCount,
    chatContainer,
    fetchAppeals,
    connectWebSocket,
    closeWebSocket,
    selectAppeal,
    resolveOrgAppeal,
    resolveVacancyAppeal,
    sendMessage,
    isModeratorSender,
  };
};
