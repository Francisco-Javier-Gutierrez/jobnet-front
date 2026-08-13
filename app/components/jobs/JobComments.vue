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
          class="bg-primary hover:bg-primary-container text-white disabled:bg-primary/40 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
        >
          Publicar Pregunta
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
            @click="$emit('deleteComment', node.id)"
            class="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
            title="Eliminar pregunta"
          >
            <span class="material-symbols-outlined text-sm">delete</span>
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
          <button
            type="submit"
            :disabled="!replyContentText.trim() || isCreatingComment"
            class="bg-secondary text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm"
          >
            Responder
          </button>
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
                @click="$emit('deleteComment', reply.id)"
                class="text-rose-600 hover:bg-rose-50 p-1 rounded-md transition"
                title="Eliminar respuesta"
              >
                <span class="material-symbols-outlined text-xs">delete</span>
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
defineProps<{
  totalComments: number;
  newCommentText: string;
  isCreatingComment: boolean;
  commentTree: any[];
  replyingToCommentId: string | null;
  replyContentText: string;
  canDeleteComment: (c: any) => boolean;
  formatDate: (dateString: string) => string;
}>();

defineEmits([
  "submitComment",
  "update:newCommentText",
  "deleteComment",
  "toggleReplyForm",
  "submitReply",
  "update:replyContentText",
]);
</script>
