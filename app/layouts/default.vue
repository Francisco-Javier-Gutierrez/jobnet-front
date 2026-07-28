<template>
  <div
    class="min-h-screen bg-background dark:bg-slate-950 text-on-background dark:text-slate-100 font-sans transition-colors duration-200"
  >
    <!-- Modular Desktop & Mobile Drawer Sidebar -->
    <AppSidebar v-model:isMobileMenuOpen="isMobileMenuOpen" />

    <!-- Modular Mobile Top Header Navbar -->
    <AppNavbar :is-visible="isHeaderVisible" />

    <!-- Main Content Area -->
    <main
      class="flex-grow min-h-screen pt-16 pb-16 md:pt-0 md:pb-0 md:ml-64 transition-all duration-200"
      role="main"
    >
      <slot />
    </main>

    <!-- Modular Mobile Bottom Navigation Footer -->
    <AppFooter :is-visible="isFooterVisible" />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from "~/components/nav/AppNavbar.vue";
import AppSidebar from "~/components/nav/AppSidebar.vue";
import AppFooter from "~/components/nav/AppFooter.vue";

const isMobileMenuOpen = ref(false);

// Scroll tracking for hide/show nav bars on mobile
const isHeaderVisible = ref(true);
const isFooterVisible = ref(true);
let lastScrollY = 0;

const handleScroll = () => {
  if (process.client) {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 20) {
      isHeaderVisible.value = true;
      isFooterVisible.value = true;
    } else {
      if (currentScrollY > lastScrollY) {
        // Scrolling down -> Hide top header, keep bottom footer visible
        isHeaderVisible.value = false;
        isFooterVisible.value = true;
      } else {
        // Scrolling up -> Show top header, hide bottom footer
        isHeaderVisible.value = true;
        isFooterVisible.value = false;
      }
    }
    lastScrollY = currentScrollY;
  }
};

onMounted(() => {
  if (process.client) {
    window.addEventListener("scroll", handleScroll, { passive: true });
    isHeaderVisible.value = true;
    isFooterVisible.value = true;
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener("scroll", handleScroll);
  }
});
</script>
