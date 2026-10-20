# Reglas del Proyecto y Flujos de Trabajo (JobNet)

¡Bienvenido al equipo! Para mantener una alta calidad de código y asegurar que los despliegues sean estables, hemos implementado una serie de reglas estrictas y flujos de integración continua (CI/CD) que todos los desarrolladores deben seguir.

Por favor, lee con detenimiento este documento antes de comenzar a programar.

---

## 1. Ramas y GitFlow

- **`develop`**: Es la rama base de integración. **Todos los despliegues automáticos** (hacia el entorno de desarrollo/testing) ocurren cuando se hace un merge hacia esta rama.
- **`main`**: Actualmente está **deshabilitada para despliegues automáticos**. No hagas merge a `main` a menos que se indique explícitamente para una versión de producción oficial.
- **Ramas de trabajo**: Crea siempre ramas partiendo de `develop` con los prefijos:
  - `feature/nombre-de-la-feature`
  - `fix/nombre-del-error`
- **Creación de Pull Requests (PR)**:
  - **Los PRs se deben hacer siempre con destino a `develop` y nunca a `main`**.
  - Si el dispositivo/entorno cuenta con la CLI de GitHub (`gh`), el desarrollador o agente debe crear el PR automáticamente usando `gh pr create` apuntando a `develop`.
  - En caso de no contar con la CLI de GitHub (`gh`), el desarrollador o agente debe indicar siempre al usuario después de una implementación que debe realizar el PR de forma manual con destino a `develop` y **nunca a `main`**.
- **Aislamiento Estricto de Ramas Mock y Datos de Prueba**:
  - Las ramas de datos mock y herramientas de simulación (por ejemplo `feature/mock-*`) son **únicamente para sus ramas dedicadas**, no para el proyecto general.
  - **JAMÁS deben ser mergeadas ni a `main` ni a `develop`**.
  - Las ramas `develop` y `main` deben permanecer estrictamente limpias de devtools de mock, inyecciones ficticias de sesión o datos simulados no autorizados.

---

## 2. Integración Continua (CI)

Hemos configurado un Action de GitHub (`ci.yml`) que se dispara automáticamente al abrir o actualizar un Pull Request hacia `develop` o `main`, y cuando se hace un merge/push a `develop`.

El CI ejecutará una serie de validaciones secuenciales. **Si tu código falla en alguna de ellas, el Pull Request será bloqueado.**

Para asegurarte de que tu código pasará el CI, puedes (y debes) ejecutar los siguientes comandos localmente antes de hacer push:

### A. Formato de Código (Prettier)

Usamos **Prettier** para estandarizar el formato de todos los archivos y evitar discusiones sobre estilos.

- Para verificar el formato: `npm run format:check`
- Para arreglar todos los archivos automáticamente: `npm run format` (Haz esto antes del commit).

### B. Linting (ESLint)

Usamos **ESLint** para detectar malas prácticas y errores lógicos en el código.

- Comando: `npm run lint`
- Todos los errores de linter deben ser resueltos. No silencies reglas globales a menos que haya una justificación arquitectónica aprobada.

### C. Tipado Estricto (TypeScript)

El proyecto usa TypeScript de forma estricta. No se permite el uso de variables sin tipar ni el abuso excesivo de `any`.

- Comando frontend: `npm run typecheck` (`vue-tsc --noEmit`)
- Comando backend: `npm run typecheck` (`tsc --noEmit`)
- El CI fallará si existen errores de tipos.

### D. Pruebas Unitarias y Cobertura (Vitest)

Hemos configurado **Vitest** con un umbral de cobertura estricto.

- **Cobertura requerida: 100%**.
- Esto incluye **Líneas, Funciones, Ramas (if/else) y Declaraciones (Statements)**.
- Todas las funciones (backend) y componentes importantes (frontend) deben contar con su respectivo archivo de prueba (`.test.ts` o `.spec.ts`).
- Comando para ejecutar las pruebas: `npm run test`
- Comando para verificar la cobertura localmente: `npm run test:coverage`

### E. Construcción (Build)

El último paso del CI valida que la aplicación compile correctamente sin errores.

