<template>
  <div
    class="max-w-7xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200 flex flex-col"
    role="main"
  >
    <!-- Header -->
    <div
      class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h1
          class="text-2xl sm:text-3xl font-bold tracking-tight text-on-background dark:text-slate-100 mb-1 flex items-center gap-2.5"
        >
          <span class="material-symbols-outlined text-amber-500 text-3xl"
            >headset_mic</span
          >
          Mesa de Ayuda y Soporte a Usuarios
        </h1>
        <p
          class="text-on-surface-variant dark:text-slate-300 text-xs sm:text-sm"
        >
          Atiende reportes de fallos técnicos, problemas de cuenta y dudas
          generales enviados por candidatos y organizaciones.
        </p>
      </div>

      <!-- Live connection badge -->
      <div
        class="flex items-center gap-2 px-3.5 py-1.5 rounded-full border"
        :class="
          wsConnected
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
        "
      >
        <span
          class="w-2.5 h-2.5 rounded-full"
          :class="wsConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'"
        ></span>
        <span class="text-xs font-bold">
          {{ wsConnected ? "Moderación En Vivo" : "Conectando..." }}
        </span>
      </div>
    </div>

    <!-- Chat Workspace Container -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row h-[calc(100dvh-11rem)] sm:h-[calc(100vh-10rem)] min-h-[520px] w-full"
    >
      <!-- Left Sidebar: Tickets Queue (360px) -->
      <div
        class="w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-outline-variant/60 flex flex-col flex-shrink-0 bg-surface-container-lowest dark:bg-slate-900 h-full min-h-0"
        :class="{ 'hidden lg:flex': activeTicket }"
        aria-label="Cola de tickets de soporte"
      >
        <!-- Search and Filter Bar -->
        <div
          class="p-4 border-b border-outline-variant/60 bg-surface-container-low/20 space-y-3"
        >
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
              placeholder="Buscar por usuario o asunto..."
              class="pl-9 pr-4 py-2 w-full bg-surface dark:bg-slate-800 border border-outline-variant/60 rounded-xl text-xs focus:outline-none focus:border-primary text-on-background dark:text-slate-100"
            />
          </div>

          <!-- Status Filters -->
          <div
            class="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold"
          >
            <button
              v-for="filter in filterOptions"
              :key="filter.value"
              @click="activeFilter = filter.value"
              class="px-2.5 py-1 rounded-lg transition whitespace-nowrap"
              :class="
                activeFilter === filter.value
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low'
              "
            >
              {{ filter.label }}
            </button>
          </div>

          <div
            class="flex justify-between items-center text-[11px] font-bold text-on-surface-variant dark:text-slate-300"
          >
            <span>TICKETS EN COLA</span>
            <div class="flex items-center gap-2">
              <span class="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {{ filteredTickets.length }} ticket(s)
              </span>
              <button
                type="button"
                @click="manualRefresh"
                :disabled="isLoadingTickets"
                title="Actualizar cola"
                class="hover:text-primary transition flex items-center p-0.5 rounded text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-low"
              >
                <span
                  class="material-symbols-outlined text-[15px]"
                  :class="{ 'animate-spin': isLoadingTickets }"
                  >refresh</span
                >
              </button>
            </div>
          </div>
        </div>

        <!-- Tickets List -->
        <div
          class="flex-grow overflow-y-auto divide-y divide-outline-variant/30"
        >
          <div
            v-if="isLoadingTickets"
            class="p-8 text-center text-on-surface-variant text-xs"
          >
            <span
              class="material-symbols-outlined animate-spin text-2xl text-primary mb-2"
              >progress_activity</span
            >
            <p>Cargando tickets...</p>
          </div>

          <div
            v-else-if="filteredTickets.length === 0"
            class="p-8 text-center text-on-surface-variant text-xs"
          >
            <span
              class="material-symbols-outlined text-3xl text-outline-variant mb-2"
              >inbox</span
            >
            <p class="font-bold text-on-background dark:text-slate-200">
              No hay tickets en esta vista
            </p>
            <p class="text-[11px] mt-0.5">
              Los reportes enviados por usuarios aparecerán aquí.
            </p>
          </div>

          <button
            v-for="ticket in filteredTickets"
            :key="ticket.id || ticket.ticketId"
            @click="handleSelectTicket(ticket)"
            class="w-full text-left p-4 hover:bg-surface-container-low/40 dark:hover:bg-slate-800/40 transition duration-150 flex gap-3.5 relative"
            :class="
              (activeTicket?.id || activeTicket?.ticketId) ===
              (ticket.id || ticket.ticketId)
                ? 'bg-primary/5 dark:bg-primary/10'
                : ''
            "
          >
            <!-- Highlight bar -->
            <div
              v-if="
                (activeTicket?.id || activeTicket?.ticketId) ===
                (ticket.id || ticket.ticketId)
              "
              class="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"
            ></div>

            <!-- Avatar -->
            <div
              class="w-10 h-10 rounded-full flex-shrink-0 bg-primary/10 flex items-center justify-center font-bold text-primary text-sm relative"
            >
              {{ (ticket.userName || "U").charAt(0).toUpperCase() }}
              <span
                class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-surface dark:border-slate-900"
                :class="
                  ticket.status === 'RESUELTO'
                    ? 'bg-emerald-500'
                    : ticket.assignedModeratorId
                      ? 'bg-indigo-500'
                      : 'bg-amber-500'
                "
              ></span>
            </div>

            <!-- Ticket Info -->
            <div class="flex-grow min-w-0">
              <div class="flex justify-between items-start mb-0.5">
                <h3
                  class="text-xs font-bold text-on-background dark:text-slate-100 truncate"
                >
                  {{ ticket.userName }}
                </h3>
                <span
                  class="text-[9px] text-on-surface-variant dark:text-slate-400 font-medium ml-1 flex-shrink-0"
                >
                  {{ formatDate(ticket.updatedAt || ticket.createdAt) }}
                </span>
              </div>

              <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                <!-- User Role Badge -->
                <span
                  class="text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded uppercase"
                  :class="
                    ticket.userRole === 'CANDIDATO'
                      ? 'bg-tertiary/20 text-tertiary'
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                  "
                >
                  {{ ticket.userRole }}
                </span>

                <!-- Category Badge -->
                <span
                  class="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase"
                  :class="getCategoryClass(ticket.category)"
                >
                  {{ formatCategory(ticket.category) }}
                </span>

                <!-- Concurrency / Assignment Badge -->
                <span
                  v-if="ticket.assignedModeratorId === userId"
                  class="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5"
                >
                  <span class="material-symbols-outlined text-[10px]"
                    >check</span
                  >
                  Asignado a ti
                </span>
                <span
                  v-else-if="ticket.assignedModeratorId"
                  class="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 truncate max-w-[110px]"
                  :title="'Asignado a: ' + ticket.assignedModeratorName"
                >
                  👤 {{ ticket.assignedModeratorName }}
                </span>
                <span
                  v-else
                  class="text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Sin Asignar
                </span>
              </div>

              <p
                class="text-[11px] text-on-surface-variant dark:text-slate-400 truncate"
              >
                {{ ticket.lastMessage || ticket.subject }}
              </p>
            </div>
          </button>
        </div>
      </div>

      <!-- Right Panel: Conversation Details & Concurrency Control -->
      <div
        class="flex-grow flex flex-col bg-surface-container-low/10 dark:bg-slate-900/60 min-w-0 h-full min-h-0"
        :class="{ 'hidden lg:flex': !activeTicket }"
      >
        <template v-if="activeTicket">
          <!-- Chat Header -->
          <div
            class="p-3 sm:p-4 border-b border-outline-variant/60 bg-surface-container-lowest dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 shadow-sm flex-shrink-0"
          >
            <!-- User Info -->
            <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <!-- Back button on mobile -->
              <button
                @click="activeTicket = null"
                class="lg:hidden p-1.5 -ml-1 text-on-surface-variant hover:text-primary rounded-lg flex items-center justify-center flex-shrink-0"
                title="Volver a la cola"
              >
                <span class="material-symbols-outlined text-xl"
                  >arrow_back</span
                >
              </button>

              <div
                class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs sm:text-sm flex-shrink-0"
              >
                {{ (activeTicket.userName || "U").charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <h2
                    class="text-xs font-bold text-on-background dark:text-slate-100 truncate"
                  >
                    {{ activeTicket.userName }}
                  </h2>
                  <span
                    class="text-[8px] font-bold px-1.5 py-0.5 rounded"
                    :class="
                      activeTicket.userRole === 'CANDIDATO'
                        ? 'bg-tertiary/20 text-tertiary'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    "
                  >
                    {{ activeTicket.userRole }}
                  </span>
                  <span
                    class="text-[10px] text-on-surface-variant dark:text-slate-400 hidden sm:inline truncate"
                  >
                    {{ activeTicket.userEmail }}
                  </span>
                </div>
                <p
                  class="text-[10px] text-on-surface-variant dark:text-slate-400 flex items-center gap-1.5 truncate"
                >
                  <span class="truncate"
                    >Asunto: <strong>{{ activeTicket.subject }}</strong></span
                  >
                  <span>•</span>
                  <span class="flex-shrink-0">{{
                    formatCategory(activeTicket.category)
                  }}</span>
                </p>
              </div>
            </div>

            <!-- Moderator Actions Bar -->
            <div class="flex items-center gap-2">
              <!-- If unassigned: Claim Button -->
              <button
                v-if="
                  !activeTicket.assignedModeratorId &&
                  activeTicket.status !== 'RESUELTO'
                "
                @click="handleClaim('CLAIM')"
                :disabled="isProcessingAction"
                class="px-3 py-1.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <span class="material-symbols-outlined text-[16px]"
                  >touch_app</span
                >
                Tomar Caso
              </button>

              <!-- If assigned to ME: Release Button -->
              <button
                v-if="isAssignedToMe && activeTicket.status !== 'RESUELTO'"
                @click="handleClaim('RELEASE')"
                :disabled="isProcessingAction"
                class="px-3 py-1.5 border border-outline-variant hover:border-amber-500 text-xs font-bold text-on-surface-variant dark:text-slate-300 hover:text-amber-600 rounded-xl transition flex items-center gap-1 bg-surface dark:bg-slate-800 disabled:opacity-50"
                title="Liberar a la cola de otros moderadores"
              >
                <span class="material-symbols-outlined text-[16px]">undo</span>
                Liberar Caso
              </button>

              <!-- Resolve Button -->
              <button
                v-if="
                  activeTicket.status !== 'RESUELTO' &&
                  (isAssignedToMe || !activeTicket.assignedModeratorId)
                "
                @click="showResolvePrompt = true"
                :disabled="isProcessingAction"
                class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <span class="material-symbols-outlined text-[16px]"
                  >check_circle</span
                >
                Resolver Ticket
              </button>

              <!-- Resolved Badge if closed -->
              <span
                v-if="activeTicket.status === 'RESUELTO'"
                class="px-3 py-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/20 flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-[16px]"
                  >done_all</span
                >
                Caso Resuelto
              </span>
            </div>
          </div>

          <!-- Concurrency Alert Banner -->
          <div
            v-if="isAssignedToOther"
            class="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-600 text-lg"
                >lock</span
              >
              <span>
                <strong>Caso bloqueado:</strong> Este ticket está siendo
                atendido en exclusiva por
                <strong>{{ activeTicket.assignedModeratorName }}</strong
                >.
              </span>
            </div>
            <span
              class="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400"
            >
              Solo lectura
            </span>
          </div>

          <div
            v-else-if="
              !activeTicket.assignedModeratorId &&
              activeTicket.status !== 'RESUELTO'
            "
            class="bg-sky-500/10 border-b border-sky-500/20 px-4 py-2 text-xs text-sky-800 dark:text-sky-300 flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-sky-600 text-base"
              >info</span
            >
            <span>
              Ticket sin asignar. Al enviar una respuesta o pulsar
              <strong>"Tomar Caso"</strong>, se te auto-asignará en exclusiva.
            </span>
          </div>

          <!-- Messages Area -->
          <div
            ref="chatContainer"
            class="flex-1 overflow-y-auto min-h-0 p-3 sm:p-4 space-y-3 sm:space-y-4 bg-surface-container-low/20 dark:bg-slate-950/40"
          >
            <!-- Original Report Context Box -->
            <div
              class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-xl p-4 max-w-xl mx-auto shadow-sm"
            >
              <div
                class="flex items-center gap-2 mb-1.5 text-primary font-bold text-xs"
              >
                <span class="material-symbols-outlined text-base"
                  >contact_support</span
                >
                <span>Contexto y Reporte Inicial</span>
              </div>
              <p
                class="text-xs text-on-background dark:text-slate-200 leading-relaxed whitespace-pre-wrap"
              >
                {{ activeTicket.description }}
              </p>

              <!-- Attachments if any -->
              <div
                v-if="ticketAttachments.length > 0"
                class="mt-3 pt-3 border-t border-outline-variant/40 flex flex-wrap gap-2"
              >
                <div
                  v-for="(att, i) in ticketAttachments"
                  :key="i"
                  class="flex items-center gap-1.5 bg-surface dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-outline-variant/40 text-xs"
                >
                  <span class="material-symbols-outlined text-sm text-primary"
                    >attachment</span
                  >
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

            <!-- Resolution Notes if any -->
            <div
              v-if="
                activeTicket.status === 'RESUELTO' &&
                activeTicket.resolutionNotes
              "
              class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 max-w-xl mx-auto text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5"
            >
              <span
                class="material-symbols-outlined text-emerald-600 text-xl flex-shrink-0"
                >verified</span
              >
              <div>
                <p class="font-bold">Dictamen / Nota de Cierre:</p>
                <p class="mt-0.5 text-[11px]">
                  {{ activeTicket.resolutionNotes }}
                </p>
              </div>
            </div>

            <div class="text-center">
              <span
                class="text-[9px] font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest bg-surface-container-low dark:bg-slate-800 px-2.5 py-1 rounded border border-outline-variant/30"
              >
                Historial de Conversación
              </span>
            </div>

            <!-- Messages Thread -->
            <div
              v-for="msg in messages"
              :key="msg.messageId || msg.createdAt"
              class="flex flex-col"
              :class="isModeratorMessage(msg) ? 'items-end' : 'items-start'"
            >
              <div
                class="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-on-surface-variant dark:text-slate-400 font-medium"
              >
                <span
                  v-if="isModeratorMessage(msg)"
                  class="font-bold text-primary flex items-center gap-1"
                >
                  <span class="material-symbols-outlined text-[12px]"
                    >verified_user</span
                  >
                  {{ msg.senderName || "Moderador" }}
                </span>
                <span
                  v-else
                  class="font-bold text-on-background dark:text-slate-200"
                >
                  {{ activeTicket.userName }}
                </span>
                <span>•</span>
                <span>{{ formatTime(msg.createdAt) }}</span>
              </div>

              <div
                class="max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-sm whitespace-pre-wrap"
                :class="
                  isModeratorMessage(msg)
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 text-on-background dark:text-slate-100 rounded-tl-none'
                "
              >
                <p class="leading-relaxed">{{ msg.message || msg.text }}</p>

                <!-- Attachments in message -->
                <div
                  v-if="msg.attachments && msg.attachments.length > 0"
                  class="mt-2 space-y-1.5"
                >
                  <div v-for="(att, idx) in msg.attachments" :key="idx">
                    <!-- Image Preview -->
                    <div
                      v-if="isImgAttachment(att)"
                      class="rounded-xl overflow-hidden border border-outline-variant/40 max-w-[220px]"
                    >
                      <a
                        :href="att.url"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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
                      :class="
                        isModeratorMessage(msg)
                          ? 'bg-white/10'
                          : 'bg-surface-container-low dark:bg-slate-800'
                      "
                    >
                      <span class="material-symbols-outlined text-sm"
                        >description</span
                      >
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

          <!-- Message Input Bar (Disabled if concurrency locked) -->
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
                  <span class="material-symbols-outlined text-lg"
                    >description</span
                  >
                </div>
                <div class="truncate">
                  <p
                    class="text-xs font-semibold text-on-surface dark:text-slate-100 truncate"
                  >
                    {{ stagedAttachment.name }}
                  </p>
                  <p
                    class="text-[10px] text-on-surface-variant dark:text-slate-400"
                  >
                    {{ stagedAttachment.sizeFormatted }} • Adjunto preparado
                    para enviar
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
              <template v-if="isAssignedToOther">
                <div
                  class="flex-grow bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2 min-w-0"
                >
                  <span
                    class="material-symbols-outlined text-base flex-shrink-0"
                    >lock</span
                  >
                  <span class="truncate"
                    >En atención por
                    {{ activeTicket.assignedModeratorName }}.</span
                  >
                </div>
                <button
                  disabled
                  class="bg-outline-variant/40 text-on-surface-variant font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-not-allowed opacity-60 flex-shrink-0"
                >
                  Bloqueado
                </button>
              </template>

              <template v-else>
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
                  <span
                    v-if="isUploading"
                    class="material-symbols-outlined text-base animate-spin"
                    >progress_activity</span
                  >
                  <span v-else class="material-symbols-outlined text-lg"
                    >attach_file</span
                  >
                </button>

                <input
                  v-model="newMessageText"
                  @keydown.enter.prevent="handleSendMessage"
                  type="text"
                  :placeholder="
                    isAssignedToMe
                      ? 'Escribe tu respuesta...'
                      : 'Escribe tu respuesta (se te auto-asignará)...'
                  "
                  class="flex-grow bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/60 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs text-on-background dark:text-slate-100 focus:outline-none focus:border-primary"
                />
                <button
                  @click="handleSendMessage"
                  :disabled="
                    (!newMessageText.trim() && !stagedAttachment) ||
                    isSending ||
                    isUploading
                  "
                  class="bg-primary hover:bg-primary-container text-white disabled:opacity-50 font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm flex-shrink-0 cursor-pointer"
                >
                  <span
                    v-if="isSending || isUploading"
                    class="material-symbols-outlined text-[16px] animate-spin"
                    >progress_activity</span
                  >
                  <span v-else class="material-symbols-outlined text-[16px]"
                    >send</span
                  >
                  <span class="hidden sm:inline">Responder</span>
                </button>
              </template>
            </div>
          </div>
        </template>

        <!-- No Ticket Selected State -->
        <div
          v-else
          class="flex-grow flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/10 h-full"
        >
          <div
            class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary"
          >
            <span class="material-symbols-outlined text-4xl">forum</span>
          </div>
          <h3
            class="text-lg font-bold text-on-background dark:text-slate-100 mb-2"
          >
            Selecciona un ticket de soporte
          </h3>
          <p
            class="text-on-surface-variant dark:text-slate-400 text-xs max-w-sm"
          >
            Elige un reporte de la cola lateral para revisar su historial,
            auto-asignarte el caso y responder en tiempo real.
          </p>
        </div>
      </div>
    </div>

    <!-- Resolve Modal / Dialog -->
    <AppModal
      v-model="showResolvePrompt"
      title="Resolver Ticket de Soporte"
      icon="check_circle"
      icon-bg-class="bg-emerald-500/10 text-emerald-600"
      max-width="md"
    >
      <div class="p-5 space-y-4 text-xs">
        <p class="text-on-surface-variant dark:text-slate-300">
          Indica los detalles o recomendaciones de resolución que se registrarán
          en el cierre del caso:
        </p>
        <textarea
          v-model="resolutionNotesText"
          rows="3"
          placeholder="Ej: Se orientó al usuario sobre la recuperación de contraseña y se validó el acceso..."
          class="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/60 bg-surface dark:bg-slate-800 text-on-background dark:text-slate-100 text-xs focus:outline-none focus:border-primary"
        ></textarea>

        <div
          class="flex justify-end gap-3 pt-3 border-t border-outline-variant/40"
        >
          <button
            type="button"
            @click="showResolvePrompt = false"
            class="px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold hover:bg-surface-container-low transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="confirmResolve"
            :disabled="isProcessingAction"
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <span
              v-if="isProcessingAction"
              class="material-symbols-outlined text-sm animate-spin"
              >progress_activity</span
            >
            Confirmar y Cerrar
          </button>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useSupportTickets } from "~/composables/useSupportTickets";
import { useS3Upload } from "~/composables/useS3Upload";
import { useAppFeedback } from "~/composables/useAppFeedback";
import AppModal from "~/components/common/AppModal.vue";
import type {
  SupportTicket,
  SupportTicketMessage,
  TicketAttachment,
} from "~/types/support";

useSeoMeta({
  title: "Mesa de Soporte - Moderación JobNet",
  description:
    "Gestión y resolución concurrente de tickets de soporte para moderadores",
});

const {
  tickets,
  activeTicket,
  messages,
  isLoadingTickets,
  isSending,
  isProcessingAction,
  userId,
  isAssignedToMe,
  isAssignedToOther,
  wsConnected,
  connectWebSocket,
  closeWebSocket,
  fetchAllTickets,
  selectTicket,
  sendMessage,
  claimTicket,
  resolveTicket,
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
const activeFilter = ref("ALL");
const newMessageText = ref("");
const showResolvePrompt = ref(false);
const resolutionNotesText = ref("");
const chatContainer = ref<HTMLDivElement | null>(null);

let pollInterval: any = null;

const filterOptions = [
  { label: "Todos", value: "ALL" },
  { label: "Abiertos", value: "ABIERTO" },
  { label: "En Proceso", value: "EN_PROCESO" },
  { label: "Mis Asignados", value: "MINE" },
  { label: "Resueltos", value: "RESUELTO" },
];

const filteredTickets = computed(() => {
  let list = tickets.value;

  if (activeFilter.value === "MINE") {
    list = list.filter((t) => t.assignedModeratorId === userId.value);
  } else if (activeFilter.value !== "ALL") {
    list = list.filter((t) => t.status === activeFilter.value);
  }

  if (!searchQuery.value.trim()) return list;
  const q = searchQuery.value.toLowerCase();
  return list.filter(
    (t) =>
      t.userName.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.userEmail.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q),
  );
});

const ticketAttachments = computed(() => {
  if (!activeTicket.value) return [];
  const meta: any = activeTicket.value;
  return meta.attachments || [];
});

const isModeratorMessage = (msg: SupportTicketMessage) => {
  return (
    msg.senderRole === "MODERADOR" ||
    msg.senderRole === "ADMIN" ||
    msg.senderRole === "MODERATOR"
  );
};

const handleSelectTicket = async (ticket: SupportTicket) => {
  await selectTicket(ticket);
  scrollToBottom();
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
        userId: userId.value || "moderator",
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

const handleClaim = async (action: "CLAIM" | "RELEASE") => {
  if (!activeTicket.value) return;
  const ticketId = activeTicket.value.id || activeTicket.value.ticketId;
  await claimTicket(ticketId, action);
};

const confirmResolve = async () => {
  if (!activeTicket.value) return;
  const ticketId = activeTicket.value.id || activeTicket.value.ticketId;
  const success = await resolveTicket(ticketId, resolutionNotesText.value);
  if (success) {
    showResolvePrompt.value = false;
    resolutionNotesText.value = "";
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
      return "Otro";
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
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const isPolling = ref(false);

const manualRefresh = async () => {
  await fetchAllTickets(undefined, false);
  if (activeTicket.value) {
    const id = activeTicket.value.id || activeTicket.value.ticketId;
    await selectTicket(activeTicket.value, false);
  }
};

const pollQueueAndMessages = async () => {
  if (typeof document !== "undefined" && document.visibilityState !== "visible")
    return;
  if (isSending.value || isProcessingAction.value || isPolling.value) return;

  isPolling.value = true;
  try {
    await fetchAllTickets(undefined, true);
    if (activeTicket.value) {
      const id = activeTicket.value.id || activeTicket.value.ticketId;
      const currentInList = tickets.value.find(
        (t) => (t.id || t.ticketId) === id,
      );
      if (currentInList) {
        activeTicket.value = { ...activeTicket.value, ...currentInList };
      }
      await selectTicket(activeTicket.value, true);
    }
  } catch (err) {
    console.error("Error in background polling:", err);
  } finally {
    isPolling.value = false;
  }
};

watch(
  () => messages.value,
  () => {
    scrollToBottom();
  },
  { deep: true },
);

onMounted(async () => {
  connectWebSocket();

  const loaded = await fetchAllTickets(undefined, false);
  if (loaded && loaded.length > 0) {
    await selectTicket(loaded[0], false);
    scrollToBottom();
  }

  // Poll quietly every 35 seconds as background fallback without flashing indicators
  pollInterval = setInterval(pollQueueAndMessages, 35000);
});

onUnmounted(() => {
  closeWebSocket();
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
});
</script>
