import { defineEventHandler, getQuery } from "h3";
import { MOCK_VACANCIES } from "../utils/mockData";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  try {
    const data = await $fetch<any>(`${config.public.apiUrl}/jobs`, {
      query,
    });
    if (Array.isArray(data) && data.length > 0) return data;
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) return data;
  } catch (error: any) {
    // Fall through to mock data
  }

  // Fallback to rich MOCK_VACANCIES
  let results = [...MOCK_VACANCIES];
  if (query.q) {
    const qStr = String(query.q).toLowerCase();
    results = results.filter(
      (j) =>
        j.title?.toLowerCase().includes(qStr) ||
        j.company?.toLowerCase().includes(qStr) ||
        j.habilidadesRequeridas?.some((s) => s.toLowerCase().includes(qStr))
    );
  }
  if (query.modalidad) {
    results = results.filter(
      (j) => j.modalidad?.toLowerCase() === String(query.modalidad).toLowerCase()
    );
  }
  return results;
});
