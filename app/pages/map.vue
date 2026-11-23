<template>
  <div
    class="flex-grow flex flex-col min-h-[calc(100vh-4rem-65px)] p-4 sm:p-6"
    role="main"
  >
    <div class="max-w-6xl mx-auto w-full space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-xl font-extrabold text-on-background">
            Mapa Interactivo de Empleos
          </h1>
          <p class="text-xs text-on-surface-variant dark:text-slate-400">
            Explora ofertas reales geolocalizadas en el Estado de México.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/vacancies"
            class="text-xs font-bold text-primary hover:underline flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg"
          >
            <span class="material-symbols-outlined text-sm">list</span>
            Ver en lista
          </NuxtLink>
        </div>
      </div>

      <!-- Filtros rápidos -->
      <div
        class="flex items-center gap-3 flex-wrap bg-surface-container-lowest dark:bg-slate-900/60 p-3 rounded-2xl border border-outline-variant/50"
      >
        <div class="relative flex-1 min-w-[200px]">
          <span
            class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"
            >search</span
          >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por título, empresa o municipio..."
            class="w-full bg-surface-container-low dark:bg-slate-800 text-xs pl-8 pr-3 py-2 rounded-xl border border-outline-variant/40 focus:outline-none focus:border-primary text-on-background placeholder:text-on-surface-variant/60"
          />
        </div>
        <select
          v-model="selectedModality"
          class="bg-surface-container-low dark:bg-slate-800 text-xs px-3 py-2 rounded-xl border border-outline-variant/40 focus:outline-none focus:border-primary text-on-background"
        >
          <option value="ALL">Todas las modalidades</option>
          <option value="Presencial">Presencial</option>
          <option value="Híbrido">Híbrido</option>
          <option value="Remoto">Remoto</option>
        </select>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <ClientOnly>
            <AppLocationMap
              v-model:lat="initialLat"
              v-model:lng="initialLng"
              :markers="mapMarkers"
              label="Filtro Geográfico — Estado de México"
              height="550px"
              @select-marker="handleMarkerSelect"
            />
            <template #fallback>
              <div
                class="h-[550px] w-full rounded-2xl bg-surface-container-low/40 dark:bg-slate-900/60 border border-outline-variant/40 animate-pulse flex items-center justify-center"
              >
                <span
                  class="text-xs text-on-surface-variant dark:text-slate-400"
                >
                  Cargando mapa interactivo...
                </span>
              </div>
            </template>
          </ClientOnly>
        </div>

        <!-- Vacantes en el área -->
        <div class="space-y-3 flex flex-col max-h-[550px]">
          <div class="flex items-center justify-between">
            <h2
              class="text-sm font-bold text-on-surface dark:text-slate-200 flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-primary text-base"
                >pin_drop</span
              >
              Vacantes Geolocalizadas ({{ filteredVacancies.length }})
            </h2>
            <button
              v-if="pending"
              type="button"
              class="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"
            ></button>
          </div>

          <!-- Loading state -->
          <div v-if="pending" class="space-y-3 overflow-y-auto pr-1">
            <div
              v-for="i in 3"
              :key="i"
              class="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest dark:bg-slate-900 animate-pulse space-y-2"
            >
              <div class="h-3 bg-surface-container-high rounded w-3/4"></div>
              <div class="h-2 bg-surface-container-high rounded w-1/2"></div>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-else-if="filteredVacancies.length === 0"
            class="flex-1 flex flex-col items-center justify-center p-6 text-center border border-dashed border-outline-variant/60 rounded-2xl bg-surface-container-lowest dark:bg-slate-900/50"
          >
            <span
              class="material-symbols-outlined text-3xl text-on-surface-variant/40 mb-2"
              >location_off</span
            >
            <p class="text-xs font-bold text-on-surface dark:text-slate-300">
              No hay vacantes disponibles
            </p>
            <p
              class="text-[11px] text-on-surface-variant dark:text-slate-400 mt-1"
            >
              {{
                searchQuery || selectedModality !== "ALL"
                  ? "Intenta ajustando los filtros de búsqueda."
                  : "Actualmente no se han registrado vacantes con geolocalización activa."
              }}
            </p>
          </div>

          <!-- List of vacancies -->
          <div v-else class="space-y-3 overflow-y-auto pr-1 flex-1">
            <div
              v-for="vac in filteredVacancies"
              :key="vac.id"
              @click="focusVacancy(vac)"
              :class="[
                'block p-4 rounded-xl border transition shadow-sm cursor-pointer group',
                selectedVacancyId === vac.id
                  ? 'border-primary ring-1 ring-primary/40 bg-primary/5 dark:bg-primary/10'
                  : 'border-outline-variant/60 bg-surface-container-lowest dark:bg-slate-900 hover:border-primary/50',
              ]"
            >
              <div class="flex items-start justify-between gap-2 mb-1">
                <h3
                  class="text-xs font-bold text-on-surface dark:text-slate-100 group-hover:text-primary transition line-clamp-1"
                >
                  {{ vac.titulo || vac.title }}
                </h3>
                <span
                  class="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0"
                >
                  {{ vac.modalidad }}
                </span>
              </div>
              <p
                class="text-[11px] text-on-surface-variant dark:text-slate-400 mb-2"
              >
                {{ vac.empresaNombre || vac.company }}
              </p>
              <div
                class="flex items-center justify-between text-[10px] text-on-surface-variant dark:text-slate-400"
              >
                <span class="flex items-center gap-1 truncate max-w-[150px]">
                  <span class="material-symbols-outlined text-xs text-primary"
                    >location_on</span
                  >
                  {{ vac.location || vac.municipio || "Estado de México" }}
                </span>
                <span
                  class="font-bold text-secondary dark:text-emerald-400 shrink-0"
                >
                  {{
                    vac.salarioFormatted ||
                    (vac.salario
                      ? `$${vac.salario.toLocaleString()} MXN`
                      : "Salario confidencial")
                  }}
                </span>
              </div>
              <div
                class="mt-2.5 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[10px]"
              >
                <span
                  class="text-primary font-bold group-hover:underline flex items-center gap-0.5"
                >
                  Centrar en mapa
                  <span class="material-symbols-outlined text-[11px]"
                    >my_location</span
                  >
                </span>
                <NuxtLink
                  :to="`/vacancies/${vac.id}`"
                  @click.stop
                  class="text-secondary dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5"
                >
                  Detalles
                  <span class="material-symbols-outlined text-[11px]"
                    >arrow_forward</span
                  >
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface VacancyItem {
  id: string;
  title?: string;
  titulo?: string;
  company?: string;
  empresaNombre?: string;
  modalidad?: string;
  location?: string;
  municipio?: string;
  salario?: number;
  salarioFormatted?: string;
  lat?: number;
  lng?: number;
  [key: string]: any;
}

