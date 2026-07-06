<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
    <header
      class="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        <NuxtLink to="/" class="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="JobNet"
            class="h-10 w-auto text-white filter brightness-0 invert"
          />
        </NuxtLink>
        <nav
          class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
        >
          <NuxtLink to="/" class="hover:text-white transition">Inicio</NuxtLink>
          <NuxtLink to="/jobs" class="hover:text-white transition"
            >Empleos</NuxtLink
          >
          <NuxtLink to="/map" class="hover:text-white transition"
            >Mapa</NuxtLink
          >
        </nav>
        <div class="flex items-center gap-4">
          <template v-if="status === 'authenticated'">
            <span class="text-sm text-slate-400 hidden sm:inline">{{
              data?.user?.email
            }}</span>
            <button
              @click="signOut()"
              class="text-sm bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Cerrar Sesión
            </button>
          </template>
          <template v-else>
            <button
              @click="signIn('cognito')"
              class="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-indigo-600/20"
            >
              Iniciar Sesión
            </button>
          </template>
        </div>
      </div>
    </header>
    <main class="flex-grow flex flex-col">
      <slot />
    </main>
    <footer class="border-t border-slate-800 bg-slate-950/50 py-8">
      <div class="max-w-7xl mx-auto px-4 text-center text-slate-500 text-xs">
        <p>&copy; 2026 JobNet Platform. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { status, data, signIn, signOut } = useAuth();
</script>
