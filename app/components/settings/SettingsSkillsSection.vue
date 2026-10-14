<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <h2
      class="text-base font-bold text-on-background mb-1 flex items-center gap-2"
    >
      <span
        class="material-symbols-outlined text-emerald-600 dark:text-emerald-400"
        >psychology</span
      >
      Selección de Competencias Técnicas (Habilidades)
    </h2>
    <p
      class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
    >
      Selecciona las habilidades del catálogo maestro para potenciar el cruce
      automático con vacantes laborales disponibles.
    </p>

    <!-- Selected Skill Badges -->
    <div class="flex flex-wrap gap-2 mb-2">
      <span
        v-for="skill in skills"
        :key="skill"
        class="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 font-bold shadow-sm"
      >
        {{ skill }}
        <button
          type="button"
          @click="removeSkill(skill)"
          class="hover:text-rose-600 transition flex items-center"
          title="Quitar habilidad"
        >
          <span class="material-symbols-outlined text-xs">close</span>
        </button>
      </span>
      <span
        v-if="skills.length === 0"
        class="text-xs text-on-surface-variant dark:text-slate-400 italic"
      >
        Ninguna habilidad seleccionada. Escribe abajo para buscar en el catálogo
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
            v-model="skillSearchQuery"
            type="text"
            placeholder="Buscar habilidades en el catálogo maestro (ej. TypeScript, Python, Docker)..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl pl-9 pr-4 py-2 text-xs text-on-background outline-none transition"
            @keydown.enter.prevent="handleSkillEnterKey"
          />
        </div>

        <button
          type="button"
          @click="handleQuickAddSkill"
          :disabled="!skillSearchQuery.trim()"
          class="bg-surface border border-outline-variant hover:border-primary hover:bg-primary/5 text-primary text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
        >
          Crear y Agregar
        </button>
      </div>

      <!-- Suggested Master Catalog Skills List -->
      <div class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
        <button
          v-for="masterSkill in filteredCatalogSkills"
          :key="masterSkill.id"
          type="button"
          @click="selectCatalogSkill(masterSkill.name)"
          class="bg-surface hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-outline-variant/50 hover:border-indigo-400 text-on-surface hover:text-indigo-600 dark:hover:text-indigo-300 transition px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-[10px]">add</span>
          {{ masterSkill.name }}
        </button>
        <span
          v-if="filteredCatalogSkills.length === 0"
          class="text-[11px] text-on-surface-variant dark:text-slate-400 italic py-1"
        >
          {{
            skillSearchQuery
              ? "No hay más sugerencias en el catálogo. Haz clic en 'Crear y Agregar' para sugerir esta habilidad."
              : "Escribe para filtrar la lista de competencias del catálogo."
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  skills: string[];
  catalogSkills?: { id: string; name: string }[];
}>();

const emit = defineEmits<{
  (e: "update:skills", value: string[]): void;
}>();

const skillSearchQuery = ref("");

const defaultCatalogSkills = [
  { id: "1", name: "JavaScript" },
  { id: "2", name: "TypeScript" },
  { id: "3", name: "Vue.js" },
  { id: "4", name: "React" },
  { id: "5", name: "Node.js" },
  { id: "6", name: "Python" },
  { id: "7", name: "AWS" },
  { id: "8", name: "Docker" },
  { id: "9", name: "PostgreSQL" },
  { id: "10", name: "DynamoDB" },
];

const catalog = computed(() => props.catalogSkills || defaultCatalogSkills);

const filteredCatalogSkills = computed(() => {
  const query = skillSearchQuery.value.trim().toLowerCase();
  return catalog.value.filter((item) => {
    const isAlreadySelected = props.skills.includes(item.name);
    if (isAlreadySelected) return false;
    if (!query) return true;
    return item.name.toLowerCase().includes(query);
  });
});

function selectCatalogSkill(skillName: string) {
  if (!props.skills.includes(skillName)) {
    emit("update:skills", [...props.skills, skillName]);
  }
  skillSearchQuery.value = "";
}

function handleQuickAddSkill() {
  const val = skillSearchQuery.value.trim();
  if (val && !props.skills.includes(val)) {
    emit("update:skills", [...props.skills, val]);
  }
  skillSearchQuery.value = "";
}

function handleSkillEnterKey() {
  handleQuickAddSkill();
}

function removeSkill(skillName: string) {
  emit(
    "update:skills",
    props.skills.filter((s) => s !== skillName),
  );
}
</script>
