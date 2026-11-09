import { useRuntimeConfig, useLazyAsyncData } from "#imports";
import type { AdminOrganization } from "~/types";

export function useAdminOrganizations() {
  const config = useRuntimeConfig();

  const searchInput = ref("");
  const searchQuery = ref("");
  const filterVerification = ref<"ALL" | "VERIFIED" | "NOT_VERIFIED">("ALL");
  const filterAccountStatus = ref<"ALL" | "ACTIVO" | "REVISION" | "SUSPENDIDA">(
    "ALL",
  );
  const filterDateStart = ref("");
  const filterDateEnd = ref("");
  const currentPage = ref(1);
  const itemsPerPage = 20;

  const {
    data: rawProfiles,
    pending: profilesPending,
    refresh,
  } = useLazyAsyncData("admin-profiles-list", () => {
    const url = searchQuery.value
      ? `/api/profiles?tipoUsuario=ORGANIZACION&q=${encodeURIComponent(searchQuery.value)}`
      : "/api/profiles?tipoUsuario=ORGANIZACION";
    return $fetch<any[]>(url)
      .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
      .catch(() => []);
  });

  const loading = computed(() => profilesPending.value);

  const orgs = computed<AdminOrganization[]>(() => {
    const list =
      rawProfiles.value && rawProfiles.value.length > 0
        ? rawProfiles.value
        : [];

    return list
      .filter(
        (p: any) =>
          p.tipoUsuario === "ORGANIZACION" ||
          p.tipoUsuario === "EMPRESA" ||
          !p.tipoUsuario,
      )
      .map((p: any) => {
        const companyId =
          p.id || p.companyId || (p.PK ? p.PK.replace("USER#", "") : "");
        return {
          ...p,
          id: companyId,
          companyId,
          nombre: p.nombreComercial || p.nombre || p.name || "Organización",
        };
      });
  });

  const getOrgStatusKey = (
    org: AdminOrganization | null,
  ): "ACTIVO" | "REVISION" | "SUSPENDIDA" => {
    if (!org) return "ACTIVO";
    const statusStr = [org.suspensionStatus, org.estatus, org.estadoCuenta]
      .filter(Boolean)
      .join(" ")
      .toUpperCase();

    if (
      statusStr.includes("REVISI") ||
      statusStr.includes("REVISION") ||
      statusStr.includes("IN_REVIEW")
    ) {
      return "REVISION";
    }
    if (statusStr.includes("SUSPEND") || statusStr.includes("BLOQUEAD")) {
      return "SUSPENDIDA";
    }
    return "ACTIVO";
  };

  const verifiedCount = computed(
    () => orgs.value.filter((o: any) => o.organizacionVerificada).length,
  );
  const inReviewCount = computed(
    () =>
      orgs.value.filter((o: any) => getOrgStatusKey(o) === "REVISION").length,
  );
  const suspendedCount = computed(
    () =>
      orgs.value.filter((o: any) => getOrgStatusKey(o) === "SUSPENDIDA").length,
  );

  const executeServerSearch = () => {
    searchQuery.value = searchInput.value.trim();
    currentPage.value = 1;
    refresh();
  };

  const clearSearchInput = () => {
    searchInput.value = "";
    searchQuery.value = "";
    currentPage.value = 1;
    refresh();
  };

  const clearFilters = () => {
    searchQuery.value = "";
    searchInput.value = "";
    filterVerification.value = "ALL";
    filterAccountStatus.value = "ALL";
    filterDateStart.value = "";
    filterDateEnd.value = "";
  };

  const filteredOrgs = computed(() => {
    let list = [...orgs.value];
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      list = list.filter(
        (o: any) =>
          (o.nombre || "").toLowerCase().includes(q) ||
          (o.taxId || "").toLowerCase().includes(q) ||
          (o.email || "").toLowerCase().includes(q),
      );
    }
    if (filterVerification.value === "VERIFIED") {
      list = list.filter((o: any) => o.organizacionVerificada);
    } else if (filterVerification.value === "NOT_VERIFIED") {
      list = list.filter((o: any) => !o.organizacionVerificada);
    }
    if (filterAccountStatus.value !== "ALL") {
      list = list.filter(
        (o: any) => getOrgStatusKey(o) === filterAccountStatus.value,
      );
    }
    if (filterDateStart.value) {
      const start = new Date(filterDateStart.value).getTime();
      list = list.filter(
        (o: any) =>
          o.fechaCreacion && new Date(o.fechaCreacion).getTime() >= start,
      );
    }
    if (filterDateEnd.value) {
      const end = new Date(filterDateEnd.value).getTime();
      list = list.filter(
        (o: any) =>
          o.fechaCreacion && new Date(o.fechaCreacion).getTime() <= end,
      );
    }
    return list;
  });

  const totalPages = computed(() =>
    Math.ceil(filteredOrgs.value.length / itemsPerPage),
  );
  const paginatedOrgs = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredOrgs.value.slice(start, start + itemsPerPage);
  });

  return {
    searchInput,
    searchQuery,
    filterVerification,
    filterAccountStatus,
    filterDateStart,
    filterDateEnd,
    currentPage,
    itemsPerPage,
    loading,
    orgs,
    verifiedCount,
    inReviewCount,
    suspendedCount,
    filteredOrgs,
    totalPages,
    paginatedOrgs,
    refresh,
    executeServerSearch,
    clearSearchInput,
    clearFilters,
    getOrgStatusKey,
  };
}
