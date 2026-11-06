<template>
  <AppModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Crear y Contribuir Plantilla a la Comunidad"
    icon="volunteer_activism"
    max-width="3xl"
    z-index-class="z-[1000]"
  >
    <form @submit.prevent="handleSubmit" class="space-y-5 py-1">
      <!-- Mode Selection Header: Desde Perfil vs Desde Cero -->
      <div
        class="flex items-center gap-2 p-1 rounded-2xl bg-surface-container dark:bg-slate-800 border border-outline-variant/40"
      >
        <button
          type="button"
          @click="setMode('profile')"
          class="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          :class="
            creationMode === 'profile'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          "
        >
          <span class="material-symbols-outlined text-base">badge</span>
          <span>📋 Autocompletar desde mi Perfil (Sanitizado)</span>
        </button>

        <button
          type="button"
          @click="setMode('scratch')"
          class="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          :class="
            creationMode === 'scratch'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          "
        >
          <span class="material-symbols-outlined text-base">edit_note</span>
          <span>✨ Diseñar Plantilla desde Cero</span>
        </button>
      </div>

      <!-- Privacy & Sanitization Banner -->
      <div
        class="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-on-surface-variant dark:text-slate-200 flex items-start gap-2.5"
      >
        <span
          class="material-symbols-outlined text-primary text-base shrink-0 mt-0.5"
          >security</span
        >
        <div class="space-y-1">
          <p class="font-bold text-primary">Privacidad y Protección de Datos</p>
          <p class="leading-relaxed">
            Tu información personal (teléfonos, correos, salarios y nombres de
            clientes) no se comparte. La comunidad recibe una estructura
            profesional con fórmulas de logros STAR rellenables.
          </p>
        </div>
      </div>

      <!-- Step 1: Titulo & Rol -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-xs font-bold text-on-surface"
            >Título de la Plantilla *</label
          >
          <input
            v-model="form.titulo"
            type="text"
            required
            placeholder="Ej. Ingeniero Backend Java & Spring Boot"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-surface-container dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none text-on-surface transition"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-on-surface"
            >Rol Específico *</label
          >
          <input
            v-model="form.rol"
            type="text"
            required
            placeholder="Ej. Backend Engineer"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-surface-container dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none text-on-surface transition"
          />
        </div>
      </div>

      <!-- Step 2: Categoría, Nivel, Idioma y Alcance usando custom JobNet AppSelect -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <AppSelect
          v-model="form.categoria!"
          label="Categoría *"
          label-icon="category"
          :options="CATEGORY_OPTIONS"
        />

        <AppSelect
          v-model="form.nivel!"
          label="Nivel *"
          label-icon="grade"
          :options="LEVEL_OPTIONS"
        />

        <AppSelect
          v-model="form.idioma!"
          label="Idioma *"
          label-icon="language"
          :options="LANGUAGE_OPTIONS"
        />

        <AppSelect
          v-model="form.alcance!"
          label="Alcance *"
          label-icon="explore"
          :options="SCOPE_OPTIONS"
        />
      </div>

      <!-- Step 3: Biografía Modelo -->
      <div class="space-y-1">
        <div class="flex items-center justify-between">
          <label class="text-xs font-bold text-on-surface"
            >Resumen Profesional / Biografía Sugerida *</label
          >
          <button
            v-if="creationMode === 'profile'"
            type="button"
            @click="regenerateFromProfile"
            class="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span class="material-symbols-outlined text-xs">restart_alt</span>
            <span>Recargar de mi Perfil</span>
          </button>
        </div>
        <textarea
          v-model="form.biografiaSugerida"
          rows="3"
          required
          class="w-full px-3.5 py-2 text-xs rounded-xl bg-surface-container dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none text-on-surface transition resize-none leading-relaxed"
          placeholder="Escribe un resumen profesional de alto impacto que sirva de guía para los postulantes..."
        ></textarea>
      </div>

      <!-- Step 4: Habilidades Clave -->
      <div class="space-y-1">
        <label class="text-xs font-bold text-on-surface"
          >Habilidades y Tecnologías Clave (Separadas por comas) *</label
        >
        <input
          v-model="skillsInput"
          type="text"
          required
          placeholder="Ej. Java 17, Spring Boot, PostgreSQL, Docker, Microservicios, REST APIs"
          class="w-full px-3.5 py-2 text-xs rounded-xl bg-surface-container dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none text-on-surface transition"
        />
        <div
          v-if="parsedSkills.length > 0"
          class="flex flex-wrap gap-1.5 pt-1.5"
        >
          <span
            v-for="s in parsedSkills"
            :key="s"
            class="px-2 py-0.5 text-[11px] bg-primary/10 text-primary rounded-md font-semibold"
          >
            {{ s }}
          </span>
        </div>
      </div>

      <!-- Step 5: Experiencia Modelo Sugerida -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-xs font-bold text-on-surface"
            >Fórmulas de Experiencia Modelo (Método STAR)</label
          >
          <button
            type="button"
            @click="addExperienceItem"
            class="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span class="material-symbols-outlined text-sm">add_circle</span>
            <span>+ Agregar Cargo Modelo</span>
          </button>
        </div>

        <div class="space-y-3 max-h-56 overflow-y-auto pr-1">
          <div
            v-for="(exp, i) in form.experienciaSugerida"
            :key="i"
            class="p-3 bg-surface-container-low dark:bg-slate-800/40 rounded-xl border border-outline-variant/40 space-y-2 relative"
          >
            <button
              type="button"
              @click="removeExperienceItem(i)"
              class="absolute top-2 right-2 text-on-surface-variant hover:text-error p-1 cursor-pointer"
              title="Eliminar este cargo"
            >
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                v-model="exp.cargo"
                type="text"
                placeholder="Cargo (Ej. Software Engineer)"
                class="px-2.5 py-1.5 text-xs rounded-lg bg-surface-container dark:bg-slate-800 border border-outline-variant/60 outline-none"
              />
              <input
                v-model="exp.empresa"
                type="text"
                placeholder="Sector/Industria (Ej. Empresa Tech)"
                class="px-2.5 py-1.5 text-xs rounded-lg bg-surface-container dark:bg-slate-800 border border-outline-variant/60 outline-none"
              />
              <input
                v-model="exp.periodo"
                type="text"
                placeholder="Periodo (Ej. 2022 - Presente)"
                class="px-2.5 py-1.5 text-xs rounded-lg bg-surface-container dark:bg-slate-800 border border-outline-variant/60 outline-none"
              />
            </div>

            <!-- Bullet points STAR -->
            <div class="space-y-1">
              <p
                class="text-[10px] font-bold text-on-surface-variant uppercase"
              >
                Logros Cuantificables (STAR):
              </p>
              <div
                v-for="(logro, lIdx) in exp.logros"
                :key="lIdx"
                class="flex items-center gap-1.5"
              >
                <span class="text-primary font-bold text-xs">•</span>
                <input
                  v-model="exp.logros[lIdx]"
                  type="text"
                  placeholder="Ej. Optimicé consultas SQL reduciendo la latencia en un [35]%."
                  class="flex-1 px-2 py-1 text-[11px] rounded-md bg-surface-container dark:bg-slate-800 border border-outline-variant/50 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/40"
      >
        <button
          type="button"
          @click="$emit('update:modelValue', false)"
          class="px-4 py-2.5 rounded-xl border border-outline-variant/60 text-xs font-semibold hover:bg-surface-container transition cursor-pointer"
        >
          Cancelar
        </button>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
        >
          <span
            v-if="isSubmitting"
            class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"
          ></span>
          <span v-else class="material-symbols-outlined text-base">send</span>
          <span>Publicar Plantilla a la Comunidad</span>
        </button>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import AppModal from "~/components/common/AppModal.vue";
