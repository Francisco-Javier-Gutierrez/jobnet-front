import { ref } from "vue";

// Global singleton state so command palette can be controlled from anywhere
const isCommandPaletteOpen = ref(false);

export function useCommandPalette() {
  const openCommandPalette = () => {
    isCommandPaletteOpen.value = true;
  };

  const closeCommandPalette = () => {
    isCommandPaletteOpen.value = false;
  };

  const toggleCommandPalette = () => {
    isCommandPaletteOpen.value = !isCommandPaletteOpen.value;
  };

  return {
    isOpen: isCommandPaletteOpen,
    openCommandPalette,
    closeCommandPalette,
    toggleCommandPalette,
  };
}