useSeoMeta({
  title: "Mapa Interactivo de Empleos | JobNet",
  description:
    "Explora y geolocaliza ofertas de trabajo activas en el Estado de México.",
});

const config = useRuntimeConfig();
const route = useRoute();

const initialLat = ref(
  route.query.lat ? parseFloat(route.query.lat as string) : 19.2826,
);
const initialLng = ref(
  route.query.lng ? parseFloat(route.query.lng as string) : -99.6557,
);

const searchQuery = ref("");
const selectedModality = ref("ALL");
const selectedVacancyId = ref<string | null>(null);

// Fetch real vacancies from API
const { data: rawJobs, pending } = await useAsyncData<VacancyItem[]>(
  "map-vacancies",
  async () => {
    try {
      const res = await $fetch<any>(`${config.public.apiUrl}/jobs`);
      if (Array.isArray(res)) return res;
      if (res?.data && Array.isArray(res.data)) return res.data;
      return [];
    } catch (e) {
      console.error("Error fetching map vacancies from backend:", e);
      return [];
    }
  },
  { default: () => [] },
);

const vacancies = computed<VacancyItem[]>(() => {
  return rawJobs.value || [];
});

const filteredVacancies = computed<VacancyItem[]>(() => {
  let list = vacancies.value;
  if (selectedModality.value !== "ALL") {
    list = list.filter(
      (v) =>
        (v.modalidad || "").toLowerCase() ===
        selectedModality.value.toLowerCase(),
    );
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(
      (v) =>
        (v.titulo || v.title || "").toLowerCase().includes(q) ||
        (v.empresaNombre || v.company || "").toLowerCase().includes(q) ||
        (v.location || v.municipio || "").toLowerCase().includes(q),
    );
  }
  return list;
});

const mapMarkers = computed(() => {
  return filteredVacancies.value
    .filter((v) => typeof v.lat === "number" && typeof v.lng === "number")
    .map((v) => ({
      lat: v.lat as number,
      lng: v.lng as number,
      title: v.titulo || v.title || "Vacante",
      subtitle: `${v.empresaNombre || v.company || ""} • ${v.salarioFormatted || (v.salario ? `$${v.salario.toLocaleString()} MXN` : "Salario confidencial")}`,
      id: v.id,
    }));
});

function focusVacancy(vac: VacancyItem) {
  selectedVacancyId.value = vac.id;
  if (typeof vac.lat === "number" && typeof vac.lng === "number") {
    initialLat.value = vac.lat;
    initialLng.value = vac.lng;
  }
}

function handleMarkerSelect(marker: { id?: string; lat: number; lng: number }) {
  if (marker.id) {
    selectedVacancyId.value = marker.id;
  }
}
</script>
