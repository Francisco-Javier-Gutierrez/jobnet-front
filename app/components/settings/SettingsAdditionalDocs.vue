<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
  >
    <!-- Header with Dynamic Counter -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2
          class="text-base font-bold text-on-background flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-secondary"
            >workspace_premium</span
          >
          Documentos y Certificaciones
        </h2>
        <p class="text-xs text-on-surface-variant dark:text-slate-300 mt-0.5">
          Adjunta certificaciones, diplomas y constancias profesionales en PDF (máximo 5 documentos, hasta 5 MB por archivo) o registra enlaces web externos verificables.
        </p>
      </div>

      <!-- Counter Badge -->
      <div class="flex items-center gap-2">
        <span
          class="text-xs font-bold px-3 py-1 rounded-full border transition"
          :class="[
            pdfDocuments.length >= 5
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
              : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40',
          ]"
        >
          {{ pdfDocuments.length }} / 5 documentos PDF
        </span>
      </div>
    </div>

    <!-- Mode Selector Tabs: PDF en S3 vs Enlaces Verificables -->
    <div
      class="flex items-center gap-2 bg-surface-container-low/50 dark:bg-slate-950 p-1.5 rounded-xl border border-outline-variant/40"
    >
      <button
        type="button"
        @click="activeMode = 'pdf'"
        :class="
          activeMode === 'pdf'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'text-on-surface-variant hover:text-on-background font-medium'
        "
        class="flex-1 py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-2 cursor-pointer"
      >
        <span class="material-symbols-outlined text-base">upload_file</span>
        <span>Subir Documento PDF (S3 Seguro)</span>
      </button>

      <button
        type="button"
        @click="activeMode = 'verifiable_link'"
        :class="
          activeMode === 'verifiable_link'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'text-on-surface-variant hover:text-on-background font-medium'
        "
        class="flex-1 py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-2 cursor-pointer"
      >
        <span class="material-symbols-outlined text-base">verified</span>
        <span>Registrar Enlace Externo Verificable</span>
      </button>
    </div>

    <!-- Mode 1: Subida de Documentos PDF a la Nube (S3) -->
    <div
      v-if="activeMode === 'pdf'"
      class="bg-surface-container-low/30 dark:bg-slate-950/50 p-4 rounded-xl border border-outline-variant/40 space-y-4"
    >
      <!-- Alerta cuando se alcanza el límite de 5 documentos -->
      <div
        v-if="isPdfLimitReached"
        class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-lg shrink-0">info</span>
        <span>
          Has alcanzado el límite máximo permitido de 5 documentos PDF. Si deseas adjuntar otro documento, elimina uno de los existentes en la lista inferior.
        </span>
      </div>

      <div v-else class="space-y-4">
        <!-- Campos de Metadatos del Documento -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <AppSelect
              v-model="newDocType"
              :options="docTypeOptions"
              label="Tipo de Documento *"
              placeholder="Seleccionar tipo..."
            />
          </div>

          <div>
            <label
              class="text-[11px] font-bold text-on-surface-variant dark:text-slate-400 block mb-1"
            >
              Nombre / Título del Documento *
            </label>
            <input
              v-model="newDocName"
              type="text"
              placeholder="Ej: AWS Certified Solutions Architect, Título Profesional..."
              class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
            />
          </div>
        </div>

        <div>
          <label
            class="text-[11px] font-bold text-on-surface-variant dark:text-slate-400 block mb-1"
          >
            Institución o Entidad Emisora (Opcional)
          </label>
          <input
            v-model="newDocIssuer"
            type="text"
            placeholder="Ej: Amazon Web Services, Universidad Autónoma, Scrum Alliance..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
          />
        </div>

        <!-- Zona Drag & Drop para PDF -->
        <div
          class="border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition select-none"
          :class="[
            isDragging
              ? 'border-primary bg-primary/10 ring-2 ring-primary/30 scale-[1.01]'
              : 'border-outline-variant/60 hover:border-primary/60 bg-surface hover:bg-primary/5',
            isUploading ? 'opacity-60 pointer-events-none' : '',
          ]"
          @click="triggerFileSelect"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onFileDrop"
        >
          <span class="material-symbols-outlined text-3xl text-primary"
            >cloud_upload</span
          >
          <p class="text-xs font-bold text-on-background">
            <span v-if="selectedFile">{{ selectedFile.name }}</span>
            <span v-else-if="isDragging" class="text-primary"
              >¡Suelta tu archivo PDF aquí!</span
            >
            <span v-else
              >Arrastra tu archivo PDF aquí o haz clic para examinar</span
            >
          </p>
          <p class="text-[11px] text-on-surface-variant dark:text-slate-400">
            Formato: PDF exclusivamente · Peso máximo: 5 MB por archivo
          </p>

          <span
            v-if="selectedFile"
            class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full"
          >
            Archivo listo: {{ (selectedFile.size / (1024 * 1024)).toFixed(2) }} MB
          </span>
        </div>

        <!-- Botón de Confirmación de Carga -->
        <div class="flex justify-end gap-2 pt-1">
          <button
            v-if="selectedFile"
            type="button"
            @click="clearSelectedFile"
            class="px-3 py-2 text-xs font-semibold text-on-surface-variant hover:text-rose-500 transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            @click="uploadAndAddFile"
            :disabled="!selectedFile || isUploading"
            class="bg-primary hover:bg-primary-container disabled:bg-primary/40 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span
              v-if="isUploading"
              class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
              aria-hidden="true"
            ></span>
            <span v-else class="material-symbols-outlined text-sm"
              >check_circle</span
            >
            <span>{{
              isUploading
                ? uploadProgress || "Subiendo archivo a la nube..."
                : "Guardar Documento en la Nube"
            }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mode 2: Registrar Enlaces Web Externos Verificables -->
    <div
      v-else
      class="bg-surface-container-low/30 dark:bg-slate-950/50 p-4 rounded-xl border border-outline-variant/40 space-y-4"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            class="text-[11px] font-bold text-on-surface-variant dark:text-slate-400 block mb-1"
          >
            Nombre de la Credencial / Certificación *
          </label>
          <input
            v-model="externalTitle"
            type="text"
            placeholder="Ej: Specialization in Deep Learning, Scrum Master..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
          />
        </div>

        <div>
          <label
            class="text-[11px] font-bold text-on-surface-variant dark:text-slate-400 block mb-1"
          >
            Plataforma / Institución Emisora *
          </label>
          <input
            v-model="externalIssuer"
            type="text"
            placeholder="Ej: Coursera, Platzi, Credly, LinkedIn Learning..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
          />
        </div>
      </div>

      <div>
        <label
          class="text-[11px] font-bold text-on-surface-variant dark:text-slate-400 block mb-1"
        >
          Enlace Web de Verificación Externa *
        </label>
        <div class="relative">
          <input
            v-model="externalUrl"
            type="url"
            placeholder="https://www.credly.com/badges/... o https://coursera.org/verify/..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition pr-9"
          />
          <span
            class="material-symbols-outlined absolute right-2.5 top-2 text-sm text-on-surface-variant pointer-events-none"
            >link</span
          >
        </div>
        <p class="text-[10px] text-on-surface-variant dark:text-slate-400 mt-1">
          Debe ser una URL pública donde reclutadores puedan corroborar la autenticidad de tu certificación.
        </p>
      </div>

      <div class="flex justify-end pt-1">
        <button
          type="button"
          @click="addVerifiableLink"
          :disabled="!externalTitle.trim() || !externalUrl.trim()"
          class="bg-primary hover:bg-primary-container disabled:bg-primary/40 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
        >
          <span class="material-symbols-outlined text-sm">verified</span>
          <span>Registrar Enlace Verificable</span>
        </button>
      </div>
    </div>

    <!-- Error Feedback -->
    <div
      v-if="docError"
      class="text-xs text-rose-600 dark:text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl flex items-center gap-2"
    >
      <span class="material-symbols-outlined text-base">error</span>
      <span>{{ docError }}</span>
    </div>

    <input
      type="file"
      ref="fileInput"
      @change="handleFileSelected"
      accept="application/pdf,.pdf"
      class="hidden"
    />

    <!-- Listado de Documentos y Certificaciones Registradas -->
    <div v-if="docList.length > 0" class="space-y-3 pt-2">
      <div class="flex items-center justify-between border-b border-outline-variant/40 pb-2">
        <h3
          class="text-xs font-bold text-on-background uppercase tracking-wider flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm text-primary">folder</span>
          Documentos y Certificaciones Registradas ({{ docList.length }})
        </h3>
        <span class="text-[11px] text-on-surface-variant">
          Pulsa "Guardar Cambios del Perfil" al finalizar
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="(doc, index) in docList"
          :key="doc.url || index"
          class="bg-surface border border-outline-variant/60 hover:border-primary/50 rounded-xl p-3.5 flex flex-col justify-between gap-3 shadow-xs transition"
        >
          <div class="flex items-start gap-3 min-w-0">
            <!-- Icono según tipo -->
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              :class="
                doc.esEnlaceExterno
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              "
            >
              <span class="material-symbols-outlined text-xl">
                {{ doc.esEnlaceExterno ? "verified" : "picture_as_pdf" }}
              </span>
            </div>

            <!-- Información -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span
                  v-if="doc.tipoDocumento"
                  class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant"
                >
                  {{ formatDocType(doc.tipoDocumento) }}
                </span>
                <span
                  v-if="doc.esEnlaceExterno"
                  class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                >
                  Enlace Verificable
                </span>
                <span
                  v-else
                  class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-0.5"
                >
                  <span class="material-symbols-outlined text-[10px]">lock_clock</span>
                  Acceso seguro (1h)
                </span>
              </div>

              <h4
                class="text-xs font-bold text-on-background truncate mt-1"
                :title="doc.name || doc.nombre"
              >
                {{ doc.name || doc.nombre || "Documento Adjunto" }}
              </h4>

              <p
                v-if="doc.institucion"
                class="text-[11px] text-on-surface-variant dark:text-slate-400 truncate"
              >
                Emisor: {{ doc.institucion }}
              </p>

              <p
                v-if="doc.tamano"
                class="text-[10px] text-on-surface-variant/80 dark:text-slate-500"
              >
                Tamaño: {{ (doc.tamano / (1024 * 1024)).toFixed(2) }} MB
              </p>
            </div>
          </div>

          <!-- Acciones -->
          <div
            class="flex items-center justify-between pt-2 border-t border-outline-variant/30 text-xs"
          >
            <!-- Acción de Verificación / Previsualización Segura -->
            <template v-if="doc.esEnlaceExterno">
              <a
                :href="doc.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 dark:text-blue-400 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <span class="material-symbols-outlined text-sm">open_in_new</span>
                <span>Verificar en Sitio Web</span>
              </a>
            </template>

            <template v-else>
              <button
                type="button"
                @click="openSecurePreview(doc)"
                :disabled="loadingSecureUrl"
                class="text-primary hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span class="material-symbols-outlined text-sm">visibility</span>
                <span>Ver documento seguro</span>
              </button>
            </template>

            <!-- Botón Eliminar -->
            <button
              type="button"
              @click="removeDocument(index)"
              class="text-rose-500 hover:text-rose-600 font-semibold text-[11px] flex items-center gap-0.5 transition cursor-pointer"
              title="Eliminar documento"
            >
              <span class="material-symbols-outlined text-sm">delete</span>
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Visualización Segura de PDF -->
    <AppPdfPreviewModal
      v-model="showPdfModal"
      :url="previewPdfUrl"
      :title="previewPdfTitle"
    />
  </div>
</template>

<script setup lang="ts">
import { useS3Upload } from "~/composables/useS3Upload";
import { useAppFeedback } from "~/composables/useAppFeedback";
import type { AdditionalDoc } from "~/types/candidate";

const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_ADDITIONAL_PDFS = 5;

const props = withDefaults(
  defineProps<{
    documentosAdicionales?: AdditionalDoc[] | Record<string, any>;
  }>(),
  {
    documentosAdicionales: () => [],
  },
);

const emit = defineEmits<{
  (e: "update:documentosAdicionales", value: AdditionalDoc[]): void;
}>();

const { isUploading, uploadFile, getSecureViewUrl } = useS3Upload();
const { showError } = useAppFeedback();

const activeMode = ref<"pdf" | "verifiable_link">("pdf");
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const docError = ref("");
const uploadProgress = ref("");
const loadingSecureUrl = ref(false);

// Formulario Modo PDF
const newDocType = ref<"CERTIFICACION" | "DIPLOMA" | "CONSTANCIA" | "OTRO">(
  "CERTIFICACION",
);
const docTypeOptions = [
  { value: "CERTIFICACION", label: "📜 Certificación Profesional" },
  { value: "DIPLOMA", label: "🎓 Diploma de Especialización / Grado" },
  { value: "CONSTANCIA", label: "📄 Constancia Laboral / Participación" },
  { value: "OTRO", label: "📑 Otro Documento Profesional" },
];
const newDocName = ref("");
const newDocIssuer = ref("");
const selectedFile = ref<File | null>(null);

// Formulario Modo Enlace Externo Verificable
const externalTitle = ref("");
const externalIssuer = ref("");
const externalUrl = ref("");

// Visor Modal
const showPdfModal = ref(false);
const previewPdfUrl = ref("");
const previewPdfTitle = ref("");

// Lista normalizada de documentos
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
        : "link",
    }));
  }
  return [];
});

