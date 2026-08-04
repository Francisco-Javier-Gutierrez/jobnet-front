<template>
  <div
    class="max-w-7xl mx-auto px-4 py-8 w-full flex-grow flex flex-col min-h-[calc(100vh-8rem)] bg-background"
    role="main"
  >
    <!-- Page Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1
          class="text-2xl font-bold text-on-background dark:text-slate-100 mb-2 flex items-center gap-2"
        >
          <span
            class="material-symbols-outlined text-rose-600 dark:text-rose-400 text-2xl"
            >gavel</span
          >
          Gestión de Apelaciones y Dictámenes
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Audita y resuelve en tiempo real las apelaciones presentadas por
          organizaciones y reclutadores.
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
          {{ wsConnected ? "Canal Live WS Conectado" : "Conectando..." }}
        </span>
      </div>
    </div>

    <!-- Main Grid -->
    <div
      class="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl flex-grow overflow-hidden min-h-[600px] shadow-sm animate-fadeIn"
    >
      <!-- Left Panel: Appeals List (5 Cols) -->
      <div
        class="lg:col-span-5 border-r border-outline-variant/60 flex flex-col h-full bg-surface-container-low/40"
      >
        <!-- Search and Filter Header -->
        <div class="p-4 border-b border-outline-variant/60 space-y-3">
          <div class="relative">
            <span
              class="absolute left-3 top-2.5 material-symbols-outlined text-on-surface-variant dark:text-slate-300 text-lg"
              >search</span
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por empresa o motivo..."
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-rose-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-background dark:text-slate-100 outline-none transition"
            />
          </div>

          <!-- Type filter tabs -->
          <div class="flex gap-1.5 p-1 bg-surface-container rounded-xl text-xs">
            <button
              @click="filterType = 'ALL'"
              :class="[
                'flex-1 py-1.5 px-3 rounded-lg font-bold transition text-center text-[11px]',
                filterType === 'ALL'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-background',
              ]"
            >
              Todos ({{ appeals.length }})
            </button>
            <button
              @click="filterType = 'ORGANIZACION'"
              :class="[
                'flex-1 py-1.5 px-3 rounded-lg font-bold transition text-center text-[11px]',
                filterType === 'ORGANIZACION'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-background',
              ]"
            >
              Empresas
            </button>
            <button
              @click="filterType = 'VACANTE'"
              :class="[
                'flex-1 py-1.5 px-3 rounded-lg font-bold transition text-center text-[11px]',
                filterType === 'VACANTE'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-background',
              ]"
            >
              Vacantes
            </button>
          </div>
        </div>

        <!-- Appeals Items List -->
        <div
          class="flex-grow overflow-y-auto max-h-[550px] divide-y divide-outline-variant/30"
        >
          <div
            v-if="isLoading"
            class="p-8 text-center text-xs text-on-surface-variant"
          >
            <span class="inline-block animate-spin mr-2">⏳</span> Cargando
            solicitudes de apelación...
          </div>
          <div
            v-else-if="filteredAppeals.length === 0"
            class="p-8 text-center text-xs text-on-surface-variant space-y-2"
          >
            <span class="material-symbols-outlined text-3xl opacity-40"
              >gavel</span
            >
            <p>No se encontraron apelaciones activas.</p>
          </div>
          <div
            v-for="appeal in filteredAppeals"
            :key="appeal.id"
            @click="selectAppeal(appeal)"
            :class="[
              'p-4 flex items-start gap-3 cursor-pointer transition hover:bg-surface-container-high/40',
              selectedAppealId === appeal.id
                ? 'bg-rose-500/10 border-l-4 border-rose-600 font-semibold'
                : '',
            ]"
          >
            <div
              class="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 text-rose-700 dark:text-rose-300 font-bold text-sm"
            >
              {{ appeal.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-grow min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3
                  class="text-xs font-bold text-on-background dark:text-slate-100 truncate"
                >
                  {{ appeal.name }}
                </h3>
                <span
                  class="text-[10px] text-on-surface-variant dark:text-slate-300/80"
                  >{{ formatDate(appeal.createdAt) }}</span
                >
              </div>
              <p
                class="text-[11px] text-rose-600 dark:text-rose-400 font-semibold truncate mb-1"
              >
                {{ appeal.reason }}
              </p>
              <div
                class="flex items-center justify-between text-[10px] text-on-surface-variant"
              >
                <span
                  class="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold"
                >
                  {{ appeal.type || "ORGANIZACION" }}
                </span>
                <span class="font-bold text-amber-600 dark:text-amber-400">
                  {{ appeal.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Live Appeal Workspace (7 Cols) -->
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
                class="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-700 dark:text-rose-300 font-bold text-sm flex-shrink-0"
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
                    class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20"
                  >
                    {{ activeAppeal.type || "ORGANIZACION" }}
                  </span>
                </div>
                <p
                  class="text-[10px] text-on-surface-variant dark:text-slate-300"
                >
                  Motivo: {{ activeAppeal.reason }}
                </p>
              </div>
            </div>

            <!-- Dictamen Action Buttons ALWAYS visible for Moderator -->
            <div class="flex items-center gap-2">
              <template v-if="activeAppeal.type === 'VACANTE'">
                <button
                  @click="resolveVacancyAppeal('approve')"
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
                  @click="resolveVacancyAppeal('block')"
                  :disabled="isProcessingAction"
                  class="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm disabled:opacity-40"
                  title="Mantener sanción y cerrar vacante definitivamente"
                >
                  <span class="material-symbols-outlined text-[16px]"
                    >block</span
                  >
                  Sancionar
                </button>
              </template>

              <template v-else>
                <button
                  @click="resolveOrgAppeal('approve')"
                  :disabled="isProcessingAction"
                  class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm disabled:opacity-40"
                  title="Aprobar apelación y reactivar cuenta de la empresa"
                >
                  <span class="material-symbols-outlined text-[16px]"
                    >check_circle</span
                  >
                  Aprobar Apelación
                </button>
                <button
                  @click="resolveOrgAppeal('confirm')"
                  :disabled="isProcessingAction"
                  class="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm disabled:opacity-40"
                  title="Confirmar suspensión permanente de la organización"
                >
                  <span class="material-symbols-outlined text-[16px]"
                    >cancel</span
                  >
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
            ref="chatContainer"
            class="flex-grow p-4 overflow-y-auto max-h-[440px] flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-950/40"
          >
            <div
              v-if="activeAppeal.messages.length === 0"
              class="text-center text-xs text-slate-400 my-8"
            >
              No hay mensajes previos en este canal. Escribe para iniciar el
              diálogo de apelación.
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
                    ? 'bg-rose-600 text-white rounded-tr-none shadow-sm shadow-rose-600/15'
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
              class="w-10 h-10 rounded-xl bg-surface border border-outline-variant/60 hover:border-rose-600 text-on-surface-variant dark:text-slate-300 flex items-center justify-center transition disabled:opacity-50 flex-shrink-0"
              title="Adjuntar PDF o Imagen de evidencia"
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
              placeholder="Escribe una respuesta para la empresa en apelación..."
              class="flex-grow bg-surface dark:bg-slate-800 border border-outline-variant/60 hover:border-outline focus:border-rose-600 rounded-xl px-4 py-3 text-xs text-on-background dark:text-slate-100 outline-none transition"
            />
            <button
              @click="sendMessage"
              :disabled="!newMessageText.trim() && !pendingAttachment"
              class="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition active:scale-95 flex-shrink-0 disabled:opacity-50 shadow-sm"
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
              class="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400"
            >
              <span class="material-symbols-outlined text-[40px]">gavel</span>
            </div>
            <h3
              class="text-sm font-bold text-on-background dark:text-slate-100 mb-1"
            >
              Selecciona una solicitud de apelación
            </h3>
            <p
              class="text-xs text-on-surface-variant dark:text-slate-300 max-w-sm"
            >
              Elige una empresa o vacante del listado de la izquierda para
              moderar el caso y enviar dictamen.
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
  title: "Gestión de Apelaciones - Moderación JobNet",
  description:
    "Bandeja de moderación para evaluar y resolver apelaciones de empresas y vacantes",
});

const config = useRuntimeConfig();
const { data: session, getSession } = useAuth();
const { uploadFile, uploadError: s3UploadError } = useS3Upload();

const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const pendingAttachment = ref<{
  url: string;
  type: string;
  name: string;
} | null>(null);

const userId = computed(() => (session.value?.user as any)?.id || "mod-user");
const searchQuery = ref("");
const filterType = ref<"ALL" | "ORGANIZACION" | "VACANTE">("ALL");

const appeals = ref<any[]>([]);
const selectedAppealId = ref<string | null>(null);
const newMessageText = ref("");
const isLoading = ref(true);
const isProcessingAction = ref(false);
const chatContainer = ref<HTMLDivElement | null>(null);

const socket = ref<WebSocket | null>(null);
const wsConnected = ref(false);

const filteredAppeals = computed(() => {
  let result = appeals.value;
  if (filterType.value !== "ALL") {
    result = result.filter((a) => a.type === filterType.value);
  }
  const q = searchQuery.value.toLowerCase().trim();
  if (q) {
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(q) || a.reason.toLowerCase().includes(q),
    );
  }
  return result;
});

const activeAppeal = computed(() => {
  return appeals.value.find((a) => a.id === selectedAppealId.value) || null;
});

const isModeratorSender = (msg: any) => {
  if (!activeAppeal.value) return true;
  const compId = activeAppeal.value.companyId || activeAppeal.value.id;
  return (
    msg.sender === "MODERATOR" || (msg.senderId && msg.senderId !== compId)
  );
};

const orgMessageCount = computed(() => {
  if (!activeAppeal.value || !activeAppeal.value.messages) return 0;
  const compId = activeAppeal.value.companyId || activeAppeal.value.id;
  return activeAppeal.value.messages.filter(
    (m: any) => m.sender === "USER" || m.senderId === compId,
  ).length;
});

const fetchAppeals = async () => {
  isLoading.value = true;
  try {
    const data = await $fetch<any[]>(
      `${config.public.apiUrl}/moderator/appeals`,
    ).catch(() => []);

    appeals.value = (data || []).map((item) => ({
      ...item,
      messages: item.messages || [],
    }));

    if (appeals.value.length > 0 && !selectedAppealId.value) {
      await selectAppeal(appeals.value[0]);
    }
  } catch (err) {
    console.error("Error fetching appeals:", err);
  } finally {
    isLoading.value = false;
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
    (s as any)?.idToken ||
    (s as any)?.accessToken ||
    (s as any)?.token ||
    (s as any)?.user?.idToken ||
    (s as any)?.user?.token ||
    "";

  if (!token) {
    console.warn("No token found for moderator WebSocket connection.");
    return;
  }

  try {
    const wsUrl = `${config.public.wsUrl}?token=${token}&role=MODERATOR`;
    socket.value = new WebSocket(wsUrl);

    socket.value.onopen = () => {
      wsConnected.value = true;
      console.log("Moderator WebSocket connected successfully.");
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
            attachmentType,
            attachmentName,
            createdAt,
            messageId: incomingMsgId,
          } = payload;
          const target = appeals.value.find(
            (a) => a.companyId === appealCompanyId || a.id === appealCompanyId,
          );
          if (target) {
            const compId = target.companyId || target.id;
            const timeStr = new Date(
              createdAt || Date.now(),
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            // Deduplication: check by messageId first (robust), then fall back to text match
            const isDuplicate = target.messages.some((m: any) => {
              if (incomingMsgId && m.messageId && m.messageId === incomingMsgId)
                return true;
              if (m.createdAt && createdAt && m.createdAt === createdAt)
                return true;
              return false;
            });

            if (!isDuplicate) {
              target.messages.push({
                id: `m-ws-${Date.now()}`,
                messageId: incomingMsgId || null,
                senderId,
                sender: senderId === compId ? "USER" : "MODERATOR",
                text: text || "",
                attachmentUrl: attachmentUrl || null,
                attachmentType: attachmentType || null,
                attachmentName: attachmentName || null,
                createdAt: createdAt || new Date().toISOString(),
                time: timeStr,
              });
              scrollToBottom();
            }
          }
        } else if (payload.type === "APPEAL_RESOLVED") {
          const { appealCompanyId } = payload;
          appeals.value = appeals.value.filter(
            (a) => (a.companyId || a.id) !== appealCompanyId,
          );
          if (
            selectedAppealId.value === appealCompanyId ||
            (activeAppeal.value &&
              (activeAppeal.value.companyId || activeAppeal.value.id) ===
                appealCompanyId)
          ) {
            selectedAppealId.value = null;
          }
        }
      } catch (e) {
        console.error("Error handling appeal WS message:", e);
      }
    };

    socket.value.onclose = () => {
      wsConnected.value = false;
      console.log("Moderator WebSocket closed. Attempting reconnect in 3s...");
      setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };
  } catch (err) {
    console.warn("WebSocket error:", err);
  }
};

