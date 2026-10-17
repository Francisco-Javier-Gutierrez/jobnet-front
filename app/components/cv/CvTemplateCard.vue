<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
  >
    <!-- Top Metadata: Badges & Language Switcher -->
    <div>
      <div class="flex items-center justify-between gap-2 mb-3">
        <!-- Interactive Language Switcher Toggle -->
        <div class="inline-flex items-center p-0.5 rounded-xl bg-surface-container dark:bg-slate-800 border border-outline-variant/40">
          <button
            type="button"
            @click.stop="activeLang = 'es'"
            class="px-2 py-0.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            :class="activeLang === 'es' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'"
            title="Ver contenido en Español"
          >
            <span>🇲🇽</span>
            <span>ES</span>
          </button>
          <button
            type="button"
            @click.stop="activeLang = 'en'"
            class="px-2 py-0.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            :class="activeLang === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'"
            title="Switch content to English"
          >
            <span>🇺🇸</span>
            <span>EN</span>
          </button>
        </div>

        <!-- Scope & Level Badges -->
        <div class="flex items-center gap-1.5 flex-wrap justify-end">
          <span
            v-if="template.alcance === 'SUR_EDOMEX'"
            class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
            title="Optimizado para empresas y corredores industriales del Sur del Estado de México"
          >
            📍 Sur EdoMéx
          </span>
          <span
            v-else-if="template.alcance === 'GLOBAL_REMOTO'"
            class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
          >
            🌍 Remoto / Global
          </span>

          <span
            class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
            :class="levelBadgeClass"
          >
            {{ template.nivel }}
          </span>
        </div>
      </div>

      <!-- Title & Role (Dynamically Localized in Spanish or English) -->
      <h3
        class="text-base font-bold text-on-surface dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-1"
      >
        {{ resolvedContent.titulo }}
      </h3>
      <p class="text-xs text-on-surface-variant dark:text-slate-400 mb-3 flex items-center gap-1">
        <span class="material-symbols-outlined text-sm">badge</span>
        <span>{{ resolvedContent.rol }}</span>
      </p>

      <!-- Suggested Bio Snippet (Dynamically Localized) -->
      <p
        class="text-xs text-on-surface-variant dark:text-slate-300 line-clamp-2 leading-relaxed mb-4"
      >
        {{ resolvedContent.biografiaSugerida }}
      </p>

      <!-- Skills Chips (Dynamically Localized) -->
      <div class="flex flex-wrap gap-1.5 mb-4 max-h-20 overflow-hidden">
        <span
          v-for="skill in resolvedContent.habilidades.slice(0, 5)"
          :key="skill"
          class="px-2 py-0.5 text-[11px] font-medium bg-surface-container dark:bg-slate-800 text-on-surface dark:text-slate-200 rounded-md border border-outline-variant/30"
        >
          {{ skill }}
        </span>
        <span
          v-if="resolvedContent.habilidades.length > 5"
          class="px-1.5 py-0.5 text-[10px] font-semibold text-primary bg-primary/10 rounded-md"
        >
          +{{ resolvedContent.habilidades.length - 5 }}
        </span>
      </div>
    </div>

    <!-- Bottom Actions & Author -->
    <div class="pt-3 border-t border-outline-variant/40 dark:border-slate-800 space-y-3">
      <!-- Author info & stats -->
      <div class="flex items-center justify-between text-xs text-on-surface-variant dark:text-slate-400">
        <div class="flex items-center gap-1.5 truncate">
          <span
            v-if="template.isOfficial"
            class="material-symbols-outlined text-amber-500 text-sm shrink-0"
            title="Plantilla Oficial de JobNet"
            >verified</span
          >
          <span
            v-else
            class="material-symbols-outlined text-slate-400 text-sm shrink-0"
            >person</span
          >
          <span class="font-medium truncate">{{ template.autorNombre }}</span>
        </div>

        <div class="flex items-center gap-1 text-[11px] font-bold shrink-0">
          <span class="material-symbols-outlined text-sm text-primary">download</span>
          <span>{{ template.stats.usesCount }} usos</span>
        </div>
      </div>

      <!-- Action Buttons Row: Ver Detalle & Usar Plantilla + Opciones avanzadas -->
      <div class="flex items-center gap-2 pt-1">
        <button
          type="button"
          @click="$emit('preview', template, activeLang)"
          class="flex-1 py-2 px-3 rounded-xl border border-outline-variant/60 hover:bg-surface-container text-on-surface dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span class="material-symbols-outlined text-base">visibility</span>
          <span>Ver Detalle</span>
        </button>

        <button
          type="button"
          @click="$emit('use-cv', template, activeLang)"
          class="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span class="material-symbols-outlined text-base">auto_fix_high</span>
          <span>Usar Plantilla</span>
        </button>

        <!-- More Options Dropdown Menu -->
        <div ref="menuRef" class="relative shrink-0">
          <button
            type="button"
            @click.stop="showMoreMenu = !showMoreMenu"
            class="p-2 rounded-xl border border-outline-variant/60 hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition cursor-pointer"
            title="Más opciones de plantilla"
            aria-label="Más opciones"
          >
            <span class="material-symbols-outlined text-base leading-none">more_vert</span>
          </button>

          <!-- Dropdown Popover -->
          <div
            v-if="showMoreMenu"
            class="absolute right-0 bottom-full mb-2 w-56 p-1.5 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-xl shadow-xl z-20 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-150"
            @click.stop
          >
            <button
              type="button"
              @click="showMoreMenu = false; $emit('preview-profile', template, activeLang)"
              class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container flex items-center gap-2 text-on-surface dark:text-slate-200 font-medium transition cursor-pointer"
            >
              <span class="material-symbols-outlined text-sm text-primary">preview</span>
              <span>Previsualizar en Perfil</span>
            </button>

            <button
              type="button"
              @click="showMoreMenu = false; $emit('apply-profile', template, activeLang)"
              class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-primary/10 flex items-center gap-2 text-primary font-medium transition cursor-pointer"
            >
              <span class="material-symbols-outlined text-sm">sync_saved_locally</span>
              <span>Aplicar datos a mi Perfil</span>
            </button>

            <div v-if="isOwner" class="border-t border-outline-variant/40 pt-1 mt-1">
              <button
                type="button"
                @click="showMoreMenu = false; $emit('delete', template.id)"
                class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 flex items-center gap-2 text-error font-medium transition cursor-pointer"
              >
                <span class="material-symbols-outlined text-sm">delete</span>
                <span>Retirar mi plantilla</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { CommunityCvTemplate } from "~/types/cvCommunity";
