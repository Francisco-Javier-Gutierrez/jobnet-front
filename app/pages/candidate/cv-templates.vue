<template>
  <div
    class="min-h-screen pb-20 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none"
  >
    <!-- Top Header & Banner -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xs"
    >
      <div class="space-y-2 max-w-2xl">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20"
        >
          <span class="material-symbols-outlined text-sm">auto_stories</span>
          <span>Comunidad de Talentos JobNet</span>
        </div>
        <h1
          class="text-2xl sm:text-3xl font-extrabold text-on-surface dark:text-slate-100 tracking-tight"
        >
          Hub Comunitario de Plantillas de CV
        </h1>
        <p
          class="text-xs sm:text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed"
        >
          Estructuras profesionales optimizadas para filtros ATS. Encuentra el
          stack tecnológico y fórmulas de logros ideales para empresas en el
          <strong>Sur del Estado de México</strong> y posiciones remotas
          internacionales.
        </p>
      </div>

      <!-- Action: Contribuir -->
      <div class="shrink-0 flex items-center gap-3">
        <button
          type="button"
          @click="showContributeModal = true"
          class="px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm transition shadow-md flex items-center gap-2 cursor-pointer active:scale-95 duration-100"
        >
          <span class="material-symbols-outlined text-lg"
            >volunteer_activism</span
          >
          <span>Contribuir Plantilla</span>
        </button>
      </div>
    </div>

    <!-- Navigation Tabs: Explorar vs Mis Plantillas -->
    <div
      class="flex items-center gap-3 border-b border-outline-variant/60 dark:border-slate-800 pb-2"
    >
      <button
        type="button"
        @click="activeViewTab = 'explore'"
        class="pb-2.5 px-3 text-sm font-bold transition flex items-center gap-2 border-b-2 cursor-pointer"
        :class="
          activeViewTab === 'explore'
            ? 'border-primary text-primary'
            : 'border-transparent text-on-surface-variant hover:text-on-surface'
        "
      >
        <span class="material-symbols-outlined text-lg">explore</span>
        <span>Explorar Plantillas</span>
        <span
          class="px-2 py-0.5 rounded-full text-xs bg-surface-container text-on-surface font-semibold"
        >
          {{ filteredTemplates.length }}
        </span>
      </button>

      <button
        type="button"
        @click="activeViewTab = 'my-templates'"
        class="pb-2.5 px-3 text-sm font-bold transition flex items-center gap-2 border-b-2 cursor-pointer"
        :class="
          activeViewTab === 'my-templates'
            ? 'border-primary text-primary'
            : 'border-transparent text-on-surface-variant hover:text-on-surface'
        "
      >
        <span class="material-symbols-outlined text-lg">person_pin</span>
        <span>Mis Contribuciones</span>
        <span
          class="px-2 py-0.5 rounded-full text-xs bg-surface-container text-on-surface font-semibold"
        >
          {{ userContributedTemplates.length }}
        </span>
      </button>
    </div>

    <!-- TAB 1: EXPLORAR PLANTILLAS -->
    <div v-if="activeViewTab === 'explore'" class="space-y-6">
      <!-- Search & Filters Container -->
      <div
        class="p-5 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl space-y-4"
      >
        <!-- Search Input -->
        <div class="relative">
          <span
            class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl"
            >search</span
          >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por rol, tecnología o palabra clave (ej. React, Spring, Logística, Ventas, Python)..."
            class="w-full pl-11 pr-10 py-3 text-xs sm:text-sm rounded-xl bg-surface-container dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none text-on-surface transition"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <!-- Language Filter Pills with Live Faceted Counts -->
        <div class="space-y-1.5">
          <label
            class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant"
            >Idioma & Región:</label
          >
          <div class="flex items-center gap-2 flex-wrap">
            <button
              v-for="lang in computedLanguageOptions"
              :key="lang.id"
              type="button"
              @click="selectedLanguage = lang.id as any"
              class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border"
              :class="
                selectedLanguage === lang.id
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container dark:bg-slate-800 border-outline-variant/40 text-on-surface hover:bg-surface-container-high'
              "
            >
              <span>{{ lang.icon }}</span>
              <span>{{ lang.label }}</span>
              <span
                class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                :class="
                  selectedLanguage === lang.id
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-container-high dark:bg-slate-700 text-on-surface-variant dark:text-slate-300'
                "
              >
                {{ lang.count }}
              </span>
            </button>
          </div>
        </div>

        <!-- Category & Scope Filters using custom JobNet AppSelect with Live Counts -->
        <div
          class="flex flex-wrap items-end gap-4 pt-3 border-t border-outline-variant/30"
        >
          <!-- Categoría -->
          <div class="w-full sm:w-64">
            <AppSelect
              v-model="selectedCategory"
              label="Categoría"
              label-icon="category"
              :options="computedCategoryOptions"
            />
          </div>

          <!-- Nivel -->
          <div class="w-full sm:w-56">
            <AppSelect
              v-model="selectedLevel"
              label="Nivel de Experiencia"
              label-icon="grade"
              :options="computedLevelOptions"
            />
          </div>

          <!-- Reset filters -->
          <button
            v-if="hasActiveFilters"
            type="button"
            @click="resetFilters"
            class="text-xs text-primary hover:underline font-bold sm:ml-auto flex items-center gap-1 cursor-pointer pb-2"
          >
            <span class="material-symbols-outlined text-sm"
              >filter_alt_off</span
            >
            <span>Limpiar Filtros</span>
          </button>
        </div>
      </div>

      <!-- Templates Grid -->
      <div
        v-if="filteredTemplates.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CvTemplateCard
          v-for="tpl in filteredTemplates"
          :key="tpl.id"
          :template="tpl"
          :is-owner="tpl.autorId === currentUserId"
          @preview="handlePreviewTemplate"
          @use-cv="handleUseTemplateInCv"
          @preview-profile="handlePreviewProfile"
          @apply-profile="handlePromptApplyProfile"
          @delete="handleDeleteTemplate"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="p-12 text-center rounded-3xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 space-y-4"
      >
        <span class="material-symbols-outlined text-5xl text-on-surface-variant"
          >sentiment_dissatisfied</span
        >
        <h3 class="text-base font-bold text-on-surface">
          No se encontraron plantillas con los filtros seleccionados
        </h3>
        <p class="text-xs text-on-surface-variant max-w-md mx-auto">
          Prueba buscando con otros términos o cambia el idioma de búsqueda.
          También puedes ser el primero en contribuir una plantilla para este
          rol.
        </p>
        <button
          type="button"
          @click="resetFilters"
          class="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs cursor-pointer shadow-xs"
        >
          Ver todas las plantillas
        </button>
      </div>
    </div>

    <!-- TAB 2: MIS CONTRIBUCIONES -->
    <div v-else-if="activeViewTab === 'my-templates'" class="space-y-6">
      <div
        v-if="userContributedTemplates.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CvTemplateCard
          v-for="tpl in userContributedTemplates"
          :key="tpl.id"
          :template="tpl"
          :is-owner="true"
          @preview="handlePreviewTemplate"
          @use-cv="handleUseTemplateInCv"
          @preview-profile="handlePreviewProfile"
          @apply-profile="handlePromptApplyProfile"
          @delete="handleDeleteTemplate"
        />
      </div>

      <!-- Empty user templates state -->
      <div
        v-else
        class="p-12 text-center rounded-3xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 space-y-4"
      >
        <div
          class="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-3xl"
            >volunteer_activism</span
          >
        </div>
        <h3 class="text-base font-bold text-on-surface">
          Aún no has compartido plantillas con la comunidad
        </h3>
        <p
          class="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed"
        >
          Ayuda a otros profesionales y estudiantes del Sur del Estado de México
          o de la comunidad remota compartiendo la estructura de tu perfil. Tu
          información sensible será anonimizada automáticamente.
        </p>
        <button
          type="button"
          @click="showContributeModal = true"
          class="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs cursor-pointer shadow-md"
        >
          Contribuir mi primera plantilla
        </button>
      </div>
    </div>

    <!-- MODAL 1: DETALLE DE LA PLANTILLA -->
    <CvTemplateDetailModal
      v-model="showDetailModal"
      :template="selectedTemplate"
      :initial-lang="selectedTemplateLang"
      @close="showDetailModal = false"
      @use-cv="handleUseTemplateInCv"
      @preview-profile="handlePreviewProfile"
      @apply-profile="handlePromptApplyProfile"
    />

    <!-- MODAL 2: CONTRIBUIR PLANTILLA -->
    <CvContributeModal
      v-model="showContributeModal"
      :candidate-profile="candidateProfile"
      @submit="handleCreateTemplateSubmit"
    />

    <!-- MODAL 3: CONFIRMACIÓN PARA APLICAR DIRECTO AL PERFIL -->
    <AppConfirmModal
      v-model="showConfirmApplyProfile"
      title="¿Actualizar datos de tu Perfil?"
      :message="confirmApplyMessage"
      confirm-text="Sí, aplicar a mi perfil"
      cancel-text="Cancelar"
      variant="warning"
      @confirm="executeApplyToProfile"
      @cancel="showConfirmApplyProfile = false"
    />

    <!-- MODAL 4: CREADOR DE CV CON PLANTILLA PRECARGADA -->
    <CvBuilderModal
      v-if="showCvBuilder"
      v-model="showCvBuilder"
      :profile="activeCvProfile"
      @cv-updated="onCvUpdated"
    />

    <!-- MODAL 5: PREVISUALIZADOR EN MI PERFIL -->
    <CvProfilePreviewModal
      v-if="showProfilePreviewModal"
      v-model="showProfilePreviewModal"
      :profile="candidateProfile"
      :initial-template="previewProfileTemplate"
      :initial-lang="previewProfileLang"
      @applied="loadCandidateProfile"
      @use-cv="handleUseTemplateInCv"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCommunityCvTemplates } from "~/composables/useCommunityCvTemplates";
