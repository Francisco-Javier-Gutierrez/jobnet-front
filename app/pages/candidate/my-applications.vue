<template>
  <div
    class="max-w-6xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <!-- Header -->
    <div
      class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-on-background mb-1">
          Historial de Solicitudes
        </h1>
        <p
          class="text-on-surface-variant dark:text-slate-300 text-xs sm:text-sm"
        >
          Registro histórico de todas las vacantes en las que te has postulado,
          con su estatus vigente de selección y retroalimentación transparente.
        </p>
      </div>

      <!-- Quick Stats Badges -->
      <div class="flex items-center gap-2 flex-wrap">
        <span
          class="text-xs font-semibold px-3 py-1.5 rounded-xl bg-surface-container-low dark:bg-slate-900 border border-outline-variant/60 text-on-surface"
        >
          Total:
          <strong class="text-primary">{{
            filteredApplications.length
          }}</strong>
        </span>
        <span
          class="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
        >
          Activas: <strong>{{ activeCount }}</strong>
        </span>
        <span
          class="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300"
        >
          Descartadas: <strong>{{ rejectedCount }}</strong>
        </span>
      </div>
    </div>

    <!-- Filtros y Búsqueda -->
    <div
      class="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-xl p-3 shadow-xs"
    >
      <div class="relative flex-1">
        <span
          class="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm"
          >search</span
        >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por puesto u organización receptora..."
          class="w-full pl-9 pr-3 py-1.5 text-xs bg-surface dark:bg-slate-800 border border-outline-variant/60 focus:border-primary rounded-lg text-on-background outline-none transition"
        />
      </div>

      <div class="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
        <button
          v-for="filter in statusFilters"
          :key="filter.value"
          type="button"
          @click="selectedStatusFilter = filter.value"
          :class="[
            selectedStatusFilter === filter.value
              ? 'bg-primary text-white font-bold'
              : 'bg-surface dark:bg-slate-800 border border-outline-variant/60 text-on-surface-variant hover:text-on-background font-medium',
          ]"
          class="px-3 py-1.5 rounded-lg text-xs transition whitespace-nowrap cursor-pointer"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Card Contenedora con Tabla Histórica -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
    >
      <!-- Loading State -->
      <div
        v-if="loading"
        class="p-12 text-center text-on-surface-variant dark:text-slate-400"
      >
        <span
          class="material-symbols-outlined text-3xl animate-spin text-primary"
          >sync</span
        >
        <p class="mt-2 text-xs font-semibold">
          Cargando historial de solicitudes...
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredApplications.length === 0"
        class="text-center py-16 px-4 text-on-surface-variant dark:text-slate-400"
      >
        <span class="material-symbols-outlined text-[48px] mb-2 text-outline"
          >work_history</span
        >
        <h2
          class="text-base font-bold text-on-background dark:text-slate-100 mb-1"
        >
          No se encontraron solicitudes
        </h2>
        <p class="text-xs max-w-sm mx-auto mb-4">
          {{
            searchQuery || selectedStatusFilter !== "ALL"
              ? "No hay registros que coincidan con los filtros seleccionados."
              : "Aún no te has postulado a ninguna vacante. Explora las oportunidades laborales disponibles."
          }}
        </p>
        <NuxtLink
          to="/vacancies"
          class="inline-block bg-primary hover:bg-primary-container text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
        >
          Explorar Vacantes
        </NuxtLink>
      </div>

      <!-- Tabla Histórica Formal y Responsiva -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              class="border-b border-outline-variant/60 bg-surface-container-low/50 dark:bg-slate-950/80 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider select-none"
            >
              <th scope="col" class="py-3 px-4">Puesto / Vacante</th>
              <th scope="col" class="py-3 px-4">Organización Receptora</th>
              <th scope="col" class="py-3 px-4 whitespace-nowrap">
                Fecha Postulación
              </th>
              <th scope="col" class="py-3 px-4">Estatus Vigente</th>
              <th scope="col" class="py-3 px-4">Retroalimentación / Motivo</th>
              <th scope="col" class="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody
            class="divide-y divide-outline-variant/30 dark:divide-slate-800"
          >
            <tr
              v-for="app in filteredApplications"
              :key="app.jobId"
              class="hover:bg-surface-container-low/20 transition-colors"
            >
              <!-- 1. Puesto / Vacante -->
              <td
                class="py-3.5 px-4 font-semibold text-on-background dark:text-slate-100 max-w-xs"
              >
                <NuxtLink
                  :to="`/jobs/${app.jobId}`"
                  class="hover:text-primary hover:underline block truncate font-bold text-xs"
                  :title="app.jobTitle"
                >
                  {{ app.jobTitle }}
                </NuxtLink>
                <span
                  class="text-[10px] text-on-surface-variant/70 font-normal"
                >
                  ID: {{ app.jobId }}
                </span>
              </td>

              <!-- 2. Organización Receptora -->
              <td
                class="py-3.5 px-4 text-on-surface-variant dark:text-slate-300"
              >
                <div class="flex items-center gap-1.5 font-medium">
                  <span
                    class="material-symbols-outlined text-sm text-slate-400 shrink-0"
                    >business</span
                  >
                  <span class="truncate max-w-[160px]" :title="app.companyName">
                    {{ app.companyName }}
                  </span>
                </div>
              </td>

              <!-- 3. Fecha de Postulación -->
              <td
                class="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap"
              >
                {{ formatDate(app.appliedAt) }}
              </td>

              <!-- 4. Estatus Vigente de Selección -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span
                  :class="getStatusClass(app.status)"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-2xs"
                >
                  <span class="material-symbols-outlined text-[13px]">
                    {{ getStatusIcon(app.status) }}
                  </span>
                  <span>{{ getStatusLabel(app.status) }}</span>
                </span>
              </td>

              <!-- 5. Retroalimentación / Motivo Estandarizado de Descarte -->
              <td class="py-3.5 px-4 max-w-xs">
                <!-- Caso Rechazado: Despliegue Transparente del Motivo Estandarizado -->
                <div v-if="app.status === 'RECHAZADO'" class="space-y-1">
                  <!-- Tag Motivo Estandarizado -->
                  <div class="flex items-center gap-1 flex-wrap">
                    <span
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border"
                      :class="getStandardReasonBadgeClass(app.motivoRechazo)"
                    >
                      <span class="material-symbols-outlined text-[12px]">
                        {{ getStandardReasonIcon(app.motivoRechazo) }}
                      </span>
                      <span>{{
                        getStandardReasonCategory(app.motivoRechazo)
                      }}</span>
                    </span>
                  </div>

                  <!-- Mensaje Constructivo Específico -->
                  <p
                    class="text-[11px] text-slate-600 dark:text-slate-300 italic line-clamp-2"
                    :title="app.motivoRechazo || 'Proceso concluido'"
                  >
                    "{{
                      app.motivoRechazo ||
                      "Perfil cubierto durante el proceso de selección."
                    }}"
                  </p>
                </div>

                <!-- Caso En Proceso / Seleccionado / Contratado -->
                <div
                  v-else
                  class="text-[11px] text-on-surface-variant flex items-center gap-1"
                >
                  <span
                    class="material-symbols-outlined text-xs text-primary shrink-0"
                    >check_circle</span
                  >
                  <span>{{ getActiveStageFeedback(app.status) }}</span>
                </div>
              </td>

              <!-- 6. Acciones -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    @click="openDetailModal(app)"
                    class="px-2.5 py-1 rounded-lg border border-outline-variant/60 hover:border-primary/50 text-on-surface hover:text-primary transition font-semibold text-[11px] cursor-pointer"
                    title="Ver detalle de postulación y retroalimentación"
                  >
                    Detalle
                  </button>

                  <NuxtLink
                    :to="`/jobs/${app.jobId}`"
                    class="p-1 rounded-lg text-primary hover:bg-primary/10 transition cursor-pointer"
                    title="Ver publicación completa"
                  >
                    <span class="material-symbols-outlined text-base"
                      >open_in_new</span
                    >
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Detalle Transparente de Postulación -->
    <AppModal
      v-model="isDetailModalOpen"
      title="Expediente de Postulación"
      subtitle="Detalles históricos de tu postulación y retroalimentación de la empresa"
      icon="assignment"
      max-width="lg"
    >
      <div v-if="selectedApp" class="space-y-4">
        <!-- Resumen de Puesto y Empresa -->
        <div
          class="p-3.5 rounded-xl bg-surface-container-low dark:bg-slate-800/80 border border-outline-variant/40 space-y-1"
        >
          <h3 class="text-xs font-bold text-on-background dark:text-slate-100">
            {{ selectedApp.jobTitle }}
          </h3>
          <p
            class="text-xs text-on-surface-variant flex items-center gap-1 font-medium"
          >
            <span class="material-symbols-outlined text-sm">business</span>
            {{ selectedApp.companyName }}
          </p>
          <div
            class="text-[10px] text-slate-500 dark:text-slate-400 pt-1 flex items-center gap-3"
          >
            <span>Fecha: {{ formatDate(selectedApp.appliedAt) }}</span>
            <span>•</span>
            <span class="font-bold text-primary"
              >Estatus: {{ getStatusLabel(selectedApp.status) }}</span
            >
          </div>
        </div>

        <!-- Sección de Retroalimentación en caso de Descarte -->
        <div
          v-if="selectedApp.status === 'RECHAZADO'"
          class="p-4 rounded-xl border border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20 space-y-2"
        >
          <div
            class="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs"
          >
            <span class="material-symbols-outlined text-base">feedback</span>
            <span>Retroalimentación Transparente del Proceso:</span>
          </div>

          <div
            class="bg-surface dark:bg-slate-900 p-3 rounded-lg border border-outline-variant/40"
          >
            <div class="flex items-center gap-2 mb-1">
              <span
                class="px-2 py-0.5 rounded text-[10px] font-bold border"
                :class="getStandardReasonBadgeClass(selectedApp.motivoRechazo)"
              >
                {{ getStandardReasonCategory(selectedApp.motivoRechazo) }}
              </span>
            </div>
            <p
              class="text-xs text-on-background dark:text-slate-200 italic leading-relaxed"
            >
              "{{
                selectedApp.motivoRechazo ||
                "La organización concluyó la selección con perfiles que se alineaban estrechamente a la vacante."
              }}"
            </p>
          </div>
          <p class="text-[10px] text-on-surface-variant dark:text-slate-400">
            Esta retroalimentación constructiva busca apoyarte en enfocar tus
            próximas postulaciones laborales.
          </p>
        </div>

        <!-- Carta de Presentación enviada -->
        <div v-if="selectedApp.coverLetter" class="space-y-1">
          <label class="text-[11px] font-bold text-on-surface-variant block">
            Mensaje o Carta de Presentación Enviada:
          </label>
          <div
            class="p-3 bg-surface-container-low dark:bg-slate-800 rounded-xl border border-outline-variant/40 text-xs text-on-background whitespace-pre-wrap"
          >
            {{ selectedApp.coverLetter }}
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center w-full">
          <NuxtLink
            v-if="selectedApp"
            :to="`/jobs/${selectedApp.jobId}`"
            class="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            Ver Vacante Completa
            <span class="material-symbols-outlined text-sm">open_in_new</span>
          </NuxtLink>
          <button
            type="button"
            @click="isDetailModalOpen = false"
            class="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { useAuth, useRuntimeConfig, useRouter } from "#imports";
