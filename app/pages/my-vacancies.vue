<template>
  <div class="max-w-5xl mx-auto px-4 py-8 w-full bg-background min-h-screen">
    <div
      class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-on-background mb-2">
          Mis Vacantes Publicadas
        </h1>
        <p class="text-on-surface-variant text-sm">
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
      class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
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
        <p class="text-on-surface-variant text-xs max-w-sm mx-auto mb-6">
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
            <h2 class="text-base font-bold text-on-background mb-1.5 truncate">
              {{ job.title }}
            </h2>
            <div
              class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-on-surface-variant"
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
            <NuxtLink
              :to="`/applicants?jobId=${job.id}`"
              class="bg-primary hover:bg-primary-container text-white font-bold text-xs px-4 py-2.5 rounded-lg transition shadow-sm active:scale-95 duration-100 flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm">group</span>
              Ver Candidatos
            </NuxtLink>
            <button
              class="bg-surface border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary font-semibold text-xs px-3.5 py-2.5 rounded-lg transition active:scale-95 duration-100"
            >
              Editar
            </button>
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
  title: "Mis Vacantes - JobNet",
  description: "Lista completa de vacantes creadas por la empresa",
});

const router = useRouter();
const config = useRuntimeConfig();
const { data: session, status } = useAuth();

const loading = ref(true);
const vacancies = ref<any[]>([]);

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
    const filtered = allJobs.filter((j) => j.empresaUuid === companyId);

    vacancies.value = filtered.map((j) => ({
      id: j.id,
      title: j.title || "Vacante sin título",
      type: j.modalidad || "Presencial",
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
