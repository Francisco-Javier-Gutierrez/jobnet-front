<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
  >
    <h2
      class="text-base font-bold text-on-background flex items-center gap-2 border-b border-outline-variant/40 pb-3"
    >
      <span
        class="material-symbols-outlined text-indigo-600 dark:text-indigo-400"
        >business</span
      >
      Edición de Perfil Corporativo
    </h2>

    <!-- Descripción General -->
    <div class="flex flex-col gap-1.5">
      <label
        class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
        for="descripcion"
        >Descripción General de la Empresa *</label
      >
      <textarea
        :value="descripcion"
        @input="
          $emit(
            'update:descripcion',
            ($event.target as HTMLTextAreaElement).value,
          )
        "
        id="descripcion"
        rows="4"
        placeholder="Escribe una visión global de tu organización, a qué se dedica, mercado meta e historia..."
        class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition resize-none"
      ></textarea>
    </div>

    <!-- Misión -->
    <div class="flex flex-col gap-1.5">
      <label
        class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1"
        for="mision"
      >
        <span class="material-symbols-outlined text-sm text-indigo-500"
          >flag</span
        >
        Misión Corporativa
      </label>
      <textarea
        :value="mision"
        @input="
          $emit('update:mision', ($event.target as HTMLTextAreaElement).value)
        "
        id="mision"
        rows="3"
        placeholder="Define el propósito fundamental y razón de ser de la organización..."
        class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition resize-none"
      ></textarea>
    </div>

    <!-- Visión -->
    <div class="flex flex-col gap-1.5">
      <label
        class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1"
        for="vision"
      >
        <span class="material-symbols-outlined text-sm text-purple-500"
          >visibility</span
        >
        Visión Corporativa
      </label>
      <textarea
        :value="vision"
        @input="
          $emit('update:vision', ($event.target as HTMLTextAreaElement).value)
        "
        id="vision"
        rows="3"
        placeholder="Describe las metas a futuro y hacia dónde aspira llegar la empresa..."
        class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition resize-none"
      ></textarea>
    </div>

    <!-- Beneficios o Cultura Laboral -->
    <div class="flex flex-col gap-1.5">
      <label
        class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1"
        for="beneficios"
      >
        <span class="material-symbols-outlined text-sm text-emerald-500"
          >card_giftcard</span
        >
        Beneficios y Cultura Laboral
      </label>
      <textarea
        :value="beneficios"
        @input="
          $emit(
            'update:beneficios',
            ($event.target as HTMLTextAreaElement).value,
          )
        "
        id="beneficios"
        rows="4"
        placeholder="Detalla la cultura de trabajo, horario flexible, trabajo remoto, seguro médico, bonos o capacitación contínua..."
        class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition resize-none"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  descripcion: string;
  mision: string;
  vision: string;
  beneficios: string;
}>();

const emit = defineEmits<{
  (e: "update:descripcion", value: string): void;
  (e: "update:mision", value: string): void;
  (e: "update:vision", value: string): void;
  (e: "update:beneficios", value: string): void;
}>();
</script>
