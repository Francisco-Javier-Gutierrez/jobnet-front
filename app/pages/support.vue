<template>
  <div
    class="max-w-7xl mx-auto px-4 py-8 w-full flex-grow flex flex-col min-h-[calc(100vh-8rem)] bg-background"
    role="main"
  >
    <!-- Header -->
    <div
      class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h1
          class="text-2xl sm:text-3xl font-bold text-on-background dark:text-slate-100 mb-1 flex items-center gap-2.5"
        >
          <span
            class="material-symbols-outlined text-amber-500 text-3xl"
            >support_agent</span
          >
          Centro de Soporte y Ayuda
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-xs sm:text-sm">
          Reporta fallos técnicos, dudas o problemas de cuenta para recibir asistencia de Moderación JobNet.
        </p>
      </div>

      <!-- Connection status & Action Button -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <span
            :class="[
              'w-2.5 h-2.5 rounded-full',
              wsConnected
                ? 'bg-emerald-500'
                : 'bg-amber-500 animate-pulse',
            ]"
          ></span>
          <span
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
          >
            {{ wsConnected ? "En línea" : "Conectando..." }}
          </span>
        </div>

        <button
          @click="showCreateModal = true"
          class="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition flex items-center gap-2 shadow-sm active:scale-95 flex-shrink-0 cursor-pointer"
        >
          <span class="material-symbols-outlined text-base">report_problem</span>
          Reportar un problema
        </button>
      </div>
    </div>

    <!-- Main Grid / Workspace -->
    <div
      class="h-[calc(100dvh-11rem)] sm:h-[calc(100vh-10rem)] min-h-[520px] flex flex-col lg:grid lg:grid-cols-12 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl flex-grow overflow-hidden shadow-sm animate-fadeIn"
    >
      <!-- Left Panel: Tickets List (5 Cols) -->
      <div
        class="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-outline-variant/60 flex flex-col h-full bg-surface-container-lowest dark:bg-slate-900 min-h-0"
        :class="{ 'hidden lg:flex': activeTicket }"
      >
        <!-- Search and Filter Bar -->
        <div class="p-4 border-b border-outline-variant/60 bg-surface-container-low/20 space-y-3">
          <div class="relative">
            <span
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <span
                class="material-symbols-outlined text-on-surface-variant dark:text-slate-400 text-lg"
                >search</span
              >
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar en mis reportes..."
              class="pl-9 pr-4 py-2 w-full bg-surface dark:bg-slate-800/80 border border-outline-variant/60 rounded-xl text-xs focus:outline-none focus:border-primary text-on-background dark:text-slate-100"
            />
          </div>

          <div class="flex items-center justify-between text-[11px] font-bold text-on-surface-variant dark:text-slate-300">
            <span>MIS REPORTES</span>
            <div class="flex items-center gap-2">
              <span class="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {{ filteredTickets.length }} ticket(s)
              </span>
              <button
                type="button"
                @click="manualRefresh"
                :disabled="isLoadingTickets"
                title="Actualizar reportes"
                class="hover:text-primary transition flex items-center p-0.5 rounded text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-low"
              >
                <span class="material-symbols-outlined text-[15px]" :class="{ 'animate-spin': isLoadingTickets }">refresh</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Tickets List View -->
        <div class="flex-grow overflow-y-auto divide-y divide-outline-variant/30">
          <div v-if="isLoadingTickets" class="p-8 text-center text-on-surface-variant text-xs">
            <span class="material-symbols-outlined animate-spin text-2xl text-primary mb-2">progress_activity</span>
            <p>Cargando reportes...</p>
          </div>

          <div
            v-else-if="filteredTickets.length === 0"
            class="p-8 text-center flex flex-col items-center justify-center text-on-surface-variant text-xs space-y-3"
          >
            <div class="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <span class="material-symbols-outlined text-2xl">inbox</span>
            </div>
            <div>
              <p class="font-bold text-on-background dark:text-slate-200">No hay tickets registrados</p>
              <p class="text-[11px] mt-0.5">Si tienes dudas o un fallo, crea un reporte con el botón superior.</p>
            </div>
            <button
              @click="showCreateModal = true"
              class="text-xs text-primary font-bold hover:underline"
            >
              + Crear primer reporte
            </button>
          </div>

          <button
            v-for="ticket in filteredTickets"
            :key="ticket.id || ticket.ticketId"
            @click="handleSelectTicket(ticket)"
            class="w-full text-left p-4 hover:bg-surface-container-low/40 dark:hover:bg-slate-800/40 transition duration-150 flex gap-3 relative"
            :class="
              (activeTicket?.id || activeTicket?.ticketId) === (ticket.id || ticket.ticketId)
                ? 'bg-primary/5 dark:bg-primary/10'
                : ''
            "
          >
            <!-- Highlight bar -->
            <div
              v-if="(activeTicket?.id || activeTicket?.ticketId) === (ticket.id || ticket.ticketId)"
              class="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"
            ></div>

            <!-- Status Icon -->
            <div
              class="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xs"
              :class="getStatusBadgeClass(ticket.status)"
            >
              <span class="material-symbols-outlined text-lg">
                {{ getStatusIcon(ticket.status) }}
              </span>
            </div>

            <!-- Content -->
            <div class="flex-grow min-w-0">
              <div class="flex justify-between items-start mb-0.5">
                <h3 class="text-xs font-bold text-on-background dark:text-slate-100 truncate">
                  {{ ticket.subject }}
                </h3>
                <span class="text-[10px] text-on-surface-variant dark:text-slate-400 font-medium whitespace-nowrap ml-2">
                  {{ formatDate(ticket.updatedAt || ticket.createdAt) }}
                </span>
              </div>

              <div class="flex items-center gap-1.5 mb-1.5 flex-wrap">
                <span
                  class="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                  :class="getCategoryClass(ticket.category)"
                >
                  {{ formatCategory(ticket.category) }}
                </span>
                <span
                  class="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                  :class="getStatusPillClass(ticket.status)"
                >
                  {{ formatStatus(ticket.status) }}
                </span>
              </div>

              <p class="text-[11px] text-on-surface-variant dark:text-slate-400 truncate">
                {{ ticket.lastMessage || ticket.description }}
              </p>
            </div>
          </button>
        </div>
      </div>

      <!-- Right Panel: Active Ticket Chat & Thread (7 Cols) -->
      <div
        class="lg:col-span-7 flex flex-col h-full bg-surface-container-low/10 dark:bg-slate-900/60 min-h-0"
        :class="{ 'hidden lg:flex': !activeTicket }"
      >
        <template v-if="activeTicket">
          <!-- Ticket Header -->
          <div
            class="p-3 sm:p-4 border-b border-outline-variant/60 bg-surface-container-lowest dark:bg-slate-900 flex items-center justify-between shadow-sm flex-shrink-0"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <!-- Back button on mobile -->
              <button
                @click="activeTicket = null"
                class="lg:hidden p-1.5 -ml-1 text-on-surface-variant hover:text-primary rounded-lg flex items-center justify-center flex-shrink-0"
                title="Volver a la lista de reportes"
              >
                <span class="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h2 class="text-xs sm:text-sm font-bold text-on-background dark:text-slate-100 truncate">
                    {{ activeTicket.subject }}
                  </h2>
                  <span
                    class="text-[9px] font-bold px-2 py-0.5 rounded uppercase flex-shrink-0"
                    :class="getStatusPillClass(activeTicket.status)"
                  >
                    {{ formatStatus(activeTicket.status) }}
                  </span>
                </div>
                <p class="text-[10px] sm:text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5 flex items-center gap-2 truncate">
                  <span>Categoría: {{ formatCategory(activeTicket.category) }}</span>
                  <span>•</span>
                  <span v-if="activeTicket.assignedModeratorName" class="text-primary font-semibold flex items-center gap-1 truncate">
                    <span class="material-symbols-outlined text-[13px]">verified_user</span>
                    {{ activeTicket.assignedModeratorName }}
                  </span>
                  <span v-else class="text-amber-500 font-medium">
                    Sin asignar
                  </span>
                </p>
              </div>
            </div>

            <span class="text-[10px] text-on-surface-variant dark:text-slate-400 font-mono hidden sm:inline flex-shrink-0">
              #{{ (activeTicket.id || activeTicket.ticketId).substring(0, 15) }}
            </span>
          </div>

          <!-- Messages Container -->
          <div
            ref="chatContainer"
            class="flex-1 overflow-y-auto min-h-0 p-3 sm:p-4 space-y-3 sm:space-y-4 bg-surface-container-low/20 dark:bg-slate-950/40"
          >
            <!-- Initial Problem Context Box -->
            <div
              class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-xl p-4 max-w-xl mx-auto shadow-sm"
            >
              <div class="flex items-center gap-2 mb-2 text-primary font-bold text-xs">
                <span class="material-symbols-outlined text-base">info</span>
                <span>Descripción original del problema</span>
              </div>
              <p class="text-xs text-on-background dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {{ activeTicket.description }}
              </p>

              <!-- Initial Attachments if any -->
              <div
                v-if="initialAttachments.length > 0"
                class="mt-3 pt-3 border-t border-outline-variant/40 flex flex-wrap gap-2"
              >
                <div
                  v-for="(att, i) in initialAttachments"
                  :key="i"
                  class="flex items-center gap-1.5 bg-surface dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-outline-variant/40 text-xs"
                >
                  <span class="material-symbols-outlined text-sm text-primary">attachment</span>
                  <a
                    :href="att.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline font-medium truncate max-w-[200px]"
                  >
                    {{ att.name || "Adjunto " + (i + 1) }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Resolution Notice Banner -->
            <div
              v-if="activeTicket.status === 'RESUELTO'"
              class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 max-w-xl mx-auto text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5"
            >
              <span class="material-symbols-outlined text-emerald-600 text-xl flex-shrink-0">check_circle</span>
              <div>
                <p class="font-bold">Este caso ha sido marcado como RESUELTO por moderación.</p>
                <p v-if="activeTicket.resolutionNotes" class="mt-0.5 text-[11px]">
                  <strong>Resolución:</strong> {{ activeTicket.resolutionNotes }}
                </p>
              </div>
            </div>

            <!-- Separator -->
            <div class="text-center">
              <span
                class="text-[9px] font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest bg-surface-container-low dark:bg-slate-800 px-2.5 py-1 rounded border border-outline-variant/30"
              >
                Conversación con Moderación
              </span>
            </div>

            <!-- Thread Messages -->
            <div
              v-for="msg in messages"
              :key="msg.messageId || msg.createdAt"
              class="flex flex-col"
              :class="isMyMessage(msg) ? 'items-end' : 'items-start'"
            >
              <div class="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-on-surface-variant dark:text-slate-400 font-medium">
                <span v-if="!isMyMessage(msg)" class="font-bold text-primary flex items-center gap-1">
                  <span class="material-symbols-outlined text-[12px]">verified_user</span>
                  {{ msg.senderName || "Moderador JobNet" }}
                </span>
                <span v-else class="font-bold">Tú</span>
                <span>•</span>
                <span>{{ formatTime(msg.createdAt) }}</span>
              </div>

              <div
                class="max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-sm whitespace-pre-wrap"
                :class="
                  isMyMessage(msg)
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 text-on-background dark:text-slate-100 rounded-tl-none'
                "
              >
                <p class="leading-relaxed">{{ msg.message || msg.text }}</p>

                <!-- Attachments in message -->
                <div v-if="msg.attachments && msg.attachments.length > 0" class="mt-2 space-y-1.5">
                  <div
                    v-for="(att, idx) in msg.attachments"
                    :key="idx"
                  >
                    <!-- Image Preview -->
                    <div
                      v-if="isImgAttachment(att)"
                      class="rounded-xl overflow-hidden border border-outline-variant/40 max-w-[220px]"
                    >
                      <a :href="att.url" target="_blank" rel="noopener noreferrer">
                        <img
                          :src="att.url"
                          :alt="att.name || 'Imagen adjunta'"
                          class="w-full h-auto object-cover max-h-[180px] hover:opacity-90 transition cursor-pointer"
                        />
                      </a>
                    </div>
                    <!-- Document Card -->
                    <div
                      v-else
                      class="flex items-center gap-1.5 p-1.5 rounded-lg text-xs"
                      :class="isMyMessage(msg) ? 'bg-white/10' : 'bg-surface-container-low dark:bg-slate-800'"
                    >
                      <span class="material-symbols-outlined text-sm">description</span>
                      <a
                        :href="att.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="underline truncate max-w-[200px]"
                      >
                        {{ att.name || "Documento adjunto" }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input Bar -->
          <div
            class="bg-surface-container-lowest dark:bg-slate-900 border-t border-outline-variant/60 flex flex-col flex-shrink-0 sticky bottom-0 z-10"
          >
            <!-- Staged File Pre-send Preview Bar -->
            <div
              v-if="stagedAttachment"
              class="px-4 py-2 bg-primary/5 dark:bg-slate-800/80 border-b border-outline-variant/40 flex items-center justify-between gap-3 animate-fadeIn"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <div
                  v-if="stagedAttachment.isImage && stagedAttachment.previewUrl"
                  class="w-8 h-8 rounded-lg overflow-hidden border border-outline-variant/60 flex-shrink-0"
                >
                  <img
                    :src="stagedAttachment.previewUrl"
                    alt="Vista previa"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center flex-shrink-0"
                >
                  <span class="material-symbols-outlined text-lg">description</span>
                </div>
                <div class="truncate">
                  <p class="text-xs font-semibold text-on-surface dark:text-slate-100 truncate">
                    {{ stagedAttachment.name }}
                  </p>
                  <p class="text-[10px] text-on-surface-variant dark:text-slate-400">
                    {{ stagedAttachment.sizeFormatted }} • Adjunto preparado para enviar
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="removeStagedAttachment"
                class="p-1 rounded-lg text-on-surface-variant hover:text-rose-500 hover:bg-rose-500/10 transition flex-shrink-0 cursor-pointer"
                title="Quitar archivo adjunto"
              >
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <!-- Input Row -->
            <div class="p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3">
              <!-- Hidden file input -->
              <input
                ref="fileInputRef"
                type="file"
                class="hidden"
                accept="image/*,application/pdf"
                @change="handleFileSelect"
              />

              <!-- Attach button -->
              <button
                type="button"
                @click="triggerFileInput"
                :disabled="isUploading || isSending"
                class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/60 hover:border-primary text-on-surface-variant dark:text-slate-300 flex items-center justify-center transition disabled:opacity-50 flex-shrink-0 cursor-pointer"
                title="Adjuntar documento PDF o imagen (máx 5MB)"
              >
                <span v-if="isUploading" class="material-symbols-outlined text-base animate-spin">progress_activity</span>
                <span v-else class="material-symbols-outlined text-lg">attach_file</span>
              </button>

              <input
                v-model="newMessageText"
                @keydown.enter.prevent="handleSendMessage"
                type="text"
                placeholder="Escribe una respuesta para el equipo de moderación..."
                class="flex-grow bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/60 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs text-on-background dark:text-slate-100 focus:outline-none focus:border-primary"
              />
              <button
                @click="handleSendMessage"
                :disabled="(!newMessageText.trim() && !stagedAttachment) || isSending || isUploading"
                class="bg-primary hover:bg-primary-container text-white disabled:opacity-50 font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm flex-shrink-0 cursor-pointer"
              >
                <span v-if="isSending || isUploading" class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                <span v-else class="material-symbols-outlined text-[16px]">send</span>
                <span class="hidden sm:inline">Responder</span>
              </button>
            </div>
          </div>
        </template>

        <!-- No Ticket Selected View -->
        <div
          v-else
          class="flex-grow flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/10 h-full"
        >
          <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <span class="material-symbols-outlined text-3xl">chat</span>
          </div>
          <h3 class="text-base font-bold text-on-background dark:text-slate-100 mb-1">
            Selecciona un reporte de soporte
          </h3>
          <p class="text-on-surface-variant dark:text-slate-400 text-xs max-w-sm">
            Elige un ticket de la lista para ver la conversación con el moderador o inicia un nuevo reporte.
          </p>
        </div>
      </div>
    </div>

    <!-- Report Problem Modal -->
    <ReportProblemModal
      v-model="showCreateModal"
      @ticketCreated="onTicketCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useSupportTickets } from "~/composables/useSupportTickets";
import { useS3Upload } from "~/composables/useS3Upload";
import { useAppFeedback } from "~/composables/useAppFeedback";
import ReportProblemModal from "~/components/support/ReportProblemModal.vue";
import type { SupportTicket, SupportTicketMessage, CreateTicketDTO, TicketAttachment } from "~/types/support";

useSeoMeta({
  title: "Centro de Soporte - JobNet",
  description: "Atención directa de dudas, fallos técnicos y problemas con Moderación JobNet",
});

const {
  tickets,
  activeTicket,
  messages,
  isLoadingTickets,
  isSending,
  userId,
  wsConnected,
  connectWebSocket,
  closeWebSocket,
  fetchMyTickets,
  selectTicket,
  createTicket,
  sendMessage,
} = useSupportTickets();

const { uploadFile, isUploading } = useS3Upload();
const { showError } = useAppFeedback();

interface StagedAttachment {
  file: File;
  name: string;
  sizeFormatted: string;
  isImage: boolean;
  previewUrl?: string;
}

const stagedAttachment = ref<StagedAttachment | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const maxAllowedSize = 5 * 1024 * 1024;
  if (file.size > maxAllowedSize) {
    showError("Archivo demasiado grande", "El archivo no debe exceder 5 MB.");
    if (fileInputRef.value) fileInputRef.value.value = "";
    return;
  }

  const isImage = file.type.startsWith("image/");
  const previewUrl = isImage ? URL.createObjectURL(file) : undefined;
  const sizeFormatted = (file.size / 1024).toFixed(1) + " KB";

  stagedAttachment.value = {
    file,
    name: file.name,
    sizeFormatted,
    isImage,
    previewUrl,
  };
};

const removeStagedAttachment = () => {
  if (stagedAttachment.value?.previewUrl) {
    URL.revokeObjectURL(stagedAttachment.value.previewUrl);
  }
  stagedAttachment.value = null;
  if (fileInputRef.value) fileInputRef.value.value = "";
};

const isImgAttachment = (att: any) => {
  if (!att?.url) return false;
  return (
    att.type === "image" ||
    /\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(att.url) ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(att.name || "")
  );
};

const searchQuery = ref("");
const showCreateModal = ref(false);
const newMessageText = ref("");
const chatContainer = ref<HTMLDivElement | null>(null);

let pollInterval: any = null;

const filteredTickets = computed(() => {
  if (!searchQuery.value.trim()) return tickets.value;
  const q = searchQuery.value.toLowerCase();
  return tickets.value.filter(
    (t) =>
      t.subject.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.lastMessage && t.lastMessage.toLowerCase().includes(q))
  );
});

