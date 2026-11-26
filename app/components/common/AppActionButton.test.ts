import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppActionButton from "./AppActionButton.vue";

describe("AppActionButton.vue", () => {
  it("renders label and icon in idle state", () => {
    const wrapper = mount(AppActionButton, {
      props: {
        label: "Guardar",
        icon: "save",
      },
    });

    const btn = wrapper.find("button");
    expect(btn.attributes("type")).toBe("button");
    expect(btn.attributes("disabled")).toBeUndefined();
    expect(btn.attributes("aria-busy")).toBeUndefined();
    expect(wrapper.text()).toContain("save");
    expect(wrapper.text()).toContain("Guardar");
  });

  it("renders spinner, disables button and switches to loadingText when loading", () => {
    const wrapper = mount(AppActionButton, {
      props: {
        type: "submit",
        label: "Enviar",
        loadingText: "Enviando...",
        icon: "send",
        loading: true,
        spinnerSize: "xs",
      },
    });

    const btn = wrapper.find("button");
    expect(btn.attributes("type")).toBe("submit");
    expect(btn.attributes("disabled")).toBeDefined();
    expect(btn.attributes("aria-busy")).toBe("true");
    expect(wrapper.find(".animate-spin").classes()).toContain("w-3");
    expect(wrapper.text()).toContain("Enviando...");
    expect(wrapper.text()).not.toContain("send");
  });

  it("supports md spinner size, disabled prop, and custom slot", () => {
    const wrapper = mount(AppActionButton, {
      props: {
        loading: true,
        disabled: true,
        spinnerSize: "md",
      },
      slots: {
        default: "Procesando acción",
      },
    });

    expect(wrapper.find(".animate-spin").classes()).toContain("w-4");
    expect(wrapper.text()).toContain("Procesando acción");
  });

  it("uses default sm spinner size and falls back to label when loadingText is omitted", () => {
    const wrapper = mount(AppActionButton, {
      props: {
        label: "Procesando",
        loading: true,
      },
    });

    expect(wrapper.find(".animate-spin").classes()).toContain("w-3.5");
    expect(wrapper.text()).toContain("Procesando");
  });
});
