import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  try {
    const data = await $fetch<any[]>(`${config.public.apiUrl}/posts`);
    if (Array.isArray(data)) return data;
  } catch (error: any) {
    console.warn("Failed to fetch posts from backend API:", error?.message);
  }

  return [];
});
