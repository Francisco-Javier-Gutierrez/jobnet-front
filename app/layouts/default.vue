<template>
  <div
    class="min-h-screen bg-background dark:bg-slate-950 text-on-background dark:text-slate-100 font-sans transition-colors duration-200"
  >
    <!-- Desktop Sidebar (Hidden on mobile) -->
    <AppSidebar />

    <!-- Unified Mobile Top Navbar with Collapsible Dropdown Menu (Hidden on desktop) -->
    <AppNavbar :is-visible="isHeaderVisible" />

    <!-- Main Content Area -->
    <main
      class="flex-grow min-h-screen pt-16 md:pt-0 md:ml-64 transition-all duration-200"
      role="main"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// Scroll tracking for hide/show top navbar on mobile
const isHeaderVisible = ref(true);
let lastScrollY = 0;

const handleScroll = () => {
  if (import.meta.client) {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 20) {
      isHeaderVisible.value = true;
    } else {
      if (currentScrollY > lastScrollY) {
        // Scrolling down -> Hide top header
        isHeaderVisible.value = false;
      } else {
        // Scrolling up -> Show top header
        isHeaderVisible.value = true;
      }
    }
    lastScrollY = currentScrollY;
  }
};

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("scroll", handleScroll, { passive: true });
    isHeaderVisible.value = true;
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("scroll", handleScroll);
  }
});
</script>
