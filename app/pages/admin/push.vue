<template>
  <div
    class="max-w-6xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span
              class="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20"
            >
              Consola de Administración
            </span>
            <span
              class="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              VAPID Nativo RFC 8030
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">
            Notificaciones Push & Suscriptores
          </h1>
          <p class="text-on-surface-variant dark:text-slate-300 text-sm mt-1 max-w-2xl">
            Monitorea los usuarios con suscripciones push activas en sus navegadores y despacha notificaciones personalizadas con previsualización en vivo.
          </p>
        </div>

        <div class="flex items-center gap-2 self-start sm:self-auto">
          <button
            @click="fetchSubscribers"
            :disabled="loadingSubscribers"
            class="px-4 py-2 bg-surface-container-low dark:bg-slate-900 border border-outline-variant/60 rounded-xl text-xs font-semibold hover:bg-surface-container dark:hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            title="Recargar suscriptores"
          >
            <span
              class="material-symbols-outlined text-base"
              :class="{ 'animate-spin': loadingSubscribers }"
              >refresh</span
            >
            <span>Actualizar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Feedback Alerts -->
    <div
      v-if="feedbackSuccess"
      class="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 p-4 rounded-2xl flex items-center justify-between text-sm shadow-sm transition"
    >
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-2xl">check_circle</span>
        <div>
          <p class="font-bold">{{ feedbackSuccess.title }}</p>
          <p class="text-xs opacity-90 mt-0.5">{{ feedbackSuccess.message }}</p>
        </div>
      </div>
      <button @click="feedbackSuccess = null" class="text-xs font-bold hover:underline opacity-80">
        Cerrar
      </button>
    </div>

    <div
      v-if="feedbackError"
      class="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-950 dark:text-rose-200 p-4 rounded-2xl flex items-center justify-between text-sm shadow-sm transition"
    >
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-rose-600 dark:text-rose-400 text-2xl">error</span>
        <div>
          <p class="font-bold">Error en la operación</p>
          <p class="text-xs opacity-90 mt-0.5">{{ feedbackError }}</p>
        </div>
      </div>
      <button @click="feedbackError = null" class="text-xs font-bold hover:underline opacity-80">
        Cerrar
      </button>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div class="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-2xl">group</span>
        </div>
        <div>
          <span class="text-xs text-on-surface-variant dark:text-slate-400 font-bold uppercase tracking-wider">
            Usuarios Suscritos
          </span>
          <h2 class="text-2xl font-black text-on-background mt-0.5">
            {{ subscribers.length }}
          </h2>
          <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Activos en DynamoDB
          </span>
        </div>
      </div>

      <div
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div class="w-12 h-12 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-2xl">devices</span>
        </div>
        <div>
          <span class="text-xs text-on-surface-variant dark:text-slate-400 font-bold uppercase tracking-wider">
            Dispositivos / Browsers
          </span>
          <h2 class="text-2xl font-black text-on-background mt-0.5">
            {{ totalDevicesCount }}
          </h2>
          <span class="text-[11px] text-on-surface-variant dark:text-slate-400">
            Endpoints RFC 8030
          </span>
        </div>
      </div>

      <div
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div class="w-12 h-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-2xl">notifications_active</span>
        </div>
        <div>
          <span class="text-xs text-on-surface-variant dark:text-slate-400 font-bold uppercase tracking-wider">
            Seleccionados para Envío
          </span>
          <h2 class="text-2xl font-black text-on-background mt-0.5">
            {{ targetMode === 'all' ? subscribers.length : selectedUserIds.length }}
          </h2>
          <span class="text-[11px] text-primary font-semibold">
            {{ targetMode === 'all' ? 'Modo Broadcast Masivo' : `${selectedUserIds.length} usuario(s) específico(s)` }}
          </span>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex items-center gap-2 border-b border-outline-variant/60 dark:border-slate-800 mb-8 pb-1">
      <button
        @click="activeTab = 'subscribers'"
        class="px-4 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 relative"
        :class="[
          activeTab === 'subscribers'
            ? 'text-primary bg-primary/10 dark:bg-primary/20'
            : 'text-on-surface-variant hover:text-on-background dark:text-slate-300'
        ]"
      >
        <span class="material-symbols-outlined text-lg">format_list_bulleted</span>
        <span>Listado de Suscriptores ({{ filteredSubscribers.length }})</span>
      </button>

      <button
        @click="activeTab = 'composer'"
        class="px-4 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 relative"
        :class="[
          activeTab === 'composer'
            ? 'text-primary bg-primary/10 dark:bg-primary/20'
            : 'text-on-surface-variant hover:text-on-background dark:text-slate-300'
        ]"
      >
        <span class="material-symbols-outlined text-lg">campaign</span>
        <span>Redactar & Previsualizar Push</span>
        <span
          v-if="selectedUserIds.length > 0"
          class="px-1.5 py-0.2 bg-primary text-white text-[10px] rounded-full font-black"
        >
          {{ selectedUserIds.length }}
        </span>
      </button>
    </div>

    <!-- TAB 1: SUBSCRIBERS LIST -->
    <div v-if="activeTab === 'subscribers'" class="space-y-6">
      <!-- Search & Filters Bar -->
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
      >
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
          <!-- Text Search -->
          <div class="md:col-span-6 relative">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 text-lg">
              search
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por nombre, correo, ID o navegador..."
              class="w-full pl-10 pr-4 py-2 bg-surface-container-low dark:bg-slate-800/80 border border-outline-variant/60 dark:border-slate-700 rounded-xl text-xs text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          <!-- Role Filter -->
          <div class="md:col-span-3">
            <select
              v-model="filterRole"
              class="w-full px-3 py-2 bg-surface-container-low dark:bg-slate-800/80 border border-outline-variant/60 dark:border-slate-700 rounded-xl text-xs text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            >
              <option value="ALL">Todos los roles</option>
              <option value="CANDIDATO">Candidatos</option>
              <option value="EMPRESA">Empresas</option>
              <option value="MODERATOR">Moderadores</option>
              <option value="ADMIN">Administradores</option>
              <option value="PENDIENTE">Pendientes de Rol</option>
            </select>
          </div>

          <!-- Device/Browser Filter -->
          <div class="md:col-span-3">
            <select
              v-model="filterDevice"
              class="w-full px-3 py-2 bg-surface-container-low dark:bg-slate-800/80 border border-outline-variant/60 dark:border-slate-700 rounded-xl text-xs text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            >
              <option value="ALL">Todos los navegadores</option>
              <option value="Chrome">Chrome</option>
              <option value="Edge">Edge</option>
              <option value="Firefox">Firefox</option>
              <option value="Safari">Safari</option>
              <option value="Windows">Windows</option>
              <option value="Android">Android</option>
              <option value="macOS">macOS</option>
            </select>
          </div>
        </div>

        <!-- Bulk Selection Controls -->
        <div class="mt-4 pt-3 border-t border-outline-variant/40 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2">
            <button
              @click="toggleSelectAll"
              class="font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm">
                {{ isAllSelected ? 'check_box' : isSomeSelected ? 'indeterminate_check_box' : 'check_box_outline_blank' }}
              </span>
              <span>{{ isAllSelected ? 'Deseleccionar todos' : 'Seleccionar visibles' }}</span>
            </button>
            <span class="text-on-surface-variant opacity-60">•</span>
            <span class="text-on-surface-variant dark:text-slate-400">
              {{ selectedUserIds.length }} seleccionado(s)
            </span>
          </div>

          <div v-if="selectedUserIds.length > 0" class="flex items-center gap-2">
            <button
              @click="goToComposerWithSelected"
              class="px-3 py-1.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition flex items-center gap-1.5 shadow-sm"
            >
              <span class="material-symbols-outlined text-sm">send</span>
              <span>Enviar Push a seleccionados ({{ selectedUserIds.length }})</span>
            </button>
            <button
              @click="selectedUserIds = []"
              class="px-2.5 py-1 text-on-surface-variant hover:text-rose-600 transition"
            >
              Limpiar selección
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingSubscribers" class="py-16 text-center">
        <span class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
        <p class="text-xs text-on-surface-variant dark:text-slate-400 mt-2">
          Consultando suscriptores en AWS DynamoDB...
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredSubscribers.length === 0"
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-12 text-center"
      >
        <span class="material-symbols-outlined text-5xl text-on-surface-variant opacity-40">notifications_off</span>
        <h3 class="text-base font-bold text-on-background mt-3">No se encontraron suscriptores</h3>
        <p class="text-xs text-on-surface-variant dark:text-slate-400 mt-1 max-w-sm mx-auto">
          {{ subscribers.length === 0
            ? 'Aún no hay usuarios suscritos a notificaciones push en producción.'
            : 'Ningún usuario coincide con los filtros o término de búsqueda ingresado.' }}
        </p>
        <button
          v-if="subscribers.length > 0"
          @click="resetFilters"
          class="mt-4 text-xs font-bold text-primary hover:underline"
        >
          Restablecer filtros
        </button>
      </div>

      <!-- Subscribers Table / List -->
      <div v-else class="space-y-3">
        <div
          v-for="sub in filteredSubscribers"
          :key="sub.userId"
          class="bg-surface-container-lowest dark:bg-slate-900 border rounded-2xl p-4 transition shadow-sm hover:border-primary/40"
          :class="[
            selectedUserIds.includes(sub.userId)
              ? 'border-primary/60 bg-primary/5 dark:bg-primary/10'
              : 'border-outline-variant/60 dark:border-slate-800'
          ]"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <!-- User Info & Checkbox -->
            <div class="flex items-start sm:items-center gap-3 min-w-0">
              <input
                type="checkbox"
                :value="sub.userId"
                v-model="selectedUserIds"
                class="mt-1 sm:mt-0 w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer"
              />

              <!-- Avatar -->
              <div
                class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-xs overflow-hidden"
                :class="getAvatarBg(sub.tipoUsuario)"
              >
                <img
                  v-if="sub.fotoPerfil"
                  :src="sub.fotoPerfil"
                  :alt="sub.nombre"
                  class="w-full h-full object-cover"
                />
                <span v-else>{{ getInitials(sub.nombre) }}</span>
              </div>

              <!-- Name & Metadata -->
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-sm font-bold text-on-background truncate">
                    {{ sub.nombre }}
                  </h3>
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    :class="getRoleBadgeClass(sub.tipoUsuario)"
                  >
                    {{ sub.tipoUsuario }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs text-on-surface-variant dark:text-slate-400 mt-0.5 truncate">
                  <span class="truncate">{{ sub.email || 'Sin correo registrado' }}</span>
                  <span>•</span>
                  <span class="font-mono text-[10px] opacity-70">ID: {{ sub.userId.slice(0, 8) }}...</span>
                </div>
              </div>
            </div>

            <!-- Devices & Quick Action -->
            <div class="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-outline-variant/30">
              <!-- Device Badges -->
              <div class="flex flex-wrap items-center gap-1.5">
                <div
                  v-for="(dev, idx) in sub.devices"
                  :key="idx"
                  class="px-2.5 py-1 bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-lg text-[11px] flex items-center gap-1.5"
                  :title="`Actualizado: ${formatDate(dev.updatedAt)}\nUser-Agent: ${dev.userAgent}`"
                >
                  <span class="material-symbols-outlined text-xs text-primary">
                    {{ getDeviceIcon(dev.browser, dev.os) }}
                  </span>
                  <span class="font-medium text-on-background dark:text-slate-200">
                    {{ dev.deviceLabel }}
                  </span>
                </div>
              </div>

              <!-- Quick Target Button -->
              <button
                @click="targetSingleUser(sub)"
                class="px-3 py-1.5 bg-surface-container dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-on-surface text-xs font-semibold rounded-xl transition flex items-center gap-1 flex-shrink-0 shadow-sm"
                title="Redactar notificación exclusiva para este usuario"
              >
                <span class="material-symbols-outlined text-sm">send</span>
                <span class="hidden md:inline">Enviar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: NOTIFICATION COMPOSER & LIVE PREVIEW -->
    <div v-if="activeTab === 'composer'" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Composer Form (Left Column, 7 cols) -->
      <div
        class="lg:col-span-7 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5"
      >
        <div class="border-b border-outline-variant/40 dark:border-slate-800 pb-4">
          <h2 class="text-lg font-bold text-on-background flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">edit_note</span>
            <span>Diseñador de Notificación Push</span>
          </h2>
          <p class="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
            Personaliza el contenido, la imagen destacada y la acción de clic de la alerta nativa.
          </p>
        </div>

        <!-- Target Mode Selection -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
            Destinatarios de la Notificación
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              class="border rounded-xl p-3 flex items-start gap-3 cursor-pointer transition"
              :class="[
                targetMode === 'all'
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-outline-variant/60 dark:border-slate-800 hover:bg-surface-container-low'
              ]"
            >
              <input type="radio" value="all" v-model="targetMode" class="mt-0.5 text-primary" />
              <div>
                <span class="text-xs font-bold block text-on-background">📢 Broadcast Masivo</span>
                <span class="text-[11px] text-on-surface-variant dark:text-slate-400">
                  A todos los usuarios activos ({{ subscribers.length }} suscriptores)
                </span>
              </div>
            </label>

            <label
              class="border rounded-xl p-3 flex items-start gap-3 cursor-pointer transition"
              :class="[
                targetMode === 'selected'
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-outline-variant/60 dark:border-slate-800 hover:bg-surface-container-low'
              ]"
            >
              <input type="radio" value="selected" v-model="targetMode" class="mt-0.5 text-primary" />
              <div>
                <span class="text-xs font-bold block text-on-background">🎯 Usuarios Seleccionados</span>
                <span class="text-[11px] text-on-surface-variant dark:text-slate-400">
                  {{ selectedUserIds.length }} usuario(s) seleccionado(s)
                </span>
              </div>
            </label>
          </div>

          <!-- Selected chips -->
          <div v-if="targetMode === 'selected'" class="pt-2">
            <div v-if="selectedUserIds.length === 0" class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <span>No has seleccionado ningún usuario.</span>
              <button @click="activeTab = 'subscribers'" class="font-bold underline">
                Ir a la lista
              </button>
            </div>
            <div v-else class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-surface-container-low dark:bg-slate-800/60 rounded-xl border border-outline-variant/40">
              <span
                v-for="uid in selectedUserIds"
                :key="uid"
                class="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md text-[11px] font-semibold flex items-center gap-1"
              >
                <span>{{ getUserNameById(uid) }}</span>
                <button @click="removeSelectedUser(uid)" class="hover:text-rose-500 text-xs">✕</button>
              </span>
            </div>
          </div>
        </div>

        <!-- Title Input with Emoji Helpers -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
              Título de la Notificación *
            </label>
            <span class="text-[10px] text-on-surface-variant dark:text-slate-400 font-mono">
              {{ form.title.length }}/60
            </span>
          </div>
          <div class="flex items-center gap-1.5 mb-1.5 overflow-x-auto pb-1 text-xs">
            <span class="text-[11px] opacity-70">Emojis:</span>
            <button
              v-for="em in ['📢', '💼', '🚀', '⭐', '🎉', '⚠️', '💬', '🔔']"
              :key="em"
              type="button"
              @click="addEmoji(em)"
              class="px-1.5 py-0.5 bg-surface-container dark:bg-slate-800 hover:scale-110 transition rounded"
            >
              {{ em }}
            </button>
          </div>
          <input
            v-model="form.title"
            maxlength="60"
            type="text"
            placeholder="Ej: 📢 ¡Nueva vacante destacada para ti!"
            class="w-full px-3.5 py-2.5 bg-surface-container-low dark:bg-slate-800/80 border border-outline-variant/60 dark:border-slate-700 rounded-xl text-xs text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
          />
        </div>

        <!-- Body / Message Textarea -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
              Mensaje / Descripción *
            </label>
            <span class="text-[10px] text-on-surface-variant dark:text-slate-400 font-mono">
              {{ form.message.length }}/200
            </span>
          </div>
          <textarea
            v-model="form.message"
            maxlength="200"
            rows="3"
            placeholder="Ej: Una empresa ha publicado una oferta que coincide exactamente con tus habilidades de Desarrollador Fullstack..."
            class="w-full px-3.5 py-2.5 bg-surface-container-low dark:bg-slate-800/80 border border-outline-variant/60 dark:border-slate-700 rounded-xl text-xs text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
          ></textarea>
        </div>

        <!-- Target Click URL -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
            URL de Destino al Dar Clic
          </label>
          <input
            v-model="form.url"
            type="text"
            placeholder="/vacancies o /notifications o URL externa"
            class="w-full px-3.5 py-2.5 bg-surface-container-low dark:bg-slate-800/80 border border-outline-variant/60 dark:border-slate-700 rounded-xl text-xs text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
          />
          <div class="flex items-center gap-1.5 flex-wrap pt-1">
            <span class="text-[10px] opacity-70">Sugerencias:</span>
            <button
              v-for="sug in ['/vacancies', '/feed', '/notifications', '/candidate/my-applications']"
              :key="sug"
              type="button"
              @click="form.url = sug"
              class="px-2 py-0.5 bg-surface-container dark:bg-slate-800 text-[10px] font-mono rounded hover:bg-primary hover:text-white transition"
            >
              {{ sug }}
            </button>
          </div>
        </div>

        <!-- Preview Image (Banner) -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
            Imagen de Previsualización (Banner / Hero Image)
          </label>
          <input
            v-model="form.image"
            type="text"
            placeholder="https://ejemplo.com/imagen.jpg (Opcional, formato banner)"
            class="w-full px-3.5 py-2.5 bg-surface-container-low dark:bg-slate-800/80 border border-outline-variant/60 dark:border-slate-700 rounded-xl text-xs text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
          />

          <!-- Preset sample image helpers -->
          <div class="flex items-center gap-2 flex-wrap pt-1">
            <span class="text-[10px] opacity-70">Imágenes de prueba:</span>
            <button
              type="button"
              @click="form.image = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80'"
              class="px-2 py-0.5 bg-surface-container dark:bg-slate-800 text-[10px] rounded hover:bg-primary hover:text-white transition"
            >
              🏢 Empleo / Oficina
            </button>
            <button
              type="button"
              @click="form.image = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80'"
              class="px-2 py-0.5 bg-surface-container dark:bg-slate-800 text-[10px] rounded hover:bg-primary hover:text-white transition"
            >
              🎉 Comunidad
            </button>
            <button
              type="button"
              @click="form.image = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80'"
              class="px-2 py-0.5 bg-surface-container dark:bg-slate-800 text-[10px] rounded hover:bg-primary hover:text-white transition"
            >
              💡 Destacada
            </button>
            <button
              v-if="form.image"
              type="button"
              @click="form.image = ''"
              class="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[10px] rounded hover:bg-rose-500 hover:text-white transition"
            >
              ✕ Quitar imagen
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4 border-t border-outline-variant/40 dark:border-slate-800 flex items-center justify-between gap-4">
          <p class="text-[11px] text-on-surface-variant dark:text-slate-400">
            Se enviará a <strong class="text-on-background">{{ targetCount }}</strong> usuario(s).
          </p>

          <button
            @click="triggerSendPush"
            :disabled="sendingPush || !canSend"
            class="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="sendingPush" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            <span v-else class="material-symbols-outlined text-sm">send</span>
            <span>{{ sendingPush ? 'Despachando notificaciones...' : 'Enviar Notificación Push' }}</span>
          </button>
        </div>
      </div>

      <!-- Live Preview Mockup (Right Column, 5 cols) -->
      <div class="lg:col-span-5 space-y-4 lg:sticky lg:top-8">
        <div
          class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
        >
          <div class="flex items-center justify-between border-b border-outline-variant/40 dark:border-slate-800 pb-3 mb-4">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">visibility</span>
              <h3 class="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-300">
                Previsualización en Vivo
              </h3>
            </div>

            <!-- Device Style Toggle -->
            <div class="flex items-center bg-surface-container dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-semibold">
              <button
                @click="previewStyle = 'windows'"
                class="px-2 py-1 rounded-md transition"
                :class="previewStyle === 'windows' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-background'"
              >
                Windows / Desktop
              </button>
              <button
                @click="previewStyle = 'android'"
                class="px-2 py-1 rounded-md transition"
                :class="previewStyle === 'android' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-background'"
              >
                Móvil / Android
              </button>
            </div>
          </div>

          <!-- MOCKUP: WINDOWS / CHROME DESKTOP NOTIFICATION -->
          <div v-if="previewStyle === 'windows'" class="space-y-2">
            <div class="text-[10px] text-on-surface-variant dark:text-slate-400 font-medium">
              Alerta flotante nativa en esquina inferior derecha:
            </div>

            <div
              class="w-full bg-[#1f1f1f] text-white rounded-xl shadow-2xl p-3.5 border border-white/10 font-sans transition-all duration-300"
            >
              <!-- Toast Header -->
              <div class="flex items-center justify-between text-[11px] text-white/70 mb-2">
                <div class="flex items-center gap-1.5">
                  <img src="/logotipo.svg" alt="JobNet" class="w-4 h-4 object-contain" />
                  <span class="font-medium text-white/90">JobNet</span>
                  <span>•</span>
                  <span>Google Chrome</span>
                  <span>•</span>
                  <span>ahora</span>
                </div>
                <button class="text-white/60 hover:text-white text-xs">✕</button>
              </div>

              <!-- Toast Body with Icon -->
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-[#2b2b2b] p-1 flex-shrink-0 flex items-center justify-center">
                  <img src="/logotipo.svg" alt="Icon" class="w-full h-full object-contain" />
                </div>
                <div class="min-w-0 flex-grow">
                  <h4 class="text-xs font-bold text-white leading-tight line-clamp-1">
                    {{ form.title || 'Título de la notificación' }}
                  </h4>
                  <p class="text-[11px] text-white/80 mt-1 leading-snug line-clamp-3">
                    {{ form.message || 'El mensaje aparecerá aquí en el navegador del usuario en tiempo real.' }}
                  </p>
                </div>
              </div>

              <!-- Toast Large Image (Banner) -->
              <div v-if="form.image" class="mt-3 rounded-lg overflow-hidden border border-white/10 max-h-44 bg-black/40">
                <img
                  :src="form.image"
                  alt="Banner preview"
                  class="w-full h-full object-cover"
                  @error="onImageError"
                />
              </div>

              <!-- Toast Action Buttons -->
              <div class="mt-3 pt-2 border-t border-white/10 flex items-center justify-end gap-2 text-[11px]">
                <button class="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium">
                  Cerrar
                </button>
                <button class="px-3 py-1 rounded bg-primary text-white font-bold hover:bg-primary/90">
                  Ver ahora
                </button>
              </div>
            </div>
          </div>

          <!-- MOCKUP: ANDROID / MOBILE NOTIFICATION -->
          <div v-else class="space-y-2">
            <div class="text-[10px] text-on-surface-variant dark:text-slate-400 font-medium">
              Notificación en panel desplegable de Android:
            </div>

            <div
              class="w-full bg-[#2a2a2a] text-white rounded-2xl shadow-xl p-3 border border-white/10 font-sans transition-all duration-300"
            >
              <!-- Android Header -->
              <div class="flex items-center justify-between text-[11px] text-white/70 mb-1.5">
                <div class="flex items-center gap-1.5">
                  <img src="/logotipo.svg" alt="JobNet" class="w-3.5 h-3.5 object-contain" />
                  <span class="font-bold text-white/90">JobNet</span>
                  <span>•</span>
                  <span>hace un momento</span>
                </div>
                <span class="material-symbols-outlined text-xs text-white/60">expand_more</span>
              </div>

              <!-- Title & Body -->
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h4 class="text-xs font-bold text-white leading-tight">
                    {{ form.title || 'Título de la notificación' }}
                  </h4>
                  <p class="text-[11px] text-white/80 mt-0.5 leading-snug">
                    {{ form.message || 'El mensaje se mostrará con este formato en smartphones.' }}
                  </p>
                </div>
                <div class="w-8 h-8 rounded-lg bg-[#3a3a3a] p-1 flex-shrink-0 flex items-center justify-center">
                  <img src="/logotipo.svg" alt="App Icon" class="w-full h-full object-contain" />
                </div>
              </div>

              <!-- Android Large Image -->
              <div v-if="form.image" class="mt-2.5 rounded-xl overflow-hidden border border-white/10 max-h-40 bg-black/40">
                <img
                  :src="form.image"
                  alt="Android banner preview"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Action links -->
              <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-4 text-[11px] font-bold text-primary">
                <span class="hover:underline cursor-pointer">VER AHORA</span>
                <span class="text-white/60 hover:underline cursor-pointer font-medium">CERRAR</span>
              </div>
            </div>
          </div>

          <!-- Explanation footnote -->
          <div class="mt-4 p-3 bg-surface-container dark:bg-slate-800/60 rounded-xl text-[11px] text-on-surface-variant dark:text-slate-400 flex items-start gap-2">
            <span class="material-symbols-outlined text-sm text-primary flex-shrink-0 mt-0.5">info</span>
            <p class="leading-normal">
              Esta alerta se enviará mediante el protocolo Web Push VAPID directo a la pantalla del usuario. El clic abrirá la ruta <code>{{ form.url || '/notifications' }}</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

definePageMeta({
  title: "Notificaciones Push - Consola de Admin",
});

const config = useRuntimeConfig();

// State
const subscribers = ref<any[]>([]);
const loadingSubscribers = ref(false);
const searchQuery = ref("");
const filterRole = ref("ALL");
const filterDevice = ref("ALL");
const selectedUserIds = ref<string[]>([]);

const activeTab = ref<"subscribers" | "composer">("subscribers");
const previewStyle = ref<"windows" | "android">("windows");
const targetMode = ref<"all" | "selected">("all");

const sendingPush = ref(false);
const feedbackSuccess = ref<{ title: string; message: string } | null>(null);
const feedbackError = ref<string | null>(null);

// Form
const form = ref({
  title: "📢 ¡Novedades en JobNet!",
  message: "Hemos actualizado vacantes destacadas para ti. Entra y postúlate con un clic.",
  url: "/vacancies",
  icon: "/logotipo.svg",
  image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80",
});

// Computed Stats
const totalDevicesCount = computed(() => {
  return subscribers.value.reduce((acc, u) => acc + (u.devices?.length || 0), 0);
});

const targetCount = computed(() => {
  return targetMode.value === "all" ? subscribers.value.length : selectedUserIds.value.length;
});

const canSend = computed(() => {
  if (!form.value.title.trim() || !form.value.message.trim()) return false;
  if (targetMode.value === "selected" && selectedUserIds.value.length === 0) return false;
  if (targetMode.value === "all" && subscribers.value.length === 0) return false;
  return true;
});

// Filtered Subscribers
const filteredSubscribers = computed(() => {
  let list = [...subscribers.value];

  // Role filter
  if (filterRole.value !== "ALL") {
    list = list.filter(
      (u) => (u.tipoUsuario || "").toUpperCase() === filterRole.value.toUpperCase(),
    );
  }

  // Device/Browser filter
  if (filterDevice.value !== "ALL") {
    const q = filterDevice.value.toLowerCase();
    list = list.filter((u) =>
      u.devices?.some(
        (d: any) =>
          d.browser?.toLowerCase().includes(q) ||
          d.os?.toLowerCase().includes(q) ||
          d.deviceLabel?.toLowerCase().includes(q),
      ),
    );
  }

  // Text search
  if (searchQuery.value.trim()) {
    const term = searchQuery.value.toLowerCase().trim();
    list = list.filter((u) => {
      const matchName = (u.nombre || "").toLowerCase().includes(term);
      const matchEmail = (u.email || "").toLowerCase().includes(term);
      const matchId = (u.userId || "").toLowerCase().includes(term);
      const matchDevice = u.devices?.some((d: any) =>
        (d.deviceLabel || "").toLowerCase().includes(term),
      );
      return matchName || matchEmail || matchId || matchDevice;
    });
  }

  return list;
});

// Selection helpers
const isAllSelected = computed(() => {
  if (filteredSubscribers.value.length === 0) return false;
  return filteredSubscribers.value.every((u) => selectedUserIds.value.includes(u.userId));
});

const isSomeSelected = computed(() => {
  if (isAllSelected.value) return false;
  return filteredSubscribers.value.some((u) => selectedUserIds.value.includes(u.userId));
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const currentFilteredIds = new Set(filteredSubscribers.value.map((u) => u.userId));
    selectedUserIds.value = selectedUserIds.value.filter((id) => !currentFilteredIds.has(id));
  } else {
    const newIds = new Set([...selectedUserIds.value, ...filteredSubscribers.value.map((u) => u.userId)]);
    selectedUserIds.value = Array.from(newIds);
  }
};

const resetFilters = () => {
  searchQuery.value = "";
  filterRole.value = "ALL";
  filterDevice.value = "ALL";
};

const goToComposerWithSelected = () => {
  targetMode.value = "selected";
  activeTab.value = "composer";
};

const targetSingleUser = (user: any) => {
  selectedUserIds.value = [user.userId];
  targetMode.value = "selected";
  activeTab.value = "composer";
};

const removeSelectedUser = (userId: string) => {
  selectedUserIds.value = selectedUserIds.value.filter((id) => id !== userId);
};

const getUserNameById = (userId: string) => {
  const found = subscribers.value.find((u) => u.userId === userId);
  return found?.nombre || `Usuario (${userId.slice(0, 6)})`;
};

const addEmoji = (emoji: string) => {
  form.value.title = `${form.value.title} ${emoji}`.trim();
};

const onImageError = () => {
  console.warn("Invalid preview image URL");
};

// UI Badge Helpers
const getRoleBadgeClass = (role?: string) => {
  switch ((role || "").toUpperCase()) {
    case "ADMIN":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
    case "MODERATOR":
    case "MODERADOR":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
    case "EMPRESA":
    case "ORGANIZACION":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20";
    case "CANDIDATO":
    case "POSTULANTE":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
    default:
      return "bg-slate-500/10 text-slate-600 dark:text-slate-300 border border-slate-500/20";
  }
};

const getAvatarBg = (role?: string) => {
  switch ((role || "").toUpperCase()) {
    case "ADMIN":
      return "bg-rose-600";
    case "MODERATOR":
    case "MODERADOR":
      return "bg-amber-600";
    case "EMPRESA":
    case "ORGANIZACION":
      return "bg-purple-600";
    case "CANDIDATO":
    case "POSTULANTE":
      return "bg-blue-600";
    default:
      return "bg-slate-600";
  }
};

const getInitials = (name?: string) => {
  if (!name) return "JN";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getDeviceIcon = (browser?: string, os?: string) => {
  const b = (browser || "").toLowerCase();
  const o = (os || "").toLowerCase();
  if (o.includes("android") || o.includes("ios")) return "smartphone";
  if (b.includes("chrome")) return "globe";
  if (b.includes("edge")) return "public";
  if (b.includes("firefox")) return "language";
  if (b.includes("safari")) return "travel_explore";
  return "computer";
};

const formatDate = (isoStr?: string) => {
  if (!isoStr) return "Reciente";
  try {
    const d = new Date(isoStr);
    return d.toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return isoStr;
  }
};

// API Fetch Operations
const fetchSubscribers = async () => {
  loadingSubscribers.value = true;
  feedbackError.value = null;

  try {
    const apiUrl = config.public.apiUrl;
    const res: any = await $fetch(`${apiUrl}/admin/push-subscribers`, {
      method: "GET",
    });

    if (res && Array.isArray(res.subscribers)) {
      subscribers.value = res.subscribers;
    } else {
      subscribers.value = [];
    }
  } catch (err: any) {
    console.error("Error al cargar suscriptores:", err);
    feedbackError.value =
      err?.data?.error || err?.message || "No se pudo consultar la lista de suscriptores.";
  } finally {
    loadingSubscribers.value = false;
  }
};

const triggerSendPush = async () => {
  if (!canSend.value) return;

  sendingPush.value = true;
  feedbackError.value = null;
  feedbackSuccess.value = null;

  try {
    const apiUrl = config.public.apiUrl;
    const payload = {
      targetType: targetMode.value,
      userIds: targetMode.value === "selected" ? selectedUserIds.value : undefined,
      title: form.value.title.trim(),
      message: form.value.message.trim(),
      url: form.value.url.trim() || "/notifications",
      icon: form.value.icon || "/logotipo.svg",
      image: form.value.image?.trim() || undefined,
      tag: "jobnet-admin-broadcast",
    };

    const res: any = await $fetch(`${apiUrl}/admin/push-broadcast`, {
      method: "POST",
      body: payload,
    });

    feedbackSuccess.value = {
      title: "¡Notificación Push enviada con éxito!",
      message: `Despachada a ${res.targetedUsers || 1} usuario(s) (${res.sent || 0} dispositivos entregados).`,
    };

    // Refrescar suscriptores por si alguno fue limpiado automáticamente
    await fetchSubscribers();
  } catch (err: any) {
    console.error("Error al enviar notificación push:", err);
    feedbackError.value =
      err?.data?.error || err?.message || "Ocurrió un error al despachar la notificación push.";
  } finally {
    sendingPush.value = false;
  }
};

onMounted(() => {
  fetchSubscribers();
});
</script>
