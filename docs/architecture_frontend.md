# Arquitectura Frontend - SIGEA (Sistema de Gestión de Eventos Académicos)

## Información General

**Nombre del Proyecto:** SIGEA - Sistema de Gestión de Eventos Académicos  
**Arquitectura:** Feature-Sliced Design (FSD)  
**Framework:** React 18+  
**Patrón de Comunicación:** API REST  
**Organización:** Por funcionalidades de negocio con separación de capas  
**Universidad:** Universidad Nacional Agraria de la Selva (UNAS)  
**Fecha de creación:** Diciembre 2024  

---

## Tabla de Contenidos

1. [Descripción de la Arquitectura](#descripción-de-la-arquitectura)
2. [Principios de FSD](#principios-de-fsd)
3. [Estructura Completa del Proyecto](#estructura-completa-del-proyecto)
4. [Descripción de Directorios](#descripción-de-directorios)
5. [Flujo de Datos](#flujo-de-datos)
6. [Reglas de Dependencias](#reglas-de-dependencias)
7. [Convenciones de Nombres](#convenciones-de-nombres)
8. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Descripción de la Arquitectura

Feature-Sliced Design (FSD) es una arquitectura frontend que organiza el código por **funcionalidades de negocio** en lugar de por tipo técnico. Cada funcionalidad (feature) es independiente y contiene todo lo necesario para su funcionamiento: UI, lógica, API calls y estado.

### ¿Por qué FSD para SIGEA?

- ✅ **Múltiples roles diferenciados** (Administrador, Organizador, Ponente, Participante, Público)
- ✅ **Escalabilidad** para crecer con nuevas facultades e instituciones
- ✅ **Trabajo en equipo** sin conflictos entre módulos
- ✅ **Separación clara** de responsabilidades
- ✅ **Fácil mantenimiento** y testing
- ✅ **Modularización** por requisitos funcionales del sistema

---

## Principios de FSD

### 1. **Separación por Capas (Layers)**
El proyecto se divide en 5 capas principales con responsabilidades específicas.

### 2. **Aislamiento de Features**
Cada feature es autocontenida y no debe depender de otras features.

### 3. **Flujo de Dependencias Unidireccional**
Las dependencias fluyen de arriba hacia abajo:
```
app → pages → features → entities → shared
```

### 4. **Public API**
Cada módulo expone solo lo necesario mediante index.js (barrel exports).

---

## Estructura Completa del Proyecto

```
/sigea-frontend
│
├── /public                           # Archivos estáticos públicos
│   ├── index.html                    # HTML principal
│   ├── favicon.ico                   # Ícono de la aplicación
│   ├── robots.txt                    # Configuración para crawlers
│   └── /assets                       # Imágenes, logos estáticos
│       ├── /logos
│       │   ├── logo-unas.png
│       │   ├── logo-fiis.png
│       │   └── logo-sigea.png
│       ├── /images
│       │   ├── hero-image.png
│       │   ├── placeholder-event.png
│       │   └── default-avatar.png
│       └── /certificates
│           └── certificate-template.png
│
├── /src                              # Código fuente principal
│   │
│   ├── /app                          # 🔴 CAPA 1: Configuración global de la aplicación
│   │   │
│   │   ├── /providers                # Proveedores de contexto global
│   │   │   ├── AuthProvider.jsx      # Proveedor de autenticación
│   │   │   ├── ThemeProvider.jsx     # Proveedor de tema (light/dark)
│   │   │   ├── ToastProvider.jsx     # Proveedor de notificaciones toast
│   │   │   ├── LanguageProvider.jsx  # Proveedor de internacionalización
│   │   │   └── index.js              # Exportación de todos los providers
│   │   │
│   │   ├── /routes                   # Configuración de rutas
│   │   │   ├── AppRouter.jsx         # Router principal con rutas públicas/privadas
│   │   │   ├── PrivateRoute.jsx      # HOC para rutas protegidas
│   │   │   ├── RoleRoute.jsx         # HOC para rutas por rol
│   │   │   ├── routes.config.js      # Configuración centralizada de rutas
│   │   │   └── index.js
│   │   │
│   │   ├── /store                    # Estado global (Redux Toolkit)
│   │   │   ├── store.js              # Configuración del store
│   │   │   ├── rootReducer.js        # Combinación de reducers
│   │   │   └── index.js
│   │   │
│   │   ├── App.jsx                   # Componente raíz de la aplicación
│   │   ├── App.css                   # Estilos del componente App
│   │   └── index.js                  # Punto de entrada de React
│   │
│   ├── /pages                        # 🟠 CAPA 2: Páginas completas (rutas)
│   │   │
│   │   ├── /public                   # Páginas públicas (sin autenticación)
│   │   │   ├── LandingPage.jsx       # Landing page principal con hero y eventos destacados
│   │   │   ├── EventsPage.jsx        # Catálogo público de eventos disponibles
│   │   │   ├── EventDetailPage.jsx   # Detalle público de un evento
│   │   │   ├── CertificateValidatorPage.jsx # Validador público de certificados
│   │   │   ├── AboutPage.jsx         # Página "Quiénes somos"
│   │   │   └── index.js
│   │   │
│   │   ├── /auth                     # Páginas de autenticación
│   │   │   ├── LoginPage.jsx         # Página de inicio de sesión
│   │   │   ├── RegisterPage.jsx      # Página de registro de usuario
│   │   │   ├── ForgotPasswordPage.jsx # Recuperación de contraseña
│   │   │   ├── ResetPasswordPage.jsx # Reseteo de contraseña por DNI
│   │   │   └── index.js
│   │   │
│   │   ├── /participant              # Páginas del participante
│   │   │   ├── ParticipantDashboardPage.jsx # Dashboard principal del participante
│   │   │   ├── MyEventsPage.jsx      # Mis eventos inscritos
│   │   │   ├── AvailableEventsPage.jsx # Eventos disponibles para inscripción
│   │   │   ├── EventRegistrationPage.jsx # Página de inscripción a evento
│   │   │   ├── MyCertificatesPage.jsx # Mis certificados obtenidos
│   │   │   ├── MyPaymentsPage.jsx    # Historial de pagos
│   │   │   ├── ProfilePage.jsx       # Perfil del participante
│   │   │   └── index.js
│   │   │
│   │   ├── /organizer                # Páginas del organizador
│   │   │   ├── OrganizerDashboardPage.jsx # Dashboard del organizador
│   │   │   ├── ManageEventsPage.jsx  # Gestión de eventos (CRUD)
│   │   │   ├── CreateEventPage.jsx   # Crear nuevo evento
│   │   │   ├── EditEventPage.jsx     # Editar evento existente
│   │   │   ├── EventRegistrationsPage.jsx # Ver inscripciones por evento
│   │   │   ├── AttendanceControlPage.jsx # Control de asistencia
│   │   │   ├── EventReportsPage.jsx  # Reportes del evento
│   │   │   ├── CertificateManagementPage.jsx # Gestión de certificados
│   │   │   ├── PaymentsManagementPage.jsx # Gestión de pagos
│   │   │   └── index.js
│   │   │
│   │   ├── /speaker                  # Páginas del ponente
│   │   │   ├── SpeakerDashboardPage.jsx # Dashboard del ponente
│   │   │   ├── MySessionsPage.jsx    # Mis sesiones asignadas
│   │   │   ├── SessionMaterialsPage.jsx # Materiales de sesión
│   │   │   ├── SessionAttendancePage.jsx # Ver asistencia de sesión
│   │   │   └── index.js
│   │   │
│   │   ├── /admin                    # Páginas del administrador
│   │   │   ├── AdminDashboardPage.jsx # Dashboard principal del admin
│   │   │   ├── UsersManagementPage.jsx # Gestión de usuarios del sistema
│   │   │   ├── EventsOverviewPage.jsx # Visión general de todos los eventos
│   │   │   ├── CertificatesOverviewPage.jsx # Supervisión de certificados
│   │   │   ├── PaymentsOverviewPage.jsx # Supervisión de pagos
│   │   │   ├── ReportsPage.jsx       # Reportes administrativos
│   │   │   ├── SystemConfigPage.jsx  # Configuración del sistema
│   │   │   ├── NotificationsPage.jsx # Gestión de notificaciones masivas
│   │   │   ├── AuditLogPage.jsx      # Logs de auditoría
│   │   │   └── index.js
│   │   │
│   │   └── /error                    # Páginas de error
│   │       ├── NotFoundPage.jsx      # Error 404
│   │       ├── UnauthorizedPage.jsx  # Error 403
│   │       ├── ServerErrorPage.jsx   # Error 500
│   │       └── index.js
│   │
│   ├── /features                     # 🟡 CAPA 3: Funcionalidades de negocio
│   │   │
│   │   ├── /auth                     # Feature: Autenticación y autorización
│   │   │   │
│   │   │   ├── /ui                   # Componentes de UI
│   │   │   │   ├── LoginForm.jsx     # Formulario de login
│   │   │   │   ├── RegisterForm.jsx  # Formulario de registro
│   │   │   │   ├── LogoutButton.jsx  # Botón de cerrar sesión
│   │   │   │   ├── ForgotPasswordForm.jsx # Formulario recuperar contraseña
│   │   │   │   ├── ResetPasswordForm.jsx # Formulario resetear contraseña
│   │   │   │   ├── UserRoleBadge.jsx # Badge mostrando rol del usuario
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /api                  # Llamadas a la API
│   │   │   │   ├── authApi.js        # Endpoints de autenticación
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /hooks                # Hooks personalizados
│   │   │   │   ├── useAuth.js        # Hook para autenticación
│   │   │   │   ├── useLogin.js       # Hook para login
│   │   │   │   ├── useRegister.js    # Hook para registro
│   │   │   │   ├── useLogout.js      # Hook para logout
│   │   │   │   ├── useForgotPassword.js # Hook para recuperación
│   │   │   │   ├── useResetPassword.js # Hook para reseteo por DNI
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /model                # Lógica de negocio y estado
│   │   │   │   ├── authSlice.js      # Redux slice para auth
│   │   │   │   ├── authSelectors.js  # Selectores de estado
│   │   │   │   ├── authUtils.js      # Utilidades de autenticación
│   │   │   │   ├── rolePermissions.js # Permisos por rol
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js              # Public API del feature
│   │   │
│   │   ├── /events                   # Feature: Gestión de eventos académicos
│   │   │   │
│   │   │   ├── /ui
│   │   │   │   ├── EventCard.jsx     # Tarjeta de evento
│   │   │   │   ├── EventList.jsx     # Lista de eventos
│   │   │   │   ├── EventDetail.jsx   # Detalle completo de evento
│   │   │   │   ├── EventForm.jsx     # Formulario CRUD de evento
│   │   │   │   ├── EventFilters.jsx  # Filtros de búsqueda de eventos
│   │   │   │   ├── EventCalendar.jsx # Vista de calendario de eventos
│   │   │   │   ├── EventQRCode.jsx   # Generador de QR del evento
│   │   │   │   ├── EventPublishButton.jsx # Botón publicar evento
│   │   │   │   ├── EventStatusBadge.jsx # Badge de estado del evento
│   │   │   │   ├── EventTypeSelector.jsx # Selector de tipo (curso/taller/etc)
│   │   │   │   ├── EventDurationInput.jsx # Input para duración
│   │   │   │   ├── EventOrganizersSection.jsx # Sección organizadores/sponsors
│   │   │   │   ├── EventContentUploader.jsx # Subida de programa/contenido
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /api
│   │   │   │   ├── eventsApi.js      # Endpoints de eventos
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /hooks
│   │   │   │   ├── useEvents.js      # Hook listar eventos
│   │   │   │   ├── useEvent.js       # Hook evento individual
│   │   │   │   ├── useCreateEvent.js # Hook crear evento
│   │   │   │   ├── useUpdateEvent.js # Hook actualizar evento
│   │   │   │   ├── useDeleteEvent.js # Hook eliminar evento
│   │   │   │   ├── usePublishEvent.js # Hook publicar evento
│   │   │   │   ├── useEventFilters.js # Hook para filtros
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /model
│   │   │   │   ├── eventsSlice.js    # Estado de eventos
│   │   │   │   ├── eventTypes.js     # Tipos de eventos (curso, taller, etc)
│   │   │   │   ├── eventStatus.js    # Estados de eventos
│   │   │   │   ├── eventValidations.js # Validaciones de eventos
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── /registrations            # Feature: Inscripciones a eventos
│   │   │   │
│   │   │   ├── /ui
│   │   │   │   ├── RegistrationForm.jsx # Formulario de inscripción
│   │   │   │   ├── RegistrationList.jsx # Lista de inscripciones
│   │   │   │   ├── RegistrationDetail.jsx # Detalle de inscripción
│   │   │   │   ├── RegistrationStatus.jsx # Estado de inscripción
│   │   │   │   ├── RegistrationDeadline.jsx # Deadline de inscripción
│   │   │   │   ├── RegistrationCancelButton.jsx # Botón cancelar inscripción
│   │   │   │   ├── RegistrationExportButton.jsx # Exportar inscripciones
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /api
│   │   │   │   ├── registrationsApi.js # Endpoints de inscripciones
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /hooks
│   │   │   │   ├── useRegistrations.js # Hook listar inscripciones
│   │   │   │   ├── useRegister.js    # Hook inscribirse a evento
│   │   │   │   ├── useCancelRegistration.js # Hook cancelar inscripción
│   │   │   │   ├── useRegistrationsByEvent.js # Hook inscripciones por evento
│   │   │   │   ├── useExportRegistrations.js # Hook exportar
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /model
│   │   │   │   ├── registrationsSlice.js # Estado de inscripciones
│   │   │   │   ├── registrationStatus.js # Estados de inscripción
│   │   │   │   ├── registrationValidations.js # Validaciones
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── /certificates             # Feature: Certificados digitales
│   │   │   │
│   │   │   ├── /ui
│   │   │   │   ├── CertificateViewer.jsx # Visor de certificado PDF
│   │   │   │   ├── CertificateList.jsx # Lista de certificados
│   │   │   │   ├── CertificateValidator.jsx # Validador de certificados
│   │   │   │   ├── CertificateDownloadButton.jsx # Botón descarga
│   │   │   │   ├── CertificateGenerateButton.jsx # Botón generar
│   │   │   │   ├── CertificateStatusBadge.jsx # Estado del certificado
│   │   │   │   ├── CertificateQRValidator.jsx # Validador por QR
│   │   │   │   ├── CertificateSendButton.jsx # Enviar certificado
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /api
│   │   │   │   ├── certificatesApi.js # Endpoints de certificados
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /hooks
│   │   │   │   ├── useCertificates.js # Hook listar certificados
│   │   │   │   ├── useGenerateCertificate.js # Hook generar
│   │   │   │   ├── useValidateCertificate.js # Hook validar
│   │   │   │   ├── useDownloadCertificate.js # Hook descargar
│   │   │   │   ├── useSendCertificate.js # Hook enviar
│   │   │   │   ├── useCertificateStatus.js # Hook consultar estado
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /model
│   │   │   │   ├── certificatesSlice.js # Estado de certificados
│   │   │   │   ├── certificateStatus.js # Estados del certificado
│   │   │   │   ├── certificateGenerator.js # Lógica de generación
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── /payments                 # Feature: Gestión de pagos
│   │   │   │
│   │   │   ├── /ui
│   │   │   │   ├── PaymentForm.jsx   # Formulario de pago
│   │   │   │   ├── PaymentGateway.jsx # Integración con pasarela
│   │   │   │   ├── PaymentHistory.jsx # Historial de pagos
│   │   │   │   ├── PaymentReceipt.jsx # Comprobante de pago
│   │   │   │   ├── PaymentStatusBadge.jsx # Estado del pago
│   │   │   │   ├── PaymentMethodSelector.jsx # Selector de método
│   │   │   │   ├── ManualPaymentForm.jsx # Registro manual (caja)
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /api
│   │   │   │   ├── paymentsApi.js    # Endpoints de pagos
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /hooks
│   │   │   │   ├── usePayments.js    # Hook listar pagos
│   │   │   │   ├── useProcessPayment.js # Hook procesar pago online
│   │   │   │   ├── useRegisterManualPayment.js # Hook pago manual
│   │   │   │   ├── useVerifyPayment.js # Hook verificar estado
│   │   │   │   ├── usePaymentHistory.js # Hook historial
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /model
│   │   │   │   ├── paymentsSlice.js  # Estado de pagos
│   │   │   │   ├── paymentMethods.js # Métodos de pago
│   │   │   │   ├── paymentStatus.js  # Estados de pago
│   │   │   │   ├── paymentValidations.js # Validaciones
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── /attendance               # Feature: Control de asistencia
│   │   │   │
│   │   │   ├── /ui
│   │   │   │   ├── AttendanceScanner.jsx # Escáner QR de asistencia
│   │   │   │   ├── AttendanceList.jsx # Lista de asistencias
│   │   │   │   ├── AttendanceForm.jsx # Formulario registro manual
│   │   │   │   ├── AttendanceReport.jsx # Reporte de asistencia
│   │   │   │   ├── AttendanceStats.jsx # Estadísticas de asistencia
│   │   │   │   ├── AttendanceExportButton.jsx # Exportar asistencias
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /api
│   │   │   │   ├── attendanceApi.js  # Endpoints de asistencia
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /hooks
│   │   │   │   ├── useAttendance.js  # Hook listar asistencias
│   │   │   │   ├── useRecordAttendance.js # Hook registrar
│   │   │   │   ├── useAttendanceReport.js # Hook reporte
│   │   │   │   ├── useExportAttendance.js # Hook exportar
│   │   │   │   ├── useValidateAttendanceRequirements.js # Hook validar requisitos
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /model
│   │   │   │   ├── attendanceSlice.js # Estado de asistencia
│   │   │   │   ├── attendanceCalculations.js # Cálculos de %
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── /notifications            # Feature: Notificaciones
│   │   │   │
│   │   │   ├── /ui
│   │   │   │   ├── NotificationList.jsx # Lista de notificaciones
│   │   │   │   ├── NotificationItem.jsx # Item individual
│   │   │   │   ├── NotificationBell.jsx # Ícono de notificaciones
│   │   │   │   ├── NotificationCenter.jsx # Centro de notificaciones
│   │   │   │   ├── EmailNotificationForm.jsx # Form envío email
│   │   │   │   ├── WhatsAppNotificationForm.jsx # Form envío WhatsApp
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /api
│   │   │   │   ├── notificationsApi.js # Endpoints de notificaciones
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /hooks
│   │   │   │   ├── useNotifications.js # Hook listar notificaciones
│   │   │   │   ├── useSendNotification.js # Hook enviar
│   │   │   │   ├── useMarkAsRead.js  # Hook marcar como leída
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /model
│   │   │   │   ├── notificationsSlice.js # Estado de notificaciones
│   │   │   │   ├── notificationTypes.js # Tipos de notificación
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── /reports                  # Feature: Informes y reportes
│   │   │   │
│   │   │   ├── /ui
│   │   │   │   ├── ReportViewer.jsx  # Visor de reportes
│   │   │   │   ├── ReportList.jsx    # Lista de reportes
│   │   │   │   ├── ReportUploadForm.jsx # Form subir informe
│   │   │   │   ├── ProposalReportForm.jsx # Informe de propuesta
│   │   │   │   ├── FinalReportForm.jsx # Informe final/entrega
│   │   │   │   ├── EvidenceUploader.jsx # Subir evidencias/fotos
│   │   │   │   ├── AttendanceListReport.jsx # Lista de asistentes
│   │   │   │   ├── ReportExportButton.jsx # Exportar reporte
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /api
│   │   │   │   ├── reportsApi.js     # Endpoints de reportes
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /hooks
│   │   │   │   ├── useReports.js     # Hook listar reportes
│   │   │   │   ├── useUploadReport.js # Hook subir reporte
│   │   │   │   ├── useGenerateReport.js # Hook generar reporte
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /model
│   │   │   │   ├── reportsSlice.js   # Estado de reportes
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── /users                    # Feature: Gestión de usuarios
│   │   │   │
│   │   │   ├── /ui
│   │   │   │   ├── UserList.jsx      # Lista de usuarios
│   │   │   │   ├── UserProfile.jsx   # Perfil de usuario
│   │   │   │   ├── UserForm.jsx      # Formulario CRUD usuario
│   │   │   │   ├── UserRoleAssign.jsx # Asignación de roles
│   │   │   │   ├── UserFilters.jsx   # Filtros de usuarios
│   │   │   │   ├── UserCard.jsx      # Tarjeta de usuario
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /api
│   │   │   │   ├── usersApi.js       # Endpoints de usuarios
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /hooks
│   │   │   │   ├── useUsers.js       # Hook listar usuarios
│   │   │   │   ├── useUser.js        # Hook usuario individual
│   │   │   │   ├── useUpdateProfile.js # Hook actualizar perfil
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /model
│   │   │   │   ├── usersSlice.js     # Estado de usuarios
│   │   │   │   ├── userRoles.js      # Roles de usuario
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   └── /speakers                 # Feature: Gestión de ponentes
│   │       │
│   │       ├── /ui
│   │       │   ├── SpeakerList.jsx   # Lista de ponentes
│   │       │   ├── SpeakerProfile.jsx # Perfil del ponente
│   │       │   ├── SpeakerCard.jsx   # Tarjeta de ponente
│   │       │   ├── SpeakerForm.jsx   # Formulario CRUD ponente
│   │       │   ├── SessionMaterialsUploader.jsx # Subir materiales
│   │       │   └── index.js
│   │       │
│   │       ├── /api
│   │       │   ├── speakersApi.js    # Endpoints de ponentes
│   │       │   └── index.js
│   │       │
│   │       ├── /hooks
│   │       │   ├── useSpeakers.js    # Hook listar ponentes
│   │       │   ├── useSpeaker.js     # Hook ponente individual
│   │       │   └── index.js
│   │       │
│   │       ├── /model
│   │       │   ├── speakersSlice.js  # Estado de ponentes
│   │       │   └── index.js
│   │       │
│   │       └── index.js
│   │
│   ├── /entities                     # 🟢 CAPA 4: Entidades de negocio
│   │   │
│   │   ├── /user                     # Entidad: Usuario
│   │   │   ├── /ui
│   │   │   │   ├── UserAvatar.jsx    # Avatar del usuario
│   │   │   │   ├── UserInfo.jsx      # Información básica
│   │   │   │   ├── UserBadge.jsx     # Badge de usuario
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /model
│   │   │   │   ├── userSchema.js     # Esquema/validaciones
│   │   │   │   ├── userTypes.js      # Tipos de usuario
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── /event                    # Entidad: Evento
│   │   │   ├── /ui
│   │   │   │   ├── EventBadge.jsx    # Badge de evento
│   │   │   │   ├── EventDate.jsx     # Fecha del evento
│   │   │   │   ├── EventType.jsx     # Tipo de evento
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /model
│   │   │   │   ├── eventSchema.js    # Esquema del evento
│   │   │   │   ├── eventConstants.js # Constantes
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── /registration             # Entidad: Inscripción
│   │   │   ├── /ui
│   │   │   │   ├── RegistrationBadge.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /model
│   │   │   │   ├── registrationSchema.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── /certificate              # Entidad: Certificado
│   │   │   ├── /ui
│   │   │   │   ├── CertificateBadge.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /model
│   │   │   │   ├── certificateSchema.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   └── /payment                  # Entidad: Pago
│   │       ├── /ui
│   │       │   ├── PaymentBadge.jsx
│   │       │   └── index.js
│   │       │
│   │       ├── /model
│   │       │   ├── paymentSchema.js
│   │       │   └── index.js
│   │       │
│   │       └── index.js
│   │
│   ├── /shared                       # 🔵 CAPA 5: Código compartido
│   │   │
│   │   ├── /ui                       # Componentes de UI reutilizables
│   │   │   │
│   │   │   ├── /components           # Componentes básicos
│   │   │   │   ├── /Button
│   │   │   │   │   ├── Button.jsx
│   │   │   │   │   ├── Button.styles.js
│   │   │   │   │   ├── Button.test.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Input
│   │   │   │   │   ├── Input.jsx
│   │   │   │   │   ├── Input.styles.js
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Card
│   │   │   │   │   ├── Card.jsx
│   │   │   │   │   ├── Card.styles.js
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Modal
│   │   │   │   │   ├── Modal.jsx
│   │   │   │   │   ├── Modal.styles.js
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Table
│   │   │   │   │   ├── Table.jsx
│   │   │   │   │   ├── TableHeader.jsx
│   │   │   │   │   ├── TableRow.jsx
│   │   │   │   │   ├── TableCell.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Form
│   │   │   │   │   ├── Form.jsx
│   │   │   │   │   ├── FormGroup.jsx
│   │   │   │   │   ├── FormLabel.jsx
│   │   │   │   │   ├── FormError.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Loader
│   │   │   │   │   ├── Loader.jsx
│   │   │   │   │   ├── Spinner.jsx
│   │   │   │   │   ├── Skeleton.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Alert
│   │   │   │   │   ├── Alert.jsx
│   │   │   │   │   ├── AlertSuccess.jsx
│   │   │   │   │   ├── AlertError.jsx
│   │   │   │   │   ├── AlertWarning.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Pagination
│   │   │   │   │   ├── Pagination.jsx
│   │   │   │   │   ├── PageButton.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Badge
│   │   │   │   │   ├── Badge.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Dropdown
│   │   │   │   │   ├── Dropdown.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Tabs
│   │   │   │   │   ├── Tabs.jsx
│   │   │   │   │   ├── Tab.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Select
│   │   │   │   │   ├── Select.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Checkbox
│   │   │   │   │   ├── Checkbox.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Radio
│   │   │   │   │   ├── Radio.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /DatePicker
│   │   │   │   │   ├── DatePicker.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /FileUpload
│   │   │   │   │   ├── FileUpload.jsx
│   │   │   │   │   ├── FilePreview.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /QRCode
│   │   │   │   │   ├── QRCodeGenerator.jsx
│   │   │   │   │   ├── QRCodeScanner.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Toast
│   │   │   │   │   ├── Toast.jsx
│   │   │   │   │   ├── ToastContainer.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /Tooltip
│   │   │   │   │   ├── Tooltip.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   └── index.js           # Barrel export de todos los componentes
│   │   │   │
│   │   │   ├── /layouts              # Layouts de página
│   │   │   │   ├── /MainLayout
│   │   │   │   │   ├── MainLayout.jsx
│   │   │   │   │   ├── Header.jsx
│   │   │   │   │   ├── Footer.jsx
│   │   │   │   │   ├── Sidebar.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /PublicLayout
│   │   │   │   │   ├── PublicLayout.jsx
│   │   │   │   │   ├── PublicHeader.jsx
│   │   │   │   │   ├── PublicFooter.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── /DashboardLayout
│   │   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   │   ├── DashboardSidebar.jsx
│   │   │   │   │   ├── DashboardHeader.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── /styles               # Estilos globales
│   │   │       ├── global.css        # Estilos globales
│   │   │       ├── variables.css     # Variables CSS
│   │   │       ├── theme.js          # Tema de la aplicación
│   │   │       ├── colors.js         # Paleta de colores
│   │   │       └── typography.js     # Tipografías
│   │   │
│   │   ├── /api                      # Configuración de API
│   │   │   ├── apiClient.js          # Cliente Axios configurado
│   │   │   ├── endpoints.js          # URLs de endpoints
│   │   │   ├── interceptors.js       # Interceptores HTTP
│   │   │   ├── errorHandler.js       # Manejo de errores de API
│   │   │   └── index.js
│   │   │
│   │   ├── /lib                      # Librerías externas configuradas
│   │   │   ├── axios.js              # Configuración de Axios
│   │   │   ├── i18n.js               # Configuración i18n
│   │   │   ├── validator.js          # Validaciones con Yup/Zod
│   │   │   ├── pdfGenerator.js       # Generador de PDFs (jsPDF)
│   │   │   ├── excelExporter.js      # Exportador Excel (xlsx)
│   │   │   ├── qrCodeLib.js          # Librería QR (react-qr-code)
│   │   │   └── index.js
│   │   │
│   │   ├── /utils                    # Utilidades generales
│   │   │   ├── /validators           # Validadores
│   │   │   │   ├── emailValidator.js
│   │   │   │   ├── dniValidator.js
│   │   │   │   ├── phoneValidator.js
│   │   │   │   ├── dateValidator.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /formatters           # Formateadores
│   │   │   │   ├── dateFormatter.js
│   │   │   │   ├── currencyFormatter.js
│   │   │   │   ├── textFormatter.js
│   │   │   │   ├── phoneFormatter.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /helpers              # Helpers
│   │   │   │   ├── downloadFile.js
│   │   │   │   ├── generateQR.js
│   │   │   │   ├── fileUpload.js
│   │   │   │   ├── imageResize.js
│   │   │   │   ├── pdfUtils.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── /constants            # Constantes globales
│   │   │   │   ├── roles.js          # Roles del sistema
│   │   │   │   ├── eventTypes.js     # Tipos de eventos
│   │   │   │   ├── status.js         # Estados generales
│   │   │   │   ├── routes.js         # Rutas de la app
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── /hooks                    # Hooks compartidos
│   │   │   ├── useDebounce.js        # Hook para debounce
│   │   │   ├── useLocalStorage.js    # Hook localStorage
│   │   │   ├── useMediaQuery.js      # Hook media queries
│   │   │   ├── usePagination.js      # Hook paginación
│   │   │   ├── useModal.js           # Hook control modales
│   │   │   ├── useForm.js            # Hook formularios
│   │   │   ├── useFileUpload.js      # Hook subida archivos
│   │   │   ├── useExport.js          # Hook exportación
│   │   │   └── index.js
│   │   │
│   │   └── /config                   # Configuraciones
│   │       ├── env.js                # Variables de entorno
│   │       ├── app.config.js         # Configuración app
│   │       ├── api.config.js         # Configuración API
│   │       └── index.js
│   │
│   └── main.jsx                      # Punto de entrada principal de Vite
│
├── .env.example                      # Ejemplo de variables de entorno
├── .env.development                  # Variables desarrollo
├── .env.production                   # Variables producción
├── .gitignore                        # Archivos ignorados por Git
├── .eslintrc.js                      # Configuración ESLint
├── .prettierrc                       # Configuración Prettier
├── vite.config.js                    # Configuración de Vite
├── jsconfig.json                     # Configuración de path aliases
├── package.json                      # Dependencias del proyecto
└── README.md                         # Documentación del proyecto
```

---

## Descripción de Directorios

### 📁 /app - Configuración Global

**Responsabilidad:** Configuración de nivel aplicación que afecta a todo el proyecto.

**Contiene:**
- **Providers:** Contextos globales (Auth, Theme, Toast, Language)
- **Routes:** Configuración de rutas y protección por roles
- **Store:** Estado global con Redux Toolkit

**Regla:** No debe contener lógica de negocio, solo configuración.

---

### 📁 /pages - Páginas de Rutas

**Responsabilidad:** Componentes de página que se mapean 1:1 con las rutas de la aplicación.

**Estructura por Rol:**
- **/public:** Páginas accesibles sin autenticación (Landing, Events, Validator)
- **/auth:** Páginas de autenticación (Login, Register, Forgot/Reset Password)
- **/participant:** Dashboard y funcionalidades del participante
- **/organizer:** Dashboard y gestión completa de eventos
- **/speaker:** Dashboard y gestión de sesiones del ponente
- **/admin:** Dashboard y supervisión completa del sistema

**Regla:** Las páginas ensamblan features y componentes, no contienen lógica compleja.

---

### 📁 /features - Funcionalidades de Negocio

**Responsabilidad:** Funcionalidades completas de negocio, autocontenidas e independientes.

**Estructura Interna de cada Feature:**
```
/nombre-feature
  /ui           # Componentes de interfaz
  /api          # Llamadas a la API
  /hooks        # Hooks personalizados
  /model        # Estado y lógica de negocio
  index.js      # Public API (barrel export)
```

**Features Principales:**
1. **auth** - Autenticación y autorización
2. **events** - Gestión de eventos académicos
3. **registrations** - Inscripciones a eventos
4. **certificates** - Certificados digitales
5. **payments** - Gestión de pagos
6. **attendance** - Control de asistencia
7. **notifications** - Notificaciones email/WhatsApp
8. **reports** - Informes y evidencias
9. **users** - Gestión de usuarios
10. **speakers** - Gestión de ponentes

**Regla:** Un feature NO puede importar de otro feature directamente.

---

### 📁 /entities - Entidades de Negocio

**Responsabilidad:** Representación de entidades del dominio con sus componentes básicos de UI.

**Entidades Principales:**
- **user** - Usuario del sistema
- **event** - Evento académico
- **registration** - Inscripción
- **certificate** - Certificado
- **payment** - Pago

**Regla:** Solo contiene UI básica y modelos de datos, no lógica compleja.

---

### 📁 /shared - Código Compartido

**Responsabilidad:** Código reutilizable en toda la aplicación.

**Estructura:**
- **/ui:** Componentes genéricos (Button, Input, Card, Modal, Table, etc.)
- **/api:** Configuración de Axios y manejo de errores
- **/lib:** Librerías externas configuradas
- **/utils:** Validadores, formateadores, helpers
- **/hooks:** Hooks reutilizables
- **/config:** Configuraciones globales

**Regla:** Debe ser lo más genérico posible, no específico de negocio.

---

## Flujo de Datos

### 1. Flujo de Lectura (Query)

```
Usuario → Página → Feature Hook → API Call → Backend
                      ↓
                   Redux Store
                      ↓
                   Componente UI
```

**Ejemplo: Listar eventos**
```javascript
// pages/public/EventsPage.jsx
import { EventList } from '@/features/events';

function EventsPage() {
  return <EventList />;
}

// features/events/ui/EventList.jsx
import { useEvents } from '../hooks/useEvents';

function EventList() {
  const { events, loading } = useEvents();
  
  if (loading) return <Loader />;
  return events.map(event => <EventCard event={event} />);
}

// features/events/hooks/useEvents.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../api/eventsApi';

export const useEvents = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector(state => state.events);
  
  useEffect(() => {
    dispatch(fetchEvents());
  }, []);
  
  return { events, loading };
};
```

---

### 2. Flujo de Escritura (Mutation)

```
Usuario → Acción UI → Feature Hook → API Call → Backend
                          ↓
                      Redux Store
                          ↓
                      UI Update
```

**Ejemplo: Inscribirse a un evento**
```javascript
// features/registrations/ui/RegistrationForm.jsx
import { useRegister } from '../hooks/useRegister';

function RegistrationForm({ eventId }) {
  const { register, loading, error } = useRegister();
  
  const handleSubmit = async (data) => {
    await register({ eventId, ...data });
  };
  
  return <Form onSubmit={handleSubmit} />;
}

// features/registrations/hooks/useRegister.js
import { registrationsApi } from '../api/registrationsApi';
import { toast } from 'react-toastify';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  
  const register = async (data) => {
    setLoading(true);
    try {
      await registrationsApi.create(data);
      toast.success('Inscripción exitosa');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { register, loading };
};
```

---

## Reglas de Dependencias

### ✅ Permitido

```javascript
// shared puede ser usado por todos
import { Button } from '@/shared/ui/components';

// entities puede ser usado por features y pages
import { UserAvatar } from '@/entities/user';

// features puede ser usado por pages
import { EventList } from '@/features/events';

// app puede usar todo
import { useAuth } from '@/features/auth';
```

### ❌ Prohibido

```javascript
// ❌ Feature NO puede importar otro feature
// features/events/ui/EventCard.jsx
import { usePayments } from '@/features/payments'; // ❌ PROHIBIDO

// ❌ Shared NO puede importar features
// shared/ui/components/Button.jsx
import { useAuth } from '@/features/auth'; // ❌ PROHIBIDO

// ❌ Entities NO puede importar features
// entities/user/ui/UserAvatar.jsx
import { useNotifications } from '@/features/notifications'; // ❌ PROHIBIDO
```

### ✅ Solución: Composición en Pages

```javascript
// ✅ CORRECTO: Componer en la página
// pages/organizer/EventDetailPage.jsx
import { EventDetail } from '@/features/events';
import { PaymentStatus } from '@/features/payments';

function EventDetailPage() {
  return (
    <>
      <EventDetail />
      <PaymentStatus />
    </>
  );
}
```

---

## Convenciones de Nombres

### Archivos y Componentes

```javascript
// Componentes: PascalCase
LoginForm.jsx
EventCard.jsx
UserAvatar.jsx

// Páginas: PascalCase + sufijo "Page"
LoginPage.jsx
AdminDashboardPage.jsx
EventsPage.jsx

// Hooks: camelCase + prefijo "use"
useAuth.js
useEvents.js
useRegister.js

// Utilities: camelCase
emailValidator.js
dateFormatter.js
downloadFile.js

// API: camelCase + sufijo "Api"
authApi.js
eventsApi.js
paymentsApi.js

// Redux: camelCase + sufijo "Slice"
authSlice.js
eventsSlice.js
registrationsSlice.js

// Constantes: SCREAMING_SNAKE_CASE
USER_ROLES.js
EVENT_TYPES.js
PAYMENT_METHODS.js
```

### Carpetas

```
kebab-case para todo
/features/event-management
/shared/ui/components
/pages/certificate-validator
```

---

## Ejemplos de Uso

### Ejemplo 1: Crear un nuevo feature

**Feature: Gestión de Contactos**

```javascript
// 1. Crear estructura
/features/contacts
  /ui
    ContactList.jsx
    ContactForm.jsx
  /api
    contactsApi.js
  /hooks
    useContacts.js
  /model
    contactsSlice.js
  index.js

// 2. Implementar API
// features/contacts/api/contactsApi.js
import { apiClient } from '@/shared/api';

export const contactsApi = {
  getAll: () => apiClient.get('/contacts'),
  create: (data) => apiClient.post('/contacts', data),
};

// 3. Crear hook
// features/contacts/hooks/useContacts.js
import { useState, useEffect } from 'react';
import { contactsApi } from '../api/contactsApi';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchContacts = async () => {
      const response = await contactsApi.getAll();
      setContacts(response.data);
      setLoading(false);
    };
    fetchContacts();
  }, []);
  
  return { contacts, loading };
};

// 4. Crear componente UI
// features/contacts/ui/ContactList.jsx
import { useContacts } from '../hooks/useContacts';
import { Card } from '@/shared/ui/components';

export const ContactList = () => {
  const { contacts, loading } = useContacts();
  
  if (loading) return <div>Cargando...</div>;
  
  return (
    <div>
      {contacts.map(contact => (
        <Card key={contact.id}>{contact.name}</Card>
      ))}
    </div>
  );
};

// 5. Exportar en index.js
// features/contacts/index.js
export { ContactList } from './ui/ContactList';
export { ContactForm } from './ui/ContactForm';
export { useContacts } from './hooks/useContacts';

// 6. Usar en página
// pages/organizer/ContactsPage.jsx
import { ContactList } from '@/features/contacts';

export const ContactsPage = () => {
  return (
    <div>
      <h1>Gestión de Contactos</h1>
      <ContactList />
    </div>
  );
};
```

---

### Ejemplo 2: Crear una nueva página

```javascript
// pages/participant/MyEventsPage.jsx
import { useState } from 'react';
import { MainLayout } from '@/shared/ui/layouts';
import { EventList } from '@/features/events';
import { EventFilters } from '@/features/events';
import { useAuth } from '@/features/auth';

export const MyEventsPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({});
  
  return (
    <MainLayout title="Mis Eventos">
      <div className="container">
        <h1>Bienvenido, {user.name}</h1>
        
        <EventFilters onChange={setFilters} />
        <EventList filters={filters} userId={user.id} />
      </div>
    </MainLayout>
  );
};
```

---

### Ejemplo 3: Compartir lógica entre features

**Problema:** Necesito la información del usuario autenticado en varios features.

**❌ Solución incorrecta:**
```javascript
// features/events/ui/EventCard.jsx
import { useAuth } from '@/features/auth'; // ❌ Feature importando feature
```

**✅ Solución correcta:**
```javascript
// 1. El feature auth expone el hook
// features/auth/index.js
export { useAuth } from './hooks/useAuth';

// 2. Las páginas usan el hook y pasan datos como props
// pages/participant/MyEventsPage.jsx
import { useAuth } from '@/features/auth';
import { EventList } from '@/features/events';

export const MyEventsPage = () => {
  const { user } = useAuth();
  
  return <EventList currentUser={user} />;
};

// 3. El componente recibe los datos por props
// features/events/ui/EventList.jsx
export const EventList = ({ currentUser }) => {
  // Usar currentUser aquí
};
```

---

### Ejemplo 4: Manejo de Estado Global

```javascript
// 1. Crear slice de Redux
// features/events/model/eventsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventsApi } from '../api/eventsApi';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async () => {
    const response = await eventsApi.getAll();
    return response.data;
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default eventsSlice.reducer;

// 2. Registrar en el store
// app/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/model/authSlice';
import eventsReducer from '@/features/events/model/eventsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
  },
});

// 3. Usar en hook
// features/events/hooks/useEvents.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../model/eventsSlice';

export const useEvents = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.events);
  
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);
  
  return { events: items, loading, error };
};
```

---

## Variables de Entorno

### Archivo: `.env.example`

```env
# API Configuration
VITE_API_URL=https://api.sigea.unas.edu.pe/v1
VITE_API_TIMEOUT=10000

# Authentication
VITE_TOKEN_KEY=sigea_token
VITE_TOKEN_EXPIRY=86400000

# Payment Gateways
VITE_YAPE_API_KEY=your_yape_key
VITE_PLIN_API_KEY=your_plin_key
VITE_PAYU_MERCHANT_ID=your_payu_merchant
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx

# WhatsApp API
VITE_WHATSAPP_API_URL=https://api.whatsapp.com
VITE_WHATSAPP_TOKEN=your_whatsapp_token

# Email Service
VITE_EMAIL_SERVICE_URL=https://email.service.com
VITE_EMAIL_FROM=noreply@sigea.unas.edu.pe

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_PAYMENT_GATEWAY=true
VITE_ENABLE_QR_ATTENDANCE=true
VITE_ENABLE_CERTIFICATE_VALIDATION=true

# External Services
VITE_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# App Configuration
VITE_APP_NAME=SIGEA
VITE_APP_VERSION=1.0.0
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=.pdf,.jpg,.png,.jpeg
```

### Archivo: `.env.development`

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000
VITE_TOKEN_KEY=sigea_token_dev
VITE_ENABLE_NOTIFICATIONS=false
```

### Archivo: `.env.production`

```env
VITE_API_URL=https://api.sigea.unas.edu.pe/v1
VITE_API_TIMEOUT=10000
VITE_TOKEN_KEY=sigea_token
VITE_ENABLE_NOTIFICATIONS=true
```

---

## Scripts de package.json

```json
{
  "name": "sigea-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,md}\"",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "@reduxjs/toolkit": "^2.1.0",
    "react-redux": "^9.1.0",
    "axios": "^1.6.7",
    "react-hook-form": "^7.50.0",
    "yup": "^1.3.3",
    "@hookform/resolvers": "^3.3.4",
    "react-toastify": "^10.0.4",
    "react-qr-code": "^2.0.12",
    "qrcode.react": "^3.1.0",
    "jspdf": "^2.5.1",
    "xlsx": "^0.18.5",
    "date-fns": "^3.3.0",
    "react-datepicker": "^6.1.0",
    "react-i18next": "^14.0.5",
    "i18next": "^23.8.2",
    "styled-components": "^6.1.8",
    "framer-motion": "^11.0.5",
    "react-icons": "^5.0.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.0",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "prettier": "^3.2.5",
    "vitest": "^1.2.2",
    "@testing-library/react": "^14.2.0",
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/user-event": "^14.5.2",
    "@vitest/ui": "^1.2.2"
  }
}
```

---

## Configuración de Path Aliases

### Archivo: `jsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/app/*": ["src/app/*"],
      "@/pages/*": ["src/pages/*"],
      "@/features/*": ["src/features/*"],
      "@/entities/*": ["src/entities/*"],
      "@/shared/*": ["src/shared/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Archivo: `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/entities': path.resolve(__dirname, './src/entities'),
      '@/shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### Uso de Aliases:

```javascript
// ✅ Con aliases
import { Button } from '@/shared/ui/components';
import { useAuth } from '@/features/auth';
import { EventList } from '@/features/events';
import { UserAvatar } from '@/entities/user';

// ❌ Sin aliases (evitar)
import Button from '../../../shared/ui/components/Button';
import { useAuth } from '../../features/auth';
```

---

## Mejores Prácticas

### 1. **Barrel Exports (index.js)**

Cada directorio debe tener un `index.js` que exporte su API pública:

```javascript
// features/events/index.js
export { EventList } from './ui/EventList';
export { EventCard } from './ui/EventCard';
export { EventDetail } from './ui/EventDetail';
export { EventForm } from './ui/EventForm';
export { useEvents } from './hooks/useEvents';
export { useEvent } from './hooks/useEvent';

// Uso en otro archivo:
import { EventList, useEvents } from '@/features/events';
```

---

### 2. **Separación de Responsabilidades**

```javascript
// ✅ CORRECTO

// UI: Solo presentación
function EventCard({ event }) {
  return <div>{event.name}</div>;
}

// Hook: Lógica reutilizable
function useEvents() {
  const [events, setEvents] = useState([]);
  // lógica aquí
  return { events };
}

// API: Solo llamadas HTTP
export const eventsApi = {
  getAll: () => axios.get('/events'),
};

// ❌ INCORRECTO: Mezclar todo en un componente
function EventCard({ eventId }) {
  const [event, setEvent] = useState(null);
  
  useEffect(() => {
    axios.get(`/events/${eventId}`).then(res => {
      setEvent(res.data);
    });
  }, []);
  
  return <div>{event?.name}</div>;
}
```

---

### 3. **Manejo de Errores**

```javascript
// Centralizar manejo de errores en shared/api
// shared/api/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Error del servidor (4xx, 5xx)
    return error.response.data.message || 'Error del servidor';
  } else if (error.request) {
    // No hubo respuesta
    return 'No se pudo conectar con el servidor';
  } else {
    // Error al configurar la petición
    return error.message;
  }
};

// Usar en hooks
import { handleApiError } from '@/shared/api/errorHandler';
import { toast } from 'react-toastify';

export const useRegister = () => {
  const register = async (data) => {
    try {
      await registrationsApi.create(data);
      toast.success('Inscripción exitosa');
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
    }
  };
  
  return { register };
};
```

---

### 4. **Loading States**

```javascript
// Siempre manejar estados de carga
function EventList() {
  const { events, loading, error } = useEvents();
  
  if (loading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;
  if (!events.length) return <EmptyState message="No hay eventos" />;
  
  return (
    <div>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

---

### 5. **Validaciones de Formularios**

```javascript
// Usar react-hook-form + yup
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('El nombre es obligatorio'),
  email: yup.string().email('Email inválido').required('El email es obligatorio'),
  eventType: yup.string().required('Seleccione un tipo de evento'),
}).required();

function EventForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <select {...register('eventType')}>
        <option value="">Seleccione...</option>
        <option value="curso">Curso</option>
        <option value="taller">Taller</option>
      </select>
      {errors.eventType && <span>{errors.eventType.message}</span>}
      
      <button type="submit">Crear Evento</button>
    </form>
  );
}
```

---

### 6. **Protección de Rutas por Rol**

```javascript
// app/routes/RoleRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';

export const RoleRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// app/routes/AppRouter.jsx
import { RoleRoute } from './RoleRoute';
import { ROLES } from '@/shared/utils/constants';

<Route
  path="/organizer/events"
  element={
    <RoleRoute allowedRoles={[ROLES.ORGANIZER, ROLES.ADMIN]}>
      <ManageEventsPage />
    </RoleRoute>
  }
/>
```

---

## Checklist de Desarrollo

### Al crear un nuevo feature:

- [ ] Crear carpeta en `/features/nombre-feature`
- [ ] Crear subcarpetas: `/ui`, `/api`, `/hooks`, `/model`
- [ ] Implementar llamadas API en `/api`
- [ ] Crear hooks personalizados en `/hooks`
- [ ] Desarrollar componentes UI en `/ui`
- [ ] Configurar estado en `/model` (si aplica con Redux)
- [ ] Crear `index.js` con barrel exports
- [ ] Documentar el feature en comentarios
- [ ] Escribir tests unitarios

---

### Al crear una nueva página:

- [ ] Crear archivo en `/pages/rol/NombrePage.jsx`
- [ ] Importar features necesarios desde `@/features`
- [ ] Aplicar layout correspondiente (`MainLayout`, `DashboardLayout`, etc.)
- [ ] Configurar ruta en `app/routes/AppRouter.jsx`
- [ ] Aplicar protección por rol con `RoleRoute` si es necesario
- [ ] Verificar que la página se renderiza correctamente

---

### Al crear un componente compartido:

- [ ] Crear en `/shared/ui/components/NombreComponente`
- [ ] Hacerlo genérico y reutilizable (no lógica de negocio)
- [ ] Documentar props esperados con PropTypes o TypeScript
- [ ] Crear archivo de estilos si es necesario
- [ ] Exportar en `index.js` del componente
- [ ] Agregar a `/shared/ui/components/index.js` (barrel export)
- [ ] Escribir tests unitarios

---

## Recursos Adicionales

### Documentación oficial:
- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Axios](https://axios-http.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Yup](https://github.com/jquense/yup)
- [Vite](https://vitejs.dev/)

### Arquitectura:
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### Librerías útiles:
- [React Icons](https://react-icons.github.io/react-icons/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- [date-fns](https://date-fns.org/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [SheetJS](https://sheetjs.com/)

---

## Mantenimiento de esta Documentación

**Responsable:** Equipo de Frontend SIGEA  
**Frecuencia de actualización:** Cada sprint o cuando hay cambios arquitectónicos  
**Versión actual:** 1.0  
**Última actualización:** Diciembre 2024  

---

## Contacto y Soporte

Para dudas o sugerencias sobre la arquitectura:
- **Reuniones:** Daily standup / Sprint planning
- **Documentación adicional:** Consultar ADR002 (Arquitectura Backend)

---

**Nota:** Esta arquitectura es un punto de partida sólido para SIGEA. Puede evolucionar según las necesidades del proyecto. Cualquier cambio significativo debe ser discutido con el equipo de desarrollo y documentado aquí.
