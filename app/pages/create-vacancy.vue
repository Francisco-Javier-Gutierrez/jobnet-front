<template>
  <div
    class="max-w-2xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">
        Crear Nueva Vacante
      </h1>
      <p class="text-on-surface-variant dark:text-slate-300 text-sm">
        Registra una oferta de empleo y define sus coordenadas geográficas y
        habilidades del catálogo.
      </p>
    </div>

    <!-- Alert Messages -->
    <div
      v-if="successMessage"
      class="mb-4 bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded-xl flex items-center gap-2 text-sm font-semibold"
    >
      <span class="material-symbols-outlined text-lg">check_circle</span>
      {{ successMessage }}
    </div>
    <div
      v-if="errorMessage"
      class="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 p-4 rounded-xl flex items-center gap-2 text-sm font-semibold"
    >
      <span class="material-symbols-outlined text-lg">error</span>
      {{ errorMessage }}
    </div>

    <!-- Draft Restore Notification Banner -->
    <div
      v-if="hasDraft"
      class="mb-4 bg-primary/10 border border-primary/20 text-on-surface text-xs p-3 rounded-xl flex items-center justify-between"
    >
      <span class="flex items-center gap-1.5 font-medium">
        <span class="material-symbols-outlined text-base text-primary"
          >info</span
        >
        Se ha restaurado un borrador con cambios sin guardar de esta vacante.
      </span>
      <button
        type="button"
        @click="discardDraft"
        class="text-rose-500 hover:text-rose-600 font-bold transition"
      >
        Descartar
      </button>
    </div>

    <form
      @submit.prevent="handleSubmit"
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-6 shadow-sm"
    >
      <!-- Job Title -->
      <div class="flex flex-col gap-1.5">
        <label
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
          for="title"
          >Título del Puesto (Obligatorio)</label
        >
        <input
          v-model="title"
          id="title"
          type="text"
          required
          placeholder="Ej: Senior Frontend Engineer"
          class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
        />
      </div>

      <!-- Mode & Description -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <AppSelect
            v-model="modality"
            label="Modalidad de Trabajo (Obligatorio)"
            :options="[
              { value: 'Remoto', label: 'Remoto', icon: 'laptop' },
              {
                value: 'Híbrido',
                label: 'Híbrido',
                icon: 'domain_verification',
              },
              {
                value: 'Presencial',
                label: 'Presencial',
                icon: 'location_city',
              },
            ]"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            for="experience-years"
            >Experiencia Requerida (Opcional)</label
          >
          <input
            v-model.number="experienceYears"
            id="experience-years"
            type="number"
            min="0"
            placeholder="Años de experiencia (Ej: 3)"
            class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
          />
        </div>
      </div>

      <!-- Plazas Disponibles & Tope Máximo de Postulaciones (Opcional) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            for="vacantes-disponibles"
            >Plazas Disponibles a Contratar (Obligatorio)</label
          >
          <input
            v-model.number="vacantesDisponibles"
            id="vacantes-disponibles"
            type="number"
            min="1"
            required
            placeholder="Número de puestos (Ej: 1, 3, 5)"
            class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1"
            for="max-postulantes"
          >
            Límite Máximo de Postulaciones
            <span class="text-[10px] text-outline font-normal">(Opcional)</span>
          </label>
          <input
            v-model.number="maxPostulantes"
            id="max-postulantes"
            type="number"
            min="1"
            placeholder="Sin límite (o Ej: 50 postulantes)"
            class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
          />
        </div>
      </div>

      <!-- Description -->
      <div class="flex flex-col gap-1.5">
        <label
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
          for="description"
          >Descripción Detallada de Actividades (Obligatorio)</label
        >
        <textarea
          v-model="description"
          id="description"
          rows="4"
          required
          placeholder="Describe detalladamente las responsabilidades, tareas diarias y requisitos técnicos del puesto..."
          class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition resize-none"
        ></textarea>
      </div>

      <!-- Documento de Especificación (PDF) -->
      <div class="flex flex-col gap-1.5">
        <label
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
          >Descriptor de Puesto o Especificaciones (PDF - Opcional)</label
        >
        <div class="flex gap-2 items-center">
          <button
            type="button"
            @click="triggerVacancyFileSelect"
            class="flex items-center gap-2 px-4 py-2.5 bg-surface border border-outline-variant/60 hover:border-primary text-primary text-xs font-bold rounded-xl transition active:scale-[0.98]"
          >
            <span class="material-symbols-outlined text-sm">upload_file</span>
            Subir Documento PDF
          </button>
          <input
            type="file"
            accept=".pdf"
            ref="vacancyFileInput"
            @change="handleVacancyFileSelect"
            class="hidden"
          />
          <div
            v-if="selectedVacancyFile"
            class="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-xl text-xs font-bold max-w-md flex-wrap"
          >
            <span
              class="material-symbols-outlined text-sm text-rose-600 flex-shrink-0"
              >picture_as_pdf</span
            >
            <span class="truncate max-w-[160px] sm:max-w-[200px]">{{
              selectedVacancyFile.name
            }}</span>
            <button
              type="button"
              @click="openVacancyPdfPreview"
              class="px-2.5 py-1 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-primary-container transition cursor-pointer flex items-center gap-1 shadow-xs"
              title="Vista previa del documento PDF"
            >
              <span class="material-symbols-outlined text-xs">visibility</span>
              <span>Ver Previa</span>
            </button>
            <button
              type="button"
              @click="clearVacancyFile"
              class="text-on-surface-variant dark:text-slate-300 hover:text-rose-600 flex items-center transition cursor-pointer p-0.5"
              title="Eliminar archivo"
            >
              <span class="material-symbols-outlined text-xs">close</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Ubicación Geográfica (AppLocationMap Centrado) -->
      <AppLocationMap
        v-model:lat="lat"
        v-model:lng="lng"
        label="Ubicación Geográfica de la Vacante"
        height="280px"
      />

      <!-- Rango Salarial (Opcional) -->
      <div
        class="bg-surface-container-low/30 border border-outline-variant/60 rounded-xl p-4 flex flex-col gap-4"
      >
        <h3
          class="text-xs font-bold text-on-background uppercase tracking-wider"
        >
          Rango Salarial Mensual (Opcional)
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label
              class="text-[10px] font-bold text-on-surface-variant dark:text-slate-300"
              for="salary-min"
              >Monto Mínimo (MXN)</label
            >
            <input
              v-model.number="salaryMin"
              id="salary-min"
              type="number"
              min="0"
              placeholder="Ej: 30000"
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2 text-xs text-on-background outline-none transition"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label
              class="text-[10px] font-bold text-on-surface-variant dark:text-slate-300"
              for="salary-max"
              >Monto Máximo (MXN)</label
            >
            <input
              v-model.number="salaryMax"
              id="salary-max"
              type="number"
              min="0"
              placeholder="Ej: 50000"
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2 text-xs text-on-background outline-none transition"
            />
          </div>
        </div>
      </div>

      <!-- Aptitudes y Habilidades Opcionales -->
      <div class="flex flex-col gap-1.5">
        <label
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
          for="aptitudes"
          >Aptitudes y Competencias Blandas (Opcional)</label
        >
        <input
          v-model="aptitudes"
          id="aptitudes"
          type="text"
          placeholder="Ej: Liderazgo, Comunicación asertiva, Trabajo en equipo"
          class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
        />
      </div>

      <!-- Habilidades Requeridas (Catálogo Maestro Dinámico) -->
      <div class="flex flex-col gap-2">
        <label
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
          >Selección de Habilidades Requeridas (Obligatorio)</label
        >

        <!-- Selected Skill Tags -->
        <div class="flex flex-wrap gap-2 mb-2">
          <span
            v-for="skill in skills"
            :key="skill"
            class="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 font-bold"
          >
            {{ skill }}
            <button
              type="button"
              @click="removeSkill(skill)"
              class="hover:text-rose-600 transition flex items-center"
            >
              <span class="material-symbols-outlined text-xs">close</span>
            </button>
          </span>
          <span
            v-if="skills.length === 0"
            class="text-xs text-on-surface-variant dark:text-slate-300 italic"
          >
            Ninguna habilidad seleccionada aún. Selecciona del catálogo abajo.
          </span>
        </div>

        <!-- Catalog autocomplete and suggestion box -->
        <div
          class="space-y-3 bg-surface-container-low/40 p-4 border border-outline-variant/50 rounded-xl"
        >
          <div class="flex gap-2">
            <div class="relative flex-grow">
              <span
                class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant dark:text-slate-300 text-sm"
                >search</span
              >
              <input
                v-model="skillSearchQuery"
                type="text"
                placeholder="Buscar habilidades en el catálogo..."
                class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl pl-9 pr-4 py-2 text-xs text-on-background outline-none transition"
              />
            </div>

            <!-- Quick Add Option for non-existing skills -->
            <button
              type="button"
              @click="handleQuickAddSkill"
              :disabled="!skillSearchQuery.trim()"
              class="bg-surface border border-outline-variant hover:border-primary hover:bg-primary/5 text-primary text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
            >
              Sugerir y Agregar
            </button>
          </div>

          <div
            v-if="
              skillSearchQuery.trim() &&
              !filteredCatalogSkills.some(
                (s) =>
                  s.name.toLowerCase() ===
                  skillSearchQuery.toLowerCase().trim(),
              )
            "
            class="text-[10px] text-amber-600 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex items-start gap-1.5 leading-relaxed"
          >
            <span class="material-symbols-outlined text-xs mt-0.5"
              >warning</span
            >
            <span>
              Esta habilidad no se encuentra en el catálogo y será enviada al
              equipo de moderación para su aprobación. Se asociará temporalmente
              a tu perfil; por favor, valida la ortografía antes de crearla.
            </span>
          </div>

          <!-- Suggested Master Catalog Skills -->
          <div class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            <button
              v-for="masterSkill in filteredCatalogSkills"
              :key="masterSkill.id"
              type="button"
              @click="addSkill(masterSkill.name)"
              class="bg-surface hover:bg-surface-container-high border border-outline-variant/50 hover:border-primary text-on-surface hover:text-primary transition px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[10px]">add</span>
              {{ masterSkill.name }}
            </button>
            <span
              v-if="filteredCatalogSkills.length === 0"
              class="text-[11px] text-on-surface-variant dark:text-slate-300 italic py-1"
            >
              No se encontraron habilidades adicionales. Escribe para crear una
              nueva.
            </span>
          </div>
        </div>
      </div>

      <!-- Sectores de la Vacante (Catálogo Maestro Dinámico) -->
      <div class="flex flex-col gap-2">
        <label
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
          >Sectores de la Industria (Obligatorio)</label
        >

        <!-- Selected Sector Tags -->
        <div class="flex flex-wrap gap-2 mb-2">
          <span
            v-for="sector in sectors"
            :key="sector"
            class="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 font-bold"
          >
            {{ sector }}
            <button
              type="button"
              @click="removeSector(sector)"
              class="hover:text-rose-600 transition flex items-center"
            >
              <span class="material-symbols-outlined text-xs">close</span>
            </button>
          </span>
          <span
            v-if="sectors.length === 0"
            class="text-xs text-on-surface-variant dark:text-slate-300 italic"
          >
            Ningún sector seleccionado aún. Selecciona del catálogo abajo.
          </span>
        </div>

        <!-- Catalog autocomplete and suggestion box -->
        <div
          class="space-y-3 bg-surface-container-low/40 p-4 border border-outline-variant/50 rounded-xl"
        >
          <div class="flex gap-2">
            <div class="relative flex-grow">
              <span
                class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant dark:text-slate-300 text-sm"
                >search</span
              >
              <input
                v-model="sectorSearchQuery"
                type="text"
                placeholder="Buscar sectores en el catálogo..."
                class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl pl-9 pr-4 py-2 text-xs text-on-background outline-none transition"
              />
            </div>

            <!-- Quick Add Option for non-existing sectors -->
            <button
              type="button"
              @click="handleQuickAddSector"
              :disabled="!sectorSearchQuery.trim()"
              class="bg-surface border border-outline-variant hover:border-primary hover:bg-primary/5 text-primary text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
            >
              Sugerir y Agregar
            </button>
          </div>

          <div
            v-if="
              sectorSearchQuery.trim() &&
              !filteredCatalogSectors.some(
                (s) =>
                  s.name.toLowerCase() ===
                  sectorSearchQuery.toLowerCase().trim(),
              )
            "
            class="text-[10px] text-amber-600 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex items-start gap-1.5 leading-relaxed"
          >
            <span class="material-symbols-outlined text-xs mt-0.5"
              >warning</span
            >
            <span>
              Este sector no se encuentra en el catálogo y será enviado al
              equipo de moderación para su aprobación. Se asociará temporalmente
              a tu perfil; por favor, valida la ortografía antes de crearlo.
            </span>
          </div>

          <!-- Suggested Master Catalog Sectors -->
          <div class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            <button
              v-for="masterSector in filteredCatalogSectors"
              :key="masterSector.id"
              type="button"
              @click="addSector(masterSector.name)"
              class="bg-surface hover:bg-surface-container-high border border-outline-variant/50 hover:border-primary text-on-surface hover:text-primary transition px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[10px]">add</span>
              {{ masterSector.name }}
            </button>
            <span
              v-if="filteredCatalogSectors.length === 0"
              class="text-[11px] text-on-surface-variant dark:text-slate-300 italic py-1"
            >
              No se encontraron sectores adicionales. Escribe para crear uno
              nuevo.
            </span>
          </div>
        </div>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="submitting || skills.length === 0"
        class="bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-semibold text-sm h-12 rounded-xl transition shadow-md shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 duration-100 mt-2"
      >
        <span class="material-symbols-outlined text-lg">{{
          submitting ? "sync" : "post_add"
        }}</span>
        {{ submitting ? "Publicando..." : "Publicar Vacante" }}
      </button>
    </form>

    <!-- Standardized Vacancy Specification PDF Preview Modal -->
    <AppPdfPreviewModal
      v-model="showVacancyPdfModal"
      :url="vacancyPdfPreviewUrl"
      :file-name="selectedVacancyFile?.name || 'Especificacion_Vacante.pdf'"
      title="Especificación de Puesto (PDF)"
    />
  </div>
