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
        Currículum Vitae Principal (CV PDF)
      </h2>

      <!-- Create with Templates Button -->
      <button
        type="button"
        @click="showCvBuilderModal = true"
        class="px-3.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
      >
        <span class="material-symbols-outlined text-sm">auto_fix_high</span>
        <span>✨ Generar CV con Plantillas (Carta)</span>
      </button>
    </div>

    <p
      class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
    >
      Sube tu CV oficial o créalo automáticamente con nuestras plantillas
      profesionales en tamaño Carta (8.5" × 11"). Este documento se enviará
      automáticamente en tus postulaciones en 1-clic.
    </p>

    <!-- Upload Status / Preview Card -->
    <AppFileAttachment
      v-if="cvUrl"
      :name="cvName || 'Currículum_Principal.pdf'"
      subtitle="Documento cargado exitosamente"
      type="pdf"
      variant="success"
      :show-preview="true"
      @preview="showPdfModal = true"
      @remove="removeCv"
    >
      <template #extra-actions>
        <a
          :href="cvUrl"
          target="_blank"
          rel="noopener"
          class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition flex items-center justify-center cursor-pointer"
          title="Abrir PDF en pestaña nueva"
        >
          <span class="material-symbols-outlined text-[14px]">open_in_new</span>
        </a>
      </template>
    </AppFileAttachment>

    <!-- Upload Dropzone -->
    <div
      v-else
      class="border-2 border-dashed border-outline-variant/60 hover:border-primary/60 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-surface-container-low/20 hover:bg-primary/5"
      @click="triggerCvSelect"
    >
      <span class="material-symbols-outlined text-3xl text-primary"
        >upload_file</span
      >
      <p class="text-xs font-bold text-on-background">
        Haz clic para seleccionar tu CV (PDF)
      </p>
      <p class="text-[11px] text-on-surface-variant dark:text-slate-400">
        Formatos permitidos: PDF (Máx 10MB)
      </p>
      <div class="flex items-center gap-2 mt-2">
        <button
          type="button"
          :disabled="uploadingCv"
          class="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
        >
          <span
            v-if="uploadingCv"
            class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
            aria-hidden="true"
          ></span>
          <span>{{ uploadingCv ? "Subiendo..." : "Subir Archivo" }}</span>
        </button>

        <button
          type="button"
          @click.stop="showCvBuilderModal = true"
          class="px-4 py-1.5 bg-surface border border-primary/40 text-primary hover:bg-primary/5 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
        >
          <span>✨ Usar Creador</span>
        </button>
      </div>
    </div>

    <p v-if="cvError" class="text-xs text-rose-600 font-semibold mt-1">
      {{ cvError }}
    </p>

    <input
      type="file"
      ref="cvFileInput"
      @change="handleCvUpload"
      accept="application/pdf"
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
import type { CandidateProfile } from "~/types/candidate";

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
const showCvBuilderModal = ref(false);
const cvFileInput = ref<HTMLInputElement | null>(null);
const cvError = ref("");
const { isUploading: uploadingCv, uploadFile } = useS3Upload();

const currentProfileData = computed<CandidateProfile>(() => {
  return props.profile || {};
});

function handleCvUpdated(url: string) {
  emit("update:cvUrl", url);
  emit("update:cvName", "Curriculum_Vitae_Carta.pdf");
}

function triggerCvSelect() {
  cvFileInput.value?.click();
}

async function handleCvUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  cvError.value = "";

  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    cvError.value = "Solo se permiten archivos PDF.";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const msg = `El archivo PDF "${file.name}" (${sizeMb} MB) supera el límite máximo permitido de 10MB.`;
    cvError.value = msg;
    const { showError } = useAppFeedback();
    showError("Límite de Tamaño Excedido", msg, null);
    return;
  }

  const result = await uploadFile(file, {
    folder: "resumes",
    contentType: "application/pdf",
  });
  if (result) {
    emit("update:cvUrl", result.url);
    emit("update:cvName", file.name);
  } else {
    cvError.value = "Error al subir el CV a S3.";
  }
}

function removeCv() {
  emit("update:cvUrl", "");
  emit("update:cvName", "");
}
</script>
