# frontend-pasantias
Prompt Stitch v4
Sistema de Gestión de Pasantías — UMSA

Modelo Navegacional y Arquitectura de Interfaz de Usuario

1 · Scholar Core
2 · Logo UMSA
3 · Layout global
4 · Menús por rol
5 · Contenido por opción
6 · Auth 7 pantallas
7 · Estilo e interacción
1 Scholar Core — Sistema de diseño
Copiar
Crea un sistema de diseño llamado "Scholar Core" con los siguientes tokens antes de generar cualquier pantalla:

COLORES
· Principal:      #3B82F6  (azul — acciones, enlaces)
· Secundario:     #1A2233  (marino oscuro — fondo barra lateral)
· Terciario:      #D16900  (ámbar — advertencias, alertas)
· Neutro:         #F3F4F6  (gris claro — fondo de página, tarjetas)
· Blanco:         #FFFFFF  (superficie tarjetas, formularios)
· Éxito:          #10B981  (verde — aprobado, completado)
· Peligro:        #EF4444  (rojo — rechazado, alertas)

TIPOGRAFÍA
· Títulos: Manrope 600–700 · Cuerpo: Inter 400–500

COMPONENTES BASE
· Tarjetas: fondo blanco, radius 12px, sombra sutil
· Botones: Principal=#3B82F6 · Secundario=contorno · Terciario=fantasma
· Insignias: píldora, texto 10px, color por estado
· Campos: relleno gris claro, label arriba siempre
· Pestañas: neutro en reposo, #1A2233 o #3B82F6 activo, transición 150ms
· Espaciado: cuadrícula 8px en toda la interfaz

REGLA GLOBAL DE TABLAS
Cada columna tiene su propio campo de búsqueda/filtro inline debajo del encabezado.
Excepción: columna de Acciones no tiene filtro.
Esto reemplaza los filtros globales en la mayoría de vistas.
Este es el bloque base que define todos los tokens del sistema.
2 Logo UMSA — reemplaza ícono de libro en todo el sistema
Copiar
LOGO DEL SISTEMA — UMSA. Nunca usar ícono genérico de libro.

