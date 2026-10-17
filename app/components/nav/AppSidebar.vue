<template>
  <div>
    <!-- Desktop Sidebar -->
    <aside
      class="hidden md:flex flex-col fixed top-0 left-0 h-screen w-64 bg-surface-container-lowest dark:bg-slate-900 border-r border-outline-variant/60 dark:border-slate-800 z-40 p-4 transition-colors duration-200 select-none shadow-xs"
    >
      <!-- Top Brand & Navigation Section (Scrollable if height is small) -->
      <div class="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1">
        <!-- Brand Logo & Title -->
        <div class="px-2 pt-1 pb-1">
          <NuxtLink
            to="/"
            aria-label="Inicio de JobNet"
            class="flex items-center gap-3 group"
          >
            <img
              src="/logo.svg"
              alt="JobNet Logo"
              class="h-10 w-10 filter brightness-100 dark:brightness-0 dark:invert transition-transform group-hover:scale-105"
            />
            <div class="flex flex-col">
              <span class="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-indigo-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                JobNet
              </span>
              <span class="text-[10px] font-semibold text-on-surface-variant/70 dark:text-slate-400 tracking-wider uppercase -mt-0.5">
                Portal de Empleo
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- Quick Omnibox Search Trigger (Ctrl+K) -->
        <div class="px-1">
          <button
            type="button"
            @click="openCommandPalette"
            class="w-full flex items-center justify-between px-3 py-2 text-xs text-on-surface-variant dark:text-slate-400 bg-surface-container/60 hover:bg-surface-container dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl border border-outline-variant/40 dark:border-slate-700/60 transition group cursor-pointer shadow-2xs"
            title="Abrir buscador global y comandos (Ctrl+K)"
          >
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">search</span>
              <span class="font-medium text-on-surface-variant dark:text-slate-300">Buscar...</span>
            </div>
            <kbd class="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-surface dark:bg-slate-900 rounded border border-outline-variant/60 dark:border-slate-700 text-on-surface-variant dark:text-slate-400">
              Ctrl K
            </kbd>
          </button>
        </div>

        <!-- Primary Action CTA Button (Standalone & Prominent) -->
        <div v-if="primaryAction" class="px-1">
          <button
            type="button"
            @click="handleNavClick(primaryAction)"
            class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            <span class="material-symbols-outlined text-[18px] font-bold">add</span>
            <span>{{ primaryAction.label }}</span>
          </button>
        </div>

        <!-- Categorized Navigation Sections -->
        <nav class="space-y-4 pt-1" aria-label="Navegación principal">
          <div
            v-for="section in navSections"
            :key="section.title"
            class="space-y-1"
          >
            <p class="px-3 text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant/60 dark:text-slate-500 select-none">
              {{ section.title }}
            </p>
            <div class="space-y-0.5">
              <a
                v-for="item in section.items"
                :key="item.to"
                href="#"
                @click.prevent="handleNavClick(item)"
                class="flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-150 group"
                :class="[
                  isActive(item.to)
                    ? 'bg-primary/10 text-primary dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold shadow-2xs'
                    : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800 hover:text-on-surface dark:hover:text-white',
                ]"
              >
                <span
                  class="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110"
                  :class="isActive(item.to) ? 'text-primary dark:text-indigo-400' : 'text-on-surface-variant dark:text-slate-400 group-hover:text-primary dark:group-hover:text-indigo-400'"
                >
                  {{ item.icon }}
                </span>
                <span class="truncate">{{ item.label }}</span>
              </a>
            </div>
          </div>
        </nav>
      </div>

      <!-- Bottom System Actions (Always Fixed at bottom, never cut off) -->
      <div
        class="flex-shrink-0 pt-3 border-t border-outline-variant/60 dark:border-slate-800 space-y-3 mt-auto bg-surface-container-lowest dark:bg-slate-900 z-10"
      >
        <!-- Appearance Toggle -->
        <div
          class="flex items-center justify-between px-3 py-2 bg-surface-container/50 dark:bg-slate-800/60 rounded-xl"
        >
          <span
            class="text-xs font-semibold text-on-surface-variant dark:text-slate-400"
            >Apariencia</span
          >
          <ThemeToggle />
        </div>

        <!-- User Profile & Logout (Authenticated) -->
        <div
          v-if="effectiveStatus === 'authenticated'"
          class="flex items-center justify-between px-3 py-2"
        >
          <NuxtLink
            :to="profileRoute"
            class="flex items-center gap-3 overflow-hidden group min-w-0"
          >
            <div
              v-if="userAvatar"
              class="w-8 h-8 rounded-full border border-primary/20 flex-shrink-0 group-hover:scale-105 transition overflow-hidden"
            >
              <img
                :src="userAvatar"
                alt="Foto de perfil"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 group-hover:scale-105 transition"
            >
              {{ userInitial }}
            </div>
            <div class="truncate min-w-0 flex-1">
              <p
                class="text-xs font-bold text-on-surface dark:text-slate-200 truncate group-hover:text-primary transition"
              >
                {{ userName }}
              </p>
              <p
                class="text-[10px] text-on-surface-variant dark:text-slate-400 capitalize truncate"
              >
                {{ roleBadge }}
              </p>
            </div>
          </NuxtLink>
          <button
            @click="onSignOut"
            class="text-on-surface-variant dark:text-slate-400 hover:text-rose-600 transition p-1.5 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <span class="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>

        <!-- Guest Login Button (Unauthenticated) -->
        <div v-else class="space-y-2 px-1">
          <NuxtLink
            to="/login"
            class="w-full flex items-center justify-center gap-2 h-10 text-xs font-bold text-white bg-primary hover:bg-primary-container rounded-xl transition shadow-sm"
          >
            <span class="material-symbols-outlined text-[18px]">login</span>
            <span>Iniciar Sesión</span>
          </NuxtLink>
        </div>
      </div>
    </aside>

    <!-- Mobile Drawer Overlay & Content -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 md:hidden"
        @click="closeMobileMenu"
      />
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-surface-container-lowest dark:bg-slate-900 border-r border-outline-variant/60 dark:border-slate-800 z-50 p-4 flex flex-col justify-between md:hidden select-none shadow-2xl"
      >
        <div class="flex-1 overflow-y-auto min-h-0 space-y-4">
          <!-- Mobile Drawer Header -->
          <div class="flex items-center justify-between px-2 pt-1">
            <NuxtLink
              to="/"
              aria-label="Inicio de JobNet"
              class="flex items-center gap-2.5"
              @click="closeMobileMenu"
            >
              <img
                src="/logo.svg"
                alt="JobNet Logo"
                class="h-9 w-9 filter brightness-100 dark:brightness-0 dark:invert transition-all"
              />
              <span class="font-extrabold text-base tracking-tight bg-gradient-to-r from-primary to-indigo-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                JobNet
              </span>
            </NuxtLink>
            <button
              type="button"
              @click="closeMobileMenu"
              class="text-on-surface-variant dark:text-slate-300 hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Cerrar menú"
            >
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Quick Omnibox Search (Mobile Drawer) -->
          <div class="px-1">
            <button
              type="button"
              @click="closeMobileMenu(); openCommandPalette();"
              class="w-full flex items-center justify-between px-3 py-2 text-xs text-on-surface-variant dark:text-slate-400 bg-surface-container/60 hover:bg-surface-container dark:bg-slate-800/60 rounded-xl border border-outline-variant/40 dark:border-slate-700/60 transition cursor-pointer shadow-2xs"
            >
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-primary">search</span>
                <span class="font-medium text-on-surface-variant dark:text-slate-300">Buscar o comando...</span>
              </div>
              <span class="material-symbols-outlined text-sm text-primary">arrow_forward</span>
            </button>
          </div>

          <!-- Primary Action CTA Button (Mobile Drawer) -->
          <div v-if="primaryAction" class="px-1">
            <button
              type="button"
              @click="handleMobileNavClick(primaryAction)"
              class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 text-white text-xs font-bold shadow-md shadow-primary/20 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              <span class="material-symbols-outlined text-[18px] font-bold">add</span>
              <span>{{ primaryAction.label }}</span>
            </button>
          </div>

          <!-- Categorized Navigation Sections (Mobile Drawer) -->
          <nav class="space-y-4 pt-1" aria-label="Navegación móvil">
            <div
              v-for="section in navSections"
              :key="section.title"
              class="space-y-1"
            >
              <p class="px-3 text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant/60 dark:text-slate-500 select-none">
                {{ section.title }}
              </p>
              <div class="space-y-0.5">
                <a
                  v-for="item in section.items"
                  :key="item.to"
                  href="#"
                  @click.prevent="handleMobileNavClick(item)"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150"
                  :class="[
                    isActive(item.to)
                      ? 'bg-primary/10 text-primary dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold shadow-2xs'
                      : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800',
                  ]"
                >
                  <span
                    class="material-symbols-outlined text-[20px]"
                    :class="isActive(item.to) ? 'text-primary dark:text-indigo-400' : 'text-on-surface-variant dark:text-slate-400'"
                  >
                    {{ item.icon }}
                  </span>
                  <span>{{ item.label }}</span>
                </a>
              </div>
            </div>
          </nav>
        </div>

        <!-- Mobile Drawer Bottom Actions -->
        <div
          class="flex-shrink-0 pt-3 border-t border-outline-variant/60 dark:border-slate-800 space-y-3 mt-auto bg-surface-container-lowest dark:bg-slate-900"
        >
          <div
            class="flex items-center justify-between px-3 py-2 bg-surface-container/50 dark:bg-slate-800/60 rounded-xl"
          >
            <span
              class="text-xs font-semibold text-on-surface-variant dark:text-slate-400"
              >Apariencia</span
            >
            <ThemeToggle />
          </div>

          <!-- Authenticated Logout -->
          <button
            v-if="effectiveStatus === 'authenticated'"
            @click="onSignOut"
            class="w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">logout</span>
            Cerrar sesión
          </button>

          <!-- Guest Login (Mobile Drawer) -->
          <div v-else class="space-y-2">
            <NuxtLink
              to="/login"
              @click="closeMobileMenu"
              class="w-full flex items-center justify-center gap-2 h-10 text-xs font-bold text-white bg-primary hover:bg-primary-container rounded-xl transition shadow-sm"
            >
              <span class="material-symbols-outlined text-[18px]">login</span>
              <span>Iniciar Sesión</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "#imports";