import { getAuthHeaders } from "~/composables/useApiClient";

definePageMeta({
  middleware: ["auth"],
});

useSeoMeta({
  title: "Historial de Solicitudes - JobNet",
  description:
    "Registro histórico de postulaciones con estatus y retroalimentación transparente",
});

const { data: session, status } = useAuth();
const config = useRuntimeConfig();
const router = useRouter();

const loading = ref(true);
const applications = ref<any[]>([]);
const searchQuery = ref("");
const selectedStatusFilter = ref("ALL");

// Modal de detalle
const isDetailModalOpen = ref(false);
const selectedApp = ref<any>(null);

const statusFilters = [
  { label: "Todas", value: "ALL" },
  { label: "En Proceso", value: "ACTIVE" },
  { label: "Seleccionadas", value: "SELECCIONADO" },
  { label: "Descartadas", value: "RECHAZADO" },
];

const fetchApplications = async () => {
  if (status.value !== "authenticated") {
    router.push("/login");
    return;
  }

  const userRole = (
    (session.value?.user as any)?.tipoUsuario ||
    (session.value?.user as any)?.role ||
    ""
  ).toUpperCase();

  if (userRole && userRole !== "CANDIDATO") {
    router.push("/");
    return;
  }

  loading.value = true;
  try {
    const candidateId = session.value?.user?.id || "";

    const apps = await $fetch<any[]>(
      `${config.public.apiUrl}/applications?candidateId=${candidateId}`,
      { headers: getAuthHeaders() },
    ).catch(() => []);

    if (apps && apps.length > 0) {
      // Enrich with job info
      const enrichedApps = await Promise.all(
        apps.map(async (a) => {
          let jobTitle = "Vacante no disponible";
          let companyName = "Empresa no disponible";
          try {
            const jobDetail = await $fetch<any>(
              `${config.public.apiUrl}/jobs/${a.jobId}`,
            );
            if (jobDetail) {
              jobTitle = jobDetail.title || jobDetail.titulo;
              companyName = jobDetail.company;
            }
          } catch (e) {}
          return { ...a, jobTitle, companyName };
        }),
      );

      applications.value = enrichedApps.sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
      );
    } else {
      applications.value = [];
    }
  } catch (e) {
    console.error("Error loading candidate applications:", e);
    applications.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchApplications();
});

