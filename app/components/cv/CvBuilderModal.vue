<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm select-none"
        @keydown.esc="closeModal"
        tabindex="-1"
      >
        <!-- Modal Card Container -->
        <div
          class="bg-surface border border-outline-variant/60 rounded-2xl w-full max-w-7xl h-[94vh] max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          @click.stop
        >
          <!-- Modal Header (Fixed) -->
          <div
            class="px-5 sm:px-6 py-3.5 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-low shrink-0"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"
              >
                <span class="material-symbols-outlined text-2xl"
                  >picture_as_pdf</span
                >
              </div>
              <div>
                <h2
                  class="text-sm sm:text-base font-bold text-on-background flex items-center gap-2"
                >
                  Creador de CV Profesional
                  <span
                    class="px-2 py-0.5 text-[10px] font-extrabold bg-primary/15 text-primary rounded-full uppercase tracking-wider hidden sm:inline-block"
                  >
                    Tamaño Carta (8.5" × 11")
                  </span>
                </h2>
                <p class="text-xs text-on-surface-variant line-clamp-1">
                  Personaliza tu plantilla, visualiza en tiempo real y descarga
                  o sincroniza tu CV.
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="closeModal"
              class="p-2 rounded-xl text-on-surface-variant hover:text-on-background hover:bg-surface-container transition-colors cursor-pointer"
              title="Cerrar modal"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Mobile Tab Switcher (Visible on small screens) -->
          <div
            class="lg:hidden flex border-b border-outline-variant/40 bg-surface-container-low shrink-0 px-4 pt-2 gap-2"
          >
            <button
              type="button"
              @click="activeMobileTab = 'controls'"
              class="flex-1 pb-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              :class="
                activeMobileTab === 'controls'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant'
              "
            >
              <span class="material-symbols-outlined text-base">tune</span>
              Personalizar
            </button>
            <button
              type="button"
              @click="activeMobileTab = 'preview'"
              class="flex-1 pb-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              :class="
                activeMobileTab === 'preview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant'
              "
            >
              <span class="material-symbols-outlined text-base"
                >visibility</span
              >
              Vista Previa (Carta)
            </button>
          </div>

          <!-- Modal Body (Two-pane layout with independent scrolling) -->
          <div class="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
            <!-- Controls Panel (Left - Scrollable) -->
            <div
              class="w-full lg:w-[380px] xl:w-[410px] p-5 border-b lg:border-b-0 lg:border-r border-outline-variant/40 overflow-y-auto overscroll-contain space-y-6 shrink-0 bg-surface h-full"
              :class="{ 'hidden lg:block': activeMobileTab !== 'controls' }"
            >
              <!-- 0. Modo Anónimo Switch Card (RF-123) -->
              <div
                class="p-3.5 rounded-xl border transition-all duration-200"
                :class="
                  options.anonymousMode
                    ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20'
                    : 'bg-surface-container-low border-outline-variant/40'
                "
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div
                      class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                      :class="
                        options.anonymousMode
                          ? 'bg-primary text-white'
                          : 'bg-surface-container text-on-surface-variant'
                      "
                    >
                      <span class="material-symbols-outlined text-lg">
                        {{
                          options.anonymousMode
                            ? "visibility_off"
                            : "visibility"
                        }}
                      </span>
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="text-xs font-bold text-on-background"
                          >Modo Anónimo</span
                        >
                        <span
                          v-if="options.anonymousMode"
                          class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-primary/20 text-primary"
                        >
                          RF-123 Activo
                        </span>
                      </div>
                      <p class="text-[11px] text-on-surface-variant truncate">
                        Postulaciones imparciales sin sesgos
                      </p>
                    </div>
                  </div>
                  <label
                    class="relative inline-flex items-center cursor-pointer shrink-0"
                    title="Alternar Modo Anónimo"
                  >
                    <input
                      type="checkbox"
                      v-model="options.anonymousMode"
                      class="sr-only peer"
                    />
                    <div
                      class="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"
                    ></div>
                  </label>
                </div>

                <!-- Info note when active -->
                <div
                  v-if="options.anonymousMode"
                  class="mt-2.5 pt-2.5 border-t border-primary/20 text-[10px] text-on-surface-variant flex items-start gap-1.5 animate-in fade-in duration-200"
                >
                  <span
                    class="material-symbols-outlined text-sm shrink-0 text-primary"
                    >info</span
                  >
                  <span class="leading-tight">
                    Foto de perfil, nombre, teléfono, email y enlaces externos
                    omitidos. Verifica que tu biografía no mencione tu nombre
                    real.
                  </span>
                </div>
              </div>

              <!-- 1. Templates Selection -->
              <div class="space-y-2.5">
                <label
                  class="text-xs font-bold uppercase tracking-wider text-on-surface-variant block"
                >
                  1. Plantilla (6 Diseños Estándar Carta)
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="tmpl in TEMPLATE_OPTIONS"
                    :key="tmpl.id"
                    type="button"
                    @click="options.templateId = tmpl.id"
                    class="p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer"
                    :class="
                      options.templateId === tmpl.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                        : 'border-outline-variant/60 hover:border-outline hover:bg-surface-container-low'
                    "
                  >
                    <div class="flex items-center justify-between">
                      <span
                        class="material-symbols-outlined text-lg"
                        :class="
                          options.templateId === tmpl.id
                            ? 'text-primary'
                            : 'text-on-surface-variant'
                        "
                      >
                        {{ tmpl.icon }}
                      </span>
                      <span
                        v-if="options.templateId === tmpl.id"
                        class="w-2 h-2 rounded-full bg-primary"
                      ></span>
                    </div>
                    <div>
                      <p
                        class="text-xs font-bold text-on-background leading-tight"
                      >
                        {{ tmpl.name }}
                      </p>
                      <p
                        class="text-[10px] text-on-surface-variant line-clamp-1 mt-0.5"
                      >
                        {{ tmpl.desc }}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <!-- 2. Color Theme -->
              <div class="space-y-2.5">
                <label
                  class="text-xs font-bold uppercase tracking-wider text-on-surface-variant block"
                >
                  2. Paleta de Color de Acento
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="color in CV_COLOR_THEMES"
                    :key="color.id"
                    type="button"
                    @click="selectedColorTheme = color"
                    class="p-2 rounded-xl border flex items-center gap-2 transition cursor-pointer"
                    :class="
                      selectedColorTheme.id === color.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-outline-variant/60 hover:bg-surface-container-low'
                    "
                  >
                    <span
                      class="w-4 h-4 rounded-full shrink-0 shadow-xs border border-white/40"
                      :style="{ backgroundColor: color.primary }"
                    ></span>
                    <span
                      class="text-[11px] font-semibold text-on-background truncate"
                    >
                      {{ color.name }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- 3. Section Toggles -->
              <div class="space-y-2.5">
                <label
                  class="text-xs font-bold uppercase tracking-wider text-on-surface-variant block"
                >
                  3. Secciones Visibles
                </label>
                <div
                  class="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40 space-y-2 text-xs"
                >
                  <label
                    class="flex items-center justify-between"
                    :class="
                      options.anonymousMode
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    "
                  >
                    <span
                      class="text-on-background font-medium flex items-center gap-1.5"
                    >
                      Foto de Perfil
                      <span
                        v-if="options.anonymousMode"
                        class="text-[9px] text-primary font-semibold"
                        >(Oculto en anónimo)</span
                      >
                    </span>
                    <input
                      v-model="options.showPhoto"
                      :disabled="options.anonymousMode"
                      type="checkbox"
                      class="accent-primary rounded w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </label>
                  <label
                    class="flex items-center justify-between cursor-pointer"
                  >
                    <span class="text-on-background font-medium"
                      >Resumen / Sobre Mí</span
                    >
                    <input
                      v-model="options.showBio"
                      type="checkbox"
                      class="accent-primary rounded w-4 h-4 cursor-pointer"
                    />
                  </label>
                  <label
                    class="flex items-center justify-between cursor-pointer"
                  >
                    <span class="text-on-background font-medium"
                      >Experiencia Laboral</span
                    >
                    <input
                      v-model="options.showExperience"
                      type="checkbox"
                      class="accent-primary rounded w-4 h-4 cursor-pointer"
                    />
                  </label>
                  <label
                    class="flex items-center justify-between cursor-pointer"
                  >
                    <span class="text-on-background font-medium"
                      >Educación y Cursos</span
                    >
                    <input
                      v-model="options.showEducation"
                      type="checkbox"
                      class="accent-primary rounded w-4 h-4 cursor-pointer"
                    />
                  </label>
                  <label
                    class="flex items-center justify-between cursor-pointer"
                  >
                    <span class="text-on-background font-medium"
                      >Habilidades Técnicas</span
                    >
                    <input
                      v-model="options.showSkills"
                      type="checkbox"
                      class="accent-primary rounded w-4 h-4 cursor-pointer"
                    />
                  </label>
                  <label
                    class="flex items-center justify-between cursor-pointer"
                  >
                    <span class="text-on-background font-medium">Idiomas</span>
                    <input
                      v-model="options.showLanguages"
                      type="checkbox"
                      class="accent-primary rounded w-4 h-4 cursor-pointer"
                    />
                  </label>
                  <label
                    class="flex items-center justify-between"
                    :class="
                      options.anonymousMode
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    "
                  >
                    <span
                      class="text-on-background font-medium flex items-center gap-1.5"
                    >
                      Enlaces / Redes
                      <span
                        v-if="options.anonymousMode"
                        class="text-[9px] text-primary font-semibold"
                        >(Oculto en anónimo)</span
                      >
                    </span>
                    <input
                      v-model="options.showLinks"
                      :disabled="options.anonymousMode"
                      type="checkbox"
                      class="accent-primary rounded w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </label>
                  <label
                    class="flex items-center justify-between"
                    :class="
                      options.anonymousMode
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    "
                  >
                    <span
                      class="text-on-background font-medium flex items-center gap-1.5"
                    >
                      Mostrar Teléfono
                      <span
                        v-if="options.anonymousMode"
                        class="text-[9px] text-primary font-semibold"
                        >(Oculto en anónimo)</span
                      >
                    </span>
                    <input
                      v-model="options.showPhone"
                      :disabled="options.anonymousMode"
                      type="checkbox"
                      class="accent-primary rounded w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </label>
                  <label
                    class="flex items-center justify-between"
                    :class="
                      options.anonymousMode
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    "
                  >
                    <span
                      class="text-on-background font-medium flex items-center gap-1.5"
                    >
                      Mostrar Correo
                      <span
                        v-if="options.anonymousMode"
                        class="text-[9px] text-primary font-semibold"
                        >(Oculto en anónimo)</span
                      >
                    </span>
                    <input
                      v-model="options.showEmail"
                      :disabled="options.anonymousMode"
                      type="checkbox"
                      class="accent-primary rounded w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </label>
                </div>
              </div>

              <!-- 4. Typography Scale -->
              <div class="space-y-2">
                <label
                  class="text-xs font-bold uppercase tracking-wider text-on-surface-variant block"
                >
                  4. Densidad de Texto
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="size in FONT_SIZES"
                    :key="size.id"
                    type="button"
                    @click="options.fontSize = size.id"
                    class="py-1.5 px-3 rounded-lg border text-xs font-bold text-center transition cursor-pointer"
                    :class="
                      options.fontSize === size.id
                        ? 'border-primary bg-primary text-white'
                        : 'border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-low'
                    "
                  >
                    {{ size.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Live Preview Canvas (Right - Scrollable in both X & Y) -->
            <div
              class="flex-1 bg-slate-200/80 dark:bg-slate-950/80 p-4 sm:p-6 overflow-y-auto overflow-x-auto overscroll-contain flex flex-col items-center justify-start min-h-0 h-full relative"
              :class="{ 'hidden lg:flex': activeMobileTab !== 'preview' }"
            >
              <!-- Zoom & Dimensions Control Bar -->
              <div
                class="mb-4 sticky top-0 z-20 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-xl border border-outline-variant/60 shadow-md flex items-center justify-between gap-4 text-xs shrink-0 max-w-md w-full"
              >
                <div
                  class="flex items-center gap-2 text-on-surface-variant font-medium"
                >
                  <span class="material-symbols-outlined text-base"
                    >aspect_ratio</span
                  >
                  <span class="hidden sm:inline"
                    >Carta: <strong>215.9 × 279.4 mm</strong></span
                  >
                  <span class="sm:hidden"><strong>Carta</strong></span>
                </div>

                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click="
                      zoom = Math.max(0.4, Number((zoom - 0.1).toFixed(2)))
                    "
                    class="p-1 rounded hover:bg-surface-container text-on-surface-variant cursor-pointer"
                    title="Alejar"
                  >
                    <span class="material-symbols-outlined text-sm"
                      >zoom_out</span
                    >
                  </button>
                  <span
                    class="font-bold text-on-background px-1 min-w-[3rem] text-center"
                  >
                    {{ Math.round(zoom * 100) }}%
                  </span>
                  <button
                    type="button"
                    @click="
                      zoom = Math.min(1.3, Number((zoom + 0.1).toFixed(2)))
                    "
                    class="p-1 rounded hover:bg-surface-container text-on-surface-variant cursor-pointer"
                    title="Acercar"
                  >
                    <span class="material-symbols-outlined text-sm"
                      >zoom_in</span
                    >
                  </button>
                  <button
                    type="button"
                    @click="zoom = 0.75"
                    class="ml-1 text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant hover:text-on-background cursor-pointer"
                  >
                    Ajustar
                  </button>
                </div>
              </div>

              <!-- Printable Container with dynamic Zoom -->
              <div
                class="transition-transform origin-top duration-150 pb-12"
                :style="{ transform: `scale(${zoom})` }"
              >
                <div
                  ref="cvPrintRef"
                  id="cv-printable-area"
                  class="rounded-xs shadow-2xl bg-white overflow-hidden text-slate-900"
                >
                  <!-- Dynamic Template Component -->
                  <component
                    :is="activeTemplateComponent"
                    :cv="normalizedCv"
                    :options="options"
                    :primary-color="selectedColorTheme.primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer Action Buttons (Fixed) -->
          <div
            class="px-5 sm:px-6 py-3.5 border-t border-outline-variant/40 bg-surface-container-low flex flex-wrap items-center justify-between gap-3 shrink-0"
          >
            <div
              class="text-xs text-on-surface-variant flex items-center gap-2"
            >
              <span
                v-if="statusMessage"
                class="flex items-center gap-2 text-primary font-medium"
              >
                <span class="material-symbols-outlined animate-spin text-sm"
                  >progress_activity</span
                >
                {{ statusMessage }}
              </span>
              <span v-else class="hidden sm:inline">
                Documento en estándar Carta (8.5" × 11") listo para exportar a
                300 DPI.
              </span>
            </div>

            <div
              class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end"
            >
              <button
                type="button"
                @click="closeModal"
                class="px-3.5 py-2 border border-outline-variant text-on-background font-bold text-xs rounded-xl hover:bg-surface-container transition cursor-pointer"
              >
                Cerrar
              </button>

              <!-- Download Button -->
              <button
                type="button"
                @click="handleDownload"
                :disabled="isGenerating || isSavingToProfile"
                class="px-3.5 py-2 bg-surface border border-primary/40 hover:bg-primary/5 text-primary font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <span class="material-symbols-outlined text-sm">download</span>
                <span>Descargar PDF</span>
              </button>

              <!-- Save to Profile Button -->
              <button
                type="button"
                @click="handleSaveToProfile"
                :disabled="isGenerating || isSavingToProfile"
                class="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <span class="material-symbols-outlined text-sm"
                  >cloud_upload</span
                >
                <span>Guardar en Perfil</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { CandidateProfile } from "~/types/candidate";
import type { CvOptions, CvTemplateId, CvColorTheme } from "~/types/cv";
import { useCvGenerator, CV_COLOR_THEMES } from "~/composables/useCvGenerator";

// Import 6 Letter templates
import TemplateMinimalTech from "./templates/TemplateMinimalTech.vue";
import TemplateExecutive from "./templates/TemplateExecutive.vue";
import TemplateCreative from "./templates/TemplateCreative.vue";
import TemplateHarvardClassic from "./templates/TemplateHarvardClassic.vue";
import TemplateCompactOnePage from "./templates/TemplateCompactOnePage.vue";
import TemplateModernSplit from "./templates/TemplateModernSplit.vue";

const props = defineProps<{
  modelValue: boolean;
  profile: CandidateProfile;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "cv-updated", url: string): void;
}>();

const {
  isGenerating,
  isSavingToProfile,
  statusMessage,
  normalizeProfileToCvData,
  downloadPdf,
  uploadCvToProfile,
} = useCvGenerator();

const { data: session } = useAuth();
const cvPrintRef = ref<HTMLElement | null>(null);
const zoom = ref(0.75);
const activeMobileTab = ref<"controls" | "preview">("controls");

const TEMPLATE_OPTIONS: Array<{
  id: CvTemplateId;
  name: string;
  desc: string;
  icon: string;
}> = [
  {
    id: "minimal-tech",
    name: "Minimal Tech",
    desc: "Sidebar oscuro con habilidades técnicas y timeline de proyectos.",
    icon: "code",
  },
  {
    id: "executive",
    name: "Ejecutivo Clean",
    desc: "Diseño sobrio y formal para puestos de liderazgo y gestión.",
    icon: "corporate_fare",
  },
  {
    id: "creative",
    name: "Creativo / Accent",
    desc: "Encabezado moderno con degradado y badges dinámicos.",
    icon: "palette",
  },
  {
    id: "harvard-classic",
    name: "Clásico Harvard",
    desc: "Tipografía serif tradicional, 100% optimizado para ATS.",
    icon: "school",
  },
  {
    id: "compact-ats",
    name: "Compacto 1 Pág.",
    desc: "Alta densidad para sintetizar todo en una sola hoja Carta.",
    icon: "density_medium",
  },
  {
    id: "modern-split",
    name: "Split Dinámico",
    desc: "Distribución en 2 columnas equilibradas con cards suaves.",
    icon: "splitscreen",
  },
];

const FONT_SIZES = [
  { id: "sm" as const, label: "Compacto" },
  { id: "base" as const, label: "Estándar" },
  { id: "lg" as const, label: "Amplio" },
];

const selectedColorTheme = ref<CvColorTheme>(CV_COLOR_THEMES[0]);

const options = reactive<CvOptions>({
  templateId: "minimal-tech",
  colorTheme: "indigo-jobnet",
  anonymousMode: false,
  showPhoto: true,
  showBio: true,
  showPhone: true,
  showEmail: true,
  showLocation: true,
  showLinks: true,
  showSkills: true,
  showLanguages: true,
  showEducation: true,
  showExperience: true,
  fontSize: "base",
});

const savedPreferences = ref({
  showPhoto: true,
  showPhone: true,
  showEmail: true,
  showLinks: true,
});

// Manage anonymous mode toggling and preference preservation
watch(
  () => options.anonymousMode,
  (isAnon) => {
    if (isAnon) {
      savedPreferences.value = {
        showPhoto: options.showPhoto,
        showPhone: options.showPhone,
        showEmail: options.showEmail,
        showLinks: options.showLinks,
      };
      options.showPhoto = false;
      options.showPhone = false;
      options.showEmail = false;
      options.showLinks = false;
    } else {
      options.showPhoto = savedPreferences.value.showPhoto;
      options.showPhone = savedPreferences.value.showPhone;
      options.showEmail = savedPreferences.value.showEmail;
      options.showLinks = savedPreferences.value.showLinks;
    }
  },
);

const normalizedCv = computed(() => {
  return normalizeProfileToCvData(
    props.profile,
    {
      name: session.value?.user?.name || undefined,
      email: session.value?.user?.email || undefined,
      id: session.value?.user?.id || props.profile?.id || undefined,
    },
    {
      anonymousMode: options.anonymousMode,
      anonymousId: props.profile?.id || session.value?.user?.id || undefined,
    },
  );
});

const activeTemplateComponent = computed(() => {
  switch (options.templateId) {
    case "minimal-tech":
      return TemplateMinimalTech;
    case "executive":
      return TemplateExecutive;
    case "creative":
      return TemplateCreative;
    case "harvard-classic":
      return TemplateHarvardClassic;
    case "compact-ats":
      return TemplateCompactOnePage;
    case "modern-split":
      return TemplateModernSplit;
    default:
      return TemplateMinimalTech;
  }
});

const closeModal = () => {
  emit("update:modelValue", false);
};

// Background Scroll Lock management
watch(
  () => props.modelValue,
  (isOpen) => {
    if (typeof window !== "undefined") {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (typeof window !== "undefined") {
    document.body.style.overflow = "";
  }
});

const handleDownload = async () => {
  if (!cvPrintRef.value) return;
  await downloadPdf(
    cvPrintRef.value,
    normalizedCv.value.name,
    options.anonymousMode,
  );
};

const handleSaveToProfile = async () => {
  if (!cvPrintRef.value) return;
  const userId = session.value?.user?.id || props.profile.id || "user";
  const result = await uploadCvToProfile(
    cvPrintRef.value,
    userId,
    normalizedCv.value.name,
    options.anonymousMode,
  );
  if (result.success && result.url) {
    emit("cv-updated", result.url);
    closeModal();
  }
};
</script>
