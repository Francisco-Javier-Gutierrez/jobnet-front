<template>
  <div class="prose-terms space-y-8">
    <!-- 1 -->
    <section class="space-y-3">
      <h2>1. Aceptación de los Términos</h2>
      <p>
        Al registrarte, acceder o utilizar la plataforma <strong>JobNet</strong>
        (en adelante "la Plataforma"), aceptas de manera íntegra y sin reservas
        los presentes Términos y Condiciones de Uso. Si no estás de acuerdo con
        alguna disposición, deberás abstenerte de utilizar la Plataforma.
      </p>
      <p>
        JobNet es una plataforma digital de empleo con características de red
        social profesional que conecta a candidatos, organizaciones
        reclutadoras, moderadores de comunidad y administradores dentro de un
        ecosistema laboral integrado.
      </p>
    </section>

    <!-- 2 -->
    <section class="space-y-3">
      <h2>2. Definiciones</h2>
      <ul>
        <li>
          <strong>Candidato:</strong> Persona física registrada que busca
          oportunidades laborales, se postula a vacantes y gestiona su perfil
          profesional digital.
        </li>
        <li>
          <strong>Organización:</strong> Persona moral o física con actividad
          empresarial registrada que publica ofertas de trabajo, gestiona
          postulaciones y se comunica con candidatos.
        </li>
        <li>
          <strong>Moderador:</strong> Usuario autorizado por la administración
          para supervisar el cumplimiento de las normas comunitarias, atender
          denuncias y gestionar apelaciones.
        </li>
        <li>
          <strong>Administrador:</strong> Usuario con el máximo nivel de
          privilegios operativos sobre la Plataforma.
        </li>
        <li>
          <strong>Usuario Invitado:</strong> Persona no registrada que accede a
          la Plataforma en modo de solo lectura.
        </li>
      </ul>
    </section>

    <!-- 3 -->
    <section class="space-y-3">
      <h2>3. Registro y Cuenta de Usuario</h2>
      <p>
        Para acceder a las funcionalidades interactivas de la Plataforma
        (postularse, publicar, comentar, enviar mensajes), es necesario crear
        una cuenta proporcionando información veraz y actualizada. El usuario es
        responsable de mantener la confidencialidad de sus credenciales de
        acceso.
      </p>
      <p>
        La autenticación se gestiona mediante un servicio seguro de identidad en
        la nube (AWS Cognito), que permite la activación opcional de
        autenticación multifactor (MFA) para mayor protección de la cuenta.
      </p>
      <p>
        <strong>Restricción de dominios:</strong> La Plataforma se reserva el
        derecho de impedir el registro de cuentas empresariales cuyos dominios
        de correo electrónico se encuentren asociados a organizaciones que hayan
        sido suspendidas o prohibidas de forma definitiva.
      </p>

      <h3>
        3.1 Estatutos de Autenticación Federada con Google (Google Sign-In),
        Vinculación de Cuentas (Google Link) y Estricta Segregación de Roles
      </h3>
      <p>
        <strong>Alcance exclusivo del rol de Candidato:</strong> El mecanismo de
        registro e inicio de sesión mediante proveedor externo (Google OAuth /
        Google Sign-In / "Continuar con Google"), así como el servicio de
        vinculación de cuentas ("Google Link"), opera de manera
        <strong>estricta y exclusiva bajo el rol de CANDIDATO</strong>. Toda
        cuenta creada o autenticada a través de Google dispondrá únicamente del
        perfil, herramientas y facultades asignadas a candidatos que buscan
        empleo dentro de la Plataforma.
      </p>
      <p>
        <strong
          >Incompatibilidad con roles privilegiados y empresariales:</strong
        >
        Las cuentas con responsabilidades de gestión, facultades operativas o de
        seguridad institucional —específicamente
        <strong>Administradores</strong>, <strong>Moderadores</strong> y
        <strong>Organizaciones (Empresas)</strong>— no podrán en ningún caso
        heredar, delegar ni ejercer privilegios administrativos o corporativos a
        través de identidades sociales de Google. El acceso a consolas
        administrativas, paneles de moderación y herramientas de contratación
        requiere obligatoriamente la autenticación directa mediante correo
        electrónico y contraseña local gestionada en AWS Cognito.
      </p>
      <p>
        <strong
          >Estatuto de acceso para titulares de roles no candidatos:</strong
        >
        Si un usuario cuya cuenta original en JobNet corresponde al rol de
        Administrador, Moderador u Organización decide iniciar sesión utilizando
        Google Sign-In con la misma dirección de correo electrónico (o vincula
        dicho identificador mediante Google Link), reconoce, asume y acepta de
        forma expresa que:
      </p>
      <ul>
        <li>
          <strong>Sesión estrictamente como Candidato:</strong> Toda sesión
          iniciada a través de Google operará de manera
          <strong>estricta e invariable como CANDIDATO</strong>, sin otorgar
          acceso a paneles de control, herramientas de moderación ni funciones
          empresariales.
        </li>
        <li>
          <strong>Segregación y aislamiento de seguridad:</strong> Bajo ninguna
          circunstancia el inicio de sesión con Google constituirá una vía de
          elevación de privilegios ni alterará la seguridad de la cuenta nativa.
        </li>
        <li>
          <strong>Acceso a funciones principales:</strong> Para operar como
          Administrador, Moderador u Organización, el usuario deberá finalizar
          la sesión federada e ingresar obligatoriamente mediante sus
          credenciales locales (correo electrónico y contraseña).
        </li>
      </ul>
    </section>

    <!-- 4 -->
    <section class="space-y-3">
      <h2>4. Datos Personales Recopilados</h2>
      <p>
        Para el funcionamiento de la Plataforma, se recopilan y almacenan los
        siguientes datos según el tipo de cuenta:
      </p>
      <h3>4.1 Candidatos</h3>
      <ul>
        <li>Nombre completo, correo electrónico y contraseña (cifrada).</li>
        <li>
          Fotografía de perfil, biografía profesional y ubicación geográfica
          (coordenadas de latitud y longitud).
        </li>
        <li>
          Currículum Vitae en formato PDF, historial laboral, historial
          académico, habilidades técnicas y blandas.
        </li>
        <li>Enlaces web profesionales y documentos adicionales.</li>
      </ul>
      <h3>4.2 Organizaciones</h3>
      <ul>
        <li>Nombre comercial, razón social e identificador fiscal (RFC).</li>
        <li>
          Sector o industria, logotipo corporativo y ubicación geográfica.
        </li>
        <li>Documentación de verificación empresarial.</li>
      </ul>
      <h3>4.3 Datos de Uso</h3>
      <ul>
        <li>
          Postulaciones realizadas, cartas de presentación enviadas,
          publicaciones, comentarios, reacciones ("me gusta"), contenidos
          guardados y mensajes intercambiados en el chat.
        </li>
        <li>
          Archivos adjuntos (imágenes y documentos) enviados en conversaciones o
          publicaciones.
        </li>
        <li>Registros de auditoría generados por el sistema de moderación.</li>
      </ul>
    </section>

    <!-- 5 -->
    <section class="space-y-3">
      <h2>5. Uso Aceptable de la Plataforma</h2>
      <p>El usuario se compromete a:</p>
      <ul>
        <li>
          Proporcionar información verídica, precisa y actualizada en su perfil
          y publicaciones.
        </li>
        <li>
          No publicar contenido difamatorio, discriminatorio, ilegal,
          fraudulento o que infrinja derechos de terceros.
        </li>
        <li>
          No utilizar la Plataforma para fines distintos a la búsqueda de
          empleo, reclutamiento o interacción profesional.
        </li>
        <li>
          No intentar acceder a cuentas ajenas, explotar vulnerabilidades
          técnicas ni interferir con el funcionamiento del servicio.
        </li>
        <li>
          No publicar ofertas de empleo engañosas, con información salarial
          falsa o que promuevan esquemas piramidales o de explotación laboral.
        </li>
      </ul>
    </section>

    <!-- 6 -->
    <section class="space-y-3">
      <h2>6. Publicación de Vacantes</h2>
      <p>
        Las organizaciones son las únicas responsables de la veracidad,
        legalidad y cumplimiento normativo de las ofertas de trabajo que
        publican. Cada vacante puede incluir título del puesto, descripción,
        rango salarial, modalidad de trabajo (remoto, híbrido o presencial),
        ubicación georeferenciada, habilidades requeridas, sectores relacionados
        y un límite máximo de postulantes.
      </p>
      <p>
        La Plataforma se reserva el derecho de ocultar, suspender o eliminar
        cualquier vacante que contravenga los presentes Términos o las normas
        comunitarias vigentes.
      </p>
    </section>

    <!-- 7 -->
    <section class="space-y-3">
      <h2>7. Postulaciones y Proceso de Selección</h2>
      <p>
        Los candidatos podrán postularse a las vacantes publicadas mediante el
        sistema de postulación rápida ("Easy Apply"), adjuntando su Currículum
        Vitae previamente cargado en su perfil, una carta de presentación
        opcional, enlaces profesionales y documentos complementarios.
      </p>
      <p>
        El flujo de una postulación puede transitar por los siguientes estados:
        <strong>Pendiente</strong>, <strong>En Contacto</strong>,
        <strong>Seleccionado</strong>, <strong>Rechazado</strong> o
        <strong>Contratado</strong>. La decisión final de contratación recae
        exclusivamente en la organización reclutadora, sin que JobNet actúe como
        intermediario laboral ni garantice resultados.
      </p>
    </section>

    <!-- 8 -->
    <section class="space-y-3">
      <h2>8. Comunicaciones y Chat en Tiempo Real</h2>
      <p>
        La Plataforma ofrece un sistema de mensajería en tiempo real que permite
        la comunicación directa entre candidatos y organizaciones dentro del
        contexto de una postulación activa, así como entre organizaciones y
        moderadores en el contexto de una apelación.
      </p>
      <p>
        Los canales de chat se cierran automáticamente cuando el proceso
        asociado concluye (postulación rechazada, candidato contratado o
        apelación resuelta). Una vez cerrado, el historial de la conversación
        permanece disponible como registro de auditoría en modo de solo lectura,
        sin posibilidad de enviar nuevos mensajes.
      </p>
    </section>

    <!-- 9 -->
    <section class="space-y-3">
      <h2>9. Moderación y Sistema de Denuncias</h2>
      <p>
        Cualquier usuario registrado puede reportar contenido, vacantes u otros
        usuarios que considere que infringen las normas comunitarias. La
        Plataforma aplica las siguientes medidas de protección:
      </p>
      <h3>9.1 Suspensión Automática de Vacantes</h3>
      <p>
        Si una oferta de trabajo acumula 5 o más denuncias dentro de un periodo
        de 12 horas, el sistema activará de forma automática una bandera de
        revisión obligatoria, ocultando la vacante del listado público hasta que
        un moderador emita una resolución.
      </p>
      <h3>9.2 Bloqueo de Usuarios y Organizaciones</h3>
      <p>
        La administración y el equipo de moderación tienen la facultad de
        suspender o bloquear de forma definitiva la cuenta de cualquier usuario
        u organización que incurra en conductas contrarias a los presentes
        Términos. Cada sanción queda registrada de manera permanente en el
        sistema de auditoría. El usuario afectado será notificado por correo
        electrónico con el motivo de la sanción.
      </p>
      <h3>9.3 Suspensión Definitiva de Candidatos</h3>
      <p>
        Las suspensiones de cuentas de candidatos son de carácter
        <strong>definitivo e inapelable</strong>.
      </p>
    </section>

    <!-- 10 -->
    <section class="space-y-3">
      <h2>10. Proceso de Apelación</h2>
      <p>
        Para sanciones que admitan revisión (como bloqueos preventivos de
        ofertas de trabajo o suspensiones temporales de cuentas empresariales),
        la organización afectada dispondrá de un plazo para presentar una
        solicitud de apelación a través del canal de soporte habilitado en la
        Plataforma:
      </p>
      <ul>
        <li>
          <strong>Suspensiones de cuenta empresarial:</strong> 4 días naturales
          a partir de la notificación.
        </li>
        <li>
          <strong>Suspensiones de vacantes:</strong> 15 días naturales a partir
          de la notificación.
        </li>
      </ul>
      <p>
        Para que una apelación sea evaluada, la organización deberá presentar su
        justificación de manera suficiente y detallada a través del chat de
        apelación. Si la apelación es aprobada por el equipo de moderación, el
        contenido o la cuenta sancionada serán restablecidos de forma inmediata.
      </p>
    </section>

    <!-- 11 -->
    <section class="space-y-3">
      <h2>11. Verificación de Organizaciones</h2>
      <p>
        Las organizaciones podrán solicitar el distintivo de verificación
        empresarial presentando documentación legal y fiscal válida
        (identificador fiscal / RFC). La verificación será revisada por el
        equipo de moderación y su aprobación o rechazo queda a criterio
        exclusivo de la Plataforma.
      </p>
    </section>

    <!-- 12 -->
    <section class="space-y-3">
      <h2>12. Propiedad Intelectual</h2>
      <p>
        El diseño, código fuente, marcas, logotipos y demás elementos creativos
        de la Plataforma son propiedad de JobNet. Los usuarios conservan la
        titularidad de los contenidos que publican (textos, imágenes,
        documentos), pero otorgan a la Plataforma una licencia no exclusiva,
        gratuita y revocable para alojar, mostrar y distribuir dichos contenidos
        dentro del servicio.
      </p>
    </section>

    <!-- 13 -->
    <section class="space-y-3">
      <h2>13. Almacenamiento y Seguridad de la Información</h2>
      <p>
        Los datos personales, archivos y documentos subidos a la Plataforma se
        almacenan de forma segura en infraestructura de nube de Amazon Web
        Services (AWS), incluyendo bases de datos cifradas, almacenamiento de
        archivos con control de acceso y una red de distribución de contenido
        (CDN) global. Las contraseñas son gestionadas de forma cifrada por el
        servicio de autenticación y nunca son accesibles por el equipo de
        JobNet.
      </p>
    </section>

    <!-- 14 -->
    <section class="space-y-3">
      <h2>14. Limitación de Responsabilidad</h2>
      <p>
        JobNet actúa exclusivamente como intermediario tecnológico entre
        candidatos y organizaciones. La Plataforma:
      </p>
      <ul>
        <li>
          No garantiza la obtención de empleo ni la contratación de personal.
        </li>
        <li>
          No verifica de manera independiente la veracidad de la información
          proporcionada por los usuarios, salvo en el proceso de verificación
          empresarial.
        </li>
        <li>
          No es responsable por daños directos, indirectos o consecuentes
          derivados del uso de la Plataforma o de las relaciones laborales que
          surjan a través de ella.
        </li>
        <li>
          No se responsabiliza por interrupciones temporales del servicio
          causadas por mantenimiento, actualizaciones o causas de fuerza mayor.
        </li>
      </ul>
    </section>

    <!-- 15 -->
    <section class="space-y-3">
      <h2>15. Modificaciones a los Términos</h2>
      <p>
        JobNet se reserva el derecho de modificar los presentes Términos y
        Condiciones en cualquier momento. Las modificaciones serán publicadas en
        esta misma página con la fecha de última actualización. El uso
        continuado de la Plataforma tras la publicación de cambios constituirá
        la aceptación de los mismos.
      </p>
    </section>

    <!-- 16 -->
    <section class="space-y-3">
      <h2>16. Contacto</h2>
      <p>
        Para cualquier duda, aclaración o ejercicio de derechos relacionados con
        los presentes Términos y Condiciones, el usuario podrá ponerse en
        contacto a través de los canales de soporte habilitados dentro de la
        Plataforma.
      </p>
    </section>
  </div>
</template>

<style scoped>
.prose-terms h2 {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--md-sys-color-on-background, #1c1b1f);
}
.prose-terms h3 {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--md-sys-color-on-background, #1c1b1f);
  margin-top: 0.75rem;
}
.prose-terms p,
.prose-terms li {
  font-size: 0.78rem;
  line-height: 1.7;
  color: var(--md-sys-color-on-surface-variant, #49454f);
}
.prose-terms ul {
  list-style: disc;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.prose-terms strong {
  color: var(--md-sys-color-on-background, #1c1b1f);
}

:root.dark .prose-terms h2,
:root.dark .prose-terms h3,
:root.dark .prose-terms strong {
  color: #e2e8f0;
}
:root.dark .prose-terms p,
:root.dark .prose-terms li {
  color: #94a3b8;
}
</style>
