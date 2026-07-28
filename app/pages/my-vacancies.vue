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
                v-if="job.estado === 'EVALUACION' || job.estado === 'APELADA'"
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
              <span>·</span>
              <span class="flex items-center gap-1 font-bold text-secondary">
                <span class="material-symbols-outlined text-sm">payments</span>
                {{ job.salary }}
              </span>
              <span>·</span>
              <span
                class="flex items-center gap-1 bg-primary/5 text-primary px-2.5 py-0.5 rounded-full font-semibold"
              >
                <span class="material-symbols-outlined text-sm">schedule</span>
                {{ job.type }}
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
            <button
              v-if="job.estado !== 'EVALUACION'"
              class="bg-surface border border-outline-variant hover:border-primary text-on-surface-variant dark:text-slate-300 hover:text-primary font-semibold text-xs px-3.5 py-2.5 rounded-lg transition active:scale-95 duration-100"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Apelación de Vacante -->
  <div
    v-if="isAppealModalOpen"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
  >
    <div
      class="bg-white border border-outline-variant/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
    >
      <div
        class="flex items-center justify-between border-b border-outline-variant/30 pb-3"
      >
        <h3
          class="text-base font-bold text-on-background flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-indigo-600">gavel</span>
          Apelar Sanción de Vacante
        </h3>
        <button
          @click="isAppealModalOpen = false"
          class="text-on-surface-variant dark:text-slate-300 hover:bg-surface-container rounded-lg p-1 transition flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <form @submit.prevent="submitAppeal" class="space-y-4 text-left">
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
        >
          Ingresa los argumentos y la justificación para solicitar la
          reactivación de esta vacante. El equipo de moderación analizará las
          pruebas provistas.
        </p>

        <div class="space-y-2 flex flex-col">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            for="appeal-text"
            >Mensaje de Apelación y Evidencia</label
          >
          <textarea
            v-model="appealComments"
            id="appeal-text"
            placeholder="Explica detalladamente las correcciones realizadas o justificaciones de legitimidad..."
            rows="5"
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl p-3 text-xs text-on-background outline-none transition resize-none"
            required
          ></textarea>
        </div>

        <div
          class="flex justify-end gap-2 pt-2 border-t border-outline-variant/30"
        >
          <button
            type="button"
            @click="isAppealModalOpen = false"
            class="bg-surface border border-outline-variant hover:bg-surface-container text-on-surface-variant dark:text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="!appealComments.trim()"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm active:scale-95 duration-100 flex items-center gap-1.5"
          >
            Enviar Apelación
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Mis Vacantes - JobNet",
  description: "Lista completa de vacantes creadas por la empresa",
});

const router = useRouter();
const config = useRuntimeConfig();
const { data: session, status } = useAuth();

const loading = ref(true);
const vacancies = ref<any[]>([]);

// Appeal State Variables
const isAppealModalOpen = ref(false);
const appealComments = ref("");
const selectedJobIdForAppeal = ref("");

const openAppealModal = (jobId: string) => {
  selectedJobIdForAppeal.value = jobId;
  appealComments.value = "";
  isAppealModalOpen.value = true;
};

const submitAppeal = async () => {
  if (!appealComments.value.trim()) return;
  try {
    await $fetch(
      `${config.public.apiUrl}/jobs/${selectedJobIdForAppeal.value}`,
      {
        method: "PUT",
        body: {
          estado: "APELADA",
          apelacionComentarios: appealComments.value.trim(),
        },
      },
    );

    isAppealModalOpen.value = false;
    await fetchVacancies();
    alert(
      "Apelación enviada con éxito. El equipo de moderación evaluará tu caso.",
    );
  } catch (e) {
    console.error("Error submitting appeal:", e);
    alert("Hubo un error al enviar la apelación.");
  }
};

const fetchVacancies = async () => {
  if (status.value !== "authenticated" || !session.value?.user?.id) {
    router.push("/login");
    return;
  }

  const companyId = session.value.user.id;
  loading.value = true;

  try {
    const allJobs = await $fetch<any[]>(`${config.public.apiUrl}/jobs`).catch(
      () => [],
    );
    // Keep all jobs for the company regardless of active/evaluation/appeal status
    const filtered = allJobs.filter((j) => j.empresaUuid === companyId);

    vacancies.value = filtered.map((j) => ({
      id: j.id,
      title: j.title || "Vacante sin título",
      type: j.modalidad || "Presencial",
      estado: j.estado || "Activa",
      location:
        j.lat && j.lng ? `Lat: ${j.lat}, Lng: ${j.lng}` : "Ubicación remota",
      salary:
        typeof j.salario === "number"
          ? `$${(j.salario / 1000).toFixed(0)}k MXN`
          : j.salario || "No especificado",
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
</script>
