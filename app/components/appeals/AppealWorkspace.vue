<template>
  <div
    class="lg:col-span-7 flex flex-col h-full bg-surface-container-lowest dark:bg-slate-900"
  >
    <template v-if="activeAppeal">
      <!-- Chat Header & Dictamen Actions -->
      <div
        class="p-4 border-b border-outline-variant/60 flex flex-wrap items-center justify-between gap-3 bg-surface-container-low/20"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm flex-shrink-0"
          >
            {{ activeAppeal.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2
                class="text-xs font-bold text-on-background dark:text-slate-100"
              >
                {{ activeAppeal.name }}
              </h2>
              <span
                class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20"
              >
                {{ activeAppeal.type || "ORGANIZACION" }}
              </span>
            </div>
            <p class="text-[10px] text-on-surface-variant dark:text-slate-300">
              Motivo: {{ activeAppeal.reason }}
            </p>
          </div>
        </div>

        <!-- Dictamen Action Buttons ALWAYS visible for Moderator -->
        <div class="flex items-center gap-2">
          <template v-if="activeAppeal.type === 'VACANTE'">
            <button
              @click="$emit('resolve-vacancy', 'approve')"
              :disabled="isProcessingAction"
              class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm disabled:opacity-40"
              title="Aprobar y reactivar la vacante en la plataforma"
            >
              <span class="material-symbols-outlined text-[16px]"
                >check_circle</span
              >
              Aprobar Vacante
            </button>
            <button
              @click="$emit('resolve-vacancy', 'block')"
              :disabled="isProcessingAction"
              class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm disabled:opacity-40"
              title="Mantener sanción y cerrar vacante definitivamente"
            >
              <span class="material-symbols-outlined text-[16px]">block</span>
              Sancionar
            </button>
          </template>

          <template v-else>
            <button
              @click="$emit('resolve-org', 'approve')"
              :disabled="isProcessingAction"
              class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm disabled:opacity-40"
              title="Aprobar apelación y reactivar cuenta de la organización"
            >
              <span class="material-symbols-outlined text-[16px]"
                >check_circle</span
              >
              Aprobar Apelación
            </button>
            <button
              @click="$emit('resolve-org', 'confirm')"
              :disabled="isProcessingAction"
              class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm disabled:opacity-40"
              title="Confirmar suspensión permanente de la organización"
            >
              <span class="material-symbols-outlined text-[16px]">cancel</span>
              Confirmar Suspensión
            </button>
          </template>
        </div>
      </div>

      <!-- Counter Banner -->
      <div
        class="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200"
      >
        <span class="flex items-center gap-1 font-medium">
          <span class="material-symbols-outlined text-base text-amber-600"
            >shield</span
          >
          <span>Mensajes de evidencia presentados por el apelante:</span>
        </span>
        <span
          class="font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[11px]"
        >
          {{ orgMessageCount }} / 3 Mensajes
        </span>
      </div>

      <!-- Messages Scroll Area -->
      <div
        ref="chatContainerRef"
        class="flex-grow p-4 overflow-y-auto max-h-[440px] flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-950/40"
      >
        <div
          v-if="activeAppeal.messages.length === 0"
          class="text-center text-xs text-slate-400 my-8"
        >
          No hay mensajes previos en este canal. Escribe para iniciar el diálogo
          de apelación.
        </div>

        <div
          v-for="msg in activeAppeal.messages"
          :key="msg.id || msg.createdAt"
          :class="[
            'flex gap-3 max-w-[85%]',
            isModeratorSender(msg) ? 'ml-auto justify-end' : '',
          ]"
        >
          <!-- Avatar for Company / Recipient -->
          <div
            v-if="!isModeratorSender(msg)"
            class="w-8 h-8 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs flex-shrink-0"
          >
            {{ activeAppeal.name.charAt(0).toUpperCase() }}
          </div>

          <div
            :class="[
              'p-3.5 rounded-2xl text-xs leading-relaxed transition',
              isModeratorSender(msg)
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm shadow-indigo-600/15'
                : 'bg-surface-container-low dark:bg-slate-800 border border-outline-variant/30 rounded-tl-none text-on-surface dark:text-slate-100',
            ]"
          >
            <div
              v-if="isModeratorSender(msg)"
              class="flex items-center gap-1 mb-1 text-[10px] font-bold text-white/90"
            >
              <span class="material-symbols-outlined text-xs">policy</span>
              <span>Moderación JobNet (Tú)</span>
            </div>

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
                isModeratorSender(msg)
                  ? 'text-white/80'
                  : 'text-on-surface-variant dark:text-slate-300/80',
              ]"
            >
              {{ msg.time }}
            </span>
          </div>
        </div>
      </div>

      <!-- Message Input Bar with Attachments -->
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

        <!-- Attachment Button (attach_file icon) -->
        <button
          @click="triggerFileInput"
          :disabled="isUploading"
          class="w-10 h-10 rounded-xl bg-surface border border-outline-variant/60 hover:border-indigo-600 text-on-surface-variant dark:text-slate-300 flex items-center justify-center transition disabled:opacity-50 flex-shrink-0"
          title="Adjuntar PDF o Imagen de evidencia"
        >
          <span
            v-if="isUploading"
            class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
            aria-hidden="true"
          ></span>
          <span v-else class="material-symbols-outlined text-lg"
            >attach_file</span
          >
        </button>

        <input
          v-model="newMessageText"
          @keyup.enter="handleSendMessage"
          type="text"
          placeholder="Escribe una respuesta para la organización en apelación..."
          class="flex-grow bg-surface dark:bg-slate-800 border border-outline-variant/60 hover:border-outline focus:border-indigo-600 rounded-xl px-4 py-3 text-xs text-on-background dark:text-slate-100 outline-none transition"
        />
        <button
          @click="handleSendMessage"
          :disabled="!newMessageText.trim() && !pendingAttachment"
          class="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition active:scale-95 flex-shrink-0 disabled:opacity-50 shadow-sm"
          title="Enviar mensaje"
        >
          <span class="material-symbols-outlined text-lg">send</span>
        </button>
      </div>
    </template>

    <!-- Empty state when no appeal selected -->
    <template v-else>
      <div
        class="flex-grow flex flex-col items-center justify-center p-8 text-center text-on-surface-variant dark:text-slate-300 h-full"
      >
        <div
          class="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400"
        >
          <span class="material-symbols-outlined text-[40px]">gavel</span>
        </div>
        <h3
          class="text-sm font-bold text-on-background dark:text-slate-100 mb-1"
        >
          Selecciona una solicitud de apelación
        </h3>
        <p class="text-xs text-on-surface-variant dark:text-slate-300 max-w-sm">
          Elige una organización o vacante del listado de la izquierda para
          moderar el caso y enviar dictamen.
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useS3Upload } from "~/composables/useS3Upload";
import { useAuth } from "#imports";
import { useAppFeedback } from "~/composables/useAppFeedback";
import type { Appeal, AppealMessage, AppealAttachment } from "~/types";