const selectAppeal = async (appeal: any) => {
  selectedAppealId.value = appeal.id;
  const compId = appeal.companyId || appeal.id;

  try {
    const msgs = await $fetch<any[]>(
      `${config.public.apiUrl}/moderator/organizations/${compId}/appeal-messages`,
    ).catch(() => []);

    appeal.messages = (msgs || []).map((m) => ({
      id: `m-${m.createdAt}`,
      senderId: m.senderId,
      sender: m.senderId === compId ? "USER" : "MODERATOR",
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
  } catch (e) {
    console.error("Error loading appeal messages:", e);
  }

  scrollToBottom();
};

const resolveOrgAppeal = async (action: "approve" | "confirm") => {
  if (!activeAppeal.value || isProcessingAction.value) return;
  isProcessingAction.value = true;
  const compId = activeAppeal.value.companyId || activeAppeal.value.id;

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
    appeals.value = appeals.value.filter(
      (a) => a.id !== activeAppeal.value?.id,
    );
    selectedAppealId.value = appeals.value[0]?.id || null;
  } catch (e) {
    console.error("Error resolving organization appeal:", e);
    showError("Error", "Hubo un error al procesar el dictamen.");
  } finally {
    isProcessingAction.value = false;
  }
};

const resolveVacancyAppeal = async (action: "approve" | "block") => {
  if (!activeAppeal.value || isProcessingAction.value) return;
  isProcessingAction.value = true;

  try {
    await $fetch(
      `${config.public.apiUrl}/moderator/incidents/${activeAppeal.value.id}/resolve`,
      {
        method: "POST",
        body: { action },
      },
    ).catch(() => {});

    showInfo(
      "Notificación",
      action === "approve"
        ? "Vacante aprobada y reactivada en el Job Board."
        : "Vacante sancionada y cerrada definitivamente.",
    );

    appeals.value = appeals.value.filter(
      (a) => a.id !== activeAppeal.value?.id,
    );
    selectedAppealId.value = appeals.value[0]?.id || null;
  } catch (e) {
    console.error("Error resolving vacancy appeal:", e);
    showError(
      "Error",
      "Hubo un error al procesar la resolución de la vacante.",
    );
  } finally {
    isProcessingAction.value = false;
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
          attachmentType: attachment?.type || undefined,
          attachmentName: attachment?.name || undefined,
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
  if ((!text && !attachment) || !activeAppeal.value) return;

  const compId = activeAppeal.value.companyId || activeAppeal.value.id;
  if (!compId) return;

  const now = new Date().toISOString();
  const timeStr = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const messageId = crypto.randomUUID();

  // Optimistic Local Push
  activeAppeal.value.messages.push({
    id: `m-mod-${Date.now()}`,
    messageId,
    senderId: userId.value,
    sender: "MODERATOR",
    text,
    attachmentUrl: attachment?.url || null,
    attachmentType: attachment?.type || null,
    attachmentName: attachment?.name || null,
    createdAt: now,
    time: timeStr,
  });

  newMessageText.value = "";
  pendingAttachment.value = null;

  // Use WS if open; fallback to HTTP only if WS is closed
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

  scrollToBottom();
};

const isImageUrl = (url?: string) => {
  if (!url) return false;
  const cleanUrl = url.split("?")[0];
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleanUrl);
};

const openImagePreview = (url: string) => {
  window.open(url, "_blank");
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "Reciente";
  return new Date(dateStr).toLocaleDateString([], {
    month: "short",
    day: "numeric",
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
  await fetchAppeals();
  await connectWebSocket();
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});
</script>
