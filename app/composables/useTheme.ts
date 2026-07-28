export type ThemeMode = "light" | "dark" | "system";

const currentTheme = ref<ThemeMode>("system");
const isDark = ref<boolean>(false);
let initialized = false;

export function useTheme() {
  const applyTheme = (mode: ThemeMode) => {
    if (import.meta.server) return;

    let targetIsDark = false;
    if (mode === "system") {
      targetIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      targetIsDark = mode === "dark";
    }

    isDark.value = targetIsDark;
    const root = document.documentElement;

    if (targetIsDark) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  };

  const setTheme = (mode: ThemeMode) => {
    currentTheme.value = mode;
    if (import.meta.client) {
      localStorage.setItem("jobnet-theme", mode);
      applyTheme(mode);
    }
  };

  const toggleTheme = () => {
    if (isDark.value) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const initTheme = () => {
    if (import.meta.server || initialized) return;
    initialized = true;

    const saved = localStorage.getItem("jobnet-theme") as ThemeMode | null;
    const mode =
      saved && ["light", "dark", "system"].includes(saved) ? saved : "system";
    currentTheme.value = mode;
    applyTheme(mode);

    // Listen to system OS preference changes when in 'system' mode
    try {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        if (currentTheme.value === "system") {
          applyTheme("system");
        }
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
      } else {
        mediaQuery.addListener(handleChange);
      }
    } catch (e) {
      // System media query fallback
    }
  };

  return {
    theme: currentTheme,
    isDark,
    setTheme,
    toggleTheme,
    initTheme,
  };
}
