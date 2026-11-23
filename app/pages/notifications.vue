<template>
  <div
    class="max-w-xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between gap-2">
        <div>
          <h1 class="text-2xl font-bold text-on-background">Notificaciones</h1>
          <p class="text-xs text-on-surface-variant dark:text-slate-300">
            Mantente al tanto de tus ofertas, comentarios y comunidad.
          </p>
        </div>
        <button
          v-if="notifications.length > 0 && !loading"
          @click="markAllAsRead"
          class="text-xs text-primary font-bold hover:underline flex-shrink-0"
        >
          Marcar todas como leídas
        </button>
      </div>

      <!-- Web Push Notification Banner -->
      <div
        v-if="isPushSupported"
        class="mt-4 p-4 rounded-2xl border transition-all duration-200"
        :class="[
          isPushSubscribed
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200'
            : pushPermission === 'denied'
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-950 dark:text-amber-200'
              : 'bg-primary/5 border-primary/20 text-on-surface',
        ]"
      >
        <div class="flex items-start gap-3">
          <span
            class="material-symbols-outlined text-2xl flex-shrink-0"
            :class="[
              isPushSubscribed
                ? 'text-emerald-600 dark:text-emerald-400'
                : pushPermission === 'denied'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-primary',
            ]"
          >
            {{
              isPushSubscribed
                ? "notifications_active"
                : pushPermission === "denied"
                  ? "notifications_off"
                  : "add_alert"
            }}
          </span>

          <div class="flex-grow min-w-0">
            <h3 class="text-xs font-bold leading-tight">
              {{
                isPushSubscribed
                  ? "Notificaciones Push activadas"
                  : pushPermission === "denied"
                    ? "Notificaciones bloqueadas en el navegador"
                    : "Activa las notificaciones en tu navegador"
              }}
            </h3>
            <p class="text-[11px] opacity-80 mt-0.5 leading-normal">
              {{
                isPushSubscribed
                  ? "Recibirás alertas en segundo plano cuando recibas mensajes o cambios en tus vacantes."
                  : pushPermission === "denied"
                    ? "Has bloqueado los permisos de notificación. Para recibirlas, permite las notificaciones en los ajustes de tu navegador."
                    : "Entérate al instante de nuevas respuestas, mensajes y postulaciones incluso con la pestaña cerrada."
              }}
            </p>
          </div>

          <div class="flex-shrink-0 self-center">
            <button
              v-if="!isPushSubscribed && pushPermission !== 'denied'"
              @click="subscribePush(userId)"
              :disabled="loadingPush"
              class="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <span
                v-if="loadingPush"
                class="material-symbols-outlined text-sm animate-spin"
                >progress_activity</span
              >
              <span>Activar</span>
            </button>

            <button
              v-else-if="isPushSubscribed"
              @click="unsubscribePush(userId)"
              :disabled="loadingPush"
              class="text-[11px] font-semibold text-on-surface-variant hover:text-rose-600 dark:hover:text-rose-400 transition"
            >
              Desactivar
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Dropdown & Counter -->
      <div
        v-if="!loading && notifications.length > 0"
        class="mt-4 flex items-center justify-between gap-3"
      >
        <div class="w-48">
          <AppSelect
            v-model="filterState"
            :options="filterOptions"
            placeholder="Filtrar por..."
          />
        </div>
        <span
          class="text-xs font-semibold text-on-surface-variant dark:text-slate-400"
        >
          {{ filteredNotifications.length }}
          {{
            filteredNotifications.length === 1
              ? "notificación"
              : "notificaciones"
          }}
        </span>
      </div>
    </div>

    <!-- Skeletons loading state -->
    <div v-if="loading" class="space-y-4 animate-pulse">
      <div
        v-for="i in 4"
        :key="i"
        class="p-4 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl flex gap-3 h-20 items-center"
      >
        <div class="w-10 h-10 rounded-full bg-outline/20"></div>
        <div class="flex-grow space-y-2">
          <div class="h-3.5 w-2/3 bg-outline/20 rounded"></div>
          <div class="h-2.5 w-1/3 bg-outline/10 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredNotifications.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl shadow-sm px-6"
    >
      <div
        class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3"
      >
        <span class="material-symbols-outlined text-[28px]">
          {{
            filterState === "unread" ? "mark_email_read" : "notifications_off"
          }}
        </span>
      </div>
      <h2 class="text-sm font-bold text-on-background mb-1">
        {{
          filterState === "unread"
            ? "Sin notificaciones no leídas"
            : filterState === "read"
              ? "Sin notificaciones leídas"
              : "Sin notificaciones"
        }}
      </h2>
      <p class="text-xs text-on-surface-variant dark:text-slate-300 max-w-xs">
        {{
          filterState === "unread"
            ? "¡Estás al día! No tienes notificaciones pendientes por leer."
            : "No tienes notificaciones en esta categoría."
        }}
      </p>
    </div>

    <!-- List of Notifications -->
    <div v-else class="space-y-3">
      <div
        v-for="notif in filteredNotifications"
        :key="notif.id"
        :class="[
          'p-4 rounded-2xl border transition duration-200 flex gap-3 items-start',
          !notif.read
            ? 'bg-primary/5 border-primary/20 shadow-sm'
            : 'bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border-outline-variant/40',
        ]"
      >
        <!-- Icon / Avatar -->
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          :class="getIconBgClass(notif.type)"
        >
          <span
            class="material-symbols-outlined text-lg"
            :class="getIconTextClass(notif.type)"
          >
            {{ getIconName(notif.type) }}
          </span>
        </div>

        <!-- Content -->
        <div class="flex-grow min-w-0 text-left">
          <div class="flex items-start justify-between gap-2">
            <h4 class="text-xs font-bold text-on-background">
              {{ notif.title }}
            </h4>
            <span
              class="text-[9px] text-on-surface-variant dark:text-slate-300 font-mono flex-shrink-0"
              >{{ formatTime(notif.createdAt) }}</span
            >
          </div>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 mt-0.5 leading-relaxed"
          >
            {{ notif.message }}
          </p>
          <div class="mt-2.5 flex items-center gap-3">
            <button
              v-if="notif.type === 'SUSPENSION_NOTICE'"
              @click="joinAppealAction(notif)"
              class="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <span class="material-symbols-outlined text-sm">forum</span>
              Apelar Decisión
            </button>
            <NuxtLink
              v-if="
                notif.type === 'AUDIT_CHANNEL_SUPERVISED' ||
                notif.type === 'AUDIT_RESOLVED' ||
                notif.type === 'FORMAL_WARNING' ||
                notif.type === 'INCIDENT_REPORTED' ||
                notif.type === 'INCIDENT_UNDER_REVIEW'
              "
              to="/messages"
              class="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
            >
              <span class="material-symbols-outlined text-sm">chat</span>
              Ver Conversación
            </NuxtLink>
            <button
              v-if="!notif.read"
              @click="markAsRead(notif.id)"
              class="text-[10px] text-primary font-extrabold hover:underline"
            >
              Marcar como leída
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AppAppealModal
    :is-open="isAppealModalOpen"
    :company-id="selectedCompanyId"
    :reason="selectedReason"
    @close="isAppealModalOpen = false"
  />
