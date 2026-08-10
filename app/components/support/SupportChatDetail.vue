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
            class="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold text-xs"
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
              Motivo: {{ activeChat.reason }} •
              <span class="text-amber-600 dark:text-amber-400 font-semibold">{{
                activeChat.status || "En revisión"
              }}</span>
            </p>
          </div>
        </div>

        <!-- Action Buttons for Moderator / Badge for Org -->
        <div class="flex items-center gap-2">
          <template v-if="isModeratorRole">
            <button
              @click="$emit('resolveOrgAppeal', 'approve')"
              :disabled="isProcessingAction"
              class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm disabled:opacity-40"
              title="Aprobar Apelación (Reactivar Organización)"
            >
              <span class="material-symbols-outlined text-[16px]"
                >check_circle</span
              >
              Aprobar
            </button>
            <button
              @click="$emit('resolveOrgAppeal', 'confirm')"
              :disabled="isProcessingAction"
              class="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm disabled:opacity-40"
              title="Confirmar Suspensión Definitiva"
            >
              <span class="material-symbols-outlined text-[16px]">cancel</span>
              Sancionar
            </button>
          </template>
          <template v-else>
            <span
              class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
            >
              {{ orgMessageCount }} / 3 Mensajes enviadas
            </span>
          </template>
        </div>
      </div>

      <!-- Notice Banner for Organization Grace Period & 3-Message Requirement -->
      <div
        v-if="isOrganization"
        class="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 font-medium flex items-center justify-between gap-2"
      >
        <span class="flex items-center gap-1.5 truncate">
          <span class="material-symbols-outlined text-sm text-amber-600"
            >shield</span
          >
          <span
            >Debes enviar al menos 3 mensajes con tu justificación o evidencia
            para permitir el dictamen.</span
          >
        </span>
        <span
          v-if="orgMessageCount < 3"
          class="text-[10px] text-amber-700 dark:text-amber-400 font-bold flex-shrink-0"
        >
          (Faltan {{ 3 - orgMessageCount }})
        </span>
        <span
          v-else
          class="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5 flex-shrink-0"
        >
          <span class="material-symbols-outlined text-xs">check_circle</span>
          Cumplido
        </span>
      </div>

      <!-- Chat messages area -->
      <div
        ref="localChatContainer"
        class="flex-grow p-4 overflow-y-auto max-h-[450px] flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-950/40"
      >
        <div
          v-if="isLoadingMessages"
          class="text-center text-xs text-slate-400 my-4"
        >
          Cargando historial de mensajes...
        </div>
        <div
          v-else-if="messages.length === 0"
          class="text-center text-xs text-slate-400 my-8"
        >
          ¡Di hola! Escribe un mensaje para presentar la evidencia de tu
          apelación.
        </div>

        <!-- Messages list -->
        <div
          v-for="msg in messages"
          :key="msg.id || msg.createdAt"
          :class="[
            'flex gap-3 max-w-[85%]',
            isMyMessage(msg) ? 'ml-auto justify-end' : '',
          ]"
        >
          <!-- Avatar for recipient message -->
          <div
            v-if="!isMyMessage(msg)"
            class="w-8 h-8 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs flex-shrink-0"
          >
            {{ (activeChat.name || "M").charAt(0).toUpperCase() }}
          </div>

          <!-- Message container -->
          <div
            :class="[
              'p-3.5 rounded-2xl text-xs leading-relaxed transition',
              isMyMessage(msg)
                ? 'bg-primary text-white rounded-tr-none shadow-sm shadow-primary/15'
                : 'bg-surface-container-low dark:bg-slate-800 border border-outline-variant/30 rounded-tl-none text-on-surface dark:text-slate-100',
            ]"
          >
            <div
              v-if="!isMyMessage(msg) && isOrganization"
              class="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-rose-600 dark:text-rose-400"
            >
              <span class="material-symbols-outlined text-xs">policy</span>
              <span>Equipo de Moderación</span>
            </div>

            <p v-if="msg.text" class="whitespace-pre-wrap">{{ msg.text }}</p>

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
                  @click="$emit('openImagePreview', msg.attachmentUrl)"
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
                isMyMessage(msg)
                  ? 'text-white/80'
                  : 'text-on-surface-variant dark:text-slate-300/80',
              ]"
            >
              {{ msg.time || formatTime(msg.createdAt) }}
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
          ref="localFileInput"
          class="hidden"
          accept="image/*,.pdf,application/pdf"
          @change="$emit('handleFileUpload', $event)"
        />

        <!-- Attachment Button -->
        <button
          @click="triggerLocalFileInput"
          :disabled="isUploading"
          class="w-10 h-10 rounded-xl bg-surface border border-outline-variant/60 hover:border-primary text-on-surface-variant dark:text-slate-300 flex items-center justify-center transition disabled:opacity-50 flex-shrink-0"
          title="Adjuntar PDF o Imagen"
        >
          <span v-if="isUploading" class="animate-spin text-sm">⏳</span>
          <span v-else class="material-symbols-outlined text-lg"
            >attach_file</span
          >
        </button>

        <input
          :value="newMessageText"
          @input="
            $emit(
              'update:newMessageText',
              ($event.target as HTMLInputElement).value,
            )
          "
          @keyup.enter="$emit('sendMessage')"
          type="text"
          :placeholder="
            isModeratorRole
              ? 'Escribe una respuesta para la organización...'
              : 'Escribe tu mensaje para el equipo de moderación...'
          "
          class="flex-grow bg-surface dark:bg-slate-800 border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-xs text-on-background dark:text-slate-100 outline-none transition"
        />
        <button
          @click="$emit('sendMessage')"
          :disabled="!newMessageText.trim() && !pendingAttachment"
          class="w-10 h-10 rounded-xl bg-primary hover:bg-primary-container text-white flex items-center justify-center transition active:scale-95 flex-shrink-0 disabled:opacity-50 shadow-sm"
        >
          <span class="material-symbols-outlined text-lg">send</span>
        </button>
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
          Selecciona un canal de apelación
        </p>
        <p class="text-xs text-on-surface-variant dark:text-slate-300 mt-1">
          Elige uno de los casos de la lista de la izquierda para ingresar al
          chat privado 1-a-1.
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = defineProps<{
  activeChat: any;
  isModeratorRole: boolean;
  isProcessingAction: boolean;
  orgMessageCount: number;
  isOrganization: boolean;
  isLoadingMessages: boolean;
  messages: any[];
  isMyMessage: (msg: any) => boolean;
  isUploading: boolean;
  pendingAttachment: any;
  newMessageText: string;
  isImageUrl: (url?: string) => boolean;
  formatTime: (dateStr?: string) => string;
}>();

const emit = defineEmits<{
  (e: "resolveOrgAppeal", action: "approve" | "confirm"): void;
  (e: "triggerFileInput"): void;
  (e: "handleFileUpload", event: Event): void;
  (e: "sendMessage"): void;
  (e: "openImagePreview", url: string): void;
  (e: "update:newMessageText", value: string): void;
  (e: "updateContainerRef", ref: HTMLDivElement | null): void;
  (e: "updateFileInputRef", ref: HTMLInputElement | null): void;
}>();

const localChatContainer = ref<HTMLDivElement | null>(null);
const localFileInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  emit("updateContainerRef", localChatContainer.value);
  emit("updateFileInputRef", localFileInput.value);
});

watch(localChatContainer, (newVal) => {
  emit("updateContainerRef", newVal);
});

watch(localFileInput, (newVal) => {
  emit("updateFileInputRef", newVal);
});

const triggerLocalFileInput = () => {
  if (localFileInput.value) {
    localFileInput.value.click();
  } else {
    emit("triggerFileInput");
  }
};
</script>
