<template>
  <div class="min-h-screen bg-background text-on-background font-sans">
    <!-- DESKTOP: Left Sidebar (only on md and up) -->
    <aside
      class="hidden md:flex fixed left-0 top-0 h-screen w-[72px] lg:w-[240px] bg-surface border-r border-outline-variant/60 flex flex-col justify-between z-50 transition-all duration-200"
      role="navigation"
      aria-label="Navegación principal"
    >
      <!-- Logo -->
      <div>
        <NuxtLink
          to="/"
          class="flex items-center justify-center w-full h-[72px] mb-2"
          aria-label="Inicio de JobNet"
        >
          <img
            src="/logo.svg"
            alt="JobNet"
            class="h-16 w-16 flex-shrink-0 filter brightness-100"
          />
        </NuxtLink>

        <!-- Nav Items -->
        <nav class="flex flex-col gap-1 px-2">
          <NuxtLink
            v-for="item in currentNavItems"
            :key="item.to"
            :to="item.to"
            :class="[
              'flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 group',
              isActiveRoute(item.to)
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60',
            ]"
            :aria-label="item.label"
          >
            <span
              class="material-symbols-outlined text-[26px] flex-shrink-0"
              :style="
                isActiveRoute(item.to)
                  ? 'font-variation-settings: \'FILL\' 1;'
                  : ''
              "
              >{{ item.icon }}</span
            >
            <span class="text-[15px] hidden lg:inline">{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Bottom Section: User Info -->
      <div class="px-2 pb-4">
        <template v-if="status === 'authenticated'">
          <NuxtLink
            to="/profile"
            class="flex items-center gap-3 px-3 py-3 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60 transition-all duration-150"
            aria-label="Tu perfil"
          >
            <div
              class="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            >
              {{
                data?.user?.name?.charAt(0)?.toUpperCase() ||
                data?.user?.email?.charAt(0)?.toUpperCase() ||
                "U"
              }}
            </div>
            <div class="hidden lg:flex flex-col overflow-hidden">
              <span class="text-sm font-medium text-on-surface truncate">{{
                data?.user?.name || "Mi Cuenta"
              }}</span>
              <span class="text-xs text-on-surface-variant/80 truncate">{{
                data?.user?.email
              }}</span>
            </div>
          </NuxtLink>
          <button
            @click="signOut()"
            class="flex items-center gap-4 px-3 py-3 rounded-xl text-on-surface-variant hover:text-rose-600 hover:bg-surface-container-high/60 transition-all duration-150 w-full"
            aria-label="Cerrar sesión"
          >
            <span class="material-symbols-outlined text-[26px] flex-shrink-0"
              >logout</span
            >
            <span class="text-[15px] hidden lg:inline">Cerrar Sesión</span>
          </button>
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="flex items-center gap-4 px-3 py-3 rounded-xl bg-primary hover:bg-primary-container text-white transition-all duration-150"
            aria-label="Iniciar sesión"
          >
            <span class="material-symbols-outlined text-[26px] flex-shrink-0"
              >login</span
            >
            <span class="text-[15px] font-medium hidden lg:inline"
              >Iniciar Sesión</span
            >
          </NuxtLink>
        </template>
      </div>
    </aside>

    <!-- MOBILE: Top Header (only on mobile) -->
    <header
      class="md:hidden fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-lg border-b border-outline-variant/60 h-16 flex items-center justify-between px-4 transition-transform duration-300 ease-in-out"
      :class="isHeaderVisible ? 'translate-y-0' : '-translate-y-full'"
      role="banner"
    >
      <!-- Search icon on Left -->
      <NuxtLink
        to="/feed"
        class="text-on-surface-variant hover:text-primary transition p-2 flex items-center justify-center flex-shrink-0"
        aria-label="Buscar vacantes"
      >
        <span class="material-symbols-outlined text-[24px]">search</span>
      </NuxtLink>

      <!-- Logo Centered -->
      <NuxtLink
        to="/"
        class="flex items-center justify-center absolute left-1/2 -translate-x-1/2"
        aria-label="Inicio de JobNet"
      >
        <img
          src="/logo.svg"
          alt="JobNet Logo"
          class="h-14 w-14 filter brightness-100"
        />
      </NuxtLink>

      <!-- Profile Pic/Link on Right -->
      <div class="flex items-center flex-shrink-0">
        <template v-if="status === 'authenticated'">
          <NuxtLink
            to="/profile"
            class="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shadow-sm hover:scale-105 transition"
            :aria-label="`Perfil de ${data?.user?.name || data?.user?.email}`"
          >
            {{
              data?.user?.name?.charAt(0)?.toUpperCase() ||
              data?.user?.email?.charAt(0)?.toUpperCase() ||
              "U"
            }}
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="text-xs bg-primary hover:bg-primary-container text-white px-3 py-1.5 rounded-lg font-medium transition"
            aria-label="Iniciar sesión"
          >
            Entrar
          </NuxtLink>
        </template>
      </div>
    </header>

    <!-- MAIN UNIFIED CONTENT SLOT -->
    <main
      class="flex-grow min-h-screen pt-16 pb-16 md:pt-0 md:pb-0 md:ml-[72px] lg:ml-[240px]"
      role="main"
    >
      <slot />
    </main>

    <!-- MOBILE: Bottom Navigation (only on mobile) -->
    <nav
      class="md:hidden fixed bottom-0 w-full z-50 bg-surface/95 backdrop-blur-lg border-t border-outline-variant/60 flex justify-around items-center h-16 px-1 pb-safe transition-transform duration-300 ease-in-out"
      :class="isFooterVisible ? 'translate-y-0' : 'translate-y-full'"
      role="navigation"
      aria-label="Navegación principal móvil"
    >
      <!-- 1. Inicio -->
      <NuxtLink
        to="/"
        :class="[
          'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-150',
          isActiveRoute('/')
            ? 'text-primary font-semibold'
            : 'text-on-surface-variant hover:text-primary',
        ]"
        aria-label="Inicio"
      >
        <span
          class="material-symbols-outlined text-[24px]"
          :style="
            isActiveRoute('/') ? 'font-variation-settings: \'FILL\' 1;' : ''
          "
          >home</span
        >
        <span class="text-[10px] font-medium leading-tight">Inicio</span>
      </NuxtLink>

      <!-- 2. Vacantes -->
      <NuxtLink
        to="/feed"
        :class="[
          'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-150',
          isActiveRoute('/feed') || isActiveRoute('/jobs')
            ? 'text-primary font-semibold'
            : 'text-on-surface-variant hover:text-primary',
        ]"
        aria-label="Vacantes"
      >
        <span
          class="material-symbols-outlined text-[24px]"
          :style="
            isActiveRoute('/feed') || isActiveRoute('/jobs')
              ? 'font-variation-settings: \'FILL\' 1;'
              : ''
          "
          >work</span
        >
        <span class="text-[10px] font-medium leading-tight">Vacantes</span>
      </NuxtLink>

      <!-- 3. Crear Nuevo (+) -->
      <button
        @click="handleCreateClick"
        class="flex flex-col items-center justify-center flex-1 h-full text-on-surface-variant hover:text-primary transition-all duration-150"
        aria-label="Crear Nuevo"
      >
        <div
          class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 active:scale-95 transition transform duration-100"
        >
          <span class="material-symbols-outlined text-[24px]">add</span>
        </div>
      </button>

      <!-- 4. Mensajes -->
      <NuxtLink
        to="/messages"
        :class="[
          'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-150',
          isActiveRoute('/messages')
            ? 'text-primary font-semibold'
            : 'text-on-surface-variant hover:text-primary',
        ]"
        aria-label="Mensajes"
      >
        <span
          class="material-symbols-outlined text-[24px]"
          :style="
            isActiveRoute('/messages')
              ? 'font-variation-settings: \'FILL\' 1;'
              : ''
          "
          >forum</span
        >
        <span class="text-[10px] font-medium leading-tight">Mensajes</span>
      </NuxtLink>

      <!-- 5. Notificaciones -->
      <NuxtLink
        to="/notifications"
        :class="[
          'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-150',
          isActiveRoute('/notifications')
            ? 'text-primary font-semibold'
            : 'text-on-surface-variant hover:text-primary',
        ]"
        aria-label="Notificaciones"
      >
        <span
          class="material-symbols-outlined text-[24px]"
          :style="
            isActiveRoute('/notifications')
              ? 'font-variation-settings: \'FILL\' 1;'
              : ''
          "
          >notifications</span
        >
        <span class="text-[10px] font-medium leading-tight"
          >Notificaciones</span
        >
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const { status, data, signOut } = useAuth();

