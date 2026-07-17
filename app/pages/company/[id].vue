<template>
  <!-- Loading State -->
  <main
    v-if="loading"
    class="w-full max-w-container-max mx-auto md:px-gutter md:py-8 px-margin-mobile pb-16 space-y-6 animate-pulse"
  >
    <!-- Banner Skeleton -->
    <div
      class="relative bg-outline/10 h-48 md:h-64 rounded-b-xl md:rounded-xl overflow-hidden mb-16"
    >
      <div
        class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-surface rounded-xl border-4 border-outline/15 z-10 flex items-center justify-center p-2"
      >
        <div class="w-full h-full bg-outline/20 rounded-lg"></div>
      </div>
    </div>

    <!-- Company Identity Skeleton -->
    <div class="flex flex-col items-center text-center mt-2 mb-8">
      <div class="h-8 w-64 bg-outline/20 rounded-lg mb-2"></div>
      <div class="h-6 w-36 bg-outline/20 rounded-full mb-4"></div>
      <div class="h-4 w-48 bg-outline/20 rounded mb-6"></div>

      <!-- About Skeleton -->
      <div class="w-full max-w-lg space-y-2">
        <div class="h-4 w-full bg-outline/10 rounded"></div>
        <div class="h-4 w-5/6 bg-outline/10 rounded"></div>
        <div class="h-4 w-2/3 bg-outline/10 rounded"></div>
      </div>
    </div>
  </main>

  <!-- Real Content -->
  <main
    v-else
    class="w-full max-w-container-max mx-auto md:px-gutter md:py-8 px-margin-mobile pb-16"
  >
    <!-- Header / Banner Section -->
    <section
      class="relative bg-gradient-to-br from-primary to-tertiary-container h-48 md:h-64 rounded-b-xl md:rounded-xl overflow-hidden shadow-md mb-16"
    >
      <!-- Decorative Pattern -->
      <div
        class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,theme(colors.white)_1px,transparent_0)] bg-[size:20px_20px]"
      ></div>
      <!-- Logo Overlap -->
      <div
        class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-xl shadow-lg border-4 border-surface-bright flex items-center justify-center p-2 z-10"
      >
        <img
          alt="Company Logo"
          class="w-full h-full object-contain rounded-lg"
          :src="company.logo"
        />
      </div>
    </section>

    <!-- Central Identity Card -->
    <section
      class="px-margin-mobile flex flex-col items-center text-center mt-2 mb-8"
    >
      <h1
        class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mt-4 mb-2 flex items-center gap-2"
      >
        {{ company.name }}
      </h1>
      <div
        v-if="company.verified"
        class="flex items-center gap-1 bg-surface-container-high text-primary px-3 py-1 rounded-full mb-4"
      >
        <span class="material-symbols-outlined text-[16px] text-secondary"
          >verified</span
        >
        <span
          class="font-label-sm text-label-sm font-semibold text-on-surface-variant"
          >Empresa Verificada</span
        >
      </div>
      <p
        class="font-body-md text-body-md text-on-surface-variant mb-6 max-w-lg"
      >
        {{ company.sector }}
      </p>
      <div
        class="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md"
      >
        <a
          class="flex items-center gap-2 font-label-md text-label-md text-primary bg-surface-container hover:bg-surface-container-high transition-colors px-4 py-2 rounded-lg w-full justify-center"
          :href="company.website"
          target="_blank"
          rel="noopener"
        >
          <span class="material-symbols-outlined text-[20px]">language</span>
          {{ company.websiteDisplay }}
        </a>
        <div
          class="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant border border-outline-variant px-4 py-2 rounded-lg w-full justify-center"
        >
          <span class="material-symbols-outlined text-[20px]">location_on</span>
          {{ company.location }}
        </div>
      </div>

      <!-- Owner Management Actions -->
      <div
        v-if="isOwner"
        class="mt-6 flex flex-col sm:flex-row gap-4 w-full max-w-md"
      >
        <NuxtLink
          to="/company/edit"
          class="flex-1 bg-primary hover:bg-tertiary-container text-white font-label-md text-label-md px-4 py-2.5 rounded-lg transition-colors active:scale-95 duration-100 flex items-center justify-center gap-2 shadow-sm"
        >
          <span class="material-symbols-outlined text-[20px]">edit</span>
          Editar Perfil
        </NuxtLink>
        <button
          class="flex-1 border border-primary text-primary hover:bg-surface-container font-label-md text-label-md px-4 py-2.5 rounded-lg transition-colors active:scale-95 duration-100 flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[20px]">add</span>
          Nueva Vacante
        </button>
      </div>
    </section>

    <!-- About Us Section -->
    <section class="px-margin-mobile mb-10">
      <div
        class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container-low"
      >
        <h2 class="font-headline-sm text-headline-sm text-on-surface mb-4">
          Acerca de nosotros
        </h2>
        <p
          class="font-body-md text-body-md text-on-surface-variant leading-relaxed"
        >
          {{ company.about }}
        </p>
      </div>
    </section>

    <!-- Open Vacancies Section -->
    <section class="px-margin-mobile mb-8">
      <h2
        class="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-primary">work_history</span>
        Vacantes Abiertas ({{ company.vacancies.length }})
      </h2>
      <div class="flex flex-col gap-4">
        <!-- Job Card -->
        <article
          v-for="job in company.vacancies"
          :key="job.id"
          class="bg-surface-container-lowest p-5 rounded-xl shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)] border border-surface-variant hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] transition-shadow duration-300"
        >
          <div class="flex justify-between items-start mb-3">
            <h3
              class="font-headline-sm text-headline-sm text-on-surface leading-tight"
            >
              {{ job.title }}
            </h3>
            <button
              class="text-outline hover:text-primary transition-colors active:scale-95 p-1 rounded-full hover:bg-surface-container"
              aria-label="Guardar vacante"
            >
              <span class="material-symbols-outlined">bookmark_border</span>
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              class="inline-flex items-center gap-1 font-label-sm text-label-sm bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-full"
            >
              <span class="material-symbols-outlined text-[14px]"
                >home_work</span
              >
              {{ job.type }}
            </span>
            <span
              class="inline-flex items-center gap-1 font-label-sm text-label-sm bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-full"
            >
              <span class="material-symbols-outlined text-[14px]"
                >schedule</span
              >
              {{ job.schedule }}
            </span>
          </div>
          <div
            class="flex items-center justify-between mt-auto pt-4 border-t border-surface-variant"
          >
            <div
              class="font-label-md text-label-md text-secondary flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[18px]"
                >payments</span
              >
              {{ job.salary }}
            </div>
            <NuxtLink
              :to="`/jobs`"
              class="bg-primary hover:bg-tertiary-container text-white font-label-md text-label-md px-4 py-2 rounded-lg transition-colors active:scale-95 duration-100 flex items-center gap-2 shadow-sm"
            >
              Ver vacante
              <span class="material-symbols-outlined text-[18px]"
                >arrow_forward</span
              >
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const companyId = route.params.id as string;
const { data } = useAuth();
const config = useRuntimeConfig();