import { resolveTemplateContent } from "~/types/cvCommunity";

const props = defineProps<{
  template: CommunityCvTemplate;
  isOwner?: boolean;
}>();

const emit = defineEmits<{
  (e: "preview", template: CommunityCvTemplate, lang: "es" | "en"): void;
  (e: "use-cv", template: CommunityCvTemplate, lang: "es" | "en"): void;
  (e: "preview-profile", template: CommunityCvTemplate, lang: "es" | "en"): void;
  (e: "apply-profile", template: CommunityCvTemplate, lang: "es" | "en"): void;
  (e: "delete", templateId: string): void;
}>();

const activeLang = ref<"es" | "en">(props.template.idioma === "en" ? "en" : "es");
const showMoreMenu = ref(false);
const menuRef = ref<HTMLElement | null>(null);

const handleClickOutside = (e: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    showMoreMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const resolvedContent = computed(() => {
  return resolveTemplateContent(props.template, activeLang.value);
});

const levelBadgeClass = computed(() => {
  switch (props.template.nivel) {
    case "trainee":
    case "junior":
      return "bg-sky-500/10 text-sky-700 dark:text-sky-300";
    case "mid":
      return "bg-teal-500/10 text-teal-700 dark:text-teal-300";
    case "senior":
    case "lead":
      return "bg-violet-500/10 text-violet-700 dark:text-violet-300";
    default:
      return "bg-slate-100 text-slate-700";
  }
});
</script>
