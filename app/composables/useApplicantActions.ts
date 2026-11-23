import { useRuntimeConfig } from "#imports";
import type { ApplicantCandidate } from "~/types";
import { apiClient } from "./useApiClient";

const successMsg = ref("");
const pendingCandidateItem = ref<ApplicantCandidate | null>(null);

const isInterviewModalOpen = ref(false);
const interviewDetails = ref("");

const isRejectModalOpen = ref(false);
const rejectionReason = ref("");

export const useApplicantActions = () => {
  const config = useRuntimeConfig();

  const getStatusLabel = (st: string) => {
    switch (st) {
      case "PENDIENTE":
        return "Pendiente";
      case "EN_CONTACTO":
        return "En Contacto";
      case "SELECCIONADO":
        return "Seleccionado";
      case "RECHAZADO":
        return "Rechazado";
      case "CONTRATADO":
        return "Contratado";
      default:
        return st;
    }
  };

  const getStatusBadgeClass = (st: string) => {
    switch (st) {
      case "PENDIENTE":
        return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
      case "EN_CONTACTO":
        return "bg-sky-500/10 text-sky-600 border border-sky-500/20";
      case "SELECCIONADO":
        return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
      case "CONTRATADO":
        return "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20";
      case "RECHAZADO":
        return "bg-rose-500/10 text-rose-600 border border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border border-slate-500/20";
    }
  };

  const submitStatusUpdate = async (
    candidate: any,
    backendStatus: string,
    details?: string,
  ) => {
    try {
      if (!candidate.id.startsWith("cand-demo")) {
        await apiClient.put(
          `/applications/${candidate.jobId}/${candidate.id}/status`,
          {
            status: backendStatus,
            detallesEntrevista: details || null,
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
    } else if (candidate.status === "EN_CONTACTO") {
      submitStatusUpdate(candidate, "SELECCIONADO");
    } else if (candidate.status === "SELECCIONADO") {
      submitStatusUpdate(candidate, "CONTRATADO");
    }
  };

  const submitInterviewTransition = async () => {
    if (!pendingCandidateItem.value) return;
    await submitStatusUpdate(
      pendingCandidateItem.value,
      "EN_CONTACTO",
      interviewDetails.value,
    );
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
        await apiClient.put(
          `/applications/${candidate.jobId}/${candidate.id}/status`,
          {
            status: "RECHAZADO",
            motivoRechazo: rejectionReason.value,
          },
        );
      }
      candidate.status = "RECHAZADO";
      successMsg.value = `Candidato ${candidate.name} descartado con éxito. Se le ha enviado un correo automático.`;
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