import { useAppFeedback } from "~/composables/useAppFeedback";
import AppSelect from "~/components/AppSelect.vue";
import CvTemplateCard from "~/components/cv/CvTemplateCard.vue";
import CvTemplateDetailModal from "~/components/cv/CvTemplateDetailModal.vue";
import CvContributeModal from "~/components/cv/CvContributeModal.vue";
import AppConfirmModal from "~/components/common/AppConfirmModal.vue";
import CvBuilderModal from "~/components/cv/CvBuilderModal.vue";
import CvProfilePreviewModal from "~/components/cv/CvProfilePreviewModal.vue";
import type { CommunityCvTemplate } from "~/types/cvCommunity";
import { resolveTemplateContent } from "~/types/cvCommunity";

const CATEGORY_OPTIONS = [
  { value: "all", label: "Todas las Categorías", icon: "category" },
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
    label: "Administración & Soporte",
    icon: "account_balance",
  },
];

const LEVEL_OPTIONS = [
  { value: "all", label: "Cualquier Nivel", icon: "grade" },
  { value: "trainee", label: "Trainee / Becario", icon: "school" },
  { value: "junior", label: "Junior / Primer Empleo", icon: "psychology" },
  { value: "mid", label: "Mid-Level", icon: "trending_up" },
  { value: "senior", label: "Senior", icon: "stars" },
  { value: "lead", label: "Lead / Tech Lead", icon: "workspace_premium" },
];

