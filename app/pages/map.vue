<template>
  <div
    class="flex-grow flex flex-col min-h-[calc(100vh-4rem-65px)] p-4 sm:p-6"
    role="main"
  >
    <div class="max-w-6xl mx-auto w-full space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-extrabold text-on-background">
            Mapa Interactivo de Empleos
          </h1>
          <p class="text-xs text-on-surface-variant dark:text-slate-400">
            Explora ofertas geolocalizadas en el Estado de México.
          </p>
        </div>
        <NuxtLink
          to="/vacancies"
          class="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-sm">list</span>
          Ver en lista
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <AppLocationMap
            v-model:lat="initialLat"
            v-model:lng="initialLng"
            label="Filtro Geográfico — Estado de México"
            height="550px"
          />
        </div>

        <!-- Vacantes en el área -->
        <div class="space-y-3">
          <h2 class="text-sm font-bold text-on-surface dark:text-slate-200 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-base">pin_drop</span>
            Vacantes Geolocalizadas ({{ vacancies.length }})
          </h2>
          <div class="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            <NuxtLink
              v-for="vac in vacancies"
              :key="vac.id"
              :to="`/vacancies/${vac.id}`"
              class="block p-4 rounded-xl border border-outline-variant/60 bg-surface-container-lowest dark:bg-slate-900 hover:border-primary/50 transition shadow-sm group"
            >
              <div class="flex items-start justify-between gap-2 mb-1">
                <h3 class="text-xs font-bold text-on-surface dark:text-slate-100 group-hover:text-primary transition line-clamp-1">
                  {{ vac.titulo || vac.title }}
                </h3>
                <span class="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                  {{ vac.modalidad }}
                </span>
              </div>
              <p class="text-[11px] text-on-surface-variant dark:text-slate-400 mb-2">
                {{ vac.empresaNombre || vac.company }}
              </p>
              <div class="flex items-center justify-between text-[10px] text-on-surface-variant dark:text-slate-400">
                <span class="flex items-center gap-1 truncate max-w-[150px]">
                  <span class="material-symbols-outlined text-xs text-primary">location_on</span>
                  {{ vac.location }}
                </span>
                <span class="font-bold text-secondary dark:text-emerald-400 shrink-0">
                  {{ vac.salarioFormatted || vac.salary }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MOCK_VACANCIES } from "~/utils/mockData";

const route = useRoute();
const initialLat = ref(
  route.query.lat ? parseFloat(route.query.lat as string) : 19.2826,
);
const initialLng = ref(
  route.query.lng ? parseFloat(route.query.lng as string) : -99.6557,
);

const vacancies = ref(MOCK_VACANCIES);
</script>
