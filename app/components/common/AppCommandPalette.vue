<template>
  <div v-if="isOpen" class="fixed inset-0 z-[99900] flex items-start justify-center pt-14 sm:pt-20 px-4 bg-slate-950/60 backdrop-blur-md" @click.self="closeCommandPalette" data-modal-active="true">
    <div
      class="w-full max-w-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Paleta de Comandos de JobNet"
    >
      <!-- Top Search Header -->
      <div class="p-3.5 border-b border-outline-variant/50 dark:border-slate-800 flex items-center gap-3 bg-surface-container-low/40 dark:bg-slate-900/60">
        <span class="material-symbols-outlined text-primary text-2xl flex-shrink-0 animate-pulse">
          search
        </span>
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Escribe un comando o busca vacantes, plantillas y páginas..."
          class="flex-1 bg-transparent text-sm sm:text-base text-on-surface dark:text-slate-100 placeholder-on-surface-variant/60 dark:placeholder-slate-500 outline-none font-medium"
          @keydown.down.prevent="navigateDown"
          @keydown.up.prevent="navigateUp"
          @keydown.enter.prevent="executeActiveItem"
          @keydown.esc.prevent="closeCommandPalette"
        />
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="text-on-surface-variant dark:text-slate-400 hover:text-on-surface p-1 rounded-md transition"
            title="Limpiar búsqueda"
          >
            <span class="material-symbols-outlined text-base">close</span>
          </button>
          <kbd class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-surface-container dark:bg-slate-800 border border-outline-variant/60 dark:border-slate-700 text-on-surface-variant dark:text-slate-400 rounded-md shadow-2xs">
            ESC
          </kbd>
        </div>
      </div>

      <!-- Results Body -->
      <div ref="resultsContainerRef" class="flex-1 overflow-y-auto p-2 space-y-4 min-h-[160px] max-h-[55vh]">
        <!-- Empty Results -->
        <div v-if="filteredItems.length === 0" class="py-12 text-center space-y-2">
          <span class="material-symbols-outlined text-4xl text-on-surface-variant/60 dark:text-slate-500">search_off</span>
          <p class="text-sm font-bold text-on-surface dark:text-slate-200">No se encontraron resultados</p>
          <p class="text-xs text-on-surface-variant dark:text-slate-400 max-w-sm mx-auto">
            Prueba buscando con otros términos como "vacantes", "cv", "remoto", "perfil" o "tema".
          </p>
        </div>

        <!-- Grouped List -->
        <div v-for="group in groupedItems" :key="group.title" class="space-y-1">
          <div class="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 dark:text-slate-400 flex items-center justify-between">
            <span>{{ group.title }}</span>
            <span class="text-[10px] font-mono opacity-80">{{ group.items.length }}</span>
          </div>

          <button
            v-for="item in group.items"
            :key="item.id"
            type="button"
            :data-item-index="item.flatIndex"
            @click="executeItem(item)"
            @mouseenter="activeIndex = item.flatIndex"
            class="w-full text-left px-3 py-2.5 rounded-xl transition flex items-center justify-between gap-3 text-xs cursor-pointer group"
            :class="[
              activeIndex === item.flatIndex
                ? 'bg-primary/10 text-primary dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold shadow-xs ring-1 ring-primary/20'
                : 'text-on-surface dark:text-slate-200 hover:bg-surface-container/60 dark:hover:bg-slate-800/60'
            ]"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span
                class="material-symbols-outlined text-[20px] flex-shrink-0 transition-transform group-hover:scale-110"
                :class="activeIndex === item.flatIndex ? 'text-primary dark:text-indigo-400' : 'text-on-surface-variant dark:text-slate-400'"
              >
                {{ item.icon }}
              </span>
              <div class="min-w-0">
                <p class="truncate font-semibold">{{ item.title }}</p>
                <p v-if="item.subtitle" class="text-[10px] text-on-surface-variant dark:text-slate-400 truncate font-normal">
                  {{ item.subtitle }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <span
                v-if="item.badge"
                class="text-[9px] font-bold px-2 py-0.5 rounded-full border transition"
                :class="getBadgeClasses(item.badgeVariant)"
              >
                {{ item.badge }}
              </span>
              <span
                v-if="activeIndex === item.flatIndex"
                class="material-symbols-outlined text-[16px] text-primary dark:text-indigo-400 opacity-90"
              >
                keyboard_return
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Bottom Keyboard Navigation Tips -->
      <div class="p-2.5 px-4 bg-surface-container-low/50 dark:bg-slate-900/80 border-t border-outline-variant/40 dark:border-slate-800 flex items-center justify-between text-[11px] text-on-surface-variant dark:text-slate-400">
        <div class="flex items-center gap-4 flex-wrap">
          <span class="flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 font-mono text-[9px] bg-surface dark:bg-slate-800 border border-outline-variant/60 dark:border-slate-700 rounded shadow-2xs">↑</kbd>
            <kbd class="px-1.5 py-0.5 font-mono text-[9px] bg-surface dark:bg-slate-800 border border-outline-variant/60 dark:border-slate-700 rounded shadow-2xs">↓</kbd>
            Navegar
          </span>
          <span class="flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 font-mono text-[9px] bg-surface dark:bg-slate-800 border border-outline-variant/60 dark:border-slate-700 rounded shadow-2xs">↵</kbd>
            Ejecutar
          </span>
          <span class="flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 font-mono text-[9px] bg-surface dark:bg-slate-800 border border-outline-variant/60 dark:border-slate-700 rounded shadow-2xs">Esc</kbd>
            Cerrar
          </span>
        </div>
        <div class="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-primary dark:text-indigo-400">
          <span>JobNet Omnibox</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useCommandPalette } from "~/composables/useCommandPalette";
