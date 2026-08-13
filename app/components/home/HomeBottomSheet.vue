<template>
  <div
    v-if="selectedPost"
    class="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
    @click="$emit('close')"
  >
    <!-- Bottom Sheet Panel -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 w-full max-w-lg rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh]"
      :class="isDragging ? '' : 'transition-transform duration-300'"
      :style="{
        transform:
          sheetOffset > 0 ? `translateY(${sheetOffset}px)` : 'translateY(0px)',
      }"
      @click.stop
    >
      <!-- Drag Handle Indicator -->
      <div
        class="py-3 flex justify-center cursor-ns-resize touch-none select-none"
        @touchstart="$emit('touchstart', $event)"
        @touchmove="$emit('touchmove', $event)"
        @touchend="$emit('touchend')"
        @mousedown="$emit('mousedown', $event)"
        @click="$emit('close')"
      >
        <div
          class="w-12 h-1.5 rounded-full bg-outline/20 hover:bg-outline/40 transition"
        ></div>
      </div>

      <!-- Header -->
      <div
        class="px-4 pb-3 border-b border-outline-variant/20 flex items-center justify-between cursor-ns-resize touch-none select-none"
        @touchstart="$emit('touchstart', $event)"
        @touchmove="$emit('touchmove', $event)"
        @touchend="$emit('touchend')"
        @mousedown="$emit('mousedown', $event)"
      >
        <h3
          class="text-sm font-bold text-on-background flex items-center gap-1 pointer-events-none"
        >
          <span class="material-symbols-outlined text-primary text-lg"
            >forum</span
          >
          Publicación y Comentarios
        </h3>
        <button
          @click="$emit('close')"
          class="text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high p-1.5 rounded-full transition"
        >
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <!-- Content Area (Scrollable) -->
      <div class="overflow-y-auto flex-grow p-4 space-y-6">
        <!-- The Post Card -->
        <PostCard
          :post="selectedPost"
          :current-user-id="currentUserId"
          :is-bookmarked="isBookmarked(selectedPost)"
          :is-detail="true"
          @like="$emit('toggle-like', selectedPost)"
          @bookmark="$emit('toggle-bookmark', selectedPost)"
          @share="$emit('share-post', selectedPost)"
        />

        <!-- Comments List -->
        <div
          class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-4 border border-outline-variant/30 space-y-4"
        >
          <h4
            class="text-xs font-bold text-on-background flex items-center gap-1 pb-2 border-b border-outline-variant/20"
          >
            Comentarios y Respuestas ({{ commentsCount(selectedPost) }})
          </h4>

          <!-- Input Form -->
          <form
            @submit.prevent="$emit('submit-comment')"
            class="flex flex-col gap-2"
          >
            <textarea
              :value="newCommentText"
              @input="
                $emit(
                  'update:newCommentText',
                  ($event.target as HTMLTextAreaElement).value,
                )
              "
              placeholder="Escribe un comentario público..."
              rows="2"
              class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl p-3 text-xs text-on-background outline-none transition placeholder-on-surface-variant/50 resize-none font-sans"
            ></textarea>
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="!newCommentText.trim() || isSubmittingComment"
                class="bg-primary hover:bg-primary-container text-white disabled:bg-primary/40 font-bold text-[10px] px-4 py-2 rounded-lg transition flex items-center gap-1.5"
              >
                <span v-if="isSubmittingComment" class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" aria-hidden="true"></span>
                <span>{{
                  isSubmittingComment ? "Enviando..." : "Comentar"
                }}</span>
              </button>
            </div>
          </form>

          <!-- Threaded tree list -->
          <div
            v-if="commentTree.length === 0"
            class="text-center py-6 text-on-surface-variant dark:text-slate-300/60 text-xs"
          >
            <span
              class="material-symbols-outlined text-[28px] text-outline mb-1"
              >comments_disabled</span
            >
            <p>No hay comentarios todavía.</p>
          </div>
          <div v-else class="space-y-4 pt-2">
            <div
              v-for="node in commentTree"
              :key="node.id"
              class="p-3 bg-surface-container-low/20 border border-outline-variant/30 rounded-xl space-y-2 relative group text-left transition-all duration-200"
              :class="{ 'opacity-60 bg-slate-50/50': node.isDeleted }"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 flex-grow">
                  <div
                    class="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shadow-sm shrink-0"
                  >
                    {{ node.user ? node.user.charAt(0).toUpperCase() : "U" }}
                  </div>
                  <div class="flex items-center justify-between w-full pr-2">
                    <h5 class="text-[11px] font-bold text-on-background">
                      {{ node.user || "Usuario" }}
                    </h5>
                    <span
                      class="text-[9px] text-on-surface-variant dark:text-slate-300/75 whitespace-nowrap"
                      >{{ node.timeAgo || "Hace un momento" }}</span
                    >
                  </div>
                </div>
                <button
                  v-if="!node.isDeleted && canDeleteComment(node)"
                  @click="$emit('delete-comment', node.id)"
                  class="text-rose-600 hover:bg-rose-50 p-1 rounded-md transition opacity-0 group-hover:opacity-100"
                >
                  <span class="material-symbols-outlined text-xs">delete</span>
                </button>
              </div>
              <p
                class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
                :class="{
                  'italic text-on-surface-variant dark:text-slate-300/60':
                    node.isDeleted,
                }"
              >
                {{ node.text }}
              </p>

              <!-- Actions -->
              <div v-if="!node.isDeleted" class="flex items-center gap-3">
                <button
                  @click="$emit('toggle-reply-form', node.id)"
                  class="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                >
                  <span class="material-symbols-outlined text-xs">reply</span>
                  Responder
                </button>
              </div>

              <!-- Reply Form -->
              <form
                v-if="replyingToId === node.id"
                @submit.prevent="$emit('submit-reply', node.id)"
                class="mt-2 flex gap-1.5 animate-fade-in"
              >
                <input
                  :value="replyText"
                  @input="
                    $emit(
                      'update:replyText',
                      ($event.target as HTMLInputElement).value,
                    )
                  "
                  type="text"
                  placeholder="Respuesta..."
                  class="flex-grow bg-surface border border-outline-variant/60 focus:border-primary rounded-lg px-3 py-1.5 text-xs text-on-background outline-none transition"
                />
                <button
                  type="submit"
                  :disabled="!replyText.trim() || isSubmittingReply"
                  class="bg-secondary text-white disabled:bg-secondary/40 font-bold text-[10px] px-3 py-1.5 rounded-lg hover:bg-[#005236] transition flex items-center gap-1"
                ><span>{{
                    isSubmittingReply ? "Enviando..." : "Responder"
                  }}</span></button>
              </form>

              <!-- Nested (Replies Level 2) -->
              <div
                v-if="node.children && node.children.length > 0"
                class="ml-6 mt-3 border-l-2 border-outline-variant/20 pl-3 space-y-3"
              >
                <div
                  v-for="reply in node.children"
                  :key="reply.id"
                  class="p-2.5 bg-surface-container-low/40 border border-outline-variant/10 rounded-xl space-y-1 relative group transition-all duration-200"
                  :class="{ 'opacity-60 bg-slate-50/50': reply.isDeleted }"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5 flex-grow">
                      <div
                        class="w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-[9px] shrink-0"
                      >
                        {{
                          reply.user ? reply.user.charAt(0).toUpperCase() : "U"
                        }}
                      </div>
                      <div class="flex items-center justify-between w-full pr-2">
                        <h6 class="text-[10px] font-bold text-on-background">
                          {{ reply.user || "Usuario" }}
                        </h6>
                        <span
                          class="text-[8px] text-on-surface-variant dark:text-slate-300/75 whitespace-nowrap"
                          >{{ reply.timeAgo || "Hace un momento" }}</span
                        >
                      </div>
                    </div>
                    <button
                      v-if="!reply.isDeleted && canDeleteComment(reply)"
                      @click="$emit('delete-comment', reply.id)"
                      class="text-rose-600 hover:bg-rose-50 p-0.5 rounded transition opacity-0 group-hover:opacity-100"
                    >
                      <span class="material-symbols-outlined text-[10px]"
                        >delete</span
                      >
                    </button>
                  </div>
                  <p
                    class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
                    :class="{
                      'italic text-on-surface-variant dark:text-slate-300/60':
                        reply.isDeleted,
                    }"
                  >
                    {{ reply.text }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PostCard from "~/components/PostCard.vue";

const props = defineProps<{
  selectedPost: any;
  currentUserId: string;
  isBookmarked: (item: any) => boolean;
  commentsCount: (postItem: any) => number;
  commentTree: any[];
  canDeleteComment: (node: any) => boolean;
  isDragging: boolean;
  sheetOffset: number;
  newCommentText: string;
  isSubmittingComment: boolean;
  replyingToId: string | null;
  replyText: string;
  isSubmittingReply: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "touchstart", event: TouchEvent): void;
  (e: "touchmove", event: TouchEvent): void;
  (e: "touchend"): void;
  (e: "mousedown", event: MouseEvent): void;
  (e: "toggle-like", item: any): void;
  (e: "toggle-bookmark", item: any): void;
  (e: "share-post", item: any): void;
  (e: "update:newCommentText", value: string): void;
  (e: "submit-comment"): void;
  (e: "delete-comment", id: string): void;
  (e: "toggle-reply-form", id: string): void;
  (e: "update:replyText", value: string): void;
  (e: "submit-reply", id: string): void;
}>();
</script>
