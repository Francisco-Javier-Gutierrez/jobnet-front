<template>
  <div class="max-w-4xl mx-auto px-4 py-8 w-full bg-background min-h-screen">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-on-background mb-1">
        Explorar Vacantes
      </h1>
      <p class="text-on-surface-variant text-sm">
        Busca y filtra oportunidades profesionales relevantes para tu perfil.
      </p>
    </div>

    <!-- Search & Filters Panel -->
    <div
      class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 mb-6 shadow-sm flex flex-col gap-4"
    >
      <!-- Search Bar -->
      <div class="relative">
        <span
          class="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl"
          >search</span
        >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por título, empresa o descripción..."
          class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl pl-11 pr-4 py-2.5 text-sm text-on-background outline-none transition"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition"
        >
          <span class="material-symbols-outlined text-lg">close</span>
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
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Modality Filter -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-on-surface-variant"
              >Modalidad</label
            >
            <select
              v-model="filterModality"
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23777587%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.25em_1.25em] pr-8"
            >
              <option value="">Todas</option>
              <option value="Remoto">Remoto</option>
              <option value="Híbrido">Híbrido</option>
              <option value="Presencial">Presencial</option>
            </select>
          </div>

          <!-- Sector Filter -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-on-surface-variant"
              >Sector</label
            >
            <select
              v-model="filterSector"
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23777587%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.25em_1.25em] pr-8"
            >
              <option value="">Todos</option>
              <option
                v-for="s in catalogStore.sectors"
                :key="s.id"
                :value="s.name"
              >
                {{ s.name }}
              </option>
            </select>
          </div>

          <!-- Location Filter -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-on-surface-variant"
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
          <label class="text-xs font-bold text-on-surface-variant"
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
          <div class="relative">
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
              class="absolute top-full left-0 w-full mt-1 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-20 max-h-40 overflow-y-auto py-1"
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
      <p class="text-xs text-on-surface-variant font-semibold">
        {{ filteredJobs.length }}
        {{ filteredJobs.length === 1 ? "resultado" : "resultados" }}
        <span v-if="activeFilterCount > 0 || searchQuery"> filtrados</span>
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="jobsStore.loading"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
      role="status"
      aria-label="Cargando vacantes"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="border border-outline-variant/60 rounded-2xl p-5 bg-surface-container-lowest animate-pulse flex flex-col justify-between h-[230px]"
      >
        <div>
          <!-- Tags Skeleton -->
          <div class="flex items-center gap-2 mb-3">
            <div class="h-5 w-14 bg-outline/20 rounded-full"></div>
            <div class="h-5 w-16 bg-outline/20 rounded-full"></div>
            <div class="h-5 w-20 bg-outline/20 rounded-full"></div>
          </div>
          <!-- Title Skeleton -->
          <div class="h-6 w-3/4 bg-outline/20 rounded-lg mb-2"></div>
          <!-- Company Skeleton -->
          <div class="h-4 w-1/3 bg-outline/20 rounded-lg mb-4"></div>
          <!-- Description Skeleton -->
          <div class="h-3 w-full bg-outline/20 rounded mb-2"></div>
          <div class="h-3 w-5/6 bg-outline/20 rounded mb-4"></div>
        </div>
        <!-- Footer Skeleton -->
        <div
          class="border-t border-outline-variant/30 pt-3 mt-2 flex justify-between items-center"
        >
          <div class="h-3 w-24 bg-outline/20 rounded"></div>
          <div class="h-3 w-16 bg-outline/20 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredJobs.length === 0 && jobsStore.jobs.length > 0"
      class="flex flex-col items-center justify-center py-16 text-center bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm px-6"
    >
      <div
        class="w-16 h-16 rounded-full bg-outline/10 flex items-center justify-center mb-4"
      >
        <span class="material-symbols-outlined text-[32px] text-outline"
          >search_off</span
        >
      </div>
      <h2 class="text-lg font-bold text-on-background mb-2">Sin resultados</h2>
      <p class="text-on-surface-variant text-xs max-w-sm mb-4">
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
      class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm px-6"
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
      <p class="text-on-surface-variant text-sm max-w-sm mb-6">
        Aún no se han publicado ofertas de empleo. ¡Vuelve pronto!
      </p>
    </div>

    <!-- Jobs Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
      aria-label="Listado de vacantes de empleo"
    >
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        class="border border-outline-variant/60 rounded-2xl p-5 bg-surface-container-lowest hover:border-primary transition duration-300 flex flex-col justify-between group hover:shadow-md"
        role="article"
        :aria-label="`Vacante de ${job.title} en ${job.company}`"
      >
        <div>
          <!-- Tags -->
          <div class="flex items-center gap-2 mb-3 flex-wrap">
            <span
              class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-secondary/10 text-secondary border border-secondary/20"
            >
              Activo
            </span>
            <span
              v-if="job.modalidad"
              class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary"
            >
              {{ job.modalidad }}
            </span>
            <span
              v-if="job.salario"
              class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-tertiary-container/30 text-on-surface-variant"
            >
              ${{ formatSalary(job.salario) }} MXN
            </span>
          </div>

          <!-- Title & Company -->
          <h2
            class="text-base font-bold text-on-background group-hover:text-primary transition mb-1"
          >
            {{ job.title }}
          </h2>
          <p class="text-on-surface-variant text-xs font-semibold mb-3">
            {{ job.company }}
          </p>

          <!-- Description preview -->
          <p
            v-if="job.descripcion"
            class="text-xs text-on-surface-variant leading-relaxed line-clamp-2 mb-3"
          >
            {{ job.descripcion }}
          </p>

          <!-- Skills -->
          <div
            v-if="
              job.habilidadesRequeridas && job.habilidadesRequeridas.length > 0
            "
            class="flex flex-wrap gap-1.5 mb-3"
          >
            <span
              v-for="skill in job.habilidadesRequeridas.slice(0, 4)"
              :key="skill"
              class="bg-primary/5 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold"
            >
              {{ skill }}
            </span>
            <span
              v-if="job.habilidadesRequeridas.length > 4"
              class="text-[10px] text-on-surface-variant font-semibold px-1 py-0.5"
            >
              +{{ job.habilidadesRequeridas.length - 4 }} más
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="border-t border-outline-variant/30 pt-3 mt-2 flex items-center justify-between"
        >
          <div class="text-[10px] text-on-surface-variant font-semibold">
            <span v-if="job.lat && job.lng"
              >Lat: {{ job.lat }}, Lng: {{ job.lng }}</span
            >
            <span v-else>Ubicación remota</span>
          </div>
          <NuxtLink
            :to="`/map?lat=${job.lat}&lng=${job.lng}`"
            class="text-primary hover:text-primary-container text-xs font-bold transition flex items-center gap-0.5"
          >
            Ver mapa
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useJobsStore, type Job } from "../stores/jobs";
import { useCatalogStore } from "../stores/catalog";

