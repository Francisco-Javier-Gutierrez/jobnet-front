<template>
  <div
    class="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex transition-colors duration-200"
  >
    <!-- Desktop Sidebar -->
    <aside
      class="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0"
    >
      <div
        class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-center"
      >
        <NuxtLink
          to="/"
          class="flex items-center justify-center"
          aria-label="Inicio de JobNet"
        >
          <img
            src="/logo.svg"
            alt="JobNet Logo"
            class="h-16 w-16 flex-shrink-0 filter brightness-100 dark:brightness-0 dark:invert transition-all"
          />
        </NuxtLink>
      </div>

      <nav class="flex-grow p-4 space-y-1.5 overflow-y-auto">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150',
            isActive(item.to)
              ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-300',
          ]"
        >
          <span class="material-symbols-outlined text-[20px]">{{
            item.icon
          }}</span>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div
        class="p-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0 space-y-2"
      >
        <div
          class="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
        >
          Apariencia
        </div>
        <ThemeToggle mode="pills" />
        <NuxtLink
          to="/profile"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-300 transition"
        >
          <span class="material-symbols-outlined text-[20px]"
            >account_circle</span
          >
          Perfil
        </NuxtLink>
        <button
          @click="handleSignOut"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
        >
          <span class="material-symbols-outlined text-[20px]">logout</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main Workspace -->
    <div class="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
      <!-- Mobile Header -->
      <header
        class="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-shrink-0"
      >
        <div class="flex items-center gap-3 flex-1">
          <ThemeToggle />
        </div>
        <div class="flex justify-center flex-1">
          <NuxtLink to="/" class="flex items-center">
            <img
              src="/logo.svg"
              alt="JobNet"
              class="h-14 w-14 filter brightness-100 dark:brightness-0 dark:invert transition-all"
            />
          </NuxtLink>
        </div>
        <div class="flex items-center justify-end gap-3 flex-1">
          <button
            @click="handleSignOut"
            class="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
          >
            <span class="material-symbols-outlined text-[24px]">logout</span>
          </button>
          <NuxtLink
            to="/profile"
            class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            <span class="material-symbols-outlined text-[24px]"
              >account_circle</span
            >
          </NuxtLink>
          <button
            @click="isMobileMenuOpen = true"
            class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            <span class="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
      </header>

      <!-- Main Slot (Only this scrolls) -->
      <main class="flex-grow overflow-y-auto">
        <slot />
      </main>
    </div>

    <!-- Mobile Drawer -->
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      leave-active-class="transition-opacity duration-150 ease-in"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm md:hidden"
        @click="isMobileMenuOpen = false"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-200 ease-out"
      leave-active-class="transition-transform duration-150 ease-in"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-y-0 right-0 z-55 w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col md:hidden"
      >
        <div
          class="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800"
        >
          <span class="font-bold text-sm text-slate-700 dark:text-slate-200"
            >Menú Administrativo</span
          >
          <button
            @click="isMobileMenuOpen = false"
            class="text-slate-600 hover:text-slate-900"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav class="flex-grow space-y-1.5 overflow-y-auto">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            @click="isMobileMenuOpen = false"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150',
              isActive(item.to)
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600',
            ]"
          >
            <span class="material-symbols-outlined text-[20px]">{{
              item.icon
            }}</span>
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div
          class="pt-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0 space-y-2"
        >
          <NuxtLink
            to="/profile"
            @click="isMobileMenuOpen = false"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition"
          >
            <span class="material-symbols-outlined text-[20px]"
              >account_circle</span
            >
            Perfil
          </NuxtLink>
          <button
            @click="handleSignOut"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
          >
            <span class="material-symbols-outlined text-[20px]">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { status, data, signOut } = useAuth();
const isMobileMenuOpen = ref(false);

const navItems = [
  { to: "/", icon: "home", label: "Inicio" },
  {
    to: "/admin/organizations",
    icon: "account_balance",
    label: "Organizaciones",
  },
  { to: "/companies", icon: "domain", label: "Directorio de Empresas" },
  { to: "/admin/catalog", icon: "layers", label: "Catálogo Maestro" },
  { to: "/create", icon: "add_circle", label: "Crear Nuevo" },
  { to: "/admin/fraud", icon: "find_in_page", label: "Reportes de Fraude" },
];

const isActive = (path: string): boolean => {
  return route.path === path;
};

// Strict Role Guard (404 Concealment)
const checkRole = () => {
  if (
    status.value === "unauthenticated" ||
    (status.value === "authenticated" &&
      data.value?.user?.tipoUsuario !== "ADMIN")
  ) {
    throw createError({
      statusCode: 404,
      statusMessage: "Página no encontrada",
      fatal: true,
    });
  }
};

watch(status, () => checkRole(), { immediate: true });
watch(data, () => checkRole(), { immediate: true });

const handleSignOut = async () => {
  await signOut({ callbackUrl: "/login" });
};
</script>
