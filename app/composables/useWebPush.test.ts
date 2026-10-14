import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { useWebPush, urlBase64ToUint8Array } from "./useWebPush";

// Mock Nuxt globals
const mockFetch = vi.fn();
(globalThis as any).$fetch = mockFetch;

(globalThis as any).useRuntimeConfig = () => ({
  public: {
    apiUrl: "https://api.jobnet.test",
    vapidPublicKey:
      "BOIrktuQCHHiOWcKICA7YEwdKJf8WNYCmBS_PI338wnaB9VqXPQfCRwTN5NLYokujXBp5pdD83av6DACG2rAYok",
  },
});

(globalThis as any).useAuth = () => ({
  data: ref({ user: { id: "user-123" } }),
});

describe("useWebPush", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({ success: true });
  });

  describe("urlBase64ToUint8Array", () => {
    it("converts a base64url string to Uint8Array properly", () => {
      const base64 = "BOIrktuQCHHiOWcKICA7YEwdKJf8WNYCmBS_PI338wnaB9VqXPQfCRwTN5NLYokujXBp5pdD83av6DACG2rAYok";
      const result = urlBase64ToUint8Array(base64);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("composable operations in browser environment", () => {
    let mockPushManager: any;
    let mockRegistration: any;

    beforeEach(() => {
      mockPushManager = {
        getSubscription: vi.fn().mockResolvedValue(null),
        subscribe: vi.fn().mockResolvedValue({
          endpoint: "https://fcm.googleapis.com/fcm/send/test-endpoint",
          toJSON: () => ({
            keys: { p256dh: "key-p256dh", auth: "auth-token" },
          }),
        }),
      };

      mockRegistration = {
        pushManager: mockPushManager,
      };

      Object.defineProperty(globalThis, "navigator", {
        value: {
          userAgent: "TestAgent/1.0",
          serviceWorker: {
            getRegistration: vi.fn().mockResolvedValue(mockRegistration),
            register: vi.fn().mockResolvedValue(mockRegistration),
            ready: Promise.resolve(mockRegistration),
          },
        },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(globalThis, "Notification", {
        value: {
          permission: "default",
          requestPermission: vi.fn().mockResolvedValue("granted"),
        },
        writable: true,
        configurable: true,
      });

      (globalThis as any).PushManager = class {};
    });

    it("checks support and state on init", async () => {
      const { isSupported, permission, checkSupportAndState } = useWebPush();
      await checkSupportAndState();

      expect(isSupported.value).toBe(true);
      expect(permission.value).toBe("default");
    });

    it("subscribes successfully and sends data to backend", async () => {
      mockFetch.mockResolvedValueOnce({ success: true });
      const { subscribe, isSubscribed, error } = useWebPush();

      const success = await subscribe("user-123");

      expect(success).toBe(true);
      expect(isSubscribed.value).toBe(true);
      expect(error.value).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.jobnet.test/profile/user-123/push-subscriptions",
        expect.objectContaining({
          method: "POST",
          body: expect.objectContaining({
            subscription: expect.objectContaining({
              endpoint: "https://fcm.googleapis.com/fcm/send/test-endpoint",
            }),
          }),
        }),
      );
    });

    it("handles permission denial gracefully", async () => {
      (globalThis as any).Notification.requestPermission = vi
        .fn()
        .mockResolvedValue("denied");

      const { subscribe, isSubscribed, permission } = useWebPush();
      const success = await subscribe("user-123");

      expect(success).toBe(false);
      expect(isSubscribed.value).toBe(false);
      expect(permission.value).toBe("denied");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("unsubscribes and notifies backend", async () => {
      const mockUnsubscribe = vi.fn().mockResolvedValue(true);
      mockPushManager.getSubscription = vi.fn().mockResolvedValue({
        endpoint: "https://fcm.googleapis.com/fcm/send/test-endpoint",
        toJSON: () => ({ endpoint: "https://fcm.googleapis.com/fcm/send/test-endpoint" }),
        unsubscribe: mockUnsubscribe,
      });
      mockFetch.mockResolvedValue({ success: true });

      const { unsubscribe, isSubscribed } = useWebPush();
      const success = await unsubscribe("user-123");

      expect(success).toBe(true);
      expect(isSubscribed.value).toBe(false);
      expect(mockUnsubscribe).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.jobnet.test/profile/user-123/push-subscriptions",
        expect.objectContaining({
          method: "DELETE",
          body: { endpoint: "https://fcm.googleapis.com/fcm/send/test-endpoint" },
        }),
      );
    });
  });
});
