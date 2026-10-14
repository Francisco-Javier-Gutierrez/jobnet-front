import { defineEventHandler, readBody } from "h3";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const subscription = body?.subscription || body;

  if (!subscription || !subscription.endpoint) {
    return { error: "Invalid subscription" };
  }

  const filePath = path.resolve(process.cwd(), "..", ".push-subscription.json");
  fs.writeFileSync(filePath, JSON.stringify(subscription, null, 2), "utf-8");

  console.log("[Push Register] Subscription saved to:", filePath);
  return { success: true, savedTo: filePath };
});
