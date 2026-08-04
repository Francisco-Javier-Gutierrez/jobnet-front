<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
  >
    <h2
      class="text-base font-bold text-on-background flex items-center gap-2 border-b border-outline-variant/40 pb-3"
    >
      <span class="material-symbols-outlined text-rose-600 dark:text-rose-400"
        >verified</span
      >
      Documentos Corporativos Relevantes (ISO, NOMs, Registro Mercantil)
    </h2>
    <p
      class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
    >
      Sube tus certificaciones de calidad ISO, constancias de cumplimiento NOM,
      Registro Mercantil u otros documentos estratégicos que den credibilidad a
      tu organización frente a candidatos y postulantes.
    </p>

    <!-- List of Already Uploaded Corporate Documents -->
    <div v-if="documentosCorporativos.length > 0" class="space-y-3">
      <p class="text-xs font-bold text-on-background">
        Documentos Corporativos Registrados ({{
          documentosCorporativos.length
        }})
      </p>

      <div
        v-for="(doc, idx) in documentosCorporativos"
        :key="doc.id || idx"
        class="bg-surface-container-low/40 dark:bg-slate-800/40 border border-outline-variant/50 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center flex-shrink-0"
          >
            <span class="material-symbols-outlined text-xl"
              >workspace_premium</span
            >
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800"
              >
                {{ doc.tipo || "Certificación Corporativa" }}
              </span>
            </div>
            <p class="text-xs font-bold text-on-background truncate mt-1">
              {{ doc.nombre || "Documento_Corporativo.pdf" }}
            </p>
            <p class="text-[10px] text-slate-500 dark:text-slate-400">
              Subido: {{ doc.fechaCarga || "Recientemente" }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="$emit('previewDoc', doc)"
            class="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95"
          >
            <span class="material-symbols-outlined text-sm">visibility</span>
            Visualizar
          </button>
          <button
            type="button"
            @click="removeDoc(idx)"
            class="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 text-rose-600 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95"
          >
            <span class="material-symbols-outlined text-sm">delete</span>
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Mini-Form to Add New Corporate Document -->
    <div
      class="bg-surface-container-low/60 dark:bg-slate-800/60 border border-outline-variant/60 dark:border-slate-800 rounded-xl p-4 space-y-3"
    >
      <p class="text-xs font-bold text-on-background flex items-center gap-1.5">
        <span class="material-symbols-outlined text-sm text-indigo-500"
          >post_add</span
        >
        Agregar Nuevo Documento Relevante
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="flex flex-col gap-1">
          <label
            class="text-[11px] font-bold text-on-surface-variant dark:text-slate-300"
            >Naturaleza / Tipo de Documento *</label
          >
          <input
            v-model="nuevoDocTipo"
            type="text"
            placeholder="Ej: Certificación ISO 9001, Cumplimiento NOM..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label
            class="text-[11px] font-bold text-on-surface-variant dark:text-slate-300"
            >Nombre Personalizado del Archivo</label
          >
          <input
            v-model="nuevoDocNombre"
            type="text"
            placeholder="Ej: Certificación ISO 9001:2015 Vigente"
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
          />
        </div>
      </div>

      <div
        @click="$refs.docFileInput.click()"
        @dragover.prevent="docDragOver = true"
        @dragleave.prevent="docDragOver = false"
        @drop.prevent="handleDocDrop"
        :class="[
          docDragOver
            ? 'border-indigo-500 bg-indigo-500/5'
            : 'border-outline-variant bg-surface-container-low/40 hover:border-indigo-400',
        ]"
        class="border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition text-center"
      >
        <div v-if="uploadStore.uploading" class="w-full max-w-xs space-y-2">
          <div
            class="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400"
          >
            <span>{{ uploadStore.uploadProgress }}</span>
          </div>
          <div
            class="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse w-full"
            ></div>
          </div>
        </div>
        <template v-else>
          <span class="material-symbols-outlined text-indigo-500 text-3xl mb-1"
            >cloud_upload</span
          >
          <span class="text-xs font-bold text-on-surface"
            >Selecciona o arrastra el documento PDF de la organización
            aquí</span
          >
          <span
            class="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5"
            >Formato estrictamente PDF (.pdf) — Tamaño máximo: 5MB</span
          >
        </template>
        <input
          type="file"
          ref="docFileInput"
          @change="handleDocSelect"
          accept="application/pdf"
          class="hidden"
        />
      </div>

      <p
        v-if="docError"
        class="text-xs text-rose-600 font-semibold bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800"
      >
        ⚠️ {{ docError }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUploadStore } from "~/stores/upload";
import { useAppFeedback } from "~/composables/useAppFeedback";

interface DocumentoCorporativo {
  id: string;
  tipo: string;
  nombre: string;
  url: string;
  fechaCarga: string;
}

const props = defineProps<{
  companyId: string;
  documentosCorporativos: DocumentoCorporativo[];
}>();

const emit = defineEmits<{
  (e: "update:documentosCorporativos", value: DocumentoCorporativo[]): void;
  (e: "previewDoc", doc: DocumentoCorporativo): void;
}>();

const uploadStore = useUploadStore();
const { showSuccess } = useAppFeedback();

const nuevoDocTipo = ref("Certificación ISO");
const nuevoDocNombre = ref("");
const docDragOver = ref(false);
const docError = ref("");
const docFileInput = ref<HTMLInputElement | null>(null);

const removeDoc = (index: number) => {
  const newDocs = [...props.documentosCorporativos];
  newDocs.splice(index, 1);
  emit("update:documentosCorporativos", newDocs);
};

const processDocFile = async (file: File) => {
  docError.value = "";
  const isPdfExtension = file.name.toLowerCase().endsWith(".pdf");
  const isPdfMime = file.type === "application/pdf";

  if (!isPdfExtension || (!isPdfMime && file.type !== "")) {
    docError.value =
      "Error: El archivo seleccionado no es un formato PDF válido. Cargue únicamente archivos .pdf";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    docError.value =
      "Error: El archivo PDF supera el tamaño máximo permitido (5MB).";
    return;
  }

  const userId = props.companyId || "company";
  const result = await uploadStore.uploadFile(file, "corporate_docs", userId);

  if (result.success && result.url) {
    const docTitle = nuevoDocNombre.value.trim() || file.name;
    const docEntry: DocumentoCorporativo = {
      id: Date.now().toString(),
      tipo: nuevoDocTipo.value || "Certificación Corporativa",
      nombre: docTitle,
      url: result.url,
      fechaCarga: new Date().toLocaleDateString("es-ES"),
    };

    const newDocs = [...props.documentosCorporativos, docEntry];
    emit("update:documentosCorporativos", newDocs);
    nuevoDocNombre.value = "";
    showSuccess(
      "Documento Cargado",
      `¡Documento "${docTitle}" (${docEntry.tipo}) cargado exitosamente!`,
      3500,
    );
  } else {
    docError.value =
      result.error || "Error al cargar el documento corporativo.";
  }
};

const handleDocSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) processDocFile(file);
};

const handleDocDrop = (event: DragEvent) => {
  docDragOver.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) processDocFile(file);
};
</script>
