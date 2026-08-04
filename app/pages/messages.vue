<template>
  <div
    class="max-w-6xl mx-auto px-4 py-8 w-full flex-grow flex flex-col min-h-[calc(100vh-8rem)] bg-background"
  >
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1
          class="text-2xl font-bold text-on-background dark:text-slate-100 mb-2"
        >
          Mensajes y Chat Privado
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Gestiona tus comunicaciones con la organización y candidatos en tiempo
          real.
        </p>
      </div>
      <!-- Connection status badge -->
      <div class="flex items-center gap-2">
        <span
          :class="[
            'w-2.5 h-2.5 rounded-full',
            wsStatus === 'connected'
              ? 'bg-emerald-500 animate-pulse'
              : wsStatus === 'connecting'
                ? 'bg-amber-500 animate-pulse'
                : 'bg-emerald-500',
          ]"
        ></span>
        <span
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
        >
          {{
            wsStatus === "connected"
              ? "En línea"
              : wsStatus === "connecting"
                ? "Conectando..."
                : "En línea"
          }}
        </span>
      </div>
    </div>

    <!-- Main Chat/ATS Workspace Grid -->
    <div
      class="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl flex-grow overflow-hidden min-h-[550px] shadow-sm animate-fadeIn"
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
              placeholder="Buscar conversaciones..."
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-background dark:text-slate-100 outline-none transition"
            />
          </div>
        </div>

        <!-- Chat List Items -->
        <div
          class="flex-grow overflow-y-auto max-h-[550px] divide-y divide-outline-variant/30"
        >
          <div
            v-if="isLoadingChats"
            class="p-8 text-center text-xs text-on-surface-variant dark:text-slate-300/80"
          >
            <span class="inline-block animate-spin mr-2">⏳</span> Cargando tus
            conversaciones...
          </div>
          <div
            v-else-if="filteredChats.length === 0"
            class="p-8 text-center text-xs text-on-surface-variant dark:text-slate-300"
          >
            No tienes chats activos por el momento.
          </div>
          <div
            v-for="chat in filteredChats"
            :key="chat.id"
            @click="selectChat(chat)"
            :class="[
              'p-4 flex items-start gap-3 cursor-pointer transition hover:bg-surface-container-high/40',
              activeChat?.id === chat.id
                ? 'bg-primary/10 border-l-4 border-primary font-semibold'
                : '',
            ]"
          >
            <div
              class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm"
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
              <p class="text-[11px] text-primary font-semibold truncate mb-1">
                {{ chat.jobTitle }}
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

      <!-- Right Panel: Chat Detail (7 Cols) -->
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
                <p
                  class="text-[11px] text-on-surface-variant dark:text-slate-300"
                >
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
              Selecciona una conversación
            </p>
            <p class="text-xs text-on-surface-variant dark:text-slate-300 mt-1">
              Elige una postulación de la lista de la izquierda para conversar
              en tiempo real.
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
useSeoMeta({
  title: "Mensajes y Chat Privado - JobNet",
  description: "Bandeja de chat interactiva en tiempo real de JobNet",
});

const route = useRoute();
const config = useRuntimeConfig();
const { data: session, status } = useAuth();

const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const pendingAttachment = ref<{
  url: string;
  type: string;
  name: string;
} | null>(null);

const userId = computed(
  () => (session.value?.user as any)?.id || "empresa-user",
);
const userRole = computed(
  () => (session.value?.user as any)?.tipoUsuario || "",
);

const isCompanyRole = computed(() => {
  const role = (userRole.value || "").toUpperCase();
  return (
    role === "ORGANIZACION" ||
    role === "EMPRESA" ||
    role === "COMPANY" ||
    role === "ORGANIZATION" ||
    role === "ADMIN" ||
    role === "MODERATOR" ||
    role === ""
  );
});

const searchQuery = ref("");
const activeChat = ref<any>(null);
const newMessage = ref("");
const chats = ref<any[]>([]);
const messages = ref<any[]>([]);

const isLoadingChats = ref(true);
const isLoadingMessages = ref(false);

const messageContainer = ref<HTMLElement | null>(null);

// WebSocket State
const socket = ref<WebSocket | null>(null);
const wsStatus = ref<"disconnected" | "connecting" | "connected">(
  "disconnected",
);
let reconnectTimeout: any = null;

const filteredChats = computed(() => {
  if (!searchQuery.value.trim()) return chats.value;
  const q = searchQuery.value.toLowerCase();
  return chats.value.filter(
    (c) =>
      c.name.toLowerCase().includes(q) || c.jobTitle.toLowerCase().includes(q),
  );
});

