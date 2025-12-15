# SIGEA – Funcionamiento de interfaces (Participante)

> Documento de referencia rápido para entender **cómo está funcionando lo que implementamos** en el módulo **Participante** (Explorar eventos, detalle en modal, inscripciones, asistencias y certificados).
> Fecha: 2025-12-14

---

## 1) Explorar eventos (ParticipantEventsPage)

### Objetivo

Mostrar al participante una grilla de actividades/eventos disponibles y permitir **ver detalle** (modal) y **realizar inscripción** desde ese flujo.

### Componentes principales

- **`src/pages/participant/ParticipantEventsPage.jsx`**

  - Renderiza el layout del participante (`ParticipantLayout`)
  - Lista de actividades usando el hook **`useParticipantActivities()`**
  - Muestra cada actividad con **`ActivityCard`**
  - Al hacer click en “ver detalle” abre un modal de detalle.
- **`src/features/activities/ui/ActivityCard.jsx`**

  - Tarjeta visual de actividad (título, fechas, etc.)
  - Dispara `onViewDetail()` para abrir el detalle
- **`src/pages/participant/ParticipantActivityDetailModal.jsx`** (modal de participante)

  - Este es el **detalle actual** del evento para participante (reemplaza la necesidad de una página detalle aparte).
  - Integra: estado de inscripción + botón “Inscribirme”.
  - Bloquea/explica razones por las que no se puede inscribir (evento finalizado, ya inscrito, etc.).

> Nota: **`ParticipantEventDetailPage.jsx`** queda como “legacy” si ya estás usando modal; idealmente debería eliminarse cuando todo el flujo se complete.

### Flujo (alto nivel)

1. **Se cargan actividades** (`useParticipantActivities`)
2. Usuario selecciona una actividad (setSelectedActivity)
3. Se abre el modal con detalles
4. El modal consulta estado de inscripción (hook `useEnrollmentStatus`)
5. Si procede, el modal hace POST de inscripción (API `inscriptionsApi.inscribirme`)

---

## 2) Detalle del evento en Modal (ParticipantActivityDetailModal)

### Objetivo

Mostrar información extendida del evento y permitir **inscripción** sin salir de la lista.

### Lógica de inscripción integrada

- Se construye un `payload` con:
  - `usuarioId` (desde `useAuth`)
  - `actividadId` (desde `activity.id`)
  - `estadoId` (ID del estado *PENDIENTE* obtenido de `.env` o dinámicamente)
  - `fechaInscripcion` (YYYY-MM-DD)

Ejemplo:

```js
const payload = {
  usuarioId: String(user?.usuarioId || user?.id_usuario || user?.id || ''),
  actividadId: String(activity?.id || ''),
  estadoId: String(import.meta.env.VITE_ESTADO_INSCRIPCION_PENDIENTE_ID || ''),
  fechaInscripcion: new Date().toISOString().slice(0, 10),
};
```

Luego:

```js
await inscriptionsApi.inscribirme(payload);
await enrollment.reload();
```

### Bloqueo de botón (“disableReason”)

Se usa para:

- Mostrar por qué no se puede inscribir
- Deshabilitar el botón

Razones típicas:

- `activity.finalizada === true` → “Este evento ya finalizó”
- `enrollment.loading` → “Verificando inscripción…”
- `enrollment.inscripcion` → “Ya estás inscrito (estado)”
- Falta `estadoPendienteId` en `.env`
- Falta `usuarioId`

**Atención con `activa`**
Detectamos un caso donde:

- `activity.activa` venía `false`
- pero `activity.estado.codigo` era `EN_CURSO`

En esos casos, se ajustó la lógica para **no bloquear solo por `activa=false`** si el estado es uno que debería permitir inscripción.

---

## 3) Mis inscripciones (ParticipantInscriptionsPage)

### Objetivo

Permitir al participante:

- Ver todas sus inscripciones
- Filtrar por estado (pendiente/confirmada/cancelada)
- Retirar inscripción
- Descargar certificado (si aplica)
- **(nuevo)** Mostrar un botón de pago “sin funcionalidad” (placeholder)

### Componentes principales

- **`src/pages/participant/ParticipantInscriptionsPage.jsx`**
  - UI con:
    - Barra de búsqueda
    - Tabs de filtro
    - Cards con banner/título/datos
    - Acciones por inscripción (Ver evento, Certificado, Retirar, Pagar-placeholder)

### ¿Por qué a veces ves el `actividadId` en vez del título?

Porque la inscripción (`/inscripciones/obtener/usuario/:id`) **no trae el detalle de la actividad**.Entonces se “enriquece” cada inscripción usando el hook `useMyInscriptions`, que:

- obtiene inscripciones
- luego llama `eventsApi.obtenerPorId(actividadId)` en paralelo
- construye `insc.actividad = ...` para mostrar título/banner/fechas/etc.

Si `eventsApi` falla (403/500/permisos/endpoint mal), entonces `insc.actividad` queda `null` y se muestra:

- `Actividad ${actividadId}` como fallback
- banner por defecto (gradiente)

---

## 4) Hook: useMyInscriptions (enriquecimiento de inscripciones)