</template>

<script setup lang="ts">
import AppLocationMap from "~/components/common/AppLocationMap.vue";
import AppPdfPreviewModal from "~/components/common/AppPdfPreviewModal.vue";
import { useCatalogStore } from "~/stores/catalog";
import { useUploadStore } from "~/stores/upload";
import { useAppFeedback } from "~/composables/useAppFeedback";

useSeoMeta({
  title: "Publicar Oferta de Empleo - JobNet",
  description:
    "Crea una nueva vacante de reclutamiento utilizando geolocalización y el catálogo maestro",
});

const router = useRouter();
const config = useRuntimeConfig();
const { data: session, status } = useAuth();
const catalogStore = useCatalogStore();

// Form fields
const title = ref("");
const modality = ref("Remoto");
const description = ref("");
const skills = ref<string[]>([]);
const sectors = ref<string[]>([]);
const aptitudes = ref("");
const experienceYears = ref<number | null>(null);
const vacantesDisponibles = ref<number>(1);
const maxPostulantes = ref<number | null>(null);
const salaryMin = ref<number | null>(null);
const salaryMax = ref<number | null>(null);

const showVacancyPdfModal = ref(false);
const vacancyPdfPreviewUrl = ref("");

const selectedVacancyFile = ref<File | null>(null);
const vacancyFileInput = ref<HTMLInputElement | null>(null);