useSeoMeta({
  title: "Comunidad de Plantillas de CV | JobNet",
  description:
    "Explora y comparte plantillas de currículum optimizadas para ATS y vacantes en el Sur del Edoméx y globales.",
});

const { data: session } = useAuth();
const config = useRuntimeConfig();
const { showSuccess, showError } = useAppFeedback();

const {
  communityTemplates,
  filteredTemplates,
  userContributedTemplates,
  searchQuery,
  selectedLanguage,
  selectedCategory,
  selectedLevel,
  fetchTemplates,
  createCommunityTemplate,
  deleteCommunityTemplate,
  recordTemplateUse,
  applyTemplateToCandidateProfile,
} = useCommunityCvTemplates();

// Live faceted counts for templates
const computedCategoryOptions = computed(() => {
  const total = communityTemplates.value.length;
  return CATEGORY_OPTIONS.map((opt) => {
    const count =
      opt.value === "all"
        ? total
        : communityTemplates.value.filter((t) => t.categoria === opt.value)
            .length;
    return {
      ...opt,
      badge: count,
    };
  });
});

const computedLevelOptions = computed(() => {
  const total = communityTemplates.value.length;
  return LEVEL_OPTIONS.map((opt) => {
    const count =
      opt.value === "all"
        ? total
        : communityTemplates.value.filter((t) => t.nivel === opt.value).length;
    return {
      ...opt,
      badge: count,
    };
  });
});

const computedLanguageOptions = computed(() => {
  const total = communityTemplates.value.length;
  const esCount = communityTemplates.value.filter(
    (t) => t.idioma === "es" || t.idioma === "bilingual",
  ).length;
  const enCount = communityTemplates.value.filter(
    (t) => t.idioma === "en" || t.idioma === "bilingual",
  ).length;
  const biCount = communityTemplates.value.filter(
    (t) => t.idioma === "bilingual",
  ).length;

  return [
    { id: "all", label: "Todos", icon: "language", count: total },
    { id: "es", label: "Español", icon: "flag", count: esCount },
    { id: "en", label: "Inglés", icon: "public", count: enCount },
    { id: "bilingual", label: "Bilingüe", icon: "translate", count: biCount },
  ];
});

const activeViewTab = ref<"explore" | "my-templates">("explore");
const currentUserId = computed(() => session.value?.user?.id || "");

// Candidate real profile
const candidateProfile = ref<any>({
  id: currentUserId.value,
  nombre: session.value?.user?.name || "Candidato",
  tituloProfesional: "",
  biografia: "",
  habilidades: [],
  experiencia: [],
  educacion: [],
});

// Modals state
const showDetailModal = ref(false);
const showContributeModal = ref(false);
const showConfirmApplyProfile = ref(false);
const showCvBuilder = ref(false);
const showProfilePreviewModal = ref(false);

