<template>
  <div
    @click="handleClick"
    :class="
      isDetail
        ? 'bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm space-y-4'
        : 'bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm cursor-pointer'
    "
  >
    <!-- HEADER: User/Company info -->
    <div class="flex items-center gap-3 p-4 prevent-post-nav">
      <div
        class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary-container flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0"
      >
        {{ post.author ? post.author.charAt(0).toUpperCase() : "U" }}
      </div>
      <div class="flex-grow min-w-0">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-bold text-on-background truncate">
            {{ post.author || "Usuario JobNet" }}
          </h3>
        </div>
        <p class="text-[11px] text-on-surface-variant/80 truncate animate-fade-in">
          {{ post.role || "Candidato" }} · {{ formatTime(post.createdAt) }}
        </p>
      </div>
    </div>

    <!-- POST IMAGE/MEDIA CONTAINER -->
    <div
      v-if="post.media"
      class="aspect-video w-full bg-slate-100 relative overflow-hidden border-y border-outline-variant/20"
    >
      <img
        :src="post.media"
        alt="Imagen del post"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- PDF DOCUMENT CONTAINER -->
    <div
      v-if="post.pdfUrl"
      class="border-y border-outline-variant/20 bg-slate-50 prevent-post-nav"
    >
      <div
        class="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div class="flex items-center gap-2 text-xs">
          <span class="material-symbols-outlined text-rose-600 text-[24px]"
            >picture_as_pdf</span
          >
          <div class="text-left">
            <p
              class="font-bold text-on-background max-w-[200px] sm:max-w-[240px] truncate"
            >
              {{ post.pdfName || "Documento PDF" }}
            </p>
            <p class="text-[10px] text-on-surface-variant/80">
              Documento Adjunto
            </p>
          </div>
        </div>
        <div class="flex gap-2 justify-end sm:justify-start">
          <button
            @click.stop="showPdf = !showPdf"
            type="button"
            class="bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs px-3.5 py-1.5 rounded-lg transition flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-xs">
              {{ showPdf ? "visibility_off" : "visibility" }}
            </span>
            {{ showPdf ? "Ocultar" : "Vista Previa" }}
          </button>
          <a
            :href="post.pdfUrl"
            target="_blank"
            class="bg-white border border-outline-variant hover:border-primary text-primary font-bold text-xs px-3.5 py-1.5 rounded-lg transition"
            @click.stop
          >
            Ver Documento
          </a>
        </div>
      </div>
      <!-- Embedded Google Drive PDF Viewer Iframe -->
      <div v-if="showPdf" class="px-4 pb-4">
        <div
          class="w-full h-[450px] border border-outline-variant/30 rounded-xl overflow-hidden bg-white relative"
        >
          <iframe
            :src="`https://docs.google.com/gview?url=${encodeURIComponent(post.pdfUrl)}&embedded=true`"
            class="absolute -top-[48px] left-0 w-full"
            style="height: calc(100% + 48px)"
            frameborder="0"
            title="Visor de PDF de Google Drive"
          ></iframe>
        </div>
      </div>
    </div>

    <!-- POST CONTENT BODY -->
    <div class="p-4 flex flex-col gap-3">
      <p class="text-sm text-on-surface-variant leading-relaxed text-left">
        {{ post.content }}
      </p>
    </div>

    <!-- BOTTOM ACTIONS BAR -->
    <div
      class="px-4 py-2 flex items-center gap-1 border-t border-outline-variant/30 prevent-post-nav"
    >
      <button
        @click.stop="$emit('like', post)"
        class="flex items-center gap-1.5 text-on-surface-variant transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
        :class="isLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-600'"
      >
        <span
          class="material-symbols-outlined text-[20px]"
          :class="{ 'font-fill-1': isLiked }"
        >
          {{ isLiked ? "favorite" : "favorite_border" }}
        </span>
        <span class="text-xs font-semibold">{{ likesCount }}</span>
      </button>
      <button
        @click.stop="$emit('navigate', post.uniqueId)"
        class="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
      >
        <span class="material-symbols-outlined text-[20px]"
          >chat_bubble_outline</span
        >
        <span class="text-xs font-semibold">{{ commentsCount }}</span>
      </button>
      <button
        @click.stop="$emit('share', post)"
        class="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
      >
        <span class="material-symbols-outlined text-[20px]">share</span>
      </button>
      <button
        @click.stop="$emit('bookmark', post)"
        class="ml-auto text-on-surface-variant transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
        :class="isBookmarked ? 'text-amber-500' : 'hover:text-amber-500'"
      >
        <span
          class="material-symbols-outlined text-[20px]"
          :class="{ 'font-fill-1': isBookmarked }"
        >
          {{ isBookmarked ? "bookmark" : "bookmark_border" }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    post: any;
    currentUserId: string;
    isBookmarked: boolean;
    isDetail?: boolean;
  }>(),
  {
    isDetail: false,
  }
);

const emit = defineEmits(["like", "bookmark", "share", "navigate"]);

const showPdf = ref(false);

const isLiked = computed(() => {
  if (!props.post?.likesList) return false;
  return props.post.likesList.includes(props.currentUserId);
});

const likesCount = computed(() => {
  return props.post?.likesList
    ? props.post.likesList.length
    : props.post?.likes || 0;
});

const commentsCount = computed(() => {
  return props.post?.comments?.length || 0;
});

const handleClick = (event: Event) => {
  if (props.isDetail) return;
  
  const target = event.target as HTMLElement;
  if (
    target.closest("button") ||
    target.closest("a") ||
    target.closest("input") ||
    target.closest(".prevent-post-nav")
  ) {
    return;
  }
  emit("navigate", props.post.uniqueId);
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return "Hace un momento";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Safe fallback for future dates or local clock offset
  if (diffMs < 0) return "Hace un momento";
  
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Hace un momento";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  
  const hours = Math.floor(diffMins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
};
</script>

<style scoped>
.font-fill-1 {
  font-variation-settings: "FILL" 1;
}
</style>