import { useProtectedAction } from "~/composables/useProtectedAction";
import { useProfileState } from "~/composables/useProfileState";
import { useCommandPalette } from "~/composables/useCommandPalette";

interface NavItem {
  to: string;
  icon: string;
  label: string;
  protected?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const props = defineProps<{
  isMobileMenuOpen?: boolean;
}>();

const emit = defineEmits(["update:isMobileMenuOpen"]);

const route = useRoute();
const router = useRouter();
const { status, data, signOut } = useAuth();
const { openProtectedModal } = useProtectedAction();
const { profilePic, hasFetched, fetchProfilePic } = useProfileState();
const { openCommandPalette } = useCommandPalette();

const effectiveStatus = computed(() => {
  return status.value;
});

watchEffect(() => {
  if (
    status.value === "authenticated" &&
    data.value?.user?.id &&
    !hasFetched.value
  ) {
    fetchProfilePic(data.value.user.id as string);
  }
});

const userRole = computed<string>(() => {
  if (status.value !== "authenticated") return "guest";
  const user = data.value?.user;
  const tipo = (user?.tipoUsuario || "").toUpperCase();
  if (tipo === "ORGANIZACION" || tipo === "EMPRESA") return "organization";
  if (tipo === "ADMIN") return "admin";
  if (tipo === "MODERATOR" || tipo === "MODERADOR") return "moderator";
  return "candidate";
});

const userName = computed(() => {
  return data.value?.user?.name || data.value?.user?.email || "Usuario";
});
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

const userAvatar = computed(() => {
  return profilePic.value || data.value?.user?.image || "";
});

const roleBadge = computed(() => {
  switch (userRole.value) {
    case "admin":
      return "Administrador";
    case "moderator":
      return "Moderador";
    case "organization":
      return "Organización";
    default:
      return "Candidato";
  }
});

const profileRoute = computed(() => {
  return "/profile";
});

const isActive = (path: string): boolean => {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};

const handleNavClick = (item: NavItem) => {
  if (effectiveStatus.value !== "authenticated" && item.protected) {
    openProtectedModal();
    return;
  }
  router.push(item.to);
};

const handleMobileNavClick = (item: NavItem) => {
  closeMobileMenu();
  if (effectiveStatus.value !== "authenticated" && item.protected) {
    openProtectedModal();
    return;
  }
  router.push(item.to);
};

// Prominent Action CTA Button per Role
const primaryAction = computed<NavItem | null>(() => {
  switch (userRole.value) {
    case "organization":
      return {
        to: "/create",
        icon: "add_circle",
        label: "Publicar Oferta",
        protected: true,
      };
    case "admin":
    case "moderator":
      return {
        to: "/create",
        icon: "add_circle",
        label: "Crear Nuevo",
        protected: true,
      };
    default:
      return {
        to: "/create",
        icon: "add_circle",
        label: "Crear Publicación",
        protected: true,
      };
  }
});

// Categorized Navigation Sections (Eliminates flat list crowding)
const navSections = computed<NavSection[]>(() => {
  switch (userRole.value) {
    case "admin":
      return [
        {
          title: "Administración",
          items: [
            { to: "/", icon: "home", label: "Inicio", protected: false },
            {
              to: "/admin/analytics",
              icon: "insights",
              label: "Analítica Avanzada",
              protected: true,
            },
            {
              to: "/admin/organizations",
              icon: "account_balance",
              label: "Organizaciones",
              protected: true,
            },
            {
              to: "/admin/catalog",
              icon: "layers",
              label: "Catálogo Maestro",
              protected: true,
            },
          ],
        },
        {
          title: "Moderación & Auditoría",
          items: [
            {
              to: "/mod/incidents",
              icon: "report_problem",
              label: "Incidencias",
              protected: true,
            },
            {
              to: "/mod/appeals",
              icon: "gavel",
              label: "Canales Apelación",
              protected: true,
            },
            {
              to: "/notifications",
              icon: "notifications",
              label: "Notificaciones",
              protected: true,
            },
            {
              to: "/saved",
              icon: "bookmark",
              label: "Guardados",
              protected: true,
            },
          ],
        },
      ];

    case "moderator":
      return [
        {
          title: "Supervisión",
          items: [
            { to: "/", icon: "home", label: "Inicio", protected: false },
            {
              to: "/mod/incidents",
              icon: "report_problem",
              label: "Incidencias",
              protected: true,
            },
            {
              to: "/mod/appeals",
              icon: "gavel",
              label: "Canales Apelación",
              protected: true,
            },
            {
              to: "/mod/verifications",
              icon: "verified",
              label: "Verificaciones",
              protected: true,
            },
          ],
        },
        {
          title: "Gestión & Soporte",
          items: [
            {
              to: "/notifications",
              icon: "notifications",
              label: "Notificaciones",
              protected: true,
            },
            {
              to: "/saved",
              icon: "bookmark",
              label: "Guardados",
              protected: true,
            },
            {
              to: "/mod/support",
              icon: "contact_support",
              label: "Soporte Directo",
              protected: true,
            },
            {
              to: "/mod/skills",
              icon: "psychology",
              label: "Habilidades",
              protected: true,
            },
          ],
        },
      ];

    case "organization":
      return [
        {
          title: "Gestión de Talento",
          items: [
            { to: "/", icon: "home", label: "Inicio", protected: false },
            {
              to: "/applicants",
              icon: "dashboard_customize",
              label: "Tablero ATS",
              protected: true,
            },
            {
              to: "/my-vacancies",
              icon: "work",
              label: "Mis Vacantes",
              protected: true,
            },
          ],
        },
        {
          title: "Comunicación & Guardados",
          items: [
            {
              to: "/messages",
              icon: "forum",
              label: "Mensajes",
              protected: true,
            },
            {
              to: "/notifications",
              icon: "notifications",
              label: "Notificaciones",
              protected: true,
            },
            {
              to: "/saved",
              icon: "bookmark",
              label: "Guardados",
              protected: true,
            },
          ],
        },
        {
          title: "Empresa & Soporte",
          items: [
            {
              to: "/company/verification",
              icon: "verified",
              label: "Verificación",
              protected: true,
            },
            {
              to: "/support",
              icon: "gavel",
              label: "Soporte y Apelaciones",
              protected: true,
            },
          ],
        },
      ];

    default: // CANDIDATE or GUEST
      return [
        {
          title: "Explorar & Empleos",
          items: [
            { to: "/", icon: "home", label: "Inicio", protected: false },
            {
              to: "/vacancies",
              icon: "work",
              label: "Explorar Vacantes",
              protected: false,
            },
            {
              to: "/companies",
              icon: "domain",
              label: "Directorio de Organizaciones",
              protected: false,
            },
          ],
        },
        {
          title: "Comunidad & Red",
          items: [
            {
              to: "/messages",
              icon: "forum",
              label: "Mensajes",
              protected: true,
            },
            {
              to: "/notifications",
              icon: "notifications",
              label: "Notificaciones",
              protected: true,
            },
          ],
        },
        {
          title: "Mi Actividad",
          items: [
            {
              to: "/candidate/cv-templates",
              icon: "auto_stories",
              label: "Plantillas de CV",
              protected: true,
            },
            {
              to: "/saved",
              icon: "bookmark",
              label: "Guardados",
              protected: true,
            },
          ],
        },
      ];
  }
});

// Backwards-compatible flat navItems
const navItems = computed<NavItem[]>(() => {
  const items: NavItem[] = [];
  if (primaryAction.value) items.push(primaryAction.value);
  for (const section of navSections.value) {
    items.push(...section.items);
  }
  return items;
});

const closeMobileMenu = () => {
  emit("update:isMobileMenuOpen", false);
};

const onSignOut = async () => {
  closeMobileMenu();
  await signOut({ callbackUrl: "/login" });
};
</script>