const initialAttachments = computed(() => {
  if (!activeTicket.value) return [];
  const meta: any = activeTicket.value;
  return meta.attachments || [];
});

const isMyMessage = (msg: SupportTicketMessage) => {
  return msg.senderId === userId.value || msg.senderRole === "USER";
};

const handleSelectTicket = async (ticket: SupportTicket) => {
  await selectTicket(ticket);
  scrollToBottom();
};

const onTicketCreated = async (payload: CreateTicketDTO) => {
  showCreateModal.value = false;
  const newTicket = await createTicket(payload);
  if (newTicket) {
    await selectTicket(newTicket);
    scrollToBottom();
  }
};

const handleSendMessage = async () => {
  if (
    !activeTicket.value ||
    (!newMessageText.value.trim() && !stagedAttachment.value) ||
    isSending.value ||
    isUploading.value
  )
    return;

  const text = newMessageText.value.trim();
  const ticketId = activeTicket.value.id || activeTicket.value.ticketId;
  let attachmentsToSend: TicketAttachment[] | undefined = undefined;

  if (stagedAttachment.value) {
    try {
      const uploadRes = await uploadFile(stagedAttachment.value.file, {
        folder: "support",
        userId: userId.value || "user",
      });
      if (uploadRes?.url) {
        attachmentsToSend = [
          {
            name: stagedAttachment.value.name,
            url: uploadRes.url,
            size: stagedAttachment.value.file.size,
            type: stagedAttachment.value.isImage ? "image" : "file",
          },
        ];
      }
    } catch (err: any) {
      console.error("Error al subir archivo adjunto de soporte:", err);
      showError("Error de subida", "No se pudo subir el archivo adjunto.");
      return;
    }
  }

  const success = await sendMessage(ticketId, text, attachmentsToSend);
  if (success) {
    newMessageText.value = "";
    removeStagedAttachment();
    scrollToBottom();
  }
};

