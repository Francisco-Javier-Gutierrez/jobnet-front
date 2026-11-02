import { ref, computed } from "vue";
import type {
  CommunityCvTemplate,
  RoleCategory,
  ExperienceLevel,
  LanguageCode,
  ScopeCode,
} from "~/types/cvCommunity";
import { resolveTemplateContent } from "~/types/cvCommunity";
import { CV_COMMUNITY_SEED } from "~/utils/cvCommunitySeed";
import { useAppFeedback } from "~/composables/useAppFeedback";

// Shared reactive state across components
const communityTemplates = ref<CommunityCvTemplate[]>([...CV_COMMUNITY_SEED]);
const isLoading = ref(false);
const error = ref<string | null>(null);

export function useCommunityCvTemplates() {
  const config = useRuntimeConfig();
  const { data: session } = useAuth();
  const { showSuccess, showError, showInfo } = useAppFeedback();

  // Filters
  const searchQuery = ref("");
  const selectedLanguage = ref<"all" | LanguageCode>("all");
  const selectedCategory = ref<"all" | RoleCategory>("all");
  const selectedLevel = ref<"all" | ExperienceLevel>("all");
  const selectedScope = ref<"all" | ScopeCode>("all");

  const currentUserId = computed(() => session.value?.user?.id || "");

  // Fetch community templates from backend API and merge with Seed
  const fetchTemplates = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{ templates: CommunityCvTemplate[] }>(
        `${config.public.apiUrl}/cv-templates`,
        {
          headers: {
            "x-user-id": currentUserId.value || "anonymous",
            "x-user-role": "CANDIDATO",
          },
        },
      );

      if (response?.templates && Array.isArray(response.templates)) {
        // Merge API templates with Seed (avoiding duplicates)
        const apiIds = new Set(
          response.templates.map((t) => t.id || t.templateId),
        );
        const combined = [
          ...response.templates.map((t) => ({
            ...t,
            id: t.templateId || t.id,
          })),
          ...CV_COMMUNITY_SEED.filter((s) => !apiIds.has(s.id)),
        ];
        communityTemplates.value = combined;
      }
    } catch (err: any) {
      console.warn(
        "Could not fetch remote CV templates, using seed catalog:",
        err,
      );
      // Fallback to seed is already initialized
    } finally {
      isLoading.value = false;
    }
  };

  // Filtered templates computed
  const filteredTemplates = computed(() => {
    return communityTemplates.value.filter((tpl) => {
      // 1. Language filter
      if (selectedLanguage.value !== "all") {
        if (
          selectedLanguage.value === "es" &&
          tpl.idioma !== "es" &&
          tpl.idioma !== "bilingual"
        ) {
          return false;
        }
        if (
          selectedLanguage.value === "en" &&
          tpl.idioma !== "en" &&
          tpl.idioma !== "bilingual"
        ) {
          return false;
        }
        if (
          selectedLanguage.value === "bilingual" &&
          tpl.idioma !== "bilingual"
        ) {
          return false;
        }
      }

      // 2. Category filter
      if (
        selectedCategory.value !== "all" &&
        tpl.categoria !== selectedCategory.value
      ) {
        return false;
      }

      // 3. Level filter
      if (selectedLevel.value !== "all" && tpl.nivel !== selectedLevel.value) {
        return false;
      }

      // 4. Scope filter
      if (
        selectedScope.value !== "all" &&
        tpl.alcance !== selectedScope.value
      ) {
        return false;
      }

      // 5. Search query (title, role, tags, skills)
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim();
        const inTitle = (tpl.titulo || "").toLowerCase().includes(query);
        const inRole = (tpl.rol || "").toLowerCase().includes(query);
        const inSkills = (tpl.habilidades || []).some((s) =>
          s.toLowerCase().includes(query),
        );
        const inBio = (tpl.biografiaSugerida || "")
          .toLowerCase()
          .includes(query);
        if (!inTitle && !inRole && !inSkills && !inBio) {
          return false;
        }
      }

      return true;
    });
  });

  // User's own contributed templates
  const userContributedTemplates = computed(() => {
    if (!currentUserId.value) return [];
    return communityTemplates.value.filter(
      (t) => t.autorId === currentUserId.value,
    );
  });

  // Create & Publish a new community template
  const createCommunityTemplate = async (
    templateInput: Partial<CommunityCvTemplate>,
  ) => {
    if (!currentUserId.value) {
      showError(
        "Inicia Sesión",
        "Debes estar autenticado para contribuir una plantilla.",
      );
      return null;
    }

    try {
      const created = await $fetch<CommunityCvTemplate>(
        `${config.public.apiUrl}/cv-templates`,
        {
          method: "POST",
          headers: {
            "x-user-id": currentUserId.value,
            "x-user-role": "CANDIDATO",
          },
          body: {
            titulo: templateInput.titulo,
            rol: templateInput.rol,
            categoria: templateInput.categoria,
            nivel: templateInput.nivel,
            idioma: templateInput.idioma,
            alcance: templateInput.alcance,
            autorNombre: session.value?.user?.name || "Candidato de JobNet",
            habilidades: templateInput.habilidades,
            biografiaSugerida: templateInput.biografiaSugerida,
            experienciaSugerida: templateInput.experienciaSugerida,
            educacionSugerida: templateInput.educacionSugerida,
          },
        },
      );

      const normalized = {
        ...created,
        id: created.templateId || created.id || `tpl-${Date.now()}`,
      };

      communityTemplates.value.unshift(normalized);
      showSuccess(
        "¡Plantilla Publicada!",
        "Tu plantilla ha sido compartida con éxito en la comunidad de JobNet.",
        4000,
      );
      return normalized;
    } catch (err: any) {
      console.error("Error creating community template:", err);
      showError(
        "Error al Publicar",
        err?.data?.error ||
          err?.message ||
          "No se pudo publicar la plantilla en la comunidad.",
      );
      return null;
    }
  };

  // Delete template
  const deleteCommunityTemplate = async (templateId: string) => {
    if (!currentUserId.value) return false;

    try {
      await $fetch(`${config.public.apiUrl}/cv-templates/${templateId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": currentUserId.value,
          "x-user-role": "CANDIDATO",
        },
      });

      communityTemplates.value = communityTemplates.value.filter(
        (t) => t.id !== templateId && t.templateId !== templateId,
      );
      showSuccess(
        "Plantilla Retirada",
        "La plantilla ha sido eliminada de la comunidad.",
      );
      return true;
    } catch (err: any) {
      console.error("Error deleting template:", err);
      showError(
        "Error al Eliminar",
        "No se pudo eliminar la plantilla seleccionada.",
      );
      return false;
    }
  };

  // Record template usage
  const recordTemplateUse = async (templateId: string) => {
    // Optimistic local update
    const target = communityTemplates.value.find(
      (t) => t.id === templateId || t.templateId === templateId,
    );
    if (target) {
      target.stats.usesCount = (target.stats.usesCount || 0) + 1;
    }

    try {
      await $fetch(`${config.public.apiUrl}/cv-templates/${templateId}/use`, {
        method: "POST",
      });
    } catch (e) {
      // Non-blocking telemetry error
      console.warn("Could not register template use increment:", e);
    }
  };

  // Apply template directly to candidate profile
  const applyTemplateToCandidateProfile = async (
    template: CommunityCvTemplate,
    profileUserId: string,
    lang: "es" | "en" = "es",
  ) => {
    if (!profileUserId) {
      showError("Error", "Identificador de usuario no válido.");
      return false;
    }

    const localized = resolveTemplateContent(template, lang);

    try {
      await $fetch(`${config.public.apiUrl}/profile/${profileUserId}`, {
        method: "POST",
        headers: {
          "x-user-id": profileUserId,
          "x-user-role": "CANDIDATO",
        },
        body: {
          tituloProfesional: localized.rol || localized.titulo,
          biografia: localized.biografiaSugerida,
          habilidades: localized.habilidades,
          idiomas:
            lang === "en" || template.idioma === "en"
              ? ["Inglés Avanzado / Fluido C1", "Español Nativo"]
              : template.idioma === "bilingual"
                ? ["Español Nativo", "Inglés Fluido (C1)"]
                : ["Español Nativo"],
        },
      });

      // Record use
      recordTemplateUse(template.id || template.templateId || "");

      const langLabel = lang === "en" ? "en Inglés" : "en Español";
      showSuccess(
        "¡Perfil Actualizado!",
        `Se han aplicado el título, la biografía y las habilidades (${langLabel}) de la plantilla "${localized.titulo}" a tu perfil de JobNet.`,
        4500,
      );
      return true;
    } catch (err: any) {
      console.error("Error applying template to profile:", err);
      showError(
        "Error al Aplicar",
        err?.message ||
          "No se pudo actualizar tu perfil con los datos de la plantilla.",
      );
      return false;
    }
  };

  return {
    communityTemplates,
    filteredTemplates,
    userContributedTemplates,
    isLoading,
    error,
    searchQuery,
    selectedLanguage,
    selectedCategory,
    selectedLevel,
    selectedScope,
    fetchTemplates,
    createCommunityTemplate,
    deleteCommunityTemplate,
    recordTemplateUse,
    applyTemplateToCandidateProfile,
  };
}
