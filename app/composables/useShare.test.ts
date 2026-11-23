import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useShare } from "./useShare";

const mockFetch = vi.fn();
(globalThis as any).$fetch = mockFetch;

const mockWriteText = vi.fn().mockResolvedValue(undefined);

Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
  configurable: true,
});

describe("useShare Composable", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    (process as any).client = true;
    mockWriteText.mockResolvedValue(undefined);
  });

  it("should share a post and increment sharesCount by exactly 1", async () => {
    mockFetch.mockResolvedValue({ success: true });
    const { sharePost } = useShare();

    const post = {
      uniqueId: "post-abc-123",
      content: "Sharing an engineering update",
      sharesCount: 3,
    };

    await sharePost(post);

    // Exact single increment
    expect(post.sharesCount).toBe(4);
    expect(mockWriteText).toHaveBeenCalledWith(
      expect.stringContaining("/posts/post-abc-123"),
    );
    expect(mockFetch).toHaveBeenCalledWith("/api/posts/post-abc-123/share", {
      method: "POST",
    });
  });

  it("should initialize sharesCount to 1 if initially undefined or 0 on post", async () => {
    mockFetch.mockResolvedValue({ success: true });
    const { sharePost } = useShare();

    const postWithoutCount: any = {
      id: "post-zero-456",
      content: "New post",
    };

    await sharePost(postWithoutCount);

    expect(postWithoutCount.sharesCount).toBe(1);
    expect(mockFetch).toHaveBeenCalledWith("/api/posts/post-zero-456/share", {
      method: "POST",
    });
  });

  it("should share a job vacancy and increment sharesCount by exactly 1", async () => {
    mockFetch.mockResolvedValue({ success: true });
    const { shareJob } = useShare();

    const job = {
      id: "job-tech-789",
      title: "Senior Cloud Architect",
      sharesCount: 0,
    };

    await shareJob(job);

    // Exact single increment
    expect(job.sharesCount).toBe(1);
    expect(mockWriteText).toHaveBeenCalledWith(
      expect.stringContaining("/jobs/job-tech-789"),
    );
    expect(mockFetch).toHaveBeenCalledWith("/api/jobs/job-tech-789/share", {
      method: "POST",
    });
  });

  it("should gracefully handle backend API failures without reverting optimistic increment", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const { shareJob } = useShare();

    const job = {
      uniqueId: "job-fallback-101",
      sharesCount: 5,
    };

    await expect(shareJob(job)).resolves.not.toThrow();
    expect(job.sharesCount).toBe(6);
  });
});