import { useTheme } from "~/composables/useTheme";
import { useJobsStore } from "~/stores/jobs";
import { useCommunityCvTemplates } from "~/composables/useCommunityCvTemplates";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  group: "Acciones Rápidas" | "Navegación" | "Vacantes" | "Plantillas de CV";
  badge?: string;
  badgeVariant?: "primary" | "secondary" | "accent" | "neutral";
  keywords?: string[];
  action: () => void;
  flatIndex?: number;
}

const { isOpen, closeCommandPalette } = useCommandPalette();
const router = useRouter();
const { toggleTheme, isDark } = useTheme();
const { data: session, signOut } = useAuth();
const jobsStore = useJobsStore();
const { filteredTemplates: communityTemplates, fetchTemplates } = useCommunityCvTemplates();

const searchQuery = ref("");
const activeIndex = ref(0);
const searchInputRef = ref<HTMLInputElement | null>(null);
const resultsContainerRef = ref<HTMLElement | null>(null);

const currentRole = computed(() => {
  return (
    (session.value?.user as any)?.role ||
    (session.value?.user as any)?.tipoUsuario ||
    "CANDIDATO"
  ).toUpperCase();
});

const profileRoute = computed(() => {
  const user = session.value?.user as any;
  if (!user) return "/login";
  if (currentRole.value === "ORGANIZATION" || currentRole.value === "EMPRESA") {
    return "/company/profile";
  }
  return `/candidate/${user.id || user.uuid || "me"}`;
});

