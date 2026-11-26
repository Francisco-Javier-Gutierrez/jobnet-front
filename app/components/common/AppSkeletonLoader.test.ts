import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppSkeletonLoader, { type SkeletonType } from "./AppSkeletonLoader.vue";

describe("AppSkeletonLoader.vue", () => {
  const variants: SkeletonType[] = [
    "card",
    "table",
    "list",
    "stats",
    "detail",
    "form",
    "chat-list",
    "chat-thread",
    "chart",
    "qr",
  ];

  it.each(variants)(
    "renders accessible status region for variant '%s'",
    (type) => {
      const wrapper = mount(AppSkeletonLoader, {
        props: { type, count: 4 },
      });

      expect(wrapper.attributes("role")).toBe("status");
      expect(wrapper.attributes("aria-busy")).toBe("true");
      expect(wrapper.attributes("aria-label")).toBe("Cargando contenido...");
      expect(wrapper.find(".skeleton-shimmer").exists()).toBe(true);
    },
  );

  it("supports custom columns for card grid and count <= 2 for stats grid", () => {
    const oneCol = mount(AppSkeletonLoader, {
      props: { type: "card", columns: 1, count: 2 },
    });
    expect(oneCol.find(".grid-cols-1").exists()).toBe(true);

    const twoCol = mount(AppSkeletonLoader, {
      props: { type: "card", columns: 2, count: 2 },
    });
    expect(twoCol.find(".md\\:grid-cols-2").exists()).toBe(true);

    const twoStats = mount(AppSkeletonLoader, {
      props: { type: "stats", count: 2, label: "Cargando métricas" },
    });
    expect(twoStats.find(".sm\\:grid-cols-2").exists()).toBe(true);
    expect(twoStats.attributes("aria-label")).toBe("Cargando métricas");
  });
});
