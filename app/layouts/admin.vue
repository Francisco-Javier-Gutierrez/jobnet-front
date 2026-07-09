<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans flex">
    <!-- Desktop Sidebar -->
    <aside
      class="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800"
    >
      <div class="p-6 border-b border-slate-800 flex items-center gap-2">
        <img src="/logotipo.svg" alt="JobNet Logo" class="h-8 w-8" />
        <div>
          <span
            class="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            >JobNet</span
          >
          <span
            class="block text-[10px] text-slate-500 font-bold uppercase tracking-wider"
            >Consola Admin</span
          >
        </div>
      </div>

      <nav class="flex-grow p-4 space-y-1.5">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150',
            isActive(item.to)
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
          ]"
        >
          <span class="material-symbols-outlined text-[20px]">{{
            item.icon
          }}</span>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-slate-800">
        <button
          @click="handleSignOut"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition"
        >
          <span class="material-symbols-outlined text-[20px]">logout</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main Workspace -->
    <div class="flex-grow flex flex-col min-w-0">
      <!-- Mobile Header -->
      <header
        class="md:hidden flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800"
      >
        <div class="flex items-center gap-2">
          <img src="/logotipo.svg" alt="JobNet Logo" class="h-7 w-7" />
          <span class="font-bold text-sm tracking-tight text-white"
            >JobNet Admin</span
          >
        </div>
        <button
          @click="isMobileMenuOpen = true"
          class="text-slate-400 hover:text-white"
        >
          <span class="material-symbols-outlined text-[24px]">menu</span>
        </button>
      </header>

      <!-- Main Slot -->
      <main class="flex-grow overflow-y-auto">
        <slot />
      </main>
    </div>

    <!-- Mobile Drawer Drawer -->
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      leave-active-class="transition-opacity duration-150 ease-in"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
        @click="isMobileMenuOpen = false"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-200 ease-out"
      leave-active-class="transition-transform duration-150 ease-in"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-y-0 right-0 z-55 w-64 bg-slate-900 border-l border-slate-800 p-6 flex flex-col md:hidden"
      >
        <div
          class="flex items-center justify-between mb-8 pb-4 border-b border-slate-800"
        >
          <span class="font-bold text-sm text-slate-300"
            >Menú Administrativo</span
          >
          <button
            @click="isMobileMenuOpen = false"
            class="text-slate-400 hover:text-white"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav class="flex-grow space-y-1.5">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            @click="isMobileMenuOpen = false"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150',
              isActive(item.to)
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
            ]"
          >
            <span class="material-symbols-outlined text-[20px]">{{
              item.icon
            }}</span>
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="pt-4 border-t border-slate-800">
          <button
            @click="handleSignOut"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition"
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
