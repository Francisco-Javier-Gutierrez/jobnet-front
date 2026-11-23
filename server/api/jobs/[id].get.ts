import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = event.context.params?.id;

  try {
    const data = await $fetch<any>(`${config.public.apiUrl}/jobs/${id}`);
    if (data && (data.id || data.uniqueId || data.title)) {
      return data;
    }
  } catch (error: any) {
    console.warn(`Failed to fetch job ${id} from backend API:`, error?.message);
  }

  throw createError({
    statusCode: 404,
    statusMessage: "Vacante no encontrada",
  });
});
