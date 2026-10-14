<template>
  <div
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
    role="main"
  >
    <!-- Header Section -->
    <div
      class="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
    >
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-on-background mb-1">
          Directorio de Organizaciones
        </h1>
        <p
          class="text-on-surface-variant dark:text-slate-300 text-sm max-w-2xl"
        >
          Explora el directorio oficial de organizaciones verificadas y
          encuentra oportunidades laborales acorde a tus intereses.
        </p>
      </div>

      <!-- Search & Filters -->
      <div
        class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto min-w-[340px]"
      >
        <form
          @submit.prevent="executeSearch"
          class="flex gap-2 flex-grow w-full sm:w-auto"
        >
          <div class="flex-grow">
            <AppSearchInput
              v-model="searchInput"
              placeholder="Buscar por nombre comercial, razón social o sector..."
              @clear="clearSearch"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 flex-shrink-0 cursor-pointer"
          >
            <span
              v-if="loading"
              class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"
            ></span>
            <span v-else class="material-symbols-outlined text-base"
              >search</span
            >
            <span>Buscar</span>
          </button>
        </form>

        <button
          @click="toggleVerifiedFilter"
          type="button"
          class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition duration-200 flex-shrink-0 cursor-pointer w-full sm:w-auto"
          :class="
            onlyVerified
              ? 'bg-primary/10 border-primary text-primary shadow-sm'
              : 'border-outline-variant/60 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high'
          "
        >
          <span class="material-symbols-outlined text-base">verified</span>
          Verificadas
        </button>
      </div>
    </div>

    <!-- Loading State (AppSkeletonLoader) -->
    <div v-if="loading" class="my-6">
      <AppSkeletonLoader type="card" :count="6" />
    </div>

    <!-- Empty State (AppEmptyState) -->
    <div v-else-if="filteredCompanies.length === 0" class="my-8">
      <AppEmptyState
        icon="domain_disabled"
        title="No se encontraron organizaciones"
        :description="`No hay registros de organizaciones que coincidan con la búsqueda actual.`"
        action-label="Limpiar Filtros"
        action-icon="filter_alt_off"
        @action="clearSearch"
      />
    </div>

    <!-- Companies Grid -->
    <div v-else class="space-y-8">
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-label="Grilla de organizaciones"
      >
        <div
          v-for="company in paginatedCompanies"
          :key="company.id"
          @click="router.push(`/company/${company.id}`)"
          class="border border-outline-variant/60 rounded-2xl p-6 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 hover:border-primary transition duration-300 flex flex-col justify-between group hover:shadow-lg cursor-pointer relative overflow-hidden"
          role="article"
          :aria-label="`Organización ${company.nombreComercial}`"
        >
          <!-- Card Top Header -->
          <div>
            <div class="flex items-start gap-4 mb-4">
              <!-- 1. LOGOTIPO -->
              <div
                class="w-14 h-14 bg-surface rounded-xl shadow-sm border border-outline-variant/30 flex items-center justify-center p-2 overflow-hidden flex-shrink-0"
              >
                <img
                  v-if="company.logo"
                  alt="Logotipo"
                  class="w-full h-full object-contain rounded"
                  :src="company.logo"
                />
                <span
                  v-else
                  class="material-symbols-outlined text-[32px] text-primary"
                  >corporate_fare</span
                >
              </div>

              <!-- 2. NOMBRE COMERCIAL & RAZÓN SOCIAL -->
              <div class="flex-grow min-w-0">
                <div class="flex items-center gap-1.5 mb-0.5">
                  <h2
                    class="text-base font-bold text-on-background truncate group-hover:text-primary transition"
                    title="Nombre Comercial"
                  >
                    {{ company.nombreComercial }}
                  </h2>
                  <AppStatusBadge
                    v-if="company.verified"
                    status="VERIFICADA"
                    size="sm"
                    :dot="false"
                    icon="verified"
                  />
                </div>
                <p
                  v-if="
                    company.razonSocial &&
                    company.razonSocial !== company.nombreComercial
                  "
                  class="text-xs text-on-surface-variant/80 dark:text-slate-400 truncate"
                >
                  {{ company.razonSocial }}
                </p>
                <!-- 3. SECTOR PRINCIPAL -->
                <div
                  class="mt-1 flex items-center gap-1 text-xs text-primary font-medium truncate"
                >
                  <span class="material-symbols-outlined text-[14px]"
                    >category</span
                  >
                  <span class="truncate">{{ company.sector }}</span>
                </div>
              </div>
            </div>

            <!-- Description Snippet -->
            <p
              class="text-on-surface-variant dark:text-slate-300 text-xs line-clamp-2 mb-4"
            >
              {{ company.about || "Sin descripción corporativa disponible." }}
            </p>
          </div>

          <!-- 4. UBICACIÓN GEOGRÁFICA & BOTÓN ACCIÓN -->
          <div
            class="border-t border-outline-variant/30 pt-4 flex items-center justify-between mt-auto"
          >
            <div
              class="flex items-center gap-1 text-xs text-on-surface-variant dark:text-slate-300 font-medium"
              title="Ubicación Geográfica"
            >
              <span class="material-symbols-outlined text-[16px] text-rose-500"
                >location_on</span
              >
              <span class="truncate max-w-[140px]">{{ company.location }}</span>
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

      <!-- Pagination Controls (AppPagination) -->
      <div class="border-t border-outline-variant/40 pt-4">
        <AppPagination
          v-model:current-page="currentPage"
          :total-pages="totalPages"
          :total-items="filteredCompanies.length"
          :start-index="startIndex"
          :end-index="endIndex"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const loading = ref(true);
