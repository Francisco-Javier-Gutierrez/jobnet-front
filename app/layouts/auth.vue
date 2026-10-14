<template>
  <div
    class="min-h-screen bg-background dark:bg-slate-950 text-on-background dark:text-slate-100 transition-colors duration-200 relative flex flex-col justify-between overflow-x-hidden"
  >
    <!-- Background Ambient Glow -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(53,37,205,0.06),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none"
      aria-hidden="true"
    ></div>

    <!-- Invisible Header (ThemeToggle placed top-right) -->
    <header
      class="w-full h-16 px-4 sm:px-8 flex items-center justify-end relative z-20 bg-transparent"
    >
      <ThemeToggle />
    </header>

    <!-- Main Auth Content Area (Controlled spacing via margin bottom, 0 on mobile) -->
    <main
      class="flex-grow flex items-center justify-center p-4 sm:p-6 pt-0 sm:pt-0 mb-0 sm:mb-8 relative z-10"
    >
      <slot />
    </main>

    <!-- Invisible Minimal Auth Footer -->
    <footer
      class="py-3 text-center text-xs text-on-surface-variant/80 dark:text-slate-400/80 relative z-10 bg-transparent"
    >
      <p>
        © {{ new Date().getFullYear() }} JobNet. Todos los derechos reservados.
      </p>
    </footer>
  </div>
</template>
