<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2
        class="text-base font-bold text-on-background flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-rose-600 dark:text-rose-400"
          >picture_as_pdf</span
        >
        Repositorio de Currículum Vitae (CV PDF)
      </h2>

      <!-- Create with Templates Button -->
      <button
        type="button"
        @click="showCvBuilderModal = true"
        class="px-3.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
      >
        <span class="material-symbols-outlined text-sm">auto_fix_high</span>
        <span>Generar CV con Plantillas (Carta)</span>
      </button>
    </div>

    <p
      class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
    >
      Carga tu CV oficial en formato PDF (máximo 5 MB) o créalo mediante nuestras
      plantillas profesionales. Tu documento se almacenará de forma segura en la
      nube y podrás previsualizarlo o reemplazarlo directamente en cualquier momento.
    </p>

    <!-- Estado Actual del CV Almacenado -->
    <div v-if="cvUrl" class="space-y-3">
      <div
        class="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-wrap items-center justify-between gap-3"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0"
          >
            <span class="material-symbols-outlined text-xl">description</span>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h3
                class="text-xs font-bold text-on-background truncate max-w-xs sm:max-w-md"
              >
                {{ cvName || "Curriculum_Vitae_Principal.pdf" }}
              </h3>
              <span
                class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
              >
                Activo en la nube
              </span>
            </div>
            <p class="text-[11px] text-on-surface-variant dark:text-slate-400">
              Almacenamiento seguro en S3 · Listo para postulaciones
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Botón Visor Embebido Toggle -->
          <button
            type="button"
            @click="toggleEmbeddedViewer"
            :class="
              showEmbeddedViewer
                ? 'bg-primary text-white'
                : 'bg-surface border border-outline-variant/60 text-on-surface hover:text-primary'
            "
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            title="Alternar visor embebido"
          >
            <span class="material-symbols-outlined text-sm">
              {{ showEmbeddedViewer ? "visibility_off" : "visibility" }}
            </span>
            <span>{{
              showEmbeddedViewer ? "Ocultar visor" : "Visor embebido"
            }}</span>
          </button>

          <!-- Previsualización Modal -->
          <button
            type="button"
            @click="showPdfModal = true"
            class="px-2.5 py-1.5 bg-surface border border-outline-variant/60 hover:border-primary/50 text-on-surface hover:text-primary rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            title="Abrir en pantalla completa"
          >
            <span class="material-symbols-outlined text-sm">fullscreen</span>
          </button>

          <!-- Abrir en pestaña nueva -->
          <a
            :href="cvUrl"
            target="_blank"
            rel="noopener"
            class="px-2.5 py-1.5 bg-surface border border-outline-variant/60 hover:border-primary/50 text-on-surface hover:text-primary rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            title="Abrir PDF en pestaña nueva"
          >
            <span class="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>
      </div>

      <!-- Visor Embebido para Previsualización Inmediata -->
      <div
        v-if="showEmbeddedViewer"
        class="border border-outline-variant/60 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 transition-all duration-200"
      >
        <div
          class="px-4 py-2 bg-surface-container-low border-b border-outline-variant/40 flex items-center justify-between text-xs"
        >
          <span class="font-semibold text-on-surface flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm text-primary"
              >preview</span
            >
            Previsualización Inmediata en Navegador
          </span>
          <button
            type="button"
            @click="showEmbeddedViewer = false"
            class="text-on-surface-variant hover:text-rose-500 transition"
          >
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        <iframe
          :src="cvUrl"
          class="w-full h-96 sm:h-[480px] bg-white border-0"
          title="Visor embebido de Currículum Vitae"
        ></iframe>
      </div>
    </div>

    <!-- Zona Interactiva de Drag & Drop (Compatible con Reemplazo Transaccional Directo) -->
    <div
      class="relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition select-none"
      :class="[
        isDragging
          ? 'border-primary bg-primary/10 ring-2 ring-primary/30 scale-[1.01]'
          : 'border-outline-variant/60 hover:border-primary/60 bg-surface-container-low/20 hover:bg-primary/5',
        uploadingCv ? 'opacity-60 pointer-events-none' : '',
      ]"
      @click="triggerCvSelect"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onFileDrop"
    >
      <div
        class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-2xl">
          {{ cvUrl ? "published_with_changes" : "upload_file" }}
        </span>
      </div>

      <div class="text-center space-y-1">
        <p class="text-xs font-bold text-on-background">
          <span v-if="isDragging" class="text-primary"
            >¡Suelta tu archivo PDF aquí!</span
          >
          <span v-else-if="cvUrl"
            >Reemplazar CV: Arrastra un nuevo archivo o haz clic aquí</span
          >
          <span v-else
            >Arrastra y suelta tu CV aquí o haz clic para seleccionarlo</span
          >
        </p>
        <p class="text-[11px] text-on-surface-variant dark:text-slate-400">
          Formato PDF exclusivamente · Peso máximo: 5 MB · Reemplazo directo en
          la nube
        </p>
      </div>

      <div class="flex items-center gap-2 mt-2" @click.stop>
        <button
          type="button"
          @click="triggerCvSelect"
          :disabled="uploadingCv"
          class="px-4 py-2 bg-primary hover:bg-primary-container disabled:bg-primary/50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
        >
          <span
            v-if="uploadingCv"
            class="w-3.5 h-3.5 border-2 border-current/20 border-t-current rounded-full animate-spin"
            aria-hidden="true"
          ></span>
          <span v-else class="material-symbols-outlined text-sm">
            {{ cvUrl ? "swap_horiz" : "upload" }}
          </span>
          <span>{{
            uploadingCv
              ? "Cargando archivo seguro..."
              : cvUrl
                ? "Reemplazar CV Directamente"
                : "Seleccionar Archivo PDF"
          }}</span>
        </button>

        <button
          v-if="!cvUrl"
          type="button"
          @click.stop="showCvBuilderModal = true"
          class="px-4 py-2 bg-surface border border-primary/40 text-primary hover:bg-primary/5 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
        >
          <span>✨ Usar Creador</span>
        </button>
      </div>
    </div>

    <!-- Mensaje de Error en Validación / Carga -->
    <div
      v-if="cvError"
      class="text-xs text-rose-600 dark:text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl flex items-center gap-2"
    >
      <span class="material-symbols-outlined text-base">error</span>
      <span>{{ cvError }}</span>
    </div>

    <input
      type="file"
      ref="cvFileInput"
      @change="handleCvFileInput"
      accept="application/pdf,.pdf"
      class="hidden"
    />

    <!-- Standardized PDF Preview Modal -->
    <AppPdfPreviewModal
      v-model="showPdfModal"
      :url="cvUrl"
      :file-name="cvName || 'Currículum_Principal.pdf'"
      title="Currículum Vitae Principal"
    />

    <!-- Interactive CV Builder Modal (Carta 215.9 x 279.4 mm) -->
    <CvBuilderModal
      v-model="showCvBuilderModal"
      :profile="currentProfileData"
      @cv-updated="handleCvUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { useS3Upload } from "~/composables/useS3Upload";
