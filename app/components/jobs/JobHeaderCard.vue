<template>
  <div
    class="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2"
  >
    <div class="flex items-start gap-4">
      <div
        class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center flex-shrink-0 text-2xl font-bold shadow-md shadow-primary/20"
      >
        {{ job.company ? job.company.charAt(0).toUpperCase() : "J" }}
      </div>
      <div>
        <div class="flex items-center gap-2 flex-wrap mb-1">
          <h1
            class="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight"
          >
            {{ job.title }}
          </h1>
          <span
            v-if="job.estadoBadge"
            :class="`px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-${job.estadoBadge.badgeColor}-500/10 text-${job.estadoBadge.badgeColor}-700 border border-${job.estadoBadge.badgeColor}-500/20`"
          >
            {{ job.estadoBadge.label }}
          </span>
        </div>

        <p
          class="text-sm text-primary font-bold hover:underline cursor-pointer flex items-center gap-1.5 mb-3"
        >
          {{ job.company }}
          <span
            class="material-symbols-outlined text-sm text-secondary fill-1"
            title="Organización verificada"
            >verified</span
          >
        </p>

        <!-- Specs Badges -->
        <div class="flex flex-wrap gap-2">
          <span
            class="px-3 py-1 bg-surface-container-low text-on-surface-variant dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 border border-outline-variant/40"
          >
            <span class="material-symbols-outlined text-sm text-primary"
              >work</span
            >
            {{ job.modalidad || "Presencial" }}
          </span>
          <span
            class="px-3 py-1 bg-surface-container-low text-on-surface-variant dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 border border-outline-variant/40"
          >
            <span class="material-symbols-outlined text-sm text-emerald-600"
              >payments</span
            >
            {{
              job.salarioFormatted || formatSalaryDisplay(job) || "A convenir"
            }}
          </span>
          <span
            class="px-3 py-1 bg-surface-container-low text-on-surface-variant dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 border border-outline-variant/40"
          >
            <span class="material-symbols-outlined text-sm text-secondary"
              >location_on</span
            >
            {{
              job.ubicacionFormatted ||
              job.sector ||
              "Ubicación Georeferenciada"
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Job } from "~/types";

defineProps<{
  job: Job & {
    estadoBadge?: { badgeColor: string; label: string };
    ubicacionFormatted?: string;
  };
  formatSalaryDisplay?: (jobInfo: Job) => string | null;
}>();
</script>