// Scroll tracking for hide/show nav bars on mobile
const isHeaderVisible = ref(true);
const isFooterVisible = ref(true);
let lastScrollY = 0;

const handleScroll = () => {
  if (process.client) {
    const currentScrollY = window.scrollY;

    // Always visible at the top of the page
    if (currentScrollY <= 20) {
      isHeaderVisible.value = true;
      isFooterVisible.value = true;
    } else {
      if (currentScrollY > lastScrollY) {
        // Scrolling down -> Hide top header, keep bottom footer visible
        isHeaderVisible.value = false;
        isFooterVisible.value = true;
      } else {
        // Scrolling up -> Show top header, hide bottom footer
        isHeaderVisible.value = true;
        isFooterVisible.value = false;
      }
    }
    lastScrollY = currentScrollY;
  }
};

onMounted(() => {
  if (process.client) {
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initialize states to make sure they are visible on page load
    isHeaderVisible.value = true;
    isFooterVisible.value = true;
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener("scroll", handleScroll);
  }
});

// Determine user role from session
const userRole = computed<string>(() => {
  if (status.value !== "authenticated") return "guest";
  const tipo = (data.value?.user as any)?.tipoUsuario;
  if (!tipo) return "guest";
  switch (tipo.toUpperCase()) {
    case "EMPRESA":
      return "company";
    case "ADMIN":
      return "admin";
    case "MODERATOR":
      return "moderator";
    default:
      return "candidate";
  }
});

