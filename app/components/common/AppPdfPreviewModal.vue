<template>
  <AppModal
    :model-value="modelValue"
    @update:model-value="close"
    max-width="5xl"
    :title="title || fileName || 'Documento PDF Adjunto'"
    :subtitle="isImage ? 'Vista Previa de Imagen' : 'Visor de Documentos PDF'"
    :icon="isImage ? 'image' : 'picture_as_pdf'"
    icon-bg-class="bg-rose-500/10 text-rose-600 dark:text-rose-400"
    custom-class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden h-[92vh] sm:h-[90vh]"
  >
    <template #header>
      <div
        class="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/90 dark:bg-slate-900/90 flex-shrink-0"
      >
        <div class="flex items-center gap-3 min-w-0 mr-3">
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0"
          >
            <span class="material-symbols-outlined text-lg sm:text-xl">
              {{ isImage ? "image" : "picture_as_pdf" }}
            </span>
          </div>
          <div class="min-w-0 text-left">
            <h3
              class="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate select-text"
            >
              {{ title || fileName || "Documento PDF Adjunto" }}
            </h3>
            <p
              class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"
            >
              <span>{{
                isImage ? "Vista Previa de Imagen" : "Visor de Documentos PDF"
              }}</span>
            </p>
          </div>
        </div>

        <!-- Header Action Controls -->
        <div class="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <!-- Open in New Tab Button -->
          <a
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition active:scale-95 shadow-sm"
            title="Abrir en pantalla completa / nueva pestaña"
          >
            <span class="material-symbols-outlined text-sm">open_in_new</span>
            <span class="text-[11px] sm:text-xs">Abrir</span>
          </a>

          <!-- Direct Download Action Button -->
          <button
            type="button"
            @click="triggerDirectDownload"
            :disabled="isDownloading"
            class="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-95 shadow-sm disabled:opacity-50 cursor-pointer"
            title="Descargar documento PDF"
          >
            <span
              v-if="isDownloading"
              class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
              aria-hidden="true"
            ></span>
            <span v-else class="material-symbols-outlined text-sm"
              >download</span
            >
            <span class="text-[11px] sm:text-xs">{{
              isDownloading ? "..." : "Descargar"
            }}</span>
          </button>

          <!-- Close Modal -->
          <button
            @click="close"
            type="button"
            class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200/60 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
            title="Cerrar vista previa"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>
    </template>

    <!-- Mobile Quick Action Banner -->
    <div
      v-if="!isImage"
      class="sm:hidden px-3 py-2 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between gap-2 flex-shrink-0"
    >
      <div
        class="flex items-center gap-1.5 text-[11px] text-indigo-700 dark:text-indigo-300 font-medium truncate"
      >
        <span class="material-symbols-outlined text-sm flex-shrink-0"
          >info</span
        >
        <span class="truncate"
          >¿No carga en tu móvil? Abre en pantalla completa</span
        >
      </div>
      <a
        :href="url"
        target="_blank"
        class="px-2.5 py-1 bg-indigo-600 text-white font-bold text-[10px] rounded-lg shadow flex-shrink-0 flex items-center gap-1"
      >
        Ver Completo
        <span class="material-symbols-outlined text-xs">arrow_forward</span>
      </a>
    </div>

    <!-- Document Viewer Body -->
    <div
      class="w-full h-full bg-slate-900 relative overflow-hidden flex items-center justify-center p-0"
    >
      <!-- Case A: Image View -->
      <div
        v-if="isImage"
        class="w-full h-full p-2 sm:p-4 flex items-center justify-center overflow-auto"
      >
        <img
          :src="url"
          :alt="title || 'Vista previa de documento'"
          class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>

      <!-- Case B: PDF File Dual Engine View -->
      <template v-else>
        <!-- 1. Native Object / Embed Player -->
        <object :data="url" type="application/pdf" class="w-full h-full block">
          <!-- 2. Fallback Google Docs Embedded Viewer -->
          <iframe
            :src="googleViewerUrl"
            class="w-full h-full border-none"
            title="Visor PDF integrado"
          ></iframe>
        </object>
      </template>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { useCvInteraction } from "~/composables/useCvInteraction";

const props = defineProps<{
  modelValue: boolean;
  url: string;
  title?: string;
  fileName?: string;
  candidateId?: string;
  vacancyTitle?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { notifyCvInteraction } = useCvInteraction();

const close = () => {
  emit("update:modelValue", false);
};

// Notificación de Interacción con el CV al abrir el visor
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && props.candidateId) {
      notifyCvInteraction(props.candidateId, {
        action: "VIEW",
        vacancyTitle: props.vacancyTitle,
      });
    }
  },
);

const isImage = computed(() => {
  if (!props.url) return false;
  const cleanUrl = props.url.toLowerCase();
  return (
    cleanUrl.endsWith(".png") ||
    cleanUrl.endsWith(".jpg") ||
    cleanUrl.endsWith(".jpeg") ||
    cleanUrl.endsWith(".webp") ||
    cleanUrl.endsWith(".svg") ||
    cleanUrl.endsWith(".gif")
  );
});

const googleViewerUrl = computed(() => {
  if (!props.url) return "";
  return `https://docs.google.com/gview?url=${encodeURIComponent(props.url)}&embedded=true`;
});

const isDownloading = ref(false);

const triggerDirectDownload = async () => {
  if (!props.url || isDownloading.value) return;

  // Notificación de Interacción con el CV al descargar el documento
  if (props.candidateId) {
    notifyCvInteraction(props.candidateId, {
      action: "DOWNLOAD",
      vacancyTitle: props.vacancyTitle,
    });
  }

  isDownloading.value = true;
  try {
    const res = await fetch(props.url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = props.fileName || props.title || "Documento.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    const link = document.createElement("a");
    link.href = props.url;
    link.target = "_blank";
    link.download = props.fileName || props.title || "Documento.pdf";
    link.click();
  } finally {
    isDownloading.value = false;
  }
};
</script>