// Documentos PDF almacenados en S3 (excluye enlaces externos verificables)
const pdfDocuments = computed(() => {
  return docList.value.filter(
    (d) =>
      !d.esEnlaceExterno &&
      (d.type === "pdf" || (d.url && d.url.toLowerCase().includes(".pdf"))),
  );
});

// Condición de límite alcanzado (máximo 5 documentos PDF)
const isPdfLimitReached = computed(() => {
  return pdfDocuments.value.length >= MAX_ADDITIONAL_PDFS;
});

function formatDocType(type?: string): string {
  switch (type) {
    case "CERTIFICACION":
      return "Certificación";
    case "DIPLOMA":
      return "Diploma";
    case "CONSTANCIA":
      return "Constancia";
    case "OTRO":
      return "Documento";
    default:
      return "Profesional";
  }
}

function triggerFileSelect() {
  if (isUploading.value || isPdfLimitReached.value) return;
  fileInput.value?.click();
}

function onFileDrop(e: DragEvent) {
  isDragging.value = false;
  if (isUploading.value || isPdfLimitReached.value) return;
  const files = e.dataTransfer?.files;
  if (!files || files.length === 0) return;
  validateAndSelectFile(files[0]);
}

function handleFileSelected(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  validateAndSelectFile(target.files[0]);
}

