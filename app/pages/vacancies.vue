<template>
  <div
    class="mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-all duration-200"
    :class="viewMode === 'split' ? 'max-w-7xl' : 'max-w-4xl'"
  >
    <!-- Page Header & View Toggle -->
    <div
      class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-on-background mb-1">
          Explorar Vacantes
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Busca y filtra oportunidades profesionales relevantes para tu perfil
          en el Estado de México y remotas.
        </p>
      </div>

      <!-- View Mode Segmented Controls -->
      <div
        class="flex items-center p-1 bg-surface-container dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-xl self-start sm:self-auto shadow-2xs"
      >
        <button
          type="button"
          @click="viewMode = 'list'"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
          :class="
            viewMode === 'list'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
          "
        >
          <span class="material-symbols-outlined text-base"
            >format_list_bulleted</span
          >
          <span>Lista</span>
        </button>
        <button
          type="button"
          @click="viewMode = 'split'"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
          :class="
            viewMode === 'split'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
          "
        >
          <span class="material-symbols-outlined text-base"
            >splitscreen_left</span
          >
          <span>Split Mapa</span>
        </button>
      </div>
    </div>

    <!-- Search & Filters Panel -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-5 mb-6 shadow-sm flex flex-col gap-4"
    >
      <!-- Search Bar Form -->
      <form @submit.prevent="executeServerSearch" class="flex gap-2 w-full">
        <div class="relative flex-grow">
          <span
            class="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl"
            >search</span
          >
          <input
            v-model="searchInput"
            type="text"
            placeholder="Buscar por título, organización, tecnologías o descripción..."
            class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl pl-11 pr-8 py-2.5 text-sm text-on-background outline-none transition"
          />
          <button
            v-if="searchInput"
            @click="clearSearch"
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-300 hover:text-primary transition"
            title="Limpiar búsqueda"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <button
          type="submit"
          :disabled="jobsStore.loading"
          class="px-4 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 flex-shrink-0"
        >
          <span
            v-if="jobsStore.loading"
            class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"
          ></span>
          <span v-else class="material-symbols-outlined text-base">search</span>
          <span>Buscar</span>
        </button>
      </form>

      <!-- Quick Modality Facet Chips with Live Badges -->
      <div class="flex items-center gap-2 flex-wrap">
        <button
          v-for="mod in modalitySelectOptions"
          :key="mod.value"
          type="button"
          @click="
            filterModality =
              filterModality === mod.value ? '' : String(mod.value)
          "
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border"
          :class="
            filterModality === mod.value ||
            (!filterModality && mod.value === '')
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-surface-container dark:bg-slate-800 border-outline-variant/40 text-on-surface dark:text-slate-200 hover:bg-surface-container-high'
          "
        >
          <span v-if="mod.icon" class="material-symbols-outlined text-sm">{{
            mod.icon
          }}</span>
          <span>{{ mod.label }}</span>
          <span
            class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            :class="
              filterModality === mod.value ||
              (!filterModality && mod.value === '')
                ? 'bg-white/20 text-white'
                : 'bg-surface-container-high dark:bg-slate-700 text-on-surface-variant dark:text-slate-300'
            "
          >
            {{ mod.badge }}
          </span>
        </button>
      </div>

      <!-- Filter Toggle -->
      <button
        @click="showFilters = !showFilters"
        class="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-container transition self-start"
      >
        <span class="material-symbols-outlined text-base">tune</span>
        {{ showFilters ? "Ocultar Filtros" : "Mostrar Filtros" }}
        <span
          v-if="activeFilterCount > 0"
          class="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1"
          >{{ activeFilterCount }}</span
        >
      </button>

      <!-- Filter Controls -->
      <div v-if="showFilters" class="flex flex-col gap-4">
        <!-- Geo-Radius Area Filter Bar -->
        <div
          class="p-3 bg-primary/5 border border-primary/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left"
        >
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-xl"
              >near_me</span
            >
            <div>
              <p class="text-xs font-bold text-on-background">
                Área Geográfica y Radio de Búsqueda
              </p>
              <p
                class="text-[10px] text-on-surface-variant dark:text-slate-300"
              >
                <span v-if="isGeoActive"
                  >📍 Ubicación detectada (Lat {{ userLat.toFixed(2) }}, Lng
                  {{ userLng.toFixed(2) }})</span
                >
                <span v-else>Ubicación predeterminada</span>
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <!-- Radius Select -->
            <div class="w-44">
              <AppSelect
                v-model="filterRadiusKm"
                label=""
                :options="[
                  { value: '', label: 'Sin límite de distancia' },
                  { value: '5', label: 'En radio de 5 km' },
                  { value: '10', label: 'En radio de 10 km' },
                  { value: '25', label: 'En radio de 25 km' },
                  { value: '50', label: 'En radio de 50 km' },
                  { value: '100', label: 'En radio de 100 km' },
                ]"
              />
            </div>
            <button
              @click="requestGeoLocation"
              type="button"
              class="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-xl transition flex items-center gap-1 active:scale-95 border border-primary/20"
              title="Obtener ubicación actual"
            >
              <span class="material-symbols-outlined text-sm">my_location</span>
              Usar GPS
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Modality Filter -->
          <div>
            <AppSelect
              v-model="filterModality"
              label="Modalidad"
              label-icon="laptop"
              :options="modalitySelectOptions"
            />
          </div>

          <!-- Sector Filter -->
          <div>
            <AppSelect
              v-model="filterSector"
              label="Sector"
              label-icon="domain"
              :options="sectorSelectOptions"
            />
          </div>

          <!-- Location Filter -->
          <div class="flex flex-col gap-1.5">
            <label
              class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
              >Ubicación (texto)</label
            >
            <input
              v-model="filterLocation"
              type="text"
              placeholder="Ej: CDMX, remoto..."
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
            />
          </div>
        </div>

        <!-- Skills Filter -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            >Habilidades Requeridas</label
          >
          <div class="flex flex-wrap gap-1.5 mb-1">
            <button
              v-for="skill in filterSkills"
              :key="skill"
              @click="removeFilterSkill(skill)"
              class="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1 font-bold hover:bg-primary/20 transition"
            >
              {{ skill }}
              <span class="material-symbols-outlined text-[12px]">close</span>
            </button>
          </div>
          <div class="relative" data-skill-dropdown>
            <input
              v-model="skillSearchInput"
              type="text"
              placeholder="Buscar habilidad del catálogo..."
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
              @focus="showSkillDropdown = true"
            />
            <!-- Skill Dropdown -->
            <div
              v-if="showSkillDropdown && availableCatalogSkills.length > 0"
              class="absolute top-full left-0 w-full mt-1 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant rounded-xl shadow-lg z-20 max-h-40 overflow-y-auto py-1"
            >
              <button
                v-for="skill in availableCatalogSkills"
                :key="skill.id"
                @click="addFilterSkill(skill.name)"
                class="w-full text-left px-3 py-2 text-xs text-on-surface hover:bg-surface-container-low transition"
              >
                {{ skill.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Clear Filters -->
        <button
          v-if="activeFilterCount > 0"
          @click="clearFilters"
          class="text-xs font-bold text-rose-500 hover:text-rose-600 transition self-start flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-sm">filter_alt_off</span>
          Limpiar todos los filtros
        </button>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="flex items-center justify-between mb-4">
      <p
        class="text-xs text-on-surface-variant dark:text-slate-300 font-semibold"
      >
        {{ filteredJobs.length }}
        {{ filteredJobs.length === 1 ? "resultado" : "resultados" }}
        <span v-if="activeFilterCount > 0 || searchQuery"> filtrados</span>
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="jobsStore.loading"
      class="grid grid-cols-1 gap-4"
      role="status"
      aria-label="Cargando vacantes"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="border border-outline-variant/60 rounded-2xl p-5 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 animate-pulse flex flex-col justify-between h-[200px]"
      >
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-outline/20 rounded-xl"></div>
            <div class="space-y-1">
              <div class="h-4 w-40 bg-outline/20 rounded"></div>
              <div class="h-3 w-24 bg-outline/10 rounded"></div>
            </div>
          </div>
          <div class="h-3.5 w-full bg-outline/20 rounded"></div>
          <div class="h-3.5 w-5/6 bg-outline/20 rounded"></div>
        </div>
        <div
          class="border-t border-outline-variant/30 pt-3 flex justify-between"
        >
          <div class="h-4 w-16 bg-outline/20 rounded"></div>
          <div class="h-4 w-16 bg-outline/20 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredJobs.length === 0 && jobsStore.jobs.length > 0"
      class="flex flex-col items-center justify-center py-16 text-center bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl shadow-sm px-6"
    >
      <div
        class="w-16 h-16 rounded-full bg-outline/10 flex items-center justify-center mb-4"
      >
        <span class="material-symbols-outlined text-[32px] text-outline"
          >search_off</span
        >
      </div>
      <h2 class="text-lg font-bold text-on-background mb-2">Sin resultados</h2>
      <p
        class="text-on-surface-variant dark:text-slate-300 text-xs max-w-sm mb-4"
      >
        Ninguna vacante coincide con tus criterios de búsqueda. Intenta ajustar
        los filtros o buscar con otros términos.
      </p>
      <button
        @click="
          clearFilters();
          searchQuery = '';
        "
        class="text-primary font-bold text-xs hover:underline"
      >
        Limpiar búsqueda
      </button>
    </div>

    <!-- No jobs at all -->
    <div
      v-else-if="jobsStore.jobs.length === 0 && !jobsStore.loading"
      class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl shadow-sm px-6"
    >
      <div
        class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
      >
        <span class="material-symbols-outlined text-[40px] text-primary"
          >work</span
        >
      </div>
      <h2 class="text-xl font-bold text-on-background mb-2">
        No hay vacantes disponibles
      </h2>
      <p
        class="text-on-surface-variant dark:text-slate-300 text-sm max-w-sm mb-6"
      >
        Aún no se han publicado ofertas de empleo. ¡Vuelve pronto!
      </p>
    </div>

    <!-- Results: Split View or Standard List View -->
    <div v-else>
      <!-- SPLIT VIEW MODE (List + Leaflet Multi-pin Map) -->
      <div
        v-if="viewMode === 'split'"
        class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        <!-- Left Side: Interactive Job Cards (7 columns) -->
        <div class="lg:col-span-7 space-y-4">
          <div
            v-for="job in filteredJobs"
            :key="job.id || (job as any).uniqueId"
            :id="`job-card-${job.id || (job as any).uniqueId}`"
            @mouseenter="hoveredJobId = job.id || (job as any).uniqueId"
            @mouseleave="hoveredJobId = null"
            class="transition-all duration-200 rounded-2xl"
            :class="
              hoveredJobId === (job.id || (job as any).uniqueId)
                ? 'ring-2 ring-primary dark:ring-indigo-500 shadow-md -translate-y-0.5'
                : ''
            "
          >
            <JobCard
              :job="job"
              :current-user-id="(session?.user as any)?.id || ''"
              @like="toggleJobLike"
              @bookmark="toggleJobBookmark"
              @share="handleShareJob"
              @navigate="(id) => $router.push(`/jobs/${id}`)"
            />
          </div>
        </div>

        <!-- Right Side: Sticky Multi-pin Map (5 columns) -->
        <div class="lg:col-span-5 sticky top-20">
          <VacanciesSplitMap
            :jobs="filteredJobs"
            :highlighted-job-id="hoveredJobId"
            @hover-job="(id) => (hoveredJobId = id)"
            @select-job="handleMapJobSelect"
          />
        </div>
      </div>

      <!-- STANDARD FULL LIST MODE -->
      <div
        v-else
        class="grid grid-cols-1 gap-4"
        aria-label="Listado de vacantes de empleo"
      >
        <JobCard
          v-for="job in filteredJobs"
          :key="job.id || job.uniqueId"
          :job="job"
          :current-user-id="(session?.user as any)?.id || ''"
          @like="toggleJobLike"
          @bookmark="toggleJobBookmark"
          @share="handleShareJob"
          @navigate="(id) => $router.push(`/jobs/${id}`)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJobsStore, type Job } from "../stores/jobs";
import { useCatalogStore } from "../stores/catalog";
import VacanciesSplitMap from "../components/vacancies/VacanciesSplitMap.vue";

useSeoMeta({
  title: "Explorar Vacantes - JobNet",
  description:
    "Busca y filtra oportunidades profesionales en la plataforma JobNet",
});

const jobsStore = useJobsStore();
const catalogStore = useCatalogStore();
const { data: session } = useAuth();
const { shareJob } = useShare();
const router = useRouter();

// View Mode (List vs Split Map)
const viewMode = ref<"list" | "split">("list");
const hoveredJobId = ref<string | null>(null);

const handleMapJobSelect = (job: Job) => {
  const jobId = job.id || (job as any).uniqueId;
  hoveredJobId.value = jobId;
  if (process.client) {
    const cardEl = document.getElementById(`job-card-${jobId}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
};

// Faceted options with live counters
const allJobs = computed(() => jobsStore.jobs || []);

const modalitySelectOptions = computed(() => {
  const total = allJobs.value.length;
  const counts = {
    Remoto: allJobs.value.filter(
      (j) => (j.modalidad || "").toLowerCase() === "remoto",
    ).length,
    Híbrido: allJobs.value.filter(
      (j) =>
        (j.modalidad || "").toLowerCase() === "híbrido" ||
        (j.modalidad || "").toLowerCase() === "hibrido",
    ).length,
    Presencial: allJobs.value.filter(
      (j) => (j.modalidad || "").toLowerCase() === "presencial",
    ).length,
  };

  return [
    { value: "", label: "Todas", badge: total },
    { value: "Remoto", label: "Remoto", icon: "laptop", badge: counts.Remoto },
    {
      value: "Híbrido",
      label: "Híbrido",
      icon: "domain_verification",
      badge: counts.Híbrido,
    },
    {
      value: "Presencial",
      label: "Presencial",
      icon: "location_city",
      badge: counts.Presencial,
    },
  ];
});

const sectorSelectOptions = computed(() => {
  const total = allJobs.value.length;
  return [
    { value: "", label: "Todos", badge: total },
    ...catalogStore.sectors.map((s) => {
      const count = allJobs.value.filter(
        (j) =>
          j.sector === s.name || (j.sectores && j.sectores.includes(s.name)),
      ).length;
      return {
        value: s.name,
        label: s.name,
        badge: count,
      };
    }),
  ];
});

// Search state
const searchInput = ref("");
const searchQuery = ref("");

const executeServerSearch = () => {
  searchQuery.value = searchInput.value.trim();
  jobsStore.fetchJobs({
    q: searchQuery.value,
    modalidad: filterModality.value || undefined,
  });
};

const clearSearch = () => {
  searchInput.value = "";
  searchQuery.value = "";
  jobsStore.fetchJobs({
    modalidad: filterModality.value || undefined,
  });
};

// Geo-location & Radius state
const userLat = ref(19.4326); // Default CDMX
const userLng = ref(-99.1332);
const isGeoActive = ref(false);
const filterRadiusKm = ref("");

// Filter state
const showFilters = ref(false);
const filterModality = ref("");
const filterSector = ref("");
const filterLocation = ref("");
const filterSkills = ref<string[]>([]);
const skillSearchInput = ref("");
const showSkillDropdown = ref(false);

// Haversine formula to compute distance in KM between 2 lat/lng points
const getDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

const requestGeoLocation = () => {
  if (process.client && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat.value = pos.coords.latitude;
        userLng.value = pos.coords.longitude;
        isGeoActive.value = true;
      },
      (err) => {
        console.warn("Geolocation denied or failed:", err);
      },
    );
  }
};

// Skill filter helpers
const availableCatalogSkills = computed(() => {
  if (!catalogStore.skills) return [];
  const search = skillSearchInput.value.toLowerCase().trim();
  return catalogStore.skills.filter(
    (s) =>
      !filterSkills.value.includes(s.name) &&
      (search === "" || s.name.toLowerCase().includes(search)),
  );
});

const addFilterSkill = (skillName: string) => {
  if (!filterSkills.value.includes(skillName)) {
    filterSkills.value.push(skillName);
  }
  skillSearchInput.value = "";
  showSkillDropdown.value = false;
};

const removeFilterSkill = (skillName: string) => {
  filterSkills.value = filterSkills.value.filter((s) => s !== skillName);
};

const activeFilterCount = computed(() => {
  let count = 0;
  if (filterModality.value) count++;
  if (filterSector.value) count++;
  if (filterLocation.value.trim()) count++;
  if (filterSkills.value.length > 0) count += filterSkills.value.length;
  if (filterRadiusKm.value) count++;
  return count;
});

const clearFilters = () => {
  filterModality.value = "";
  filterSector.value = "";
  filterLocation.value = "";
  filterSkills.value = [];
  filterRadiusKm.value = "";
};

// Filtered jobs pipeline
const filteredJobs = computed(() => {
  let results = jobsStore.jobs || [];

  // Client text search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    results = results.filter(
      (job: Job) =>
        (job.title || "").toLowerCase().includes(q) ||
        (job.company || "").toLowerCase().includes(q) ||
        (job.descripcion || "").toLowerCase().includes(q) ||
        (job.habilidadesRequeridas || []).some((s) =>
          s.toLowerCase().includes(q),
        ),
    );
  }

  // Modality filter
  if (filterModality.value) {
    results = results.filter(
      (job: Job) =>
        (job.modalidad || "").toLowerCase() ===
        filterModality.value.toLowerCase(),
    );
  }

  // Sector filter
  if (filterSector.value) {
    results = results.filter(
      (job: Job) =>
        job.sector === filterSector.value ||
        (job.sectores && job.sectores.includes(filterSector.value)),
    );
  }

  // Geo-radius filter
  if (filterRadiusKm.value && isGeoActive.value) {
    const maxKm = parseFloat(filterRadiusKm.value);
    results = results.filter((job: Job) => {
      if (job.modalidad === "Remoto") return true;
      if (!job.lat || !job.lng) return false;
      const dist = getDistanceKm(
        userLat.value,
        userLng.value,
        job.lat,
        job.lng,
      );
      return dist <= maxKm;
    });
  }

  // Location text filter
  if (filterLocation.value.trim()) {
    const locQuery = filterLocation.value.toLowerCase().trim();
    results = results.filter((job: Job) => {
      const latLng = `${job.lat}, ${job.lng}`;
      const desc = (job.descripcion || "").toLowerCase();
      const company = (job.company || "").toLowerCase();
      return (
        latLng.includes(locQuery) ||
        desc.includes(locQuery) ||
        company.includes(locQuery)
      );
    });
  }

  // Skills filter
  if (filterSkills.value.length > 0) {
    results = results.filter((job: Job) => {
      if (!job.habilidadesRequeridas) return false;
      const jobSkills = job.habilidadesRequeridas.map((s) => s.toLowerCase());
      return filterSkills.value.every((filterSkill) =>
        jobSkills.includes(filterSkill.toLowerCase()),
      );
    });
  }

  // Sort descending by date (most recent first)
  results = [...results].sort((a: Job, b: Job) => {
    return (
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime()
    );
  });

  return results;
});

// Reactive Job Action Handlers for JobCard
const toggleJobLike = async (job: any) => {
  const currentUserId = (session.value?.user as any)?.id;
  if (!currentUserId) return;
  if (!job.likesList) job.likesList = [];
  if (!job.dislikesList) job.dislikesList = [];

  const idx = job.likesList.indexOf(currentUserId);
  if (idx !== -1) {
    job.likesList.splice(idx, 1);
  } else {
    job.likesList.push(currentUserId);
    const dislikeIdx = job.dislikesList.indexOf(currentUserId);
    if (dislikeIdx !== -1) job.dislikesList.splice(dislikeIdx, 1);
  }

  try {
    await $fetch(`/api/jobs/${job.id}/like`, {
      method: "POST",
      body: { userUuid: currentUserId },
    });
  } catch (e) {
    // Local optimistic state preserved
  }
};

const toggleJobBookmark = async (job: any) => {
  const currentUserId = (session.value?.user as any)?.id;
  if (!currentUserId) return;
  if (!job.bookmarksList) job.bookmarksList = [];

  const idx = job.bookmarksList.indexOf(currentUserId);
  if (idx !== -1) {
    job.bookmarksList.splice(idx, 1);
  } else {
    job.bookmarksList.push(currentUserId);
  }

  try {
    await $fetch(`/api/jobs/${job.id}/bookmark`, {
      method: "POST",
      body: { userUuid: currentUserId },
    });
  } catch (e) {
    // Local optimistic state preserved
  }
};

const handleShareJob = async (job: any) => {
  await shareJob(job);
};

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest("[data-skill-dropdown]")) {
    showSkillDropdown.value = false;
  }
};

onMounted(async () => {
  jobsStore.fetchJobs();
  if (!catalogStore.loaded) {
    catalogStore.fetchCatalog();
  }
  if (process.client) {
    document.addEventListener("click", handleClickOutside);
  }
});

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener("click", handleClickOutside);
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
