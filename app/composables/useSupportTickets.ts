import { ref, computed } from "vue";
import { useAuth, useRuntimeConfig } from "#imports";
import { apiFetch } from "~/composables/useApiClient";
import { useAppFeedback } from "~/composables/useAppFeedback";
import { WebSocketClient, type WebSocketStatus } from "~/utils/wsClient";
import type {
  SupportTicket,
  SupportTicketMessage,
  CreateTicketDTO,
  TicketAttachment,
} from "~/types/support";

export function useSupportTickets() {
  const { data: session } = useAuth();
  const { showSuccess, showError, showInfo } = useAppFeedback();
  const config = useRuntimeConfig();

  const tickets = ref<SupportTicket[]>([]);
  const activeTicket = ref<SupportTicket | null>(null);
  const messages = ref<SupportTicketMessage[]>([]);

  const isLoadingTickets = ref(false);
  const isLoadingMessages = ref(false);
  const isSending = ref(false);
  const isProcessingAction = ref(false);
  const isCreatingTicket = ref(false);

  // Real-time WebSocket connection state
  const wsStatus = ref<WebSocketStatus>("disconnected");
  const wsConnected = computed(() => wsStatus.value === "connected");
  let wsClient: WebSocketClient | null = null;

  const userId = computed(() => {
    const s = session.value as any;
    return s?.user?.id || s?.user?.uuid || s?.user?.sub || "";
  });

  const userName = computed(() => {
    const s = session.value as any;
    return s?.user?.name || s?.user?.nombre || s?.user?.email?.split("@")[0] || "Usuario";
  });

  const userRole = computed(() => {
    const s = session.value as any;
    const r = (s?.user?.tipoUsuario || s?.user?.role || "").toUpperCase();
    return r === "MODERATOR" ? "MODERADOR" : r;
  });

  const isModerator = computed(() => {
    return userRole.value === "MODERADOR" || userRole.value === "ADMIN";
  });

  const isAssignedToMe = computed(() => {
    if (!activeTicket.value || !activeTicket.value.assignedModeratorId) return false;
    return activeTicket.value.assignedModeratorId === userId.value;
  });

  const isAssignedToOther = computed(() => {
    if (!activeTicket.value || !activeTicket.value.assignedModeratorId) return false;
    return activeTicket.value.assignedModeratorId !== userId.value;
  });

  const assignedModeratorName = computed(() => {
    return activeTicket.value?.assignedModeratorName || null;
  });

  /**
   * Fetch tickets created by the active user (Candidato / Organización)
   */
  const fetchMyTickets = async (silent = false) => {
    if (!silent) isLoadingTickets.value = true;
    try {
      const res = await apiFetch<any>("/support/my-tickets");
      const list = Array.isArray(res) ? res : res?.tickets || [];
      tickets.value = list;
      return list;
    } catch (err: any) {
      console.error("Error al obtener tickets de soporte:", err);
      showError(err?.data?.error || "Error al cargar tus reportes de soporte.");
      return [];
    } finally {
      if (!silent) isLoadingTickets.value = false;
    }
  };

  /**
   * Fetch all tickets for moderators and admins
   */
  const fetchAllTickets = async (statusFilter?: string, silent = false) => {
    if (!silent) isLoadingTickets.value = true;
    try {
      const query =
        statusFilter && statusFilter !== "ALL" && statusFilter !== "MINE"
          ? `?status=${encodeURIComponent(statusFilter)}`
          : "";
      const res = await apiFetch<any>(`/support/tickets${query}`);
      const list = Array.isArray(res) ? res : res?.tickets || [];
      tickets.value = list;
      return list;
    } catch (err: any) {
      console.error("Error al obtener cola de tickets:", err);
      showError(err?.data?.error || "Error al cargar la cola de moderación de tickets.");
      return [];
    } finally {
      if (!silent) isLoadingTickets.value = false;
    }
  };

  /**
   * Fetch conversation history for a specific ticket
   */
  const fetchTicketMessages = async (ticketId: string, silent = false) => {
    if (!silent) isLoadingMessages.value = true;
    try {
      const res = await apiFetch<any>(`/support/tickets/${ticketId}/messages`);
      const rawMsgs = res?.messages || (Array.isArray(res) ? res : []);
      const msgs = rawMsgs.map((m: any) => ({
        ...m,
        text: m.text || m.message || "",
        message: m.message || m.text || "",
      }));
      messages.value = msgs;
      if (res?.ticket) {
        // Sync active ticket with latest metadata (assignment, status)
        activeTicket.value = res.ticket;
        const idx = tickets.value.findIndex((t) => (t.id || t.ticketId) === ticketId);
        if (idx !== -1) {
          tickets.value[idx] = { ...tickets.value[idx], ...res.ticket };
        }
      }
      return messages.value;
    } catch (err: any) {
      console.error("Error al cargar mensajes del ticket:", err);
      showError(err?.data?.error || "No se pudieron cargar los mensajes del ticket.");
      return [];
    } finally {
      if (!silent) isLoadingMessages.value = false;
    }
  };

  /**
   * Select a ticket and load its thread
   */
  const selectTicket = async (ticket: SupportTicket, silent = false) => {
    activeTicket.value = ticket;
    const ticketId = ticket.id || ticket.ticketId;
    await fetchTicketMessages(ticketId, silent);
  };

  /**
   * Create a new support ticket / problem report
   */
  const createTicket = async (payload: CreateTicketDTO): Promise<SupportTicket | null> => {
    isCreatingTicket.value = true;
    try {
      const res = await apiFetch<{ ticket: SupportTicket }>("/support/tickets", {
        method: "POST",
        body: {
          ...payload,
          userName: userName.value,
        },
      });

      if (res?.ticket) {
        tickets.value.unshift(res.ticket);
        activeTicket.value = res.ticket;
        const ticketId = res.ticket.id || res.ticket.ticketId;
        await fetchTicketMessages(ticketId, true);
        showSuccess("Reporte de problema enviado. Un moderador atenderá tu caso pronto.");
        return res.ticket;
      }
      return null;
    } catch (err: any) {
      console.error("Error al crear reporte de soporte:", err);
      showError(err?.data?.error || "Error al enviar el reporte de problema.");
      return null;
    } finally {
      isCreatingTicket.value = false;
    }
  };

  /**
   * Send a message in the active ticket thread
   */
  const sendMessage = async (
    ticketId: string,
    text: string,
    attachments?: TicketAttachment[],
  ): Promise<boolean> => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return false;

    // Concurrency check for moderators
    if (isModerator.value && isAssignedToOther.value) {
      showError(
        `Este caso está asignado a ${assignedModeratorName.value || "otro moderador"}. No puedes responder concurrentemente.`,
      );
      return false;
    }

    isSending.value = true;
    try {
      const res = await apiFetch<{
        message?: SupportTicketMessage | string;
        msg?: SupportTicketMessage;
        assignedModeratorId?: string;
        assignedModeratorName?: string;
      }>(`/support/tickets/${ticketId}/messages`, {
        method: "POST",
        body: {
          text: text.trim(),
          message: text.trim(),
          attachments,
          senderName: userName.value,
        },
      });

      const sentMsg =
        res?.msg || (typeof res?.message === "object" ? res.message : null);

      if (sentMsg) {
        const normalizedMsg: SupportTicketMessage = {
          ...sentMsg,
          text: sentMsg.text || (sentMsg as any).message || text.trim(),
          message: (sentMsg as any).message || sentMsg.text || text.trim(),
        } as SupportTicketMessage;

        const isDuplicate = messages.value.some(
          (m) =>
            (m.messageId && normalizedMsg.messageId && m.messageId === normalizedMsg.messageId) ||
            (m.createdAt && normalizedMsg.createdAt && m.createdAt === normalizedMsg.createdAt && m.senderId === normalizedMsg.senderId) ||
            (m.senderId && normalizedMsg.senderId && m.senderId === normalizedMsg.senderId && (m.message || m.text) === (normalizedMsg.message || normalizedMsg.text) && Math.abs(new Date(m.createdAt || 0).getTime() - new Date(normalizedMsg.createdAt || 0).getTime()) < 3000)
        );
        if (!isDuplicate) {
          messages.value = [...messages.value, normalizedMsg];
        }

        // Update activeTicket auto-assignment if newly assigned
        if (activeTicket.value) {
          activeTicket.value.lastMessage = text.trim();
          activeTicket.value.lastMessageAt = normalizedMsg.createdAt || new Date().toISOString();
          if (res.assignedModeratorId) {
            activeTicket.value.assignedModeratorId = res.assignedModeratorId;
            activeTicket.value.assignedModeratorName = res.assignedModeratorName;
            activeTicket.value.status = "EN_PROCESO";
          }
        }

        // Update in list
        const idx = tickets.value.findIndex((t) => (t.id || t.ticketId) === ticketId);
        if (idx !== -1 && activeTicket.value) {
          tickets.value[idx] = { ...tickets.value[idx], ...activeTicket.value };
        }
      }
      return true;
    } catch (err: any) {
      console.error("Error al enviar mensaje:", err);
      showError(err?.data?.error || "No se pudo enviar el mensaje.");
      return false;
    } finally {
      isSending.value = false;
    }
  };

  /**
   * Claim or release a ticket (moderator exclusive)
   */
  const claimTicket = async (ticketId: string, action: "CLAIM" | "RELEASE"): Promise<boolean> => {
    isProcessingAction.value = true;
    try {
      const res = await apiFetch<{
        ticketId: string;
        assignedModeratorId: string | null;
        assignedModeratorName: string | null;
        status: string;
      }>(`/support/tickets/${ticketId}/claim`, {
        method: "POST",
        body: { action, moderatorName: userName.value },
      });

      if (activeTicket.value && (activeTicket.value.id === ticketId || activeTicket.value.ticketId === ticketId)) {
        activeTicket.value.assignedModeratorId = res.assignedModeratorId;
        activeTicket.value.assignedModeratorName = res.assignedModeratorName;
        activeTicket.value.status = res.status as any;
      }

      const idx = tickets.value.findIndex((t) => (t.id || t.ticketId) === ticketId);
      if (idx !== -1 && activeTicket.value) {
        tickets.value[idx] = { ...tickets.value[idx], ...activeTicket.value };
      }

      showSuccess(
        action === "CLAIM"
          ? "Has tomado el caso. Ahora está asignado exclusivamente a ti."
          : "Caso liberado a la cola general de moderadores.",
      );
      return true;
    } catch (err: any) {
      console.error("Error al gestionar asignación del ticket:", err);
      showError(err?.data?.error || "Error al modificar la asignación del ticket.");
      return false;
    } finally {
      isProcessingAction.value = false;
    }
  };

  /**
   * Resolve and close a ticket
   */
  const resolveTicket = async (ticketId: string, resolutionNotes?: string): Promise<boolean> => {
    isProcessingAction.value = true;
    try {
      const notes = resolutionNotes || "Caso resuelto satisfactoriamente.";
      const res = await apiFetch<{
        ticketId: string;
        status: string;
        resolutionNotes: string;
        resolutionMessage?: SupportTicketMessage;
      }>(`/support/tickets/${ticketId}/resolve`, {
        method: "POST",
        body: { resolutionNotes: notes, notes },
      });

      if (activeTicket.value && (activeTicket.value.id === ticketId || activeTicket.value.ticketId === ticketId)) {
        activeTicket.value.status = "RESUELTO";
        activeTicket.value.resolutionNotes = res.resolutionNotes || notes;
        activeTicket.value.lastMessage = `[Caso Resuelto]: ${notes}`;
      }

      if (res?.resolutionMessage) {
        messages.value = [
          ...messages.value,
          {
            ...res.resolutionMessage,
            text: res.resolutionMessage.text || res.resolutionMessage.message || `[Caso Resuelto]: ${notes}`,
            message: res.resolutionMessage.message || res.resolutionMessage.text || `[Caso Resuelto]: ${notes}`,
          },
        ];
      }

      const idx = tickets.value.findIndex((t) => (t.id || t.ticketId) === ticketId);
      if (idx !== -1 && activeTicket.value) {
        tickets.value[idx] = { ...tickets.value[idx], ...activeTicket.value };
      }

      showSuccess("Ticket marcado como resuelto.");
      return true;
    } catch (err: any) {
      console.error("Error al resolver ticket:", err);
      showError(err?.data?.error || "Error al resolver el ticket.");
      return false;
    } finally {
      isProcessingAction.value = false;
    }
  };

  /**
   * Real-time WebSocket dispatch handler
   */
  const handleWsMessage = (payload: any) => {
    if (!payload || typeof payload !== "object") return;

    const action = payload.action || payload.type;

    // 1. New Message received in a Ticket thread
    if (action === "receiveSupportMessage" || action === "SUPPORT_TICKET_MESSAGE") {
      const ticketId = payload.ticketId || payload.message?.ticketId;
      const rawMsg = payload.message;
      if (!ticketId || !rawMsg) return;

      const incomingMsg: SupportTicketMessage = {
        ...rawMsg,
        text: rawMsg.text || rawMsg.message || "",
        message: rawMsg.message || rawMsg.text || "",
      };

      // If this ticket is currently active, push message if not duplicate
      const currentActiveId = activeTicket.value?.id || activeTicket.value?.ticketId;
      if (currentActiveId === ticketId) {
        const isDuplicate = messages.value.some(
          (m) =>
            (m.messageId && incomingMsg.messageId && m.messageId === incomingMsg.messageId) ||
            (m.createdAt && incomingMsg.createdAt && m.createdAt === incomingMsg.createdAt && m.senderId === incomingMsg.senderId) ||
            (m.senderId && incomingMsg.senderId && m.senderId === incomingMsg.senderId && (m.message || m.text) === (incomingMsg.message || incomingMsg.text) && Math.abs(new Date(m.createdAt || 0).getTime() - new Date(incomingMsg.createdAt || 0).getTime()) < 3000)
        );
        if (!isDuplicate) {
          messages.value = [...messages.value, incomingMsg];
        }

        // Update activeTicket metadata in real time
        activeTicket.value.lastMessage = incomingMsg.text || "Archivo adjunto";
        activeTicket.value.lastMessageAt = incomingMsg.createdAt || new Date().toISOString();
        if (payload.assignedModeratorId) {
          activeTicket.value.assignedModeratorId = payload.assignedModeratorId;
          activeTicket.value.assignedModeratorName = payload.assignedModeratorName;
        }
        if (payload.status) {
          activeTicket.value.status = payload.status;
        }
      }

      // Update metadata in the tickets list and move to top
      const idx = tickets.value.findIndex((t) => (t.id || t.ticketId) === ticketId);
      if (idx !== -1) {
        const updatedTicket = {
          ...tickets.value[idx],
          lastMessage: incomingMsg.text || "Archivo adjunto",
          lastMessageAt: incomingMsg.createdAt || new Date().toISOString(),
          assignedModeratorId: payload.assignedModeratorId || tickets.value[idx].assignedModeratorId,
          assignedModeratorName: payload.assignedModeratorName || tickets.value[idx].assignedModeratorName,
          status: payload.status || tickets.value[idx].status,
        };
        tickets.value = [
          updatedTicket,
          ...tickets.value.filter((t) => (t.id || t.ticketId) !== ticketId),
        ];
      } else if (isModerator.value) {
        // Moderator received an update for a ticket not yet in local queue
        fetchAllTickets(undefined, true);
      }
    }

    // 2. New Ticket Created
    if (action === "receiveSupportTicketCreated" || action === "SUPPORT_TICKET_CREATED") {
      const newTicket = payload.ticket;
      if (!newTicket) return;
      const tId = newTicket.id || newTicket.ticketId;
      const exists = tickets.value.some((t) => (t.id || t.ticketId) === tId);
      if (!exists) {
        tickets.value = [newTicket, ...tickets.value];
      }
    }

    // 3. Ticket Claimed or Released
    if (action === "receiveSupportTicketClaimed" || action === "SUPPORT_TICKET_CLAIMED") {
      const ticketId = payload.ticketId;
      if (!ticketId) return;

      const currentActiveId = activeTicket.value?.id || activeTicket.value?.ticketId;
      if (currentActiveId === ticketId && activeTicket.value) {
        activeTicket.value.assignedModeratorId = payload.assignedModeratorId;
        activeTicket.value.assignedModeratorName = payload.assignedModeratorName;
        activeTicket.value.status = payload.status;
      }

      const idx = tickets.value.findIndex((t) => (t.id || t.ticketId) === ticketId);
      if (idx !== -1) {
        tickets.value = tickets.value.map((t) =>
          (t.id || t.ticketId) === ticketId
            ? {
                ...t,
                assignedModeratorId: payload.assignedModeratorId,
                assignedModeratorName: payload.assignedModeratorName,
                status: payload.status,
              }
            : t
        );
      }
    }

    // 4. Ticket Resolved
    if (action === "receiveSupportTicketResolved" || action === "SUPPORT_TICKET_RESOLVED") {
      const ticketId = payload.ticketId;
      if (!ticketId) return;

      const currentActiveId = activeTicket.value?.id || activeTicket.value?.ticketId;
      if (currentActiveId === ticketId && activeTicket.value) {
        activeTicket.value.status = "RESUELTO";
        activeTicket.value.resolutionNotes = payload.resolutionNotes;
        if (payload.resolutionMessage) {
          const resMsg = {
            ...payload.resolutionMessage,
            text: payload.resolutionMessage.text || payload.resolutionMessage.message || `[Caso Resuelto]: ${payload.resolutionNotes}`,
            message: payload.resolutionMessage.message || payload.resolutionMessage.text || `[Caso Resuelto]: ${payload.resolutionNotes}`,
          };
          const isDup = messages.value.some((m) => m.messageId === resMsg.messageId);
          if (!isDup) {
            messages.value = [...messages.value, resMsg];
          }
        }
      }

      const idx = tickets.value.findIndex((t) => (t.id || t.ticketId) === ticketId);
      if (idx !== -1) {
        tickets.value = tickets.value.map((t) =>
          (t.id || t.ticketId) === ticketId
            ? {
                ...t,
                status: "RESUELTO",
                resolutionNotes: payload.resolutionNotes,
                lastMessage: `[Caso Resuelto]: ${payload.resolutionNotes || "Problema atendido."}`,
              }
            : t
        );
      }
    }
  };

  /**
   * Connect to WebSocket for real-time ticket messaging and concurrency updates
   */
  const connectWebSocket = () => {
    if (typeof window === "undefined") return;
    const s = session.value as any;
    const token = s?.idToken || s?.accessToken || "";
    if (!token) {
      console.warn("No token available for support WebSocket connection.");
      return;
    }

    if (wsClient) {
      wsClient.disconnect();
      wsClient = null;
    }

    const roleParam = isModerator.value ? "&role=MODERATOR" : "";
    const wsUrl = `${config.public.wsUrl}?token=${token}${roleParam}`;

    wsClient = new WebSocketClient({
      url: wsUrl,
      reconnect: true,
      maxReconnectAttempts: 15,
      baseReconnectDelay: 2000,
      onMessage: handleWsMessage,
      onStatusChange: (status) => {
        wsStatus.value = status;
      },
    });

    wsClient.connect();
  };

  /**
   * Disconnect from WebSocket
   */
  const closeWebSocket = () => {
    if (wsClient) {
      wsClient.disconnect();
      wsClient = null;
    }
    wsStatus.value = "disconnected";
  };

  return {
    tickets,
    activeTicket,
    messages,
    isLoadingTickets,
    isLoadingMessages,
    isSending,
    isProcessingAction,
    isCreatingTicket,
    userId,
    userName,
    userRole,
    isModerator,
    isAssignedToMe,
    isAssignedToOther,
    assignedModeratorName,
    wsStatus,
    wsConnected,
    connectWebSocket,
    closeWebSocket,
    handleWsMessage,
    fetchMyTickets,
    fetchAllTickets,
    fetchTicketMessages,
    selectTicket,
    createTicket,
    sendMessage,
    claimTicket,
    resolveTicket,
  };
}