const scrollToBottom = (smooth = true) => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTo({
        top: chatContainer.value.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  });
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTo({
        top: chatContainer.value.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, 80);
};

const formatCategory = (cat: string) => {
  switch (cat) {
    case "FALLO_TECNICO":
      return "Fallo técnico";
    case "DUDA_GENERAL":
      return "Duda general";
    case "PROBLEMA_CUENTA":
      return "Problema cuenta";
    default:
      return "General";
  }
};

const getCategoryClass = (cat: string) => {
  switch (cat) {
    case "FALLO_TECNICO":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
    case "DUDA_GENERAL":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400";
    case "PROBLEMA_CUENTA":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    default:
      return "bg-slate-500/10 text-slate-600 dark:text-slate-400";
  }
};

const formatStatus = (st: string) => {
  switch (st) {
    case "EN_PROCESO":
      return "En atención";
    case "RESUELTO":
      return "Resuelto";
    case "ABIERTO":
    default:
      return "Abierto";
  }
};

const getStatusBadgeClass = (st: string) => {
  switch (st) {
    case "EN_PROCESO":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400";
    case "RESUELTO":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "ABIERTO":
    default:
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }
};

const getStatusPillClass = (st: string) => {
  switch (st) {
    case "EN_PROCESO":
      return "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300";
    case "RESUELTO":
      return "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300";
    case "ABIERTO":
    default:
      return "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300";
  }
};

const getStatusIcon = (st: string) => {
  switch (st) {
    case "EN_PROCESO":
      return "support_agent";
    case "RESUELTO":
      return "check_circle";
    case "ABIERTO":
    default:
      return "help_outline";
  }
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

const formatTime = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

const manualRefresh = async () => {
  await fetchMyTickets(false);
  if (activeTicket.value) {
    await selectTicket(activeTicket.value, false);
  }
};

watch(
  () => messages.value,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

onMounted(async () => {
  connectWebSocket();

  const loaded = await fetchMyTickets(false);
  if (loaded && loaded.length > 0) {
    await selectTicket(loaded[0], false);
    scrollToBottom();
  }

  // Gentle backup sync every 30 seconds only if active ticket is open and page is visible
  pollInterval = setInterval(async () => {
    if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
    if (activeTicket.value && !isSending.value) {
      await selectTicket(activeTicket.value, true);
    }
  }, 30000);
});

onUnmounted(() => {
  closeWebSocket();
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
});
</script>