- Comando: `npm run build`

---

## 3. Resumen de comandos antes de hacer Push

Antes de subir tus cambios a GitHub, acostúmbrate a correr este ciclo en tu terminal:

```bash
npm run format
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

Si todo sale verde, ¡tu código está listo para revisión y posterior despliegue automático a `develop`!

---

## 4. Reglas de Autenticación y Cognito

Para asegurar el correcto funcionamiento del registro e inicio de sesión integrados con el backend de AWS Cognito, se deben cumplir las siguientes directrices:

### A. Registro de Usuarios y Atributos de Cognito

- **Esquemas de Atributos**: Al registrar un usuario mediante la API de autenticación (`server/api/auth/register.post.ts`), se deben enviar los atributos personalizados definidos en la infraestructura de AWS (Terraform):
  - **`custom:role`**: Define el rol del usuario en inglés (`candidate` o `company`).
  - **`custom:tax_id`**: Es obligatorio únicamente para cuentas de tipo corporativas (`company`) para registrar el identificador fiscal (RUC/RFC).
- **Campos Obligatorios de Identidad**:
  - Para Candidatos: Se debe enviar `name` con el Nombre Completo.
  - Para Empresas: Se debe enviar `name` con la Razón Social de la empresa.

### B. Configuración de Entornos (.env)

- Nunca envíes variables sensibles en tus PRs.
- Las variables que comienzan con `NUXT_PUBLIC_` quedarán expuestas en el navegador; sé cuidadoso con lo que incluyes ahí.
- Al realizar cambios en la infraestructura de AWS con Terraform, se deben actualizar de inmediato las variables `NUXT_PUBLIC_COGNITO_USER_POOL_ID` y `NUXT_PUBLIC_COGNITO_CLIENT_ID` tanto en local como en los parámetros del pipeline de despliegue.

---

## 5. Reglas de Interfaz y Experiencia de Usuario (UX)

### A. Retroalimentación de Usuario (Feedback)

- **¡PROHIBIDO EL USO DE `alert()`!**: Para mantener una estética profesional y limpia, nunca utilices la función nativa `alert()` del navegador para mostrar mensajes al usuario, ni para manejo de errores ni para notificaciones de éxito.
- **Usa el Modal de Feedback Global (`AppFeedbackModal.vue`)**:
  - Dispones del composable global auto-importado `useAppFeedback()`.
  - Para utilizarlo dentro del bloque `<script setup>`:
    ```typescript
    const { showSuccess, showError, showWarning, showInfo } = useAppFeedback();

    // Ejemplos de uso:
    showError("Error al guardar", "Hubo un problema al procesar tu solicitud.");
    showSuccess("Operación Exitosa", "Los datos se guardaron correctamente.");
    ```
  - Este modal provee una interfaz unificada, auto-cierre con barra de progreso, iconos representativos y evita bloquear el hilo principal del navegador de forma abrupta.

---

## 6. Diseño y Skeleton Loaders (UI/UX)

Para garantizar una experiencia de usuario premium y fluida, se deben cumplir las siguientes directrices de diseño visual en el frontend:

### A. Estados de Carga Asíncronos

- **Carga de Datos de Backend**: En cualquier vista o componente que realice una petición HTTP al backend (mediante `$fetch`, `useAsyncData`, `useLazyAsyncData`, etc.) para pintar listas, grillas, tablas o detalles de perfil, **está estrictamente prohibido dejar la pantalla en blanco o usar exclusivamente un spinner de carga genérico** en la sección principal del contenido.
- **Implementación de Skeleton Loaders**: Se debe diseñar y renderizar un marcador visual pulsante (`animate-pulse`) que imite la estructura exacta del contenido real que se va a cargar (por ejemplo, tarjetas de vacantes, filas de tablas, avatares, o bloques de texto del perfil).
- **Carga No Bloqueante (Lazy Loading)**: Evita usar `await` de manera bloqueante en la raíz del bloque `<script setup>` si eso va a detener el renderizado inicial de la página o layout. Usa `useLazyAsyncData` o inicializaciones asíncronas y controla la visibilidad del esqueleto usando un flag reactivo `loading`.
