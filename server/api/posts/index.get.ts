import { defineEventHandler, getHeader, getQuery } from "h3";
import { MOCK_POSTS } from "../../utils/mockData";

export default defineEventHandler(async (event) => {
  const cookie = getHeader(event, "cookie") || "";
  const query = getQuery(event);
  if (cookie.includes("jobnet-mock-enabled=true") || query.mock === "true") {
    return MOCK_POSTS;
  }

  const config = useRuntimeConfig();
  try {
    const data = await $fetch<any[]>(`${config.public.apiUrl}/posts`);
    if (Array.isArray(data)) return data;
  } catch (error: any) {
    console.warn("Failed to fetch posts from backend API:", error?.message);
  }
  return MOCK_POSTS;
});
