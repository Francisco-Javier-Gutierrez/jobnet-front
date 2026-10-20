import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppIcon from "./AppIcon.vue";

describe("AppIcon.vue", () => {
  it("renders the material-symbols-outlined class and ligature text", () => {
    const wrapper = mount(AppIcon, {
      props: {
        name: "search",
      },
    });

    expect(wrapper.classes()).toContain("material-symbols-outlined");
    expect(wrapper.text()).toBe("search");
    expect(wrapper.attributes("aria-hidden")).toBe("true");
  });

  it("supports icon prop as fallback for name", () => {
    const wrapper = mount(AppIcon, {
      props: {
        icon: "close",
      },
    });

    expect(wrapper.text()).toBe("close");
  });

  it("applies font-fill-1 class when fill is true", () => {
    const wrapper = mount(AppIcon, {
      props: {
        name: "favorite",
        fill: true,
      },
    });

    expect(wrapper.classes()).toContain("font-fill-1");
  });

  it("applies preset size class or inline style correctly", () => {
    const wrapperPreset = mount(AppIcon, {
      props: {
        name: "work",
        size: "sm",
      },
    });
    expect(wrapperPreset.classes()).toContain("text-[18px]");

    const wrapperNumeric = mount(AppIcon, {
      props: {
        name: "work",
        size: 32,
      },
    });
    expect(wrapperNumeric.attributes("style")).toContain("font-size: 32px");
  });

  it("sets accessible role and aria-label when ariaLabel is provided", () => {
    const wrapper = mount(AppIcon, {
      props: {
        name: "notifications",
        ariaLabel: "Notificaciones del usuario",
      },
    });

    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toBe("Notificaciones del usuario");
    expect(wrapper.attributes("aria-hidden")).toBeUndefined();
  });
});
