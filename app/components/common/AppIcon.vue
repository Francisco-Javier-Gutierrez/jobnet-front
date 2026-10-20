<template>
  <span
    class="material-symbols-outlined select-none inline-block align-middle"
    :class="[
      fill ? 'font-fill-1' : '',
      sizeClass,
    ]"
    :style="customStyle"
    :role="ariaLabel ? 'img' : undefined"
    :aria-label="ariaLabel"
    :aria-hidden="ariaLabel ? undefined : 'true'"
  >
    {{ iconName }}
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    name?: string;
    icon?: string;
    size?: string | number;
    fill?: boolean;
    weight?: number;
    grade?: number;
    opticalSize?: number;
    color?: string;
    ariaLabel?: string;
  }>(),
  {
    name: "",
    icon: "",
    fill: false,
  }
);

const iconName = computed(() => props.name || props.icon || "");

const sizeClass = computed(() => {
  if (typeof props.size === "string") {
    switch (props.size) {
      case "xs":
        return "text-[14px]";
      case "sm":
        return "text-[18px]";
      case "base":
      case "md":
        return "text-[20px]";
      case "lg":
        return "text-[24px]";
      case "xl":
        return "text-[28px]";
      case "2xl":
        return "text-[32px]";
      case "3xl":
        return "text-[40px]";
      default:
        // if user passed custom tailwind or raw px
        return "";
    }
  }
  return "";
});

const customStyle = computed(() => {
  const styles: Record<string, string> = {};

  if (typeof props.size === "number") {
    styles.fontSize = `${props.size}px`;
  } else if (props.size && !sizeClass.value) {
    styles.fontSize = props.size;
  }

  if (props.color) {
    styles.color = props.color;
  }

  if (props.weight !== undefined || props.grade !== undefined || props.opticalSize !== undefined) {
    const f = props.fill ? 1 : 0;
    const w = props.weight ?? 400;
    const g = props.grade ?? 0;
    const o = props.opticalSize ?? 24;
    styles.fontVariationSettings = `'FILL' ${f}, 'wght' ${w}, 'GRAD' ${g}, 'opsz' ${o}`;
  }

  return styles;
});
</script>