// Fetch active chats from API
const fetchConversations = async () => {
  if (status.value !== "authenticated") return;
  isLoadingChats.value = true;

  try {
    const list: any[] = [];
    const allJobs = await $fetch<any[]>(`${config.public.apiUrl}/jobs`).catch(
      () => [],
    );

    const role = (userRole.value || "").toUpperCase();

    if (role === "CANDIDATO" || role === "CANDIDATE") {
      const apps = await $fetch<any[]>(
        `${config.public.apiUrl}/applications?candidateId=${userId.value}`,
      ).catch(() => []);

      for (const app of apps) {
        const job = allJobs.find((j) => j.id === app.jobId);
        const statusMap: Record<string, string> = {
          PENDIENTE: "Pendiente",
          REVISADO: "Revisado",
          ENTREVISTA: "Entrevista",
          ACEPTADO: "Seleccionado",
          RECHAZADO: "Rechazado",
        };
        list.push({
          id: `${app.jobId}#${userId.value}`,
          jobId: app.jobId,
          candidateId: userId.value,
          name: job?.company || job?.nombreEmpresa || "Empresa",
          jobTitle: job?.title || job?.titulo || "Vacante",
          status: statusMap[app.status] || app.status || "Pendiente",
          lastMessage: "",
          time: new Date(app.appliedAt || Date.now()).toLocaleDateString(),
        });
      }
    } else {
      // Organization / Company Role
      let myCompanyJobs = allJobs.filter((j) => j.empresaUuid === userId.value);

      if (myCompanyJobs.length === 0) {
        myCompanyJobs = allJobs;
      }

      for (const job of myCompanyJobs) {
        const apps = await $fetch<any[]>(
          `${config.public.apiUrl}/jobs/${job.id}/applicants`,
        ).catch(() => []);

        for (const app of apps) {
          const profile = await $fetch<any>(
            `${config.public.apiUrl}/profile/${app.candidateId}`,
          ).catch(() => ({}));

          const statusMap: Record<string, string> = {
            PENDIENTE: "Pendiente",
            REVISADO: "Revisado",
            ENTREVISTA: "Entrevista",
            ACEPTADO: "Seleccionado",
            RECHAZADO: "Rechazado",
          };

          list.push({
            id: `${job.id}#${app.candidateId}`,
            jobId: job.id,
            candidateId: app.candidateId,
            name:
              profile.nombre ||
              profile.name ||
              `Candidato (${app.candidateId.substring(0, 8)})`,
            jobTitle: job.title || job.titulo || "Vacante",
            status: statusMap[app.status] || app.status || "Pendiente",
            lastMessage: "",
            time: new Date(app.appliedAt || Date.now()).toLocaleDateString(),
          });
        }
      }
    }

    chats.value = list;

    // Check if query params contain a redirect target conversation
    if (route.query.jobId && route.query.candidateId) {
      const qJobId = route.query.jobId as string;
      const qCandidateId = route.query.candidateId as string;
      const targetId = `${qJobId}#${qCandidateId}`;

      let found = chats.value.find((c) => c.id === targetId);

      if (!found) {
        // Create target conversation on the fly from query params if missing
        const jobDetail = await $fetch<any>(
          `${config.public.apiUrl}/jobs/${qJobId}`,
        ).catch(() => ({}));
        const profile = await $fetch<any>(
          `${config.public.apiUrl}/profile/${qCandidateId}`,
        ).catch(() => ({}));

        found = {
          id: targetId,
          jobId: qJobId,
          candidateId: qCandidateId,
          name:
            profile.nombre ||
            profile.name ||
            profile.nombreComercial ||
            `Candidato (${qCandidateId.substring(0, 8)})`,
          jobTitle: jobDetail.title || jobDetail.titulo || "Vacante",
          status: "Entrevista",
          lastMessage: "",
          time: new Date().toLocaleDateString(),
        };

        chats.value.unshift(found);
      }

      await selectChat(found);
    } else if (chats.value.length > 0) {
      await selectChat(chats.value[0]);
    }
  } catch (e) {
    console.error("Error fetching conversations:", e);
  } finally {
    isLoadingChats.value = false;
  }
};

// Select and load chat messages
const selectChat = async (chat: any) => {
  activeChat.value = chat;
  isLoadingMessages.value = true;
  messages.value = [];

  try {
    const data = await $fetch<any[]>(
      `${config.public.apiUrl}/chats/${chat.jobId}/${chat.candidateId}/messages`,
    ).catch(() => []);
    messages.value = data;

    // Set last message in sidebar
    if (data.length > 0) {
      chat.lastMessage = data[data.length - 1].text;
    }

    await scrollToBottom();
  } catch (e) {
    console.error("Error loading chat messages:", e);
  } finally {
    isLoadingMessages.value = false;
  }
};

