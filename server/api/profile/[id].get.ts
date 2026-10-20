import { defineEventHandler } from "h3";
import { MOCK_CANDIDATE_DEMO, MOCK_CANDIDATES, MOCK_COMPANIES } from "../../utils/mockData";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = event.context.params?.id;

  try {
    const data = await $fetch<any>(`${config.public.apiUrl}/profile/${id}`);
    if (data && (data.id || data.nombre || data.nombreComercial)) {
      return data;
    }
  } catch (error: any) {
    // Fall through to mock data
  }

  // Check candidate mock
  const foundCand = MOCK_CANDIDATES.find(
    (c) =>
      c.id === id ||
      c.userId === id ||
      (id && (id.includes("francisco") || id.includes("juan") || id.includes("perez") || id.includes("cand")))
  );
  if (foundCand) return foundCand;

  // Check company mock
  const foundComp = MOCK_COMPANIES.find(
    (c) =>
      c.id === id ||
      c.companyId === id ||
      c.userId === id ||
      (id && (id.includes("techsolutions") || id.includes("acme") || id.includes("org-")))
  );
  if (foundComp) return foundComp;

  return MOCK_CANDIDATE_DEMO;
});
