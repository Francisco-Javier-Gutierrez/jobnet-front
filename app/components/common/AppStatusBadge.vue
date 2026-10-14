<template>
  <span
    :class="[
      badgeClasses,
      sizeClasses,
      'inline-flex items-center gap-1.5 font-semibold rounded-full border transition-colors',
    ]"
  >
    <span v-if="dot" :class="[dotClasses, 'w-1.5 h-1.5 rounded-full']"></span>
    <span v-if="icon" class="material-symbols-outlined text-xs leading-none">{{
      icon
    }}</span>
    <span>{{ labelText }}</span>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    status: string;
    label?: string;
    size?: "sm" | "md" | "lg";
    dot?: boolean;
    icon?: string;
    customClasses?: string;
  }>(),
  {
    size: "sm",
    dot: true,
  },
);

const statusNormalized = computed(() =>
  (props.status || "").toUpperCase().trim(),
);

const labelText = computed(() => {
  if (props.label) return props.label;
  switch (statusNormalized.value) {
    case "PENDIENTE":
      return "Pendiente";
    case "EN_REVISION":
      return "En Revisión";
    case "ENTREVISTA":
      return "En Entrevista";
    case "ACEPTADO":
    case "SELECCIONADO":
      return "Aceptado";
    case "RECHAZADO":
      return "Rechazado";
    case "ACTIVA":
    case "VERIFICADA":
    case "PUBLICADA":
      return "Activa";
    case "SUSPENDIDA":
      return "Suspendida";
    case "CERRADA":
    case "FINALIZADA":
      return "Cerrada";
    case "EN_PAUSA":
      return "En Pausa";
    default:
      return props.status;
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-2.5 py-0.5 text-xs";
    case "md":
      return "px-3 py-1 text-xs";
    case "lg":
      return "px-3.5 py-1.5 text-sm";
    default:
      return "px-2.5 py-0.5 text-xs";
  }
});

const config = computed(() => {
  if (props.customClasses) {
    return {
      badge: props.customClasses,
      dot: "bg-current",
    };
  }

  switch (statusNormalized.value) {
    case "ACEPTADO":
    case "SELECCIONADO":
    case "ACTIVA":
    case "VERIFICADA":
    case "PUBLICADA":
    case "EXITOSO":
      return {
        badge:
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        dot: "bg-emerald-500",
      };

    case "PENDIENTE":
    case "EN_REVISION":
    case "EN_PAUSA":
      return {
        badge:
          "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        dot: "bg-amber-500",
      };

    case "ENTREVISTA":
    case "INFO":
      return {
        badge: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
        dot: "bg-sky-500",
      };

    case "RECHAZADO":
    case "SUSPENDIDA":
    case "CERRADA":
    case "FINALIZADA":
    case "ERROR":
      return {
        badge:
          "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
        dot: "bg-rose-500",
      };

    default:
      return {
        badge:
          "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
        dot: "bg-slate-500",
      };
  }
});

const badgeClasses = computed(() => config.value.badge);
const dotClasses = computed(() => config.value.dot);
</script>