</template>

<script setup lang="ts">
import { apiFetch } from "~/composables/useApiClient";

useSeoMeta({
  title: "Notificaciones - JobNet",
  description:
    "Bandeja de notificaciones persistentes y alertas de actividad en la plataforma JobNet",
});

interface NotificationItem {
  id: string;
  type:
    | "like"
    | "comment"
    | "application"
    | "system"
    | "SUSPENSION_NOTICE"
    | "SUSPENSION_CANCELLED"
    | "SUSPENSION_CONFIRMED"
    | "AUDIT_CHANNEL_SUPERVISED"
    | "AUDIT_RESOLVED"
    | "FORMAL_WARNING"
    | "INCIDENT_REPORTED"
    | "INCIDENT_UNDER_REVIEW";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionRequired?: boolean;
  actionType?: string;
  companyId?: string;
  reason?: string | null;
  gracePeriodEnd?: string | null;
}

const loading = ref(true);
const notifications = ref<NotificationItem[]>([]);
const filterState = ref<"all" | "unread" | "read">("all");

const filterOptions = [
  { label: "Todas", value: "all", icon: "notifications" },
  { label: "No leídas", value: "unread", icon: "mark_email_unread" },
  { label: "Leídas", value: "read", icon: "drafts" },
];

const filteredNotifications = computed(() => {
  if (filterState.value === "unread") {
    return notifications.value.filter((n) => !n.read);
  }
  if (filterState.value === "read") {
    return notifications.value.filter((n) => n.read);
  }
  return notifications.value;
});
const config = useRuntimeConfig();
const { data: authSession } = useAuth();
const router = useRouter();

const userId = computed(() => (authSession.value?.user as any)?.id || null);

const {
  isSupported: isPushSupported,
  permission: pushPermission,
  isSubscribed: isPushSubscribed,
  loading: loadingPush,
  subscribe: subscribePush,
  unsubscribe: unsubscribePush,
} = useWebPush();

