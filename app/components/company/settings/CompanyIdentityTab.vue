<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
  >
    <h2
      class="text-base font-bold text-on-background flex items-center gap-2 border-b border-outline-variant/40 pb-3"
    >
      <span class="material-symbols-outlined text-primary">palette</span>
      Identidad Visual Corporativa
    </h2>

    <!-- Logo Upload Control -->
    <div
      class="flex items-center gap-5 p-5 bg-surface-container-low/40 rounded-2xl border border-outline-variant/40"
    >
      <div
        class="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-outline-variant/80 shadow-md flex items-center justify-center relative group cursor-pointer flex-shrink-0 p-1.5"
        @click="triggerLogoSelect"
      >
        <img
          alt="Logo Corporativo"
          class="w-full h-full object-contain rounded-xl"
          :src="
            fotoPerfil ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBv7ieXvxtMvK4Bf5kvEuqFTPF59k2wFj0FOiA-v1xXN5VHCH9_ZcdYzKj6xGbyBIeLHVW5FuXPuhZ8ghouEp8A22nMpZV0iW6Zvg_YQ0avpohEqle9p-AR9bgPXdnJadM20BCP6_nuDkNCMnR9ywHb5fxRNfK1sAIL6bXl7qjeDQaRa5J--hkEcazv-m8Brqe_BbKSdIGlVhXvuRzLzSM3HSd57GyjW2Ueeh0XvBP7u4bT3o0EWgnO0Q'
          "
        />
        <div
          class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
        >
          <span class="material-symbols-outlined text-white text-xl"
            >add_a_photo</span
          >
        </div>
      </div>

      <div class="flex flex-col gap-1 min-w-0">
        <p class="text-xs font-bold text-on-background">Logotipo Corporativo</p>
        <p class="text-[11px] text-on-surface-variant dark:text-slate-300">
          Formatos soportados: PNG, JPG, WEBP, SVG (Máximo 5MB).
        </p>
        <div class="flex items-center gap-2 mt-1">
          <button
            type="button"
            @click="triggerLogoSelect"
            :disabled="uploadingLogo"
            class="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-xl transition disabled:opacity-50 flex items-center gap-1 active:scale-95"
          >
            <span
              v-if="uploadingLogo"
              class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
              aria-hidden="true"
            ></span>
            <span>{{
              uploadingLogo ? "Subiendo..." : "Subir Nuevo Logotipo"
            }}</span>
          </button>
        </div>
        <input
          type="file"
          ref="logoFileInput"
          @change="handleLogoUpload"
          accept="image/*"
          class="hidden"
        />
      </div>
    </div>

    <!-- Nombre Comercial -->
    <div class="flex flex-col gap-1.5">
      <label
        class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
        for="nombre-comercial"
        >Nombre Comercial de la Organización *</label
      >
      <input
        :value="nombreComercial"
        @input="
          $emit(
            'update:nombreComercial',
            ($event.target as HTMLInputElement).value,
          )
        "
        id="nombre-comercial"
        type="text"
        placeholder="Ej: TechSolutions Internacional"
        class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition"
      />
    </div>

    <!-- Sector Económico -->
    <div>
      <AppSelect
        :modelValue="sector"
        @update:modelValue="(val: string) => $emit('update:sector', val)"
        label="Sector Económico Principal"
        :options="[
          {
            value: 'Tecnología y Software',
            label: 'Tecnología y Software',
            icon: 'computer',
          },
          {
            value: 'Recursos Humanos',
            label: 'Recursos Humanos y Reclutamiento',
            icon: 'groups',
          },
          {
            value: 'Finanzas y Banca',
            label: 'Finanzas y Banca',
            icon: 'account_balance',
          },
          {
            value: 'Salud y Farmacéutica',
            label: 'Salud y Farmacéutica',
            icon: 'local_hospital',
          },
          {
            value: 'Educación e Investigación',
            label: 'Educación e Investigación',
            icon: 'school',
          },
          {
            value: 'Manufactura e Industria',
            label: 'Manufactura e Industria',
            icon: 'precision_manufacturing',
          },
          {
            value: 'Comercio Electrónico y Retail',
            label: 'Comercio Electrónico y Retail',
            icon: 'shopping_cart',
          },
          { value: 'Otro', label: 'Otro Sector', icon: 'business' },
        ]"
      />
    </div>

    <!-- Ubicación en Mapa -->
    <div class="mt-2">
      <AppLocationMap
        :lat="latitude"
        :lng="longitude"
        @update:lat="(val: number) => $emit('update:latitude', val)"
        @update:lng="(val: number) => $emit('update:longitude', val)"
        @locationName="(name: string) => $emit('update:locationName', name)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUploadStore } from "~/stores/upload";
import { useAppFeedback } from "~/composables/useAppFeedback";

const props = defineProps<{
  companyId: string;
  fotoPerfil: string;
  nombreComercial: string;
  sector: string;
  latitude: number;
  longitude: number;
  locationName: string;
}>();

const emit = defineEmits<{
  (e: "update:fotoPerfil", value: string): void;
  (e: "update:nombreComercial", value: string): void;
  (e: "update:sector", value: string): void;
  (e: "update:latitude", value: number): void;
  (e: "update:longitude", value: number): void;
  (e: "update:locationName", value: string): void;
}>();

const uploadStore = useUploadStore();
const { showSuccess, showError } = useAppFeedback();

const logoFileInput = ref<HTMLInputElement | null>(null);
const uploadingLogo = ref(false);

const triggerLogoSelect = () => {
  logoFileInput.value?.click();
};

const handleLogoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showError(
      "Límite de Tamaño Excedido",
      "El logotipo no debe superar el límite máximo permitido de 5MB.",
      null,
    );
    return;
  }

  uploadingLogo.value = true;
  const result = await uploadStore.uploadFile(file, "logos", props.companyId);

  if (result.success && result.url) {
    emit("update:fotoPerfil", result.url);
    showSuccess("Logotipo Subido", "¡Logotipo subido exitosamente!", 3000);
  } else {
    showError(
      "Error de Carga",
      result.error || "Error al subir el logotipo corporativo.",
      null,
    );
  }
  uploadingLogo.value = false;
};
</script>
