import { describe, it, expect, vi } from "vitest";
import { useActionLoading } from "./useActionLoading";

describe("useActionLoading", () => {
  it("tracks independent loading state per key and clears it on completion", async () => {
    const { isPending, pendingKeys, runWithLoading } = useActionLoading();

    let resolveAction!: (val: string) => void;
    const actionPromise = runWithLoading(
      "row-1",
      () =>
        new Promise<string>((resolve) => {
          resolveAction = resolve;
        }),
    );

    expect(isPending("row-1")).toBe(true);
    expect(isPending("row-2")).toBe(false);
    expect(pendingKeys.value["row-1"]).toBe(true);

    resolveAction("done");
    const res = await actionPromise;
    expect(res).toBe("done");
    expect(isPending("row-1")).toBe(false);
  });

  it("ignores duplicate invocations for the same in-flight key", async () => {
    const { runWithLoading } = useActionLoading();
    const fn = vi.fn(
      () =>
        new Promise<string>((resolve) => setTimeout(() => resolve("ok"), 10)),
    );

    const p1 = runWithLoading("item-a", fn);
    const p2 = runWithLoading("item-a", fn);

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(r1).toBe("ok");
    expect(r2).toBeUndefined();
  });

  it("clears loading state even when the action rejects", async () => {
    const { isPending, runWithLoading } = useActionLoading();

    await expect(
      runWithLoading("err-key", async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");

    expect(isPending("err-key")).toBe(false);
  });
});