// Standard static commands and navigation links
const staticItems = computed<CommandItem[]>(() => {
  const items: CommandItem[] = [
    // Acciones
    {
      id: "action-toggle-theme",
      title: isDark.value ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro",
      subtitle: "Alternar la apariencia visual entre claro y oscuro",
      icon: isDark.value ? "light_mode" : "dark_mode",
      group: "Acciones Rápidas",
      badge: "Tema",
      badgeVariant: "accent",
      keywords: ["tema", "oscuro", "claro", "dark", "light", "modo", "color"],
      action: () => toggleTheme(),
    },
    {
      id: "action-cv-templates",
      title: "Explorar Comunidad de Plantillas CV",
      subtitle: "Ver plantillas validadas por profesionales y ATS",
      icon: "auto_stories",
      group: "Acciones Rápidas",
      badge: "Comunidad",
      badgeVariant: "primary",
      keywords: ["cv", "curriculum", "plantillas", "templates", "ats", "habilidades", "rol"],
      action: () => router.push("/candidate/cv-templates"),
    },
    {
      id: "action-map",
      title: "Abrir Mapa Interactivo de Empleos",
      subtitle: "Explorar vacantes geolocalizadas en el Estado de México",
      icon: "map",
      group: "Acciones Rápidas",
      badge: "Edoméx",
      badgeVariant: "secondary",
      keywords: ["mapa", "geolocalizacion", "edomex", "ubicacion", "distancia", "gps", "toluca"],
      action: () => router.push("/map"),
    },
    // Navegación principal
    {
      id: "nav-vacancies",
      title: "Explorar Vacantes",
      subtitle: "Buscar empleos, filtrar por modalidad y salario",
      icon: "work",
      group: "Navegación",
      badge: "Empleos",
      badgeVariant: "neutral",
      keywords: ["vacantes", "empleos", "trabajo", "jobs", "remoto", "hibrido", "ofertas"],
      action: () => router.push("/vacancies"),
    },
    {
      id: "nav-profile",
      title: "Mi Perfil Profesional",
      subtitle: "Ver y actualizar tus datos, experiencia y habilidades",
      icon: "account_circle",
      group: "Navegación",
      badge: "Perfil",
      badgeVariant: "neutral",
      keywords: ["perfil", "cuenta", "usuario", "cv", "habilidades", "experiencia"],
      action: () => router.push(profileRoute.value),
    },
    {
      id: "nav-messages",
      title: "Mensajes y Chat",
      subtitle: "Bandeja de entrada y conversaciones con empresas",
      icon: "chat",
      group: "Navegación",
      badge: "Chat",
      badgeVariant: "neutral",
      keywords: ["mensajes", "chat", "inbox", "conversaciones", "contacto"],
      action: () => router.push("/messages"),
    },
    {
      id: "nav-saved",
      title: "Vacantes Guardadas",
      subtitle: "Tus ofertas y publicaciones en marcadores",
      icon: "bookmark",
      group: "Navegación",
      badge: "Guardados",
      badgeVariant: "neutral",
      keywords: ["guardados", "favoritos", "bookmarks", "marcadores"],
      action: () => router.push("/saved"),
    },
  ];

  // Specific role actions
  if (currentRole.value === "ORGANIZATION" || currentRole.value === "EMPRESA" || currentRole.value === "ADMIN") {
    items.unshift({
      id: "action-create-vacancy",
      title: "Publicar Nueva Oferta de Empleo",
      subtitle: "Crear una vacante con geolocalización y requisitos",
      icon: "add_circle",
      group: "Acciones Rápidas",
      badge: "Empresa",
      badgeVariant: "primary",
      keywords: ["crear", "publicar", "nueva", "vacante", "oferta", "reclutar"],
      action: () => router.push("/create-vacancy"),
    });
  }

  if (session.value?.user) {
    items.push({
      id: "action-logout",
      title: "Cerrar Sesión",
      subtitle: `Salir de la cuenta de ${session.value.user.name || "JobNet"}`,
      icon: "logout",
      group: "Acciones Rápidas",
      badge: "Sesión",
      badgeVariant: "neutral",
      keywords: ["salir", "cerrar", "logout", "desconectar", "exit"],
      action: () => signOut({ callbackUrl: "/login" }),
    });
  }

  return items;
});

// Filtered and Search Results
const filteredItems = computed<CommandItem[]>(() => {
  const query = searchQuery.value.toLowerCase().trim();

  // If query is empty, return static actions and navigation
  if (!query) {
    return staticItems.value;
  }

  // 1. Filter static items
  const matchingStatic = staticItems.value.filter((item) => {
    const inTitle = item.title.toLowerCase().includes(query);
    const inSubtitle = (item.subtitle || "").toLowerCase().includes(query);
    const inKeywords = (item.keywords || []).some((kw) => kw.toLowerCase().includes(query));
    return inTitle || inSubtitle || inKeywords;
  });

  // 2. Dynamic Vacancies matches
  const matchingJobs: CommandItem[] = (jobsStore.jobs || [])
    .filter((job) => {
      const inTitle = (job.title || "").toLowerCase().includes(query);
      const inCompany = (job.company || "").toLowerCase().includes(query);
      const inDesc = (job.descripcion || "").toLowerCase().includes(query);
      const inSkills = (job.habilidadesRequeridas || []).some((s) => s.toLowerCase().includes(query));
      return inTitle || inCompany || inDesc || inSkills;
    })
    .slice(0, 5)
    .map((job) => ({
      id: `job-${job.id || (job as any).uniqueId}`,
      title: job.title || "Vacante",
      subtitle: `${job.company || "Empresa"} · ${job.modalidad || "Modalidad"}`,
      icon: "work_outline",
      group: "Vacantes",
      badge: job.modalidad || "Vacante",
      badgeVariant: "primary",
      action: () => router.push(`/vacancies`),
    }));

  // 3. Dynamic CV Templates matches
  const matchingTemplates: CommandItem[] = (communityTemplates.value || [])
    .filter((tpl) => {
      const inTitle = (tpl.titulo || "").toLowerCase().includes(query);
      const inRole = (tpl.rol || "").toLowerCase().includes(query);
      const inSkills = (tpl.habilidadesClave || []).some((s) => s.toLowerCase().includes(query));
      const inTags = (tpl.tags || []).some((t) => t.toLowerCase().includes(query));
      return inTitle || inRole || inSkills || inTags;
    })
    .slice(0, 5)
    .map((tpl) => ({
      id: `tpl-${tpl.id}`,
      title: tpl.titulo,
      subtitle: `${tpl.rol} · Nivel ${tpl.nivel.toUpperCase()}`,
      icon: "description",
      group: "Plantillas de CV",
      badge: tpl.idioma === "en" ? "EN" : tpl.idioma === "bilingual" ? "Bilingüe" : "ES",
      badgeVariant: "secondary",
      action: () => router.push("/candidate/cv-templates"),
    }));

  return [...matchingStatic, ...matchingJobs, ...matchingTemplates];
});

