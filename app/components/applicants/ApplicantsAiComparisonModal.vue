<template>
  <AppModal
    v-model="isAiModalOpen"
    max-width="5xl"
    :title="'Comparativa IA de Candidatos'"
    :subtitle="'Clasificación por compatibilidad, porcentaje de ajuste y justificación técnica'"
    icon="auto_awesome"
    icon-bg-class="bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20"
    @close="closeRankingModal"
  >
    <!-- Modal Content -->
    <div class="space-y-6">
      <!-- Top Action & Vacancy Context Bar -->
      <div
        class="bg-surface-container-low dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"
          >
            <span class="material-symbols-outlined text-xl">work</span>
          </div>
          <div class="min-w-0">
            <p
              class="text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider"
            >
              Vacante analizada
            </p>
            <h4
              class="text-sm sm:text-base font-bold text-on-background dark:text-slate-100 truncate"
            >
              {{ currentVacancyTitle }}
            </h4>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <div
            v-if="isCooldownActive"
            class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20"
            title="Límite de uso responsable: 1 evaluación con IA cada 24 horas por vacante"
          >
            <span class="material-symbols-outlined text-sm text-indigo-500"
              >schedule</span
            >
            <span>Disponible en {{ cooldownRemainingText }}</span>
          </div>

          <button
            type="button"
            @click="generateRanking()"
            :disabled="isEvaluating || !currentJobId || isCooldownActive"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white transition active:scale-95 flex-shrink-0 cursor-pointer"
            :class="[
              isCooldownActive
                ? 'bg-slate-400 dark:bg-slate-700 opacity-60 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20',
            ]"
            :title="
              isCooldownActive
                ? `Próxima evaluación en ${cooldownRemainingText}`
                : 'Evaluar candidatos con IA'
            "
          >
            <span
              class="material-symbols-outlined text-sm"
              :class="{ 'animate-spin': isEvaluating }"
            >
              {{
                isEvaluating
                  ? "refresh"
                  : isCooldownActive
                    ? "timer"
                    : "auto_awesome"
              }}
            </span>
            <span>
              {{
                isEvaluating
                  ? "Evaluando..."
                  : isCooldownActive
                    ? "Cooldown Activo"
                    : rankingResult
                      ? "Re-evaluar con IA"
                      : "Evaluar con IA"
              }}
            </span>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex items-center justify-between gap-3 text-xs font-semibold"
      >
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-base">error</span>
          <span>{{ errorMessage }}</span>
        </div>
        <button
          type="button"
          @click="generateRanking()"
          class="underline hover:text-rose-700 dark:hover:text-rose-300 cursor-pointer"
        >
          Reintentar
        </button>
      </div>

      <!-- Loading State -->
      <div
        v-if="isEvaluating"
        class="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4"
      >
        <div class="relative w-16 h-16">
          <div
            class="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900/40 border-t-indigo-600 animate-spin"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span
              class="material-symbols-outlined text-2xl text-indigo-600 dark:text-indigo-400"
            >
              psychology
            </span>
          </div>
        </div>
        <div class="space-y-1">
          <h4
            class="text-base font-bold text-on-background dark:text-slate-100"
          >
            La Inteligencia Artificial está analizando los candidatos...
          </h4>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-400 max-w-md"
          >
            Comparando competencias técnicas, perfil profesional y adecuación
            con los requisitos de la vacante para determinar el porcentaje de
            afinidad.
          </p>
        </div>
      </div>

      <!-- Empty State (No analysis yet) -->
      <div
        v-else-if="!rankingResult"
        class="py-12 px-6 text-center space-y-4 border-2 border-dashed border-outline-variant/60 rounded-2xl"
      >
        <div
          class="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-3xl">psychology</span>
        </div>
        <div class="space-y-1">
          <h4
            class="text-base font-bold text-on-background dark:text-slate-100"
          >
            Comparativa bajo demanda con IA
          </h4>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-400 max-w-md mx-auto"
          >
            Haz clic en el botón para que la IA analice y ordene a los
            postulantes de esta vacante, indicando fortalezas, brechas y el
            motivo de compatibilidad.
          </p>
        </div>
        <button
          type="button"
          @click="generateRanking()"
          :disabled="!currentJobId"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-indigo-500/20 transition active:scale-95 cursor-pointer"
        >
          <span class="material-symbols-outlined text-sm">auto_awesome</span>
          <span>Evaluar con IA</span>
        </button>
      </div>

      <!-- Results View -->
      <div v-else class="space-y-6">
        <!-- Executive Summary Banner -->
        <div
          class="bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-transparent border border-indigo-500/20 rounded-2xl p-4 sm:p-5 space-y-2"
        >
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span
              class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider"
            >
              <span class="material-symbols-outlined text-base">summarize</span>
              Resumen Ejecutivo de la IA
            </span>
            <span
              class="text-[11px] font-semibold text-on-surface-variant dark:text-slate-400"
            >
              {{ rankingResult.totalEvaluated }} candidatos evaluados ·
              {{ formatDate(rankingResult.evaluatedAt) }}
            </span>
          </div>
          <p
            class="text-xs sm:text-sm text-on-background dark:text-slate-200 leading-relaxed"
          >
            {{ rankingResult.summary }}
          </p>
        </div>

        <!-- Empty Results Alert -->
        <div
          v-if="!rankingResult.ranking || rankingResult.ranking.length === 0"
          class="text-center py-8 text-xs text-on-surface-variant dark:text-slate-400"
        >
          No hay candidatos registrados en esta vacante para comparar.
        </div>

        <!-- Ranking Table -->
        <div
          v-else
          class="border border-outline-variant/60 rounded-2xl overflow-hidden bg-surface-container-low dark:bg-slate-900/60 shadow-sm"
        >
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  class="border-b border-outline-variant/60 bg-surface dark:bg-slate-900 text-on-surface-variant dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]"
                >
                  <th class="py-3 px-4 w-14 text-center">Pos</th>
                  <th class="py-3 px-4 min-w-[180px]">Candidato</th>
                  <th class="py-3 px-4 min-w-[150px]">Afinidad IA</th>
                  <th class="py-3 px-4 min-w-[260px]">Fortalezas & Brechas</th>
                  <th class="py-3 px-4 min-w-[280px]">Justificación Técnica</th>
                  <th class="py-3 px-4 text-right w-28">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/40">
                <tr
                  v-for="(item, index) in rankingResult.ranking"
                  :key="item.candidateId"
                  class="hover:bg-surface/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <!-- Rank Number -->
                  <td class="py-4 px-4 text-center font-extrabold">
                    <span
                      class="inline-flex items-center justify-center w-7 h-7 rounded-xl text-xs font-black shadow-sm"
                      :class="getRankBadgeClass(index)"
                    >
                      #{{ index + 1 }}
                    </span>
                  </td>

                  <!-- Candidate Info -->
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm"
                        :class="getAvatarClass(index)"
                      >
                        {{ (item.name || "C").substring(0, 2).toUpperCase() }}
                      </div>
                      <div class="min-w-0">
                        <div
                          class="font-bold text-on-background dark:text-slate-100 truncate"
                        >
                          {{ item.name }}
                        </div>
                        <div
                          class="text-[11px] text-on-surface-variant dark:text-slate-400 truncate"
                        >
                          {{ item.titularProfesional || "Sin titular" }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Affinity / Match Percentage -->
                  <td class="py-4 px-4">
                    <div class="space-y-1.5">
                      <div class="flex items-center justify-between gap-2">
                        <span
                          class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border"
                          :class="getTierBadgeClass(item.tier)"
                        >
                          {{ item.tierLabel || item.tier }}
                        </span>
                        <span
                          class="font-black text-xs text-on-background dark:text-slate-100"
                        >
                          {{ item.matchPercentage }}%
                        </span>
                      </div>
                      <div
                        class="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden"
                      >
                        <div
                          class="h-full rounded-full transition-all duration-500"
                          :class="getProgressBarClass(item.tier)"
                          :style="{ width: `${item.matchPercentage}%` }"
                        ></div>
                      </div>
                    </div>
                  </td>

                  <!-- Strengths & Gaps -->
                  <td class="py-4 px-4">
                    <div class="space-y-2">
                      <!-- Strengths -->
                      <div
                        v-if="item.strengths && item.strengths.length > 0"
                        class="flex flex-wrap gap-1"
                      >
                        <span
                          v-for="(st, sIdx) in item.strengths"
                          :key="`st-${sIdx}`"
                          class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                        >
                          <span class="material-symbols-outlined text-[10px]"
                            >check</span
                          >
                          {{ st }}
                        </span>
                      </div>
                      <!-- Gaps -->
                      <div
                        v-if="item.gaps && item.gaps.length > 0"
                        class="flex flex-wrap gap-1"
                      >
                        <span
                          v-for="(gap, gIdx) in item.gaps"
                          :key="`gap-${gIdx}`"
                          class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                        >
                          <span class="material-symbols-outlined text-[10px]"
                            >remove</span
                          >
                          {{ gap }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Technical Justification -->
                  <td
                    class="py-4 px-4 text-on-surface-variant dark:text-slate-300 leading-relaxed text-[11px]"
                  >
                    {{ item.justification }}
                  </td>

                  <!-- Actions -->
                  <td class="py-4 px-4 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        @click="handleSelectCandidate(item.candidateId)"
                        class="p-1.5 rounded-lg bg-surface border border-outline-variant/60 hover:bg-primary/10 hover:text-primary text-on-surface-variant transition cursor-pointer"
                        title="Ver y gestionar en ATS"
                      >
                        <span class="material-symbols-outlined text-base"
                          >visibility</span
                        >
                      </button>
                      <button
                        type="button"
                        @click="handleOpenCandidateCv(item.candidateId)"
                        class="p-1.5 rounded-lg bg-surface border border-outline-variant/60 hover:bg-indigo-500/10 hover:text-indigo-600 text-on-surface-variant transition cursor-pointer"
                        title="Ver Currículum Vitae"
                      >
                        <span class="material-symbols-outlined text-base"
                          >description</span
                        >
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Footer -->
    <template #footer>
      <div
        class="w-full flex items-center justify-between text-xs text-on-surface-variant dark:text-slate-400"
      >
        <span class="flex items-center gap-1.5 text-[11px]">
          <span class="material-symbols-outlined text-xs text-indigo-500"
            >lock</span
          >
          Procesado confidencialmente con IA
        </span>
        <button
          type="button"
          @click="closeRankingModal"
          class="px-4 py-2 rounded-xl border border-outline-variant/60 hover:bg-surface font-bold text-xs text-on-background transition cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useApplicants } from "~/composables/useApplicants";
import { useApplicantAiRanking } from "~/composables/useApplicantAiRanking";
import AppModal from "~/components/common/AppModal.vue";

const {
  isAiModalOpen,
  isEvaluating,
  currentJobId,
  rankingResult,
  errorMessage,
  isCooldownActive,
  cooldownRemainingText,
  closeRankingModal,
  generateRanking,
} = useApplicantAiRanking();

const applicants = useApplicants();
const { candidates, selectedCandidate, myJobs, openCandidateCv } = applicants;

const currentVacancyTitle = computed(() => {
  if (rankingResult.value?.jobTitle) return rankingResult.value.jobTitle;
  const match = myJobs.value.find((j) => j.id === currentJobId.value);
  return match?.title || "Vacante seleccionada";
});

const formatDate = (isoString?: string) => {
  if (!isoString) return "Hoy";
  try {
    return new Date(isoString).toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return isoString;
  }
};

const getRankBadgeClass = (index: number) => {
  if (index === 0) {
    return "bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30";
  }
  if (index === 1) {
    return "bg-slate-300/40 text-slate-700 dark:text-slate-300 border border-slate-400/30";
  }
  if (index === 2) {
    return "bg-amber-700/10 text-amber-800 dark:text-amber-400 border border-amber-700/20";
  }
  return "bg-surface-container-high text-on-surface-variant border border-outline-variant/40";
};

const getAvatarClass = (index: number) => {
  if (index === 0)
    return "bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950";
  if (index === 1)
    return "bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900";
  if (index === 2)
    return "bg-gradient-to-tr from-amber-700 to-amber-600 text-white";
  return "bg-primary/10 text-primary";
};

const getTierBadgeClass = (tier: string) => {
  switch (tier) {
    case "TOP_MATCH":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "FUERTE_CANDIDATO":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    case "AJUSTE_MODERADO":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    default:
      return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
  }
};

const getProgressBarClass = (tier: string) => {
  switch (tier) {
    case "TOP_MATCH":
      return "bg-emerald-500";
    case "FUERTE_CANDIDATO":
      return "bg-indigo-500";
    case "AJUSTE_MODERADO":
      return "bg-amber-500";
    default:
      return "bg-slate-400";
  }
};

const handleSelectCandidate = (candidateId: string) => {
  const match = candidates.value.find((c) => c.id === candidateId);
  if (match) {
    selectedCandidate.value = match;
  }
  closeRankingModal();
};

const handleOpenCandidateCv = (candidateId: string) => {
  const match = candidates.value.find((c) => c.id === candidateId);
  if (match) {
    openCandidateCv(match, "VIEW");
  }
};
</script>