function validateAndSelectFile(file: File) {
  docError.value = "";

  if (isPdfLimitReached.value) {
    docError.value =
      "Has alcanzado el límite máximo de 5 documentos PDF permitidos.";
    return;
  }

  const isPdf =
    file.type === "application/pdf" ||
    file.type === "application/x-pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    docError.value = "Solo se permiten archivos en formato PDF.";
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = "";
    return;
  }

  if (file.size > MAX_PDF_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const msg = `El archivo PDF "${file.name}" (${sizeMb} MB) supera el límite máximo permitido de 5 MB.`;
    docError.value = msg;
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = "";
    showError("Límite de Tamaño Excedido", msg, null);
    return;
  }

  selectedFile.value = file;
  if (!newDocName.value.trim()) {
    newDocName.value = file.name.replace(/\.[^/.]+$/, "");
  }
}

function clearSelectedFile() {
  selectedFile.value = null;
  if (fileInput.value) fileInput.value.value = "";
}

async function uploadAndAddFile() {
  if (!selectedFile.value) {
    docError.value = "Por favor selecciona un archivo PDF primero.";
    return;
  }

  if (isPdfLimitReached.value) {
    docError.value =
      "Has alcanzado el límite máximo de 5 documentos PDF adicionales.";
    return;
  }

  docError.value = "";
  const file = selectedFile.value;
  const title =
    newDocName.value.trim() || file.name.replace(/\.[^/.]+$/, "");

  uploadProgress.value = "Subiendo archivo a S3 de forma segura...";

  try {
    const result = await uploadFile(file, {
      folder: "documents",
      contentType: "application/pdf",
    });

    if (result?.url) {
      const newItem: AdditionalDoc = {
        id: `doc-${Date.now()}`,
        name: title,
        nombre: title,
        url: result.url,
        s3Key: result.key,
        type: "pdf",
        tipoDocumento: newDocType.value,
        institucion: newDocIssuer.value.trim() || undefined,
        tamano: file.size,
        fechaSubida: new Date().toISOString(),
        esEnlaceExterno: false,
      };

      const updated = [...docList.value, newItem];
      emit("update:documentosAdicionales", updated);

      // Limpiar formulario
      newDocName.value = "";
      newDocIssuer.value = "";
      selectedFile.value = null;
      if (fileInput.value) fileInput.value.value = "";
    } else {
      docError.value = "Error al completar la carga segura a S3.";
    }
  } catch (err: any) {
    docError.value = err.message || "Error al subir el documento.";
  } finally {
    uploadProgress.value = "";
  }
}

