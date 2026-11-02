#!/usr/bin/env node

import { execSync } from "node:child_process";

console.log("\n======================================================");
console.log("🛡️  JOBNET QUALITY GATEKEEPER & JENKINS AUDITOR");
console.log("======================================================\n");

// 1. Activar Git Hooks de protección
try {
  execSync("git config core.hooksPath .githooks", { stdio: "ignore" });
} catch (_) {}

// 2. Verificación rápida local (npm run check)
console.log(
  "🧪 [1/4] Ejecutando validaciones locales estrictas (npm run check)...",
);
try {
  execSync("npm run check", { stdio: "inherit" });
  console.log("✅ Validaciones locales completadas con éxito.\n");
} catch (error) {
  console.error(
    "\n❌ ERROR: npm run check falló. Corrige los errores antes de continuar.",
  );
  process.exit(1);
}

// 3. Verificación y auto-commit de cambios en Git si es necesario
console.log("📦 [2/4] Verificando estado del repositorio Git...");
let currentBranch = "develop";
try {
  currentBranch = execSync("git rev-parse --abbrev-ref HEAD", {
    encoding: "utf-8",
  }).trim();
} catch (_) {
  try {
    currentBranch =
      execSync("git branch --show-current", { encoding: "utf-8" }).trim() ||
      "develop";
  } catch (_) {}
}

try {
  const status = execSync("git status --porcelain", {
    encoding: "utf-8",
  }).trim();
  if (status) {
    console.log("   Detectados archivos modificados, guardando commit...");
    execSync("git add .");
    execSync(
      'git commit -m "chore: automated pre-audit commit via npm run jenkins"',
    );
    console.log("   ✅ Commit generado localmente.");
  } else {
    console.log("   ℹ️  No hay cambios pendientes de commit en Git.");
  }
} catch (err) {
  console.warn("   ⚠️  Nota sobre Git commit:", err.message);
}

// 4. Subir a la rama de auditoría (develop) en GitHub
console.log('\n🌐 [3/4] Enviando cambios a la rama "develop" en GitHub...');
let remoteUrl = "";
try {
  remoteUrl = execSync("git config --get remote.origin.url", {
    encoding: "utf-8",
  }).trim();
} catch (_) {}

if (!remoteUrl) {
  console.error(
    "❌ No se detectó un repositorio remoto (origin) configurado en Git.",
  );
  process.exit(1);
}

try {
  execSync("git push origin HEAD:refs/heads/develop", { stdio: "inherit" });
  console.log('   ✅ Rama "develop" sincronizada en GitHub.');
} catch (pushErr) {
  console.error(
    "\n❌ Error al enviar cambios a GitHub (rama develop):",
    pushErr.message,
  );
  process.exit(1);
}

// 5. Disparar Pipeline en Jenkins Local (Docker) y esperar veredicto
console.log(
  "\n📡 [4/4] Solicitando auditoría al servidor de Jenkins local (http://localhost:8080)...",
);

const JENKINS_HOST = process.env.JENKINS_URL || "http://localhost:8080";
const JOB_NAME = process.env.JENKINS_JOB_NAME || "jobnet-front";
const USER = process.env.JENKINS_USER || "francisco";
const TOKEN = process.env.JENKINS_TOKEN || "11de4a71e27959163a7e1c20fc7444f0c5";
const CREDENTIALS = Buffer.from(`${USER}:${TOKEN}`).toString("base64");

const queryParams = new URLSearchParams({ GIT_BRANCH: "develop" }).toString();
const TRIGGER_URL = `${JENKINS_HOST}/job/${JOB_NAME}/buildWithParameters?${queryParams}`;

function normalizeUrl(targetUrl) {
  if (!targetUrl) return targetUrl;
  try {
    const parsed = new URL(targetUrl);
    const hostParsed = new URL(JENKINS_HOST);
    parsed.protocol = hostParsed.protocol;
    parsed.host = hostParsed.host;
    parsed.port = hostParsed.port;
    return parsed.toString();
  } catch (_) {
    return targetUrl;
  }
}

