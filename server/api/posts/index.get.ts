import { defineEventHandler } from "h3";
import { MOCK_POSTS } from "../../utils/mockData";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  try {
    const data = await $fetch<any[]>(`${config.public.apiUrl}/posts`);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (error: any) {
    // Fall through to mock data
  }

  return MOCK_POSTS;
});
