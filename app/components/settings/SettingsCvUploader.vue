<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-base font-bold text-on-background flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-rose-600 dark:text-rose-400"
          >picture_as_pdf</span
        >
        Currículum Vitae Principal (CV PDF)
      </h2>
    </div>
    <p
      class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
    >
      Sube tu CV oficial en formato PDF (Máximo 5MB). Este documento se enviará
      automáticamente en tus postulaciones en 1-clic.
    </p>

    <!-- Upload Status / Preview Card -->
    <div
      v-if="cvUrl"
      class="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
    >
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-emerald-600 text-3xl"
          >picture_as_pdf</span
        >
        <div>
          <p class="text-xs font-bold text-emerald-950 dark:text-emerald-300">
            {{ cvName || "Currículum_Principal.pdf" }}
          </p>
          <p class="text-[10px] text-emerald-700 dark:text-emerald-400">
            Documento cargado exitosamente
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <a
          :href="cvUrl"
          target="_blank"
          class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-xs">visibility</span>
          Ver PDF
        </a>
        <button
          type="button"
          @click="removeCv"
          class="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-xs font-bold rounded-lg transition"
        >
          Eliminar
        </button>
      </div>
    </div>

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
        Formatos permitidos: PDF (Máx 5MB)
      </p>
      <button
        type="button"
        :disabled="uploadingCv"
        class="mt-2 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
      >
        <span v-if="uploadingCv" class="animate-spin text-xs">⌛</span>
        <span>{{ uploadingCv ? "Subiendo..." : "Seleccionar Archivo" }}</span>
      </button>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useS3Upload } from "~/composables/useS3Upload";

const props = defineProps<{
  cvUrl: string;
  cvName: string;
}>();

const emit = defineEmits<{
  (e: "update:cvUrl", value: string): void;
  (e: "update:cvName", value: string): void;
}>();

const cvFileInput = ref<HTMLInputElement | null>(null);
const cvError = ref("");
const { isUploading: uploadingCv, uploadFile } = useS3Upload();

function triggerCvSelect() {
  cvFileInput.value?.click();
}

async function handleCvUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  cvError.value = "";

  if (file.type !== "application/pdf") {
    cvError.value = "Solo se permiten archivos PDF.";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    cvError.value = "El archivo PDF no debe superar los 5MB.";
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
