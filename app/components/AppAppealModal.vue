<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-200"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-surface dark:bg-slate-900 border border-outline-variant/60 rounded-2xl sm:rounded-3xl max-w-2xl w-full flex flex-col h-[90dvh] sm:h-[650px] max-h-[92vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 min-h-0"
    >
      <!-- Header (Identical to Messages.vue Header) -->
      <div
        class="flex-shrink-0 p-3.5 sm:p-4 border-b border-outline-variant/60 bg-surface-container-low/20 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold text-sm flex-shrink-0"
          >
            <span class="material-symbols-outlined text-xl">gavel</span>
          </div>
          <div>
            <h3
              class="text-xs font-bold text-on-background dark:text-slate-100 flex items-center gap-2"
            >
              Canal de Apelación 1-a-1
              <span
                class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
              >
                {{ statusText }}
              </span>
            </h3>
            <p class="text-[11px] text-on-surface-variant dark:text-slate-300">
              Atención directa en tiempo real vía WebSocket con Moderación
              JobNet
            </p>
          </div>
        </div>

        <button
          @click="closeModal"
          class="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant dark:text-slate-300 flex items-center justify-center transition"
          aria-label="Cerrar modal"
        >
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <!-- Info Banner / Counter -->
      <div
        class="flex-shrink-0 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900 dark:text-amber-200 font-medium"
      >
        <div class="flex items-center gap-2 truncate">
          <span class="material-symbols-outlined text-base text-amber-600"
            >shield</span
          >
          <span
            >Motivo:
            {{ reason || "Proceso de revisión por infracción de normas" }}</span
          >
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span
            class="font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[11px]"
          >
            {{ orgMessageCount }} / 3 Mensajes enviadas
          </span>
          <span
            v-if="orgMessageCount < 3"
            class="text-[10px] text-amber-700 dark:text-amber-400 font-bold"
          >
            (Faltan {{ 3 - orgMessageCount }})
          </span>
          <span
            v-else
            class="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5"
          >
            <span class="material-symbols-outlined text-xs">check_circle</span>
            Listo
          </span>
        </div>
      </div>

      <!-- Messages Scroll Area (Identical to Messages.vue) -->
      <div
        ref="chatContainer"
        class="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-950/40"
      >
        <div
          v-if="isLoading"
          class="p-8 text-center text-xs text-on-surface-variant"
        >
          Cargando conversación de apelación...
        </div>

        <div
          v-else-if="messages.length === 0"
          class="p-8 text-center text-xs text-on-surface-variant space-y-2"
        >
          <span
            class="material-symbols-outlined text-3xl opacity-40 text-amber-600"
            >gavel</span
          >
          <p class="font-bold">No hay mensajes previos en este canal</p>
          <p>
            Escribe tu justificación para comunicarte con el equipo de
            moderación.
          </p>
        </div>

        <div
          v-else
          v-for="msg in messages"
          :key="msg.id || msg.createdAt"
          :class="[
            'flex gap-3 max-w-[85%]',
            isMyMessage(msg) ? 'ml-auto justify-end' : '',
          ]"
        >
          <!-- Avatar for moderator message -->
          <div
            v-if="!isMyMessage(msg)"
            class="w-8 h-8 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs flex-shrink-0"
          >
            M
          </div>

          <div
            :class="[
              'p-3.5 rounded-2xl text-xs leading-relaxed transition',
              isMyMessage(msg)
                ? 'bg-primary text-white rounded-tr-none shadow-sm shadow-primary/15'
                : 'bg-surface-container-low dark:bg-slate-800 border border-outline-variant/30 rounded-tl-none text-on-surface dark:text-slate-100',
            ]"
          >
            <div
              v-if="!isMyMessage(msg)"
              class="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-rose-600 dark:text-rose-400"
            >
              <span class="material-symbols-outlined text-xs">policy</span>
              <span>Equipo de Moderación</span>
            </div>
            <p v-if="msg.text" class="whitespace-pre-wrap">{{ msg.text }}</p>

            <!-- Attachment Rendering (Identical to Messages.vue) -->
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
                isMyMessage(msg)
                  ? 'text-white/80'
                  : 'text-on-surface-variant dark:text-slate-300/80',
              ]"
            >
              {{ msg.time }}
            </span>
          </div>
        </div>
      </div>

      <!-- Message Input Bar (Identical to Messages.vue) -->
      <div
        class="flex-shrink-0 sticky bottom-0 z-10 p-2.5 sm:p-3.5 border-t border-outline-variant/60 bg-surface-container-lowest dark:bg-slate-900 flex items-center gap-2 sm:gap-3"
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
          class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface border border-outline-variant/60 hover:border-primary text-on-surface-variant dark:text-slate-300 flex items-center justify-center transition disabled:opacity-50 flex-shrink-0"
          title="Adjuntar PDF o Imagen"
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
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Escribe tu justificación o evidencia para moderación..."
          class="flex-grow bg-surface dark:bg-slate-800 border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs text-on-background dark:text-slate-100 outline-none transition"
        />
        <button
          @click="sendMessage"
          :disabled="!newMessageText.trim() && !pendingAttachment"
          class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary hover:bg-primary-container text-white flex items-center justify-center transition active:scale-95 flex-shrink-0 disabled:opacity-50 shadow-sm"
        >
          <span class="material-symbols-outlined text-lg">send</span>
        </button>
      </div>

      <!-- Footer Link to Full Page -->
      <div
        class="flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 bg-surface-container-low/30 border-t border-outline-variant/40 flex items-center justify-between text-[11px] text-on-surface-variant"
      >
        <span>Canal privado 1-a-1 cifrado en tránsito</span>
        <NuxtLink
          to="/support"
          @click="closeModal"
          class="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>Ver Pantalla Completa</span>
          <span class="material-symbols-outlined text-xs">open_in_new</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppFeedback } from "~/composables/useAppFeedback";
