import { useAppFeedback } from "~/composables/useAppFeedback";
import { apiFetch } from "~/composables/useApiClient";
import type { Appeal, AppealMessage, AppealAttachment } from "~/types";

export const useAppeals = () => {
  const { showError, showSuccess, showInfo } = useAppFeedback();
  const config = useRuntimeConfig();
  const { data: session, getSession } = useAuth();

  const userId = computed(() => session.value?.user?.id || "mod-user");
  const searchQuery = ref("");
  const filterType = ref<"ALL" | "ORGANIZACION" | "VACANTE">("ALL");

  const appeals = ref<Appeal[]>([]);
  const selectedAppealId = ref<string | null>(null);
  const isLoading = ref(true);
  const isLoadingMessages = ref(false);
  const isSending = ref(false);
  const isProcessingAction = ref(false);

  const socket = ref<WebSocket | null>(null);
  const wsConnected = ref(false);

  const chatContainer = ref<HTMLDivElement | null>(null);

  const filteredAppeals = computed(() => {
    let result = appeals.value;
    if (filterType.value !== "ALL") {
      result = result.filter((a: any) => a.type === filterType.value);
    }
    const q = searchQuery.value.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (a: any) =>
          (a.name || a.companyName || "").toLowerCase().includes(q) ||
          (a.reason || a.motivo || "").toLowerCase().includes(q),
      );
    }
    return result;
  });

  const activeAppeal = computed<Appeal | null>(() => {
    return appeals.value.find((a) => a.id === selectedAppealId.value) || null;
  });

  const isModeratorSender = (
    msg: AppealMessage | { sender?: string; senderId?: string },
  ) => {
    if (!activeAppeal.value) return true;
    return (
      msg.senderRole === "MODERADOR" ||
      (msg as any).sender === "MODERATOR" ||
      (msg.senderId && msg.senderId !== activeAppeal.value.companyId)
    );
  };

  const orgMessageCount = computed(() => {
    if (!activeAppeal.value || !activeAppeal.value.messages) return 0;
    return activeAppeal.value.messages.filter(
      (m: any) =>
        m.sender === "USER" || m.senderId === activeAppeal.value?.companyId,
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
      const data = await apiFetch<any[]>("/moderator/appeals").catch(() => []);

      const list = Array.isArray(data) ? data : [];
      appeals.value = list.map((item) => ({
        ...item,
        messages: item.messages || [],
      }));

      if (appeals.value.length > 0 && !selectedAppealId.value) {
        await selectAppeal(appeals.value[0]);
      }
    } catch (err) {
      console.error("Error fetching appeals:", err);
      appeals.value = [];
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
              appealId,
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

            const target = appeals.value.find(
              (a) => a.id === (appealId || appealCompanyId),
            );
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
    isLoadingMessages.value = true;

    try {
      const msgs = await apiFetch<any[]>(
        `/moderator/appeals/${compId}/messages`,
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
    } finally {
      isLoadingMessages.value = false;
    }

    scrollToBottom();
  };

  const resolveOrgAppeal = async (actionType: "cancel" | "confirm") => {
    if (!activeAppeal.value || isProcessingAction.value) return;
    isProcessingAction.value = true;
    const compId = activeAppeal.value.id;

    try {
      if (actionType === "cancel") {
        await apiFetch(`/moderator/organizations/${compId}/cancel-suspension`, {
          method: "POST",
          body: { notes: "Apelación aprobada tras revisión en tiempo real" },
        });
        showSuccess(
          "Éxito",
          "Apelación aprobada con éxito. La organización ha sido reactivada.",
        );
      } else {
        await apiFetch(
          `/moderator/organizations/${compId}/confirm-suspension`,
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
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("incident-sync", {
            detail: { compId, actionType },
          }),
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
      await apiFetch(`/moderator/incidents/${activeAppeal.value.id}/resolve`, {
        method: "POST",
        body: { action },
      }).catch(() => {});

      showInfo(
        "Notificación",
        action === "approve"
          ? "Vacante aprobada y reactivada en el Job Board."
          : "Vacante sancionada y cerrada definitivamente.",
      );

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("incident-sync", {
            detail: { appealId: activeAppeal.value?.id, action },
          }),
        );
      }
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
    appealId: string,
    companyId: string,
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
        `${config.public.apiUrl}/moderator/appeals/${appealId}/messages`,
        {
          method: "POST",
          headers,
          body: {
            text: text || "",
            companyId: companyId,
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
    if ((!text && !attachment) || !activeAppeal.value || isSending.value)
      return;

    const appealId = activeAppeal.value.id;
    const companyId = activeAppeal.value.companyId;
    if (!appealId) return;

    isSending.value = true;
    try {
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
              appealId: appealId,
              appealCompanyId: companyId,
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
          await sendHttpFallback(
            appealId,
            companyId,
            text,
            attachment,
            messageId,
          );
        }
      } else {
        await sendHttpFallback(
          appealId,
          companyId,
          text,
          attachment,
          messageId,
        );
      }

      scrollToBottom();
    } finally {
      isSending.value = false;
    }
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
    isLoadingMessages,
    isSending,
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
