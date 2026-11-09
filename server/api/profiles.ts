import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  try {
    const data = await $fetch<any[]>(`${config.public.apiUrl}/profiles`, {
      query,
    });
    if (Array.isArray(data)) return data;
  } catch (error: any) {
    console.warn("Failed to fetch profiles from backend API:", error?.message);
  }

  return [];
});
