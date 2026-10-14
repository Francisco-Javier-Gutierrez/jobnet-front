<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <h2
      class="text-base font-bold text-on-background mb-1 flex items-center gap-2"
    >
      <span
        class="material-symbols-outlined text-tertiary dark:text-inverse-primary"
        >work</span
      >
      Sectores Laborales
    </h2>
    <p
      class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
    >
      Selecciona los sectores laborales del catálogo maestro en los que tienes
      experiencia.
    </p>

    <!-- Selected Sector Badges -->
    <div class="flex flex-wrap gap-2 mb-2">
      <span
        v-for="sector in sectors"
        :key="sector"
        class="bg-tertiary/10 dark:bg-tertiary/20 text-tertiary dark:text-inverse-primary border border-tertiary/20 dark:border-tertiary/40 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 font-bold shadow-sm"
      >
        {{ sector }}
        <button
          type="button"
          @click="removeSector(sector)"
          class="hover:text-rose-600 transition flex items-center"
          title="Quitar sector"
        >
          <span class="material-symbols-outlined text-xs">close</span>
        </button>
      </span>
      <span
        v-if="sectors.length === 0"
        class="text-xs text-on-surface-variant dark:text-slate-400 italic"
      >
        Ningún sector seleccionado. Escribe abajo para buscar en el catálogo
        maestro.
      </span>
    </div>

    <!-- Autocomplete input connected to Master Catalog -->
    <div
      class="space-y-3 bg-surface-container-low/40 p-4 border border-outline-variant/50 rounded-xl"
    >
      <div class="flex gap-2">
        <div class="relative flex-grow">
          <span
            class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant dark:text-slate-300 text-sm"
          >
            search
          </span>
          <input
            v-model="sectorSearchQuery"
            type="text"
            placeholder="Buscar sectores en el catálogo maestro (ej. Tecnología y Software, Finanzas)..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl pl-9 pr-4 py-2 text-xs text-on-background outline-none transition"
            @keydown.enter.prevent="handleSectorEnterKey"
          />
        </div>

        <button
          type="button"
          @click="handleQuickAddSector"
          :disabled="!sectorSearchQuery.trim()"
          class="bg-surface border border-outline-variant hover:border-primary hover:bg-primary/5 text-primary text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
        >
          Crear y Agregar
        </button>
      </div>

      <!-- Suggested Master Catalog Sectors List -->
      <div class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
        <button
          v-for="masterSector in filteredCatalogSectors"
          :key="masterSector.id"
          type="button"
          @click="selectCatalogSector(masterSector.name)"
          class="bg-surface hover:bg-tertiary/10 dark:hover:bg-blue-950/40 border border-outline-variant/50 hover:border-tertiary/50 text-on-surface hover:text-tertiary dark:hover:text-blue-300 transition px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-[10px]">add</span>
          {{ masterSector.name }}
        </button>
        <span
          v-if="filteredCatalogSectors.length === 0"
          class="text-[11px] text-on-surface-variant dark:text-slate-400 italic py-1"
        >
          {{
            sectorSearchQuery
              ? "No hay más sugerencias en el catálogo. Haz clic en 'Crear y Agregar' para sugerir este sector."
              : "Escribe para filtrar la lista de sectores del catálogo."
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  sectors: string[];
  catalogSectors?: { id: string; name: string }[];
}>();

const emit = defineEmits<{
  (e: "update:sectors", value: string[]): void;
}>();

const sectorSearchQuery = ref("");

const defaultCatalogSectors = [
  { id: "1", name: "Tecnología y Software" },
  { id: "2", name: "Finanzas y Banca" },
  { id: "3", name: "Salud y Farmacéutica" },
  { id: "4", name: "Educación e Investigación" },
  { id: "5", name: "Manufactura e Industria" },
];

const catalog = computed(() => props.catalogSectors || defaultCatalogSectors);

const filteredCatalogSectors = computed(() => {
  const query = sectorSearchQuery.value.trim().toLowerCase();
  return catalog.value.filter((item) => {
    const isAlreadySelected = props.sectors.includes(item.name);
    if (isAlreadySelected) return false;
    if (!query) return true;
    return item.name.toLowerCase().includes(query);
  });
});

function selectCatalogSector(sectorName: string) {
  if (!props.sectors.includes(sectorName)) {
    emit("update:sectors", [...props.sectors, sectorName]);
  }
  sectorSearchQuery.value = "";
}

function handleQuickAddSector() {
  const val = sectorSearchQuery.value.trim();
  if (val && !props.sectors.includes(val)) {
    emit("update:sectors", [...props.sectors, val]);
  }
  sectorSearchQuery.value = "";
}

function handleSectorEnterKey() {
  handleQuickAddSector();
}

function removeSector(sectorName: string) {
  emit(
    "update:sectors",
    props.sectors.filter((s) => s !== sectorName),
  );
}
</script>
