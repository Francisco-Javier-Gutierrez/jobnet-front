import { ref, computed } from "vue";
import type { Incident } from "~/types";
import { useAuth, useRuntimeConfig } from "#imports";
import { useMockSession } from "./useMockSession";

export interface AuditMessage {
  id: string;
  senderId: string;
  senderRole: "CANDIDATO" | "EMPRESA" | "SISTEMA";
  senderName: string;
  text: string;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  attachmentName?: string | null;
  createdAt: string;
}

export function useDisputeAudit(onRefresh?: () => Promise<void> | void) {
  const isAuditModalOpen = ref(false);
  const selectedIncident = ref<Incident | null>(null);
  const chatMessages = ref<AuditMessage[]>([]);
  const isLoadingChat = ref(false);
  const isSubmittingDictum = ref(false);
  const dictumAction = ref<"SANCION_EMPRESA" | "ADVERTENCIA" | "DESESTIMADA">("SANCION_EMPRESA");
  const dictumNotes = ref("");
  const graceDays = ref(4);
  const successMsg = ref("");
  const errorMsg = ref("");

  const { data: sessionData } = useAuth();
  const { isMockEnabled, currentMockUser } = useMockSession();

  const userRole = computed(() => {
    if (isMockEnabled.value && currentMockUser.value) {
      return currentMockUser.value.tipoUsuario.toUpperCase();
    }
    return ((sessionData.value?.user as any)?.tipoUsuario || "").toUpperCase();
  });

  const isModerator = computed(() => {
    const r = userRole.value;
    return r === "MODERATOR" || r === "MODERADOR" || r === "ADMIN";
  });

  const loadChat = async (incidentId: string) => {
    isLoadingChat.value = true;
    errorMsg.value = "";
    try {
      const res = await $fetch<any>(
        `/api/moderator/incidents/${incidentId}/audit-chat`,
        {
          headers: {
            "x-user-role": userRole.value || "MODERATOR",
          },
        },
      );
      chatMessages.value = res?.messages || [];
    } catch (err: any) {
      errorMsg.value = err.message || "No se pudo cargar el historial de mensajes.";
    } finally {
      isLoadingChat.value = false;
    }
  };

  /**
   * Fase 1: Apertura de Auditoría
   * Admite la incidencia formal, despacha notificación a ambas partes y supervisa el canal
   */
  const openAudit = async (incident: Incident) => {
    errorMsg.value = "";
    try {
      const res = await $fetch<any>(
        `/api/moderator/incidents/${incident.id}/open-audit`,
        {
          method: "POST",
          headers: {
            "x-user-role": userRole.value || "MODERATOR",
          },
          body: {
            notes: `Apertura formal de auditoría por controversia de ${incident.infraccion || 'infracción grave'}.`,
          },
        },
      );

      incident.estatus = "AUDITORIA";
      incident.status = "AUDITORIA";
      incident.auditState = "AUDIT_ACTIVE";
      incident.supervisionStatus = "UNDER_AUDIT";

      successMsg.value =
        res?.message ||
        "Fase 1 completada: Notificación formal despachada a ambas partes. Canal supervisado.";

      // Automatically inspect the audit chat
      selectedIncident.value = incident;
      dictumAction.value = "SANCION_EMPRESA";
      dictumNotes.value = "";
      graceDays.value = 4;
      await loadChat(incident.id);
      isAuditModalOpen.value = true;

      setTimeout(() => (successMsg.value = ""), 6000);
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      errorMsg.value = err.message || "Error al abrir la auditoría de mensajería.";
      setTimeout(() => (errorMsg.value = ""), 6000);
    }
  };

  /**
   * Fase 2: Inspección de solo lectura del historial
   */
  const inspectAuditChat = async (incident: Incident) => {
    selectedIncident.value = incident;
    dictumAction.value = "SANCION_EMPRESA";
    dictumNotes.value = "";
    graceDays.value = 4;
    await loadChat(incident.id);
    isAuditModalOpen.value = true;
  };

  /**
   * Fase 2: Emisión del Dictamen Oficial del Moderador
   */
  const submitDictum = async () => {
    if (!selectedIncident.value) return;
    if (!dictumNotes.value.trim()) {
      errorMsg.value = "Debe proporcionar una justificación para el dictamen.";
      return;
    }

    isSubmittingDictum.value = true;
    errorMsg.value = "";
    try {
      const incidentId = selectedIncident.value.id;
      const res = await $fetch<any>(
        `/api/moderator/incidents/${incidentId}/audit-dictum`,
        {
          method: "POST",
          headers: {
            "x-user-role": userRole.value || "MODERATOR",
          },
          body: {
            dictum: dictumAction.value,
            notes: dictumNotes.value.trim(),
            graceDays: graceDays.value,
          },
        },
      );

      if (selectedIncident.value) {
        selectedIncident.value.estatus = "RESUELTO";
        selectedIncident.value.status = "RESUELTO";
        selectedIncident.value.auditState = "AUDIT_CONCLUDED";
        selectedIncident.value.auditDictum = dictumAction.value;
        selectedIncident.value.auditDictumNotes = dictumNotes.value.trim();
        selectedIncident.value.supervisionStatus = "CONCLUDED";
      }

      successMsg.value =
        res?.message || "Dictamen oficial registrado con éxito. Expediente concluido.";
      isAuditModalOpen.value = false;

      setTimeout(() => (successMsg.value = ""), 6000);
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      errorMsg.value = err.message || "Error al emitir el dictamen de auditoría.";
    } finally {
      isSubmittingDictum.value = false;
    }
  };

  const closeAuditModal = () => {
    isAuditModalOpen.value = false;
  };

  return {
    isModerator,
    userRole,
    isAuditModalOpen,
    selectedIncident,
    chatMessages,
    isLoadingChat,
    isSubmittingDictum,
    dictumAction,
    dictumNotes,
    graceDays,
    successMsg,
    errorMsg,
    openAudit,
    inspectAuditChat,
    submitDictum,
    closeAuditModal,
  };
}
