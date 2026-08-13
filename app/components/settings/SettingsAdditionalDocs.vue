<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-base font-bold text-on-background flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-secondary"
          >folder_open</span
        >
        Documentos Adicionales y Certificaciones
      </h2>
      <span
        class="text-xs text-on-surface-variant font-medium bg-surface-container-low px-2.5 py-1 rounded-full border border-outline-variant/40"
      >
        {{ docList.length }}
        {{ docList.length === 1 ? "documento" : "documentos" }}
      </span>
    </div>
    <p
      class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
    >
      Agrega certificaciones, títulos o constancias (Formato PDF, máx 5MB).
      Puedes subir el archivo directamente a S3 o ingresar una URL de la nube.
    </p>

    <!-- Upload / Add Container -->
    <div
      class="bg-surface-container-low/40 dark:bg-slate-950 p-4 rounded-xl border border-outline-variant/40 space-y-4"
    >
      <div
        class="flex items-center justify-between flex-wrap gap-2 border-b border-outline-variant/30 pb-3"
      >
        <h3
          class="text-xs font-bold text-on-background flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm text-primary"
            >add_circle</span
          >
          Nuevo Documento
        </h3>

        <div
          class="flex items-center gap-1 bg-surface-container-high/60 p-1 rounded-lg"
        >
          <button
            type="button"
            @click="inputMode = 'file'"
            :class="
              inputMode === 'file'
                ? 'bg-primary text-white shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-background'
            "
            class="px-2.5 py-1 rounded-md text-[11px] transition flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-xs">upload_file</span>
            Subir Archivo (S3)
          </button>
          <button
            type="button"
            @click="inputMode = 'url'"
            :class="
              inputMode === 'url'
                ? 'bg-primary text-white shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-background'
            "
            class="px-2.5 py-1 rounded-md text-[11px] transition flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-xs">link</span>
            Enlace URL (Nube)
          </button>
        </div>
      </div>

      <!-- Common Title Input -->
      <div>
        <label
          class="text-[11px] font-bold text-on-surface-variant dark:text-slate-400 block mb-1"
        >
          Nombre del Documento / Certificación
        </label>
        <input
          v-model="newDocName"
          type="text"
          placeholder="Ej: Certificación AWS Cloud, Título Universitario..."
          class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
        />
      </div>

      <!-- Mode A: File Upload with Explicit Add Button -->
      <div v-if="inputMode === 'file'" class="space-y-3">
        <div>
          <label
            class="text-[11px] font-bold text-on-surface-variant dark:text-slate-400 block mb-1"
          >
            Archivo Local PDF (Máx 5MB) *
          </label>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="triggerFileSelect"
              :disabled="isUploading"
              class="flex-1 bg-surface border border-outline-variant/60 hover:border-primary text-primary text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span v-if="isUploading" class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" aria-hidden="true"></span>
              <span v-else class="material-symbols-outlined text-base"
                >upload_file</span
              >
              <span class="truncate">{{
                selectedFile
                  ? selectedFile.name
                  : "Seleccionar PDF de tu equipo"
              }}</span>
            </button>
          </div>
        </div>

        <div class="flex justify-end pt-1">
          <button
            type="button"
            @click="uploadAndAddFile"
            :disabled="!selectedFile || isUploading"
            class="bg-primary hover:bg-primary-container text-white disabled:bg-primary/40 text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span v-if="isUploading" class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" aria-hidden="true"></span>
            <span v-else class="material-symbols-outlined text-sm"
              >add_circle</span
            >
            <span>{{
              isUploading
                ? uploadProgress || "Subiendo archivo..."
                : "Subir y Agregar a la Lista"
            }}</span>
          </button>
        </div>
      </div>

      <!-- Mode B: Direct URL Input with Add Button -->
      <div v-else class="space-y-3">
        <div>
          <label
            class="text-[11px] font-bold text-on-surface-variant dark:text-slate-400 block mb-1"
          >
            Enlace URL del Documento (Google Drive, Dropbox, etc.) *
          </label>
          <input
            v-model="directUrl"
            type="url"
            placeholder="https://drive.google.com/file/d/..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
          />
        </div>
        <div class="flex justify-end pt-1">
          <button
            type="button"
            @click="addUrlDocument"
            :disabled="!directUrl.trim()"
            class="bg-primary hover:bg-primary-container text-white disabled:bg-primary/40 text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span class="material-symbols-outlined text-sm">add_link</span>
            <span>Agregar Enlace a la Lista</span>
          </button>
        </div>
      </div>

      <!-- Error feedback -->
      <p
        v-if="docError"
        class="text-xs text-rose-600 font-semibold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20"
      >
        {{ docError }}
      </p>

      <input
        type="file"
        ref="fileInput"
        @change="handleFileSelected"
        accept="application/pdf"
        class="hidden"
      />
    </div>

    <!-- Uploaded Documents List -->
    <div v-if="docList.length > 0" class="space-y-2 pt-1">
      <h3
        class="text-xs font-bold text-on-background uppercase tracking-wider flex items-center justify-between"
      >
        <span>Documentos Registrados ({{ docList.length }})</span>
        <span class="text-[10px] text-on-surface-variant font-normal"
          >Pulsa "Guardar Cambios del Perfil" al finalizar</span
        >
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="(doc, index) in docList"
          :key="doc.url || index"
          class="flex items-center justify-between p-3 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/50 rounded-xl shadow-sm hover:border-primary/40 transition"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="
                doc.type === 'pdf' || (doc.url && doc.url.includes('.pdf'))
                  ? 'bg-rose-500/10 text-rose-600'
                  : 'bg-primary/10 text-primary'
              "
            >
              <span class="material-symbols-outlined text-lg">
                {{
                  doc.type === "pdf" || (doc.url && doc.url.includes(".pdf"))
                    ? "picture_as_pdf"
                    : "image"
                }}
              </span>
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-on-background truncate">
                {{ doc.name || doc.nombre || "Documento Adicional" }}
              </p>
              <div class="flex items-center gap-2 mt-0.5">
                <button
                  type="button"
                  @click="openPreview(doc)"
                  class="text-[10px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-xs"
                    >visibility</span
                  >
                  <span>Ver Previa</span>
                </button>
                <a
                  :href="doc.url"
                  target="_blank"
                  rel="noopener"
                  class="text-[10px] text-on-surface-variant hover:underline font-medium block truncate"
                >
                  Abrir ↗
                </a>
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="removeDocument(index)"
            class="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition ml-2 flex-shrink-0"
            title="Eliminar documento"
          >
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Standardized PDF Preview Modal -->
    <AppPdfPreviewModal
      v-model="showPdfModal"
      :url="previewPdfUrl"
      :title="previewPdfTitle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useUploadStore } from "~/stores/upload";
