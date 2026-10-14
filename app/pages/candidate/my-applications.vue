<template>
  <div
    class="max-w-5xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <div
      class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-on-background mb-2">
          Mis Solicitudes
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Historial de vacantes a las que has postulado y su estatus actual.
        </p>
      </div>
    </div>

    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
    >
      <div
        v-if="loading"
        class="p-6 text-center text-on-surface-variant dark:text-slate-400"
      >
        <span
          class="material-symbols-outlined text-3xl animate-spin text-primary"
          >sync</span
        >
        <p class="mt-2 text-sm">Cargando tu historial...</p>
      </div>
      <div
        v-else-if="applications.length === 0"
        class="text-center py-16 text-on-surface-variant dark:text-slate-400"
      >
        <span class="material-symbols-outlined text-[48px] mb-2 text-outline"
          >work_history</span
        >
        <h2
          class="text-lg font-bold text-on-background dark:text-slate-100 mb-2"
        >
          Aún no tienes postulaciones
        </h2>
        <p class="text-sm max-w-sm mx-auto">
          Explora las vacantes disponibles y postúlate a las que más te gusten.
        </p>
        <NuxtLink
          to="/vacancies"
          class="inline-block mt-6 bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold transition"
        >
          Ver vacantes
        </NuxtLink>
      </div>
      <div
        v-else
        class="divide-y divide-outline-variant/30 dark:divide-slate-800"
      >
        <div
          v-for="app in applications"
          :key="app.jobId"
          class="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container-low/20 transition"
        >
          <div>
            <h2
              class="font-bold text-lg text-on-background dark:text-slate-100"
            >
              {{ app.jobTitle }}
            </h2>
            <div
              class="flex items-center gap-2 text-sm text-on-surface-variant dark:text-slate-300 mt-1"
            >
              <span class="material-symbols-outlined text-[16px]"
                >business</span
              >
              {{ app.companyName }}
            </div>
            <div
              class="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium"
            >
              Postulado el {{ new Date(app.appliedAt).toLocaleDateString() }}
            </div>
          </div>
          <div class="flex flex-col sm:items-end gap-3 shrink-0">
            <span
              :class="getStatusClass(app.status)"
              class="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
            >
              {{ getStatusLabel(app.status) }}
            </span>
            <NuxtLink
              :to="`/jobs/${app.jobId}`"
              class="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
            >
              Ver detalles
              <span class="material-symbols-outlined text-[16px]"
                >arrow_forward</span
              >
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth, useRuntimeConfig, useRouter } from "#imports";

definePageMeta({
  middleware: ["auth"],
});

useSeoMeta({
  title: "Mis Solicitudes - JobNet",
  description: "Historial de aplicaciones de trabajo",
});

const { data: session, status } = useAuth();
const config = useRuntimeConfig();
const router = useRouter();

const { isMockEnabled, currentMockUser } = useMockSession();
const loading = ref(true);
const applications = ref<any[]>([]);

const MOCK_MY_APPLICATIONS = [
  {
    jobId: "vac-frontend-sr-01",
    jobTitle: "Ingeniero Frontend Senior (Vue 3 / Nuxt / Tailwind)",
    companyName: "TechSolutions México",
    status: "EN_CONTACTO",
    appliedAt: "2026-10-12T14:30:00Z",
    coverLetter:
      "Cuento con más de 5 años diseñando aplicaciones empresariales con Vue 3 y Nuxt.",
  },
  {
    jobId: "vac-devops-aws-02",
    jobTitle: "Especialista Cloud AWS & DevOps Platform",
    companyName: "Innovatech Global",
    status: "SELECCIONADO",
    appliedAt: "2026-10-10T10:00:00Z",
    coverLetter:
      "Interesado en la gestión de infraestructura cloud con Terraform.",
  },
];

const fetchApplications = async () => {
  const effectiveAuthenticated =
    (isMockEnabled.value && !!currentMockUser.value) ||
    status.value === "authenticated";

  if (!effectiveAuthenticated) {
    router.push("/login");
    return;
  }
  loading.value = true;
  try {
    const candidateId =
      currentMockUser.value?.id ||
      session.value?.user?.id ||
      "candidate-francisco-gomez";
    const apps = await $fetch<any[]>(
      `${config.public.apiUrl}/applications?candidateId=${candidateId}`,
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
      applications.value = MOCK_MY_APPLICATIONS;
    }
  } catch (e) {
    console.error(e);
    applications.value = MOCK_MY_APPLICATIONS;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchApplications();
});

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    PENDIENTE: "Pendiente de revisión",
    EN_CONTACTO: "En contacto",
    SELECCIONADO: "Seleccionado",
    RECHAZADO: "Descartado",
    CONTRATADO: "Contratado",
  };
  return map[status] || status;
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
</script>