import { useAppFeedback } from "~/composables/useAppFeedback";
import type { CandidateProfile } from "~/types/candidate";

const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5 MB

const props = withDefaults(
  defineProps<{
    cvUrl: string;
    cvName: string;
    profile?: CandidateProfile;
  }>(),
  {
    profile: () => ({}),
  },
);

const emit = defineEmits<{
  (e: "update:cvUrl", value: string): void;
  (e: "update:cvName", value: string): void;
}>();

const showPdfModal = ref(false);
const showEmbeddedViewer = ref(false);
const showCvBuilderModal = ref(false);
const cvFileInput = ref<HTMLInputElement | null>(null);
const cvError = ref("");
const isDragging = ref(false);
const { isUploading: uploadingCv, uploadFile } = useS3Upload();
const { showError } = useAppFeedback();

const currentProfileData = computed<CandidateProfile>(() => {
  return props.profile || {};
});

function toggleEmbeddedViewer() {
  showEmbeddedViewer.value = !showEmbeddedViewer.value;
}

function handleCvUpdated(url: string) {
  emit("update:cvUrl", url);
  emit("update:cvName", "Curriculum_Vitae_Carta.pdf");
  showEmbeddedViewer.value = true;
}

function triggerCvSelect() {
  if (uploadingCv.value) return;
  cvFileInput.value?.click();
}

function onDragOver() {
  if (uploadingCv.value) return;
  isDragging.value = true;
}

function onDragLeave() {
  isDragging.value = false;
}

async function onFileDrop(e: DragEvent) {
  isDragging.value = false;
  if (uploadingCv.value) return;
  const files = e.dataTransfer?.files;
  if (!files || files.length === 0) return;
  await processAndUploadCv(files[0]);
}

async function handleCvFileInput(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  await processAndUploadCv(file);
  // Reset input value to allow selecting same file again if desired
  if (cvFileInput.value) cvFileInput.value.value = "";
}

/**
 * Valida peso máximo de 5MB, formato PDF y ejecuta reemplazo transaccional directo en S3.
 */
async function processAndUploadCv(file: File) {
  cvError.value = "";

  // 1. Validación de Formato PDF
  const isPdf =
    file.type === "application/pdf" ||
    file.type === "application/x-pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    cvError.value = "Solo se admiten documentos en formato PDF.";
    showError(
      "Formato no permitido",
      "Solo se admiten documentos en formato PDF para el currículum vitae.",
      null,
    );
    return;
  }

  // 2. Validación de Peso Máximo (5 MB)
  if (file.size > MAX_PDF_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const msg = `El archivo PDF "${file.name}" (${sizeMb} MB) supera el límite máximo permitido de 5 MB.`;
    cvError.value = msg;
    showError("Límite de Tamaño Excedido", msg, null);
    return;
  }

  // 3. Reemplazo Transaccional Directo en la nube (S3)
  const result = await uploadFile(file, {
    folder: "resumes",
    contentType: "application/pdf",
  });

  if (result?.url) {
    emit("update:cvUrl", result.url);
    emit("update:cvName", file.name);
    // Habilitar visor embebido para confirmación visual inmediata
    showEmbeddedViewer.value = true;
  } else {
    cvError.value =
      "Error al subir el archivo a almacenamiento seguro. Intente nuevamente.";
  }
}
</script>