const openVacancyPdfPreview = () => {
  if (!selectedVacancyFile.value) return;
  vacancyPdfPreviewUrl.value = URL.createObjectURL(selectedVacancyFile.value);
  showVacancyPdfModal.value = true;
};

const { showSuccess, showError, showWarning } = useAppFeedback();

const triggerVacancyFileSelect = () => {
  vacancyFileInput.value?.click();
};

const handleVacancyFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const isPdf =
      file.type === "application/pdf" ||
      file.type === "application/x-pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      target.value = "";
      showWarning(
        "Formato No Permitido",
        "Por favor selecciona un archivo en formato PDF.",
        4000,
      );
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      target.value = "";
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      const msg = `El archivo PDF "${file.name}" (${sizeMb} MB) supera el límite máximo permitido de 10MB.`;
      showError("Límite de Tamaño Excedido", msg, null);
      return;
    }
    selectedVacancyFile.value = file;
    showSuccess(
      "Documento Adjuntado",
      "El archivo PDF de especificaciones fue seleccionado correctamente.",
      2500,
    );
  }
};

const clearVacancyFile = () => {
  selectedVacancyFile.value = null;
  if (vacancyFileInput.value) vacancyFileInput.value.value = "";
};

// Location State (Default: Toluca, Sur del Estado de México)
const lat = ref(19.2826);
const lng = ref(-99.6557);

