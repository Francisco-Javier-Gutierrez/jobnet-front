import { describe, it, expect, beforeEach } from "vitest";
import { useCommandPalette } from "./useCommandPalette";

describe("useCommandPalette", () => {
  beforeEach(() => {
    const { closeCommandPalette } = useCommandPalette();
    closeCommandPalette();
  });

  it("should initialize as closed", () => {
    const { isOpen } = useCommandPalette();
    expect(isOpen.value).toBe(false);
  });

  it("should open and close the command palette", () => {
    const { isOpen, openCommandPalette, closeCommandPalette } =
      useCommandPalette();

    openCommandPalette();
    expect(isOpen.value).toBe(true);

    closeCommandPalette();
    expect(isOpen.value).toBe(false);
  });

  it("should toggle the command palette state", () => {
    const { isOpen, toggleCommandPalette } = useCommandPalette();

    expect(isOpen.value).toBe(false);
    toggleCommandPalette();
    expect(isOpen.value).toBe(true);
    toggleCommandPalette();
    expect(isOpen.value).toBe(false);
  });
});
