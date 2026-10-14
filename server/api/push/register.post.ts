import { defineEventHandler, readBody } from "h3";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const subscription = body?.subscription || body;

  if (!subscription || !subscription.endpoint) {
    return { success: true, message: "No subscription provided" };
  }

  // En desarrollo local fuera de Lambda, se guarda una copia opcional
  if (process.env.NODE_ENV !== "production") {
    try {
      const filePath = path.resolve(
        process.cwd(),
        "..",
        ".push-subscription.json",
      );
      fs.writeFileSync(
        filePath,
        JSON.stringify(subscription, null, 2),
        "utf-8",
      );
      return { success: true, savedTo: filePath };
    } catch {
      // Silencioso si el filesystem no es escribible
    }
  }

  return { success: true };
});
