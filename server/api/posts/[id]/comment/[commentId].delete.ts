import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = event.context.params?.id;
  const commentId = event.context.params?.commentId;
  try {
    const data = await $fetch<any>(
      `${config.public.apiUrl}/posts/${id}/comment/${encodeURIComponent(commentId)}`,
      {
        method: "DELETE",
      },
    );
    return data;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Error deleting comment in AWS backend",
      data: error.data || {},
    });
  }
});
