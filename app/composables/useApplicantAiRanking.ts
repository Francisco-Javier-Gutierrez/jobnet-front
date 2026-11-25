import { ref, computed } from "vue";
import { apiFetch } from "~/composables/useApiClient";
import { useAppFeedback } from "~/composables/useAppFeedback";

export interface CandidateAiMatch {
  candidateId: string;
  name: string;
  titularProfesional: string;
  matchPercentage: number;
  tier: "TOP_MATCH" | "FUERTE_CANDIDATO" | "AJUSTE_MODERADO" | "BAJO_AJUSTE";
  tierLabel: string;
  strengths: string[];
  gaps: string[];
  justification: string;
}

export interface JobAiCooldownState {
  isBlocked: boolean;
  remainingSeconds: number;
  remainingMs: number;
  expiresAt?: string;
  jobId?: string;
}

export type UserAiCooldownState = JobAiCooldownState;

export interface VacancyAiRankingResult {
  jobId: string;
  jobTitle: string;
  totalEvaluated: number;
  evaluatedAt: string;
  ranking: CandidateAiMatch[];
  summary: string;
  updatedAt?: string;
  jobCooldown?: JobAiCooldownState;
  userCooldown?: UserAiCooldownState;
}

export const AI_RANKING_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 horas

const isAiModalOpen = ref(false);
const isEvaluating = ref(false);
const currentJobId = ref("");
const rankingResult = ref<VacancyAiRankingResult | null>(null);
const errorMessage = ref<string | null>(null);
const userCooldown = ref<JobAiCooldownState>({
  isBlocked: false,
  remainingSeconds: 0,
  remainingMs: 0,
});

export function useApplicantAiRanking() {
  const { showError, showSuccess, showInfo } = useAppFeedback();

  const isCooldownActive = computed(() => {
    if (userCooldown.value.isBlocked) {
      if (userCooldown.value.expiresAt) {
        return new Date(userCooldown.value.expiresAt).getTime() > Date.now();
      }
      return true;
    }
    return false;
  });

  const cooldownRemainingText = computed(() => {
    if (!isCooldownActive.value) return "";
    let remainingMs = 0;
    if (userCooldown.value.expiresAt) {
      remainingMs = Math.max(
        0,
        new Date(userCooldown.value.expiresAt).getTime() - Date.now(),
      );
    } else if (userCooldown.value.remainingMs) {
      remainingMs = userCooldown.value.remainingMs;
    } else if (userCooldown.value.remainingSeconds) {
      remainingMs = userCooldown.value.remainingSeconds * 1000;
    }
    const totalMinutes = Math.ceil(remainingMs / (60 * 1000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  });

  const checkUserCooldownStatus = async (jobId?: string) => {
    try {
      const url = jobId ? `/ai/cooldown?jobId=${jobId}` : "/ai/cooldown";
      const status = await apiFetch<JobAiCooldownState>(url);
      if (status) {
        userCooldown.value = status;
      }
    } catch {
      // Ignorar error si no está autenticado o endpoint no responde
    }
  };

  const openRankingModal = async (jobId: string) => {
    if (!jobId) return;
    currentJobId.value = jobId;
    isAiModalOpen.value = true;
    errorMessage.value = null;

    // Resetear temporalmente el cooldown hasta consultar el de esta vacante
    userCooldown.value = {
      isBlocked: false,
      remainingSeconds: 0,
      remainingMs: 0,
    };

    // 1. Intentar cargar ranking previo y cooldown desde caché en DynamoDB
    try {
      const cached = await apiFetch<VacancyAiRankingResult>(
        `/jobs/${jobId}/ai-ranking`,
      );
      if (cached && Array.isArray(cached.ranking)) {
        rankingResult.value = cached;
      } else {
        rankingResult.value = null;
      }
      if (cached?.jobCooldown || cached?.userCooldown) {
        userCooldown.value = (cached.jobCooldown || cached.userCooldown)!;
      } else {
        await checkUserCooldownStatus(jobId);
      }
    } catch {
      rankingResult.value = null;
      await checkUserCooldownStatus(jobId);
    }
  };

  const closeRankingModal = () => {
    isAiModalOpen.value = false;
  };

  const generateRanking = async (jobId?: string) => {
    const targetJobId = jobId || currentJobId.value;
    if (!targetJobId) return;

    if (isCooldownActive.value) {
      showInfo(
        "Tiempo de espera activo (24h)",
        `Esta vacante ya fue evaluada recientemente. Podrás volver a generar la comparativa con IA en ${cooldownRemainingText.value}.`,
      );
      return;
    }

    isEvaluating.value = true;
    errorMessage.value = null;

    try {
      const result = await apiFetch<VacancyAiRankingResult>(
        `/jobs/${targetJobId}/ai-ranking`,
        {
          method: "POST",
        },
      );

      rankingResult.value = result;

      // La vacante ahora tiene activo el registro TTL por 24 horas
      const now = Date.now();
      userCooldown.value = {
        isBlocked: true,
        remainingSeconds: 24 * 60 * 60,
        remainingMs: 24 * 60 * 60 * 1000,
        expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
        jobId: targetJobId,
      };

      showSuccess(
        "Comparativa Generada",
        "La Inteligencia Artificial ha analizado y clasificado a los candidatos con éxito.",
      );
    } catch (err: any) {
      console.error("Error generating AI candidate ranking:", err);
      const is429 =
        err?.statusCode === 429 ||
        err?.status === 429 ||
        err?.data?.cooldown === true;

      if (is429) {
        userCooldown.value = {
          isBlocked: true,
          remainingSeconds: err?.data?.remainingSeconds || 24 * 60 * 60,
          remainingMs: err?.data?.remainingMs || 24 * 60 * 60 * 1000,
          expiresAt: err?.data?.expiresAt,
          jobId: targetJobId,
        };
        const msg =
          err?.data?.error ||
          "Esta vacante ya fue evaluada recientemente con IA (límite de 24 horas).";
        errorMessage.value = msg;
        showInfo("Límite de generación de 24 horas", msg);
      } else {
        const msg =
          err?.data?.error ||
          err?.message ||
          "No se pudo completar el análisis comparativo con IA.";
        errorMessage.value = msg;
        showError("Error de Análisis IA", msg);
      }
    } finally {
      isEvaluating.value = false;
    }
  };

  return {
    isAiModalOpen,
    isEvaluating,
    currentJobId,
    rankingResult,
    errorMessage,
    userCooldown,
    isCooldownActive,
    cooldownRemainingText,
    openRankingModal,
    closeRankingModal,
    generateRanking,
    checkUserCooldownStatus,
  };
}
