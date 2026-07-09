<template>
  <div class="max-w-2xl mx-auto px-4 py-8 w-full bg-background min-h-screen">
    <!-- Feed Posts -->
    <div class="flex flex-col gap-6">
      <!-- Empty State -->
      <div
        v-if="!loading && feedPosts.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm px-6"
      >
        <div
          class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
        >
          <span class="material-symbols-outlined text-[40px] text-primary"
            >auto_awesome</span
          >
        </div>
        <h2 class="text-xl font-bold text-on-background mb-2">
          Tu feed está vacío
        </h2>
        <p class="text-on-surface-variant text-sm max-w-sm mb-6">
          Explora vacantes, sigue empresas y conecta con profesionales para
          llenar tu feed con contenido relevante.
        </p>
        <NuxtLink
          to="/jobs"
          class="bg-primary hover:bg-primary-container text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-md shadow-primary/20 active:scale-95 duration-150"
        >
          Explorar Vacantes
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex justify-center py-20"
        role="status"
        aria-label="Cargando feed"
      >
        <div
          class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"
        ></div>
      </div>

      <!-- Feed Cards (Future implementations) -->
      <div
        v-for="post in feedPosts"
        :key="post.id"
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200"
      >
        <!-- Post Header -->
        <div class="flex items-center gap-3 p-4">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-tertiary-container flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          >
            {{ post.author?.charAt(0)?.toUpperCase() || "J" }}
          </div>
          <div class="flex-grow min-w-0">
            <p class="text-sm font-bold text-on-background truncate">
              {{ post.author }}
            </p>
            <p class="text-xs text-on-surface-variant">{{ post.timeAgo }}</p>
          </div>
          <button
            class="text-on-surface-variant hover:text-primary transition p-1"
          >
            <span class="material-symbols-outlined text-[20px]"
              >more_horiz</span
            >
          </button>
        </div>

        <!-- Post Content -->
        <div class="px-4 pb-3">
          <p class="text-sm text-on-surface-variant leading-relaxed">
            {{ post.content }}
          </p>
        </div>

        <!-- Post Job Card -->
        <div
          v-if="post.job"
          class="mx-4 mb-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
            >
              <span class="material-symbols-outlined text-primary text-[20px]"
                >work</span
              >
            </div>
            <div class="flex-grow min-w-0">
              <p class="text-sm font-bold text-on-background truncate">
                {{ post.job.title }}
              </p>
              <p class="text-xs text-on-surface-variant">
                {{ post.job.company }} · {{ post.job.location }}
              </p>
              <div class="flex gap-2 mt-2">
                <span
                  class="text-[10px] bg-secondary/15 text-secondary px-2.5 py-0.5 rounded-full font-bold"
                >
                  {{ post.job.type }}
                </span>
                <span
                  class="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold"
                >
                  {{ post.job.salary }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Post Actions -->
        <div
          class="flex items-center gap-1 px-4 pb-3 pt-1 border-t border-outline-variant/30"
        >
          <button
            class="flex items-center gap-1.5 text-on-surface-variant hover:text-rose-600 transition py-2 px-3 rounded-lg hover:bg-surface-container-low"
          >
            <span class="material-symbols-outlined text-[20px]">favorite</span>
            <span class="text-xs font-semibold">{{ post.likes || 0 }}</span>
          </button>
          <button
            class="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition py-2 px-3 rounded-lg hover:bg-surface-container-low"
          >
            <span class="material-symbols-outlined text-[20px]"
              >chat_bubble</span
            >
            <span class="text-xs font-semibold">{{ post.comments || 0 }}</span>
          </button>
          <button
            class="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary transition py-2 px-3 rounded-lg hover:bg-surface-container-low"
          >
            <span class="material-symbols-outlined text-[20px]">share</span>
          </button>
          <button
            class="ml-auto text-on-surface-variant hover:text-amber-600 transition py-2 px-3 rounded-lg hover:bg-surface-container-low"
          >
            <span class="material-symbols-outlined text-[20px]">bookmark</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

useSeoMeta({
  title: "Feed - JobNet",
  description:
    "Tu feed profesional personalizado con oportunidades y novedades",
});

const loading = ref(false);

const quickActions = [
  {
    icon: "add",
    label: "Publicar",
    gradient: "from-primary to-tertiary-container",
    color: "text-primary",
  },
  {
    icon: "work",
    label: "Empleos",
    gradient: "from-secondary to-secondary-fixed-dim",
    color: "text-secondary",
  },
  {
    icon: "groups",
    label: "Comunidad",
    gradient: "from-amber-500 to-orange-600",
    color: "text-amber-500",
  },
  {
    icon: "trending_up",
    label: "Tendencias",
    gradient: "from-rose-500 to-pink-600",
    color: "text-rose-500",
  },
  {
    icon: "school",
    label: "Cursos",
    gradient: "from-cyan-500 to-blue-600",
    color: "text-cyan-500",
  },
];

const feedPosts = ref<any[]>([]);
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
