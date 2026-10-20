import { useRoute } from "vue-router";
import { useRuntimeConfig } from "#app";
import type { CandidateProfile, Post } from "~/types";
import { MOCK_CANDIDATE_DEMO } from "~/utils/mockData";
import { useCvInteraction } from "~/composables/useCvInteraction";

export function useCandidateProfile(candidateIdParam?: string) {
  const route = useRoute();
  const candidateId = candidateIdParam || (route.params.id as string);
  const { data: authData } = useAuth();
  const config = useRuntimeConfig();
  const { sharePost, shareJob } = useShare();

  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=128";

  // --- State ---
  const loading = ref(true);
  const error = ref(false);
  const errorMessage = ref("");
  const profile = ref<CandidateProfile>({});

  // Doc Viewer State
  const selectedDocUrl = ref("");
  const selectedDocTitle = ref("");
  const showDocViewer = ref(false);

  const openDocViewer = (url: string, title: string) => {
    selectedDocUrl.value = url;
    selectedDocTitle.value = title;
    showDocViewer.value = true;

    if (
      !isOwner.value &&
      (title.toLowerCase().includes("cv") ||
        title.toLowerCase().includes("curriculum"))
    ) {
      const { notifyCvInteraction } = useCvInteraction();
      notifyCvInteraction(candidateId, { action: "VIEW" });
    }
  };

  // --- Ownership Check ---
  const isOwner = computed(() => {
    const user = authData.value?.user as any;
    if (!user) return false;
    const uid = user.id ? String(user.id).toLowerCase() : "";
    const uemail = user.email ? String(user.email).toLowerCase() : "";
    const candIdLower = String(candidateId || "").toLowerCase();
    const profId = profile.value.id ? String(profile.value.id).toLowerCase() : "";
    const profEmail = profile.value.email ? String(profile.value.email).toLowerCase() : "";
    const profUuid = profile.value.usuarioUuid ? String(profile.value.usuarioUuid).toLowerCase() : "";

    return (
      (uid && uid === candIdLower) ||
      (uemail && uemail === candIdLower) ||
      (profId && uid === profId) ||
      (profUuid && uid === profUuid) ||
      (profEmail && uemail === profEmail)
    );
  });

  // --- Computed from profile data ---
  const locationText = computed(() => {
    const loc = profile.value.ubicacion;
    if (!loc) return "";
    if (typeof loc === "string") return loc;
    return [loc.city, loc.pais].filter(Boolean).join(", ") || "";
  });

  const skills = computed<string[]>(() => {
    return profile.value.habilidades || [];
  });

  const sectors = computed<string[]>(() => {
    return profile.value.sectores || [];
  });

  const webLinks = computed(() => {
    const result: Array<{ name: string; url: string; icon: string }> = [];
    const linksArray = profile.value.links;
    const linksObj = profile.value.enlacesWeb;

    if (Array.isArray(linksArray) && linksArray.length > 0) {
      linksArray.forEach((item: any) => {
        const name = item.label || item.nombre || "Enlace Web";
        const url = item.url;
        if (url) {
          result.push({ name, url, icon: getWebLinkIcon(name + " " + url) });
        }
      });
    } else if (linksObj && typeof linksObj === "object") {
      Object.entries(linksObj).forEach(([name, url]) => {
        if (url) {
          result.push({
            name,
            url: url as string,
            icon: getWebLinkIcon(name + " " + url),
          });
        }
      });
    }
    return result;
  });

  const documents = computed(() => {
    const docs: Array<{
      name: string;
      meta: string;
      type: string;
      url: string;
    }> = [];

    // Primary CV
    if (profile.value.cvUrl) {
      docs.push({
        name: profile.value.cvFileName || "Curriculum Vitae Principal",
        meta: "CV Principal",
        type: "pdf",
        url: profile.value.cvUrl,
      });
    }

    // Additional documents
    const rawDocs =
      profile.value.documentosAdicionales ||
      profile.value.documentosProfesionales;
    if (Array.isArray(rawDocs) && rawDocs.length > 0) {
      rawDocs.forEach((d: any) => {
        if (d) {
          const url = typeof d === "string" ? d : d.url;
          const name =
            typeof d === "string"
              ? "Documento Adicional"
              : d.name || d.nombre || "Documento Adicional";
          if (url) {
            const isExternalLink =
              d.esEnlaceExterno === true ||
              d.type === "link" ||
              (!url.includes(".pdf") && url.startsWith("http"));
            const isPdf =
              !isExternalLink &&
              ((typeof d !== "string" && d.type === "pdf") ||
                (url && url.toLowerCase().includes(".pdf")));

            let meta = "Documento";
            if (isExternalLink) {
              meta = d.institucion
                ? `Credencial Verificable · ${d.institucion}`
                : "Enlace Externo Verificable";
            } else if (d.tipoDocumento) {
              const typeLabels: Record<string, string> = {
                CERTIFICACION: "Certificación PDF",
                DIPLOMA: "Diploma PDF",
                CONSTANCIA: "Constancia PDF",
                OTRO: "Documento PDF",
              };
              meta = typeLabels[d.tipoDocumento] || "Documento PDF";
            } else {
              meta = isPdf ? "Documento PDF" : "Archivo Adjunto";
            }

            docs.push({
              name,
              meta,
              type: isExternalLink ? "link" : isPdf ? "pdf" : "image",
              url,
              esEnlaceExterno: isExternalLink,
            });
          }
        }
      });
    } else if (
      rawDocs &&
      typeof rawDocs === "object" &&
      !Array.isArray(rawDocs)
    ) {
      for (const [name, doc] of Object.entries(rawDocs)) {
        const d = doc as any;
        const url = typeof d === "string" ? d : d?.url;
        if (url) {
          const isPdf = url.includes(".pdf");
          docs.push({
            name,
            meta: isPdf ? "Documento PDF" : "Archivo Adjunto",
            type: isPdf ? "pdf" : "image",
            url,
          });
        }
      }
    }

    return docs;
  });

  function getWebLinkIcon(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes("github")) return "code";
    if (lower.includes("portfolio")) return "language";
    if (lower.includes("linkedin")) return "link";
    return "link";
  }

  // --- Fetch Profile ---
  async function fetchProfile() {
    loading.value = true;
    error.value = false;
    errorMessage.value = "";

    try {
      const { data, error: fetchError } = await useAsyncData(
        `candidate-profile-${candidateId}`,
        () => $fetch<any>(`${config.public.apiUrl}/profile/${candidateId}`).catch(() => MOCK_CANDIDATE_DEMO),
      );

      if (fetchError.value) {
        throw fetchError.value;
      }

      const parsedData =
        typeof data.value === "string" ? JSON.parse(data.value) : data.value;

      if (!parsedData) {
        throw new Error("Perfil no encontrado");
      }

      profile.value = parsedData;
    } catch (e: any) {
      profile.value = MOCK_CANDIDATE_DEMO;
      error.value = false;
      errorMessage.value =
        e?.data?.message ||
        e?.message ||
        "Ocurrió un error al cargar el perfil. Por favor, inténtalo de nuevo.";
    } finally {
      loading.value = false;
    }
  }

  async function refreshProfile() {
    await fetchProfile();
  }

  // --- Posts & Bookmarks Tab State ---
  const activeTab = ref<"posts" | "bookmarks">("posts");
  const allUserPosts = ref<any[]>([]);

  const { data: postsData, pending: postsPending } = useLazyAsyncData(
    `candidate-posts-${candidateId}`,
    () =>
      $fetch(`${config.public.apiUrl}/profile/${candidateId}/posts`)
        .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
        .catch(() => ({ data: [] })),
  );

  const allBookmarkedPosts = ref<any[]>([]);
  const allBookmarkedJobs = ref<any[]>([]);

  const currentUserId = computed(() => {
    const user = authData.value?.user as any;
    return user?.id || user?.email || "";
  });

  const effectiveBookmarkUserId = computed(() => {
    if (isOwner.value && currentUserId.value) return currentUserId.value;
    return candidateId;
  });

  const {
    data: bookmarksData,
    pending: bookmarksPending,
    refresh: refreshBookmarks,
  } = useLazyAsyncData(
    `candidate-bookmarks-${candidateId}`,
    () => {
      // Directiva de privacidad: los elementos guardados solo son accesibles por el propio usuario
      if (!isOwner.value || !currentUserId.value) {
        return Promise.resolve({ data: [], posts: [], jobs: [] });
      }
      const targetId = effectiveBookmarkUserId.value;
      const uid = currentUserId.value;
      return $fetch(
        `/api/profile/${encodeURIComponent(targetId)}/bookmarks?userId=${encodeURIComponent(uid)}`,
        {
          headers: uid ? { "x-user-id": uid } : {},
        },
      )
        .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
        .catch(() => ({ data: [], posts: [], jobs: [] }));
    },
    { watch: [isOwner, effectiveBookmarkUserId] },
  );

  watch([isOwner, currentUserId], ([owner, uid]) => {
    if (owner && uid) {
      refreshBookmarks();
    }
  });

  watch(
    postsData,
    (val: any) => {
      if (val?.data) allUserPosts.value = val.data;
    },
    { immediate: true },
  );

  watch(
    bookmarksData,
    (val: any) => {
      if (val) {
        const posts =
          Array.isArray(val.posts) && val.posts.length > 0
            ? val.posts
            : Array.isArray(val.data)
              ? val.data.filter(
                  (i: any) =>
                    (i.PK && i.PK.startsWith("POST#")) ||
                    i.uniqueId ||
                    (i.content && !i.modalidad),
                )
              : [];
        allBookmarkedPosts.value = posts;

        const jobs =
          Array.isArray(val.jobs) && val.jobs.length > 0
            ? val.jobs
            : Array.isArray(val.data)
              ? val.data.filter(
                  (i: any) =>
                    (i.PK && i.PK.startsWith("VACANCY#")) ||
                    i.empresaUuid !== undefined ||
                    i.modalidad !== undefined ||
                    i.salario !== undefined ||
                    i.title !== undefined,
                )
              : [];
        allBookmarkedJobs.value = jobs;
      }
    },
    { immediate: true },
  );

  const loadingPosts = computed(
    () => postsPending.value || bookmarksPending.value,
  );
  const userPosts = computed(() => allUserPosts.value);
  const bookmarkedPosts = computed(() => allBookmarkedPosts.value);
  const bookmarkedJobs = computed(() => allBookmarkedJobs.value);

  const isBookmarked = (post: any) => {
    if (!post) return false;
    const authUser = authData.value?.user as any;
    const currentAuthId = authUser?.id || candidateId;
    const currentAuthEmail = authUser?.email?.toLowerCase();

    const bookmarks =
      post.bookmarksList || post.bookmarkedBy || post.bookmarks || [];
    if (Array.isArray(bookmarks)) {
      return (
        bookmarks.includes(candidateId) ||
        (currentAuthId && bookmarks.includes(currentAuthId)) ||
        (currentAuthEmail && bookmarks.includes(currentAuthEmail))
      );
    }
    return Boolean(post.isBookmarked || post.bookmarked);
  };

  const toggleLike = async (itemOrId: any) => {
    const post =
      typeof itemOrId === "string"
        ? allUserPosts.value.find(
            (p) => p.uniqueId === itemOrId || p.id === itemOrId,
          ) ||
          allBookmarkedPosts.value.find(
            (p) => p.uniqueId === itemOrId || p.id === itemOrId,
          )
        : itemOrId;

    if (!post) return;
    const authUser = authData.value?.user as any;
    const currentUserId = authUser?.id || authUser?.email;
    if (!currentUserId) return;

    if (!post.likesList) post.likesList = [];

    const userEmail = authUser?.email?.toLowerCase();
    const userId = authUser?.id;

    const originalLikes = [...post.likesList];
    const existingIdx = post.likesList.findIndex((item: any) => {
      const s = String(item).toLowerCase();
      return (
        s === String(currentUserId).toLowerCase() ||
        (userEmail && s === userEmail) ||
        (userId && s === String(userId).toLowerCase())
      );
    });

    if (existingIdx !== -1) {
      post.likesList.splice(existingIdx, 1);
    } else {
      post.likesList.push(currentUserId);
    }

    try {
      const postId = post.uniqueId || post.id;
      const res = await $fetch<any>(`/api/posts/${postId}/like`, {
        method: "POST",
        body: { userId: currentUserId, userUuid: currentUserId },
      });

      if (res?.likesList) {
        post.likesList = res.likesList;
      }
    } catch (e) {
      console.error("Error toggling like:", e);
      post.likesList = originalLikes;
    }
  };

  const toggleBookmark = async (itemOrId: any) => {
    const post =
      typeof itemOrId === "string"
        ? allUserPosts.value.find(
            (p) => p.uniqueId === itemOrId || p.id === itemOrId,
          ) ||
          allBookmarkedPosts.value.find(
            (p) => p.uniqueId === itemOrId || p.id === itemOrId,
          )
        : itemOrId;

    if (!post) return;
    const authUser = authData.value?.user as any;
    const currentUserId = authUser?.id || authUser?.email;
    if (!currentUserId) return;

    if (!post.bookmarksList) post.bookmarksList = [];

    const userEmail = authUser?.email?.toLowerCase();
    const userId = authUser?.id;

    const originalBookmarks = [...post.bookmarksList];
    const existingIdx = post.bookmarksList.findIndex((item: any) => {
      const s = String(item).toLowerCase();
      return (
        s === String(currentUserId).toLowerCase() ||
        (userEmail && s === userEmail) ||
        (userId && s === String(userId).toLowerCase())
      );
    });

    if (existingIdx !== -1) {
      post.bookmarksList.splice(existingIdx, 1);
    } else {
      post.bookmarksList.push(currentUserId);
    }

    try {
      const postId = post.uniqueId || post.id;
      const res = await $fetch<any>(`/api/posts/${postId}/bookmark`, {
        method: "POST",
        body: { userId: currentUserId, userUuid: currentUserId },
      });

      if (res?.bookmarksList) {
        post.bookmarksList = res.bookmarksList;
      } else if (res?.bookmarked !== undefined) {
        const idxNow = post.bookmarksList.findIndex((item: any) => {
          const s = String(item).toLowerCase();
          return (
            s === String(currentUserId).toLowerCase() ||
            (userEmail && s === userEmail) ||
            (userId && s === String(userId).toLowerCase())
          );
        });
        if (res.bookmarked && idxNow === -1) {
          post.bookmarksList.push(currentUserId);
        } else if (!res.bookmarked && idxNow !== -1) {
          post.bookmarksList.splice(idxNow, 1);
        }
      }
    } catch (e) {
      console.error("Error toggling bookmark:", e);
      post.bookmarksList = originalBookmarks;
    }
  };

  const toggleJobBookmark = async (job: any) => {
    const authUser = authData.value?.user as any;
    const currentUserId = authUser?.id || candidateId;
    if (!currentUserId) return;
    if (!job.bookmarksList) job.bookmarksList = [];

    const jId = job.id || job.uniqueId;
    const idx = job.bookmarksList.indexOf(currentUserId);
    if (idx !== -1) {
      job.bookmarksList.splice(idx, 1);
      const bIdx = allBookmarkedJobs.value.findIndex(
        (j) => (j.id || j.uniqueId) === jId,
      );
      if (bIdx !== -1) allBookmarkedJobs.value.splice(bIdx, 1);
    } else {
      job.bookmarksList.push(currentUserId);
      if (
        !allBookmarkedJobs.value.some((j) => (j.id || j.uniqueId) === jId)
      ) {
        allBookmarkedJobs.value.unshift(job);
      }
    }

    try {
      await $fetch(`/api/jobs/${jId}/bookmark`, {
        method: "POST",
        body: { userUuid: currentUserId },
      });
    } catch (e) {
      console.error("Error toggling job bookmark:", e);
    }
  };

  const toggleJobLike = async (job: any) => {
    const authUser = authData.value?.user as any;
    const currentUserId = authUser?.id || candidateId;
    if (!currentUserId) return;
    if (!job.likesList) job.likesList = [];

    const jId = job.id || job.uniqueId;
    const idx = job.likesList.indexOf(currentUserId);
    if (idx !== -1) {
      job.likesList.splice(idx, 1);
    } else {
      job.likesList.push(currentUserId);
    }

    try {
      await $fetch(`/api/jobs/${jId}/like`, {
        method: "POST",
        body: { userUuid: currentUserId },
      });
    } catch (e) {
      console.error("Error toggling job like:", e);
    }
  };

  return {
    candidateId,
    loading,
    error,
    errorMessage,
    profile,
    defaultAvatar,
    locationText,
    skills,
    sectors,
    webLinks,
    documents,
    isOwner,
    fetchProfile,
    refreshProfile,
    selectedDocUrl,
    selectedDocTitle,
    showDocViewer,
    openDocViewer,
    activeTab,
    loadingPosts,
    userPosts,
    bookmarkedPosts,
    bookmarkedJobs,
    toggleLike,
    toggleBookmark,
    toggleJobLike,
    toggleJobBookmark,
    isBookmarked,
    sharePost,
    shareJob,
    authData,
  };
}
