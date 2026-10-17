<template>
  <AppModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Previsualizador de Plantillas en tu Perfil"
    icon="visibility"
    max-width="4xl"
    z-index-class="z-[1000]"
  >
    <div class="space-y-6 py-1">
      <!-- Top Control Bar: Template Selector & Language Toggle -->
      <div class="p-4 rounded-2xl bg-surface-container/70 dark:bg-slate-800/60 border border-outline-variant/40 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <!-- Template Selector Dropdown / Status -->
          <!-- Template Selector using custom JobNet AppSelect -->
          <div class="flex items-center gap-2 flex-wrap flex-1 min-w-[280px]">
            <div class="w-full sm:w-80">
              <AppSelect
                v-model="selectedTemplateId"
                label="Plantilla Seleccionada"
                label-icon="auto_stories"
                :options="templateSelectOptions"
              />
            </div>

            <div class="flex items-center gap-1.5 pt-4 sm:pt-5">
              <span
                v-if="currentTemplate?.alcance === 'SUR_EDOMEX'"
                class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
              >
                📍 Sur EdoMéx
              </span>
              <span
                v-else-if="currentTemplate?.alcance === 'GLOBAL_REMOTO'"
                class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
              >
                🌍 Remoto / Global
              </span>
            </div>
          </div>

          <!-- Language Switcher Toggle -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-on-surface-variant">Idioma:</span>
            <div class="inline-flex items-center p-0.5 rounded-xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/50">
              <button
                type="button"
                @click="activeLang = 'es'"
                class="px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                :class="activeLang === 'es' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'"
              >
                <span>🇲🇽</span>
                <span>Español</span>
              </button>
              <button
                type="button"
                @click="activeLang = 'en'"
                class="px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                :class="activeLang === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'"
              >
                <span>🇺🇸</span>
                <span>English</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mode Toggle: Perfil Completo vs Comparativa -->
        <div class="flex items-center gap-2 border-t border-outline-variant/30 pt-3">
          <button
            type="button"
            @click="viewMode = 'preview'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            :class="viewMode === 'preview' ? 'bg-primary/10 text-primary border border-primary/30' : 'text-on-surface-variant hover:text-on-surface'"
          >
            <span class="material-symbols-outlined text-base">person</span>
            <span>Previsualización del Perfil</span>
          </button>

          <button
            type="button"
            @click="viewMode = 'diff'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            :class="viewMode === 'diff' ? 'bg-primary/10 text-primary border border-primary/30' : 'text-on-surface-variant hover:text-on-surface'"
          >
            <span class="material-symbols-outlined text-base">compare_arrows</span>
            <span>Comparativa (Antes vs Después)</span>
          </button>
        </div>
      </div>

      <!-- VIEW MODE 1: LIVE PROFILE PREVIEW -->
      <div v-if="viewMode === 'preview'" class="space-y-6">
        <!-- Mock Candidate Profile Header Card -->
        <div class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <!-- Top bar accent -->
          <div class="h-2 bg-gradient-to-r from-primary to-indigo-600 w-full"></div>

          <div class="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <!-- Candidate Avatar -->
            <img
              :src="profile?.fotoPerfil || defaultAvatar"
              :alt="profile?.nombre || 'Candidato'"
              class="w-24 h-24 rounded-full object-cover border-4 border-surface-container-lowest shadow-md shrink-0"
            />

            <!-- Info Preview -->
            <div class="space-y-2 text-center sm:text-left flex-1 min-w-0">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 class="text-xl font-extrabold text-on-surface dark:text-slate-100 truncate">
                  {{ profile?.nombre || "Tu Nombre" }}
                </h3>

                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container self-center sm:self-auto inline-flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>{{ profile?.estadoBusqueda || "En búsqueda activa" }}</span>
                </span>
              </div>

              <!-- Transformed Professional Title -->
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs sm:text-sm font-bold">
                <span class="material-symbols-outlined text-base">badge</span>
                <span>{{ resolvedContent?.rol || resolvedContent?.titulo }}</span>
              </div>

              <p class="text-xs text-on-surface-variant dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <span class="material-symbols-outlined text-sm">location_on</span>
                <span>{{ profile?.ubicacion || "Estado de México, México" }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Section: Biografía Profesional -->
        <div class="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base text-primary">description</span>
              <span>Sobre mí / Extracto Profesional</span>
            </h4>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              ✓ Optimizado ATS
            </span>
          </div>

          <p class="text-xs sm:text-sm text-on-surface dark:text-slate-200 leading-relaxed">
            {{ resolvedContent?.biografiaSugerida }}
          </p>
        </div>

        <!-- Section: Habilidades Técnicas -->
        <div class="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base text-primary">psychology</span>
              <span>Habilidades y Tecnologías Destacadas</span>
            </h4>
            <span class="text-xs font-bold text-primary">
              {{ resolvedContent?.habilidades.length || 0 }} habilidades
            </span>
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in resolvedContent?.habilidades"
              :key="skill"
              class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-container dark:bg-slate-800 border border-outline-variant/50 text-on-surface dark:text-slate-200 flex items-center gap-1.5 shadow-2xs"
            >
              <span class="material-symbols-outlined text-xs text-primary">check_circle</span>
              <span>{{ skill }}</span>
            </span>
          </div>
        </div>

        <!-- Section: Trayectoria Laboral Modelo -->
        <div
          v-if="resolvedContent?.experienciaSugerida && resolvedContent.experienciaSugerida.length > 0"
          class="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 space-y-3"
        >
          <h4 class="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base text-primary">work</span>
            <span>Trayectoria Laboral Modelo (Fórmulas STAR)</span>
          </h4>

          <div class="space-y-3">
            <div
              v-for="(exp, idx) in resolvedContent.experienciaSugerida"
              :key="idx"
              class="p-4 rounded-xl bg-surface-container/40 dark:bg-slate-800/40 border border-outline-variant/40 space-y-2"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span class="text-xs font-bold text-on-surface dark:text-slate-100">{{ exp.cargo }}</span>
                <span class="text-[11px] text-on-surface-variant dark:text-slate-400">{{ exp.periodo }}</span>
              </div>
              <p class="text-xs font-medium text-primary">{{ exp.empresa }}</p>

              <ul class="space-y-1.5 pt-1">
                <li
                  v-for="(logro, lIdx) in exp.logros"
                  :key="lIdx"
                  class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed flex items-start gap-2"
                >
                  <span class="text-primary font-bold mt-0.5">•</span>
                  <span>{{ logro }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW MODE 2: COMPARATIVE (DIFF) -->
      <div v-else-if="viewMode === 'diff'" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Current Profile -->
          <div class="p-5 rounded-2xl bg-surface-container/50 dark:bg-slate-800/40 border border-outline-variant/60 space-y-4">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              <span class="material-symbols-outlined text-base text-slate-500">history</span>
              <span>Tu Perfil Actual</span>
            </div>

            <div class="space-y-1">
              <p class="text-[11px] font-bold text-on-surface-variant uppercase">Título Profesional:</p>
              <p class="text-xs font-semibold text-on-surface">
                {{ profile?.tituloProfesional || "Sin título especificado" }}
              </p>
            </div>

            <div class="space-y-1">
              <p class="text-[11px] font-bold text-on-surface-variant uppercase">Biografía:</p>
              <p class="text-xs text-on-surface-variant line-clamp-4 leading-relaxed">
                {{ profile?.biografia || "Sin biografía profesional redactada" }}
              </p>
            </div>

            <div class="space-y-1">
              <p class="text-[11px] font-bold text-on-surface-variant uppercase">Habilidades Registradas:</p>
              <div class="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                <span
                  v-for="s in currentProfileSkills"
                  :key="s"
                  class="px-2 py-0.5 text-[11px] bg-surface-container-high rounded-md text-on-surface"
                >
                  {{ s }}
                </span>
                <span v-if="currentProfileSkills.length === 0" class="text-xs text-on-surface-variant italic">
                  No tienes habilidades técnicas agregadas
                </span>
              </div>
            </div>
          </div>

          <!-- Transformed Profile with Template -->
          <div class="p-5 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/30 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <span class="material-symbols-outlined text-base">auto_fix_high</span>
                <span>Con la Plantilla ({{ activeLang === 'es' ? 'Español' : 'English' }})</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary text-on-primary">
                Nuevo
              </span>
            </div>

            <div class="space-y-1">
              <p class="text-[11px] font-bold text-primary uppercase">Título Propuesto:</p>
              <p class="text-xs font-bold text-on-surface dark:text-slate-100">
                {{ resolvedContent?.rol || resolvedContent?.titulo }}
              </p>
            </div>

            <div class="space-y-1">
              <p class="text-[11px] font-bold text-primary uppercase">Biografía Optimizada:</p>
              <p class="text-xs text-on-surface dark:text-slate-200 line-clamp-4 leading-relaxed">
                {{ resolvedContent?.biografiaSugerida }}
              </p>
            </div>

            <div class="space-y-1">
              <p class="text-[11px] font-bold text-primary uppercase">Habilidades a Incorporar:</p>
              <div class="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                <span
                  v-for="s in resolvedContent?.habilidades"
                  :key="s"
                  class="px-2 py-0.5 text-[11px] bg-primary/10 text-primary border border-primary/20 rounded-md font-semibold"
                >
                  + {{ s }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-outline-variant/60 text-xs font-semibold hover:bg-surface-container transition cursor-pointer"
        >
          Cerrar
        </button>

        <div class="w-full sm:w-auto flex items-center gap-2">
          <button
            type="button"
            v-if="currentTemplate"
            @click="handleUseCv"
            class="px-4 py-2.5 rounded-xl border border-outline-variant/60 text-xs font-bold hover:bg-surface-container text-on-surface dark:text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span class="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>Generar CV con estos datos</span>
          </button>

          <button
            type="button"
            v-if="currentTemplate"
            @click="handleApplyProfile"
            :disabled="applying"
            class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span class="material-symbols-outlined text-base">sync_saved_locally</span>
            <span>{{ applying ? "Aplicando..." : "⚡ Aplicar a mi Perfil Ahora" }}</span>
          </button>
        </div>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import AppModal from "~/components/common/AppModal.vue";
import AppSelect from "~/components/AppSelect.vue";
import type { CommunityCvTemplate } from "~/types/cvCommunity";
import { resolveTemplateContent } from "~/types/cvCommunity";
import { CV_COMMUNITY_SEED } from "~/utils/cvCommunitySeed";
import { useCommunityCvTemplates } from "~/composables/useCommunityCvTemplates";

const props = defineProps<{
  modelValue: boolean;
  profile?: any;
  initialTemplate?: CommunityCvTemplate | null;
  initialLang?: "es" | "en";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "close"): void;
  (e: "applied", template: CommunityCvTemplate, lang: "es" | "en"): void;
  (e: "use-cv", template: CommunityCvTemplate, lang: "es" | "en"): void;
}>();

const { communityTemplates, applyTemplateToCandidateProfile } = useCommunityCvTemplates();

const defaultAvatar =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

const allTemplates = computed(() => {
  return communityTemplates.value && communityTemplates.value.length > 0
    ? communityTemplates.value
    : CV_COMMUNITY_SEED;
});

const templateSelectOptions = computed(() => {
  return allTemplates.value.map((tpl) => ({
    value: tpl.id,
    label: `${tpl.titulo} (${tpl.nivel.toUpperCase()})`,
    icon:
      tpl.categoria === "frontend"
        ? "code"
        : tpl.categoria === "backend"
          ? "terminal"
          : tpl.categoria === "logistica-operaciones"
            ? "warehouse"
            : tpl.categoria === "ventas-bizdev"
              ? "storefront"
              : tpl.categoria === "data-ai"
                ? "query_stats"
                : "auto_stories",
  }));
});

const selectedTemplateId = ref<string>(
  props.initialTemplate?.id || allTemplates.value[0]?.id || "seed-backend-java-edomex"
);

const activeLang = ref<"es" | "en">(props.initialLang || "es");
const viewMode = ref<"preview" | "diff">("preview");
const applying = ref(false);

const currentTemplate = computed(() => {
  return (
    allTemplates.value.find((t) => t.id === selectedTemplateId.value) ||
    allTemplates.value[0] ||
    null
  );
});

watch(
  () => props.initialTemplate,
  (newTpl) => {
    if (newTpl?.id) {
      selectedTemplateId.value = newTpl.id;
      if (newTpl.idioma === "en") {
        activeLang.value = "en";
      } else {
        activeLang.value = "es";
      }
    }
  }
);

watch(
  () => props.initialLang,
  (newLang) => {
    if (newLang) {
      activeLang.value = newLang;
    }
  }
);

const resolvedContent = computed(() => {
  if (!currentTemplate.value) return null;
  return resolveTemplateContent(currentTemplate.value, activeLang.value);
});

const currentProfileSkills = computed(() => {
  if (!props.profile?.habilidades) return [];
  if (Array.isArray(props.profile.habilidades)) {
    return props.profile.habilidades;
  }
  return [];
});

const handleApplyProfile = async () => {
  if (!currentTemplate.value || !props.profile?.id) return;
  applying.value = true;
  try {
    const success = await applyTemplateToCandidateProfile(
      currentTemplate.value,
      props.profile.id,
      activeLang.value
    );
    if (success) {
      emit("applied", currentTemplate.value, activeLang.value);
      emit("update:modelValue", false);
    }
  } finally {
    applying.value = false;
  }
};

const handleUseCv = () => {
  if (!currentTemplate.value) return;
  emit("use-cv", currentTemplate.value, activeLang.value);
  emit("update:modelValue", false);
};
</script>
