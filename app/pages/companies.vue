<template>
  <div
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full bg-background min-h-screen"
  >
    <div class="mb-10">
      <h1 class="text-3xl font-bold tracking-tight text-on-background mb-2">
        Directorio de Empresas
      </h1>
      <p class="text-on-surface-variant text-sm">
        Conoce las organizaciones que contratan talento a través de JobNet.
      </p>
    </div>

    <!-- Search / Filter bar -->
    <div class="mb-8 max-w-md">
      <div class="relative">
        <span
          class="absolute left-3 top-3 material-symbols-outlined text-on-surface-variant text-lg"
          >search</span
        >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar empresa por nombre o sector..."
          class="w-full bg-surface-container-lowest border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-background outline-none transition shadow-sm"
        />
      </div>
    </div>

    <!-- Companies Grid -->
    <div
      v-if="filteredCompanies.length === 0"
      class="text-center py-20 border border-dashed border-outline-variant rounded-2xl bg-surface-container-lowest shadow-sm"
    >
      <p class="text-on-surface-variant">
        No se encontraron organizaciones disponibles.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="company in filteredCompanies"
        :key="company.id"
        class="border border-outline-variant/60 rounded-2xl p-6 bg-surface-container-lowest hover:border-primary transition duration-300 flex flex-col justify-between group hover:shadow-md"
      >
        <div>
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm overflow-hidden flex-shrink-0"
            >
              <img
                v-if="company.logo"
                :src="company.logo"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ company.name.charAt(0) }}</span>
            </div>
            <div>
              <h2
                class="text-lg font-bold text-on-background group-hover:text-primary transition flex items-center gap-1.5"
              >
                {{ company.name }}
                <span
                  v-if="company.verified"
                  class="material-symbols-outlined text-secondary text-lg"
                  style="font-variation-settings: &quot;FILL&quot; 1"
                  >verified</span
                >
              </h2>
              <span class="text-xs text-on-surface-variant font-semibold">{{
                company.sector
              }}</span>
            </div>
          </div>
          <p
            class="text-on-surface-variant text-xs leading-relaxed line-clamp-3 mb-6"
          >
            {{ company.about }}
          </p>
        </div>

        <div
          class="border-t border-outline-variant/30 pt-4 mt-auto flex items-center justify-between"
        >
          <span
            class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider"
            >{{ company.location }}</span
          >
          <NuxtLink
            :to="`/company/${company.id}`"
            class="text-primary hover:text-primary-container text-xs font-bold transition"
          >
            Ver Perfil
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

useSeoMeta({
  title: "Directorio de Empresas - JobNet",
  description:
    "Explora la lista de organizaciones registradas en la plataforma de reclutamiento JobNet",
});

const searchQuery = ref("");

const companies = ref([
  {
    id: "44f88418-9081-70d4-b8d9-e04f2e8230fc", // Francisco Tech ID
    name: "Francisco Tech",
    sector: "Empresa de Tecnología",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSzjpaT0Ede7QLy3zl1zft4f4V9csQyhGIsAyNHyyg4lmk54ha7yMkfDw5hbVoBOME8PTGFax9iKrHHZjAmqwMRA4i1UpqhgebzJGIkwq1DS6PKK1G5jxCNSxxPjHi_ezhM-ik2qaFtqa9JYp6ruPrCozHQM4UvsZpk2HUAg07aFTdAk58De2NTtSjHaO49ddhrtHPFA-trQm7WZbFMHwS-NZ7jyJ7ZrGaZD9yxWogET6EbwJ_H8Tk0g",
    about: "Empresa líder de Francisco Tech para demostración en JobNet.",
    location: "México",
    verified: true,
  },
  {
    id: "mock-techsolutions",
    name: "TechSolutions Inc.",
    sector: "Desarrollo de Software y Tecnología",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSzjpaT0Ede7QLy3zl1zft4f4V9csQyhGIsAyNHyyg4lmk54ha7yMkfDw5hbVoBOME8PTGFax9iKrHHZjAmqwMRA4i1UpqhgebzJGIkwq1DS6PKK1G5jxCNSxxPjHi_ezhM-ik2qaFtqa9JYp6ruPrCozHQM4UvsZpk2HUAg07aFTdAk58De2NTtSjHaO49ddhrtHPFA-trQm7WZbFMHwS-NZ7jyJ7ZrGaZD9yxWogET6EbwJ_H8Tk0g",
    about:
      "Somos una empresa líder en innovación tecnológica, dedicada a construir soluciones de software escalables que transforman industrias.",
    location: "Ciudad de México",
    verified: true,
  },
]);

const filteredCompanies = computed(() => {
  if (!searchQuery.value.trim()) return companies.value;
  const q = searchQuery.value.toLowerCase();
  return companies.value.filter(
    (c) =>
      c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q),
  );
});
</script>
