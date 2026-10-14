import { useRoute, useRouter } from "#app";
import { useRuntimeConfig, useLazyAsyncData } from "#imports";
import { useAuth } from "#imports";
import { useShare } from "~/composables/useShare";
import type { Post, Job, CompanyProfile } from "~/types";

export const useCompanyProfile = () => {
  const route = useRoute();
  const router = useRouter();
  const config = useRuntimeConfig();
  const { data: authData } = useAuth();
  const { sharePost, shareJob } = useShare();

  const companyId = route.params.id as string;
  const isOwner = computed(() => authData.value?.user?.id === companyId);
  const currentUserId = computed(() => authData.value?.user?.id || "");

  // Fetch data
  const { data: profileData, pending: profilePending } = useLazyAsyncData(
    `company-profile-${companyId}`,
    () =>
      $fetch(`${config.public.apiUrl}/profile/${companyId}`)
        .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
        .catch(() => null),
  );

  const { data: vacanciesData, pending: vacanciesPending } = useLazyAsyncData(
    `company-vacancies-${companyId}`,
    () =>
      $fetch(`${config.public.apiUrl}/profile/${companyId}/vacancies`)
        .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
        .catch(() => ({ data: [] })),
  );

  const { data: postsData, pending: postsPending } = useLazyAsyncData(
    `company-posts-${companyId}`,
    () =>
      $fetch(`${config.public.apiUrl}/profile/${companyId}/posts`)
        .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
        .catch(() => ({ data: [] })),
  );

  const { data: bookmarksData, pending: bookmarksPending } = useLazyAsyncData(
    `company-bookmarks-${companyId}`,
    () =>
      $fetch(`${config.public.apiUrl}/profile/${companyId}/bookmarks`)
        .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
        .catch(() => ({ data: [] })),
  );

  const loading = computed(
    () => profilePending.value || vacanciesPending.value,
  );
  const loadingCompanyPosts = computed(
    () => postsPending.value || bookmarksPending.value,
  );

  // State
  const company = ref({
    id: companyId,
    name: "TechSolutions Inc.",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSzjpaT0Ede7QLy3zl1zft4f4V9csQyhGIsAyNHyyg4lmk54ha7yMkfDw5hbVoBOME8PTGFax9iKrHHZjAmqwMRA4i1UpqhgebzJGIkwq1DS6PKK1G5jxCNSxxPjHi_ezhM-ik2qaFtqa9JYp6ruPrCozHQM4UvsZpk2HUAg07aFTdAk58De2NTtSjHaO49ddhrtHPFA-trQm7WZbFMHwS-NZ7jyJ7ZrGaZD9yxWogET6EbwJ_H8Tk0g",
    verified: true,
    sector: "Desarrollo de Software y Tecnología",
    website: "https://techsolutions.com",
    websiteDisplay: "techsolutions.com",
    location: "Ciudad de México, CDMX",
    about:
      "Somos una organización líder en innovación tecnológica, dedicada a construir soluciones de software escalables que transforman industrias.",
    mision: "",
    vision: "",
    beneficios: "",
    documents: [] as any[],
    vacancies: [] as any[],
  });

  const webLinks = computed(() => {
    const result: Array<{ name: string; url: string; icon: string }> = [];
    const p = profileData.value as any;
    if (!p) return result;

    const linksArray = p.links;
    const linksObj = p.enlacesWeb;

    const getIcon = (name: string) => {
      const lower = name.toLowerCase();
      if (lower.includes("facebook")) return "thumb_up";
      if (lower.includes("twitter") || lower.includes("x.com")) return "tag";
      if (lower.includes("instagram")) return "photo_camera";
      if (lower.includes("linkedin")) return "work";
      return "link";
    };

    if (Array.isArray(linksArray) && linksArray.length > 0) {
      linksArray.forEach((item: any) => {
        const name = item.label || item.nombre || "Red Oficial";
        if (item.url)
          result.push({
            name,
            url: item.url,
            icon: getIcon(name + " " + item.url),
          });
      });
    } else if (linksObj && typeof linksObj === "object") {
      Object.entries(linksObj).forEach(([name, url]) => {
        if (url && name !== "website") {
          result.push({
            name,
            url: url as string,
            icon: getIcon(name + " " + url),
          });
        }
      });
    }
    return result;
  });

  watch(
    [profileData, vacanciesData],
    () => {
      if (profileData.value) {
        const p = profileData.value as any;
        company.value.name =
          p.nombre || p.nombreComercial || p.name || "Sin Nombre";
        company.value.logo =
          p.fotoPerfil ||
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDSzjpaT0Ede7QLy3zl1zft4f4V9csQyhGIsAyNHyyg4lmk54ha7yMkfDw5hbVoBOME8PTGFax9iKrHHZjAmqwMRA4i1UpqhgebzJGIkwq1DS6PKK1G5jxCNSxxPjHi_ezhM-ik2qaFtqa9JYp6ruPrCozHQM4UvsZpk2HUAg07aFTdAk58De2NTtSjHaO49ddhrtHPFA-trQm7WZbFMHwS-NZ7jyJ7ZrGaZD9yxWogET6EbwJ_H8Tk0g";
        company.value.sector = p.sector || "Sector no especificado";
        company.value.about =
          p.biografia || p.descripcion || "Sin descripción corporativa.";
        company.value.mision = p.mision || "";
        company.value.vision = p.vision || "";
        company.value.beneficios = p.beneficios || p.culturaLaboral || "";
        company.value.documents = Array.isArray(p.documentosCorporativos)
          ? p.documentosCorporativos
          : [];
        company.value.location =
          typeof p.ubicacion === "string"
            ? p.ubicacion
            : p.ubicacion?.name ||
              p.ubicacion?.city ||
              p.ubicacion?.pais ||
              "Ubicación no especificada";
        company.value.verified =
          p.organizacionVerificada !== undefined
            ? p.organizacionVerificada
            : false;
        company.value.website = p.enlacesWeb?.website || p.website || "";
        company.value.websiteDisplay =
          company.value.website
            .replace("https://", "")
            .replace("http://", "")
            .split("/")[0] || "Sitio web";

        const rawJobs = (vacanciesData.value?.data || []) as any[];
        company.value.vacancies = rawJobs.map((j: any) => ({
          id: j.id || j.uniqueId,
          title: j.title || j.titulo || "Vacante",
          type: j.type || j.modalidad || "Presencial",
          schedule: j.schedule || "Tiempo Completo",
          salary:
            typeof j.salario === "number"
              ? `$${(j.salario / 1000).toFixed(0)}k MXN`
              : j.salario || "No especificado",
        }));
      }
    },
    { immediate: true },
  );

  const companyTab = ref<"vacancies" | "posts" | "bookmarks">("vacancies");
  const allCompanyPosts = ref<any[]>([]);
  const allCompanyBookmarkedPosts = ref<any[]>([]);

  watch(
    postsData,
    (val: any) => {
      if (val?.data) {
        allCompanyPosts.value = val.data;
      }
    },
    { immediate: true },
  );

  watch(
    bookmarksData,
    (val: any) => {
      if (val?.data) {
        allCompanyBookmarkedPosts.value = val.data;
      }
    },
    { immediate: true },
  );

  const companyPosts = computed(() => allCompanyPosts.value);
  const companyBookmarkedPosts = computed(
    () => allCompanyBookmarkedPosts.value,
  );

  // UI State Modals
  const showReportCompanyModal = ref(false);
  const isPdfModalOpen = ref(false);
  const activePreviewUrl = ref("");
  const activePreviewName = ref("");

  const previewCompanyDoc = (doc: any) => {
    activePreviewUrl.value = doc.url;
    activePreviewName.value = doc.nombre || doc.tipo;
    isPdfModalOpen.value = true;
  };

  const toggleLike = async (postId: string) => {
    if (!currentUserId.value) return;
    try {
      const res = await $fetch<any>(`/api/posts/${postId}/like`, {
        method: "POST",
        body: { userId: currentUserId.value },
      });
      const targetPost = allCompanyPosts.value.find(
        (p) => p.uniqueId === postId,
      );
      const targetBookmark = allCompanyBookmarkedPosts.value.find(
        (p) => p.uniqueId === postId,
      );
      [targetPost, targetBookmark].forEach((target) => {
        if (target) {
          if (res?.likesList) {
            target.likesList = res.likesList;
          } else {
            if (!target.likesList) target.likesList = [];
            const idx = target.likesList.indexOf(currentUserId.value);
            if (idx !== -1) target.likesList.splice(idx, 1);
            else target.likesList.push(currentUserId.value);
          }
        }
      });
    } catch (e) {
      console.error("Error toggling like:", e);
    }
  };

  const toggleBookmark = async (postId: string) => {
    if (!currentUserId.value) return;
    try {
      const res = await $fetch<any>(`/api/posts/${postId}/bookmark`, {
        method: "POST",
        body: { userId: currentUserId.value },
      });
      const targetPost = allCompanyPosts.value.find(
        (p) => p.uniqueId === postId,
      );
      const targetBookmark = allCompanyBookmarkedPosts.value.find(
        (p) => p.uniqueId === postId,
      );
      [targetPost, targetBookmark].forEach((target) => {
        if (target) {
          if (res?.bookmarksList) {
            target.bookmarksList = res.bookmarksList;
          } else {
            if (!target.bookmarksList) target.bookmarksList = [];
            const idx = target.bookmarksList.indexOf(currentUserId.value);
            if (idx !== -1) target.bookmarksList.splice(idx, 1);
            else target.bookmarksList.push(currentUserId.value);
          }
        }
      });
    } catch (e) {
      console.error("Error toggling bookmark:", e);
    }
  };

  const toggleJobLike = async (job: any) => {
    if (!currentUserId.value) return;
    if (!job.likesList) job.likesList = [];
    if (!job.dislikesList) job.dislikesList = [];

    const idx = job.likesList.indexOf(currentUserId.value);
    if (idx !== -1) {
      job.likesList.splice(idx, 1);
    } else {
      job.likesList.push(currentUserId.value);
      const dislikeIdx = job.dislikesList.indexOf(currentUserId.value);
      if (dislikeIdx !== -1) job.dislikesList.splice(dislikeIdx, 1);
    }

    try {
      await $fetch(`/api/jobs/${job.id}/like`, {
        method: "POST",
        body: { userId: currentUserId.value },
      });
    } catch (e) {
      // Local optimistic state preserved
    }
  };

  const toggleJobBookmark = async (job: any) => {
    if (!currentUserId.value) return;
    if (!job.bookmarksList) job.bookmarksList = [];

    const idx = job.bookmarksList.indexOf(currentUserId.value);
    if (idx !== -1) {
      job.bookmarksList.splice(idx, 1);
    } else {
      job.bookmarksList.push(currentUserId.value);
    }

    try {
      await $fetch(`/api/jobs/${job.id}/bookmark`, {
        method: "POST",
        body: { userId: currentUserId.value },
      });
    } catch (e) {
      // Local optimistic state preserved
    }
  };

  return {
    companyId,
    company,
    webLinks,
    isOwner,
    loading,
    companyTab,
    loadingCompanyPosts,
    companyPosts,
    companyBookmarkedPosts,
    currentUserId,
    showReportCompanyModal,
    isPdfModalOpen,
    activePreviewUrl,
    activePreviewName,
    previewCompanyDoc,
    toggleLike,
    toggleBookmark,
    toggleJobLike,
    toggleJobBookmark,
    sharePost,
    shareJob,
  };
};