const selectedTemplate = ref<CommunityCvTemplate | null>(null);
const selectedTemplateLang = ref<"es" | "en">("es");
const applyTargetLang = ref<"es" | "en">("es");

const previewProfileTemplate = ref<CommunityCvTemplate | null>(null);
const previewProfileLang = ref<"es" | "en">("es");

const activeCvProfile = ref<any>(null);

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value !== "" ||
    selectedLanguage.value !== "all" ||
    selectedCategory.value !== "all" ||
    selectedLevel.value !== "all"
  );
});

const resetFilters = () => {
  searchQuery.value = "";
  selectedLanguage.value = "all";
  selectedCategory.value = "all";
  selectedLevel.value = "all";
};

// Fetch candidate profile for live use
const loadCandidateProfile = async () => {
  if (!currentUserId.value) return;
  try {
    const res = await $fetch<any>(
      `${config.public.apiUrl}/profile/${currentUserId.value}`,
      {
        headers: {
          "x-user-id": currentUserId.value,
          "x-user-role": "CANDIDATO",
        },
      },
    );
    if (res) {
      candidateProfile.value = res;
    }
  } catch (e) {
    console.warn("Could not load candidate profile:", e);
  }
};

onMounted(() => {
  fetchTemplates();
  loadCandidateProfile();
});

// Handlers
const handlePreviewTemplate = (
  template: CommunityCvTemplate,
  lang?: "es" | "en",
) => {
  selectedTemplate.value = template;
  selectedTemplateLang.value = lang || (template.idioma === "en" ? "en" : "es");
  showDetailModal.value = true;
};

const handlePreviewProfile = (
  template: CommunityCvTemplate,
  lang?: "es" | "en",
) => {
  previewProfileTemplate.value = template;
  previewProfileLang.value = lang || (template.idioma === "en" ? "en" : "es");
  showDetailModal.value = false;
  showProfilePreviewModal.value = true;
};

const handleUseTemplateInCv = (
  template: CommunityCvTemplate,
  lang: "es" | "en" = "es",
) => {
  showDetailModal.value = false;
  showProfilePreviewModal.value = false;

  const localized = resolveTemplateContent(template, lang);

  // Build simulated profile data prefilled with the template in the chosen language
  activeCvProfile.value = {
    ...candidateProfile.value,
    tituloProfesional: localized.rol || localized.titulo,
    biografia: localized.biografiaSugerida,
    habilidades: [...localized.habilidades],
    idiomas:
      lang === "en" || template.idioma === "en"
        ? ["Inglés Avanzado (C1)", "Español Nativo"]
        : template.idioma === "bilingual"
          ? ["Español Nativo", "Inglés Fluido (C1)"]
          : ["Español Nativo"],
    experiencia: localized.experienciaSugerida.map((exp) => ({
      cargo: exp.cargo,
      empresa: exp.empresa,
      periodo: exp.periodo,
      logros: [...exp.logros],
    })),
    educacion: localized.educacionSugerida.map((edu) => ({
      titulo: edu.titulo,
      institucion: edu.institucion,
      periodo: edu.periodo,
    })),
  };

  recordTemplateUse(template.id || template.templateId || "");
  showCvBuilder.value = true;
};

const confirmApplyMessage = computed(() => {
  if (!selectedTemplate.value) return "";
  const localized = resolveTemplateContent(
    selectedTemplate.value,
    applyTargetLang.value,
  );
  const langTxt = applyTargetLang.value === "en" ? "en Inglés" : "en Español";
  return `Se actualizará tu título a "${localized.rol || localized.titulo}" (${langTxt}), tu biografía y tus habilidades recomendadas en tu perfil de JobNet. Tus experiencias previas y datos de contacto se mantendrán seguros.`;
});

const handlePromptApplyProfile = (
  template: CommunityCvTemplate,
  lang: "es" | "en" = "es",
) => {
  selectedTemplate.value = template;
  applyTargetLang.value = lang || "es";
  showDetailModal.value = false;
  showConfirmApplyProfile.value = true;
};

const executeApplyToProfile = async () => {
  showConfirmApplyProfile.value = false;
  if (!selectedTemplate.value || !currentUserId.value) return;

  await applyTemplateToCandidateProfile(
    selectedTemplate.value,
    currentUserId.value,
    applyTargetLang.value,
  );
  await loadCandidateProfile();
};

const handleCreateTemplateSubmit = async (
  templateData: Partial<CommunityCvTemplate>,
) => {
  showContributeModal.value = false;
  await createCommunityTemplate(templateData);
};

const handleDeleteTemplate = async (templateId: string) => {
  await deleteCommunityTemplate(templateId);
};

const onCvUpdated = (url: string) => {
  loadCandidateProfile();
};
</script>
