<template>
  <div>
    <!-- Desktop Sidebar -->
    <aside
      class="hidden md:flex flex-col fixed top-0 left-0 h-screen w-64 bg-surface-container-lowest dark:bg-slate-900 border-r border-outline-variant/60 dark:border-slate-800 z-40 p-4 transition-colors duration-200 select-none"
    >
      <!-- Top Brand & Navigation Section (Scrollable if height is small) -->
      <div class="flex-1 overflow-y-auto min-h-0 space-y-6 pr-1">
        <!-- Brand Logo -->
        <div class="flex items-center justify-center px-3 py-1">
          <NuxtLink
            to="/"
            aria-label="Inicio de JobNet"
            class="flex items-center justify-center"
          >
            <img
              src="/logo.svg"
              alt="JobNet Logo"
              class="h-16 w-16 filter brightness-100 dark:brightness-0 dark:invert transition-all hover:scale-105"
            />
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-1" aria-label="Navegación principal">
          <a
            v-for="item in navItems"
            :key="item.to"
            href="#"
            @click.prevent="handleNavClick(item)"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150"
            :class="[
              isActive(item.to)
                ? 'bg-primary/10 text-primary dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold shadow-sm'
                : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800 hover:text-on-surface',
            ]"
          >
            <span class="material-symbols-outlined text-[22px]">{{
              item.icon
            }}</span>
            <span>{{ item.label }}</span>
          </a>
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
          v-if="status === 'authenticated'"
          class="flex items-center justify-between px-3 py-2"
        >
          <NuxtLink
            :to="profileRoute"
            class="flex items-center gap-3 overflow-hidden group min-w-0"
          >
            <div
              v-if="profilePic"
              class="w-8 h-8 rounded-full border border-primary/20 flex-shrink-0 group-hover:scale-105 transition overflow-hidden"
            >
              <img :src="profilePic" alt="Foto de perfil" class="w-full h-full object-cover" />
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
            class="text-on-surface-variant dark:text-slate-400 hover:text-rose-600 transition p-1.5 rounded-lg flex items-center justify-center flex-shrink-0"
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
        class="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-surface-container-lowest dark:bg-slate-900 border-r border-outline-variant/60 dark:border-slate-800 z-50 p-4 flex flex-col justify-between md:hidden select-none"
      >
        <div class="flex-1 overflow-y-auto min-h-0 space-y-6">
          <div class="flex items-center justify-between px-2">
            <NuxtLink
              to="/"
              aria-label="Inicio de JobNet"
              class="flex items-center gap-2"
            >
              <img
                src="/logo.svg"
                alt="JobNet Logo"
                class="h-10 w-10 filter brightness-100 dark:brightness-0 dark:invert transition-all"
              />
            </NuxtLink>
            <button
              @click="closeMobileMenu"
              class="text-on-surface-variant dark:text-slate-300 p-1"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav class="space-y-1">
            <a
              v-for="item in navItems"
              :key="item.to"
              href="#"
              @click.prevent="handleMobileNavClick(item)"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all"
              :class="[
                isActive(item.to)
                  ? 'bg-primary/10 text-primary dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold'
                  : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800',
              ]"
            >
              <span class="material-symbols-outlined text-[22px]">{{
                item.icon
              }}</span>
              <span>{{ item.label }}</span>
            </a>
          </nav>
        </div>

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
            v-if="status === 'authenticated'"
            @click="onSignOut"
            class="w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl hover:bg-rose-100 transition"
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
interface NavItem {
  to: string;
  icon: string;
  label: string;
  protected?: boolean;
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

watchEffect(() => {
  if (status.value === 'authenticated' && data.value?.user?.id && !hasFetched.value) {
    console.log("AppSidebar: trigger fetchProfilePic for user", data.value.user.id);
    fetchProfilePic(data.value.user.id as string);
  }
});

const userRole = computed<string>(() => {
  if (status.value !== "authenticated") return "guest";
  const user = data.value?.user as any;
  const tipo = (user?.tipoUsuario || user?.role || "").toUpperCase();
  if (tipo === "ORGANIZACION" || tipo === "EMPRESA") return "organization";
  if (tipo === "ADMIN") return "admin";
  if (tipo === "MODERATOR" || tipo === "MODERADOR") return "moderator";
  return "candidate";
});

const userName = computed(
  () => data.value?.user?.name || data.value?.user?.email || "Usuario",
);
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

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
  if (userRole.value === "organization") return "/company/edit";
  return "/profile";
});

