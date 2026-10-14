export interface ChatAttachment {
  url: string;
  type: "image" | "pdf" | "document" | string;
  name: string;
  size?: number;
}

export interface ChatMessage {
  id?: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  text: string;
  timestamp: string | number;
  attachment?: ChatAttachment | null;
  read?: boolean;
  status?: "sent" | "delivered" | "read";
}

export interface ChatConversation {
  id: string;
  jobId: string;
  candidateId: string;
  name: string;
  avatar?: string;
  jobTitle: string;
  status?: string;
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
}

export interface SupportChat {
  id: string;
  companyId?: string;
  name: string;
  avatar?: string;
  reason?: string;
  status?: string;
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
}