const isOwner = computed(() => data.value?.user?.id === route.params.id);

// Fetch profile dynamically from deployed backend API
const { data: profileData, pending: profilePending } = useLazyAsyncData(
  `company-profile-${companyId}`,
  () =>
    $fetch(`${config.public.apiUrl}/profile/${companyId}`)
      .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
      .catch(() => null),
);

// Fetch all jobs from the backend API to filter vacancies for this company
const { data: jobsData, pending: jobsPending } = useLazyAsyncData(
  `company-jobs-${companyId}`,
  () =>
    $fetch(`${config.public.apiUrl}/jobs`)
      .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
      .catch(() => []),
);

const loading = computed(() => profilePending.value || jobsPending.value);

const company = ref({
  id: companyId,
  name: "TechSolutions Inc.",
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSzjpaT0Ede7QLy3zl1zft4f4V9csQyhGIsAyNHyyg4lmk54ha7yMkfDw5hbVoBOME8PTGFax9iKrHHZjAmqwMRA4i1UpqhgebzJGIkwq1DS6PKK1G5jxCNSxxPjHi_ezhM-ik2qaFtqa9JYp6ruPrCozHQM4UvsZpk2HUAg07aFTdAk58De2NTtSjHaO49ddhrtHPFA-trQm7WZbFMHwS-NZ7jyJ7ZrGaZD9yxWogET6EbwJ_H8Tk0g",
  verified: true,
  sector: "Desarrollo de Software y Tecnología",
  website: "https://techsolutions.com",
  websiteDisplay: "techsolutions.com",
  location: "Ciudad de México, CDMX",
  about:
    "Somos una empresa líder en innovación tecnológica, dedicada a construir soluciones de software escalables que transforman industrias. Fomentamos un entorno de trabajo colaborativo, diverso y enfocado en el crecimiento profesional de nuestro equipo.",
  vacancies: [] as any[],
});

// If profile exists in DynamoDB, apply real details reactively
watch(
  [profileData, jobsData],
  () => {
    if (profileData.value) {
      const p = profileData.value as any;
      company.value.name = p.nombre || p.name || "Sin Nombre";
      company.value.logo =
        p.fotoPerfil ||
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDSzjpaT0Ede7QLy3zl1zft4f4V9csQyhGIsAyNHyyg4lmk54ha7yMkfDw5hbVoBOME8PTGFax9iKrHHZjAmqwMRA4i1UpqhgebzJGIkwq1DS6PKK1G5jxCNSxxPjHi_ezhM-ik2qaFtqa9JYp6ruPrCozHQM4UvsZpk2HUAg07aFTdAk58De2NTtSjHaO49ddhrtHPFA-trQm7WZbFMHwS-NZ7jyJ7ZrGaZD9yxWogET6EbwJ_H8Tk0g";
      company.value.sector = p.sector || "Sector no especificado";
      company.value.about = p.biografia || "Sin descripción corporativa.";
      company.value.location =
        typeof p.ubicacion === "string"
          ? p.ubicacion
          : p.ubicacion?.city ||
            p.ubicacion?.pais ||
            "Ubicación no especificada";
      company.value.verified =
        p.organizacionVerificada !== undefined
          ? p.organizacionVerificada
          : false;
      company.value.website = p.enlacesWeb?.website || p.website || "";
      company.value.websiteDisplay =
        company.value.website
          .replace("https://", "")
          .replace("http://", "")
          .split("/")[0] || "Sitio web";

      // Filter vacancies matching this company ID from DB
      const rawJobs = (jobsData.value || []) as any[];
      company.value.vacancies = rawJobs
        .filter((j) => j.empresaUuid === companyId)
        .map((j) => ({
          id: j.id,
          title: j.title || "Vacante",
          type: j.modalidad || "Presencial",
          schedule: "Tiempo Completo",
          salary:
            typeof j.salario === "number"
              ? `$${(j.salario / 1000).toFixed(0)}k MXN`
              : j.salario || "No especificado",
        }));
    }
  },
  { immediate: true },
);

useSeoMeta({
  title: `${company.value.name} - Perfil de Empresa`,
  description: `Detalle y ofertas de ${company.value.name} en JobNet`,
});

const goBack = () => {
  router.back();
};
</script>
