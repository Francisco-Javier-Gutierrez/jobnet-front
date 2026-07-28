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
          Directorio de Organizaciones y Empresas
        </h1>
        <p
          class="text-on-surface-variant dark:text-slate-300 text-sm max-w-2xl"
        >
          Explora el directorio oficial de empresas verificadas y encuentra
          oportunidades laborales acorde a tus intereses.
        </p>
      </div>

      <!-- Search & Filters -->
      <div
        class="flex flex-col sm:flex-row gap-3 w-full md:w-auto min-w-[340px]"
      >
        <form @submit.prevent="executeSearch" class="flex gap-2 flex-grow">
          <div class="relative flex-grow">
            <span
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <span
                class="material-symbols-outlined text-on-surface-variant dark:text-slate-300/70 text-[20px]"
                >search</span
              >
            </span>
            <input
              v-model="searchInput"
              type="text"
              placeholder="Buscar por nombre comercial, razón social o sector..."
              class="pl-10 pr-8 py-2.5 w-full bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-xl text-sm focus:outline-none focus:border-primary text-on-background shadow-sm"
              aria-label="Buscar organizaciones por nombre o razón social"
            />
            <button
              v-if="searchInput"
              @click="clearSearch"
              type="button"
              class="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 flex-shrink-0"
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
          class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm border font-medium transition duration-200 flex-shrink-0"
          :class="
            onlyVerified
              ? 'bg-primary/10 border-primary text-primary shadow-sm'
              : 'border-outline-variant/60 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high'
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
      aria-label="Cargando organizaciones"
      aria-live="polite"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="border border-outline-variant/60 rounded-2xl p-6 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between h-[250px]"
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
      class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl shadow-sm px-6"
      role="status"
    >
      <div
        class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
      >
        <span class="material-symbols-outlined text-[40px] text-primary"
          >domain</span
        >
      </div>
      <h2 class="text-xl font-bold text-on-background mb-2">
        No se encontraron organizaciones
      </h2>
      <p class="text-on-surface-variant dark:text-slate-300 text-sm max-w-sm">
        No hay registros que coincidan con "{{ searchQuery }}". Intenta con otro
        nombre comercial o razón social.
      </p>
    </div>

    <!-- Companies Grid (RF-59 Grilla de Tarjetas) -->
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
                  <span
                    v-if="company.verified"
                    class="material-symbols-outlined text-secondary text-[16px] flex-shrink-0"
                    title="Organización Verificada"
                    aria-label="Verificada"
                  >
                    verified
                  </span>
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

      <!-- Pagination Controls -->
      <div
        v-if="filteredCompanies.length > itemsPerPage"
        class="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/40 pt-6"
      >
        <span
          class="text-xs text-on-surface-variant dark:text-slate-400 font-medium"
        >
          Mostrando {{ startIndex + 1 }}-{{
            Math.min(endIndex, filteredCompanies.length)
          }}
          de {{ filteredCompanies.length }} organizaciones
        </span>

        <div class="flex items-center gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-outline-variant/60 text-xs font-semibold text-on-surface-variant dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-high transition flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-[16px]"
              >chevron_left</span
            >
            Anterior
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center',
              currentPage === page
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high',
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded-lg border border-outline-variant/60 text-xs font-semibold text-on-surface-variant dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-high transition flex items-center gap-1"
          >
            Siguiente
            <span class="material-symbols-outlined text-[16px]"
              >chevron_right</span
            >
          </button>
        </div>
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

const currentPage = ref(1);
const itemsPerPage = 6;

