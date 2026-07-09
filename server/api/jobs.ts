import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  try {
    const data = await $fetch<any[]>(`${config.public.apiUrl}/jobs`);
    return data;
  } catch (error: any) {
    console.error("Error fetching jobs from AWS backend:", error);
    return [];
  }
});
