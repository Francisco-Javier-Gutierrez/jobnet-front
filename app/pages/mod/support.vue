<template>
  <div
    class="max-w-7xl mx-auto px-4 py-8 w-full bg-background min-h-screen flex flex-col"
    role="main"
  >
    <!-- Header -->
    <div
      class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-on-background mb-2">
          Soporte Directo (Moderador)
        </h1>
        <p class="text-on-surface-variant text-sm">
          Resuelve disputas de reclutamiento y atiende dudas de candidatos y
          empresas en tiempo real.
        </p>
      </div>
      <div
        class="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full"
      >
        <span
          class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"
        ></span>
        <span class="text-xs font-bold text-emerald-600"
          >Moderador en Línea</span
        >
      </div>
    </div>

    <!-- Chat Workspace Container -->
    <div
      class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row h-[680px] w-full"
    >
      <!-- Left Sidebar: Active Tickets List -->
      <div
        class="w-full lg:w-[350px] border-b lg:border-b-0 lg:border-r border-outline-variant/60 flex flex-col flex-shrink-0 bg-surface-container-lowest"
        aria-label="Cola de tickets de soporte"
      >
        <!-- Search and count -->
        <div
          class="p-4 border-b border-outline-variant/60 bg-surface-container-low/20"
        >
          <div class="relative mb-3">
            <span
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <span
                class="material-symbols-outlined text-on-surface-variant/70 text-[18px]"
                >search</span
              >
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar chats de soporte..."
              class="pl-9 pr-4 py-2 w-full bg-surface border border-outline-variant/60 rounded-xl text-xs focus:outline-none focus:border-primary text-on-background"
            />
          </div>
          <div
            class="flex justify-between items-center text-[11px] font-bold text-on-surface-variant"
          >
            <span>TICKETS EN COLA</span>
            <span class="bg-primary/10 text-primary px-2 py-0.5 rounded-full"
              >{{ activeTicketsCount }} Activo(s)</span
            >
          </div>
        </div>

        <!-- Tickets List -->
        <div
          class="flex-grow overflow-y-auto divide-y divide-outline-variant/30"
        >
          <button
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            @click="selectTicket(ticket)"
            class="w-full text-left p-4 hover:bg-surface-container-low/40 transition duration-150 flex gap-3.5 relative"
            :class="
              selectedTicketId === ticket.id
                ? 'bg-primary/5 hover:bg-primary/5'
                : ''
            "
          >
            <!-- Highlight bar for selected -->
            <div
              v-if="selectedTicketId === ticket.id"
              class="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"
            ></div>

            <!-- Avatar -->
            <div
              class="w-10 h-10 rounded-full flex-shrink-0 bg-primary/10 flex items-center justify-center font-bold text-primary text-sm relative"
            >
              {{ ticket.userName.charAt(0) }}
              <span
                class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-surface-container-lowest"
                :class="ticket.online ? 'bg-emerald-500' : 'bg-outline-variant'"
              ></span>
            </div>

            <!-- Ticket Info -->
            <div class="flex-grow min-w-0">
              <div class="flex justify-between items-start mb-0.5">
                <h3 class="text-xs font-bold text-on-background truncate">
                  {{ ticket.userName }}
                </h3>
                <span class="text-[9px] text-on-surface-variant font-medium">
                  {{ ticket.time }}
                </span>
              </div>
              <div class="flex items-center gap-1.5 mb-1.5">
                <span
                  class="text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded uppercase"
                  :class="
                    ticket.userRole === 'CANDIDATO'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200/30'
                      : 'bg-indigo-100 text-indigo-700 border border-indigo-200/30'
                  "
                >
                  {{ ticket.userRole }}
                </span>
                <span
                  v-if="ticket.unread"
                  class="w-2 h-2 rounded-full bg-primary animate-pulse"
                ></span>
              </div>
              <p class="text-[11px] text-on-surface-variant truncate">
                {{ ticket.lastMessage || ticket.subject }}
              </p>
            </div>
          </button>
        </div>
      </div>

      <!-- Right Panel: Conversation Details -->
      <div class="flex-grow flex flex-col bg-surface-container-low/10">
        <!-- Selected Active Chat -->
        <div v-if="activeTicket" class="flex flex-col h-full">
          <!-- Chat Header -->
          <div
            class="p-4 border-b border-outline-variant/60 bg-surface-container-lowest flex items-center justify-between shadow-sm"
          >
            <div class="flex items-center gap-3">
              <!-- Avatar -->
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm relative"
              >
                {{ activeTicket.userName.charAt(0) }}
                <span
                  class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-surface-container-lowest"
                  :class="
                    activeTicket.online
                      ? 'bg-emerald-500'
                      : 'bg-outline-variant'
                  "
                ></span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-xs font-bold text-on-background">
                    {{ activeTicket.userName }}
                  </h2>
                  <span
                    class="text-[8px] font-bold px-1.5 py-0.5 rounded"
                    :class="
                      activeTicket.userRole === 'CANDIDATO'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-indigo-100 text-indigo-700'
                    "
                  >
                    {{ activeTicket.userRole }}
                  </span>
                </div>
                <p class="text-[10px] text-on-surface-variant">
                  {{ activeTicket.online ? "Conectado ahora" : "Desconectado" }}
                  • Asunto: {{ activeTicket.subject }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <button
                @click="resolveTicket(activeTicket.id)"
                class="px-3 py-1.5 border border-outline-variant hover:border-primary text-xs font-bold text-on-surface-variant hover:text-primary rounded-xl transition flex items-center gap-1 bg-surface"
              >
                <span class="material-symbols-outlined text-[16px]"
                  >check_circle</span
                >
                Cerrar Caso
              </button>
            </div>
          </div>

          <!-- Messages Area -->
          <div
            ref="chatContainer"
            class="flex-grow overflow-y-auto p-4 space-y-4 bg-surface-container-low/20"
          >
            <!-- Subject Context Box -->
            <div
              class="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-3.5 max-w-xl mx-auto text-center"
            >
              <span
                class="material-symbols-outlined text-primary text-[24px] mb-1.5"
                >contact_support</span
              >
              <h4 class="text-xs font-bold text-on-background mb-1">
                Contexto del Reporte
              </h4>
              <p class="text-[11px] text-on-surface-variant">
                {{ activeTicket.description }}
              </p>
            </div>

            <div class="text-center">
              <span
                class="text-[9px] font-bold text-on-surface-variant/80 uppercase tracking-widest bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/30"
              >
                Historial de Conversación
              </span>
            </div>

            <!-- Message bubbles -->
            <div
              v-for="msg in activeTicket.messages"
              :key="msg.id"
              class="flex flex-col"
              :class="msg.sender === 'MODERATOR' ? 'items-end' : 'items-start'"
            >
              <div
                class="max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-sm"
                :class="
                  msg.sender === 'MODERATOR'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-surface-container-lowest text-on-background border border-outline-variant/40 rounded-tl-none'
                "
              >
                <p class="leading-relaxed">{{ msg.text }}</p>
              </div>
              <span
                class="text-[9px] text-on-surface-variant mt-1.5 px-1 font-medium flex items-center gap-1"
              >
                {{ msg.time }}
                <span
                  v-if="msg.sender === 'MODERATOR'"
                  class="material-symbols-outlined text-[12px] text-primary"
                  >done_all</span
                >
              </span>
            </div>

            <!-- Typing Simulation indicator -->
            <div
              v-if="isTyping"
              class="flex items-center gap-2 text-on-surface-variant text-[11px] font-medium"
            >
              <div
                class="flex gap-1 items-center bg-surface-container-lowest border border-outline-variant/40 px-3.5 py-2.5 rounded-full rounded-tl-none"
              >
                <span
                  class="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce"
                  style="animation-delay: 0s"
                ></span>
                <span
                  class="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce"
                  style="animation-delay: 0.2s"
                ></span>
                <span
                  class="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce"
                  style="animation-delay: 0.4s"
                ></span>
              </div>
              <span>{{ activeTicket.userName }} está escribiendo...</span>
            </div>
          </div>

          <!-- Message Input Box -->
          <div
            class="p-4 bg-surface-container-lowest border-t border-outline-variant/60 flex items-center gap-3"
          >
            <input
              v-model="newMessageText"
              @keydown.enter="sendMessage"
              type="text"
              placeholder="Escribe una respuesta para el usuario..."
              class="flex-grow bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-background focus:outline-none focus:border-primary"
            />
            <button
              @click="sendMessage"
              :disabled="!newMessageText.trim()"
              class="bg-primary hover:bg-primary-container text-white disabled:opacity-50 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm flex-shrink-0"
            >
              Responder
              <span class="material-symbols-outlined text-[16px]">send</span>
            </button>
          </div>
        </div>

        <!-- No Active Chat View -->
        <div
          v-else
          class="flex-grow flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/10 h-full"
        >
          <div
            class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
          >
            <span class="material-symbols-outlined text-[40px] text-primary"
              >forum</span
            >
          </div>
          <h3 class="text-lg font-bold text-on-background mb-2">
            Selecciona un ticket de soporte
          </h3>
          <p class="text-on-surface-variant text-xs max-w-sm">
            Elige a uno de los usuarios de la lista lateral para atender sus
            solicitudes en tiempo real y resolver sus dudas directamente.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from "vue";

useSeoMeta({
  title: "Soporte y Disputas - Moderación JobNet",
  description: "Bandeja interactiva de soporte directo y gestión de disputas para moderadores",
});

const config = useRuntimeConfig();
const { data: session, status } = useAuth();

const userId = computed(() => (session.value?.user as any)?.id || "moderator-1");
const searchQuery = ref("");
const selectedTicketId = ref<string | null>(null);
const newMessageText = ref("");
const chatContainer = ref<HTMLDivElement | null>(null);
const isTyping = ref(false);
const isLoading = ref(false);

const socket = ref<WebSocket | null>(null);
const wsConnected = ref(false);

const tickets = ref<any[]>([
  {
    id: "t1",
    disputeId: "t1",
    userName: "Sofía Valenzuela",
    userRole: "CANDIDATO",
    online: true,
    subject: "Error de carga en CV",
    description:
      "Hola, estoy intentando subir mi currículum profesional y la plataforma me dice que supera el tamaño de archivo.",
    time: "10:42 AM",
    unread: true,
    lastMessage: "El PDF mide 3.2MB y el límite dice 5MB. Podrían asistirme?",
    messages: [
      {
        id: "m1",
        sender: "USER",
        text: "Hola, buenas tardes. Tengo un problema al subir mi currículum en formato PDF.",
        time: "10:40 AM",
      },
    ],
  },
]);

const fetchDisputes = async () => {
  isLoading.value = true;
  try {
    const disputesData = await $fetch<any[]>(
      `${config.public.apiUrl}/moderator/disputes`,
    ).catch(() => []);

    if (disputesData && disputesData.length > 0) {
      const realTickets = disputesData.map((d) => ({
        id: d.id,
        disputeId: d.id,
        userName: d.complainantName || "Usuario",
        userRole: d.complainantRole || "CANDIDATO",
        online: true,
        subject: `Disputa: ${d.reason}`,
        description: d.description || d.reason,
        time: d.fechaCreacion ? new Date(d.fechaCreacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Reciente",
        unread: d.estatus === "ABIERTA",
        lastMessage: d.description || d.reason,
        messages: [],
      }));

      tickets.value = [...realTickets, ...tickets.value];
    }
  } catch (err) {
    console.error("Error fetching disputes:", err);
  } finally {
    isLoading.value = false;
  }
};

const connectWebSocket = () => {
  const token = (session.value as any)?.idToken;
  if (!token) return;
  const wsUrl = `${config.public.wsUrl}?token=${token}`;
  socket.value = new WebSocket(wsUrl);

  socket.value.onopen = () => {
    wsConnected.value = true;
  };

  socket.value.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.action === "receiveDisputeMessage") {
        const { disputeId, senderId, text, createdAt } = payload;
        const target = tickets.value.find((t) => t.id === disputeId);
        if (target) {
          const timeStr = new Date(createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          target.messages.push({
            id: `m-ws-${Date.now()}`,
            sender: senderId === userId.value ? "MODERATOR" : "USER",
            text,
            time: timeStr,
          });
          target.lastMessage = text;
          scrollToBottom();
        }
      }
    } catch (e) {
      console.error("Error handling dispute WS message:", e);
    }
  };

  socket.value.onclose = () => {
    wsConnected.value = false;
  };
};

