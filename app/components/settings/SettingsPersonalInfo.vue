<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <h2
      class="text-base font-bold text-on-background mb-2 flex items-center gap-2"
    >
      <span class="material-symbols-outlined text-primary">person</span>
      Información Personal
    </h2>

    <!-- Avatar / Photo Upload Container -->
    <div
      class="flex items-center gap-4 p-3 bg-surface-container-low/40 rounded-xl border border-outline-variant/40"
    >
      <div
        class="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-tr from-primary to-secondary-container flex items-center justify-center text-white text-2xl font-bold relative group cursor-pointer border-2 border-white shadow-md flex-shrink-0"
        @click="triggerPhotoSelect"
        title="Cambiar foto de perfil"
      >
        <img
          v-if="fotoPerfil"
          :src="fotoPerfil"
          alt="Foto de perfil"
          class="w-full h-full object-cover"
        />
        <span v-else>{{ name ? name.charAt(0).toUpperCase() : "U" }}</span>

        <div
          class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span class="material-symbols-outlined text-white text-2xl"
            >add_a_photo</span
          >
        </div>
      </div>

      <div class="flex flex-col gap-1 text-left min-w-0">
        <p class="text-xs font-bold text-on-background">Foto de Perfil</p>
        <p
          class="text-[11px] text-on-surface-variant dark:text-slate-300 leading-relaxed"
        >
          Subir imagen (PNG, JPG, WEBP - Máx 5MB).
        </p>
        <div class="flex items-center gap-2 mt-1">
          <button
            type="button"
            @click="triggerPhotoSelect"
            :disabled="uploadingPhoto"
            class="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-lg transition disabled:opacity-50 flex items-center gap-1 active:scale-95"
          >
            <span
              v-if="uploadingPhoto"
              class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
              aria-hidden="true"
            ></span>
            <span>{{ uploadingPhoto ? "Subiendo..." : "Cambiar Foto" }}</span>
          </button>
          <button
            v-if="fotoPerfil"
            type="button"
            @click="$emit('update:fotoPerfil', '')"
            class="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-bold text-xs rounded-lg transition active:scale-95"
          >
            Eliminar
          </button>
        </div>
        <p
          v-if="photoError"
          class="text-[11px] text-rose-600 font-semibold mt-1"
        >
          {{ photoError }}
        </p>
        <input
          type="file"
          ref="photoFileInput"
          @change="handlePhotoUpload"
          accept="image/png, image/jpeg, image/webp"
          class="hidden"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="flex flex-col gap-1.5">
        <label
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
          for="name"
        >
          Nombre Completo
        </label>
        <input
          :value="name"
          @input="
            $emit('update:name', ($event.target as HTMLInputElement).value)
          "
          id="name"
          type="text"
          class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
        />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label
        class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
        for="bio"
      >
        Biografía Profesional
      </label>
      <textarea
        :value="bio"
        @input="$emit('update:bio', ($event.target as HTMLInputElement).value)"
        id="bio"
        rows="3"
        class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition resize-none"
        placeholder="Describe tu perfil profesional, metas e intereses..."
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useS3Upload } from "~/composables/useS3Upload";

const props = defineProps<{
  name: string;
  location: string;
  bio: string;
  fotoPerfil: string;
}>();

const emit = defineEmits<{
  (e: "update:name", value: string): void;
  (e: "update:location", value: string): void;
  (e: "update:bio", value: string): void;
  (e: "update:fotoPerfil", value: string): void;
}>();

const photoFileInput = ref<HTMLInputElement | null>(null);
const photoError = ref("");
const { isUploading: uploadingPhoto, uploadFile } = useS3Upload();

function triggerPhotoSelect() {
  photoFileInput.value?.click();
}

async function handlePhotoUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  photoError.value = "";

  if (file.size > 5 * 1024 * 1024) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const msg = `La imagen "${file.name}" (${sizeMb} MB) supera el límite máximo permitido de 5MB.`;
    photoError.value = msg;
    const { showError } = useAppFeedback();
    showError("Límite de Tamaño Excedido", msg, null);
    return;
  }

  const result = await uploadFile(file, { folder: "avatars" });
  if (result) {
    emit("update:fotoPerfil", result.url);
  } else {
    photoError.value = "Error al subir la imagen.";
  }
}
</script>
