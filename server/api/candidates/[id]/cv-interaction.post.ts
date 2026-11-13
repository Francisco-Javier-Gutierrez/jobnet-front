import { defineEventHandler, readBody, getRouterParam } from "h3";
import fs from "fs";
import path from "path";
import webpush from "web-push";

const DEFAULT_VAPID_PUBLIC_KEY =
  "BOIrktuQCHHiOWcKICA7YEwdKJf8WNYCmBS_PI338wnaB9VqXPQfCRwTN5NLYokujXBp5pdD83av6DACG2rAYok";
const DEFAULT_VAPID_PRIVATE_KEY = "oJXO_P5wuj45JaC8taPC1E3pPR8Hu1zi_kAiv5yAaNg";
const DEFAULT_VAPID_SUBJECT = "mailto:contacto@franciscojgh.com";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || DEFAULT_VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY || DEFAULT_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY || DEFAULT_VAPID_PRIVATE_KEY,
);

export default defineEventHandler(async (event) => {
  const candidateId = getRouterParam(event, "id");
  if (!candidateId) {
    return { error: "Missing candidate id" };
  }

  const body = (await readBody(event)) || {};
  const config = useRuntimeConfig();

  // 1. Forward to backend AWS Lambda / DynamoDB if apiUrl is configured
  if (config.public?.apiUrl) {
    const authHeader = getHeader(event, "authorization");
    const userIdHeader = getHeader(event, "x-user-id");
    const userRoleHeader = getHeader(event, "x-user-role");

    const forwardHeaders: Record<string, string> = {};
    if (authHeader) forwardHeaders["Authorization"] = authHeader;
    if (userIdHeader) forwardHeaders["x-user-id"] = userIdHeader;
    if (userRoleHeader) forwardHeaders["x-user-role"] = userRoleHeader;

    try {
      const backendRes = await $fetch<any>(
        `${config.public.apiUrl}/profile/${candidateId}/cv-interaction`,
        {
          method: "POST",
          body,
          headers: forwardHeaders,
        },
      );
      if (backendRes) {
        return backendRes;
      }
    } catch (backendErr: any) {
      console.warn(
        "[Nitro cv-interaction] Backend forwarding returned error:",
        backendErr?.message || backendErr,
      );
    }
  }

  const action = (body.action || "VIEW").toUpperCase();
  const companyName = body.companyName || "Una organización reclutadora";
  const recruiterName = body.recruiterName || "";
  const vacancyTitle = body.vacancyTitle || "una vacante activa";

  const recruiterEntity = recruiterName
    ? `${recruiterName} (${companyName})`
    : companyName;

  const isDownload = action === "DOWNLOAD";
  const title = isDownload
    ? "Tu CV ha sido descargado"
    : "Tu CV ha sido visualizado";

  const message = isDownload
    ? `${recruiterEntity} ha descargado tu Currículum Vitae para la vacante "${vacancyTitle}".`
    : `${recruiterEntity} acaba de abrir y visualizar tu Currículum Vitae para la vacante "${vacancyTitle}".`;

  let sentPush = false;

  // Intentar notificar via web-push local si existe suscripción persistida
  try {
    const subPath = path.resolve(
      process.cwd(),
      "..",
      ".push-subscription.json",
    );
    if (fs.existsSync(subPath)) {
      const subRaw = fs.readFileSync(subPath, "utf-8");
      const subscription = JSON.parse(subRaw);
      if (subscription?.endpoint && subscription?.keys) {
        await webpush.sendNotification(
          subscription,
          JSON.stringify({
            title,
            body: message,
            icon: "/logotipo.svg",
            badge: "/logotipo.svg",
            url: "/candidate/my-applications",
            data: {
              type: "cv_interaction",
              candidateId,
              action,
              companyName,
              timestamp: new Date().toISOString(),
            },
          }),
        );
        sentPush = true;
      }
    }
  } catch (err: any) {
    console.warn(
      "[CV Interaction Push] Could not send local webpush notification:",
      err?.message || err,
    );
  }

  return {
    success: true,
    candidateId,
    action,
    title,
    message,
    sentPush,
    timestamp: new Date().toISOString(),
  };
});
