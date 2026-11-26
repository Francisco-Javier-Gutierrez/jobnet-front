<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
  >
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-outline-variant/30 dark:border-slate-800"
    >
      <div>
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[22px]"
            >code_blocks</span
          >
          <h2 class="text-base font-bold text-on-surface dark:text-slate-100">
            Habilidades Técnicas Más Demandadas
          </h2>
        </div>
        <p class="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
          Frecuencia de requisitos técnicos en vacantes de la región ({{
            region
          }})
        </p>
      </div>
      <span
        class="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:bg-indigo-950/60 dark:text-indigo-400"
      >
        <span class="material-symbols-outlined text-[14px]">location_on</span>
        {{ region }}
      </span>
    </div>

    <!-- Empty State -->
    <div
      v-if="skills.length === 0"
      class="mt-6 flex-1 flex flex-col items-center justify-center py-12 text-center"
    >
      <span
        class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700"
        >code_off</span
      >
      <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Aún no hay habilidades registradas en vacantes activas de esta región.
      </p>
    </div>

    <!-- Chart List -->
    <div v-else class="mt-5 space-y-3.5">
      <div
        v-for="(skill, index) in skills"
        :key="skill.name"
        class="group flex flex-col gap-1.5"
      >
        <div class="flex items-center justify-between text-xs">
          <!-- Rank & Skill Name -->
          <div class="flex items-center gap-2.5 min-w-0 pr-2">
            <span
              class="w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 shadow-sm"
              :class="getRankBadgeClass(index)"
            >
              {{ index + 1 }}
            </span>
            <span
              class="font-semibold text-on-surface dark:text-slate-200 truncate group-hover:text-primary transition"
            >
              {{ skill.name }}
            </span>
            <span
              class="text-[10px] px-2 py-0.5 rounded-md font-medium shrink-0"
              :class="getCategoryBadgeClass(skill.category)"
            >
              {{ skill.category }}
            </span>
          </div>

          <!-- Value & Percentage -->
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-slate-500 dark:text-slate-400 font-medium">
              {{ skill.count }} vacantes
            </span>
            <span
              class="font-bold text-on-surface dark:text-slate-100 w-10 text-right"
            >
              {{ skill.percentage }}%
            </span>
          </div>
        </div>

        <!-- Horizontal Bar with Gradient -->
        <div
          class="w-full bg-slate-100 dark:bg-slate-800/80 h-2.5 rounded-full overflow-hidden"
        >
          <div
            class="h-full rounded-full transition-all duration-500 ease-out"
            :class="getBarGradient(index)"
            :style="{ width: `${Math.max(skill.percentage, 6)}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Footer Summary -->
    <div
      class="mt-6 pt-3 border-t border-outline-variant/30 dark:border-slate-800 flex items-center justify-between text-xs text-on-surface-variant dark:text-slate-400"
    >
      <span>Calculado con publicaciones activas de la región</span>
      <span class="font-semibold text-primary">
        Total: {{ skills.length }}
        {{ skills.length === 1 ? "tecnología" : "tecnologías" }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SkillItem } from "~/composables/useAdminAnalytics";

defineProps<{
  skills: SkillItem[];
  region: string;
}>();

const getRankBadgeClass = (index: number) => {
  if (index === 0) return "bg-amber-400 text-amber-950 font-black";
  if (index === 1) return "bg-slate-300 text-slate-800";
  if (index === 2) return "bg-amber-600 text-amber-50";
  return "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
};

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case "Frontend":
      return "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300";
    case "Cloud":
      return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300";
    case "Backend":
      return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300";
    case "DevOps":
      return "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300";
    case "Data / AI":
      return "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300";
    case "Diseño":
      return "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300";
    default:
      return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
  }
};

const getBarGradient = (index: number) => {
  if (index === 0) return "bg-gradient-to-r from-amber-500 to-indigo-600";
  if (index === 1) return "bg-gradient-to-r from-indigo-500 to-purple-600";
  if (index === 2) return "bg-gradient-to-r from-purple-500 to-pink-500";
  if (index <= 5) return "bg-gradient-to-r from-indigo-500 to-sky-500";
  return "bg-gradient-to-r from-slate-400 to-indigo-400 dark:from-slate-600 dark:to-indigo-500";
};
</script>
