import { defineEventHandler, getHeader, getQuery } from "h3";
import { MOCK_COMPANIES, MOCK_CANDIDATE_DEMO } from "../utils/mockData";

export default defineEventHandler(async (event) => {
  const cookie = getHeader(event, "cookie") || "";
  const query = getQuery(event);
  const isMock = cookie.includes("jobnet-mock-enabled=true") || query.mock === "true";

  if (!isMock) {
    const config = useRuntimeConfig();
    try {
      const data = await $fetch<any[]>(`${config.public.apiUrl}/profiles`, {
        query,
      });
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (error: any) {
      // Fall through to mock data
    }
  }

  // Fallback to MOCK_COMPANIES
  if (query.tipoUsuario === "ORGANIZACION" || query.tipoUsuario === "EMPRESA") {
    let list = [...MOCK_COMPANIES];
    if (query.q) {
      const q = String(query.q).toLowerCase();
      list = list.filter(
        (c) =>
          c.nombre?.toLowerCase().includes(q) ||
          c.nombreComercial?.toLowerCase().includes(q) ||
          c.sector?.toLowerCase().includes(q)
      );
    }
    return list;
  }

  return [...MOCK_COMPANIES, MOCK_CANDIDATE_DEMO];
});