interface NavItem {
  to: string;
  icon: string;
  label: string;
  shortLabel?: string;
}

// ─── Navigation by Role ────────────────────────────────

const guestNav: NavItem[] = [
  { to: "/", icon: "home", label: "Inicio", shortLabel: "Inicio" },
  {
    to: "/feed",
    icon: "work",
    label: "Explorar Vacantes",
    shortLabel: "Vacantes",
  },
  {
    to: "/create",
    icon: "add_circle",
    label: "Crear Nuevo",
    shortLabel: "Crear",
  },
];

const candidateNav: NavItem[] = [
  { to: "/", icon: "home", label: "Inicio", shortLabel: "Inicio" },
  {
    to: "/feed",
    icon: "work",
    label: "Explorar Vacantes",
    shortLabel: "Vacantes",
  },
  {
    to: "/create",
    icon: "add_circle",
    label: "Crear Nuevo",
    shortLabel: "Crear",
  },
  {
    to: "/messages",
    icon: "forum",
    label: "Mensajes",
    shortLabel: "Mensajes",
  },
  {
    to: "/profile",
    icon: "account_circle",
    label: "Mi Perfil",
    shortLabel: "Perfil",
  },
  {
    to: "/settings",
    icon: "settings",
    label: "Configuración",
    shortLabel: "Ajustes",
  },
];

const companyNav: NavItem[] = [
  {
    to: "/dashboard",
    icon: "dashboard",
    label: "Tablero",
    shortLabel: "Tablero",
  },
  {
    to: "/my-vacancies",
    icon: "work",
    label: "Mis Vacantes",
    shortLabel: "Vacantes",
  },
  {
    to: "/applicants",
    icon: "group",
    label: "Candidatos (ATS)",
    shortLabel: "ATS",
  },
  {
    to: "/create",
    icon: "add_circle",
    label: "Crear Nuevo",
    shortLabel: "Crear",
  },
  {
    to: "/company/edit",
    icon: "verified",
    label: "Identidad y Verificación",
    shortLabel: "Identidad",
  },
];

const moderatorNav: NavItem[] = [
  {
    to: "/mod/incidents",
    icon: "flag",
    label: "Incidencias",
    shortLabel: "Incidencias",
  },
  {
    to: "/mod/verifications",
    icon: "shield",
    label: "Verificaciones",
    shortLabel: "Verificar",
  },
  {
    to: "/create",
    icon: "add_circle",
    label: "Crear Nuevo",
    shortLabel: "Crear",
  },
  {
    to: "/mod/skills",
    icon: "label",
    label: "Habilidades",
    shortLabel: "Skills",
  },
  {
    to: "/mod/support",
    icon: "support",
    label: "Soporte Directo",
    shortLabel: "Soporte",
  },
];

const adminNav: NavItem[] = [
  {
    to: "/admin/organizations",
    icon: "account_balance",
    label: "Organizaciones",
    shortLabel: "Orgs",
  },
  {
    to: "/admin/catalog",
    icon: "layers",
    label: "Catálogo Maestro",
    shortLabel: "Catálogo",
  },
  {
    to: "/create",
    icon: "add_circle",
    label: "Crear Nuevo",
    shortLabel: "Crear",
  },
  {
    to: "/admin/fraud",
    icon: "find_in_page",
    label: "Reportes de Fraude",
    shortLabel: "Fraude",
  },
  {
    to: "/admin/analytics",
    icon: "bar_chart",
    label: "Analítica",
    shortLabel: "Analítica",
  },
];

// Computed: Full sidebar nav items for current role
const currentNavItems = computed<NavItem[]>(() => {
  switch (userRole.value) {
    case "candidate":
      return candidateNav;
    case "company":
      return companyNav;
    case "admin":
      return adminNav;
    case "moderator":
      return moderatorNav;
    default:
      return guestNav;
  }
});

// Handle mobile plus button dynamic click action
const handleCreateClick = () => {
  router.push("/create");
};

// Route matching helper
const isActiveRoute = (path: string): boolean => {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};
</script>

<style scoped>
.font-fill-1 {
  font-variation-settings: "FILL" 1;
}
</style>
