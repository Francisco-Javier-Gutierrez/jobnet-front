<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <h2
      class="text-base font-bold text-on-background flex items-center gap-2 border-b border-outline-variant/40 pb-3"
    >
      <span class="material-symbols-outlined text-emerald-600"
        >verified_user</span
      >
      Verificación de Identidad
    </h2>

    <div
      v-if="estatusVerificacion === 'En revisión'"
      class="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-xl flex items-start gap-3 shadow-sm mb-2"
    >
      <span class="material-symbols-outlined text-xl flex-shrink-0"
        >hourglass_empty</span
      >
      <div>
        <p class="font-bold text-sm">Solicitud en Proceso</p>
        <p class="text-xs">
          Ya has enviado una solicitud de verificación. Nuestro equipo de
          moderación la está revisando. Te notificaremos una vez haya sido
          aprobada o rechazada.
        </p>
      </div>
    </div>
    <div
      v-else-if="estatusVerificacion === 'Verificada' || isVerified"
      class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-start gap-3 shadow-sm mb-2"
    >
      <span class="material-symbols-outlined text-xl flex-shrink-0"
        >check_circle</span
      >
      <div>
        <div class="flex items-center gap-2">
          <p class="font-bold text-sm">Organización Verificada</p>
          <span
            class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider"
          >
            Cuenta Verificada
          </span>
        </div>
        <p class="text-xs mt-1 text-slate-600 dark:text-slate-300">
          Tu organización se encuentra verificada. Los candidatos verán la
          insignia de verificación oficial en tu perfil y en todas tus vacantes
          activas.
        </p>
      </div>
    </div>

    <template
      v-if="
        estatusVerificacion !== 'En revisión' &&
        estatusVerificacion !== 'Verificada' &&
        !isVerified
      "
    >
      <p
        class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
      >
        Sube tu Constancia de Situación Fiscal u otro documento oficial para
        certificar la identidad de tu organización frente a los candidatos. El
        equipo de moderación revisará este documento.
      </p>

      <div class="flex flex-col gap-1.5">
        <label
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
          for="tax-id"
        >
          RFC / Identificador Fiscal
        </label>
        <input
          :value="taxId"
          @input="
            $emit('update:taxId', ($event.target as HTMLInputElement).value)
          "
          id="tax-id"
          type="text"
          placeholder="Ej: ABC123456XYZ"
          class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition uppercase"
        />
      </div>

      <div class="flex flex-col gap-1.5 mt-2">
        <label
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
        >
          Documento Oficial de Identidad (Constancia de Situación Fiscal)
        </label>
        <div
          v-if="documentoVerificacion"
          class="flex items-center gap-3 bg-surface-container-low/40 p-3 rounded-xl border border-outline-variant/40"
        >
          <span class="material-symbols-outlined text-emerald-500">task</span>
          <div class="flex-grow min-w-0">
            <p class="text-xs font-bold text-on-background truncate">
              Documento Cargado
            </p>
            <a
              :href="documentoVerificacion"
              target="_blank"
              class="text-[10px] text-primary hover:underline truncate block"
              >Ver Archivo Adjunto</a
            >
          </div>
          <button
            type="button"
            @click="$emit('update:documentoVerificacion', '')"
            class="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition"
            title="Eliminar archivo"
          >
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>

        <div v-else>
          <div
            @click="$refs.docFileInput.click()"
            class="border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container-low/40 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition text-center"
          >
            <div v-if="uploadStore.uploading" class="w-full max-w-xs space-y-2">
              <div
                class="flex items-center justify-between text-xs font-bold text-primary"
              >
                <span>{{ uploadStore.uploadProgress }}</span>
              </div>
              <div
                class="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"
              >
                <div class="h-full bg-primary animate-pulse w-full"></div>
              </div>
            </div>
            <template v-else>
              <span class="material-symbols-outlined text-primary text-3xl mb-1"
                >cloud_upload</span
              >
              <span class="text-xs font-bold text-on-surface"
                >Selecciona o arrastra tu documento aquí (PDF, JPG, PNG)</span
              >
              <span
                class="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5"
                >Tamaño máximo: 5MB</span
              >
            </template>
            <input
              type="file"
              ref="docFileInput"
              @change="handleDocSelect"
              accept=".pdf,image/*"
              class="hidden"
            />
          </div>
          <p v-if="docError" class="text-xs text-rose-600 font-semibold mt-1">
            ⚠️ {{ docError }}
          </p>
        </div>
      </div>

      <AppActionButton
        @click="$emit('verify')"
        :loading="submittingVerification"
        :disabled="!taxId || !documentoVerificacion || uploadStore.uploading"
        icon="verified"
        loading-text="Enviando..."
        label="Solicitar Verificación de Organización"
        class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl active:scale-95 mt-2"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useUploadStore } from "~/stores/upload";
import { useAppFeedback } from "~/composables/useAppFeedback";

const props = defineProps<{
  taxId: string;
  documentoVerificacion: string;
  estatusVerificacion: string;
  isVerified?: boolean;
  companyId: string;
  submittingVerification: boolean;
}>();

const emit = defineEmits<{
  (e: "update:taxId", value: string): void;
  (e: "update:documentoVerificacion", value: string): void;
  (e: "verify"): void;
}>();

const uploadStore = useUploadStore();
const { showSuccess, showError } = useAppFeedback();

const docError = ref("");
const docFileInput = ref<HTMLInputElement | null>(null);

const handleDocSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  docError.value = "";
  if (file.size > 5 * 1024 * 1024) {
    docError.value =
      "Error: El archivo supera el tamaño máximo permitido (5MB).";
    return;
  }

  const userId = props.companyId || "company";
  const result = await uploadStore.uploadFile(file, "verifications", userId);

  if (result.success && result.url) {
    emit("update:documentoVerificacion", result.url);
    showSuccess(
      "Documento Subido",
      "Tu documento se ha adjuntado correctamente.",
      3000,
    );
  } else {
    docError.value =
      result.error || "Error al subir el documento de verificación.";
    showError("Error al subir archivo", docError.value, null);
  }
};
</script>