Archivo:

- `src/features/participant/hooks/useMyInscriptions.js`

### Qué hace

1. Llama:
   - `inscriptionsApi.obtenerPorUsuario(usuarioId)` → devuelve array de inscripciones
2. Extrae IDs únicos de actividades
3. Llama en paralelo:
   - `eventsApi.obtenerPorId(id)` para cada actividad
4. Construye el “enriched list”:
   - `[{...insc, actividad: act}]`
5. Ordena por fecha de inscripción (más recientes primero)

### Beneficio

La UI de “Mis inscripciones” puede mostrar:

- `actividad.titulo`
- `actividad.bannerUrl`
- `actividad.fechaInicio/Fin`
- `actividad.ubicacion`
  sin que el endpoint de inscripciones tenga que devolver todo.

---

## 5) Hook: useEnrollmentStatus (estado de inscripción por actividad)

Archivo:

- `src/features/participant/hooks/useEnrollmentStatus.js`

### Qué hace

- Cuando hay `usuarioId` y `actividadId`:
  - llama `inscriptionsApi.obtenerPorUsuario(usuarioId)`
  - busca dentro del array la inscripción correspondiente al `actividadId`
  - expone:
    - `inscripcion` (objeto o null)
    - `status` normalizado `{ key, label }`
    - `loading/error`
    - `reload()`

### Uso típico

En el modal de detalle:

- para mostrar “No inscrito / Pendiente / Confirmada / Cancelada”
- para deshabilitar el botón si ya está inscrito

---

## 6) Asistencias por inscripción (useInscriptionAttendance + UI en cards)

### Archivo hook

- `src/features/participant/hooks/useInscriptionAttendance.js`

### Para qué sirve

Traer y mostrar la asistencia del participante por inscripción:

- Llama:
  - `attendancesApi.listarPorInscripcion(inscripcionId)`
- Calcula `stats`:
  - total, presentes, ausentes, porcentaje

### Cómo se usa en UI

En la versión completa de `ParticipantInscriptionsPage` (la que tenía desplegable):

- se puede “expandir” un bloque de asistencias por inscripción
- al expandir, recién se hace la carga (lazy load) para no cargar todo de golpe.

> Si ahora no estás usando ese bloque en la UI, **el hook no rompe nada**, simplemente queda disponible para integrar asistencia/progreso.

---

## 7) API: inscriptionsApi (inscripción / retirar / certificados)

Archivo:

- `src/features/participant/api/inscriptionsApi.js`

### Endpoints usados

- Mis inscripciones:
  - `GET /inscripciones/obtener/usuario/{usuarioId}`
- Retirar:
  - `DELETE /inscripciones/{id}`
- Inscribirse:
  - `POST /usuarios/participante/inscripcion`
- Certificado:
  - `GET /certificaciones/obtener/inscripcion/{inscripcionId}`

### Problemas comunes que vimos

- `estadoId` inválido (ej. `"1"`): el backend espera UUID.
- `VITE_ESTADO_INSCRIPCION_PENDIENTE_ID` desactualizado:
  - el backend respondía: “No se encontró un estado de inscripción con ID ...”
  - solución: volver a listar estados y actualizar `.env`
- 500 interno: normalmente es **datos inválidos** (UUID, estado inexistente, permisos, etc.)

---

## 8) Botón “Pagar” (placeholder)

### Objetivo

Agregar un botón sin funcionalidad por ahora, para que el equipo lo implemente luego.

Recomendación de comportamiento:

- Mostrarlo solo si:
  - la inscripción está `PENDIENTE`
  - y si el evento tiene costo (cuando exista `precio` en el modelo)
- De momento:
  - `onClick={() => alert("🧾 Próximamente: pago en línea")}`

---

## 9) Qué no deberías perder con los cambios

Mientras se mantengan estos hooks/APIs:

- `useMyInscriptions` sigue enriqueciendo con `eventsApi`
- `useEnrollmentStatus` sigue detectando inscripción por actividad
- `inscriptionsApi.inscribirme` es el método correcto (no `inscribirParticipante`)

**No se pierde funcionalidad** siempre que:

- `eventsApi.obtenerPorId` exista y se use de forma consistente
- el token se cargue en `apiClient` (Bearer)
- `.env` tenga los IDs correctos (UUID) y base URL correcta

---

## Checklist de estabilidad (rápido)

- [ ] `VITE_API_URL` apunta al backend correcto
- [ ] `VITE_ESTADO_INSCRIPCION_PENDIENTE_ID` es un UUID válido y existe en backend
- [ ] `eventsApi.obtenerPorId` usa el endpoint correcto: `/actividades/obtener/{id}`
- [ ] Token se guarda en `sessionStorage` como `sigea_token`
- [ ] Interceptor agrega `Authorization: Bearer ...`
- [ ] Rutas de “Ver evento” existen o se cambian a modal

---

## Próximos pasos recomendados (si el equipo continúa)

1. **Listar estados-inscripción por código** (y setear por “PENDIENTE” automáticamente)
2. Implementar “Pagar” cuando exista campo `precio` o `costo` + endpoint de pagos
