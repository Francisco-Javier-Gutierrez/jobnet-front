<template>
  <div class="min-h-screen bg-background text-on-background font-sans">
    <!-- ═══════════════════════════════════════════════════ -->
    <!-- DESKTOP: Left Sidebar + Content                    -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="hidden md:flex min-h-screen">
      <!-- Sidebar -->
      <aside
        class="fixed left-0 top-0 h-screen w-[72px] lg:w-[240px] bg-surface border-r border-outline-variant/60 flex flex-col justify-between z-50 transition-all duration-200"
        role="navigation"
        aria-label="Navegación principal"
      >
        <!-- Logo -->
        <div>
          <NuxtLink
            to="/"
            class="flex items-center gap-3 px-4 h-[72px] mb-2"
            aria-label="Inicio de JobNet"
          >
            <img
              src="/logo.svg"
              alt="JobNet"
              class="h-8 w-8 flex-shrink-0 filter brightness-100"
            />
            <span
              class="text-xl font-bold tracking-tight text-primary hidden lg:inline"
              >JobNet</span
            >
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

      <!-- Main Content -->
      <main class="flex-grow ml-[72px] lg:ml-[240px] min-h-screen" role="main">
        <slot />
      </main>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- MOBILE: Top Header + Content + Bottom NavBar       -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="md:hidden flex flex-col min-h-screen">
      <!-- Mobile Top Bar -->
      <header
        class="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-lg border-b border-outline-variant/60 h-14 flex items-center justify-between px-4"
        role="banner"
      >
        <NuxtLink
          to="/"
          class="flex items-center gap-2"
          aria-label="Inicio de JobNet"
        >
          <img
            src="/logo.svg"
            alt="JobNet"
            class="h-7 w-7 filter brightness-100"
          />
          <span class="text-lg font-bold tracking-tight text-primary"
            >JobNet</span
          >
        </NuxtLink>
        <div class="flex items-center gap-2">
          <template v-if="status === 'authenticated'">
            <NuxtLink
              to="/profile"
              class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white"
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

      <!-- Main Content -->
      <main class="flex-grow pt-14 pb-16" role="main">
        <slot />
      </main>

      <!-- Mobile Bottom Navigation -->
      <nav
        class="fixed bottom-0 w-full z-50 bg-surface/95 backdrop-blur-lg border-t border-outline-variant/60 flex justify-around items-center h-16 px-1 pb-safe"
        role="navigation"
        aria-label="Navegación principal móvil"
      >
        <NuxtLink
          v-for="item in mobileNavItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-150',
            isActiveRoute(item.to)
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-primary',
          ]"
          :aria-label="item.label"
        >
          <span
            class="material-symbols-outlined text-[24px]"
            :style="
              isActiveRoute(item.to)
                ? 'font-variation-settings: \'FILL\' 1;'
                : ''
            "
            >{{ item.icon }}</span
          >
          <span class="text-[10px] font-medium leading-tight">{{
            item.shortLabel || item.label
          }}</span>
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const route = useRoute();
const { status, data, signOut } = useAuth();

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
    to: "/jobs",
    icon: "search",
    label: "Explorar Vacantes",
    shortLabel: "Explorar",
  },
  {
    to: "/companies",
    icon: "domain",
    label: "Directorio de Empresas",
    shortLabel: "Empresas",
  },
];

const candidateNav: NavItem[] = [
  { to: "/feed", icon: "auto_awesome", label: "Feed", shortLabel: "Feed" },
  {
    to: "/jobs",
    icon: "search",
    label: "Explorar Vacantes",
    shortLabel: "Explorar",
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
    to: "/create-vacancy",
    icon: "add_circle",
    label: "Crear Vacante",
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

// Computed: Mobile bottom bar (max 5 items for Instagram-like UX)
const mobileNavItems = computed<NavItem[]>(() => {
  return currentNavItems.value.slice(0, 5);
});

// Route matching helper
const isActiveRoute = (path: string): boolean => {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};
</script>
