<template>
  <div
    class="lg:col-span-7 flex flex-col h-full bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800"
  >
    <template v-if="activeChat">
      <!-- Header for active chat -->
      <div
        class="p-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/20"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs"
          >
            {{ activeChat.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h2
              class="text-xs font-bold text-on-background dark:text-slate-100"
            >
              {{ activeChat.name }}
            </h2>
            <p class="text-[11px] text-on-surface-variant dark:text-slate-300">
              {{ activeChat.jobTitle }} •
              <span class="text-primary font-semibold">{{
                activeChat.status
              }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Chat messages area -->
      <div
        ref="messageContainer"
        class="flex-grow p-4 overflow-y-auto max-h-[420px] flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-950/40"
      >
        <div
          v-if="isLoadingMessages"
          class="text-center text-xs text-slate-400 my-4"
        >
          Cargando mensajes...
        </div>
        <div
          v-else-if="messages.length === 0"
          class="text-center text-xs text-slate-400 my-8"
        >
          ¡Di hola! Escribe un mensaje para iniciar la conversación.
        </div>

        <!-- Messages list -->
        <div
          v-for="msg in messages"
          :key="msg.createdAt + (msg.text || '')"
          :class="[
            'flex gap-3 max-w-[85%]',
            msg.senderId === userId ? 'ml-auto justify-end' : '',
          ]"
        >
          <!-- Avatar only for recipient message -->
          <div
            v-if="msg.senderId !== userId"
            class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0"
          >
            {{ activeChat.name.charAt(0).toUpperCase() }}
          </div>

          <!-- Message container -->
          <div
            :class="[
              'p-3.5 rounded-2xl text-xs leading-relaxed transition',
              msg.senderId === userId
                ? 'bg-primary text-white rounded-tr-none shadow-sm shadow-primary/15'
                : 'bg-surface-container-low dark:bg-slate-800 border border-outline-variant/30 rounded-tl-none text-on-surface dark:text-slate-100',
            ]"
          >
            <p v-if="msg.text" class="whitespace-pre-wrap">
              {{ msg.text }}
            </p>

            <!-- Attachment Rendering -->
            <div v-if="msg.attachmentUrl" class="mt-2">
              <div
                v-if="
                  msg.attachmentType === 'image' ||
                  isImageUrl(msg.attachmentUrl)
                "
                class="rounded-xl overflow-hidden border border-white/20 max-w-[220px]"
              >
                <img
                  :src="msg.attachmentUrl"
                  alt="Adjunto"
                  class="w-full h-auto object-cover max-h-[180px] cursor-pointer hover:opacity-90 transition"
                  @click="openImagePreview(msg.attachmentUrl)"
                />
              </div>
              <a
                v-else
                :href="msg.attachmentUrl"
                target="_blank"
                rel="noopener"
                class="flex items-center gap-2 p-2.5 rounded-xl bg-black/10 hover:bg-black/20 text-current transition font-medium border border-white/10"
              >
                <span class="material-symbols-outlined text-base"
                  >description</span
                >
                <span class="truncate max-w-[150px] text-[11px]">{{
                  msg.attachmentName || "Documento Adjunto"
                }}</span>
                <span class="material-symbols-outlined text-xs ml-auto"
                  >download</span
                >
              </a>
            </div>

            <span
              :class="[
                'block text-[9px] mt-1.5 text-right',
                msg.senderId === userId
                  ? 'text-white/80'
                  : 'text-on-surface-variant dark:text-slate-300/80',
              ]"
            >
              {{ formatTime(msg.createdAt) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Message input bar -->
      <div
        class="p-4 border-t border-outline-variant/60 bg-surface-container-low/25 flex items-center gap-3"
      >
        <!-- Hidden File Input -->
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          accept="image/*,.pdf,application/pdf"
          @change="handleFileUpload"
        />

        <!-- Attachment Button -->
        <button
          @click="triggerFileInput"
          :disabled="isUploading"
          class="w-10 h-10 rounded-xl bg-surface border border-outline-variant/60 hover:border-primary text-on-surface-variant dark:text-slate-300 flex items-center justify-center transition disabled:opacity-50"
          title="Adjuntar PDF o Imagen"
        >
          <span v-if="isUploading" class="animate-spin text-sm">⏳</span>
          <span v-else class="material-symbols-outlined text-lg"
            >attach_file</span
          >
        </button>

        <input
          v-model="newMessage"
          @keyup.enter="handleSend"
          type="text"
          placeholder="Escribe un mensaje..."
          class="flex-grow bg-surface dark:bg-slate-800 border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-xs text-on-background dark:text-slate-100 outline-none transition"
        />
        <button
          @click="handleSend"
          :disabled="!newMessage.trim() && !pendingAttachment"
          class="w-10 h-10 rounded-xl bg-primary hover:bg-primary-container text-white flex items-center justify-center transition active:scale-95 flex-shrink-0 disabled:opacity-50 shadow-sm"
        ><span class="material-symbols-outlined text-lg">send</span></button>
      </div>
    </template>

    <!-- Welcome detail view when no chat active -->
    <template v-else>
      <div
        class="flex-grow flex flex-col items-center justify-center p-8 text-center text-on-surface-variant dark:text-slate-300"
      >
        <span class="material-symbols-outlined text-[48px] text-outline mb-4"
          >forum</span
        >
        <p class="text-sm font-bold text-on-background dark:text-slate-100">
          Selecciona una conversación
        </p>
        <p class="text-xs text-on-surface-variant dark:text-slate-300 mt-1">
          Elige una postulación de la lista de la izquierda para conversar en
          tiempo real.
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref } from "vue";

const props = defineProps<{
  activeChat: any;
  messages: any[];
  isLoadingMessages: boolean;
  userId: string;
  isUploading: boolean;
  pendingAttachment: any;
  newMessage: string;
  isImageUrl: (url: string) => boolean;
  openImagePreview: (url: string) => void;
  formatTime: (isoString: string) => string;
}>();

const emit = defineEmits<{
  "update:newMessage": [value: string];
  "handle-send": [];
  "handle-file-upload": [event: Event];
  "set-message-container": [el: HTMLElement | null];
  "set-file-input": [el: HTMLInputElement | null];
}>();

const newMessage = computed({
  get: () => props.newMessage,
  set: (val) => emit("update:newMessage", val),
});

const fileInput = ref<HTMLInputElement | null>(null);
const messageContainer = ref<HTMLElement | null>(null);

watch(fileInput, (val) => emit("set-file-input", val));
watch(messageContainer, (val) => emit("set-message-container", val));

onMounted(() => {
  emit("set-file-input", fileInput.value);
  emit("set-message-container", messageContainer.value);
});

const handleSend = () => emit("handle-send");
const handleFileUpload = (e: Event) => emit("handle-file-upload", e);
const triggerFileInput = () => fileInput.value?.click();
</script>

<style scoped>
div::-webkit-scrollbar {
  width: 4px;
}
div::-webkit-scrollbar-thumb {
  background: #c7c4d8;
  border-radius: 9999px;
}
</style>