// Draft State
const hasDraft = ref(false);
let isRestoring = false;

const saveDraft = () => {
  if (process.client && !isRestoring) {
    // Only save draft if there is actual input to prevent empty drafts
    if (
      title.value ||
      description.value ||
      skills.value.length > 0 ||
      sectors.value.length > 0 ||
      aptitudes.value ||
      experienceYears.value ||
      salaryMin.value ||
      salaryMax.value
    ) {
      localStorage.setItem(
        "jobnet_draft_vacancy",
        JSON.stringify({
          title: title.value,
          modality: modality.value,
          description: description.value,
          skills: skills.value,
          sectors: sectors.value,
          aptitudes: aptitudes.value,
          experienceYears: experienceYears.value,
          salaryMin: salaryMin.value,
          salaryMax: salaryMax.value,
          lat: lat.value,
          lng: lng.value,
        }),
      );
    }
  }
};

const loadDraft = () => {
  if (process.client) {
    const saved = localStorage.getItem("jobnet_draft_vacancy");
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (
          draft.title ||
          draft.description ||
          draft.skills?.length > 0 ||
          draft.sectors?.length > 0 ||
          draft.aptitudes
        ) {
          isRestoring = true;
          title.value = draft.title || "";
          modality.value = draft.modality || "Remoto";
          description.value = draft.description || "";
          skills.value = draft.skills || [];
          sectors.value = draft.sectors || [];
          aptitudes.value = draft.aptitudes || "";
          experienceYears.value = draft.experienceYears;
          salaryMin.value = draft.salaryMin;
          salaryMax.value = draft.salaryMax;
          lat.value = draft.lat || 19.432608;
          lng.value = draft.lng || -99.133209;
          hasDraft.value = true;
          isRestoring = false;
        }
      } catch (e) {
        console.error("Error loading vacancy draft:", e);
      }
    }
  }
};

