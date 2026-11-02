import { MOCK_INCIDENTS } from "../../../../../app/utils/mockData";

export default defineEventHandler(async (event) => {
  const incidentId = getRouterParam(event, "id");
  const config = useRuntimeConfig();
  const authHeader = getHeader(event, "authorization");
  const userRoleHeader = (
    getHeader(event, "x-user-role") || "MODERATOR"
  ).toUpperCase();

  // Role verification: ONLY MODERATOR or ADMIN allowed
  if (
    userRoleHeader !== "MODERATOR" &&
    userRoleHeader !== "MODERADOR" &&
    userRoleHeader !== "ADMIN"
  ) {
    throw createError({
      statusCode: 403,
      statusMessage:
        "Acceso denegado: Acceso a historial de auditoría exclusivo para Moderadores.",
    });
  }

  // Try calling backend API
  try {
    const backendData = await $fetch<any>(
      `${config.public.apiUrl}/moderator/incidents/${incidentId}/audit-chat`,
      {
        method: "GET",
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
          "x-user-role": userRoleHeader,
        },
      },
    );

    if (backendData?.success && backendData?.messages) {
      return backendData;
    }
  } catch {
    // Fallback to local / mock chat evidence
  }

  const incident = MOCK_INCIDENTS.find((i) => i.id === incidentId) || {
    id: incidentId,
    jobTitle: "Frontend Senior (Vue 3 / TypeScript)",
    companyName: "Tech Corp Latam",
    candidateName: "María Fernández",
    infraccion: "DISCREPANCIA_SALARIAL",
    severity: "CRITICA",
    reason:
      "La oferta anunciaba $45,000 MXN mensuales y en el chat privado el reclutador exigió aceptar $18,000 sin prestaciones.",
    auditState: "AUDIT_ACTIVE",
  };

  const infractionKey = (incident.infraccion || "").toUpperCase();

  let messages = [
    {
      id: "msg-sal-01",
      senderId: "cand-maria-77",
      senderRole: "CANDIDATO",
      senderName: incident.candidateName || "María Fernández (Postulante)",
      text: "Hola, buen día. Vi en la vacante de Frontend Senior un rango salarial de $42,000 a $48,000 netos. ¿Es correcto para la modalidad híbrida?",
      createdAt: "2026-10-13T10:14:00Z",
    },
    {
      id: "msg-sal-02",
      senderId: "org-recruiter-99",
      senderRole: "EMPRESA",
      senderName: incident.companyName || "Tech Corp Latam (Reclutador)",
      text: "Buen día María. La vacante dice eso en el portal para atraer perfiles senior, pero el presupuesto real autorizado es de $18,000 brutos sin prestaciones superiores. Si le interesa ese monto avanzamos, si no descartamos su perfil.",
      attachmentUrl: "/docs/contrato_modificado_18k.pdf",
      attachmentName: "contrato_modificado_18k.pdf",
      attachmentType: "application/pdf",
      createdAt: "2026-10-13T10:28:00Z",
    },
    {
      id: "msg-sal-03",
      senderId: "cand-maria-77",
      senderRole: "CANDIDATO",
      senderName: incident.candidateName || "María Fernández (Postulante)",
      text: "Eso no fue lo publicado en la oferta inicial. Me parece una práctica engañosa y una discrepancia salarial grave.",
      createdAt: "2026-10-13T10:35:00Z",
    },
    {
      id: "msg-sal-04",
      senderId: "org-recruiter-99",
      senderRole: "EMPRESA",
      senderName: incident.companyName || "Tech Corp Latam (Reclutador)",
      text: "Es lo que hay en el mercado. Si no acepta, no nos haga perder el tiempo.",
      createdAt: "2026-10-13T10:40:00Z",
    },
  ];

  if (infractionKey.includes("FRAUDE")) {
    messages = [
      {
        id: "msg-fraud-01",
        senderId: "cand-carlos-12",
        senderRole: "CANDIDATO",
        senderName: incident.candidateName || "Carlos Gómez (Postulante)",
        text: "Hola, me postulé para la vacante de Capturista Remoto. ¿Cuáles son los siguientes pasos del proceso?",
        createdAt: "2026-10-13T09:05:00Z",
      },
      {
        id: "msg-fraud-02",
        senderId: "org-scam-01",
        senderRole: "EMPRESA",
        senderName: incident.companyName || "FastHiring Express (Empresa)",
        text: "Felicidades Carlos, has sido pre-seleccionado. Para enviarte la laptop y el kit de trabajo a tu domicilio, es requisito indispensable realizar un depósito previo de $1,850 MXN por concepto de seguro de paquetería express a la cuenta que te adjunto.",
        attachmentUrl: "/docs/ficha_deposito_oxxo.png",
        attachmentName: "ficha_deposito_oxxo.png",
        attachmentType: "image/png",
        createdAt: "2026-10-13T09:12:00Z",
      },
      {
        id: "msg-fraud-03",
        senderId: "cand-carlos-12",
        senderRole: "CANDIDATO",
        senderName: incident.candidateName || "Carlos Gómez (Postulante)",
        text: "En los términos de JobNet se estipula que las empresas nunca deben cobrar a los candidatos. No realizaré ningún depósito.",
        createdAt: "2026-10-13T09:15:00Z",
      },
    ];
  } else if (infractionKey.includes("ACOSO")) {
    messages = [
      {
        id: "msg-acoso-01",
        senderId: "cand-ana-33",
        senderRole: "CANDIDATO",
        senderName: incident.candidateName || "Ana Sofía R. (Postulante)",
        text: "Adjunto mi portafolio de diseño UX y referencias laborales solicitadas.",
        attachmentUrl: "/docs/portafolio_ux_ana.pdf",
        attachmentName: "portafolio_ux_ana.pdf",
        attachmentType: "application/pdf",
        createdAt: "2026-10-13T11:00:00Z",
      },
      {
        id: "msg-acoso-02",
        senderId: "org-inapropiado-22",
        senderRole: "EMPRESA",
        senderName: incident.companyName || "Agencia Creativa (Reclutador)",
        text: "El portafolio se ve bien, pero para este puesto requerimos ver fotos personales de cuerpo completo en tu teléfono privado antes de la entrevista presencial.",
        createdAt: "2026-10-13T11:15:00Z",
      },
      {
        id: "msg-acoso-03",
        senderId: "cand-ana-33",
        senderRole: "CANDIDATO",
        senderName: incident.candidateName || "Ana Sofía R. (Postulante)",
        text: "Esa solicitud es completamente inapropiada y no tiene ninguna relación con las competencias del puesto. Presentaré una queja de inmediato.",
        createdAt: "2026-10-13T11:18:00Z",
      },
    ];
  }

  return {
    success: true,
    isReadOnly: true,
    incident,
    messages,
  };
});
