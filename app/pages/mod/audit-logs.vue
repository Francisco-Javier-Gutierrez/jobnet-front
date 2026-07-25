<template>
  <div class="max-w-6xl mx-auto px-4 py-8 w-full bg-background min-h-screen">
    <!-- Header with Navigation Tabs -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-on-background mb-1">
          Registro de Auditoría de Infracciones (RF-73)
        </h1>
        <p class="text-on-surface-variant text-sm">
          Historial inmutable de sanciones, bloqueos automatizados y dictámenes de moderación.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/mod/incidents"
          class="px-4 py-2 bg-surface border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary text-xs font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">gavel</span>
          <span>Bandeja de Incidencias</span>
        </NuxtLink>
        <NuxtLink
          to="/mod/support"
          class="px-4 py-2 bg-surface border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary text-xs font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">forum</span>
          <span>Centro de Disputas</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Master Audit Table Card -->
    <div class="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl overflow-hidden shadow-xl space-y-4">
      <div class="p-6 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-low/30">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-2xl">policy</span>
          <div>
            <h2 class="text-sm font-bold text-on-background">Historial Persistente de Sanciones</h2>
            <p class="text-[11px] text-on-surface-variant">Registros inmutables en DynamoDB</p>
          </div>
        </div>
        <span class="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-bold">
          {{ auditLogs.length }} Registro{{ auditLogs.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="p-8 space-y-4 animate-pulse">
        <div v-for="i in 4" :key="i" class="h-12 bg-outline-variant/20 rounded-xl"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="auditLogs.length === 0" class="p-16 text-center text-on-surface-variant space-y-2">
        <span class="material-symbols-outlined text-[48px] text-outline">assignment_turned_in</span>
        <p class="text-sm font-bold text-on-background">Sin registros de auditoría</p>
        <p class="text-xs">Aún no se han ejecutado sanciones o bloqueos automáticos en el sistema.</p>
      </div>

      <!-- Interactive Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface border-b border-outline-variant/30 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              <th class="py-3.5 px-6">Fecha y Hora</th>
              <th class="py-3.5 px-4">Acción / Sanción</th>
              <th class="py-3.5 px-4">Entidad Afectada</th>
              <th class="py-3.5 px-6">Motivo Detallado</th>
              <th class="py-3.5 px-6">Ejecutor</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/20 text-xs">
            <tr v-for="log in auditLogs" :key="log.id" class="hover:bg-surface-container-low/40 transition">
              <!-- Fecha y Hora -->
              <td class="py-4 px-6 font-mono text-on-surface-variant whitespace-nowrap">
                <div class="font-bold text-on-background">{{ log.fecha || formatDate(log.timestamp) }}</div>
                <div class="text-[10px] text-on-surface-variant/80">{{ log.hora || formatTime(log.timestamp) }}</div>
              </td>

              <!-- Acción / Sanción -->
              <td class="py-4 px-4 whitespace-nowrap">
                <span
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider inline-flex items-center gap-1"
                  :class="getActionBadgeClass(log.action)"
                >
                  <span class="material-symbols-outlined text-xs">{{ getActionIcon(log.action) }}</span>
                  {{ formatActionName(log.action) }}
                </span>
              </td>

              <!-- Entidad Afectada -->
              <td class="py-4 px-4 font-mono">
                <span class="font-bold text-primary">{{ log.targetType }}</span>
                <div class="text-[10px] text-on-surface-variant truncate max-w-[140px]" :title="log.targetId">
                  ID: {{ log.targetId }}
                </div>
              </td>

              <!-- Motivo -->
              <td class="py-4 px-6 text-on-surface-variant leading-relaxed max-w-xs">
                {{ log.reason || "Sin especificar" }}
              </td>

              <!-- Ejecutor -->
              <td class="py-4 px-6 whitespace-nowrap">
                <span
                  class="px-2.5 py-1 rounded-xl text-[10px] font-bold"
                  :class="log.executorId === 'SISTEMA_AUTOGUARDIA' ? 'bg-amber-500/10 text-amber-800 border border-amber-500/20' : 'bg-primary/10 text-primary border border-primary/20'"
                >
                  🤖 {{ log.executorId }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

useSeoMeta({
  title: "Auditoría de Infracciones - JobNet",
  description: "Registro de auditoría inmutable de sanciones y bloqueos en JobNet",
});

const config = useRuntimeConfig();
const auditLogs = ref<any[]>([]);
const loading = ref(true);

const fetchAuditLogs = async () => {
  loading.value = true;
  try {
    const data = await $fetch<any[]>(`${config.public.apiUrl}/moderator/audit-logs`);
    auditLogs.value = data || [];
  } catch (e) {
    console.error("Error loading audit logs:", e);
  } finally {
    loading.value = false;
  }
};

const formatDate = (iso: string) => {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("es-MX");
};

const formatTime = (iso: string) => {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
};

const formatActionName = (action: string) => {
  if (action === "SUSPENSION_AUTOMATICA_RF72") return "AUTO-SUSPENSIÓN (RF-72)";
  if (action === "BORRADO_LOGICO_VACANTE") return "BORRADO LÓGICO";
  if (action === "PAUSA_PREVENTIVA_VACANTE") return "PAUSA PREVENTIVA";
  if (action.startsWith("RESOLUCION_DISPUTA")) return "RESOLUCIÓN DISPUTA";
  return action;
};

const getActionIcon = (action: string) => {
  if (action === "SUSPENSION_AUTOMATICA_RF72") return "warning";
  if (action === "BORRADO_LOGICO_VACANTE") return "delete_forever";
  if (action === "PAUSA_PREVENTIVA_VACANTE") return "pause_circle";
  return "gavel";
};

const getActionBadgeClass = (action: string) => {
  if (action === "SUSPENSION_AUTOMATICA_RF72") return "bg-rose-500/10 text-rose-600 border-rose-500/20";
  if (action === "BORRADO_LOGICO_VACANTE") return "bg-rose-500/10 text-rose-700 border-rose-500/30";
  if (action === "PAUSA_PREVENTIVA_VACANTE") return "bg-amber-500/10 text-amber-700 border-amber-500/20";
  return "bg-primary/10 text-primary border-primary/20";
};

onMounted(() => {
  fetchAuditLogs();
});
</script>
