<template>
  <div
    class="max-w-6xl mx-auto px-4 py-8 w-full flex-grow flex flex-col min-h-[calc(100vh-8rem)] bg-background"
  >
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-on-background mb-2">
        Mensajes y Postulaciones
      </h1>
      <p class="text-on-surface-variant text-sm">
        Gestiona tus comunicaciones con reclutadores y el estado de tus
        candidaturas.
      </p>
    </div>

    <!-- Main Chat/ATS Workspace Grid -->
    <div
      class="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl flex-grow overflow-hidden min-h-[500px] shadow-sm"
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
            v-for="chat in filteredChats"
            :key="chat.id"
            @click="activeChat = chat"
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
              {{ chat.company.charAt(0) }}
            </div>
            <div class="flex-grow min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3 class="text-xs font-bold text-on-background truncate">
                  {{ chat.company }}
                </h3>
                <span class="text-[10px] text-on-surface-variant/80">{{
                  chat.time
                }}</span>
              </div>
              <p class="text-[11px] text-primary font-semibold truncate mb-1">
                {{ chat.jobTitle }}
              </p>
              <p class="text-xs text-on-surface-variant truncate">
                {{ chat.lastMessage }}
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
                {{ activeChat.company.charAt(0) }}
              </div>
              <div>
                <h3 class="text-xs font-bold text-on-background">
                  {{ activeChat.company }}
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
              En revisión
            </span>
          </div>

          <!-- Messages Body -->
          <div
            class="flex-grow p-4 overflow-y-auto max-h-[400px] flex flex-col gap-4"
          >
            <div class="text-center my-2">
              <span
                class="bg-surface-container-high/60 text-on-surface-variant text-[10px] px-2.5 py-1 rounded-full font-bold"
                >Hoy</span
              >
            </div>

            <!-- Message bubble from Recruiter -->
            <div class="flex gap-3 max-w-[85%]">
              <div
                class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0"
              >
                {{ activeChat.company.charAt(0) }}
              </div>
              <div
                class="bg-surface-container-low border border-outline-variant/30 rounded-2xl rounded-tl-none p-3.5"
              >
                <p class="text-xs text-on-surface leading-relaxed">
                  Hola, agradecemos mucho tu postulación para la vacante de
                  {{ activeChat.jobTitle }}. Estuvimos revisando tu portafolio y
                  nos parece muy interesante. ¿Tendrás disponibilidad para una
                  breve llamada de alineación mañana?
                </p>
                <span
                  class="block text-[9px] text-on-surface-variant/80 mt-1.5 text-right"
                  >10:24 AM</span
                >
              </div>
            </div>

            <!-- Message bubble from Candidate (User) -->
            <div class="flex gap-3 max-w-[85%] ml-auto justify-end">
              <div
                class="bg-primary text-white rounded-2xl rounded-tr-none p-3.5 shadow-md shadow-primary/10"
              >
                <p class="text-xs leading-relaxed">
                  ¡Hola! Qué gusto saludarte. Claro que sí, tengo disponibilidad
                  completa por la mañana, entre las 9:00 AM y la 1:00 PM. Quedo
                  a la espera de la invitación. ¡Muchas gracias!
                </p>
                <span
                  class="block text-[9px] text-primary-fixed-dim/80 mt-1.5 text-right"
                  >10:30 AM</span
                >
              </div>
            </div>
          </div>

          <!-- Message input -->
          <div
            class="p-4 border-t border-outline-variant/60 bg-surface-container-low/25 flex items-center gap-3"
          >
            <input
              v-model="newMessage"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="Escribe un mensaje..."
              class="flex-grow bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-xs text-on-background outline-none transition"
            />
            <button
              @click="sendMessage"
              class="w-10 h-10 rounded-xl bg-primary hover:bg-primary-container text-white flex items-center justify-center transition active:scale-95 flex-shrink-0"
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
import { ref, computed } from "vue";

useSeoMeta({
  title: "Mensajes y Postulaciones - JobNet",
  description: "Bandeja de chat interactiva para candidatos de JobNet",
});

const searchQuery = ref("");
const activeChat = ref<any>(null);
const newMessage = ref("");

const chats = ref([
  {
    id: 1,
    company: "TechSolutions Inc.",
    jobTitle: "Senior Frontend Developer",
    lastMessage:
      "¿Tendrás disponibilidad para una breve llamada de alineación mañana?",
    time: "10:24 AM",
  },
  {
    id: 2,
    company: "Design Studio SA",
    jobTitle: "UX/UI Designer",
    lastMessage:
      "Agradecemos tu postulación. Por el momento cerramos el proceso.",
    time: "Ayer",
  },
  {
    id: 3,
    company: "Grupo Financiero MX",
    jobTitle: "Product Manager Junior",
    lastMessage: "Hola, te enviamos la prueba técnica correspondiente.",
    time: "4 jul",
  },
]);

const filteredChats = computed(() => {
  if (!searchQuery.value.trim()) return chats.value;
  const q = searchQuery.value.toLowerCase();
  return chats.value.filter(
    (c) =>
      c.company.toLowerCase().includes(q) ||
      c.jobTitle.toLowerCase().includes(q),
  );
});

if (chats.value.length > 0) {
  activeChat.value = chats.value[0];
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  newMessage.value = "";
};
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
