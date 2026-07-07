<template>
  <div
    class="relative overflow-hidden flex-grow flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8"
    role="main"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_40%)]"
      aria-hidden="true"
    ></div>
    <div
      class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
      aria-hidden="true"
    ></div>

    <div class="max-w-3xl text-center relative z-10">
      <span
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-6"
        aria-label="Nueva versión 2.0 disponible"
      >
        <span
          class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"
          aria-hidden="true"
        ></span>
        Nueva Versión 2.0
      </span>
      <h1
        class="text-5xl sm:text-6xl font-extrabold tracking-tight text-white mb-6"
      >
        Encuentra el empleo de tus sueños con
        <span
          class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >JobNet</span
        >
      </h1>
      <p
        class="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
      >
        Conectamos el talento técnico con las mejores empresas globales. Explora
        vacantes geolocalizadas, gestiona tus postulaciones y da el siguiente
        gran salto en tu carrera profesional.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          to="/jobs"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
          aria-label="Explorar listado de empleos disponibles"
        >
          Explorar Empleos
        </NuxtLink>
        <NuxtLink
          to="/map"
          class="inline-flex items-center justify-center px-6 py-3 border border-slate-700 text-base font-medium rounded-xl text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition"
          aria-label="Ver empleos geolocalizados en el mapa interactivo"
        >
          Ver en el Mapa
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "JobNet - Plataforma de Búsqueda de Empleos",
  description:
    "Explora ofertas de empleo con ubicación geográfica interactiva y gestiona tu carrera profesional.",
});
</script>
