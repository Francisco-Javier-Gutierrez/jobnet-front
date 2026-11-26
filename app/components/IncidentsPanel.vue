<template>
  <!-- Incident list card -->
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
  >
    <div
      class="p-6 border-b border-outline-variant/60 flex flex-col md:flex-row md:items-center justify-between bg-surface-container-low/20 gap-4"
    >
      <div class="flex items-center gap-4">
        <h2 class="text-sm font-bold text-on-background">Denuncias en cola</h2>
        <span
          class="bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full font-bold"
          >{{ displayedIncidents.length }} Pendiente{{
            displayedIncidents.length !== 1 ? "s" : ""
          }}</span
        >
      </div>
      <div
        class="flex flex-wrap gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/50"
      >
        <button
          @click="activeTab = 'ALL'"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-md transition',
            activeTab === 'ALL'
              ? 'bg-primary text-white'
              : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low',
          ]"
        >
          Todas
        </button>
        <button
          @click="activeTab = 'VACANTE'"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-md transition',
            activeTab === 'VACANTE'
              ? 'bg-primary text-white'
              : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low',
          ]"
        >
          Vacantes
        </button>
        <button
          @click="activeTab = 'POST'"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-md transition',
            activeTab === 'POST'
              ? 'bg-primary text-white'
              : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low',
          ]"
        >
          Publicaciones
        </button>
        <button
          @click="activeTab = 'ORGANIZACION'"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-md transition',
            activeTab === 'ORGANIZACION'
              ? 'bg-primary text-white'
              : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low',
          ]"
        >
          Organizaciones
        </button>
        <button
          @click="activeTab = 'CHAT'"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-md transition',
            activeTab === 'CHAT'
              ? 'bg-primary text-white'
              : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low',
          ]"
        >
          Chats
        </button>
      </div>
    </div>

    <!-- Notification Feedback for Audit and Dispute Actions -->
    <div
      v-if="auditSuccess"
      class="m-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 transition"
    >
      <span class="material-symbols-outlined text-sm">check_circle</span>
      <span>{{ auditSuccess }}</span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="p-8 space-y-6">
      <div
        v-for="n in 2"
        :key="n"
        class="animate-pulse flex flex-col sm:flex-row justify-between gap-4"
      >
        <div class="flex-grow space-y-2">
          <div class="h-3 bg-outline-variant/30 rounded w-16"></div>
          <div class="h-4 bg-outline-variant/30 rounded w-1/3"></div>
          <div class="h-3 bg-outline-variant/30 rounded w-1/4"></div>
          <div class="h-3 bg-outline-variant/30 rounded w-2/3"></div>
        </div>
        <div class="h-10 bg-outline-variant/30 rounded w-32 self-center"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="displayedIncidents.length === 0"
      class="p-12 text-center flex flex-col items-center justify-center text-on-surface-variant dark:text-slate-300"
    >
      <span class="material-symbols-outlined text-[48px] text-primary/40 mb-3"
        >gavel</span
      >
      <p class="text-sm font-semibold text-on-surface">
        Sin incidencias activas
      </p>
      <p class="text-xs text-on-surface-variant dark:text-slate-300 mt-1">
        No hay reportes de vacantes u organizaciones pendientes de revisión.
      </p>
    </div>

    <!-- Incidents list -->
    <div v-else class="divide-y divide-outline-variant/30">
      <div
        v-for="inc in displayedIncidents"
        :key="inc.id"
        class="p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-2">
            <span
              class="text-[9px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"
            >
              #{{ inc.id.substring(0, 8) }}
            </span>
            <span
              class="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-rose-500/10 text-rose-600 border border-rose-500/20"
            >
              {{ inc.severity }}
            </span>
            <span
              class="text-[10px] bg-outline-variant/40 text-on-surface-variant dark:text-slate-300 px-2 py-0.5 rounded font-bold uppercase"
              >{{ inc.infraccion }}</span
            >
            <span
              class="text-xs text-on-surface-variant dark:text-slate-300"
              v-if="inc.fechaCreacion"
            >
              {{ new Date(inc.fechaCreacion).toLocaleDateString() }}
            </span>

            <!-- Concurrency Assignment Badge -->
            <span
              v-if="inc.assignedModeratorId === currentUserId"
              class="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5"
            >
              <span class="material-symbols-outlined text-[11px]">check</span>
              Asignado a ti
            </span>
            <span
              v-else-if="inc.assignedModeratorId"
              class="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center gap-0.5"
              :title="
                'Asignado a: ' + (inc.assignedModeratorName || 'Moderador')
              "
            >
              <span class="material-symbols-outlined text-[11px]">lock</span>
              En atención: {{ inc.assignedModeratorName || "Moderador" }}
            </span>
            <span
              v-else
              class="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            >
              Sin Asignar
            </span>
          </div>
          <h3 class="text-sm font-bold text-on-background mb-1">
            {{
              inc.targetType === "POST"
                ? "Publicación"
                : inc.targetType === "VACANTE"
                  ? "Vacante"
                  : inc.targetType === "ORGANIZACION"
                    ? "Organización"
                    : inc.targetType === "CHAT"
                      ? "Conversación"
                      : "Contenido"
            }}: {{ inc.targetTitle || inc.jobTitle }}
          </h3>
          <p class="text-xs text-primary font-semibold mb-2">
            Reportado por: {{ inc.reporter }}
          </p>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed mb-3"
          >
            {{ inc.reason }}
          </p>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-if="inc.jobId"
              :to="`/jobs/${inc.jobId}`"
              class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container transition hover:underline"
            >
              <span class="material-symbols-outlined text-sm">work</span>
              Revisar Vacante
            </NuxtLink>
            <NuxtLink
              v-if="inc.postId"
              :to="`/posts/${inc.postId}`"
              class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container transition hover:underline"
            >
              <span class="material-symbols-outlined text-sm">article</span>
              Revisar Publicación
            </NuxtLink>
            <NuxtLink
              v-if="inc.companyId && inc.targetType === 'ORGANIZACION'"
              :to="`/company/${inc.companyId}`"
              class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container transition hover:underline"
            >
              <span class="material-symbols-outlined text-sm">domain</span>
              Revisar Organización
            </NuxtLink>
          </div>
        </div>

        <div
          class="flex flex-wrap items-center gap-2 flex-shrink-0 self-center"
        >
          <!-- Concurrency lock: In progress by another moderator -->
          <div
            v-if="isLockedByOther(inc)"
            class="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 font-medium"
            :title="
              'Incidencia asignada al moderador ' +
              (inc.assignedModeratorName || 'otro moderador')
            "
          >
            <span class="material-symbols-outlined text-sm">lock</span>
            <span
              >En atención por
              {{ inc.assignedModeratorName || "otro moderador" }}</span
            >
          </div>

          <template v-else>
            <!-- Dispute Messaging Audit Actions (Fase 1 y Fase 2) -->
            <template
              v-if="
                inc.targetType === 'VACANTE' ||
                inc.targetType === 'CHAT' ||
                inc.jobId ||
                isSeriousInfraction(inc.infraccion)
              "
            >
              <button
                v-if="
                  inc.auditState === 'AUDIT_ACTIVE' ||
                  inc.estatus === 'AUDITORIA'
                "
                type="button"
                @click="inspectAuditChat(inc)"
                class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
                title="Inspeccionar historial íntegro de mensajes en solo lectura y dictaminar (Fase 2)"
              >
                <span class="material-symbols-outlined text-sm"
                  >visibility</span
                >
                <span>Inspeccionar Auditoría</span>
              </button>
              <button
                v-else-if="inc.auditState !== 'AUDIT_CONCLUDED'"
                type="button"
                @click="openAudit(inc)"
                class="bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5"
                title="Admitir controversia y notificar apertura de auditoría a ambas partes (Fase 1)"
              >
                <span class="material-symbols-outlined text-sm">policy</span>
                <span>Auditar Mensajes</span>
              </button>
            </template>

            <!-- For reports in EVALUACION (under appeal) -->
            <template
              v-if="inc.estatus === 'EVALUACION' || inc.status === 'EVALUACION'"
            >
              <span
                class="text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-1 rounded border border-amber-200 dark:border-amber-800 uppercase tracking-wide"
                >En Apelación</span
              >
              <NuxtLink
                to="/mod/appeals"
                class="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-sm">forum</span>
                Atender Apelación
              </NuxtLink>
            </template>

            <!-- For raw reports PENDIENTE -->
            <template v-else-if="inc.estatus !== 'AUDITORIA'">
              <button
                @click="resolve(inc.id, 'approve')"
                class="bg-surface border border-outline-variant/60 hover:bg-surface-container text-on-surface font-semibold text-xs px-3.5 py-2 rounded-xl transition shadow-sm"
              >
                Ignorar
              </button>
              <button
                v-if="inc.targetType !== 'POST'"
                :disabled="processingId === inc.id"
                @click="resolve(inc.id, 'evaluate')"
                class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1 disabled:opacity-50"
              >
                <span
                  v-if="processingId === inc.id"
                  class="material-symbols-outlined text-sm animate-spin"
                  >progress_activity</span
                >
                <span v-else class="material-symbols-outlined text-sm"
                  >pause_circle</span
                >
                <span>{{
                  inc.targetType === "VACANTE" || inc.jobId
                    ? "Pausar Vacante"
                    : "Pausar (Evaluar)"
                }}</span>
              </button>
              <button
                v-else
                @click="resolve(inc.id, 'reject')"
                class="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-sm">delete</span>
                Eliminar
              </button>
            </template>
          </template>
        </div>
      </div>
    </div>

    <!-- Dispute Audit Modal: Fase 2 -->
    <DisputeAuditModal
      v-model="isAuditModalOpen"
      :incident="selectedIncident"
      :messages="chatMessages"
      :loading="isLoadingChat"
      :submitting="isSubmittingDictum"
      :error="auditError"
      v-model:dictum-action="dictumAction"
      v-model:dictum-notes="dictumNotes"
      @submit="submitDictum"
    />
  </div>
