<template>
  <div class="max-w-6xl mx-auto px-4 py-8 w-full bg-background min-h-screen">
    <div
      class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-on-background mb-2">
          Tablero de Reclutamiento
        </h1>
        <p class="text-on-surface-variant text-sm">
          Resumen de actividad, vacantes abiertas y postulaciones recientes.
        </p>
      </div>
      <NuxtLink
        to="/create-vacancy"
        class="bg-primary hover:bg-primary-container text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-primary/20 active:scale-95 duration-100"
      >
        <span class="material-symbols-outlined text-lg">add_circle</span>
        Publicar Vacante
      </NuxtLink>
    </div>

    <!-- Analytics Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200"
      >
        <div class="flex items-center justify-between mb-4">
          <span
            class="text-on-surface-variant text-xs font-bold uppercase tracking-wider"
            >{{ stat.title }}</span
          >
          <span
            class="material-symbols-outlined text-2xl"
            :class="stat.iconColor"
            >{{ stat.icon }}</span
          >
        </div>
        <p class="text-3xl font-extrabold text-on-background mb-1">
          {{ stat.value }}
        </p>
        <span class="text-[11px] font-semibold" :class="stat.trendColor">{{
          stat.trend
        }}</span>
      </div>
    </div>

    <!-- Main Board Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Active Vacancies List (2 Cols) -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <div
          class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm"
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-base font-bold text-on-background">
              Vacantes Activas
            </h2>
            <NuxtLink
              to="/my-vacancies"
              class="text-primary hover:text-primary-container text-xs font-semibold transition"
              >Ver todas</NuxtLink
            >
          </div>

          <!-- Loading State (Skeleton) -->
          <div v-if="loading" class="flex flex-col gap-4 animate-pulse">
            <div
              v-for="i in 3"
              :key="i"
              class="flex items-center justify-between p-4 border border-outline-variant/60 rounded-xl bg-surface-container-low/20"
            >
              <div class="flex-grow space-y-2">
                <div class="h-4 w-1/3 bg-outline/20 rounded-lg"></div>
                <div class="h-3 w-1/4 bg-outline/10 rounded"></div>
              </div>
              <div class="h-8 w-24 bg-outline/20 rounded-lg"></div>
            </div>
          </div>

          <div v-else-if="myVacancies.length === 0" class="text-center py-10">
            <span
              class="material-symbols-outlined text-[36px] text-outline mb-2"
              >work_outline</span
            >
            <p class="text-on-surface-variant text-sm">
              No tienes vacantes publicadas.
            </p>
          </div>

          <div v-else class="flex flex-col gap-4">
            <div
              v-for="job in myVacancies"
              :key="job.id"
              class="flex items-center justify-between p-4 border border-outline-variant/60 rounded-xl hover:border-primary/50 hover:bg-surface-container-low/30 transition bg-surface-container-low/20"
            >
              <div class="min-w-0 flex-grow pr-4">
                <h3 class="text-sm font-bold text-on-background truncate mb-1">
                  {{ job.title }}
                </h3>
                <div
                  class="flex items-center gap-3 text-xs text-on-surface-variant"
                >
                  <span>{{ job.type }}</span>
                  <span>·</span>
                  <span class="font-semibold text-secondary">{{
                    job.salary
                  }}</span>
                </div>
              </div>
              <NuxtLink
                :to="`/applicants?jobId=${job.id}`"
                class="bg-surface border border-outline-variant hover:border-primary hover:bg-primary/5 text-primary font-semibold text-xs px-3.5 py-1.5 rounded-lg transition active:scale-95 duration-100"
              >
                Gestionar ATS
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Recent Applicants (1 Col) -->
      <div class="flex flex-col gap-6">
        <div
          class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm"
        >
          <h2 class="text-base font-bold text-on-background mb-6">
            Postulaciones Recientes
          </h2>

          <div class="flex flex-col gap-4">
            <div
              v-for="candidate in recentCandidates"
              :key="candidate.name"
              class="flex items-center gap-3 p-3 border-b border-outline-variant/30 last:border-0"
            >
              <div
                class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs"
              >
                {{ candidate.name.charAt(0) }}
              </div>
              <div class="min-w-0 flex-grow">
                <h3
                  class="text-xs font-bold text-on-background truncate mb-0.5"
                >
                  {{ candidate.name }}
                </h3>
                <p class="text-[10px] text-on-surface-variant truncate mb-0.5">
                  {{ candidate.job }}
                </p>
                <span class="text-[9px] text-primary font-semibold">{{
                  candidate.time
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

useSeoMeta({
  title: "Dashboard de Reclutamiento - JobNet",
  description:
    "Tablero de análisis corporativo e indicador de vacantes en JobNet",
});

const router = useRouter();
const config = useRuntimeConfig();
const { data: session, status } = useAuth();

const loading = ref(true);
const myVacancies = ref<any[]>([]);

const stats = [
  {
    title: "Vacantes Abiertas",
    value: "0",
    icon: "work",
    iconColor: "text-primary",
    trend: "+2 esta semana",
    trendColor: "text-secondary",
  },
  {
    title: "Postulantes Totales",
    value: "0",
    icon: "group",
    iconColor: "text-secondary",
    trend: "+14 hoy",
    trendColor: "text-secondary",
  },
  {
    title: "Tasa de Selección",
    value: "0%",
    icon: "verified_user",
    iconColor: "text-tertiary",
    trend: "+0.5% este mes",
    trendColor: "text-secondary",
  },
  {
    title: "Vistas del Perfil",
    value: "0",
    icon: "visibility",
    iconColor: "text-rose-500",
    trend: "+24% en 7 días",
    trendColor: "text-secondary",
  },
];

const recentCandidates = [
  {
    name: "Alejandro Silva",
    job: "Senior Frontend Developer",
    time: "Hace 10 mins",
  },
  { name: "Lucía Fernández", job: "UX/UI Designer", time: "Hace 2 horas" },
  { name: "Carlos Ortega", job: "Product Manager", time: "Ayer" },
];

const fetchDashboardData = async () => {
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
    const filtered = allJobs.filter((j) => j.empresaUuid === companyId);

    myVacancies.value = filtered.map((j) => ({
      id: j.id,
      title: j.title || "Vacante",
      type: j.modalidad || "Presencial",
      salary:
        typeof j.salario === "number"
          ? `$${(j.salario / 1000).toFixed(0)}k MXN`
          : j.salario || "No especificado",
    }));

    // Update stats dynamically
    stats[0].value = myVacancies.value.length.toString();
    stats[1].value = (myVacancies.value.length * 3 + 3).toString(); // simulated candidate count
    stats[2].value = "12%";
    stats[3].value = "142";
  } catch (e) {
    console.error("Error loading dashboard data:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>
