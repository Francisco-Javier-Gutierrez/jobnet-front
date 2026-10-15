<template>
  <div
    class="max-w-5xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <!-- Header -->
    <div
      class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-on-background mb-1">
          Bandeja de Incidencias (Moderador)
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Audita y revisa los reportes de publicaciones de empleo e incidencias
          generadas en JobNet.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/mod/audit-logs"
          class="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">policy</span>
          <span>Tabla de Auditoría</span>
        </NuxtLink>
        <NuxtLink
          to="/mod/support"
          class="px-4 py-2 bg-surface border border-outline-variant hover:border-primary text-on-surface-variant dark:text-slate-300 hover:text-primary text-xs font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">forum</span>
          <span>Centro de Disputas</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Success Feedback Notification -->
    <div
      v-if="successMsg"
      class="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 transition"
    >
      <span class="material-symbols-outlined text-sm">check_circle</span>
      <span>{{ successMsg }}</span>
    </div>

    <!-- Alerta de Concurrencia Anómala: Solo para Moderadores de Comunidad (Sober, compact, non-exaggerated) -->
    <ModeratorConcurrencyAlert
      v-if="isModerator && hasActiveAnomalies"
      :anomalies="anomalies"
      @pause="handlePreventivePause"
      @dismiss="dismissAnomaly"
    />

    <!-- Incidents Panel Component -->
    <IncidentsPanel />

    <!-- Sanction Modal (Intervención y Pausa Preventiva en 3 Fases) -->
    <SanctionModal
      v-model="isSanctionModalOpen"
      :selected-org="selectedOrg"
      :sanction-steps="sanctionSteps"
      v-model:suspension-reason-input="suspensionReasonInput"
      v-model:grace-days-input="graceDaysInput"
      :get-org-status-key="getOrgStatusKey"
      @apply-sanction="applySanction"
    />
  </div>
</template>

<script setup lang="ts">
import ModeratorConcurrencyAlert from "~/components/mod/ModeratorConcurrencyAlert.vue";
import SanctionModal from "~/components/admin/organizations/SanctionModal.vue";
import { useModeratorAnomalies } from "~/composables/useModeratorAnomalies";
import { useOrgActions } from "~/composables/useOrgActions";

useSeoMeta({
  title: "Bandeja de Incidencias - JobNet",
  description:
    "Bandeja de incidencias y reportes para moderadores y administradores en la plataforma JobNet",
});

const {
  isModerator,
  anomalies,
  hasActiveAnomalies,
  dismissAnomaly,
  refresh: refreshAnomalies,
} = useModeratorAnomalies();

const {
  isSanctionModalOpen,
  selectedOrg,
  suspensionReasonInput,
  graceDaysInput,
  sanctionSteps,
  getOrgStatusKey,
  applySanction,
  successMsg,
} = useOrgActions(async () => {
  await refreshAnomalies();
});

const handlePreventivePause = (org: {
  id: string;
  nombre: string;
  reason?: string;
}) => {
  selectedOrg.value = {
    id: org.id,
    nombre: org.nombre,
    estatus: "ACTIVO",
    estadoCuenta: "ACTIVO",
    suspensionStatus: "ACTIVE",
  };
  suspensionReasonInput.value =
    org.reason ||
    "Pausa preventiva por concurrencia anómala de actividad detectada en el portal.";
  graceDaysInput.value = 4;
  isSanctionModalOpen.value = true;
};
</script>