import AppSelect from "~/components/AppSelect.vue";
import type {
  CommunityCvTemplate,
  RoleCategory,
  ExperienceLevel,
  LanguageCode,
  ScopeCode,
} from "~/types/cvCommunity";
import { sanitizeProfileToCommunityTemplate } from "~/utils/cvSanitizer";

const CATEGORY_OPTIONS = [
  { value: "frontend", label: "Frontend", icon: "code" },
  { value: "backend", label: "Backend", icon: "terminal" },
  { value: "fullstack", label: "Fullstack", icon: "layers" },
  { value: "mobile", label: "Móvil", icon: "smartphone" },
  { value: "data-ai", label: "Datos & IA", icon: "query_stats" },
  { value: "devops-cloud", label: "DevOps & Cloud", icon: "cloud" },
  { value: "design-ux", label: "Diseño UI/UX", icon: "draw" },
  {
    value: "logistica-operaciones",
    label: "Logística & Almacén",
    icon: "warehouse",
  },
  { value: "ventas-bizdev", label: "Ventas & Comercial", icon: "storefront" },
  {
    value: "administracion-finanzas",
    label: "Administración & Finanzas",
    icon: "account_balance",
  },
];

const LEVEL_OPTIONS = [
  { value: "trainee", label: "Trainee / Becario", icon: "school" },
  { value: "junior", label: "Junior", icon: "psychology" },
  { value: "mid", label: "Mid-Level", icon: "trending_up" },
  { value: "senior", label: "Senior", icon: "stars" },
  { value: "lead", label: "Lead / Tech Lead", icon: "workspace_premium" },
];

