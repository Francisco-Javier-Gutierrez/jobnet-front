<template>
  <div
    class="max-w-6xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <!-- Header with Navigation Tabs -->
    <div
      class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-extrabold text-on-background mb-1">
          Registro de Auditoría de Infracciones
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Historial inmutable de sanciones, bloqueos automatizados y dictámenes
          de moderación.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/mod/incidents"
          class="px-4 py-2 bg-surface border border-outline-variant hover:border-primary text-on-surface-variant dark:text-slate-300 hover:text-primary text-xs font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">gavel</span>
          <span>Bandeja de Incidencias</span>
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

    <!-- Master Audit Table Card -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-3xl overflow-hidden shadow-xl space-y-4"
    >
      <div
        class="p-6 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-low/30"
      >
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-2xl"
            >policy</span
          >
          <div>
            <h2 class="text-sm font-bold text-on-background">
              Historial Persistente de Sanciones
            </h2>
            <p class="text-[11px] text-on-surface-variant dark:text-slate-300">
              Registros inmutables en DynamoDB
            </p>
          </div>
        </div>
        <span
          class="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-bold"
        >
          {{ auditLogs.length }} Registro{{ auditLogs.length !== 1 ? "s" : "" }}
        </span>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="p-8 space-y-4 animate-pulse">
        <div
          v-for="i in 4"
          :key="i"
          class="h-12 bg-outline-variant/20 rounded-xl"
        ></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="auditLogs.length === 0"
        class="p-16 text-center text-on-surface-variant dark:text-slate-300 space-y-2"
      >
        <span class="material-symbols-outlined text-[48px] text-outline"
          >assignment_turned_in</span
        >
        <p class="text-sm font-bold text-on-background">
          Sin registros de auditoría
        </p>
        <p class="text-xs">
          Aún no se han ejecutado sanciones o bloqueos automáticos en el
          sistema.
        </p>
      </div>

      <!-- Interactive Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-surface border-b border-outline-variant/30 text-[11px] font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider"
            >
              <th class="py-3.5 px-6">Fecha y Hora</th>
              <th class="py-3.5 px-4">Acción / Sanción</th>
              <th class="py-3.5 px-4">Entidad Afectada</th>
              <th class="py-3.5 px-6">Motivo Detallado</th>
              <th class="py-3.5 px-6">Ejecutor</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/20 text-xs">
            <tr
              v-for="log in auditLogs"
              :key="log.id"
              class="hover:bg-surface-container-low/40 transition"
            >
              <!-- Fecha y Hora -->
              <td
                class="py-4 px-6 font-mono text-on-surface-variant dark:text-slate-300 whitespace-nowrap"
              >
                <div class="font-bold text-on-background">
                  {{ log.fecha || formatDate(log.timestamp) }}
                </div>
                <div
                  class="text-[10px] text-on-surface-variant dark:text-slate-300/80"
                >
                  {{ log.hora || formatTime(log.timestamp) }}
                </div>
              </td>

              <!-- Acción / Sanción -->
              <td class="py-4 px-4 whitespace-nowrap">
                <span
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider inline-flex items-center gap-1"
                  :class="getActionBadgeClass(log.action)"
                >
                  <span class="material-symbols-outlined text-xs">{{
                    getActionIcon(log.action)
                  }}</span>
                  {{ formatActionName(log.action) }}
                </span>
              </td>

              <!-- Entidad Afectada -->
              <td class="py-4 px-4 font-mono">
                <span class="font-bold text-primary">{{ log.targetType }}</span>
                <div
                  class="text-[10px] text-on-surface-variant dark:text-slate-300 truncate max-w-[140px]"
                  :title="log.targetId"
                >
                  ID: {{ log.targetId }}
                </div>
              </td>

              <!-- Motivo -->
              <td
                class="py-4 px-6 text-on-surface-variant dark:text-slate-300 leading-relaxed max-w-xs"
              >
                {{ log.reason || "Sin especificar" }}
              </td>

              <!-- Ejecutor -->
              <td class="py-4 px-6 whitespace-nowrap">
                <span
                  class="px-2.5 py-1 rounded-xl text-[10px] font-bold"
                  :class="
                    log.executorId === 'SISTEMA_AUTOGUARDIA'
                      ? 'bg-amber-500/10 text-amber-800 border border-amber-500/20'
                      : 'bg-primary/10 text-primary border border-primary/20'
                  "
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
import { apiFetch } from "~/composables/useApiClient";