const searchInput = ref("");
const activeSearchQuery = ref("");
const searchQuery = ref("");
const onlyVerified = ref(false);
const rawProfiles = ref<any[]>([]);

// Map API profiles to company structure
const dbCompanies = computed(() => {
  return rawProfiles.value
    .filter((p) => p.tipoUsuario === "ORGANIZACION")
    .map((p) => {
      const id = p.PK ? p.PK.replace("USER#", "") : p.id || "comp-id";
      const nombreComercial =
        p.nombreComercial || p.nombre || p.name || "Organización";
      const razonSocial = p.razonSocial || p.taxId || nombreComercial;
      return {
        id,
        nombreComercial,
        razonSocial,
        logo: p.fotoPerfil || p.logo || "",
        sector: p.sector || "Sector no especificado",
        about: p.biografia || p.about || "",
        verified: p.organizacionVerificada === true || p.verified === true,
        location:
          typeof p.ubicacion === "string"
            ? p.ubicacion
            : p.ubicacion?.city ||
              p.ubicacion?.pais ||
              "Ubicación no especificada",
      };
    });
});

// Merged list of real DB items (fallback removed)
const companiesList = computed(() => {
  return [...dbCompanies.value];
});

// Search filter
const filteredCompanies = computed(() => {
  const query = searchInput.value.toLowerCase().trim();
  return companiesList.value.filter((c) => {
    const matchesSearch =
      !query ||
      c.nombreComercial.toLowerCase().includes(query) ||
      c.razonSocial.toLowerCase().includes(query) ||
      c.sector.toLowerCase().includes(query);
    const matchesVerified = !onlyVerified.value || c.verified;
    return matchesSearch && matchesVerified;
  });
});

// Reusable pagination composable
const {
  currentPage,
  totalPages,
  paginatedItems: paginatedCompanies,
  startIndex,
  endIndex,
  resetPage,
} = usePagination(filteredCompanies, { initialPageSize: 6 });

watch([searchInput, onlyVerified], () => {
  resetPage();
});

const toggleVerifiedFilter = () => {
  onlyVerified.value = !onlyVerified.value;
};

const executeSearch = () => {
  activeSearchQuery.value = searchInput.value.trim();
  resetPage();
  fetchProfiles(activeSearchQuery.value);
};

const clearSearch = () => {
  searchInput.value = "";
  activeSearchQuery.value = "";
  resetPage();
  fetchProfiles("");
};

// Fetch data from server API endpoint with optional server-side query term
const fetchProfiles = async (queryTerm = "") => {
  loading.value = true;
  try {
    const url = queryTerm
      ? `/api/profiles?tipoUsuario=ORGANIZACION&q=${encodeURIComponent(queryTerm)}`
      : "/api/profiles?tipoUsuario=ORGANIZACION";
    const data = await $fetch<any[]>(url);
    rawProfiles.value = data || [];
  } catch (error) {
    console.error("Error fetching companies from server:", error);
    rawProfiles.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProfiles();
});

useSeoMeta({
  title: "Directorio de Organizaciones - JobNet",
  description:
    "Directorio y buscador contextual de organizaciones. Filtra organizaciones por nombre comercial o razón social.",
});
</script>