const LANGUAGE_OPTIONS = [
  { value: "es", label: "🇲🇽 Español", icon: "flag" },
  { value: "en", label: "🇺🇸 English", icon: "public" },
  { value: "bilingual", label: "🌐 Bilingüe (Dual)", icon: "translate" },
];

const SCOPE_OPTIONS = [
  {
    value: "SUR_EDOMEX",
    label: "📍 Sur EdoMéx / Regional",
    icon: "location_on",
  },
  { value: "NACIONAL", label: "🇲🇽 Nacional", icon: "flag" },
  { value: "GLOBAL_REMOTO", label: "🌍 Global / Remoto", icon: "language" },
];

const props = defineProps<{
  modelValue: boolean;
  candidateProfile: any;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "submit", template: Partial<CommunityCvTemplate>): void;
}>();

const creationMode = ref<"profile" | "scratch">("profile");
const isSubmitting = ref(false);
const skillsInput = ref("");

const form = ref<Partial<CommunityCvTemplate>>({
  titulo: "",
  rol: "",
  categoria: "frontend" as RoleCategory,
  nivel: "mid" as ExperienceLevel,
  idioma: "es" as LanguageCode,
  alcance: "SUR_EDOMEX" as ScopeCode,
  biografiaSugerida: "",
  habilidades: [],
  experienciaSugerida: [],
  educacionSugerida: [],
});

const parsedSkills = computed(() => {
  if (!skillsInput.value.trim()) return [];
  return skillsInput.value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
});

const setMode = (mode: "profile" | "scratch") => {
  creationMode.value = mode;
  if (mode === "profile") {
    regenerateFromProfile();
  } else {
    // Blank template form
    form.value = {
      titulo: "",
      rol: "",
      categoria: "backend",
      nivel: "junior",
      idioma: "es",
      alcance: "SUR_EDOMEX",
      biografiaSugerida: "",
      habilidades: [],
      experienciaSugerida: [
        {
          cargo: "Desarrollador de Software",
          empresa: "Empresa de Tecnología / Corredor Industrial",
          periodo: "2023 - Presente",
          logros: [
            "Diseñé e implementé [X] componentes/módulos con disponibilidad del [99]%.",
            "Automaticé procesos manuales ahorrando [10] horas semanales al equipo.",
          ],
        },
      ],
      educacionSugerida: [
        {
          titulo: "Ingeniería o Licenciatura en el Área",
          institucion: "Universidad / Instituto Tecnológico",
          periodo: "2019 - 2023",
        },
      ],
    };
    skillsInput.value = "";
  }
};

const regenerateFromProfile = () => {
  if (!props.candidateProfile) return;

  const sanitized = sanitizeProfileToCommunityTemplate(props.candidateProfile, {
    categoria: form.value.categoria,
    nivel: form.value.nivel,
    idioma: form.value.idioma,
    alcance: form.value.alcance,
  });

  form.value.titulo = sanitized.titulo;
  form.value.rol = sanitized.rol;
  form.value.biografiaSugerida = sanitized.biografiaSugerida;
  form.value.habilidades = sanitized.habilidades;
  form.value.experienciaSugerida = sanitized.experienciaSugerida;
  form.value.educacionSugerida = sanitized.educacionSugerida;
  skillsInput.value = sanitized.habilidades.join(", ");
};

const addExperienceItem = () => {
  if (!form.value.experienciaSugerida) {
    form.value.experienciaSugerida = [];
  }
  form.value.experienciaSugerida.push({
    cargo: "Nuevo Cargo Profesional",
    empresa: "Sector Empresarial Relevante",
    periodo: "Año Inicio - Año Fin",
    logros: ["Implementé [X] procesos clave alcanzando una mejora del [20]%."],
  });
};

const removeExperienceItem = (index: number) => {
  if (form.value.experienciaSugerida) {
    form.value.experienciaSugerida.splice(index, 1);
  }
};

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      if (creationMode.value === "profile") {
        regenerateFromProfile();
      }
    }
  },
  { immediate: true },
);

const handleSubmit = () => {
  form.value.habilidades = parsedSkills.value;

  isSubmitting.value = true;
  emit("submit", { ...form.value });
  setTimeout(() => {
    isSubmitting.value = false;
  }, 1000);
};
</script>