async function triggerAndGate() {
  let response;

  try {
    response = await fetch(TRIGGER_URL, {
      method: "POST",
      headers: { Authorization: `Basic ${CREDENTIALS}` },
    });
  } catch (netErr) {
    console.error(
      `❌ No se pudo conectar con el servidor de Jenkins local en ${JENKINS_HOST}:`,
      netErr.message,
    );
    console.error(
      "👉 Asegúrate de que el contenedor Docker de Jenkins esté corriendo en el puerto 8080.",
    );
    process.exit(1);
  }

  if (response && response.status === 400) {
    // Si el job aún no tiene parámetros indexados, usar endpoint /build
    const fallbackUrl = `${JENKINS_HOST}/job/${JOB_NAME}/build`;
    try {
      response = await fetch(fallbackUrl, {
        method: "POST",
        headers: { Authorization: `Basic ${CREDENTIALS}` },
      });
    } catch (_) {}
  }

  if (!response || (response.status !== 201 && response.status !== 200)) {
    console.error(
      `❌ Respuesta inesperada de Jenkins (HTTP ${response?.status}):`,
      await response?.text(),
    );
    process.exit(1);
  }

  const rawQueueUrl = response.headers.get("location");
  if (!rawQueueUrl) {
    console.error("❌ Jenkins no devolvió la ubicación de la tarea en cola.");
    process.exit(1);
  }
  const queueUrl = normalizeUrl(rawQueueUrl);

  console.log(
    "   📬 Tarea en cola de Jenkins. Esperando ejecutor disponible...",
  );

  // Esperar a que se asigne un ejecutor y empiece a compilar
  let buildUrl = null;
  let buildNumber = null;

  while (!buildUrl) {
    await new Promise((r) => setTimeout(r, 1500));
    try {
      const qRes = await fetch(`${queueUrl}api/json`, {
        headers: { Authorization: `Basic ${CREDENTIALS}` },
      });
      if (qRes.ok) {
        const qData = await qRes.json();
        if (qData.executable && qData.executable.url) {
          buildUrl = normalizeUrl(qData.executable.url);
          buildNumber = qData.executable.number;
          break;
        }
        if (qData.cancelled) {
          console.error("❌ La tarea fue cancelada en la cola de Jenkins.");
          process.exit(1);
        }
      }
    } catch (_) {}
    process.stdout.write("   ⏳ Esperando ejecutor en Jenkins...\r");
  }

  console.log(
    `\n⚙️  Auditoría en curso: Job '${JOB_NAME}' - Build #${buildNumber} (Rama: develop)`,
  );
  console.log(`🔗 Ver consola en vivo: ${buildUrl}console`);

  // Esperar a que termine la compilación
  const startTime = Date.now();
  let buildData = null;

  while (true) {
    await new Promise((r) => setTimeout(r, 2500));
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    try {
      const bRes = await fetch(`${buildUrl}api/json`, {
        headers: { Authorization: `Basic ${CREDENTIALS}` },
      });
      if (bRes.ok) {
        buildData = await bRes.json();
        if (!buildData.building) {
          break;
        }
      }
    } catch (_) {}
    process.stdout.write(
      `   ⏳ Jenkins auditando código (Linter, Tests y Build)... [${elapsed}s]\r`,
    );
  }

  const durationSec =
    Math.round(buildData.duration / 1000) ||
    Math.floor((Date.now() - startTime) / 1000);

  // Veredicto del Quality Gate
  if (buildData.result === "SUCCESS") {
    console.log(
      `\n\n========================================================================`,
    );
    console.log(
      `🎉 ¡AUDITORÍA APROBADA POR JENKINS (Build #${buildNumber} en ${durationSec}s)!`,
    );
    console.log(
      `========================================================================`,
    );
    console.log("✅ Formato Prettier y ESLint: APROBADOS");
    console.log("✅ Verificación de Tipos TypeScript: APROBADA");
    console.log("✅ Pruebas Unitarias Vitest: APROBADAS");
    console.log("✅ Compilación Nuxt 4 Nitro (aws-lambda): EXITOSA");
    console.log("");
    console.log(
      '🚀 Desbloqueando candado de seguridad y promoviendo a producción ("main")...',
    );

    try {
      execSync("git push origin HEAD:refs/heads/main", {
        stdio: "inherit",
        env: {
          ...process.env,
          JENKINS_GATEKEEPER_APPROVED: "true",
        },
      });
      console.log(
        "\n========================================================================",
      );
      console.log("☁️  ¡CÓDIGO PUBLICADO EXITOSAMENTE EN GITHUB MAIN!");
      console.log(
        "🚀 El despliegue a AWS (Lambda SSR + S3 + CloudFront) ha comenzado.",
      );
      console.log(
        "========================================================================\n",
      );
    } catch (pushMainErr) {
      console.error(
        "\n❌ Error al promover cambios a main:",
        pushMainErr.message,
      );
      process.exit(1);
    }
  } else {
    console.log(
      `\n\n========================================================================`,
    );
    console.log(
      `❌ AUDITORÍA RECHAZADA POR JENKINS (Build #${buildNumber} - RESULTADO: ${buildData.result})`,
    );
    console.log(
      `========================================================================`,
    );
    console.log(
      "🛑 El pipeline detectó errores en las pruebas, linter o compilación.",
    );
    console.log(
      '🛡️  LA RAMA "main" NO FUE MODIFICADA. Producción sigue a salvo.',
    );
    console.log("☁️  No se disparó ningún despliegue en AWS con código roto.");
    console.log("");
    console.log("👉 Revisa los errores exactos en:");
    console.log(`   ${buildUrl}console`);
    console.log(
      "========================================================================\n",
    );
    process.exit(1);
  }
}

await triggerAndGate();