const discardDraft = () => {
  if (process.client) {
    localStorage.removeItem("jobnet_draft_vacancy");
    hasDraft.value = false;
    isRestoring = true;
    title.value = "";
    modality.value = "Remoto";
    description.value = "";
    skills.value = [];
    sectors.value = [];
    aptitudes.value = "";
    experienceYears.value = null;
    salaryMin.value = null;
    salaryMax.value = null;
    lat.value = 19.2826;
    lng.value = -99.6557;
    isRestoring = false;
  }
};

// Auto-save watch
watch(
  [
    title,
    modality,
    description,
    skills,
    sectors,
    aptitudes,
    experienceYears,
    salaryMin,
    salaryMax,
    lat,
    lng,
  ],
  () => {
    saveDraft();
  },
  { deep: true },
);

// Habilidades Catalog search
const skillSearchQuery = ref("");
const sectorSearchQuery = ref("");

// Notifications/Actions
const submitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const companyName = ref("Empresa Corporativa");

// Filter catalog skills by search query and exclude already added ones
const filteredCatalogSkills = computed(() => {
  const query = skillSearchQuery.value.toLowerCase().trim();
  return catalogStore.skills.filter((skill) => {
    const matchesQuery = skill.name.toLowerCase().includes(query);
    const notSelectedYet = !skills.value.some(
      (s) => s.toLowerCase() === skill.name.toLowerCase(),
    );
    return matchesQuery && notSelectedYet;
  });
});

// Filter catalog sectors by search query and exclude already added ones
const filteredCatalogSectors = computed(() => {
  const query = sectorSearchQuery.value.toLowerCase().trim();
  return catalogStore.sectors.filter((sector) => {
    const matchesQuery = sector.name.toLowerCase().includes(query);
    const notSelectedYet = !sectors.value.some(
      (s) => s.toLowerCase() === sector.name.toLowerCase(),
    );
    return matchesQuery && notSelectedYet;
  });
});

const fetchCompanyName = async () => {
  if (status.value !== "authenticated" || !session.value?.user?.id) {
    router.push("/login");
    return;
  }

  try {
    const profile = await $fetch<any>(
      `${config.public.apiUrl}/profile/${session.value.user.id}`,
    );
    if (profile) {
      companyName.value = profile.nombre || "Empresa Corporativa";
    }
  } catch (e) {
    console.error("Error fetching company name for vacancy posting:", e);
  }
};

