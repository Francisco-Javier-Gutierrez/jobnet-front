<template>
  <div
    class="max-w-5xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <div
      class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-on-background mb-2">
          Mis Vacantes Publicadas
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Gestiona y monitorea todas tus ofertas de empleo activas en la
          plataforma.
        </p>
      </div>
      <NuxtLink
        to="/create-vacancy"
        class="bg-primary hover:bg-primary-container text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-primary/20 active:scale-95 duration-100"
      >
        <span class="material-symbols-outlined text-lg">add_circle</span>
        Nueva Vacante
      </NuxtLink>
    </div>

    <!-- Vacancies List -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
    >
      <!-- Loading State (Skeleton) -->
      <div
        v-if="loading"
        class="divide-y divide-outline-variant/30 animate-pulse"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div class="flex-grow space-y-3">
            <div class="h-5 w-1/3 bg-outline/20 rounded-lg"></div>
            <div class="flex items-center gap-3">
              <div class="h-4 w-16 bg-outline/10 rounded-full"></div>
              <div class="h-4 w-28 bg-outline/10 rounded-full"></div>
              <div class="h-4 w-24 bg-outline/10 rounded-full"></div>
            </div>
          </div>
          <div class="flex gap-2 self-start sm:self-center shrink-0">
            <div class="h-10 w-24 bg-outline/20 rounded-lg"></div>
            <div class="h-10 w-20 bg-outline/20 rounded-lg"></div>
          </div>
        </div>
      </div>

      <div v-else-if="vacancies.length === 0" class="text-center py-20 px-6">
        <span class="material-symbols-outlined text-[48px] text-outline mb-4"
          >work_outline</span
        >
        <h2 class="text-lg font-bold text-on-background mb-2">
          Aún no tienes vacantes activas
        </h2>
        <p
          class="text-on-surface-variant dark:text-slate-300 text-xs max-w-sm mx-auto mb-6"
        >
          Comienza a captar talento publicando tu primera vacante en minutos. Es
          fácil y rápido.
        </p>
        <NuxtLink
          to="/create-vacancy"
          class="bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition active:scale-95 duration-100"
        >
          Publicar mi primera vacante
        </NuxtLink>
      </div>

      <div v-else class="divide-y divide-outline-variant/30">
        <div
          v-for="job in vacancies"
          :key="job.id"
          class="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition hover:bg-surface-container-low/20"
        >
          <div class="min-w-0">
            <div class="flex items-center gap-2 mb-1.5">
              <h2 class="text-base font-bold text-on-background truncate">
                {{ job.title }}
              </h2>
              <span
                v-if="job.estado === 'PAUSADA'"
                class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-[12px]"
                  >pause_circle</span
                >
                Pausada
              </span>
              <span
                v-else-if="
                  job.estado === 'EVALUACION' || job.estado === 'APELADA'
                "
                :class="[
                  'px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border',
                  job.estado === 'EVALUACION'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : '',
                  job.estado === 'APELADA'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : '',
                ]"
              >
                {{
                  job.estado === "EVALUACION"
                    ? "Bajo Evaluación"
                    : "Apelación en curso"
                }}
              </span>

              <!-- Badge Alta Demanda (50+ postulantes) -->
              <span
                v-if="(job.postulantesCount || 0) >= 50"
                class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 flex items-center gap-1"
                title="Esta oferta ha recibido 50 o más postulantes"
              >
                <span class="material-symbols-outlined text-[12px]"
                  >trending_up</span
                >
                Alta demanda
              </span>

              <!-- Badge Caducidad / Vencimiento Próximo (3 días o menos) -->
              <span
                v-if="
                  job.diasParaVencer !== undefined &&
                  job.diasParaVencer <= 3 &&
                  job.diasParaVencer >= 0 &&
                  job.estado !== 'PAUSADA' &&
                  job.estado !== 'CERRADA'
                "
                class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/20 flex items-center gap-1"
                :title="
                  job.fechaCierre
                    ? `Fecha de cierre: ${new Date(job.fechaCierre).toLocaleDateString()}`
                    : undefined
                "
              >
                <span class="material-symbols-outlined text-[12px]">timer</span>
                {{
                  job.diasParaVencer === 0
                    ? "Vence hoy"
                    : `Cierre en ${job.diasParaVencer} día${job.diasParaVencer > 1 ? "s" : ""}`
                }}
              </span>
            </div>
            <div
              class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-on-surface-variant dark:text-slate-300"
            >
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-outline"
                  >location_on</span
                >
                {{ job.location }}
              </span>
              <span v-if="formatSalaryDisplay(job)">·</span>
              <span
                v-if="formatSalaryDisplay(job)"
                class="flex items-center gap-1 font-bold text-secondary"
              >
                <span class="material-symbols-outlined text-sm">payments</span>
                {{ formatSalaryDisplay(job) }}
              </span>
              <span>·</span>
              <span
                class="flex items-center gap-1 bg-primary/5 text-primary px-2.5 py-0.5 rounded-full font-semibold"
              >
                <span class="material-symbols-outlined text-sm">schedule</span>
                {{ job.type }}
              </span>
              <span>·</span>
              <span
                v-if="(job.vacantesDisponibles || 1) > 1"
                class="flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-extrabold"
              >
                🔥 {{ job.vacantesDisponibles }} plazas abiertas
              </span>
              <span
                v-else
                class="flex items-center gap-1 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-bold"
              >
                👥 1 plaza
              </span>
              <span>·</span>
              <span
                class="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <span class="material-symbols-outlined text-sm">groups</span>
                {{ job.postulantesCount || 0 }} postulantes
              </span>
              <span>·</span>
              <span class="text-slate-500 text-[10px] mt-0.5">
                Creada: {{ new Date(job.createdAt).toLocaleDateString() }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <!-- If under evaluation, show Apelar button -->
            <button
              v-if="job.estado === 'EVALUACION'"
              @click="openAppealModal(job.id)"
              class="bg-amber-600 hover:bg-amber-750 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition active:scale-95 duration-100 flex items-center gap-1 shadow-sm"
            >
              <span class="material-symbols-outlined text-sm flex items-center"
                >gavel</span
              >
              Apelar Sanción
            </button>
            <NuxtLink
              v-if="job.estado !== 'EVALUACION'"
              :to="`/applicants?jobId=${job.id}`"
              class="bg-primary hover:bg-primary-container text-white font-bold text-xs px-4 py-2.5 rounded-lg transition shadow-sm active:scale-95 duration-100 flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm">group</span>
              Ver Candidatos
            </NuxtLink>
            <NuxtLink
              v-if="job.estado !== 'EVALUACION'"
              :to="`/edit-vacancy/${job.id}`"
              class="bg-surface border border-outline-variant hover:border-primary text-on-surface-variant dark:text-slate-300 hover:text-primary font-semibold text-xs px-3.5 py-2.5 rounded-lg transition active:scale-95 duration-100"
            >
              Editar
            </NuxtLink>
            <button
              v-if="job.estado !== 'EVALUACION' && job.estado !== 'PAUSADA'"
              @click="togglePause(job.id, 'PAUSADA')"
              class="bg-surface border border-outline-variant hover:border-amber-500 text-on-surface-variant dark:text-slate-300 hover:text-amber-500 font-semibold text-xs px-3.5 py-2.5 rounded-lg transition active:scale-95 duration-100"
            >
              Pausar
            </button>
            <button
              v-if="job.estado === 'PAUSADA'"
              @click="togglePause(job.id, 'Activa')"
              class="bg-surface border border-emerald-200 hover:border-emerald-500 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 font-semibold text-xs px-3.5 py-2.5 rounded-lg transition active:scale-95 duration-100"
            >
              Reanudar
            </button>
            <button
              v-if="job.estado !== 'EVALUACION'"
              @click="deleteJob(job.id)"
              class="bg-surface border border-rose-200 hover:border-rose-500 text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-semibold text-xs px-3.5 py-2.5 rounded-lg transition active:scale-95 duration-100"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
    <AppAppealModal
      :is-open="isAppealModalOpen"
      :company-id="companyId"
      :target-id="selectedJobIdForAppeal"
      reason="Apelación de vacante pausada para evaluación"
      @close="isAppealModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { MOCK_VACANCIES } from "~/utils/mockData";

useSeoMeta({
  title: "Mis Vacantes Publicadas - JobNet",
  description:
    "Administración y gestión de publicaciones de empleo para organizaciones en la plataforma JobNet",
});

const config = useRuntimeConfig();
const { data: session, status } = useAuth();
const router = useRouter();

const companyId = computed(() => (session.value?.user as any)?.id || "");

const loading = ref(true);
const vacancies = ref<any[]>([]);

// Appeal State Variables
const isAppealModalOpen = ref(false);
const selectedJobIdForAppeal = ref("");

const openAppealModal = (jobId: string) => {
  selectedJobIdForAppeal.value = jobId;
  isAppealModalOpen.value = true;
};

const fetchVacancies = async () => {
  if (status.value !== "authenticated") {
    router.push("/login");
    return;
  }

  const targetCompanyId = companyId.value;
  loading.value = true;

  try {
    let allJobs = await $fetch<any[]>(
      `${config.public.apiUrl}/jobs?companyId=${encodeURIComponent(targetCompanyId)}`,
    ).catch(() => []);
    if (!allJobs || allJobs.length === 0) {
      allJobs = MOCK_VACANCIES;
    }
    // Keep all jobs for the company regardless of active/evaluation/appeal status
    let filtered = allJobs.filter((j) => j.empresaUuid === targetCompanyId);
    if (filtered.length === 0) {
      filtered = allJobs.slice(0, 3);
    }

    // Fetch counts
    const jobsWithCounts = await Promise.all(
      filtered.map(async (j) => {
        let count = 0;
        try {
          const apps = await $fetch<any[]>(
            `${config.public.apiUrl}/jobs/${j.id}/applicants`,
          ).catch(() => []);
          count = apps.length;
        } catch (e) {}
        return { ...j, postulantesCount: count };
      }),
    );

    vacancies.value = jobsWithCounts.map((j) => ({
      id: j.id,
      title: j.title || "Vacante sin título",
      type: j.modalidad || "Presencial",
      estado: j.estado || "Activa",
      location:
        j.lat && j.lng ? `Lat: ${j.lat}, Lng: ${j.lng}` : "Ubicación remota",
      salario: j.salario,
      salarioMinimo: j.salarioMinimo,
      salarioMaximo: j.salarioMaximo,
      vacantesDisponibles: j.vacantesDisponibles || 1,
      maxPostulantes: j.maxPostulantes || null,
      createdAt: j.createdAt || new Date().toISOString(),
      postulantesCount: j.postulantesCount,
      fechaCierre: j.fechaCierre,
      diasParaVencer:
        j.diasParaVencer !== undefined
          ? j.diasParaVencer
          : j.fechaCierre
            ? Math.ceil(
                (new Date(j.fechaCierre).getTime() - Date.now()) /
                  (24 * 60 * 60 * 1000),
              )
            : undefined,
      alertaCaducidadEnviada: j.alertaCaducidadEnviada,
      alertaAltaDemandaEnviada: j.alertaAltaDemandaEnviada,
    }));
  } catch (e) {
    console.error("Error loading vacancies list:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchVacancies();
});

const deleteJob = async (id: string) => {
  if (
    !confirm(
      "¿Estás seguro de que deseas eliminar y cerrar esta vacante? Ya no recibirá postulaciones.",
    )
  ) {
    return;
  }
  try {
    await $fetch(`${config.public.apiUrl}/jobs/${id}`, {
      method: "DELETE",
    });
    // Remove from local list
    vacancies.value = vacancies.value.filter((j) => j.id !== id);
  } catch (e) {
    console.error("Error deleting job:", e);
    alert("Hubo un error al eliminar la vacante.");
  }
};

const togglePause = async (id: string, nuevoEstado: string) => {
  try {
    await $fetch(`${config.public.apiUrl}/jobs/${id}`, {
      method: "PUT",
      body: { estado: nuevoEstado, empresaUuid: companyId.value },
    });
    const job = vacancies.value.find((j) => j.id === id);
    if (job) job.estado = nuevoEstado;
  } catch (e) {
    console.error("Error toggling pause:", e);
    alert("Error al actualizar estado de la vacante.");
  }
};
</script>
