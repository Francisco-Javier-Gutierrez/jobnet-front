<template>
  <div
    class="max-w-6xl mx-auto px-4 py-8 w-full flex-grow flex flex-col min-h-[calc(100vh-8rem)] bg-background"
  >
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-on-background mb-2">
          Mensajes y Postulaciones
        </h1>
        <p class="text-on-surface-variant text-sm">
          Gestiona tus comunicaciones con reclutadores y el estado de tus
          candidaturas en tiempo real.
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
                : 'bg-rose-500',
          ]"
        ></span>
        <span class="text-xs font-bold text-on-surface-variant">
          {{
            wsStatus === "connected"
              ? "En línea"
              : wsStatus === "connecting"
                ? "Conectando..."
                : "Desconectado"
          }}
        </span>
      </div>
    </div>

    <!-- Main Chat/ATS Workspace Grid -->
    <div
      class="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl flex-grow overflow-hidden min-h-[550px] shadow-sm animate-fadeIn"
    >
      <!-- Left Panel: Chat List (5 Cols) -->
      <div
        class="lg:col-span-5 border-r border-outline-variant/60 flex flex-col h-full bg-surface-container-low/40"
      >
        <!-- Search bar -->
        <div class="p-4 border-b border-outline-variant/60">
          <div class="relative">
            <span
              class="absolute left-3 top-2.5 material-symbols-outlined text-on-surface-variant text-lg"
              >search</span
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar conversaciones..."
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-background outline-none transition"
            />
          </div>
        </div>

        <!-- Chat List Items -->
        <div
          class="flex-grow overflow-y-auto max-h-[550px] divide-y divide-outline-variant/30"
        >
          <div
            v-if="isLoadingChats"
            class="p-8 text-center text-xs text-on-surface-variant/80"
          >
            <span class="inline-block animate-spin mr-2">⏳</span> Cargando tus
            conversaciones...
          </div>
          <div
            v-else-if="filteredChats.length === 0"
            class="p-8 text-center text-xs text-on-surface-variant"
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
                ? 'bg-primary/5 border-l-4 border-primary'
                : '',
            ]"
          >
            <div
              class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm"
            >
              {{ chat.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-grow min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3 class="text-xs font-bold text-on-background truncate">
                  {{ chat.name }}
                </h3>
                <span class="text-[10px] text-on-surface-variant/80">{{
                  chat.time
                }}</span>
              </div>
              <p class="text-[11px] text-primary font-semibold truncate mb-1">
                {{ chat.jobTitle }}
              </p>
              <p class="text-xs text-on-surface-variant truncate">
                {{ chat.lastMessage || "Sin mensajes aún" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Chat Detail (7 Cols) -->
      <div
        class="lg:col-span-7 flex flex-col h-full bg-surface-container-lowest"
      >
        <template v-if="activeChat">
          <!-- Chat Header -->
          <div
            class="p-4 border-b border-outline-variant/60 bg-surface-container-low/25 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm"
              >
                {{ activeChat.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h3 class="text-xs font-bold text-on-background">
                  {{ activeChat.name }}
                </h3>
                <p class="text-[11px] text-primary font-semibold">
                  {{ activeChat.jobTitle }}
                </p>
              </div>
            </div>
            <!-- Status pill -->
            <span
              class="px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-secondary/15 text-secondary border border-secondary/20"
            >
              {{ activeChat.status }}
            </span>
          </div>

          <!-- Messages Body -->
          <div
            ref="messageContainer"
            class="flex-grow p-4 overflow-y-auto max-h-[400px] flex flex-col gap-4 bg-slate-50/50"
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
              ¡Di hola! Escribe tu primer mensaje.
            </div>

            <!-- Messages list -->
            <div
              v-for="msg in messages"
              :key="msg.createdAt"
              :class="[
                'flex gap-3 max-w-[85%]',
                msg.senderId === userId ? 'ml-auto justify-end' : '',
              ]"
            >
              <!-- Avatar only for recipient message -->
              <div
                v-if="msg.senderId !== userId"
                class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0"
              >
                {{ activeChat.name.charAt(0).toUpperCase() }}
              </div>

              <!-- Message container -->
              <div
                :class="[
                  'p-3.5 rounded-2xl text-xs leading-relaxed transition',
                  msg.senderId === userId
                    ? 'bg-primary text-white rounded-tr-none shadow-sm shadow-primary/15'
                    : 'bg-surface-container-low border border-outline-variant/30 rounded-tl-none text-on-surface',
                ]"
              >
                <p class="whitespace-pre-wrap">{{ msg.text }}</p>
                <span
                  :class="[
                    'block text-[9px] mt-1.5 text-right',
                    msg.senderId === userId
                      ? 'text-white/80'
                      : 'text-on-surface-variant/80',
                  ]"
                >
                  {{ formatTime(msg.createdAt) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Message input -->
          <div
            class="p-4 border-t border-outline-variant/60 bg-surface-container-low/25 flex items-center gap-3"
          >
            <input
              v-model="newMessage"
              @keyup.enter="handleSend"
              type="text"
              placeholder="Escribe un mensaje..."
              class="flex-grow bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-xs text-on-background outline-none transition"
              :disabled="wsStatus !== 'connected'"
            />
            <button
              @click="handleSend"
              :disabled="wsStatus !== 'connected' || !newMessage.value?.trim()"
              class="w-10 h-10 rounded-xl bg-primary hover:bg-primary-container text-white flex items-center justify-center transition active:scale-95 flex-shrink-0 disabled:opacity-50"
            >
              <span class="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </template>

        <!-- Welcome detail view when no chat active -->
        <template v-else>
          <div
            class="flex-grow flex flex-col items-center justify-center p-8 text-center text-on-surface-variant"
          >
            <span
              class="material-symbols-outlined text-[48px] text-outline mb-4"
              >forum</span
            >
            <p class="text-sm font-bold text-on-background">
              Selecciona una conversación
            </p>
            <p class="text-xs text-on-surface-variant mt-1">
              Elige una postulación de la lista de la izquierda para ver el chat
              de seguimiento.
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";

useSeoMeta({
  title: "Mensajes y Postulaciones - JobNet",
  description: "Bandeja de chat interactiva en tiempo real de JobNet",
});

const route = useRoute();
const config = useRuntimeConfig();
const { data: session, status } = useAuth();

const userId = computed(() => (session.value?.user as any)?.id || "");
const userRole = computed(
  () => (session.value?.user as any)?.tipoUsuario || "",
);

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
  if (status.value !== "authenticated" || !userId.value) return;
  isLoadingChats.value = true;

  try {
    const list: any[] = [];
    const allJobs = await $fetch<any[]>(`${config.public.apiUrl}/jobs`).catch(
      () => [],
    );

    if (userRole.value === "CANDIDATO") {
      const apps = await $fetch<any[]>(
        `${config.public.apiUrl}/applications?candidateId=${userId.value}`,
      ).catch(() => []);

      for (const app of apps) {
        if (app.status === "ENTREVISTA" || app.status === "ACEPTADO") {
          const job = allJobs.find((j) => j.id === app.jobId);
          if (job) {
            list.push({
              id: `${app.jobId}#${userId.value}`,
              jobId: app.jobId,
              candidateId: userId.value,
              name: job.nombreEmpresa || "Empresa",
              jobTitle: job.title,
              status:
                app.status === "ENTREVISTA" ? "Entrevista" : "Seleccionado",
              lastMessage: "",
              time: new Date(app.appliedAt).toLocaleDateString(),
            });
          }
        }
      }
    } else if (userRole.value === "EMPRESA") {
      const myCompanyJobs = allJobs.filter(
        (j) => j.empresaUuid === userId.value,
      );

      for (const job of myCompanyJobs) {
        const apps = await $fetch<any[]>(
          `${config.public.apiUrl}/jobs/${job.id}/applicants`,
        ).catch(() => []);

        for (const app of apps) {
          if (app.status === "ENTREVISTA" || app.status === "ACEPTADO") {
            const profile = await $fetch<any>(
              `${config.public.apiUrl}/profile/${app.candidateId}`,
            ).catch(() => ({}));

            list.push({
              id: `${job.id}#${app.candidateId}`,
              jobId: job.id,
              candidateId: app.candidateId,
              name: profile.nombre || "Candidato sin nombre",
              jobTitle: job.title,
              status:
                app.status === "ENTREVISTA" ? "Entrevista" : "Seleccionado",
              lastMessage: "",
              time: new Date(app.appliedAt).toLocaleDateString(),
            });
          }
        }
      }
    }

    chats.value = list;

    // Check if query params contain a redirect target conversation
    if (route.query.jobId && route.query.candidateId) {
      const targetId = `${route.query.jobId}#${route.query.candidateId}`;
      const found = chats.value.find((c) => c.id === targetId);
      if (found) {
        selectChat(found);
      } else if (chats.value.length > 0) {
        selectChat(chats.value[0]);
      }
    } else if (chats.value.length > 0) {
      selectChat(chats.value[0]);
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
  const token = (session.value as any)?.idToken;
  if (!token) return;

  wsStatus.value = "connecting";

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
        const { jobId, candidateId, senderId, text, createdAt } = payload;

        // If received message belongs to active chat, append it
        if (
          activeChat.value &&
          activeChat.value.jobId === jobId &&
          activeChat.value.candidateId === candidateId
        ) {
          messages.value.push({ senderId, text, createdAt });
          scrollToBottom();
        }

        // Update sidebar last message summary
        const targetChatId = `${jobId}#${candidateId}`;
        const chat = chats.value.find((c) => c.id === targetChatId);
        if (chat) {
          chat.lastMessage = text;
          chat.time = formatTime(createdAt);
        }
      }
    } catch (err) {
      console.error("Error parsing WebSocket message:", err);
    }
  };

  socket.value.onclose = () => {
    wsStatus.value = "disconnected";
    console.log("WebSocket connection closed. Attempting reconnect...");
    triggerReconnect();
  };

  socket.value.onerror = (err) => {
    console.error("WebSocket connection error:", err);
    socket.value?.close();
  };
};

const triggerReconnect = () => {
  if (reconnectTimeout) return;
  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    connectWebSocket();
  }, 5000); // Wait 5 seconds to reconnect
};

// Handle sending message via WebSocket
const handleSend = async () => {
  if (
    !newMessage.value.trim() ||
    !activeChat.value ||
    wsStatus.value !== "connected"
  )
    return;

  const text = newMessage.value;
  const timestamp = new Date().toISOString();

  // Optimistically push to local message logs
  messages.value.push({
    senderId: userId.value,
    text,
    createdAt: timestamp,
  });

  // Update last message preview
  activeChat.value.lastMessage = text;
  activeChat.value.time = formatTime(timestamp);

  // Send message through WebSocket
  socket.value?.send(
    JSON.stringify({
      action: "sendMessage",
      jobId: activeChat.value.jobId,
      candidateId: activeChat.value.candidateId,
      text,
    }),
  );

  newMessage.value = "";
  await scrollToBottom();
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
    socket.value.onclose = null; // Prevent auto-reconnection on manual exit
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