function addVerifiableLink() {
  docError.value = "";
  let url = externalUrl.value.trim();
  const title = externalTitle.value.trim();
  const issuer = externalIssuer.value.trim();

  if (!title) {
    docError.value = "El título de la certificación o credencial es requerido.";
    return;
  }

  if (!url) {
    docError.value = "La URL de verificación externa es requerida.";
    return;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const newItem: AdditionalDoc = {
    id: `link-${Date.now()}`,
    name: title,
    nombre: title,
    url,
    type: "link",
    tipoDocumento: "CERTIFICACION",
    institucion: issuer || undefined,
    fechaSubida: new Date().toISOString(),
    esEnlaceExterno: true,
  };

  const updated = [...docList.value, newItem];
  emit("update:documentosAdicionales", updated);

  // Limpiar formulario
  externalTitle.value = "";
  externalIssuer.value = "";
  externalUrl.value = "";
}

function removeDocument(index: number) {
  const updated = [...docList.value];
  updated.splice(index, 1);
  emit("update:documentosAdicionales", updated);
}

/**
 * Abre el visor de PDF solicitando un enlace de acceso temporal y seguro (1h) en la nube
 */
async function openSecurePreview(doc: AdditionalDoc) {
  if (!doc.url) return;
  loadingSecureUrl.value = true;
  try {
    const secureUrl = await getSecureViewUrl(doc.s3Key || doc.url);
    previewPdfUrl.value = secureUrl;
    previewPdfTitle.value = doc.name || doc.nombre || "Documento Seguro";
    showPdfModal.value = true;
  } finally {
    loadingSecureUrl.value = false;
  }
}
</script>
