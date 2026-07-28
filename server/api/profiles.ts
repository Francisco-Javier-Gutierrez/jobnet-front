import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  try {
    const data = await $fetch<any[]>(`${config.public.apiUrl}/profiles`, {
      query,
    });
    return data;
  } catch (error: any) {
    console.error("Error fetching profiles from AWS backend:", error);
    return [];
  }
});
