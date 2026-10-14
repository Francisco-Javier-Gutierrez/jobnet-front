import { defineStore } from "pinia";
import type { Post, Job } from "~/types";

export const usePreviewStore = defineStore("preview", () => {
  const previewPost = ref<Post | null>(null);
  const previewVacancy = ref<Job | null>(null);

  const postDraft = ref<any>(null);
  const vacancyDraft = ref<any>(null);

  function setPreviewPost(post: Post, draft?: any) {
    previewPost.value = post;
    postDraft.value = draft;
  }

  function setPreviewVacancy(vacancy: Job, draft?: any) {
    previewVacancy.value = vacancy;
    vacancyDraft.value = draft;
  }

  function clearPreview() {
    previewPost.value = null;
    previewVacancy.value = null;
    postDraft.value = null;
    vacancyDraft.value = null;
  }

  return {
    previewPost,
    previewVacancy,
    postDraft,
    vacancyDraft,
    setPreviewPost,
    setPreviewVacancy,
    clearPreview,
  };
});