const activeTicketsCount = computed(() => tickets.value.length);

const filteredTickets = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return tickets.value;
  return tickets.value.filter(
    (t) =>
      t.userName.toLowerCase().includes(query) ||
      t.subject.toLowerCase().includes(query) ||
      t.lastMessage.toLowerCase().includes(query),
  );
});

const activeTicket = computed(() => {
  return tickets.value.find((t) => t.id === selectedTicketId.value) || null;
});

const selectTicket = async (ticket: any) => {
  selectedTicketId.value = ticket.id;
  ticket.unread = false;

  if (ticket.disputeId && ticket.messages.length === 0) {
    try {
      const msgs = await $fetch<any[]>(
        `${config.public.apiUrl}/disputes/${ticket.disputeId}/messages`,
      ).catch(() => []);

      ticket.messages = msgs.map((m) => ({
        id: `m-${m.createdAt}`,
        sender: m.senderId === userId.value ? "MODERATOR" : "USER",
        text: m.text,
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));
    } catch (e) {
      console.error("Error loading dispute messages:", e);
    }
  }

  scrollToBottom();
};

const resolveTicket = async (ticketId: string) => {
  try {
    await $fetch(`${config.public.apiUrl}/moderator/disputes/${ticketId}/resolve`, {
      method: "POST",
      body: { action: "resolve", notes: "Caso resuelto por moderador" },
    }).catch(() => {});
  } catch (e) {
    console.error("Error resolving dispute:", e);
  }

  tickets.value = tickets.value.filter((t) => t.id !== ticketId);
  selectedTicketId.value = null;
};

const sendMessage = () => {
  const text = newMessageText.value.trim();
  if (!text || !selectedTicketId.value) return;

  const ticket = tickets.value.find((t) => t.id === selectedTicketId.value);
  if (!ticket) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  ticket.messages.push({
    id: `m-mod-${Date.now()}`,
    sender: "MODERATOR",
    text: text,
    time: timeStr,
  });

  ticket.lastMessage = text;

  if (socket.value && wsConnected.value && ticket.disputeId) {
    socket.value.send(
      JSON.stringify({
        action: "sendMessage",
        disputeId: ticket.disputeId,
        text,
      }),
    );
  }

  newMessageText.value = "";
  scrollToBottom();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

watch(
  () => activeTicket.value?.messages.length,
  () => {
    scrollToBottom();
  },
);

onMounted(async () => {
  await fetchDisputes();
  connectWebSocket();
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});
</script>
