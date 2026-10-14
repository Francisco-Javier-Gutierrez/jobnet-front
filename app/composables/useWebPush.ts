import { ref, computed, onMounted, getCurrentInstance } from "vue";

export type PushPermissionState =
  "default" | "granted" | "denied" | "unsupported";

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const useWebPush = () => {
  const config = useRuntimeConfig();
  const { data: authSession } = useAuth();

  const isSupported = ref(false);
  const permission = ref<PushPermissionState>("default");
  const isSubscribed = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const currentUserId = computed(
    () => (authSession.value?.user as any)?.id || null,
  );

  const checkSupportAndState = async () => {
    if (typeof window === "undefined") return;

    if (
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      isSupported.value = false;
      permission.value = "unsupported";
      return;
    }

    isSupported.value = true;
    permission.value = Notification.permission;

    try {
      // Registrar el Service Worker si no está registrado
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
      }

      await navigator.serviceWorker.ready;
      const existingSub = await registration.pushManager.getSubscription();
      isSubscribed.value = !!existingSub;
    } catch (err: any) {
      console.error("[useWebPush] Error checking push state:", err);
      error.value = err?.message || "Error al verificar suscripción push";
    }
  };

  /**
   * Solicita permisos de notificación y suscribe el dispositivo a Web Push
   */
  const subscribe = async (targetUserId?: string): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    if (!isSupported.value) {
      await checkSupportAndState();
    }

    if (!isSupported.value) {
      error.value = "Notificaciones push no soportadas en este navegador.";
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      // 1. Solicitar permisos al usuario
      const permResult = await Notification.requestPermission();
      permission.value = permResult;

      if (permResult !== "granted") {
        error.value =
          permResult === "denied"
            ? "Permiso de notificaciones denegado en el navegador."
            : "No se otorgaron permisos de notificación.";
        return false;
      }

      // 2. Asegurar que el Service Worker esté activo
      const registration = await navigator.serviceWorker.ready;

      // 3. Obtener o crear la suscripción Push con la clave VAPID pública
      const vapidKey =
        (config.public as any).vapidPublicKey ||
        "BOIrktuQCHHiOWcKICA7YEwdKJf8WNYCmBS_PI338wnaB9VqXPQfCRwTN5NLYokujXBp5pdD83av6DACG2rAYok";

      const convertedKey = urlBase64ToUint8Array(vapidKey);

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        });
      }

      // 4. Enviar la suscripción al Backend de JobNet
      const uid = targetUserId || currentUserId.value;
      if (uid) {
        const subJson = subscription.toJSON();
        const apiUrl = config.public.apiUrl;

        await $fetch(`${apiUrl}/profile/${uid}/push-subscriptions`, {
          method: "POST",
          body: {
            subscription: {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subJson.keys?.p256dh,
                auth: subJson.keys?.auth,
              },
            },
            userAgent: navigator.userAgent,
          },
        });
      }

      isSubscribed.value = true;
      return true;
    } catch (err: any) {
      console.error("[useWebPush] Subscription error:", err);
      error.value =
        err?.message || "Error al suscribirse a notificaciones push";
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cancela la suscripción a notificaciones Web Push
   */
  const unsubscribe = async (targetUserId?: string): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    if (!isSupported.value) {
      await checkSupportAndState();
    }

    if (!isSupported.value) return false;

    loading.value = true;
    error.value = null;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();

        // Notificar al Backend para remover de DynamoDB
        const uid = targetUserId || currentUserId.value;
        if (uid) {
          const apiUrl = config.public.apiUrl;
          await $fetch(`${apiUrl}/profile/${uid}/push-subscriptions`, {
            method: "DELETE",
            body: { endpoint },
          }).catch((err) => {
            console.warn("[useWebPush] Backend unregister error:", err);
          });
        }
      }

      isSubscribed.value = false;
      return true;
    } catch (err: any) {
      console.error("[useWebPush] Unsubscribe error:", err);
      error.value = err?.message || "Error al desactivar notificaciones";
      return false;
    } finally {
      loading.value = false;
    }
  };

  if (getCurrentInstance()) {
    onMounted(() => {
      checkSupportAndState();
    });
  }

  return {
    isSupported,
    permission,
    isSubscribed,
    loading,
    error,
    subscribe,
    unsubscribe,
    checkSupportAndState,
  };
};