onMounted(async () => {
  await fetchCompanyName();
  await catalogStore.fetchCatalog();
  loadDraft();
});

// Selection actions
const addSkill = (skillName: string) => {
  if (!skills.value.some((s) => s.toLowerCase() === skillName.toLowerCase())) {
    skills.value.push(skillName);
  }
  // Clear search query
  skillSearchQuery.value = "";
};

const removeSkill = (skillName: string) => {
  skills.value = skills.value.filter((s) => s !== skillName);
};

const addSector = (sectorName: string) => {
  if (
    !sectors.value.some((s) => s.toLowerCase() === sectorName.toLowerCase())
  ) {
    sectors.value.push(sectorName);
  }
  sectorSearchQuery.value = "";
};

const removeSector = (sectorName: string) => {
  sectors.value = sectors.value.filter((s) => s !== sectorName);
};

const handleQuickAddSector = async () => {
  const queryName = sectorSearchQuery.value.trim();
  if (!queryName) return;

  // 1. Suggest sector to the global master catalog (moderator queue)
  await catalogStore.suggestSector(queryName);

  // 2. Add locally to active vacancy sectors list
  addSector(queryName);
  sectorSearchQuery.value = "";
};

// Expand Catalog and Add immediately
const handleQuickAddSkill = async () => {
  const queryName = skillSearchQuery.value.trim();
  if (!queryName) return;

  // 1. Suggest skill to the global master catalog (moderator queue)
  await catalogStore.suggestSkill(queryName);

  // 2. Add locally to active vacancy skills list
  addSkill(queryName);
  skillSearchQuery.value = "";
};

const handleSubmit = async () => {
  if (!session.value?.user?.id) return;
  if (skills.value.length === 0) {
    errorMessage.value = "Debes seleccionar al menos una habilidad requerida.";
    return;
  }
  if (sectors.value.length === 0) {
    errorMessage.value = "Debes seleccionar al menos un sector de industria.";
    return;
  }

  submitting.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    let specPdfUrl = "";
    if (selectedVacancyFile.value) {
      const uploadStore = useUploadStore();
      const companyId = session.value?.user?.id || "anonymous";
      const uploadResult = await uploadStore.uploadFile(
        selectedVacancyFile.value,
        "jobs",
        companyId,
      );
      if (!uploadResult.success) {
        errorMessage.value =
          "Error al subir el documento PDF de especificaciones a S3.";
        submitting.value = false;
        return;
      }
      specPdfUrl = uploadResult.url;
    }

    const payload = {
      title: title.value,
      company: companyName.value,
      empresaUuid: session.value.user.id,
      lat: lat.value,
      lng: lng.value,
      modalidad: modality.value,
      salarioMinimo: salaryMin.value || 0,
      salarioMaximo: salaryMax.value || 0,
      salario: salaryMin.value || 0, // Fallback standard field
      descripcion: description.value,
      habilidadesRequeridas: skills.value,
      sectores: sectors.value,
      aptitudes: aptitudes.value,
      experienciaAnos: experienceYears.value || 0,
      vacantesDisponibles: vacantesDisponibles.value || 1,
      maxPostulantes: maxPostulantes.value || null,
      pdfUrl: specPdfUrl,
    };

    const response = await $fetch<any>(`${config.public.apiUrl}/jobs`, {
      method: "POST",
      body: payload,
    });

    if (response) {
      successMessage.value =
        "¡Vacante de empleo publicada y registrada con éxito!";

      // Clear draft on successful submit
      if (process.client) {
        localStorage.removeItem("jobnet_draft_vacancy");
      }

      title.value = "";
      description.value = "";
      skills.value = [];
      sectors.value = [];
      aptitudes.value = "";
      experienceYears.value = null;
      salaryMin.value = null;
      salaryMax.value = null;
      selectedVacancyFile.value = null;

      setTimeout(() => {
        router.push("/my-vacancies");
      }, 1500);
    }
  } catch (error: any) {
    console.error("Error creating vacancy:", error);
    errorMessage.value = "Ocurrió un error al intentar publicar la vacante.";
  } finally {
    submitting.value = false;
  }
};
</script>
