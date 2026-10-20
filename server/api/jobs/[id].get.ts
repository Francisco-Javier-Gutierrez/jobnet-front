import { defineEventHandler } from "h3";
import { MOCK_VACANCIES } from "../../utils/mockData";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = event.context.params?.id;

  try {
    const data = await $fetch<any>(`${config.public.apiUrl}/jobs/${id}`);
    if (data && (data.id || data.uniqueId || data.title)) {
      return data;
    }
  } catch (error: any) {
    // Fall through to mock data
  }

  // Fallback to MOCK_VACANCIES
  const found = MOCK_VACANCIES.find((j) => j.id === id || j.uniqueId === id);
  if (found) {
    return found;
  }

  // Return the first one as default demo if not matched
  return MOCK_VACANCIES[0];
});
