<template>
  <div
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full bg-background min-h-screen"
    role="main"
  >
    <div
      class="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
    >
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-on-background mb-2">
          Directorio de Empresas
        </h1>
        <p class="text-on-surface-variant text-sm">
          Explora e interactúa con las organizaciones líderes del sector que
          publican vacantes en JobNet.
        </p>
      </div>

      <!-- Search & Filters -->
      <div
        class="flex flex-col sm:flex-row gap-3 w-full md:w-auto min-w-[300px]"
      >
        <div class="relative flex-grow">
          <span
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <span
              class="material-symbols-outlined text-on-surface-variant/70 text-[20px]"
              >search</span
            >
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre o sector..."
            class="pl-10 pr-4 py-2.5 w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm focus:outline-none focus:border-primary text-on-background"
            aria-label="Buscar empresas"
          />
        </div>
        <button
          @click="toggleVerifiedFilter"
          class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm border font-medium transition duration-200"
          :class="
            onlyVerified
              ? 'bg-primary/10 border-primary text-primary'
              : 'border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
          "
        >
          <span class="material-symbols-outlined text-[18px]">verified</span>
          Verificadas
        </button>
      </div>
    </div>

    <!-- Loading State (Skeleton) -->
    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse"
      role="status"
      aria-label="Cargando empresas"
      aria-live="polite"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="border border-outline-variant/60 rounded-2xl p-6 bg-surface-container-lowest flex flex-col justify-between h-[250px]"
      >
        <div>
          <div class="flex items-center gap-4 mb-4">
            <div class="h-12 w-12 bg-outline/20 rounded-xl"></div>
            <div class="flex-grow space-y-2">
              <div class="h-5 w-2/3 bg-outline/20 rounded-md"></div>
              <div class="h-4 w-1/2 bg-outline/20 rounded-md"></div>
            </div>
          </div>
          <div class="space-y-2 mb-4">
            <div class="h-4 w-full bg-outline/10 rounded"></div>
            <div class="h-4 w-5/6 bg-outline/10 rounded"></div>
          </div>
        </div>
        <div
          class="border-t border-outline-variant/30 pt-4 flex justify-between items-center"
        >
          <div class="h-4 w-20 bg-outline/20 rounded"></div>
          <div class="h-8 w-24 bg-outline/20 rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredCompanies.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm px-6"
      role="status"
    >
      <div
        class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
      >
        <span class="material-symbols-outlined text-[40px] text-primary"
          >business</span
        >
      </div>
      <h2 class="text-xl font-bold text-on-background mb-2">
        No se encontraron empresas
      </h2>
      <p class="text-on-surface-variant text-sm max-w-sm">
        Intenta ajustar los criterios de búsqueda o filtros para explorar otras
        organizaciones.
      </p>
    </div>

    <!-- Companies Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-label="Directorio de empresas"
    >
      <div
        v-for="company in filteredCompanies"
        :key="company.id"
        @click="router.push(`/company/${company.id}`)"
        class="border border-outline-variant/60 rounded-2xl p-6 bg-surface-container-lowest hover:border-primary transition duration-300 flex flex-col justify-between group hover:shadow-md cursor-pointer relative overflow-hidden"
        role="article"
        :aria-label="`Empresa ${company.name}`"
      >
        <!-- Card Content -->
        <div>
          <!-- Company Info Header -->
          <div class="flex items-start gap-4 mb-4">
            <div
              class="w-14 h-14 bg-surface rounded-xl shadow-sm border border-outline-variant/30 flex items-center justify-center p-2.5 overflow-hidden flex-shrink-0"
            >
              <img
                v-if="company.logo"
                alt="Logo"
                class="w-full h-full object-contain rounded"
                :src="company.logo"
              />
              <span
                v-else
                class="material-symbols-outlined text-[28px] text-on-surface-variant/60"
                >business</span
              >
            </div>
            <div class="flex-grow min-w-0">
              <div class="flex items-center gap-1.5 mb-0.5">
                <h2
                  class="text-base font-bold text-on-background truncate group-hover:text-primary transition"
                >
                  {{ company.name }}
                </h2>
                <span
                  v-if="company.verified"
                  class="material-symbols-outlined text-secondary text-[16px] flex-shrink-0"
                  title="Empresa Verificada"
                  aria-label="Verificada"
                >
                  verified
                </span>
              </div>
              <p class="text-xs text-primary font-medium truncate">
                {{ company.sector }}
              </p>
            </div>
          </div>

          <!-- Biography Snippet -->
          <p class="text-on-surface-variant text-xs line-clamp-3 mb-6">
            {{ company.about || "Sin descripción corporativa disponible." }}
          </p>
        </div>

        <!-- Footer Info -->
        <div
          class="border-t border-outline-variant/30 pt-4 flex items-center justify-between mt-auto"
        >
          <div
            class="flex items-center gap-1 text-[11px] text-on-surface-variant font-medium"
          >
            <span class="material-symbols-outlined text-[14px]"
              >location_on</span
            >
            <span class="truncate max-w-[120px]">{{ company.location }}</span>
          </div>

          <NuxtLink
            :to="`/company/${company.id}`"
            class="text-xs font-bold text-primary group-hover:text-primary-container transition flex items-center gap-1"
          >
            Ver Perfil
            <span
              class="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform"
              >arrow_forward</span
            >
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(true);
const searchQuery = ref("");
const onlyVerified = ref(false);
const rawProfiles = ref<any[]>([]);

// Filter and parse profiles to find only companies
const companiesList = computed(() => {
  return rawProfiles.value
    .filter((p) => p.tipoUsuario === "EMPRESA")
    .map((p) => {
      const id = p.PK.replace("USER#", "");
      return {
        id,
        name: p.nombre || p.name || "Empresa sin nombre",
        logo: p.fotoPerfil || "",
        sector: p.sector || "Tecnología",
        about: p.biografia || "",
        verified: p.organizacionVerificada === true,
        location:
          typeof p.ubicacion === "string"
            ? p.ubicacion
            : p.ubicacion?.city || p.ubicacion?.pais || "No especificada",
      };
    });
});

// Search and status filtering logic
const filteredCompanies = computed(() => {
  return companiesList.value.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.sector.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesVerified = !onlyVerified.value || c.verified;
    return matchesSearch && matchesVerified;
  });
});

const toggleVerifiedFilter = () => {
  onlyVerified.value = !onlyVerified.value;
};

// Fetch data on mount
const fetchProfiles = async () => {
  loading.value = true;
  try {
    const data = await $fetch<any[]>("/api/profiles");
    rawProfiles.value = data || [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    rawProfiles.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProfiles();
});

useSeoMeta({
  title: "Directorio de Empresas - JobNet",
  description:
    "Conoce a las empresas de tecnología que contratan talento en JobNet y explora sus perfiles.",
});
</script>
