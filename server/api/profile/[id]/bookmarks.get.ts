import { defineEventHandler, getQuery, getHeader, createError } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = event.context.params?.id;
  const query = getQuery(event);
  const userId =
    (query.userId as string) ||
    (getHeader(event, "x-user-id") as string) ||
    (getHeader(event, "user-id") as string) ||
    "";

  try {
    const data = await $fetch<any>(
      `${config.public.apiUrl}/profile/${encodeURIComponent(id || "")}/bookmarks`,
      {
        headers: userId ? { "x-user-id": userId } : {},
      },
    );
    return data;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Error fetching profile bookmarks from backend",
      data: error.data || { data: [], posts: [], jobs: [] },
    });
  }
});
