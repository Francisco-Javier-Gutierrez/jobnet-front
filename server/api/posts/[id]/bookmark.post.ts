import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = event.context.params?.id;
  const body = await readBody(event);
  try {
    const data = await $fetch<any>(`${config.public.apiUrl}/posts/${id}/bookmark`, {
      method: "POST",
      body,
    });
    return data;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Error toggling bookmark in AWS backend",
      data: error.data || {},
    });
  }
});
