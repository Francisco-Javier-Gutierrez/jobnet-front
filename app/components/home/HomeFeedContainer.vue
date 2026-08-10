<template>
  <div class="flex flex-col gap-6">
    <!-- Skeleton Loading Feed -->
    <template v-if="postsLoading">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm animate-pulse p-4"
      >
        <!-- Header Skeleton -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-outline/20"></div>
          <div class="flex-grow flex flex-col gap-2">
            <div class="h-4 w-28 bg-outline/20 rounded"></div>
            <div class="h-3 w-36 bg-outline/20 rounded"></div>
          </div>
        </div>
        <!-- Body Text Skeleton -->
        <div class="h-3.5 w-full bg-outline/20 rounded mb-2"></div>
        <div class="h-3.5 w-5/6 bg-outline/20 rounded mb-4"></div>

        <!-- Media Placeholder Skeleton -->
        <div
          v-if="i === 1"
          class="aspect-video w-full bg-outline/10 rounded-xl mb-4"
        ></div>

        <!-- Footer Actions Skeleton -->
        <div
          class="flex items-center gap-4 border-t border-outline-variant/30 pt-3 mt-2"
        >
          <div class="h-4 w-12 bg-outline/20 rounded"></div>
          <div class="h-4 w-12 bg-outline/20 rounded"></div>
          <div class="h-4 w-8 bg-outline/20 rounded"></div>
        </div>
      </div>
    </template>

    <!-- Feed Card -->
    <template v-else-if="feedItems.length > 0">
      <template v-for="item in feedItems" :key="item.uniqueId || item.id">
        <JobCard
          v-if="
            item.isVacancy || item.tipo === 'VACANTE' || item.type === 'VACANCY'
          "
          :job="item"
          :current-user-id="currentUserId"
          :is-bookmarked="isBookmarked(item)"
          :is-liked="isLiked(item)"
          @like="$emit('toggle-like', item)"
          @bookmark="$emit('toggle-bookmark', item)"
          @share="$emit('share-job', item)"
          @navigate="(id) => $router.push(`/jobs/${id}`)"
        />
        <PostCard
          v-else
          :post="item"
          :current-user-id="currentUserId"
          :is-bookmarked="isBookmarked(item)"
          @like="$emit('toggle-like', item)"
          @bookmark="$emit('toggle-bookmark', item)"
          @share="$emit('share-post', item)"
          @navigate="$emit('navigate-to-post', item.uniqueId)"
        />
      </template>
    </template>

    <!-- Empty Feed State -->
    <template v-else>
      <div
        class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl shadow-sm px-6"
      >
        <div
          class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
        >
          <span class="material-symbols-outlined text-[40px] text-primary"
            >forum</span
          >
        </div>
        <h2 class="text-xl font-bold text-on-background mb-2">
          No hay publicaciones en la comunidad
        </h2>
        <p
          class="text-on-surface-variant dark:text-slate-300 text-sm max-w-sm mb-6"
        >
          Aún no se han compartido publicaciones en el feed. ¡Sé el primero en
          compartir algo interesante con la comunidad!
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import PostCard from "~/components/PostCard.vue";

const props = defineProps<{
  postsLoading: boolean;
  feedItems: any[];
  currentUserId: string;
  isBookmarked: (item: any) => boolean;
  isLiked: (item: any) => boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-like", item: any): void;
  (e: "toggle-bookmark", item: any): void;
  (e: "share-job", item: any): void;
  (e: "share-post", item: any): void;
  (e: "navigate-to-post", id: string): void;
}>();
</script>