const isActive = (path: string): boolean => {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};

const handleNavClick = (item: NavItem) => {
  if (status.value !== "authenticated" && item.protected) {
    openProtectedModal();
    return;
  }
  router.push(item.to);
};

const handleMobileNavClick = (item: NavItem) => {
  closeMobileMenu();
  if (status.value !== "authenticated" && item.protected) {
    openProtectedModal();
    return;
  }
  router.push(item.to);
};

// 8 items per role menu, with "Crear Nuevo / Publicar Vacante / Crear Publicación" EXACTLY in 4th place (index 3)
const navItems = computed<NavItem[]>(() => {
  switch (userRole.value) {
    case "admin":
      return [
        { to: "/", icon: "home", label: "Inicio", protected: false },
        {
          to: "/admin/organizations",
          icon: "account_balance",
          label: "Organizaciones",
          protected: true,
        },
        {
          to: "/mod/incidents",
          icon: "report_problem",
          label: "Incidencias (Org/Vacantes)",
          protected: true,
        },
        {
          to: "/create",
          icon: "add_circle",
          label: "Crear Nuevo",
          protected: true,
        }, // CENTER
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
          to: "/admin/catalog",
          icon: "layers",
          label: "Catálogo Maestro",
          protected: true,
        },
      ];

    case "moderator":
      return [
        { to: "/", icon: "home", label: "Inicio", protected: false },
        {
          to: "/mod/incidents",
          icon: "warning",
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
          to: "/create",
          icon: "add_circle",
          label: "Crear Nuevo",
          protected: true,
        }, // CENTER
        {
          to: "/notifications",
          icon: "notifications",
          label: "Notificaciones",
          protected: true,
        },
        {
          to: "/mod/support",
          icon: "contact_support",
          label: "Soporte Directo",
          protected: true,
        },
        {
          to: "/mod/verifications",
          icon: "verified",
          label: "Verificaciones",
          protected: true,
        },
        {
          to: "/mod/skills",
          icon: "psychology",
          label: "Habilidades",
          protected: true,
        },
      ];

    case "organization":
      return [
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
        {
          to: "/create",
          icon: "add_circle",
          label: "Crear Nuevo",
          protected: true,
        }, // CENTER
        {
          to: "/notifications",
          icon: "notifications",
          label: "Notificaciones",
          protected: true,
        },
        {
          to: "/company/edit",
          icon: "verified",
          label: "Identidad y Verificación",
          protected: true,
        },
        { to: "/messages", icon: "forum", label: "Mensajes", protected: true },
        {
          to: "/support",
          icon: "gavel",
          label: "Soporte y Apelaciones",
          protected: true,
        },
        {
          to: "/settings",
          icon: "settings",
          label: "Configuración",
          protected: true,
        },
      ];

    default: // CANDIDATO or GUEST
      return [
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
          label: "Directorio de Empresas",
          protected: false,
        },
        {
          to: "/create",
          icon: "add_circle",
          label: "Crear Publicación",
          protected: true,
        }, // CENTER
        { to: "/messages", icon: "forum", label: "Mensajes", protected: true },
        {
          to: "/notifications",
          icon: "notifications",
          label: "Notificaciones",
          protected: true,
        },
        {
          to: "/profile",
          icon: "account_circle",
          label: "Mi Perfil",
          protected: true,
        },
        {
          to: "/settings",
          icon: "settings",
          label: "Configuración",
          protected: true,
        },
      ];
  }
});

const closeMobileMenu = () => {
  emit("update:isMobileMenuOpen", false);
};

const onSignOut = async () => {
  closeMobileMenu();
  await signOut({ callbackUrl: "/login" });
};
</script>
