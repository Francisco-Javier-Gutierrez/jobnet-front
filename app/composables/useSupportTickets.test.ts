import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock nuxt / vue imports
vi.mock("#imports", () => ({
  useAuth: vi.fn(() => ({
    data: {
      value: {
        user: {
          id: "mod-test-1",
          name: "Moderador Test",
          email: "mod@jobnet.com",
          tipoUsuario: "MODERADOR",
        },
      },
    },
  })),
  useRuntimeConfig: vi.fn(() => ({
    public: {
      wsUrl: "wss://v9b53l2zr2.execute-api.us-east-1.amazonaws.com/prod",
    },
  })),
}));

vi.mock("~/composables/useApiClient", () => ({
  apiFetch: vi.fn(),
}));

vi.mock("~/composables/useAppFeedback", () => ({
  useAppFeedback: vi.fn(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
  })),
}));

import { useSupportTickets } from "./useSupportTickets";
import { apiFetch } from "~/composables/useApiClient";

describe("useSupportTickets Composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Moderator Identification and Role Computation", () => {
    it("should identify MODERADOR correctly", () => {
      const { userRole, isModerator, userId, userName } = useSupportTickets();
      expect(userRole.value).toBe("MODERADOR");
      expect(isModerator.value).toBe(true);
      expect(userId.value).toBe("mod-test-1");
      expect(userName.value).toBe("Moderador Test");
    });
  });

  describe("Concurrency & Exclusive Auto-Assignment", () => {
    it("should detect when ticket is unassigned", () => {
      const { activeTicket, isAssignedToMe, isAssignedToOther } =
        useSupportTickets();
      activeTicket.value = {
        id: "t-1",
        ticketId: "t-1",
        userId: "cand-1",
        userEmail: "cand@test.com",
        userName: "Candidato",
        userRole: "CANDIDATO",
        subject: "Fallo al subir CV",
        category: "FALLO_TECNICO",
        description: "No carga el archivo",
        status: "ABIERTO",
        assignedModeratorId: null,
        assignedModeratorName: null,
        createdAt: "2026-11-14T10:00:00Z",
        updatedAt: "2026-11-14T10:00:00Z",
      };

      expect(isAssignedToMe.value).toBe(false);
      expect(isAssignedToOther.value).toBe(false);
    });

    it("should detect when ticket is assigned to current moderator", () => {
      const { activeTicket, isAssignedToMe, isAssignedToOther } =
        useSupportTickets();
      activeTicket.value = {
        id: "t-2",
        ticketId: "t-2",
        userId: "cand-1",
        userEmail: "cand@test.com",
        userName: "Candidato",
        userRole: "CANDIDATO",
        subject: "Fallo al subir CV",
        category: "FALLO_TECNICO",
        description: "No carga el archivo",
        status: "EN_PROCESO",
        assignedModeratorId: "mod-test-1",
        assignedModeratorName: "Moderador Test",
        createdAt: "2026-11-14T10:00:00Z",
        updatedAt: "2026-11-14T10:00:00Z",
      };

      expect(isAssignedToMe.value).toBe(true);
      expect(isAssignedToOther.value).toBe(false);
    });

    it("should detect when ticket is assigned to another moderator (collision guard)", () => {
      const {
        activeTicket,
        isAssignedToMe,
        isAssignedToOther,
        assignedModeratorName,
      } = useSupportTickets();
      activeTicket.value = {
        id: "t-3",
        ticketId: "t-3",
        userId: "cand-1",
        userEmail: "cand@test.com",
        userName: "Candidato",
        userRole: "CANDIDATO",
        subject: "Duda de pago",
        category: "DUDA_GENERAL",
        description: "Pregunta sobre planes",
        status: "EN_PROCESO",
        assignedModeratorId: "mod-other-99",
        assignedModeratorName: "Otro Moderador",
        createdAt: "2026-11-14T10:00:00Z",
        updatedAt: "2026-11-14T10:00:00Z",
      };

      expect(isAssignedToMe.value).toBe(false);
      expect(isAssignedToOther.value).toBe(true);
      expect(assignedModeratorName.value).toBe("Otro Moderador");
    });

    it("should prevent sending message when assigned to another moderator", async () => {
      const { activeTicket, sendMessage } = useSupportTickets();
      activeTicket.value = {
        id: "t-4",
        ticketId: "t-4",
        userId: "cand-1",
        userEmail: "cand@test.com",
        userName: "Candidato",
        userRole: "CANDIDATO",
        subject: "Duda",
        category: "DUDA_GENERAL",
        description: "Pregunta",
        status: "EN_PROCESO",
        assignedModeratorId: "mod-rival-88",
        assignedModeratorName: "Moderador Rival",
        createdAt: "2026-11-14T10:00:00Z",
        updatedAt: "2026-11-14T10:00:00Z",
      };

      const result = await sendMessage("t-4", "Hola, te ayudo");
      expect(result).toBe(false);
      expect(apiFetch).not.toHaveBeenCalled();
    });
  });

  describe("API Integration and Actions", () => {
    it("should fetch tickets queue and set tickets state", async () => {
      const mockTickets = [
        {
          id: "t-10",
          ticketId: "t-10",
          subject: "Error de inicio de sesión",
          status: "ABIERTO",
        },
      ];
      vi.mocked(apiFetch).mockResolvedValueOnce({ tickets: mockTickets });

      const { fetchAllTickets, tickets } = useSupportTickets();
      const res = await fetchAllTickets();

      expect(apiFetch).toHaveBeenCalledWith("/support/tickets");
      expect(res).toEqual(mockTickets);
      expect(tickets.value).toEqual(mockTickets);
    });

    it("should claim a ticket and update active ticket", async () => {
      const mockClaimRes = {
        ticketId: "t-10",
        assignedModeratorId: "mod-test-1",
        assignedModeratorName: "Moderador Test",
        status: "EN_PROCESO",
      };
      vi.mocked(apiFetch).mockResolvedValueOnce(mockClaimRes);

      const { claimTicket, activeTicket } = useSupportTickets();
      activeTicket.value = {
        id: "t-10",
        ticketId: "t-10",
        status: "ABIERTO",
      } as any;

      const success = await claimTicket("t-10", "CLAIM");
      expect(success).toBe(true);
      expect(apiFetch).toHaveBeenCalledWith("/support/tickets/t-10/claim", {
        method: "POST",
        body: { action: "CLAIM", moderatorName: "Moderador Test" },
      });
      expect(activeTicket.value?.assignedModeratorId).toBe("mod-test-1");
      expect(activeTicket.value?.status).toBe("EN_PROCESO");
    });

    it("should resolve a ticket and update status to RESUELTO", async () => {
      const mockResolveRes = {
        ticketId: "t-10",
        status: "RESUELTO",
        resolutionNotes: "Solucionado tras orientar al usuario.",
      };
      vi.mocked(apiFetch).mockResolvedValueOnce(mockResolveRes);

      const { resolveTicket, activeTicket } = useSupportTickets();
      activeTicket.value = {
        id: "t-10",
        ticketId: "t-10",
        status: "EN_PROCESO",
      } as any;

      const success = await resolveTicket(
        "t-10",
        "Solucionado tras orientar al usuario.",
      );
      expect(success).toBe(true);
      expect(apiFetch).toHaveBeenCalledWith("/support/tickets/t-10/resolve", {
        method: "POST",
        body: {
          resolutionNotes: "Solucionado tras orientar al usuario.",
          notes: "Solucionado tras orientar al usuario.",
        },
      });
      expect(activeTicket.value?.status).toBe("RESUELTO");
      expect(activeTicket.value?.resolutionNotes).toBe(
        "Solucionado tras orientar al usuario.",
      );
    });

    it("should send a message with both text and message in payload and append to messages", async () => {
      const mockMsg = {
        messageId: "msg-123",
        ticketId: "t-10",
        senderId: "mod-test-1",
        senderRole: "MODERADOR",
        senderName: "Moderador Test",
        text: "Respuesta de soporte",
        message: "Respuesta de soporte",
        createdAt: "2026-11-14T20:00:00.000Z",
      };
      vi.mocked(apiFetch).mockResolvedValueOnce({ msg: mockMsg });

      const { sendMessage, messages, activeTicket } = useSupportTickets();
      activeTicket.value = {
        id: "t-10",
        ticketId: "t-10",
        assignedModeratorId: "mod-test-1",
        status: "EN_PROCESO",
      } as any;

      const success = await sendMessage("t-10", "Respuesta de soporte");
      expect(success).toBe(true);
      expect(apiFetch).toHaveBeenCalledWith("/support/tickets/t-10/messages", {
        method: "POST",
        body: {
          text: "Respuesta de soporte",
          message: "Respuesta de soporte",
          attachments: undefined,
          senderName: "Moderador Test",
        },
      });
      expect(messages.value).toHaveLength(1);
      expect(messages.value[0].text).toBe("Respuesta de soporte");
      expect(messages.value[0].message).toBe("Respuesta de soporte");
    });
  });

  describe("Real-time WebSocket Handling", () => {
    it("should process incoming SUPPORT_TICKET_MESSAGE and append to activeTicket without duplicates", () => {
      const { handleWsMessage, messages, activeTicket, tickets } =
        useSupportTickets();
      activeTicket.value = {
        id: "ticket-ws-1",
        ticketId: "ticket-ws-1",
        subject: "Problema con inicio de sesión",
        status: "ABIERTO",
      } as any;

      tickets.value = [
        {
          id: "ticket-ws-1",
          ticketId: "ticket-ws-1",
          subject: "Problema con inicio de sesión",
          status: "ABIERTO",
        } as any,
      ];

      const incomingPayload = {
        type: "SUPPORT_TICKET_MESSAGE",
        ticketId: "ticket-ws-1",
        message: {
          messageId: "msg-rt-1",
          ticketId: "ticket-ws-1",
          senderId: "user-cand-1",
          senderName: "Candidato",
          text: "Hola, sigo con el problema",
          createdAt: "2026-11-14T21:00:00.000Z",
        },
      };

      handleWsMessage(incomingPayload);
      expect(messages.value).toHaveLength(1);
      expect(messages.value[0].text).toBe("Hola, sigo con el problema");
      expect(activeTicket.value.lastMessage).toBe("Hola, sigo con el problema");

      // Idempotency: Duplicate message should not be appended twice
      handleWsMessage(incomingPayload);
      expect(messages.value).toHaveLength(1);
    });

    it("should prepend new ticket when SUPPORT_TICKET_CREATED arrives", () => {
      const { handleWsMessage, tickets } = useSupportTickets();
      tickets.value = [];

      handleWsMessage({
        type: "SUPPORT_TICKET_CREATED",
        ticket: {
          id: "ticket-new-1",
          ticketId: "ticket-new-1",
          subject: "Fallo técnico urgente",
          status: "ABIERTO",
        },
      });

      expect(tickets.value).toHaveLength(1);
      expect(tickets.value[0].subject).toBe("Fallo técnico urgente");
    });

    it("should update assignment when SUPPORT_TICKET_CLAIMED arrives", () => {
      const { handleWsMessage, activeTicket, tickets } = useSupportTickets();
      activeTicket.value = {
        id: "ticket-claim-1",
        ticketId: "ticket-claim-1",
        status: "ABIERTO",
      } as any;
      tickets.value = [activeTicket.value];

      handleWsMessage({
        type: "SUPPORT_TICKET_CLAIMED",
        ticketId: "ticket-claim-1",
        assignedModeratorId: "mod-456",
        assignedModeratorName: "Mod Maria",
        status: "EN_ATENCION",
      });

      expect(activeTicket.value.assignedModeratorId).toBe("mod-456");
      expect(activeTicket.value.assignedModeratorName).toBe("Mod Maria");
      expect(activeTicket.value.status).toBe("EN_ATENCION");
    });

    it("should update status and append resolution message when SUPPORT_TICKET_RESOLVED arrives", () => {
      const { handleWsMessage, activeTicket, messages, tickets } =
        useSupportTickets();
      activeTicket.value = {
        id: "ticket-res-1",
        ticketId: "ticket-res-1",
        status: "EN_ATENCION",
      } as any;
      tickets.value = [activeTicket.value];

      handleWsMessage({
        type: "SUPPORT_TICKET_RESOLVED",
        ticketId: "ticket-res-1",
        status: "RESUELTO",
        resolutionNotes: "Contraseña reseteada.",
        resolutionMessage: {
          messageId: "res-msg-1",
          ticketId: "ticket-res-1",
          senderId: "mod-test-1",
          text: "[Caso Resuelto]: Contraseña reseteada.",
          createdAt: "2026-11-14T21:30:00.000Z",
        },
      });

      expect(activeTicket.value.status).toBe("RESUELTO");
      expect(activeTicket.value.resolutionNotes).toBe("Contraseña reseteada.");
      expect(messages.value).toHaveLength(1);
      expect(messages.value[0].text).toBe(
        "[Caso Resuelto]: Contraseña reseteada.",
      );
    });
  });
});