const filteredApplications = computed(() => {
  let list = applications.value;

  // Filtro por Estatus
  if (selectedStatusFilter.value === "ACTIVE") {
    list = list.filter(
      (a) => a.status === "PENDIENTE" || a.status === "EN_CONTACTO",
    );
  } else if (selectedStatusFilter.value !== "ALL") {
    list = list.filter((a) => a.status === selectedStatusFilter.value);
  }

  // Búsqueda por texto
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.jobTitle?.toLowerCase().includes(q) ||
        a.companyName?.toLowerCase().includes(q) ||
        a.motivoRechazo?.toLowerCase().includes(q),
    );
  }

  return list;
});

const activeCount = computed(() => {
  return applications.value.filter(
    (a) =>
      a.status === "PENDIENTE" ||
      a.status === "EN_CONTACTO" ||
      a.status === "SELECCIONADO",
  ).length;
});

const rejectedCount = computed(() => {
  return applications.value.filter((a) => a.status === "RECHAZADO").length;
});

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function openDetailModal(app: any) {
  selectedApp.value = app;
  isDetailModalOpen.value = true;
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    PENDIENTE: "Pendiente",
    EN_CONTACTO: "En contacto",
    SELECCIONADO: "Seleccionado",
    RECHAZADO: "Descartado",
    CONTRATADO: "Contratado",
  };
  return map[status] || status;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDIENTE":
      return "hourglass_empty";
    case "EN_CONTACTO":
      return "forum";
    case "SELECCIONADO":
      return "stars";
    case "RECHAZADO":
      return "cancel";
    case "CONTRATADO":
      return "verified";
    default:
      return "info";
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "PENDIENTE":
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    case "EN_CONTACTO":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800";
    case "SELECCIONADO":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
    case "RECHAZADO":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800";
    case "CONTRATADO":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

