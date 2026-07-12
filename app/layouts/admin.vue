<template>
  <div
    class="h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans flex"
  >
    <!-- Desktop Sidebar -->
    <aside
      class="hidden md:flex flex-col w-64 h-screen bg-white border-r border-slate-200 flex-shrink-0"
    >
      <div class="p-6 border-b border-slate-100 flex justify-center">
        <NuxtLink
          to="/"
          class="flex items-center justify-center"
          aria-label="Inicio de JobNet"
        >
          <img
            src="/logo.svg"
            alt="JobNet Logo"
            class="h-16 w-16 flex-shrink-0"
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

      <div class="p-4 border-t border-slate-100 flex-shrink-0">
        <button
          @click="handleSignOut"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
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
        class="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0"
      >
        <NuxtLink to="/" class="flex items-center">
          <img src="/logo.svg" alt="JobNet" class="h-14 w-14" />
        </NuxtLink>
        <button
          @click="isMobileMenuOpen = true"
          class="text-slate-600 hover:text-slate-900"
        >
          <span class="material-symbols-outlined text-[24px]">menu</span>
        </button>
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
        class="fixed inset-y-0 right-0 z-55 w-64 bg-white border-l border-slate-200 p-6 flex flex-col md:hidden"
      >
        <div
          class="flex items-center justify-between mb-8 pb-4 border-b border-slate-100"
        >
          <span class="font-bold text-sm text-slate-700"
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

        <div class="pt-4 border-t border-slate-100 flex-shrink-0">
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
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const { status, data, signOut } = useAuth();
const isMobileMenuOpen = ref(false);

const navItems = [
  {
    to: "/admin/organizations",
    icon: "account_balance",
    label: "Organizaciones",
  },
  { to: "/admin/catalog", icon: "layers", label: "Catálogo Maestro" },
  { to: "/admin/fraud", icon: "find_in_page", label: "Reportes de Fraude" },
  { to: "/admin/analytics", icon: "bar_chart", label: "Analítica" },
];

const isActive = (path: string): boolean => {
  return route.path === path;
};

// Strict Role Guard
const checkRole = () => {
  if (status.value === "unauthenticated") {
    router.replace("/login");
  } else if (status.value === "authenticated") {
    const userRole = data.value?.user?.tipoUsuario;
    if (userRole !== "ADMIN") {
      router.replace("/");
    }
  }
};

watch(status, () => checkRole(), { immediate: true });
watch(data, () => checkRole(), { immediate: true });

const handleSignOut = async () => {
  await signOut({ callbackUrl: "/login" });
};
</script>
