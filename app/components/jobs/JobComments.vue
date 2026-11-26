<template>
  <div class="space-y-6 text-left">
    <h2 class="text-base font-bold text-on-background flex items-center gap-2">
      <span class="material-symbols-outlined text-primary text-xl">forum</span>
      Preguntas y Comentarios ({{ totalComments }})
    </h2>

    <form @submit.prevent="$emit('submitComment')" class="flex flex-col gap-3">
      <textarea
        :value="newCommentText"
        @input="
          $emit(
            'update:newCommentText',
            ($event.target as HTMLTextAreaElement).value,
          )
        "
        placeholder="Pregunta algo al reclutador sobre esta vacante..."
        rows="3"
        class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-2xl p-4 text-xs text-on-background outline-none transition placeholder-on-surface-variant/50 resize-none font-sans"
      ></textarea>
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="!newCommentText.trim() || isCreatingComment"
          class="bg-primary hover:bg-primary-container text-white disabled:bg-primary/40 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center justify-center min-w-[120px]"
        >
          <span
            v-if="isCreatingComment"
            class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
          ></span>
          <span v-else>Publicar Pregunta</span>
        </button>
      </div>
    </form>

    <div
      v-if="commentTree.length === 0"
      class="text-center py-6 text-on-surface-variant dark:text-slate-300/60 text-xs"
    >
      <span class="material-symbols-outlined text-[32px] text-outline mb-1"
        >comments_disabled</span
      >
      <p>No hay preguntas aún. ¡Sé el primero en consultar!</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="node in commentTree"
        :key="node.id"
        class="p-4 bg-surface-container-low/30 border border-outline-variant/40 rounded-2xl space-y-3 relative"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 flex-grow">
            <div
              class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-inner shrink-0"
            >
              {{ node.user.charAt(0).toUpperCase() }}
            </div>
            <div class="flex items-center justify-between w-full pr-2">
              <h4 class="text-xs font-bold text-on-background">
                {{ node.user }}
              </h4>
              <span
                class="text-[10px] text-on-surface-variant dark:text-slate-300/80 whitespace-nowrap"
                >{{ formatDate(node.createdAt) }}</span
              >
            </div>
          </div>

          <button
            v-if="canDeleteComment(node)"
            type="button"
            :disabled="isDeletingComment?.(node.id)"
            @click="$emit('deleteComment', node.id)"
            class="text-rose-600 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed p-1.5 rounded-lg transition inline-flex items-center justify-center"
            title="Eliminar pregunta"
          >
            <span
              v-if="isDeletingComment?.(node.id)"
              class="w-3.5 h-3.5 border-2 border-current/20 border-t-current rounded-full animate-spin"
              aria-hidden="true"
            ></span>
            <span v-else class="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>

        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
        >
          {{ node.text }}
        </p>

        <div class="flex items-center gap-3 pt-1">
          <button
            @click="$emit('toggleReplyForm', node.id)"
            class="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
          >
            <span class="material-symbols-outlined text-sm">reply</span>
            Responder
          </button>
        </div>

        <form
          v-if="replyingToCommentId === node.id"
          @submit.prevent="$emit('submitReply', node.id)"
          class="mt-2 flex gap-2"
        >
          <input
            :value="replyContentText"
            @input="
              $emit(
                'update:replyContentText',
                ($event.target as HTMLInputElement).value,
              )
            "
            type="text"
            placeholder="Escribe una respuesta..."
            class="flex-grow bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2 text-xs text-on-background outline-none transition"
          />
          <AppActionButton
            type="submit"
            :loading="isCreatingComment"
            :disabled="!replyContentText.trim() || isCreatingComment"
            label="Responder"
            loading-text="Enviando..."
            spinner-size="xs"
            class="bg-secondary hover:bg-secondary/90 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm"
          />
        </form>

        <div
          v-if="node.children && node.children.length > 0"
          class="ml-6 md:ml-8 mt-3 border-l-2 border-outline-variant/30 pl-4 space-y-3"
        >
          <div
            v-for="reply in node.children"
            :key="reply.id"
            class="p-3 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/30 rounded-xl space-y-2"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 flex-grow">
                <div
                  class="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-[10px] shrink-0"
                >
                  {{ reply.user.charAt(0).toUpperCase() }}
                </div>
                <div class="flex items-center justify-between w-full pr-2">
                  <h5 class="text-[11px] font-bold text-on-background">
                    {{ reply.user }}
                  </h5>
                  <span
                    class="text-[9px] text-on-surface-variant dark:text-slate-300 whitespace-nowrap"
                    >{{ formatDate(reply.createdAt) }}</span
                  >
                </div>
              </div>

              <button
                v-if="canDeleteComment(reply)"
                type="button"
                :disabled="isDeletingComment?.(reply.id)"
                @click="$emit('deleteComment', reply.id)"
                class="text-rose-600 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded-md transition inline-flex items-center justify-center"
                title="Eliminar respuesta"
              >
                <span
                  v-if="isDeletingComment?.(reply.id)"
                  class="w-3 h-3 border-2 border-current/20 border-t-current rounded-full animate-spin"
                  aria-hidden="true"
                ></span>
                <span v-else class="material-symbols-outlined text-xs"
                  >delete</span
                >
              </button>
            </div>
            <p
              class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
            >
              {{ reply.text }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface CommentNode {
  id: string;
  user: string;
  userId?: string;
  text: string;
  createdAt: string;
  children?: CommentNode[];
}

defineProps<{
  totalComments: number;
  newCommentText: string;
  isCreatingComment: boolean;
  commentTree: CommentNode[];
  replyingToCommentId: string | null;
  replyContentText: string;
  canDeleteComment: (c: CommentNode) => boolean;
  isDeletingComment?: (id: string) => boolean;
  formatDate: (dateString: string) => string;
}>();

defineEmits<{
  (e: "submitComment"): void;
  (e: "update:newCommentText", value: string): void;
  (e: "deleteComment", id: string): void;
  (e: "toggleReplyForm", id: string): void;
  (e: "submitReply", id: string): void;
  (e: "update:replyContentText", value: string): void;
}>();
</script>