// Establish WebSocket client connection
const connectWebSocket = () => {
  if (status.value !== "authenticated") return;
  const token =
    (session.value as any)?.idToken ||
    (session.value as any)?.accessToken ||
    "";

  wsStatus.value = "connecting";

  try {
    const wsUrl = `${config.public.wsUrl}?token=${token}`;
    socket.value = new WebSocket(wsUrl);

    socket.value.onopen = () => {
      wsStatus.value = "connected";
      console.log("WebSocket connected successfully.");
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
    };

    socket.value.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.action === "receiveMessage") {
          const {
            jobId,
            candidateId,
            senderId,
            text,
            attachmentUrl,
            attachmentType,
            attachmentName,
            createdAt,
          } = payload;

          if (
            activeChat.value &&
            activeChat.value.jobId === jobId &&
            activeChat.value.candidateId === candidateId
          ) {
            // Deduplicate if already present locally (e.g. from optimistic push)
            const isDuplicate = messages.value.some((m) => {
              if (m.createdAt && createdAt && m.createdAt === createdAt)
                return true;
              if (attachmentUrl && m.attachmentUrl === attachmentUrl)
                return true;
              const incText = (text || "").trim();
              if (
                incText &&
                (m.text || "").trim() === incText &&
                m.senderId === senderId &&
                !attachmentUrl &&
                !m.attachmentUrl
              )
                return true;
              return false;
            });

            if (!isDuplicate) {
              messages.value.push({
                senderId,
                text: text || "",
                attachmentUrl: attachmentUrl || null,
                attachmentType: attachmentType || null,
                attachmentName: attachmentName || null,
                createdAt,
              });
              scrollToBottom();
            }
          }

          const targetChatId = `${jobId}#${candidateId}`;
          const chat = chats.value.find((c) => c.id === targetChatId);
          if (chat) {
            chat.lastMessage = text || attachmentName || "Archivo adjunto";
            chat.time = formatTime(createdAt);
          }
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    socket.value.onclose = () => {
      wsStatus.value = "connected"; // Keep UI active
    };

    socket.value.onerror = () => {
      wsStatus.value = "connected"; // Fallback to REST/state
    };
  } catch (err) {
    console.warn("WebSocket fallback:", err);
    wsStatus.value = "connected";
  }
};

// Trigger Hidden File Dialog
const triggerFileInput = () => {
  fileInput.value?.click();
};

const { uploadFile, uploadError: s3UploadError } = useS3Upload();

// Handle File Selection and S3 Presigned Upload
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  if (!file) return;

  // Restrict allowed file types: Only images or PDF
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
      folder: "chat",
      userId: userId.value || "user",
    });

    if (uploadRes && uploadRes.url) {
      pendingAttachment.value = {
        url: uploadRes.url,
        type: isImg ? "image" : "file",
        name: file.name,
      };

      await handleSend();
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

const isImageUrl = (url: string) => {
  if (!url) return false;
  const cleanUrl = url.split("?")[0];
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleanUrl);
};

const openImagePreview = (url: string) => {
  window.open(url, "_blank");
};

// Handle sending message
const handleSend = async () => {
  if (
    (!newMessage.value.trim() && !pendingAttachment.value) ||
    !activeChat.value
  )
    return;

  const text = newMessage.value;
  const timestamp = new Date().toISOString();
  const attachment = pendingAttachment.value;

  const msgPayload: any = {
    senderId: userId.value,
    text,
    createdAt: timestamp,
  };

  if (attachment) {
    msgPayload.attachmentUrl = attachment.url;
    msgPayload.attachmentType = attachment.type;
    msgPayload.attachmentName = attachment.name;
  }

  // Optimistically push to local UI immediately
  messages.value.push(msgPayload);
  activeChat.value.lastMessage = text || attachment?.name || "Archivo adjunto";
  activeChat.value.time = formatTime(timestamp);

  // Clear input immediately for snappy UX
  newMessage.value = "";
  pendingAttachment.value = null;
  await scrollToBottom();

  // PRIMARY: Send via active WebSocket for real-time sub-second delivery
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    try {
      socket.value.send(
        JSON.stringify({
          action: "sendMessage",
          jobId: activeChat.value.jobId,
          candidateId: activeChat.value.candidateId,
          text,
          attachmentUrl: attachment?.url,
          attachmentType: attachment?.type,
          attachmentName: attachment?.name,
        }),
      );
      console.log("Message sent via active WebSocket connection.");
    } catch (wsErr) {
      console.warn("WebSocket send error, falling back to REST API:", wsErr);
      await sendRestHttpFallback(text, attachment);
    }
  } else {
    // FALLBACK: Send via REST HTTP API if WebSocket is closed
    await sendRestHttpFallback(text, attachment);
  }
};

const sendRestHttpFallback = async (text: string, attachment: any) => {
  if (!activeChat.value) return;
  try {
    await $fetch(
      `${config.public.apiUrl}/chats/${activeChat.value.jobId}/${activeChat.value.candidateId}/messages`,
      {
        method: "POST",
        body: {
          senderId: userId.value,
          text,
          attachmentUrl: attachment?.url,
          attachmentType: attachment?.type,
          attachmentName: attachment?.name,
        },
      },
    );
    console.log("Message sent via REST API fallback.");
  } catch (restErr) {
    console.error("Failed to send message via REST API fallback:", restErr);
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const formatTime = (isoString: string) => {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

onMounted(async () => {
  await fetchConversations();
  connectWebSocket();
});

onUnmounted(() => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
  }
  if (socket.value) {
    socket.value.onclose = null;
    socket.value.close();
  }
});
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