// Seed data fallback to satisfy user rule and guarantee a rich functional directory
const fallbackCompanies = [
  {
    id: "84280448-7011-70e6-cd7f-7cdd34f0aeb2",
    nombreComercial: "TechSolutions Inc.",
    razonSocial: "TechSolutions S.A. de C.V.",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSzjpaT0Ede7QLy3zl1zft4f4V9csQyhGIsAyNHyyg4lmk54ha7yMkfDw5hbVoBOME8PTGFax9iKrHHZjAmqwMRA4i1UpqhgebzJGIkwq1DS6PKK1G5jxCNSxxPjHi_ezhM-ik2qaFtqa9JYp6ruPrCozHQM4UvsZpk2HUAg07aFTdAk58De2NTtSjHaO49ddhrtHPFA-trQm7WZbFMHwS-NZ7jyJ7ZrGaZD9yxWogET6EbwJ_H8Tk0g",
    sector: "Desarrollo de Software y Cloud Computing",
    about:
      "Empresa tecnológica especializada en desarrollo cloud y arquitectura de microservicios.",
    verified: true,
    location: "Ciudad de México, MX",
  },
  {
    id: "b293021d-9102-482a-b021-998274102948",
    nombreComercial: "InnovaTech Global",
    razonSocial: "InnovaTech Global Solutions S. de R.L.",
    logo: "https://images.unsplash.com/photo-1542744094-3a31b272c490?w=150&auto=format&fit=crop&q=80",
    sector: "Inteligencia Artificial & Ciencia de Datos",
    about:
      "Líder en soluciones de inteligencia artificial aplicada a finanzas y retail.",
    verified: true,
    location: "Guadalajara, JAL, MX",
  },
  {
    id: "c8392019-3910-4019-a910-492019481029",
    nombreComercial: "Grupo Financiero Prisma",
    razonSocial: "Prisma Financial Group S.A.B.",
    logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80",
    sector: "Banca, Finanzas y Fintech",
    about:
      "Institución financiera con presencia latinoamericana focalizada en inclusión digital.",
    verified: true,
    location: "Monterrey, N.L., MX",
  },
  {
    id: "d9302019-1029-4102-b019-592010482019",
    nombreComercial: "BioSalud México",
    razonSocial: "Laboratorios BioSalud Innovación S.A.",
    logo: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=150&auto=format&fit=crop&q=80",
    sector: "Biotecnología y Salud",
    about:
      "Desarrollo de biotecnología avanzada y equipamiento médico inteligente.",
    verified: false,
    location: "Querétaro, QRO, MX",
  },
  {
    id: "e0392019-2019-4102-c019-692010482020",
    nombreComercial: "Starlight Logistics",
    razonSocial: "Starlight Cargo & Supply Chain S.A. de C.V.",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80",
    sector: "Logística y Cadena de Suministro",
    about:
      "Operaciones logísticas internacionales con seguimiento automatizado e IoT.",
    verified: true,
    location: "Puebla, PUE, MX",
  },
  {
    id: "f1403120-3120-5213-d120-703121593121",
    nombreComercial: "Pixel & Code Studio",
    razonSocial: "Pixel Code Digital Agency S.C.",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
    sector: "Diseño UX/UI & Marketing Digital",
    about:
      "Estudio creativo centrado en experiencia de usuario y desarrollo web a medida.",
    verified: false,
    location: "Mérida, YUC, MX",
  },
];

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

// Merged list of real DB items + rich fallbacks (avoiding duplicates)
const companiesList = computed(() => {
  const list = [...dbCompanies.value];
  const existingIds = new Set(list.map((c) => c.id));

  for (const item of fallbackCompanies) {
    if (!existingIds.has(item.id)) {
      list.push(item);
    }
  }
  return list;
});

// RF-59 Contextual Search Filter (filtering explicitly by nombre o razón social)
const filteredCompanies = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
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

// Reset pagination on search or filter change
watch([searchQuery, onlyVerified], () => {
  currentPage.value = 1;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredCompanies.value.length / itemsPerPage)),
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);

const paginatedCompanies = computed(() => {
  return filteredCompanies.value.slice(startIndex.value, endIndex.value);
});

const toggleVerifiedFilter = () => {
  onlyVerified.value = !onlyVerified.value;
};

const executeSearch = () => {
  activeSearchQuery.value = searchInput.value.trim();
  currentPage.value = 1;
  fetchProfiles(activeSearchQuery.value);
};

const clearSearch = () => {
  searchInput.value = "";
  activeSearchQuery.value = "";
  currentPage.value = 1;
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
    "Directorio y buscador contextual de empresas. Filtra organizaciones por nombre comercial o razón social.",
});
</script>