import AppPdfPreviewModal from "~/components/common/AppPdfPreviewModal.vue";

const showPdfModal = ref(false);
const previewPdfUrl = ref("");
const previewPdfTitle = ref("");

const openPreview = (doc: any) => {
  if (!doc.url) return;
  previewPdfUrl.value = doc.url;
  previewPdfTitle.value = doc.name || doc.nombre || "Documento Adicional";
  showPdfModal.value = true;
};

export interface AdditionalDoc {
  name: string;
  url: string;
  type?: string;
  nombre?: string;
}

const props = withDefaults(
  defineProps<{
    documentosAdicionales?: any;
  }>(),
  {
    documentosAdicionales: () => [],
  },
);

const emit = defineEmits<{
  (e: "update:documentosAdicionales", value: AdditionalDoc[]): void;
}>();

const { data: session } = useAuth();
const inputMode = ref<"file" | "url">("file");
const fileInput = ref<HTMLInputElement | null>(null);
const newDocName = ref("");
const selectedFile = ref<File | null>(null);
const directUrl = ref("");
const docError = ref("");
const isUploading = ref(false);
const uploadProgress = ref("");

// Bulletproof array converter to guarantee iterability
const docList = computed<AdditionalDoc[]>(() => {
  const raw = props.documentosAdicionales;
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    return Object.entries(raw).map(([name, item]: [string, any]) => ({
      name,
      nombre: name,
      url: typeof item === "string" ? item : item?.url || "",
      type: (typeof item === "string" ? item : item?.url || "").includes(".pdf")
        ? "pdf"
        : "image",
    }));
  }
  return [];
});

function triggerFileSelect() {
  if (isUploading.value) return;
  fileInput.value?.click();
}

function handleFileSelected(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  docError.value = "";

  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    docError.value = "Solo se permiten archivos en formato PDF.";
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = "";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const msg = `El archivo PDF "${file.name}" (${sizeMb} MB) supera el límite máximo permitido de 10MB.`;
    docError.value = msg;
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = "";
    const { showError } = useAppFeedback();
    showError("Límite de Tamaño Excedido", msg, null);
    return;
  }

  selectedFile.value = file;
  if (!newDocName.value.trim()) {
    newDocName.value = file.name.replace(/\.[^/.]+$/, "");
  }
}

async function uploadAndAddFile() {
  if (!selectedFile.value) {
    docError.value = "Por favor selecciona un archivo PDF o imagen primero.";
    return;
  }

  docError.value = "";
  const file = selectedFile.value;
  const docTitle =
    newDocName.value.trim() || file.name.replace(/\.[^/.]+$/, "");

  isUploading.value = true;
  uploadProgress.value = "Subiendo archivo a S3...";

  try {
    const uploadStore = useUploadStore();
    const userId = session.value?.user?.id || "user";
    const res = await uploadStore.uploadFile(file, "documents", userId);

    if (res.success && res.url) {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      const newItem: AdditionalDoc = {
        name: docTitle,
        nombre: docTitle,
        url: res.url,
        type: isPdf ? "pdf" : "image",
      };

      const updated = [...docList.value, newItem];
      emit("update:documentosAdicionales", updated);

      // Reset file input and state
      newDocName.value = "";
      selectedFile.value = null;
      if (fileInput.value) fileInput.value.value = "";
    } else {
      docError.value =
        res.error || "No se pudo completar la carga del archivo a S3.";
    }
  } catch (err: any) {
    docError.value = err.message || "Error durante la subida del documento.";
  } finally {
    isUploading.value = false;
    uploadProgress.value = "";
  }
}

function addUrlDocument() {
  docError.value = "";
  let url = directUrl.value.trim();
  if (!url) return;

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const docTitle = newDocName.value.trim() || "Documento Web";
  const isPdf = url.toLowerCase().includes(".pdf");

  const newItem: AdditionalDoc = {
    name: docTitle,
    nombre: docTitle,
    url,
    type: isPdf ? "pdf" : "image",
  };

  const updated = [...docList.value, newItem];
  emit("update:documentosAdicionales", updated);

  newDocName.value = "";
  directUrl.value = "";
}

function removeDocument(index: number) {
  const updated = [...docList.value];
  updated.splice(index, 1);
  emit("update:documentosAdicionales", updated);
}
</script>
