export interface AppealAttachment {
  url: string;
  name: string;
  type?: string;
  size?: number;
}

export interface AppealMessage {
  id?: string;
  senderId: string;
  senderRole?: "ORGANIZACION" | "MODERADOR" | "ADMIN" | "USER" | string;
  text: string;
  timestamp: string | number;
  attachment?: AppealAttachment | null;
}

export interface Appeal {
  id: string;
  companyId: string;
  companyName: string;
  incidentId?: string;
  motivo: string;
  descripcion: string;
  estado:
    | "PENDIENTE"
    | "EN_REVISION"
    | "APROBADA"
    | "RECHAZADA"
    | "RESUELTO"
    | string;
  createdAt: string;
  updatedAt?: string;
  messages?: AppealMessage[];
  evidenciaUrl?: string;
  resolucion?: string;
}

export interface Incident {
  id: string;
  targetType:
    "POST" | "VACANTE" | "PERFIL" | "ORGANIZACION" | "COMENTARIO" | string;
  targetId: string;
  targetTitle?: string;
  reporterId?: string;
  reporterEmail?: string;
  reason: string;
  details?: string;
  status: "PENDIENTE" | "INVESTIGANDO" | "RESUELTO" | "DESCARTADO" | string;
  createdAt: string;
  actionTaken?: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail?: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: string;
  timestamp: string;
  ip?: string;
}
