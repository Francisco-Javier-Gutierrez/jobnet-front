export type TicketCategory =
  "FALLO_TECNICO" | "DUDA_GENERAL" | "PROBLEMA_CUENTA" | "OTRO";

export type TicketStatus = "ABIERTO" | "EN_PROCESO" | "RESUELTO";

export interface TicketAttachment {
  url: string;
  name: string;
  type: string;
  size?: number;
}

export interface SupportTicketMessage {
  messageId: string;
  ticketId: string;
  senderId: string;
  senderRole: "USER" | "MODERADOR" | "ADMIN" | string;
  senderName: string;
  message?: string;
  text?: string;
  attachments?: TicketAttachment[];
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userRole: "CANDIDATO" | "ORGANIZACION" | string;
  subject: string;
  category: TicketCategory;
  description: string;
  status: TicketStatus;
  assignedModeratorId?: string | null;
  assignedModeratorName?: string | null;
  assignedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  lastMessageAt?: string;
  lastSenderRole?: string;
  lastSenderId?: string;
  resolutionNotes?: string | null;
  resolvedAt?: string | null;
  resolvedByModeratorId?: string | null;
  messages?: SupportTicketMessage[];
}

export interface CreateTicketDTO {
  subject: string;
  category: TicketCategory;
  description: string;
  attachments?: TicketAttachment[];
}
