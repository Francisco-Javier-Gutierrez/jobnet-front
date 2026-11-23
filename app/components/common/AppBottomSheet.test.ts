import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppBottomSheet from "./AppBottomSheet.vue";

describe("AppBottomSheet.vue", () => {
  it("renders when modelValue is true with accessibility attributes", () => {
    const wrapper = mount(AppBottomSheet, {
      props: {
        modelValue: true,
        title: "Opciones de Vacante",
        description: "Gestiona tu postulación o guarda esta oferta",
      },
      slots: {
        default: "<p>Contenido del bottom sheet</p>",
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    });

    const dialog = wrapper.find('[role="dialog"]');
    expect(dialog.exists()).toBe(true);
    expect(dialog.attributes("aria-modal")).toBe("true");
    expect(wrapper.text()).toContain("Opciones de Vacante");
    expect(wrapper.text()).toContain(
      "Gestiona tu postulación o guarda esta oferta",
    );
    expect(wrapper.text()).toContain("Contenido del bottom sheet");
  });

  it("does not render dialog when modelValue is false", () => {
    const wrapper = mount(AppBottomSheet, {
      props: {
        modelValue: false,
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    });

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });

  it("emits update:modelValue and close when close button is clicked", async () => {
    const wrapper = mount(AppBottomSheet, {
      props: {
        modelValue: true,
        title: "Test Sheet",
        showCloseButton: true,
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    });

    const closeBtn = wrapper.find('button[aria-label="Cerrar panel"]');
    expect(closeBtn.exists()).toBe(true);
    await closeBtn.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("emits update:modelValue and close when overlay is clicked", async () => {
    const wrapper = mount(AppBottomSheet, {
      props: {
        modelValue: true,
        closeOnOverlay: true,
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    });

    const overlay = wrapper.find('[role="dialog"]');
    await overlay.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("emits update:modelValue and close on Escape key", async () => {
    const wrapper = mount(AppBottomSheet, {
      props: {
        modelValue: true,
        closeOnEsc: true,
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    });

    const overlay = wrapper.find('[role="dialog"]');
    await overlay.trigger("keydown.esc");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });
});
