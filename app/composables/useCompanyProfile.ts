import { useRoute, useRouter } from "#app";
import { useRuntimeConfig, useLazyAsyncData } from "#imports";
import { useAuth } from "#imports";
import { useShare } from "~/composables/useShare";
import type { Post, Job, CompanyProfile } from "~/types";

export type CompanyProfileTab =
  "ficha" | "vacancies" | "posts" | "verification" | "bookmarks";

export const useCompanyProfile = () => {
  const route = useRoute();
  const router = useRouter();
  const config = useRuntimeConfig();
  const { data: authData } = useAuth();
  const { sharePost, shareJob } = useShare();

  const companyId = route.params.id as string;

  // State
  const company = ref({
    id: companyId,
    companyId,
    name: "TechSolutions Inc.",
    nombre: "TechSolutions Inc.",
    nombreComercial: "TechSolutions Inc.",
    razonSocial: "TechSolutions S.A. de C.V.",
    rfc: "TSI210315AB1",
    telefono: "+52 55 4160 8900",
    email: "contacto@techsolutions.mx",
    tamanoEmpresa: "250 - 500 colaboradores",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSzjpaT0Ede7QLy3zl1zft4f4V9csQyhGIsAyNHyyg4lmk54ha7yMkfDw5hbVoBOME8PTGFax9iKrHHZjAmqwMRA4i1UpqhgebzJGIkwq1DS6PKK1G5jxCNSxxPjHi_ezhM-ik2qaFtqa9JYp6ruPrCozHQM4UvsZpk2HUAg07aFTdAk58De2NTtSjHaO49ddhrtHPFA-trQm7WZbFMHwS-NZ7jyJ7ZrGaZD9yxWogET6EbwJ_H8Tk0g",
    verified: true,
    organizacionVerificada: true,
    estatusVerificacion: "VERIFICADA",
    metodoVerificacion: "DOMINIO_CORPORATIVO",
    sector: "Desarrollo de Software y Cloud Computing",
    website: "https://techsolutions.com",
    websiteDisplay: "techsolutions.com",
    location: "Ciudad de México, CDMX",
    about:
      "Somos una organización líder en innovación tecnológica, dedicada a construir soluciones de software escalables que transforman industrias.",
    mision:
      "Impulsar la transformación digital empresarial a través de arquitecturas en la nube seguras, eficientes y de alto impacto.",
    vision:
      "Ser el referente tecnológico preferido en América Latina por nuestra excelencia técnica y compromiso con el talento humano.",
    beneficios:
      "• Seguro de Gastos Médicos Mayores\n• Esquema de trabajo flexible / remoto\n• Presupuesto anual para certificaciones cloud\n• Fondo de ahorro y vales de despensa",
    documents: [
      {
        id: "doc-iso",
        nombre: "Certificación ISO 27001 - Seguridad de la Información.pdf",
        tipo: "Seguridad y Calidad",
        url: "https://example.com/docs/iso-27001.pdf",
      },
      {
        id: "doc-sat",
        nombre: "Constancia de Situación Fiscal Acreditada.pdf",
        tipo: "Acreditación Fiscal",
        url: "https://example.com/docs/csf.pdf",
      },
    ] as any[],
    documentosVerificacion: [
      {
        nombre: "Constancia de Situación Fiscal (SAT).pdf",
        url: "https://example.com/docs/csf-verificacion.pdf",
        tipo: "Validación Fiscal",
        fecha: "2026-03-15",
      },
      {
        nombre: "Acta Constitutiva Notariada.pdf",
        url: "https://example.com/docs/acta-constitutiva.pdf",
        tipo: "Acreditación Legal",
        fecha: "2026-03-10",
      },
    ] as any[],
    vacancies: [] as any[],
    suspensionStatus: "",
    estatus: "",
    estadoCuenta: "",
  });

  const isOwner = computed(() => {
    const user = authData.value?.user as any;
    if (!user) return false;
    const uid = user.id ? String(user.id).toLowerCase() : "";
    const uemail = user.email ? String(user.email).toLowerCase() : "";
    const cidLower = String(companyId || "").toLowerCase();
    const compId = company.value.id
      ? String(company.value.id).toLowerCase()
      : "";
    const compEmail = company.value.email
      ? String(company.value.email).toLowerCase()
      : "";
    const compUuid = (company.value as any)?.usuarioUuid
      ? String((company.value as any).usuarioUuid).toLowerCase()
      : "";

    return (
      (uid && uid === cidLower) ||
      (uemail && uemail === cidLower) ||
      (compId && uid === compId) ||
      (compUuid && uid === compUuid) ||
      (compEmail && uemail === compEmail)
    );
  });
  const currentUserId = computed(() => authData.value?.user?.id || "");
  const effectiveBookmarkUserId = computed(() => {
    const user = authData.value?.user as any;
    return (
      user?.id ||
      (company.value as any)?.usuarioUuid ||
      company.value.id ||
      companyId
    );
  });

  // Fetch data
  const {
    data: profileData,
    pending: profilePending,
    refresh: refreshProfile,
  } = useLazyAsyncData(`company-profile-${companyId}`, () =>
    $fetch(`${config.public.apiUrl}/profile/${companyId}`)
      .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
      .catch(() => null),
  );

  const {
    data: vacanciesData,
    pending: vacanciesPending,
    refresh: refreshVacancies,
  } = useLazyAsyncData(`company-vacancies-${companyId}`, () =>
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

  const {
    data: bookmarksData,
    pending: bookmarksPending,
    refresh: refreshBookmarks,
  } = useLazyAsyncData(
    `company-bookmarks-${companyId}`,
    () => {
      // Directiva de privacidad: los elementos guardados son estrictamente privados del propietario
      if (!isOwner.value || !currentUserId.value)
        return Promise.resolve({ data: [] });
      const targetId = effectiveBookmarkUserId.value;
      const uid = currentUserId.value;
      return $fetch(
        `/api/profile/${encodeURIComponent(targetId)}/bookmarks?userId=${encodeURIComponent(uid)}`,
        {
          headers: uid ? { "x-user-id": uid } : {},
        },
      )
        .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
        .catch(() => ({ data: [] }));
    },
    { watch: [isOwner, effectiveBookmarkUserId] },
  );

  watch([isOwner, currentUserId], ([owner, uid]) => {
    if (owner && uid) {
      refreshBookmarks();
    }
  });

  const loading = computed(
    () => profilePending.value || vacanciesPending.value,
  );
  const loadingCompanyPosts = computed(
    () => postsPending.value || bookmarksPending.value,
  );

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
        company.value.id = companyId;
        company.value.companyId = companyId;
        company.value.name =
          p.nombre || p.nombreComercial || p.name || "Sin Nombre";
        company.value.nombre = company.value.name;
        company.value.nombreComercial =
          p.nombreComercial ||
          p.nombre ||
          p.name ||
          company.value.nombreComercial;
        company.value.razonSocial =
          p.razonSocial || company.value.razonSocial || company.value.name;
        company.value.rfc = p.rfc || company.value.rfc || "No registrado";
        company.value.telefono =
          p.telefono || company.value.telefono || "No especificado";
        company.value.email =
          p.email || p.correoContacto || company.value.email || "";
        company.value.tamanoEmpresa =
          p.tamanoEmpresa ||
          company.value.tamanoEmpresa ||
          "50 - 200 colaboradores";
        company.value.suspensionStatus = p.suspensionStatus || "";
        company.value.estatus = p.estatus || "";
        company.value.estadoCuenta = p.estadoCuenta || "";
        company.value.logo = p.fotoPerfil || p.logo || company.value.logo;
        company.value.sector =
          p.sector || company.value.sector || "Sector no especificado";
        company.value.about =
          p.biografia ||
          p.descripcion ||
          company.value.about ||
          "Sin descripción corporativa.";
        company.value.mision = p.mision || company.value.mision || "";
        company.value.vision = p.vision || company.value.vision || "";
        company.value.beneficios =
          p.beneficios || p.culturaLaboral || company.value.beneficios || "";
        company.value.documents =
          Array.isArray(p.documentosCorporativos) &&
          p.documentosCorporativos.length > 0
            ? p.documentosCorporativos
            : company.value.documents;
        company.value.documentosVerificacion =
          Array.isArray(p.documentosVerificacion) &&
          p.documentosVerificacion.length > 0
            ? p.documentosVerificacion
            : company.value.documentosVerificacion;
        company.value.location =
          typeof p.ubicacion === "string"
            ? p.ubicacion
            : p.ubicacion?.name ||
              p.ubicacion?.city ||
              p.ubicacion?.pais ||
              company.value.location;
        company.value.verified =
          p.organizacionVerificada !== undefined
            ? Boolean(p.organizacionVerificada)
            : company.value.verified;
        company.value.organizacionVerificada = company.value.verified;
        company.value.estatusVerificacion =
          p.estatusVerificacion ||
          (company.value.verified ? "VERIFICADA" : "PENDIENTE");
        company.value.metodoVerificacion =
          p.metodoVerificacion ||
          (p.rfc ? "VALIDACION_SAT" : "DOMINIO_CORPORATIVO");
        company.value.website =
          p.enlacesWeb?.website || p.website || company.value.website;
        company.value.websiteDisplay =
          company.value.website
            .replace("https://", "")
            .replace("http://", "")
            .split("/")[0] || "Sitio web";

        const rawJobs = (vacanciesData.value?.data || []) as any[];
        company.value.vacancies = rawJobs.map((j: any) => ({
          ...j,
          id: j.id || j.uniqueId,
          uniqueId: j.uniqueId || j.id,
          title: j.title || j.titulo || "Vacante",
          modalidad: j.modalidad || j.type || "Presencial",
          type: j.type || j.modalidad || "Presencial",
          schedule: j.schedule || "Tiempo Completo",
          salario: j.salario,
          salary: j.salary || j.salario,
          salarioFormatted:
            typeof j.salario === "number"
              ? `$${(j.salario / 1000).toFixed(0)}k MXN`
              : j.salario || "No especificado",
          company: j.company || j.empresaNombre || company.value.name,
          empresaNombre: j.empresaNombre || j.company || company.value.name,
          companyLogo: j.companyLogo || j.empresaLogo || company.value.avatar,
          empresaLogo: j.empresaLogo || j.companyLogo || company.value.avatar,
          empresaUuid: j.empresaUuid || companyId,
          companyId: j.companyId || j.empresaUuid || companyId,
          descripcion: j.descripcion || j.description || "",
          description: j.description || j.descripcion || "",
          location:
            typeof j.ubicacion === "string"
              ? j.ubicacion
              : j.ubicacion?.name ||
                j.ubicacion?.city ||
                j.location ||
                company.value.location,
          sector: j.sector || company.value.sector,
          createdAt: j.createdAt,
          tags: j.tags || j.skills || [],
          skills: j.skills || j.tags || [],
          vacantesDisponibles: j.vacantesDisponibles || 1,
          likesCount:
            typeof j.likesCount === "number"
              ? j.likesCount
              : Array.isArray(j.likesList)
                ? j.likesList.length
                : 0,
          likesList: Array.isArray(j.likesList) ? j.likesList : [],
          isLiked:
            j.isLiked !== undefined
              ? Boolean(j.isLiked)
              : Array.isArray(j.likesList) && currentUserId.value
                ? j.likesList.includes(currentUserId.value)
                : false,
          bookmarksCount:
            typeof j.bookmarksCount === "number"
              ? j.bookmarksCount
              : Array.isArray(j.bookmarksList)
                ? j.bookmarksList.length
                : 0,
          bookmarksList: Array.isArray(j.bookmarksList) ? j.bookmarksList : [],
          isBookmarked:
            j.isBookmarked !== undefined
              ? Boolean(j.isBookmarked)
              : Array.isArray(j.bookmarksList) && currentUserId.value
                ? j.bookmarksList.includes(currentUserId.value)
                : false,
          commentsCount:
            typeof j.commentsCount === "number" ? j.commentsCount : 0,
          sharesCount: typeof j.sharesCount === "number" ? j.sharesCount : 0,
        }));
      }
    },
    { immediate: true },
  );

  const companyTab = ref<CompanyProfileTab>("vacancies");
  const allCompanyPosts = ref<any[]>([]);
  const allCompanyBookmarkedPosts = ref<any[]>([]);
  const allCompanyBookmarkedJobs = ref<any[]>([]);

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
      if (val) {
        if (Array.isArray(val.posts) && val.posts.length > 0) {
          allCompanyBookmarkedPosts.value = val.posts;
        } else if (Array.isArray(val.data)) {
          allCompanyBookmarkedPosts.value = val.data.filter(
            (i: any) =>
              (i.PK && i.PK.startsWith("POST#")) ||
              i.uniqueId ||
              (i.content && !i.modalidad),
          );
        } else {
          allCompanyBookmarkedPosts.value = [];
        }

        if (Array.isArray(val.jobs) && val.jobs.length > 0) {
          allCompanyBookmarkedJobs.value = val.jobs;
        } else if (Array.isArray(val.data)) {
          allCompanyBookmarkedJobs.value = val.data.filter(
            (i: any) =>
              (i.PK && i.PK.startsWith("VACANCY#")) ||
              i.empresaUuid !== undefined ||
              i.modalidad !== undefined ||
              i.salario !== undefined ||
              i.title !== undefined,
          );
        } else {
          allCompanyBookmarkedJobs.value = [];
        }
      }
    },
    { immediate: true },
  );

  const companyPosts = computed(() => allCompanyPosts.value);
  const companyBookmarkedPosts = computed(
    () => allCompanyBookmarkedPosts.value,
  );
  const companyBookmarkedJobs = computed(() => allCompanyBookmarkedJobs.value);

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

  const toggleLike = async (itemOrId: any) => {
    if (!currentUserId.value) return;

    const postId =
      typeof itemOrId === "string"
        ? itemOrId
        : itemOrId?.uniqueId || itemOrId?.id;
    if (!postId) return;

    const targetPost = allCompanyPosts.value.find(
      (p) => (p.uniqueId || p.id) === postId,
    );
    const targetBookmark = allCompanyBookmarkedPosts.value.find(
      (p) => (p.uniqueId || p.id) === postId,
    );
    const targets = [
      targetPost,
      targetBookmark,
      typeof itemOrId === "object" ? itemOrId : null,
    ].filter(Boolean);

    targets.forEach((target) => {
      if (target) {
        if (!target.likesList) target.likesList = [];
        const idx = target.likesList.indexOf(currentUserId.value);
        if (idx !== -1) {
          target.likesList.splice(idx, 1);
          if (typeof target.likesCount === "number") {
            target.likesCount = Math.max(0, target.likesCount - 1);
          }
          target.isLiked = false;
        } else {
          target.likesList.push(currentUserId.value);
          if (typeof target.likesCount === "number") {
            target.likesCount = target.likesCount + 1;
          } else {
            target.likesCount = target.likesList.length;
          }
          target.isLiked = true;
        }
        target.likes = target.likesList.length;
      }
    });

    try {
      const res = await $fetch<any>(`/api/posts/${postId}/like`, {
        method: "POST",
        body: { userUuid: currentUserId.value, userId: currentUserId.value },
      });
      targets.forEach((target) => {
        if (target && res?.likesList) {
          target.likesList = res.likesList;
          target.likes = target.likesList.length;
        }
      });
    } catch (e) {
      console.error("Error toggling like:", e);
    }
  };

  const toggleBookmark = async (itemOrId: any) => {
    if (!currentUserId.value) return;

    const postId =
      typeof itemOrId === "string"
        ? itemOrId
        : itemOrId?.uniqueId || itemOrId?.id;
    if (!postId) return;

    const targetPost = allCompanyPosts.value.find(
      (p) => (p.uniqueId || p.id) === postId,
    );
    const targetBookmark = allCompanyBookmarkedPosts.value.find(
      (p) => (p.uniqueId || p.id) === postId,
    );
    const targets = [
      targetPost,
      targetBookmark,
      typeof itemOrId === "object" ? itemOrId : null,
    ].filter(Boolean);

    targets.forEach((target) => {
      if (target) {
        if (!target.bookmarksList) target.bookmarksList = [];
        const idx = target.bookmarksList.indexOf(currentUserId.value);
        if (idx !== -1) {
          target.bookmarksList.splice(idx, 1);
          if (typeof target.bookmarksCount === "number") {
            target.bookmarksCount = Math.max(0, target.bookmarksCount - 1);
          }
          target.isBookmarked = false;
        } else {
          target.bookmarksList.push(currentUserId.value);
          if (typeof target.bookmarksCount === "number") {
            target.bookmarksCount = target.bookmarksCount + 1;
          } else {
            target.bookmarksCount = target.bookmarksList.length;
          }
          target.isBookmarked = true;
        }
      }
    });

    try {
      const res = await $fetch<any>(`/api/posts/${postId}/bookmark`, {
        method: "POST",
        body: { userUuid: currentUserId.value, userId: currentUserId.value },
      });
      targets.forEach((target) => {
        if (target && res?.bookmarksList) {
          target.bookmarksList = res.bookmarksList;
        }
      });
    } catch (e) {
      console.error("Error toggling bookmark:", e);
    }
  };

  const toggleJobLike = async (itemOrJob: any) => {
    if (!currentUserId.value) return;
    const uid = currentUserId.value;

    const jobId =
      typeof itemOrJob === "string"
        ? itemOrJob
        : itemOrJob?.id || itemOrJob?.uniqueId;

    const job =
      typeof itemOrJob === "object"
        ? itemOrJob
        : (company.value.vacancies || []).find(
            (j: any) => (j.id || j.uniqueId) === jobId,
          ) ||
          allCompanyBookmarkedJobs.value.find(
            (j: any) => (j.id || j.uniqueId) === jobId,
          );

    if (!job) return;

    if (!job.likesList) job.likesList = [];
    const wasLiked = Boolean(
      job.isLiked ||
      (Array.isArray(job.likesList) && job.likesList.includes(uid)),
    );

    if (wasLiked) {
      job.isLiked = false;
      job.likesList = job.likesList.filter((id: string) => id !== uid);
      job.likesCount = Math.max(
        0,
        (typeof job.likesCount === "number"
          ? job.likesCount
          : job.likesList.length + 1) - 1,
      );
    } else {
      job.isLiked = true;
      if (!job.likesList.includes(uid)) job.likesList.push(uid);
      job.likesCount =
        (typeof job.likesCount === "number"
          ? job.likesCount
          : job.likesList.length - 1) + 1;
    }
    job.likes = job.likesCount;

    try {
      await $fetch(`/api/jobs/${jobId}/like`, {
        method: "POST",
        body: { userUuid: uid, userId: uid },
      });
    } catch (e) {
      // Revert on error
      job.isLiked = wasLiked;
      if (wasLiked) {
        if (!job.likesList.includes(uid)) job.likesList.push(uid);
        job.likesCount = job.likesCount + 1;
      } else {
        job.likesList = job.likesList.filter((id: string) => id !== uid);
        job.likesCount = Math.max(0, job.likesCount - 1);
      }
      job.likes = job.likesCount;
    }
  };

  const toggleJobBookmark = async (itemOrJob: any) => {
    if (!currentUserId.value) return;
    const uid = currentUserId.value;

    const jobId =
      typeof itemOrJob === "string"
        ? itemOrJob
        : itemOrJob?.id || itemOrJob?.uniqueId;

    const job =
      typeof itemOrJob === "object"
        ? itemOrJob
        : (company.value.vacancies || []).find(
            (j: any) => (j.id || j.uniqueId) === jobId,
          ) ||
          allCompanyBookmarkedJobs.value.find(
            (j: any) => (j.id || j.uniqueId) === jobId,
          );

    if (!job) return;

    if (!job.bookmarksList) job.bookmarksList = [];
    const wasBookmarked = Boolean(
      job.isBookmarked ||
      (Array.isArray(job.bookmarksList) && job.bookmarksList.includes(uid)),
    );

    if (wasBookmarked) {
      job.isBookmarked = false;
      job.bookmarksList = job.bookmarksList.filter((id: string) => id !== uid);
      job.bookmarksCount = Math.max(
        0,
        (typeof job.bookmarksCount === "number"
          ? job.bookmarksCount
          : job.bookmarksList.length + 1) - 1,
      );
    } else {
      job.isBookmarked = true;
      if (!job.bookmarksList.includes(uid)) job.bookmarksList.push(uid);
      job.bookmarksCount =
        (typeof job.bookmarksCount === "number"
          ? job.bookmarksCount
          : job.bookmarksList.length - 1) + 1;
    }

    try {
      await $fetch(`/api/jobs/${jobId}/bookmark`, {
        method: "POST",
        body: { userUuid: uid, userId: uid },
      });
    } catch (e) {
      // Revert on error
      job.isBookmarked = wasBookmarked;
      if (wasBookmarked) {
        if (!job.bookmarksList.includes(uid)) job.bookmarksList.push(uid);
        job.bookmarksCount = job.bookmarksCount + 1;
      } else {
        job.bookmarksList = job.bookmarksList.filter(
          (id: string) => id !== uid,
        );
        job.bookmarksCount = Math.max(0, job.bookmarksCount - 1);
      }
    }
  };

  const refresh = async () => {
    await Promise.all([
      refreshProfile(),
      refreshVacancies(),
      refreshBookmarks(),
    ]);
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
    companyBookmarkedJobs,
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
    refresh,
  };
};
