import { ref } from 'vue';
import { useRuntimeConfig } from '#imports';

const successMsg = ref("");
const pendingCandidateItem = ref<any>(null);

const isInterviewModalOpen = ref(false);
const interviewDetails = ref("");

const isRejectModalOpen = ref(false);
const rejectionReason = ref("");

export const useApplicantActions = () => {
  const config = useRuntimeConfig();

  const getStatusLabel = (st: string) => {
    switch (st) {
      case "PENDIENTE": return "En Evaluación";
      case "ENTREVISTA": return "Entrevista";
      case "ACEPTADO": return "Aceptado";
      case "RECHAZADO": return "Descartado";
      default: return st;
    }
  };

  const getStatusBadgeClass = (st: string) => {
    switch (st) {
      case "PENDIENTE": return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
      case "ENTREVISTA": return "bg-sky-500/10 text-sky-600 border border-sky-500/20";
      case "ACEPTADO": return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
      case "RECHAZADO": return "bg-rose-500/10 text-rose-600 border border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-600 border border-slate-500/20";
    }
  };

  const submitStatusUpdate = async (candidate: any, backendStatus: string, details?: string) => {
    try {
      if (!candidate.id.startsWith("cand-demo")) {
        await $fetch(
          `${config.public.apiUrl}/applications/${candidate.jobId}/${candidate.id}/status`,
          {
            method: "PUT",
            body: {
              status: backendStatus,
              detallesEntrevista: details || null,
            },
          },
        );
      }
      candidate.status = backendStatus;
      successMsg.value = `Estado de candidato ${candidate.name} actualizado con éxito a ${getStatusLabel(backendStatus)}.`;
      setTimeout(() => (successMsg.value = ""), 4500);
    } catch (e) {
      console.error("Error updating candidate application status:", e);
    }
  };

  const advanceCandidateStage = (candidate: any) => {
    pendingCandidateItem.value = candidate;
    if (candidate.status === "PENDIENTE") {
      interviewDetails.value = "";
      isInterviewModalOpen.value = true;
    } else if (candidate.status === "ENTREVISTA") {
      submitStatusUpdate(candidate, "ACEPTADO");
    }
  };

  const submitInterviewTransition = async () => {
    if (!pendingCandidateItem.value) return;
    await submitStatusUpdate(pendingCandidateItem.value, "ENTREVISTA", interviewDetails.value);
    isInterviewModalOpen.value = false;
    pendingCandidateItem.value = null;
  };

  const triggerReject = (candidate: any) => {
    pendingCandidateItem.value = candidate;
    rejectionReason.value = "";
    isRejectModalOpen.value = true;
  };

  const submitRejection = async () => {
    if (!pendingCandidateItem.value) return;
    const candidate = pendingCandidateItem.value;
    try {
      if (!candidate.id.startsWith("cand-demo")) {
        await $fetch(
          `${config.public.apiUrl}/applications/${candidate.jobId}/${candidate.id}/status`,
          {
            method: "PUT",
            body: {
              status: "RECHAZADO",
              motivoRechazo: rejectionReason.value,
            },
          },
        );
      }
      candidate.status = "RECHAZADO";
      successMsg.value = `Postulante ${candidate.name} descartado con éxito. Se le ha enviado un correo automático.`;
      setTimeout(() => (successMsg.value = ""), 4500);
    } catch (e) {
      console.error("Error rejecting candidate application:", e);
    } finally {
      isRejectModalOpen.value = false;
      pendingCandidateItem.value = null;
    }
  };

  return {
    successMsg,
    pendingCandidateItem,
    isInterviewModalOpen,
    interviewDetails,
    isRejectModalOpen,
    rejectionReason,
    getStatusLabel,
    getStatusBadgeClass,
    advanceCandidateStage,
    submitInterviewTransition,
    triggerReject,
    submitRejection,
  };
};
