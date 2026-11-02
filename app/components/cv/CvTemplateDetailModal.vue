<template>
  <AppModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="
      resolvedContent?.titulo || template?.titulo || 'Detalle de la Plantilla'
    "
    icon="library_books"
    max-width="3xl"
    z-index-class="z-[1000]"
  >
    <div v-if="template" class="space-y-6 py-1">
      <!-- Top Meta Info & Badges + Language Switcher -->
      <div
        class="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container/60 dark:bg-slate-800/60 border border-outline-variant/40"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span
              class="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20"
            >
              {{ resolvedContent.rol }}
            </span>

            <!-- Language Switcher Toggle -->
            <div
              class="inline-flex items-center p-0.5 rounded-xl bg-surface-container dark:bg-slate-900 border border-outline-variant/50"
            >
              <button
                type="button"
                @click="activeLang = 'es'"
                class="px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                :class="
                  activeLang === 'es'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                "
              >
                <span>🇲🇽</span>
                <span>Español</span>
              </button>
              <button
                type="button"
                @click="activeLang = 'en'"
                class="px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                :class="
                  activeLang === 'en'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                "
              >
                <span>🇺🇸</span>
                <span>English</span>
              </button>
            </div>

            <span
              v-if="template.alcance === 'SUR_EDOMEX'"
              class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-400"
            >
              📍 Sur del Estado de México
            </span>
          </div>
          <p class="text-xs text-on-surface-variant dark:text-slate-400">
            Compartida por <strong>{{ template.autorNombre }}</strong> •
            {{ template.stats.usesCount }} descargas/usos
          </p>
        </div>

        <div class="text-right">
          <span
            class="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-surface-container-high rounded-md text-on-surface-variant"
          >
            Nivel {{ template.nivel }}
          </span>
        </div>
      </div>

      <!-- Section 1: Biografía Profesional Modelo (Localized) -->
      <div class="space-y-2">
        <h4
          class="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-base text-primary"
            >description</span
          >
          <span>Biografía Profesional / Resumen de Alto Impacto</span>
          <span class="text-[10px] font-semibold text-primary/80 lowercase"
            >({{ activeLang === "es" ? "español" : "english" }})</span
          >
        </h4>
        <div
          class="p-4 rounded-xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60"
        >
          <p
            class="text-xs sm:text-sm text-on-surface dark:text-slate-200 leading-relaxed"
          >
            {{ resolvedContent.biografiaSugerida }}
          </p>
        </div>
      </div>

      <!-- Section 2: Habilidades y Stack Clave para ATS (Localized) -->
      <div class="space-y-2">
        <h4
          class="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-base text-primary"
            >stars</span
          >
          <span>Habilidades y Tecnologías Prioritarias (ATS Keywords)</span>
        </h4>
        <div
          class="flex flex-wrap gap-2 p-3 rounded-xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60"
        >
          <span
            v-for="skill in resolvedContent.habilidades"
            :key="skill"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-xs">check</span>
            <span>{{ skill }}</span>
          </span>
        </div>
      </div>

      <!-- Section 3: Fórmulas de Logros STAR (Localized) -->
      <div class="space-y-2">
        <h4
          class="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-base text-primary"
            >psychology</span
          >
          <span
            >Fórmulas de Logros con el Método STAR (Placeholders
            Cuantificables)</span
          >
        </h4>
        <div class="space-y-3">
          <div
            v-for="(exp, idx) in resolvedContent.experienciaSugerida"
            :key="idx"
            class="p-4 rounded-xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 space-y-2"
          >
            <div class="flex items-center justify-between">
              <span
                class="text-xs font-bold text-on-surface dark:text-slate-100"
                >{{ exp.cargo }}</span
              >
              <span
                class="text-[11px] text-on-surface-variant dark:text-slate-400"
                >{{ exp.periodo }}</span
              >
            </div>
            <p class="text-xs text-primary font-medium">{{ exp.empresa }}</p>

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

      <!-- Section 4: Educación Sugerida -->
      <div
        v-if="
          resolvedContent.educacionSugerida &&
          resolvedContent.educacionSugerida.length > 0
        "
        class="space-y-2"
      >
        <h4
          class="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-base text-primary"
            >school</span
          >
          <span>Educación y Formación Sugerida</span>
        </h4>
        <div class="space-y-2">
          <div
            v-for="(edu, eIdx) in resolvedContent.educacionSugerida"
            :key="eIdx"
            class="p-3 rounded-xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 flex items-center justify-between"
          >
            <div>
              <p class="text-xs font-bold text-on-surface dark:text-slate-100">
                {{ edu.titulo }}
              </p>
              <p
                class="text-[11px] text-on-surface-variant dark:text-slate-400"
              >
                {{ edu.institucion }}
              </p>
            </div>
            <span class="text-[11px] text-on-surface-variant font-medium">{{
              edu.periodo
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div
        class="w-full flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <!-- Preview & Apply Left Actions -->
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            v-if="template"
            @click="$emit('preview-profile', template, activeLang)"
            class="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border border-outline-variant/60 hover:bg-surface-container text-on-surface dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span class="material-symbols-outlined text-base text-primary"
              >preview</span
            >
            <span>👁️ Previsualizar en Perfil</span>
          </button>

          <button
            type="button"
            v-if="template"
            @click="$emit('apply-profile', template, activeLang)"
            class="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border border-primary/40 text-primary hover:bg-primary/10 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span class="material-symbols-outlined text-base"
              >sync_saved_locally</span
            >
            <span>⚡ Aplicar a mi Perfil</span>
          </button>
        </div>

        <div class="w-full sm:w-auto flex items-center gap-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2.5 rounded-xl border border-outline-variant/60 text-xs font-semibold hover:bg-surface-container transition cursor-pointer"
          >
            Cerrar
          </button>

          <button
            type="button"
            v-if="template"
            @click="$emit('use-cv', template, activeLang)"
            class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span class="material-symbols-outlined text-base"
              >picture_as_pdf</span
            >
            <span>Generar CV con esta Plantilla</span>
          </button>
        </div>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import AppModal from "~/components/common/AppModal.vue";
import type { CommunityCvTemplate } from "~/types/cvCommunity";
import { resolveTemplateContent } from "~/types/cvCommunity";

const props = defineProps<{
  modelValue: boolean;
  template?: CommunityCvTemplate | null;
  initialLang?: "es" | "en";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "close"): void;
  (e: "use-cv", template: CommunityCvTemplate, lang: "es" | "en"): void;
  (e: "apply-profile", template: CommunityCvTemplate, lang: "es" | "en"): void;
  (
    e: "preview-profile",
    template: CommunityCvTemplate,
    lang: "es" | "en",
  ): void;
}>();

const activeLang = ref<"es" | "en">(
  props.initialLang || (props.template?.idioma === "en" ? "en" : "es"),
);

watch(
  () => props.template,
  (newVal) => {
    if (newVal) {
      activeLang.value =
        props.initialLang || (newVal.idioma === "en" ? "en" : "es");
    }
  },
);

watch(
  () => props.initialLang,
  (newLang) => {
    if (newLang) {
      activeLang.value = newLang;
    }
  },
);

const resolvedContent = computed(() => {
  if (!props.template) {
    return {
      titulo: "",
      rol: "",
      biografiaSugerida: "",
      habilidades: [],
      experienciaSugerida: [],
      educacionSugerida: [],
    };
  }
  return resolveTemplateContent(props.template, activeLang.value);
});
</script>
