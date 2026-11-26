import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import {
  useContentInteractions,
  isItemLiked,
  isItemBookmarked,
  getItemLikesCount,
  getItemBookmarksCount,
  resolveItemId,
  inferContentKind,
} from "./useContentInteractions";

const mockFetch = vi.fn();
(globalThis as any).$fetch = mockFetch;

const mockSession = ref<any>({
  user: { id: "user-123", email: "dev@jobnet.test" },
});
const mockStatus = ref("authenticated");
(globalThis as any).useAuth = () => ({
  data: mockSession,
  status: mockStatus,
});

describe("useContentInteractions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSession.value = { user: { id: "user-123", email: "dev@jobnet.test" } };
    mockStatus.value = "authenticated";
  });

  it("resolves IDs and infers content kind for posts and jobs", () => {
    const post = { uniqueId: "post-1", id: "legacy-1", content: "hello" };
    const job = { id: "job-1", uniqueId: "u-job-1", tipo: "VACANTE" };

    expect(inferContentKind(post)).toBe("post");
    expect(inferContentKind(job)).toBe("job");
    expect(resolveItemId(post, "post")).toBe("post-1");
    expect(resolveItemId(job, "job")).toBe("job-1");
  });

  it("optimistically increments and decrements job likesCount, likes, likesList, and isLiked", async () => {
    mockFetch.mockResolvedValue({ liked: true, likesCount: 5 });
    const { toggleLike } = useContentInteractions();

    const job: any = {
      id: "job-100",
      likesList: ["other-user"],
      likesCount: 4,
      likes: 4,
      isLiked: false,
    };

    const promise = toggleLike(job, "job");
    // Immediate optimistic update before server resolves
    expect(job.isLiked).toBe(true);
    expect(job.likesCount).toBe(5);
    expect(job.likes).toBe(5);
    expect(job.likesList).toContain("user-123");

    await promise;
    expect(mockFetch).toHaveBeenCalledWith("/api/jobs/job-100/like", {
      method: "POST",
      body: { userUuid: "user-123", userId: "user-123" },
    });
    expect(job.likesCount).toBe(5);

    // Toggle off
    mockFetch.mockResolvedValue({ liked: false, likesCount: 4 });
    await toggleLike(job, "job");
    expect(job.isLiked).toBe(false);
    expect(job.likesCount).toBe(4);
    expect(job.likes).toBe(4);
    expect(job.likesList).not.toContain("user-123");
  });

  it("reverts optimistic like state on API failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const { toggleLike } = useContentInteractions();

    const job: any = {
      id: "job-err",
      likesList: [],
      likesCount: 2,
      likes: 2,
      isLiked: false,
    };

    await toggleLike(job, "job");
    expect(job.isLiked).toBe(false);
    expect(job.likesCount).toBe(2);
    expect(job.likes).toBe(2);
    expect(job.likesList).toEqual([]);
  });

  it("optimistically updates bookmarks for posts and syncs extraTargets", async () => {
    mockFetch.mockResolvedValue({ bookmarked: true, bookmarksCount: 2 });
    const { toggleBookmark } = useContentInteractions();

    const post: any = {
      uniqueId: "post-200",
      bookmarksList: ["someone-else"],
      bookmarksCount: 1,
      isBookmarked: false,
    };
    const duplicatePostRef: any = {
      uniqueId: "post-200",
      bookmarksList: ["someone-else"],
      bookmarksCount: 1,
      isBookmarked: false,
    };

    await toggleBookmark(post, "post", { extraTargets: [duplicatePostRef] });

    expect(mockFetch).toHaveBeenCalledWith("/api/posts/post-200/bookmark", {
      method: "POST",
      body: { userUuid: "user-123", userId: "user-123" },
    });
    expect(post.isBookmarked).toBe(true);
    expect(post.bookmarksCount).toBe(2);
    expect(duplicatePostRef.isBookmarked).toBe(true);
    expect(duplicatePostRef.bookmarksCount).toBe(2);
  });

  it("computes helper predicates and counts consistently", () => {
    const item = {
      likesList: ["dev@jobnet.test"],
      likesCount: 3,
      bookmarksList: ["user-123"],
      bookmarksCount: 1,
    };

    expect(isItemLiked(item, ["dev@jobnet.test"])).toBe(true);
    expect(isItemBookmarked(item, ["user-123"])).toBe(true);
    expect(getItemLikesCount(item)).toBe(3);
    expect(getItemBookmarksCount(item)).toBe(1);
  });
});