const getIconName = (type: NotificationItem["type"]) => {
  switch (type) {
    case "like":
      return "favorite";
    case "comment":
      return "forum";
    case "application":
      return "work";
    case "SUSPENSION_NOTICE":
    case "FORMAL_WARNING":
      return "warning";
    case "SUSPENSION_CANCELLED":
      return "task_alt";
    case "SUSPENSION_CONFIRMED":
      return "block";
    case "AUDIT_CHANNEL_SUPERVISED":
    case "INCIDENT_UNDER_REVIEW":
      return "policy";
    case "INCIDENT_REPORTED":
      return "flag";
    case "AUDIT_RESOLVED":
      return "gavel";
    default:
      return "info";
  }
};

const getIconBgClass = (type: NotificationItem["type"]) => {
  switch (type) {
    case "like":
      return "bg-rose-50 border border-rose-100 dark:bg-rose-950/40 dark:border-rose-900";
    case "comment":
      return "bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900";
    case "application":
      return "bg-tertiary/10 border border-tertiary/10 dark:bg-blue-950/40 dark:border-blue-900";
    case "SUSPENSION_NOTICE":
    case "FORMAL_WARNING":
      return "bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800";
    case "SUSPENSION_CANCELLED":
      return "bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800";
    case "SUSPENSION_CONFIRMED":
      return "bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800";
    case "AUDIT_CHANNEL_SUPERVISED":
    case "INCIDENT_UNDER_REVIEW":
      return "bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800";
    case "INCIDENT_REPORTED":
      return "bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800";
    case "AUDIT_RESOLVED":
      return "bg-purple-50 border border-purple-200 dark:bg-purple-950/40 dark:border-purple-800";
    default:
      return "bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800";
  }
};

const getIconTextClass = (type: NotificationItem["type"]) => {
  switch (type) {
    case "like":
      return "text-rose-600 dark:text-rose-400";
    case "comment":
      return "text-emerald-600 dark:text-emerald-400";
    case "application":
      return "text-tertiary dark:text-inverse-primary";
    case "SUSPENSION_NOTICE":
    case "FORMAL_WARNING":
      return "text-amber-600 dark:text-amber-400";
    case "SUSPENSION_CANCELLED":
      return "text-emerald-600 dark:text-emerald-400";
    case "SUSPENSION_CONFIRMED":
      return "text-rose-600 dark:text-rose-400";
    case "AUDIT_CHANNEL_SUPERVISED":
    case "INCIDENT_UNDER_REVIEW":
      return "text-indigo-600 dark:text-indigo-400";
    case "INCIDENT_REPORTED":
      return "text-amber-600 dark:text-amber-400";
    case "AUDIT_RESOLVED":
      return "text-purple-600 dark:text-purple-400";
    default:
      return "text-slate-600 dark:text-slate-400";
  }
};

const formatTime = (isoDate: string) => {
  if (!isoDate) return "";
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin}m`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `Hace ${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
};

const loadNotifications = async () => {
  if (!userId.value) {
    loading.value = false;
    return;
  }

  try {
    const res = await apiFetch<NotificationItem[]>(
      `/profile/${userId.value}/notifications`,
    );
    notifications.value = Array.isArray(res) ? res : [];
  } catch (e) {
    console.error("Error loading notifications:", e);
    notifications.value = [];
  } finally {
    loading.value = false;
  }
};

const markAsRead = async (id: string) => {
  const notif = notifications.value.find((n) => n.id === id);
  if (notif) {
    notif.read = true;
  }

  if (userId.value) {
    try {
      await apiFetch(`/profile/${userId.value}/notifications/${id}/read`, {
        method: "POST",
      });
    } catch (e) {
      console.error("Error marking notification as read:", e);
    }
  }
};

const markAllAsRead = async () => {
  notifications.value.forEach((n) => {
    n.read = true;
  });

  if (userId.value) {
    try {
      await apiFetch(`/profile/${userId.value}/notifications/read-all`, {
        method: "POST",
      });
    } catch (e) {
      console.error("Error marking all notifications as read:", e);
    }
  }
};

const isAppealModalOpen = ref(false);
const selectedCompanyId = ref("");
const selectedReason = ref("");

const joinAppealAction = async (notif: NotificationItem) => {
  const companyId = notif.companyId || userId.value;
  if (!companyId) return;

  selectedCompanyId.value = companyId;
  selectedReason.value = notif.reason || notif.message || "";

  try {
    await $fetch(
      `${config.public.apiUrl}/moderator/organizations/${companyId}/join-appeal`,
      { method: "POST" },
    ).catch(() => {});
  } catch (e: any) {
    console.error("Error joining appeal:", e);
  }

  isAppealModalOpen.value = true;
};

onMounted(() => {
  loadNotifications();
});
</script>
