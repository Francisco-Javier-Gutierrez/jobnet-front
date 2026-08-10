<template>
  <section
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] p-lg md:p-xl space-y-6"
  >
    <div class="flex items-center gap-3 border-b border-surface-container pb-4">
      <button
        type="button"
        @click="activeTab = 'posts'"
        :class="[
          activeTab === 'posts'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
        ]"
        class="px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95"
      >
        <span class="material-symbols-outlined text-base">article</span>
        <span>Mis publicaciones ({{ userPosts.length }})</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'bookmarks'"
        :class="[
          activeTab === 'bookmarks'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
        ]"
        class="px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95"
      >
        <span class="material-symbols-outlined text-base">bookmark</span>
        <span>Guardados ({{ bookmarkedPosts.length }})</span>
      </button>
    </div>

    <!-- Tab Content 1: Mis Publicaciones -->
    <div v-if="activeTab === 'posts'" class="space-y-4">
      <div
        v-if="loadingPosts"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 animate-pulse"
      >
        Cargando publicaciones...
      </div>
      <div
        v-else-if="userPosts.length === 0"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 italic"
      >
        No hay publicaciones para mostrar.
      </div>
      <div v-else class="grid grid-cols-1 gap-4">
        <PostCard
          v-for="post in userPosts"
          :key="post.uniqueId"
          :post="post"
          :current-user-id="
            (authData?.user as any)?.id || authData?.user?.email || ''
          "
          :is-bookmarked="isBookmarked(post)"
          @navigate="(id) => $router.push(`/posts/${id}`)"
          @like="$emit('like', $event)"
          @bookmark="$emit('bookmark', $event)"
          @share="$emit('share', $event)"
        />
      </div>
    </div>

    <!-- Tab Content 2: Guardados -->
    <div v-if="activeTab === 'bookmarks'" class="space-y-4">
      <div
        v-if="loadingPosts"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 animate-pulse"
      >
        Cargando publicaciones guardadas...
      </div>
      <div
        v-else-if="bookmarkedPosts.length === 0"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 italic"
      >
        No tienes publicaciones guardadas.
      </div>
      <div v-else class="grid grid-cols-1 gap-4">
        <PostCard
          v-for="post in bookmarkedPosts"
          :key="post.uniqueId"
          :post="post"
          :current-user-id="
            (authData?.user as any)?.id || authData?.user?.email || ''
          "
          :is-bookmarked="true"
          @navigate="(id) => $router.push(`/posts/${id}`)"
          @like="$emit('like', $event)"
          @bookmark="$emit('bookmark', $event)"
          @share="$emit('share', $event)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  userPosts: any[];
  bookmarkedPosts: any[];
  loadingPosts: boolean;
  authData: any;
  modelValue: "posts" | "bookmarks";
  isBookmarked: (post: any) => boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: "posts" | "bookmarks"): void;
  (e: "like", val: any): void;
  (e: "bookmark", val: any): void;
  (e: "share", val: any): void;
}>();

const activeTab = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