const props = defineProps<{
  activeAppeal: Appeal | null;
  isProcessingAction: boolean;
  orgMessageCount: number;
  isModeratorSender: (msg: AppealMessage) => boolean;
}>();

const emit = defineEmits<{
  (e: "resolve-org", action: "approve" | "confirm"): void;
  (e: "resolve-vacancy", action: "approve" | "block"): void;
  (e: "send-message", text: string, attachment: AppealAttachment | null): void;
  (e: "chat-ref", ref: HTMLDivElement | null): void;
}>();

const { uploadFile, uploadError: s3UploadError } = useS3Upload();
const { data: session } = useAuth();
const { showInfo, showError } = useAppFeedback();

const fileInput = ref<HTMLInputElement | null>(null);
const chatContainerRef = ref<HTMLDivElement | null>(null);
const isUploading = ref(false);
const pendingAttachment = ref<AppealAttachment | null>(null);
const newMessageText = ref("");

watch(chatContainerRef, (val) => {
  emit("chat-ref", val);
});

onMounted(() => {
  if (chatContainerRef.value) {
    emit("chat-ref", chatContainerRef.value);
  }
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  if (!file) return;

  const isImg =
    file.type.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);

  if (!isImg && !isPdf) {
    showInfo(
      "Notificación",
      "Solo se permiten archivos en formato PDF o Imágenes (JPG, PNG, WebP, GIF).",
    );
    if (fileInput.value) fileInput.value.value = "";
    return;
  }

  isUploading.value = true;
  const userId = session.value?.user?.id || "mod-user";

  try {
    const uploadRes = await uploadFile(file, { folder: "appeal", userId });

    if (uploadRes && uploadRes.url) {
      pendingAttachment.value = {
        url: uploadRes.url,
        type: isImg ? "image" : "file",
        name: file.name,
      };

      handleSendMessage();
    } else if (s3UploadError.value) {
      showError("Error", `Error al subir archivo: ${s3UploadError.value}`);
    }
  } catch (err: any) {
    console.error("Error uploading file to S3:", err);
    showError("Error", `Error al subir el archivo: ${err.message || err}`);
  } finally {
    isUploading.value = false;
    if (fileInput.value) fileInput.value.value = "";
  }
};

const handleSendMessage = () => {
  if (!newMessageText.value.trim() && !pendingAttachment.value) return;
  emit("send-message", newMessageText.value, pendingAttachment.value);
  newMessageText.value = "";
  pendingAttachment.value = null;
};

const isImageUrl = (url?: string) => {
  if (!url) return false;
  const cleanUrl = url.split("?")[0];
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleanUrl);
};

const openImagePreview = (url: string) => {
  window.open(url, "_blank");
};
</script>