DESCRIPCIÓN DEL LOGO:
Birrete universitario azul + dos flechas curvas (azul y naranja) apuntando derecha + edificio
institucional blanco con ventanas. El logo funciona sobre fondo oscuro (#1A2233).

DÓNDE APARECE:

1. BARRA LATERAL — SECCIÓN SUPERIOR (todas las pantallas del sistema):
   

2. PANTALLAS DE AUTENTICACIÓN — COLUMNA IZQUIERDA:
   

3. ESTADOS DE CONFIRMACIÓN (AUTH-7):
   

3 Layout global y barra lateral
Copiar
DISEÑO GLOBAL — TODAS LAS PANTALLAS DEL SISTEMA INTERNO

BARRA LATERAL IZQUIERDA (fija, 240px, fondo #1A2233):

SECCIÓN SUPERIOR:
· Símbolo gráfico UMSA (40px) + "Pasantia" Manrope 700 blanco
· Subtítulo "UMSA · Academic Ecosystem" Inter 10px blanco 50%

SECCIÓN MEDIA — menú de navegación:
· Ítem: ícono 20px + etiqueta Inter 13px, padding 10px 16px
· Activo: fondo redondeado 8px #3B82F6 + barra izquierda 3px + texto blanco
· Inactivo: texto blanco 70%, hover blanco 90%
· Badge de pendientes: círculo rojo con número a la derecha

SECCIÓN INFERIOR:
· Círculo avatar 36px: iniciales, fondo blanco, texto #1A2233
· Nombre completo Inter 13px 500 blanco
· Rol Inter 11px blanco 60%
· Botón "Cerrar sesión": ícono + texto blanco 60%

ÁREA DE CONTENIDO DERECHA (flex 1, fondo #F3F4F6):
· Barra superior 48px: migas de pan izquierda · búsqueda derecha
· Zona: padding 24px, desplazable
· Encabezado: título Manrope 24px 700 + subtítulo Inter 14px gris
· Contenido carga según opción seleccionada (ver bloque 5)

Responsivo: barra lateral colapsa a 64px solo íconos
4 Menús de navegación por rol
Copiar
MENÚ DE NAVEGACIÓN POR ROL — VERSIÓN FINAL

─── ESTUDIANTE ─────────────────────────────────────
· 🎓 Panel Principal   — dashboard con resumen
· 📢 Ver Pasantías     — explorar convocatorias
· 📋 Mi Inscripción    — estado y postulaciones (con pestañas por postulación)
· 📓 Bitácora          — ver entradas y puntuaciones (solo lectura)
· 📄 Mi Hoja de Vida   — perfil, habilidades y link a CV en Drive
· 📊 Mi Informe Final  — ver informe emitido + historial

─── TUTOR ──────────────────────────────────────────
· 🏠 Panel Principal   — resumen de estudiantes y pendientes
· 👥 Mis Estudiantes   — tabla de estudiantes asignados
· 📈 Seguimiento       — progreso detallado por estudiante
NOTA: menú "Evaluaciones" eliminado.

─── JEFE DE PASANTES ────────────────────────────────
· 🏠 Panel Principal   — resumen operativo y búsqueda
· 📥 Inscripciones     — bandeja con badge de pendientes
· 👷 Mis Pasantes      — tabla con gestión de estado
· 📓 Bitácoras         — revisar, calificar y observaciones
· 📑 Informes Finales  — emitir informes generados
· 🗂 Actividades       — crear, editar y asignar

─── GERENTE ─────────────────────────────────────────
· 🏠 Panel Principal   — resumen empresa y estadísticas
· 🏢 Mi Empresa        — perfil editable
· 📢 Pasantías         — gestión (publicadas, borradores, archivadas)
· 👥 Equipo            — gestionar Jefes y ver sus pasantes
· 👷 Pasantes Activos  — todos con filtros
NOTA: menú "Estadísticas" eliminado.

─── SUPER USUARIO ───────────────────────────────────
· 🏠 Panel Principal   — estado global, tarjetas-botón y solicitudes
· 👤 Usuarios          — gestión completa con pestañas por rol
· 🏢 Empresas          — registro, aprobación y detalle
· 📋 Pasantías         — catálogo global con filtros
NOTA: "Reportes Globales" y "Configuración" eliminados.
5 Área de contenido derecha — cómo carga cada opción (★ MÁS IMPORTANTE)
Copiar
[Este bloque es muy largo — contiene la especificación completa de cada vista por rol]

RESUMEN RÁPIDO DE VISTAS POR ROL:

ESTUDIANTE:
· Panel Principal → DASHBOARD (3 tarjetas + lista bitácora)
· Ver Pasantías → TARJETAS con pestañas + panel lateral (600px) con comentarios de ex pasantes
· Mi Inscripción → DETALLE con pestañas (una por postulación aprobada/rechazada/pendiente)
· Bitácora → LISTA + PANEL con pestañas [Mis Entradas | Actividades] — solo lectura
· Mi Hoja de Vida → FORMULARIO editable con pestañas [Resumen | Habilidades | Historial]
  + campo Link a CV en Drive
· Mi Informe Final → DETALLE + lista de pasantías realizadas con logo empresa y nota

TUTOR:
· Panel Principal → DASHBOARD (2 tarjetas + lista estudiantes con menos progreso)
· Mis Estudiantes → TABLA con filtro por columna
· Seguimiento → TABLA + desplegable para seleccionar estudiante

JEFE DE PASANTES:
· Panel Principal → DASHBOARD + barra búsqueda por nombre/CI + lista inscripciones recientes (scroll)
· Inscripciones → TABLA con pestañas [Pendientes🔴 | Aprobadas | Rechazadas | Todas] + filtro por columna
· Mis Pasantes → TABLA + cambio de estado (Activo/Licencia/Abandono/Conclusión) + dar de baja
· Bitácoras → LISTA agrupada + PANEL LATERAL para editar notas y observaciones por actividad
· Informes Finales → TABLA + nota calculada automáticamente desde promedio de actividades
· Actividades → TABLA + modal para crear/asignar (a todos o un pasante específico)

GERENTE:
· Panel Principal → DASHBOARD (3 tarjetas + lista pasantías activas)
· Mi Empresa → DETALLE editable + sección Equipo con jefes
· Pasantías → TABLA con pestañas [Publicadas | Borradores | Archivadas] + enlace al jefe
· Equipo → LISTA tarjetas de jefes + despliega tabla de sus pasantes al clic
· Pasantes Activos → TABLA con filtro por columna

SUPER USUARIO:
· Panel Principal → DASHBOARD con tarjetas-botón navegables + lista solicitudes pendientes
· Usuarios → TABLA con pestañas [Todos | Estudiantes | Tutores | Jefes | Gerentes] + filtro por columna
· Empresas → TABLA con banner de pendientes + aprobación/rechazo
· Pasantías → TABLA con filtros y acciones
Este bloque define EXACTAMENTE cómo carga cada pantalla — es el más importante para la consistencia.
6 Pantallas de autenticación (7 pantallas)
Copiar
PANTALLAS DE AUTENTICACIÓN

DISEÑO BASE — layout 50/50:
COLUMNA IZQUIERDA fondo #1A2233:
· Logo UMSA completo: símbolo (64px) + "Sistema de Gestión de Pasantias" + "UMSA"
· Patrón geométrico azul baja opacidad
· Frase pie: "Conectando el talento universitario con el mundo profesional"

COLUMNA DERECHA fondo blanco, formulario centrado
Mobile: solo columna derecha, símbolo UMSA pequeño arriba

AUTH-1 — BIENVENIDA
Tres tarjetas (72px): "Soy estudiante" (azul) · "Soy tutor" (borde azul) · "Registrar empresa" (borde azul)

AUTH-2 — INICIO DE SESIÓN
Campos: Correo · Contraseña (ojo) · "¿Olvidaste tu contraseña?"
Botón "Iniciar sesión" azul · "Crear una cuenta"

AUTH-3 — REGISTRO ESTUDIANTE (2 pasos)
Paso 1: Nombre · Apellido · Correo institucional · Código estudiantil · Carrera · Semestre
Paso 2: Contraseña + indicador fortaleza (4 segmentos) · Confirmar · Términos

AUTH-4 — REGISTRO TUTOR (2 pasos)
Paso 1: Nombre · Apellido · Correo · Especialidad · Institución
Paso 2: igual a estudiante
Aviso ámbar: "Tu cuenta quedará pendiente de aprobación"

AUTH-5 — REGISTRO EMPRESA + GERENTE (3 pasos)
Paso 1: Nombre empresa · Rubro · Dirección · Teléfono
Paso 2: Nombre · Apellido · Correo corporativo · Cargo · Carrera
Paso 3: Seguridad + aviso ámbar

AUTH-6 — RECUPERAR CONTRASEÑA
Ícono sobre en círculo · Campo correo · Botón "Enviar instrucciones"
Estado éxito: check verde + "Revisa tu correo"

AUTH-7 — CONFIRMACIÓN
· Estudiante: check verde + "¡Listo! Ya puedes explorar pasantías"
· Tutor/Gerente: check ámbar + "Solicitud enviada — recibirás correo al ser aprobada"
· Jefe: check verde + "Cuenta activada. Ya puedes gestionar pasantes"
7 Estilo, interacción y flujos globales
Copiar
NOTAS DE ESTILO, INTERACCIÓN Y FLUJOS — VERSIÓN FINAL

FLUJO DE AUTENTICACIÓN:
AUTH-1 "Soy estudiante" → AUTH-3 → AUTH-7 → Dashboard Estudiante (acceso inmediato)
AUTH-1 "Soy tutor" → AUTH-4 → AUTH-7 pendiente → espera aprobación
AUTH-1 "Registrar empresa" → AUTH-5 → AUTH-7 pendiente → espera aprobación
AUTH-1 "Ya tengo cuenta" → AUTH-2 → Dashboard según rol
AUTH-2 "¿Olvidé contraseña?" → AUTH-6 → estado éxito
Jefe: correo invitación del gerente → establece contraseña → Dashboard Jefe
Super Usuario: creado solo por otro Super Usuario

LOGO UMSA — REGLA ABSOLUTA:

REGLA GLOBAL DE TABLAS:
· Filtro inline por columna debajo del encabezado
· Columna Acciones NUNCA tiene filtro
· Aplica a: Inscripciones, Pasantes, Bitácoras, Usuarios, Empresas, Pasantías global

PANEL LATERAL DESLIZANTE:
· Ancho 480px (600px para pasantía con comentarios)
· Entra desde derecha 200ms slide
· Fondo blanco, sombra izquierda, botón X, cuerpo desplazable
· Pie con botones de acción
· Contenido principal NO se oscurece

MODALES:
· Fondo oscuro semitransparente · Tarjeta blanca centrada radius 12px
· Máximo 2 acciones: primaria azul + cancelar fantasma
· Usar para: confirmar postulación, aprobar/rechazar, crear actividad, dar de baja

TARJETAS DE ESTADÍSTICAS:
· Borde izquierdo 4px: azul=estudiante/tutor, ámbar=jefe, verde=gerente, marino=superusuario
· Super Usuario: tarjetas funcionan como botones con flecha → y cursor pointer
· Número: Manrope 32px 700 · Subtítulo: Inter 12px #6B7280

INFORME FINAL — FLUJO:
· Sistema calcula automáticamente la nota desde promedio de actividades en Bitácora
· Jefe de Pasantes genera el informe con esa nota pre-cargada
· Informe visible (solo lectura) para Tutor y Estudiante

INSCRIPCIÓN — REGLA DE APROBACIÓN:
· Estudiante puede postular a múltiples pasantías
· Al ser aprobado en una, el sistema marca automáticamente las demás como rechazadas
· Pantalla "Mi Inscripción" muestra todas en pestañas separadas

ESTADO DE PASANTE (gestionado por Jefe):
· Estados: Activo · Licencia · Abandono · Conclusión
· "Dar de baja" requiere motivo + observación

CONSISTENCIA GLOBAL:
· Manrope solo para títulos y números grandes
· Inter para todo lo demás
· Espaciado múltiplos de 8px
· Sin gradientes ni sombras pesadas
· Scholar Core en las 14 pantallas del sistema
Bloque final con instrucciones de interacción y flujos — SIEMPRE pegar al final para cerrar el prompt.
Instrucciones de uso: Copia cada bloque en orden (1 al 7) en Stitch o tu plataforma de prototipado. Comienza con Scholar Core, sigue con Logo UMSA, y termina con Estilo e Interacción.

Versión: 4.0 — Abril 2026
Sistema: Gestión de Pasantías UMSA
Total de pantallas: 14 (7 autenticación + 7 del sistema)