</template>

<script setup lang="ts">
import type { Incident } from "~/types";
import { MOCK_INCIDENTS } from "~/utils/mockData";
import { useMockSession } from "~/composables/useMockSession";
import DisputeAuditModal from "~/components/mod/DisputeAuditModal.vue";
import { useDisputeAudit } from "~/composables/useDisputeAudit";
import { apiFetch } from "~/composables/useApiClient";
import { useAppFeedback } from "~/composables/useAppFeedback";

const { data: session } = useAuth();
const { showError } = useAppFeedback();

const userRole = computed(() => {
  const user = session.value?.user;
  return (user?.tipoUsuario || "").toUpperCase();
});

const currentUserId = computed(() => {
  const u: any = session.value?.user;
  return u?.id || u?.uuid || u?.sub || "";
});

const isLockedByOther = (inc: any) => {
  return (
    inc.assignedModeratorId &&
    inc.assignedModeratorId !== currentUserId.value &&
    userRole.value !== "ADMIN"
  );
};

const incidents = ref<Incident[]>([]);
const loading = ref(true);
const activeTab = ref("ALL");

const {
  isAuditModalOpen,
  selectedIncident,
  chatMessages,
  isLoadingChat,
  isSubmittingDictum,
  dictumAction,
  dictumNotes,
  errorMsg: auditError,
  successMsg: auditSuccess,
  openAudit,
  inspectAuditChat,
  submitDictum,
} = useDisputeAudit(async () => {
  await fetchIncidents();
});