// Group items for display
const groupedItems = computed(() => {
  const groups: { title: string; items: CommandItem[] }[] = [];
  const groupOrder: CommandItem["group"][] = [
    "Acciones Rápidas",
    "Navegación",
    "Vacantes",
    "Plantillas de CV",
  ];

  let currentFlatIndex = 0;
  const itemsWithIndex = filteredItems.value.map((item) => {
    return { ...item, flatIndex: currentFlatIndex++ };
  });

  for (const groupName of groupOrder) {
    const inGroup = itemsWithIndex.filter((item) => item.group === groupName);
    if (inGroup.length > 0) {
      groups.push({
        title: groupName,
        items: inGroup,
      });
    }
  }

  return groups;
});

// Badge styling helper
const getBadgeClasses = (variant?: CommandItem["badgeVariant"]) => {
  switch (variant) {
    case "primary":
      return "bg-primary/10 text-primary border-primary/20 dark:bg-indigo-950/60 dark:text-indigo-400";
    case "secondary":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";
    case "accent":
      return "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400";
    case "neutral":
    default:
      return "bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-slate-400 border-outline-variant/40";
  }
};

// Keyboard navigation handlers
const navigateDown = () => {
  if (filteredItems.value.length === 0) return;
  if (activeIndex.value < filteredItems.value.length - 1) {
    activeIndex.value++;
    scrollToActive();
  } else {
    activeIndex.value = 0;
    scrollToActive();
  }
};

const navigateUp = () => {
  if (filteredItems.value.length === 0) return;
  if (activeIndex.value > 0) {
    activeIndex.value--;
    scrollToActive();
  } else {
    activeIndex.value = filteredItems.value.length - 1;
    scrollToActive();
  }
};

const executeActiveItem = () => {
  const item = filteredItems.value[activeIndex.value];
  if (item) {
    executeItem(item);
  }
};

const executeItem = (item: CommandItem) => {
  closeCommandPalette();
  searchQuery.value = "";
  item.action();
};

const scrollToActive = () => {
  nextTick(() => {
    const el = resultsContainerRef.value?.querySelector(
      `[data-item-index="${activeIndex.value}"]`
    );
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  });
};

// Reset active index when query changes
watch(searchQuery, () => {
  activeIndex.value = 0;
});

// Watch open state to focus input and fetch background data if needed
watch(isOpen, async (opened) => {
  if (opened) {
    activeIndex.value = 0;
    searchQuery.value = "";
    if (jobsStore.jobs.length === 0) {
      jobsStore.fetchJobs();
    }
    fetchTemplates();
    await nextTick();
    searchInputRef.value?.focus();
  }
});

// Global keyboard shortcut listener (Cmd+K / Ctrl+K and Escape)
const handleGlobalKeyDown = (e: KeyboardEvent) => {
  // Allow Ctrl+K or Cmd+K from anywhere
  if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
    e.preventDefault();
    if (isOpen.value) {
      closeCommandPalette();
    } else {
      useCommandPalette().openCommandPalette();
    }
    return;
  }

  // Escape to close if open
  if (e.key === "Escape" && isOpen.value) {
    e.preventDefault();
    closeCommandPalette();
  }
};

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("keydown", handleGlobalKeyDown);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("keydown", handleGlobalKeyDown);
  }
});
</script>
