<template>
  <AppModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Reportar un problema"
    icon="report_problem"
    icon-bg-class="bg-amber-500/10 text-amber-600 dark:text-amber-400"
    max-width="lg"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4 p-5 sm:p-6 text-xs">
      <div>
        <label class="block font-bold text-on-background dark:text-slate-200 mb-1.5">
          Categoría del problema <span class="text-rose-500">*</span>
        </label>
        <select
          v-model="form.category"
          class="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/60 bg-surface dark:bg-slate-800 text-on-background dark:text-slate-100 text-xs focus:outline-none focus:border-primary transition"
          required
        >
          <option value="FALLO_TECNICO">Fallo técnico / Error en la plataforma</option>
          <option value="DUDA_GENERAL">Duda general sobre el funcionamiento</option>
          <option value="PROBLEMA_CUENTA">Problema con mi cuenta o sesión</option>
          <option value="OTRO">Otro inconveniente</option>
        </select>
      </div>

      <div>
        <label class="block font-bold text-on-background dark:text-slate-200 mb-1.5">
          Asunto o título breve <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.subject"
          type="text"
          placeholder="Ej: No puedo actualizar mi CV / Error al postular"
          class="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/60 bg-surface dark:bg-slate-800 text-on-background dark:text-slate-100 text-xs focus:outline-none focus:border-primary transition"
          required
          minlength="3"
        />
      </div>

      <div>
        <label class="block font-bold text-on-background dark:text-slate-200 mb-1.5">
          Descripción detallada <span class="text-rose-500">*</span>
        </label>
        <textarea
          v-model="form.description"
          rows="4"
          placeholder="Describe con precisión qué ocurrió, qué pasos realizaste o qué duda tienes para que el moderador te asista..."
          class="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/60 bg-surface dark:bg-slate-800 text-on-background dark:text-slate-100 text-xs focus:outline-none focus:border-primary transition"
          required
          minlength="5"
        ></textarea>
      </div>

      <!-- Optional attachment/screenshot -->
      <div>
        <label class="block font-bold text-on-background dark:text-slate-200 mb-1.5">
          Captura de pantalla o archivo adjunto (opcional)
        </label>
        <div class="flex items-center gap-3">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*,application/pdf"
            class="hidden"
            @change="handleFileChange"
          />
          <button
            type="button"
            @click="triggerFileSelect"
            :disabled="isUploadingFile"
            class="px-3.5 py-2 rounded-xl border border-dashed border-outline-variant hover:border-primary text-xs font-semibold text-on-surface-variant dark:text-slate-300 hover:text-primary transition flex items-center gap-1.5 bg-surface dark:bg-slate-800/60"
          >
            <span class="material-symbols-outlined text-sm">attach_file</span>
            {{ isUploadingFile ? "Subiendo..." : "Adjuntar captura o archivo" }}
          </button>
          <div v-if="attachedFile" class="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-medium">
            <span class="truncate max-w-[180px]">{{ attachedFile.name }}</span>
            <button type="button" @click="removeAttachment" class="hover:text-rose-500">
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-3 border-t border-outline-variant/40">
        <button
          type="button"
          @click="$emit('update:modelValue', false)"
          class="px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
        >
          <span v-if="isSubmitting" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
          <span class="material-symbols-outlined text-sm">send</span>
          {{ isSubmitting ? "Enviando reporte..." : "Enviar a moderación" }}
        </button>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import AppModal from "~/components/common/AppModal.vue";
import { useS3Upload } from "~/composables/useS3Upload";
import type { TicketCategory, TicketAttachment, CreateTicketDTO } from "~/types/support";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "ticketCreated", ticket: any): void;
}>();

const { uploadFile } = useS3Upload();

const fileInputRef = ref<HTMLInputElement | null>(null);
const isUploadingFile = ref(false);
const isSubmitting = ref(false);
const attachedFile = ref<TicketAttachment | null>(null);

const form = reactive<{
  category: TicketCategory;
  subject: string;
  description: string;
}>({
  category: "FALLO_TECNICO",
  subject: "",
  description: "",
});

const isFormValid = computed(() => {
  return (
    form.subject.trim().length >= 3 &&
    form.description.trim().length >= 5 &&
    !isUploadingFile.value
  );
});

const triggerFileSelect = () => {
  fileInputRef.value?.click();
};

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  isUploadingFile.value = true;
  try {
    const res = await uploadFile(file, { folder: "support" });
    if (res?.url) {
      attachedFile.value = {
        url: res.url,
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "document",
        size: file.size,
      };
    }
  } catch (err) {
    console.error("Error al subir archivo de soporte:", err);
  } finally {
    isUploadingFile.value = false;
    if (fileInputRef.value) fileInputRef.value.value = "";
  }
};

const removeAttachment = () => {
  attachedFile.value = null;
};

const handleSubmit = async () => {
  if (!isFormValid.value || isSubmitting.value) return;

  const payload: CreateTicketDTO = {
    category: form.category,
    subject: form.subject.trim(),
    description: form.description.trim(),
    attachments: attachedFile.value ? [attachedFile.value] : [],
  };

  emit("ticketCreated", payload);
};
</script>