const isSeriousInfraction = (infraccion?: string) => {
  if (!infraccion) return false;
  const inf = infraccion.toUpperCase();
  return (
    inf.includes("FRAUDE") ||
    inf.includes("SALARIO") ||
    inf.includes("DISCREPANCIA") ||
    inf.includes("ACOSO") ||
    inf.includes("DISCRIMINACION")
  );
};

const displayedIncidents = computed(() => {
  let list = incidents.value;

  if (activeTab.value !== "ALL") {
    list = list.filter(
      (inc) =>
        inc.targetType === activeTab.value ||
        (activeTab.value === "ORGANIZACION" && inc.targetType === "EMPRESA"),
    );
  }

  return list;
});

const processingId = ref<string | null>(null);

const fetchIncidents = async (initial = false) => {
  if (initial) loading.value = true;
  const { isMockEnabled } = useMockSession();
  if (isMockEnabled.value) {
    incidents.value = MOCK_INCIDENTS;
    loading.value = false;
    return;
  }
      );
      if (idx !== -1) {
        incidents.value[idx] = {
          ...incidents.value[idx],
          status: "EVALUACION",
          estatus: "EVALUACION",
        };
        incidents.value = [...incidents.value];
      }
    } else {
      incidents.value = incidents.value.filter(
        (i) => i.id !== id && (i as any).incidentId !== id && i.targetId !== id,
      );
    }
    // Re-fetch in background to synchronize any server-side cascades immediately
    await fetchIncidents(false);
  } catch (e: any) {
    console.error("Error resolving incident:", e);
    showError(e?.data?.error || e?.message || "Error al resolver incidencia.");
  } finally {
    processingId.value = null;
  }
};
</script>
