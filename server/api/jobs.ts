import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  try {
    const data = await $fetch<any>(`${config.public.apiUrl}/jobs`, {
      query,
    });
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
  } catch (error: any) {
    console.warn("Failed to fetch jobs from backend API:", error?.message);
  }

  return [];
});