function getActiveStageFeedback(status: string) {
  switch (status) {
    case "PENDIENTE":
      return "Postulación recibida en espera de revisión";
    case "EN_CONTACTO":
      return "El reclutador se encuentra en comunicación";
    case "SELECCIONADO":
      return "¡Perfil seleccionado para etapa final!";
    case "CONTRATADO":
      return "¡Contratación completada!";
    default:
      return "En seguimiento";
  }
}

/**
 * Normaliza y clasifica el motivo estandarizado de descarte:
 * - Perfil cubierto
 * - Experiencia requerida
 * - Pretensión salarial
 */
function getStandardReasonCategory(reason?: string): string {
  if (!reason) return "Perfil cubierto";
  const lower = reason.toLowerCase();
  if (lower.includes("perfil cubierto") || lower.includes("vacante cubierta")) {
    return "Perfil cubierto";
  }
  if (
    lower.includes("experiencia") ||
    lower.includes("técnica") ||
    lower.includes("trayectoria")
  ) {
    return "Experiencia requerida";
  }
  if (
    lower.includes("salarial") ||
    lower.includes("pretensión") ||
    lower.includes("sueldo") ||
    lower.includes("remuneración")
  ) {
    return "Pretensión salarial";
  }
  return "Retroalimentación técnica";
}

function getStandardReasonIcon(reason?: string): string {
  const cat = getStandardReasonCategory(reason);
  switch (cat) {
    case "Perfil cubierto":
      return "person_check";
    case "Experiencia requerida":
      return "engineering";
    case "Pretensión salarial":
      return "payments";
    default:
      return "feedback";
  }
}

function getStandardReasonBadgeClass(reason?: string): string {
  const cat = getStandardReasonCategory(reason);
  switch (cat) {
    case "Perfil cubierto":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
    case "Experiencia requerida":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20";
    case "Pretensión salarial":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
    default:
      return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20";
  }
}
</script>
