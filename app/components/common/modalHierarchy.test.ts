import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppModal from "./AppModal.vue";
import AppFeedbackModal from "./AppFeedbackModal.vue";
import AppConfirmModal from "./AppConfirmModal.vue";
import { createPinia, setActivePinia } from "pinia";
import { useFeedbackStore } from "~/composables/useAppFeedback";

describe("Modal z-index hierarchy & Accessibility", () => {
  it("AppModal defaults to z-[1000] and supports custom zIndexClass", () => {
    const wrapper = mount(AppModal, {
      props: {
        modelValue: true,
        title: "Test Modal",
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    });

    const rootDiv = wrapper.find('[role="dialog"]');
    expect(rootDiv.exists()).toBe(true);
    expect(rootDiv.classes()).toContain("z-[1000]");
    expect(rootDiv.attributes("data-modal-active")).toBe("true");
    expect(rootDiv.attributes("aria-modal")).toBe("true");

    const customWrapper = mount(AppModal, {
      props: {
        modelValue: true,
        zIndexClass: "z-[99999]",
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    });

    const customDiv = customWrapper.find('[role="dialog"]');
    expect(customDiv.classes()).toContain("z-[99999]");
  });

  it("AppFeedbackModal renders at top tier z-[99999]", () => {
    setActivePinia(createPinia());
    const store = useFeedbackStore();
    store.showSuccess("Success", "Operation complete");

    const wrapper = mount(AppFeedbackModal, {
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    });

    const dialog = wrapper.findComponent(AppModal);
    expect(dialog.exists()).toBe(true);
    expect(dialog.props("zIndexClass")).toBe("z-[99999]");
  });

  it("AppConfirmModal renders at high tier z-[99990]", () => {
    const wrapper = mount(AppConfirmModal, {
      props: {
        modelValue: true,
        title: "Confirm action",
        message: "Are you sure?",
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    });

    const dialog = wrapper.findComponent(AppModal);
    expect(dialog.exists()).toBe(true);
    expect(dialog.props("zIndexClass")).toBe("z-[99990]");
  });
});
