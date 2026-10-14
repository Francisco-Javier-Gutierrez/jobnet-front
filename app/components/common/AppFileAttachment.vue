<template>
  <div
    class="flex items-center justify-between p-3 rounded-xl border flex-wrap gap-3 transition"
    :class="[
      variant === 'success'
        ? 'bg-emerald-500/10 border-emerald-500/20 shadow-sm'
        : 'bg-surface-container-lowest dark:bg-slate-900 border-outline-variant/50 hover:border-primary/40 shadow-sm',
    ]"
  >
    <div class="flex items-center gap-3 min-w-0">
      <!-- Icon Container -->
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        :class="[
          isPdf
            ? variant === 'success'
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
              : 'bg-rose-500/10 text-rose-600'
            : 'bg-primary/10 text-primary',
        ]"
      >
        <span class="material-symbols-outlined text-[24px]">
          {{ isPdf ? "picture_as_pdf" : "image" }}
        </span>
      </div>

      <!-- File Info -->
      <div class="min-w-0">
        <p
          class="text-xs font-bold truncate"
          :class="
            variant === 'success'
              ? 'text-emerald-950 dark:text-emerald-300'
              : 'text-on-background'
          "
        >
          {{ name || "Documento adjunto" }}
        </p>
        <p
          v-if="subtitle"
          class="text-[10px]"
          :class="
            variant === 'success'
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-on-surface-variant dark:text-slate-400'
          "
        >
          {{ subtitle }}
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <!-- Optional Custom View Slot or standard button -->
      <button
        v-if="showPreview"
        @click="$emit('preview')"
        type="button"
        class="font-bold px-3 py-1.5 rounded-lg text-[11px] sm:text-xs transition flex items-center gap-1 cursor-pointer"
        :class="
          variant === 'success'
            ? 'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400'
            : 'text-primary hover:bg-primary/10 hover:underline'
        "
      >
        <span class="material-symbols-outlined text-xs">visibility</span>
        <span :class="variant === 'success' ? '' : 'hidden sm:inline'">{{
          previewText
        }}</span>
      </button>

      <slot name="extra-actions"></slot>

      <button
        v-if="showRemove"
        @click="$emit('remove')"
        type="button"
        class="font-bold rounded-lg text-xs transition flex items-center gap-1 cursor-pointer"
        :class="[
          variant === 'success'
            ? 'px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400'
            : 'p-1.5 text-on-surface-variant hover:text-rose-500 hover:bg-rose-500/10',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        :disabled="disabled"
        title="Eliminar documento"
      >
        <span class="material-symbols-outlined text-sm">
          {{ variant === "success" ? "delete" : "close" }}
        </span>
        <span v-if="variant === 'success'">Eliminar</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string;
    subtitle?: string;
    type?: "pdf" | "image" | string;
    variant?: "default" | "success";
    showPreview?: boolean;
    showRemove?: boolean;
    disabled?: boolean;
    previewText?: string;
  }>(),
  {
    type: "pdf",
    variant: "default",
    showPreview: false,
    showRemove: true,
    disabled: false,
    previewText: "Ver Previa",
  },
);

const emit = defineEmits(["preview", "remove"]);

const isPdf = computed(() => {
  return props.type === "pdf" || props.name.toLowerCase().endsWith(".pdf");
});
</script>
