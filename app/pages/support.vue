<template>
  <div
    class="max-w-6xl mx-auto px-4 py-8 w-full flex-grow flex flex-col min-h-[calc(100vh-8rem)] bg-background"
    role="main"
  >
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1
          class="text-2xl font-bold text-on-background dark:text-slate-100 mb-2 flex items-center gap-2"
        >
          <span
            class="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl"
            >gavel</span
          >
          Soporte y Canales de Apelación 1-a-1
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Atención privada y resolución de disputas en tiempo real vía WebSocket
          con Moderación JobNet.
        </p>
      </div>
      <!-- Connection status badge -->
      <div class="flex items-center gap-2">
        <span
          :class="[
            'w-2.5 h-2.5 rounded-full',
            wsConnected
              ? 'bg-emerald-500 animate-pulse'
              : 'bg-amber-500 animate-pulse',
          ]"
        ></span>
        <span
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
        >
          {{ wsConnected ? "En línea (WebSocket)" : "Conectando..." }}
        </span>
      </div>
    </div>

    <!-- Main Chat Workspace Grid (Identical to 1-on-1 Messages.vue) -->
    <div
      class="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl flex-grow overflow-hidden min-h-[580px] shadow-sm animate-fadeIn"
    >
      <!-- Left Panel: Chat List (5 Cols) -->
      <div
        class="lg:col-span-5 border-r border-outline-variant/60 flex flex-col h-full bg-surface-container-low/40"
      >
        <!-- Search bar -->
        <div class="p-4 border-b border-outline-variant/60">
          <div class="relative">
            <span
              class="absolute left-3 top-2.5 material-symbols-outlined text-on-surface-variant dark:text-slate-300 text-lg"
              >search</span
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar apelaciones o chats..."
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-background dark:text-slate-100 outline-none transition"
            />
          </div>
        </div>

        <!-- Conversations List -->
        <div
          class="flex-grow overflow-y-auto max-h-[550px] divide-y divide-outline-variant/30"
        >
          <div
            v-if="isLoadingChats"
            class="p-8 text-center text-xs text-on-surface-variant dark:text-slate-300/80"
          >
            <span class="inline-block animate-spin mr-2">⏳</span> Cargando
            conversaciones de soporte...
          </div>
          <div
            v-else-if="filteredChats.length === 0"
            class="p-8 text-center text-xs text-on-surface-variant dark:text-slate-300"
          >
            No hay canales de apelación activos por el momento.
          </div>
          <div
            v-for="chat in filteredChats"
            :key="chat.id"
            @click="selectChat(chat)"
            :class="[
              'p-4 flex items-start gap-3 cursor-pointer transition hover:bg-surface-container-high/40',
              activeChat?.id === chat.id
                ? 'bg-amber-500/10 border-l-4 border-amber-600 font-semibold'
                : '',
            ]"
          >
            <div
              class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-700 dark:text-amber-300 font-bold text-sm"
            >
              {{ chat.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-grow min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3
                  class="text-xs font-bold text-on-background dark:text-slate-100 truncate"
                >
                  {{ chat.name }}
                </h3>
                <span
                  class="text-[10px] text-on-surface-variant dark:text-slate-300/80"
                  >{{ chat.time }}</span
                >
              </div>
              <p
                class="text-[11px] text-amber-700 dark:text-amber-400 font-semibold truncate mb-1"
              >
                {{ chat.reason }}
              </p>
              <p
                class="text-xs text-on-surface-variant dark:text-slate-300 truncate"
              >
                {{ chat.lastMessage || "Sin mensajes aún" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: 1-on-1 Chat Detail (7 Cols) -->
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
                <p
                  class="text-[11px] text-on-surface-variant dark:text-slate-300"
                >
                  Motivo: {{ activeChat.reason }} •
                  <span
                    class="text-amber-600 dark:text-amber-400 font-semibold"
                    >{{ activeChat.status || "En revisión" }}</span
                  >
                </p>
              </div>
            </div>

            <!-- Action Buttons for Moderator / Badge for Org -->
            <div class="flex items-center gap-2">
              <template v-if="isModeratorRole">
                <button
                  @click="resolveOrgAppeal('approve')"
                  :disabled="isProcessingAction"
                  class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm disabled:opacity-40"
                  title="Aprobar Apelación (Reactivar Empresa)"
                >
                  <span class="material-symbols-outlined text-[16px]"
                    >check_circle</span
                  >
                  Aprobar
                </button>
                <button
                  @click="resolveOrgAppeal('confirm')"
                  :disabled="isProcessingAction"
                  class="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm disabled:opacity-40"
                  title="Confirmar Suspensión Definitiva"
                >
                  <span class="material-symbols-outlined text-[16px]"
                    >cancel</span
                  >
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
                >Debes enviar al menos 3 mensajes con tu justificación o
                evidencia para permitir el dictamen.</span
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
              <span class="material-symbols-outlined text-xs"
                >check_circle</span
              >
              Cumplido
            </span>
          </div>

          <!-- Chat messages area -->
          <div
            ref="chatContainer"
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
              ref="fileInput"
              class="hidden"
              accept="image/*,.pdf,application/pdf"
              @change="handleFileUpload"
            />

            <!-- Attachment Button -->
            <button
              @click="triggerFileInput"
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
              v-model="newMessageText"
              @keyup.enter="sendMessage"
              type="text"
              :placeholder="
                isModeratorRole
                  ? 'Escribe una respuesta para la organización...'
                  : 'Escribe tu mensaje para el equipo de moderación...'
              "
              class="flex-grow bg-surface dark:bg-slate-800 border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-xs text-on-background dark:text-slate-100 outline-none transition"
            />
            <button
              @click="sendMessage"
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
            <span
              class="material-symbols-outlined text-[48px] text-outline mb-4"
              >forum</span
            >
            <p class="text-sm font-bold text-on-background dark:text-slate-100">
              Selecciona un canal de apelación
            </p>
            <p class="text-xs text-on-surface-variant dark:text-slate-300 mt-1">
              Elige uno de los casos de la lista de la izquierda para ingresar
              al chat privado 1-a-1.
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppFeedback } from "~/composables/useAppFeedback";
const { showError, showSuccess, showInfo } = useAppFeedback();
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";

useSeoMeta({
  title: "Soporte y Apelaciones 1-a-1 - JobNet",
  description:
    "Atención directa y canal de soporte 1-a-1 en tiempo real vía WebSocket para organizaciones y usuarios en JobNet",
});

const config = useRuntimeConfig();
const { data: session, getSession, status } = useAuth();
const { uploadFile, uploadError: s3UploadError } = useS3Upload();

const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const pendingAttachment = ref<{
  url: string;
  type: string;
  name: string;
} | null>(null);

const userId = computed(() => (session.value?.user as any)?.id || "");

const userRole = computed(() => {
  const user = session.value?.user as any;
  return (user?.tipoUsuario || user?.role || "").toUpperCase();
});

const isOrganization = computed(
  () =>
    userRole.value === "ORGANIZACION" ||
    userRole.value === "EMPRESA" ||
    userRole.value === "RECRUITER",
);

const isModeratorRole = computed(
  () => userRole.value === "MODERATOR" || userRole.value === "ADMIN",
);

const searchQuery = ref("");
const activeChat = ref<any>(null);
const newMessageText = ref("");
const chatContainer = ref<HTMLDivElement | null>(null);

const chats = ref<any[]>([]);
const messages = ref<any[]>([]);

const isLoadingChats = ref(true);
const isLoadingMessages = ref(false);
const isSending = ref(false);
const isProcessingAction = ref(false);

const socket = ref<WebSocket | null>(null);
const wsConnected = ref(false);

const orgMessageCount = computed(() => {
  if (!activeChat.value) return 0;
  const companyId = activeChat.value.companyId || activeChat.value.id;
  return messages.value.filter((m) => m.senderId === companyId).length;
});

const filteredChats = computed(() => {
  if (!searchQuery.value.trim()) return chats.value;
  const q = searchQuery.value.toLowerCase();
  return chats.value.filter(
    (c) =>
      c.name.toLowerCase().includes(q) || c.reason.toLowerCase().includes(q),
  );
});

const isMyMessage = (msg: any) => {
  if (isOrganization.value) {
    const compId = activeChat.value?.companyId || userId.value;
    return msg.senderId === compId;
  } else {
    // For Moderator: any message not sent by company is moderator message
    const compId = activeChat.value?.companyId || activeChat.value?.id;
    return msg.senderId !== compId;
  }
};

const fetchConversations = async () => {
  if (status.value !== "authenticated") return;
  isLoadingChats.value = true;

  try {
    if (isOrganization.value) {
      // Organization has 1-on-1 support chat with moderation
      await $fetch(
        `${config.public.apiUrl}/moderator/organizations/${userId.value}/join-appeal`,
        { method: "POST" },
      ).catch(() => {});

      const statusRes = await $fetch<any>(
        `${config.public.apiUrl}/moderator/organizations/${userId.value}/suspension-status`,
      ).catch(() => null);

      chats.value = [
        {
          id: userId.value,
          companyId: userId.value,
          name: "Soporte y Moderación JobNet",
          reason:
            statusRes?.reason || "Atención directa de apelación e infracciones",
          status: statusRes?.status || "En revisión",
          lastMessage: "",
          time: new Date().toLocaleDateString(),
        },
      ];
    } else {
      // Moderator / Admin View
      const data = await $fetch<any[]>(
        `${config.public.apiUrl}/moderator/appeals`,
      ).catch(() => []);

      chats.value = (data || []).map((item) => ({
        id: item.id || item.companyId,
        companyId: item.companyId || item.id,
        name: item.name || "Empresa en Apelación",
        reason: item.reason || "Revisión de infracción",
        status: item.status || "En revisión",
        lastMessage: "",
        time: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "Reciente",
      }));
    }

    if (chats.value.length > 0) {
      await selectChat(chats.value[0]);
    }
  } catch (err) {
    console.error("Error fetching appeal conversations:", err);
  } finally {
    isLoadingChats.value = false;
  }
};

const selectChat = async (chat: any) => {
  activeChat.value = chat;
  isLoadingMessages.value = true;
  messages.value = [];

  const compId = chat.companyId || chat.id;

  try {
    const data = await $fetch<any[]>(
      `${config.public.apiUrl}/moderator/organizations/${compId}/appeal-messages`,
    ).catch(() => []);

    messages.value = (data || []).map((m) => ({
      id: `m-${m.createdAt}`,
      companyId: m.companyId || compId,
      senderId: m.senderId,
      text: m.text,
      attachmentUrl: m.attachmentUrl || null,
      attachmentType: m.attachmentType || null,
      attachmentName: m.attachmentName || null,
      createdAt: m.createdAt,
      time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    if (messages.value.length > 0) {
      chat.lastMessage = messages.value[messages.value.length - 1].text;
    }

    scrollToBottom();
  } catch (e) {
    console.error("Error loading appeal messages:", e);
  } finally {
    isLoadingMessages.value = false;
  }
};

const resolveOrgAppeal = async (action: "approve" | "confirm") => {
  if (!activeChat.value || isProcessingAction.value) return;
  isProcessingAction.value = true;
  const compId = activeChat.value.companyId || activeChat.value.id;

  try {
    if (action === "approve") {
      await $fetch(
        `${config.public.apiUrl}/moderator/organizations/${compId}/cancel-suspension`,
        {
          method: "POST",
          body: { notes: "Apelación aprobada tras revisión en tiempo real" },
        },
      );
      showSuccess(
        "Éxito",
        "Apelación aprobada con éxito. La organización ha sido reactivada.",
      );
    } else {
      await $fetch(
        `${config.public.apiUrl}/moderator/organizations/${compId}/confirm-suspension`,
        {
          method: "POST",
          body: {
            reason: "Confirmación de suspensión tras evaluación de apelación",
          },
        },
      );
      showInfo(
        "Notificación",
        "Suspensión confirmada. La organización ha sido suspendida definitivamente.",
      );
    }
    chats.value = chats.value.filter((c) => (c.companyId || c.id) !== compId);
    activeChat.value = chats.value[0] || null;
    if (activeChat.value) {
      await selectChat(activeChat.value);
    }
  } catch (e) {
    console.error("Error resolving organization appeal:", e);
    showError("Error", "Hubo un error al procesar el dictamen.");
  } finally {
    isProcessingAction.value = false;
  }
};

const connectWebSocket = async () => {
  const currentSession = await getSession().catch(() => null);
  const token =
    (currentSession as any)?.idToken || (session.value as any)?.idToken || "";
  if (!token) return;

  try {
    const wsUrl = `${config.public.wsUrl}?token=${token}`;
    socket.value = new WebSocket(wsUrl);

    socket.value.onopen = () => {
      wsConnected.value = true;
    };

    socket.value.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (
          payload.type === "APPEAL_MESSAGE" ||
          payload.action === "receiveMessage"
        ) {
          const {
            appealCompanyId,
            senderId,
            text,
            attachmentUrl,
            createdAt,
            messageId: incomingMsgId,
          } = payload;

          const activeCompId =
            activeChat.value?.companyId || activeChat.value?.id;

          if (
            activeCompId &&
            (appealCompanyId === activeCompId || !appealCompanyId)
          ) {
            const timeStr = new Date(
              createdAt || Date.now(),
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            // Deduplication: check by messageId first (robust), then fall back to text match
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
                companyId: activeCompId,
                senderId,
                text: text || "",
                attachmentUrl: attachmentUrl || null,
                createdAt: createdAt || new Date().toISOString(),
                time: timeStr,
              });
              scrollToBottom();
            }
          }
        } else if (payload.type === "APPEAL_RESOLVED") {
          const { appealCompanyId, status } = payload;
          const activeCompId =
            activeChat.value?.companyId || activeChat.value?.id;

          if (activeCompId && appealCompanyId === activeCompId) {
            activeChat.value.status = status;
          }

          const chatInList = chats.value.find(
            (c) => (c.companyId || c.id) === appealCompanyId,
          );
          if (chatInList) {
            chatInList.status = status;
          }
        }
      } catch (e) {
        console.error("Error handling appeal WS message:", e);
      }
    };

    socket.value.onclose = () => {
      wsConnected.value = false;
      console.log("Support WebSocket closed. Attempting reconnect in 3s...");
      setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };
  } catch (err) {
    console.warn("WebSocket connection error:", err);
  }
};

const msgIsMod = (m: any) => {
  const activeCompId = activeChat.value?.companyId || activeChat.value?.id;
  return m.senderId !== activeCompId;
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

const sendHttpFallback = async (
  compId: string,
  text: string,
  attachment: any,
  messageId?: string,
) => {
  try {
    const token =
      (session.value as any)?.idToken ||
      (session.value as any)?.accessToken ||
      "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    await $fetch(
      `${config.public.apiUrl}/moderator/organizations/${compId}/appeal-messages`,
      {
        method: "POST",
        headers,
        body: {
          text: text || "",
          senderId: userId.value,
          messageId: messageId || undefined,
          attachmentUrl: attachment?.url || undefined,
        },
      },
    );
  } catch (e) {
    console.warn("HTTP appeal message post notice:", e);
  }
};

const sendMessage = async () => {
  const text = newMessageText.value.trim();
  const attachment = pendingAttachment.value;
  if ((!text && !attachment) || !activeChat.value || isSending.value) return;
  isSending.value = true;

  const compId = activeChat.value.companyId || activeChat.value.id;
  const now = new Date().toISOString();
  const timeStr = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const messageId = crypto.randomUUID();

  const localMsg = {
    id: `m-user-${Date.now()}`,
    messageId,
    companyId: compId,
    senderId: userId.value,
    text,
    attachmentUrl: attachment?.url || null,
    attachmentType: attachment?.type || null,
    attachmentName: attachment?.name || null,
    createdAt: now,
    time: timeStr,
  };

  messages.value.push(localMsg);
  newMessageText.value = "";
  pendingAttachment.value = null;

  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    try {
      socket.value.send(
        JSON.stringify({
          action: "sendMessage",
          appealCompanyId: compId,
          messageId,
          text: text || "",
          attachmentUrl: attachment?.url || null,
          attachmentType: attachment?.type || null,
          attachmentName: attachment?.name || null,
        }),
      );
    } catch (wsErr) {
      console.warn("WebSocket send exception, executing HTTP fallback:", wsErr);
      await sendHttpFallback(compId, text, attachment, messageId);
    }
  } else {
    await sendHttpFallback(compId, text, attachment, messageId);
  }

  isSending.value = false;
  scrollToBottom();
};

const isImageUrl = (url?: string) => {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
};

const openImagePreview = (url: string) => {
  window.open(url, "_blank");
};

const formatTime = (dateStr?: string) => {
  if (!dateStr) return "Reciente";
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

onMounted(async () => {
  await fetchConversations();
  await connectWebSocket();
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});
</script>