useSeoMeta({
  title: "Explorar Vacantes - JobNet",
  description:
    "Busca y filtra oportunidades profesionales en la plataforma JobNet",
});

const jobsStore = useJobsStore();
const catalogStore = useCatalogStore();
const { data: session, status } = useAuth();
const router = useRouter();

// Search state
const searchQuery = ref("");

// Filter state
const showFilters = ref(false);
const filterModality = ref("");
const filterSector = ref("");
const filterLocation = ref("");
const filterSkills = ref<string[]>([]);
const skillSearchInput = ref("");
const showSkillDropdown = ref(false);

// Format salary as readable string
const formatSalary = (amount: number): string => {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}k`;
  }
  return amount.toLocaleString();
};

// Available catalog skills for dropdown (exclude already selected)
const availableCatalogSkills = computed(() => {
  const query = skillSearchInput.value.toLowerCase().trim();
  return catalogStore.skills.filter((s) => {
    const matchesQuery = !query || s.name.toLowerCase().includes(query);
    const notSelected = !filterSkills.value.includes(s.name);
    return matchesQuery && notSelected;
  });
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
  if (filterLocation.value) count++;
  count += filterSkills.value.length;
  return count;
});

const clearFilters = () => {
  filterModality.value = "";
  filterSector.value = "";
  filterLocation.value = "";
  filterSkills.value = [];
  skillSearchInput.value = "";
};

// Client-side filtered jobs
const filteredJobs = computed(() => {
  let results = jobsStore.jobs;

  // Text search (title, company, description)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    results = results.filter((job: Job) => {
      const title = (job.title || "").toLowerCase();
      const company = (job.company || "").toLowerCase();
      const desc = (job.descripcion || "").toLowerCase();
      return (
        title.includes(query) || company.includes(query) || desc.includes(query)
      );
    });
  }

  // Modality filter
  if (filterModality.value) {
    results = results.filter(
      (job: Job) => job.modalidad === filterModality.value,
    );
  }

  // Sector filter
  if (filterSector.value) {
    results = results.filter((job: Job) => job.sector === filterSector.value);
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

  // Skills filter (must match ALL selected skills)
  if (filterSkills.value.length > 0) {
    results = results.filter((job: Job) => {
      if (!job.habilidadesRequeridas) return false;
      const jobSkills = job.habilidadesRequeridas.map((s) => s.toLowerCase());
      return filterSkills.value.every((filterSkill) =>
        jobSkills.includes(filterSkill.toLowerCase()),
      );
    });
  }

  return results;
});

// Close skill dropdown on outside click
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest("[data-skill-dropdown]")) {
    showSkillDropdown.value = false;
  }
};

onMounted(async () => {
  // Redirect admins and moderators to their dashboards
  if (status.value === "authenticated") {
    const role = (session.value?.user as any)?.tipoUsuario;
    if (role?.toUpperCase() === "ADMIN") {
      router.replace("/admin/organizations");
      return;
    } else if (role?.toUpperCase() === "MODERATOR") {
      router.replace("/mod/incidents");
      return;
    }
  }

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