import type { AppealMessage, AppealAttachment } from "~/types";
import { apiFetch } from "~/composables/useApiClient";
const { showError, showSuccess, showInfo } = useAppFeedback();

const props = defineProps<{
  isOpen: boolean;
  companyId: string;
  targetId?: string;
  reason?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const config = useRuntimeConfig();
const { data: session, getSession } = useAuth();
const { uploadFile, uploadError: s3UploadError } = useS3Upload();

const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const pendingAttachment = ref<AppealAttachment | null>(null);

const userId = computed(() => session.value?.user?.id || props.companyId);

const newMessageText = ref("");
const chatContainer = ref<HTMLDivElement | null>(null);
const isLoading = ref(false);
const isSending = ref(false);
const statusText = ref("En revisión");

const socket = ref<WebSocket | null>(null);
const wsConnected = ref(false);
const messages = ref<AppealMessage[]>([]);

const orgMessageCount = computed(() => {
  return messages.value.filter((m) => m.senderId === props.companyId).length;
});

const isMyMessage = (msg: { senderId: string }) => {
  return msg.senderId === props.companyId || msg.senderId === userId.value;
};

const closeModal = () => {
  emit("close");
};

const fetchAppealMessages = async () => {
  if (!props.companyId) return;
  isLoading.value = true;
  const compId = props.targetId || props.companyId;

  try {
    await apiFetch(
      `/moderator/organizations/${compId}/join-appeal`,
      { method: "POST" },
    ).catch(() => {});

    const data = await apiFetch<any[]>(
      `/moderator/appeals/${compId}/messages`,
    ).catch(() => []);

    messages.value = (data || []).map((m) => ({
      id: `m-${m.createdAt}`,
      companyId: props.companyId,
      senderId: m.senderId,
      text: m.text,
      attachmentUrl: m.attachmentUrl || null,
      attachmentType: m.attachmentType || null,
      attachmentName: m.attachmentName || null,
      timestamp: m.createdAt || Date.now(),
      time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  } catch (err) {
    console.error("Error fetching appeal messages:", err);
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

const connectWebSocket = async () => {
  if (socket.value) {
    socket.value.onclose = null;
    socket.value.close();
    socket.value = null;
  }

  const currentSession = await getSession().catch(() => null);
  const s = currentSession || session.value;
  const token =
    s?.user?.idToken ||
    (s as Record<string, any>)?.idToken ||
    (s as Record<string, any>)?.accessToken ||
    "";

  if (!token) {
    console.warn("No token available for Company Appeal WebSocket connection.");
    return;
  }

  try {
    const wsUrl = `${config.public.wsUrl}?token=${token}`;
    socket.value = new WebSocket(wsUrl);

    socket.value.onopen = () => {
      wsConnected.value = true;
      console.log("Company Appeal WebSocket connected.");
    };

    socket.value.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (
          payload.type === "APPEAL_MESSAGE" ||
          payload.action === "receiveMessage"
        ) {
          const {
            senderId,
            text,
            attachmentUrl,
            attachmentType,
            attachmentName,
            createdAt,
            messageId: incomingMsgId,
          } = payload;
          const timeStr = new Date(createdAt || Date.now()).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" },
          );

          // Deduplication: check by messageId first (robust), then fall back to createdAt
          const isDuplicate = messages.value.some((m) => {
            if (incomingMsgId && m.messageId && m.messageId === incomingMsgId)
              return true;
            if (m.createdAt && createdAt && m.createdAt === createdAt)
              return true;
            return false;
          });

          if (!isDuplicate) {
            messages.value.push({
              id: `m-ws-${Date.now()}`,
              messageId: incomingMsgId || null,
              companyId: props.companyId,
              senderId,
              text,
              attachmentUrl: attachmentUrl || null,
              attachmentType: attachmentType || null,
              attachmentName: attachmentName || null,
              createdAt: createdAt || new Date().toISOString(),
              time: timeStr,
            });
            scrollToBottom();
          }
        } else if (payload.type === "APPEAL_RESOLVED") {
          const dictamen =
            payload.status === "CANCELLED"
              ? "Su apelación fue APROBADA y la cuenta ha sido reactivada."
              : "Su apelación fue RECHAZADA. La cuenta ha sido suspendida definitivamente.";
          showInfo("Notificación", `Resolución de Apelación:\n\n${dictamen}`);
          closeModal();
        }
      } catch (e) {
        console.error("Error handling appeal WS message:", e);
      }
    };

    socket.value.onclose = () => {
      wsConnected.value = false;
      console.log(
        "Company Appeal WebSocket closed. Attempting reconnect in 3s...",
      );
      setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };
  } catch (err) {
    console.warn("WebSocket error:", err);
  }
};

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
      "Solo se permiten archivos en formato PDF o Imágenes (JPG, PNG, WebP, GIF);.",
    );
    if (fileInput.value) fileInput.value.value = "";
    return;
  }

  isUploading.value = true;

  try {
    const uploadRes = await uploadFile(file, {
      folder: "appeal",
      userId: userId.value || "user",
    });

    if (uploadRes && uploadRes.url) {
      pendingAttachment.value = {
        url: uploadRes.url,
        type: isImg ? "image" : "file",
        name: file.name,
      };

      await sendMessage();
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

const sendMessage = async () => {
  const text = newMessageText.value.trim();
  const attachment = pendingAttachment.value;
  if ((!text && !attachment) || !props.companyId || isSending.value) return;
  isSending.value = true;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const messageId = crypto.randomUUID();

  messages.value.push({
    id: `m-user-${Date.now()}`,
    messageId,
    companyId: props.companyId,
    senderId: props.companyId,
    text,
    attachmentUrl: attachment?.url || null,
    attachmentType: attachment?.type || null,
    attachmentName: attachment?.name || null,
    createdAt: now.toISOString(),
    time: timeStr,
  });

  newMessageText.value = "";
  pendingAttachment.value = null;

  // Use WS if open; fallback to HTTP only if WS is closed/disconnected
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    try {
      socket.value.send(
        JSON.stringify({
          action: "sendMessage",
          appealId: props.targetId || props.companyId,
          appealCompanyId: props.companyId,
          messageId,
          text: text || "",
          attachmentUrl: attachment?.url || null,
          attachmentType: attachment?.type || null,
          attachmentName: attachment?.name || null,
        }),
      );
    } catch (wsErr) {
      console.warn("WebSocket send exception, executing HTTP fallback:", wsErr);
      await sendHttpFallback(props.companyId, text, attachment, messageId);
    }
  } else {
    await sendHttpFallback(props.companyId, text, attachment, messageId);
  }

  isSending.value = false;
  scrollToBottom();
};

const sendHttpFallback = async (
  compId: string,
  text: string,
  attachment: any,
  messageId?: string,
) => {
  try {
    const token =
      session.value?.user?.idToken ||
      (session.value as Record<string, any>)?.idToken ||
      (session.value as Record<string, any>)?.accessToken ||
      "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const compId = props.targetId || props.companyId;
    await $fetch(
      `${config.public.apiUrl}/moderator/appeals/${compId}/messages`,
      {
        method: "POST",
        headers,
        body: {
          text: text || "",
          companyId: props.companyId,
          senderId: userId.value,
          messageId: messageId || undefined,
          attachmentUrl: attachment?.url || undefined,
          attachmentType: attachment?.type || undefined,
          attachmentName: attachment?.name || undefined,
        },
      },
    );
  } catch (e) {
    console.warn("HTTP appeal message post fallback notice:", e);
  }
};

const isImageUrl = (url?: string) => {
  if (!url) return false;
  const cleanUrl = url.split("?")[0];
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleanUrl);
};

const openImagePreview = (url: string) => {
  window.open(url, "_blank");
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      fetchAppealMessages();
      connectWebSocket();
    }
  },
);

onMounted(() => {
  if (props.isOpen) {
    fetchAppealMessages();
    connectWebSocket();
  }
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});
</script>