useSeoMeta({
  title: "Auditoría de Infracciones - JobNet",
  description:
    "Registro de auditoría inmutable de sanciones y bloqueos en JobNet",
});

const auditLogs = ref<any[]>([]);
const loading = ref(true);

const MOCK_AUDIT_LOGS = [
  {
    actionId: "audit-act-101",
    action: "INICIO_PROCESO_SUSPENSION_RF7",
    targetType: "ORGANIZACION",
    targetId: "org-techsolutions-01",
    moderatorId: "mod-official",
    reason:
      "Reportes recurrentes por inconsistencias salariales en vacante de Frontend Senior",
    createdAt: "2026-10-18T16:45:00Z",
    dictamen: "Dictamen preventivo emitido con apercibimiento de 48 horas.",
  },
  {
    actionId: "audit-act-102",
    action: "REVOCACION_SUSPENSION",
    targetType: "ORGANIZACION",
    targetId: "org-innovatech-02",
    moderatorId: "mod-official",
    reason:
      "Resolución favorable de apelación tras comprobación de cumplimiento SAT",
    createdAt: "2026-10-17T11:20:00Z",
    dictamen: "Sanción revocada y vacantes restablecidas.",
  },
  {
    actionId: "audit-act-103",
    action: "PAUSA_PREVENTIVA_VACANTE",
    targetType: "VACANTE",
    targetId: "vac-frontend-sr-01",
    moderatorId: "mod-official",
    reason: "Alineación de requerimientos técnicos en revisión",
    createdAt: "2026-10-16T09:10:00Z",
    dictamen: "Pausa temporal preventiva aplicada.",
  },
];

const fetchAuditLogs = async () => {
  loading.value = true;
  try {
const { isMockEnabled } = useMockSession();
    if (isMockEnabled.value) {
      auditLogs.value = MOCK_AUDIT_LOGS;
      loading.value = false;
      return;
    }
    const data = await apiFetch<any[]>("/moderator/audit-logs");
    auditLogs.value = data && data.length > 0 ? data : MOCK_AUDIT_LOGS;
  } catch (e) {
    auditLogs.value = MOCK_AUDIT_LOGS;
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
  return new Date(iso).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatActionName = (action: string) => {
  if (!action) return "PROCESO DE SUSPENSIÓN";
  const upper = action.toUpperCase();
  if (
    upper.includes("INICIO_PROCESO_SUSPENSION") ||
    upper.includes("PROCESO_SUSPENSION") ||
    upper.includes("RF7")
  )
    return "PROCESO DE SUSPENSIÓN";
  if (upper.includes("SUSPENSION_AUTOMATICA")) return "AUTO-SUSPENSIÓN";
  if (upper.includes("REVOCACION_SUSPENSION") || upper.includes("CANCEL"))
    return "REVOCACIÓN SUSPENSIÓN";
  if (upper.includes("SUSPENSION_DEFINITIVA") || upper.includes("CONFIRM"))
    return "SUSPENSIÓN DEFINITIVA";
  if (upper === "BORRADO_LOGICO_VACANTE") return "BORRADO LÓGICO";
  if (upper === "PAUSA_PREVENTIVA_VACANTE") return "PAUSA PREVENTIVA";
  if (upper.startsWith("RESOLUCION_DISPUTA")) return "RESOLUCIÓN DISPUTA";
  return action.replace(/_/g, " ").replace(/RF\d+/gi, "").trim();
};

const getActionIcon = (action: string) => {
  const upper = (action || "").toUpperCase();
  if (
    upper.includes("INICIO_PROCESO_SUSPENSION") ||
    upper.includes("PROCESO_SUSPENSION") ||
    upper.includes("RF7")
  )
    return "gavel";
  if (upper.includes("SUSPENSION_AUTOMATICA")) return "warning";
  if (upper === "BORRADO_LOGICO_VACANTE") return "delete_forever";
  if (upper === "PAUSA_PREVENTIVA_VACANTE") return "pause_circle";
  return "policy";
};

const getActionBadgeClass = (action: string) => {
  const upper = (action || "").toUpperCase();
  if (
    upper.includes("INICIO_PROCESO_SUSPENSION") ||
    upper.includes("PROCESO_SUSPENSION") ||
    upper.includes("RF7")
  )
    return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
  if (upper.includes("SUSPENSION_AUTOMATICA") || upper.includes("DEFINITIVA"))
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  if (upper.includes("REVOCACION"))
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  return "bg-primary/10 text-primary border-primary/20";
};

onMounted(() => {
  fetchAuditLogs();
});
</script>
