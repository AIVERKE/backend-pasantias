import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/LandingView.vue'),
    },
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'bienvenida',
          name: 'AuthBienvenida',
          component: () => import('@/views/auth/BienvenidaView.vue'),
          meta: { title: 'Bienvenido' }
        },
        {
          path: 'login',
          name: 'AuthLogin',
          component: () => import('@/views/auth/LoginView.vue'),
          meta: { title: 'Iniciar Sesión' }
        },
        {
          path: 'registro-estudiante',
          name: 'AuthRegistroEstudiante',
          component: () => import('@/views/auth/RegistroEstudianteView.vue'),
          meta: { title: 'Registro Estudiante' }
        },
        {
          path: 'registro-tutor',
          name: 'AuthRegistroTutor',
          component: () => import('@/views/auth/RegistroTutorView.vue'),
          meta: { title: 'Registro Tutor' }
        },
        {
          path: 'registro-empresa',
          name: 'AuthRegistroEmpresa',
          component: () => import('@/views/auth/RegistroEmpresaView.vue'),
          meta: { title: 'Registro Empresa' }
        },
        {
          path: 'recuperar-password',
          name: 'AuthRecuperarPassword',
          component: () => import('@/views/auth/RecuperarPasswordView.vue'),
          meta: { title: 'Recuperar Contraseña' }
        },
        {
          path: 'confirmacion',
          name: 'AuthConfirmacion',
          component: () => import('@/views/auth/ConfirmacionView.vue'),
          meta: { title: 'Confirmación' }
        }
      ]
    },
    {
      path: '/sistema',
      component: () => import('@/layouts/SystemLayout.vue'),
      children: [
        {
          path: '/estudiante/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/estudiante/DashboardView.vue'),
          meta: { title: 'Panel Principal', subtitle: 'Resumen de tu progreso como estudiante' }
        },
        {
          path: '/estudiante/pasantias',
          name: 'Pasantias',
          component: () => import('@/views/estudiante/PasantiasView.vue'),
          meta: { title: 'Explorar Pasantías', subtitle: 'Encuentra y postula a nuevas oportunidades' }
        },
        {
          path: '/estudiante/inscripcion',
          name: 'Inscripcion',
          component: () => import('@/views/estudiante/InscripcionView.vue'),
          meta: { title: 'Mi Inscripción', subtitle: 'Gestiona el estado de tus postulaciones' }
        },
        {
          path: '/estudiante/bitacora',
          name: 'Bitacora',
          component: () => import('@/views/estudiante/BitacoraView.vue'),
          meta: { title: 'Bitácora', subtitle: 'Revisa tus registros semanales y puntajes' }
        },
        {
          path: '/estudiante/hoja-vida',
          name: 'HojaVida',
          component: () => import('@/views/estudiante/HojaVidaView.vue'),
          meta: { title: 'Mi Hoja de Vida', subtitle: 'Actualiza tu perfil profesional y habilidades' }
        },
        {
          path: '/estudiante/informe',
          name: 'InformeFinal',
          component: () => import('@/views/estudiante/InformeFinalView.vue'),
          meta: { title: 'Mi Informe Final', subtitle: 'Revisa tu nota final y el informe emitido por la empresa' }
        },
        // --- RUTAS DEL TUTOR ---
        {
          path: '/tutor/dashboard',
          name: 'TutorDashboard',
          component: () => import('@/views/tutor/DashboardView.vue'),
          meta: { title: 'Panel de Tutor', subtitle: 'Resumen de estudiantes a cargo' }
        },
        {
          path: '/tutor/estudiantes',
          name: 'TutorEstudiantes',
          component: () => import('@/views/tutor/MisEstudiantesView.vue'),
          meta: { title: 'Mis Estudiantes', subtitle: 'Listado y estado de pasantes asignados' }
        },
        {
          path: '/tutor/seguimiento',
          name: 'TutorSeguimiento',
          component: () => import('@/views/tutor/SeguimientoView.vue'),
          meta: { title: 'Seguimiento de Estudiante', subtitle: 'Evaluación y revisión de avance' }
        },
        // --- RUTAS DEL JEFE DE PASANTES ---
        {
          path: '/jefe/dashboard',
          name: 'JefeDashboard',
          component: () => import('@/views/jefe/DashboardView.vue'),
          meta: { title: 'Panel Principal', subtitle: 'Resumen operativo' }
        },
        {
          path: '/jefe/inscripciones',
          name: 'JefeInscripciones',
          component: () => import('@/views/jefe/InscripcionesView.vue'),
          meta: { title: 'Inscripciones', subtitle: 'Bandeja de entrada de postulaciones' }
        },
        {
          path: '/jefe/pasantes',
          name: 'JefePasantes',
          component: () => import('@/views/jefe/MisPasantesView.vue'),
          meta: { title: 'Mis Pasantes', subtitle: 'Gestión del ciclo de vida de los estudiantes' }
        },
        {
          path: '/jefe/bitacoras',
          name: 'JefeBitacoras',
          component: () => import('@/views/jefe/BitacorasView.vue'),
          meta: { title: 'Revisión de Bitácoras', subtitle: 'Calificar actividades y registros semanales' }
        },
        {
          path: '/jefe/informes',
          name: 'JefeInformes',
          component: () => import('@/views/jefe/InformesFinalesView.vue'),
          meta: { title: 'Informes Finales', subtitle: 'Emisión de notas y evaluación final' }
        },
        {
          path: '/jefe/actividades',
          name: 'JefeActividades',
          component: () => import('@/views/jefe/ActividadesView.vue'),
          meta: { title: 'Asignación de Actividades', subtitle: 'Gestionar tareas para los pasantes' }
        },
        // --- RUTAS DEL GERENTE ---
        {
          path: '/gerente/dashboard',
          name: 'GerenteDashboard',
          component: () => import('@/views/gerente/DashboardView.vue'),
          meta: { title: 'Panel de Gerencia', subtitle: 'Visión general de la empresa y pasantías' }
        },
        {
          path: '/gerente/empresa',
          name: 'GerenteEmpresa',
          component: () => import('@/views/gerente/MiEmpresaView.vue'),
          meta: { title: 'Mi Empresa', subtitle: 'Perfil corporativo y configuración' }
        },
        {
          path: '/gerente/pasantias',
          name: 'GerentePasantias',
          component: () => import('@/views/gerente/PasantiasView.vue'),
          meta: { title: 'Gestión de Pasantías', subtitle: 'Convocatorias publicadas y borradores' }
        },
        {
          path: '/gerente/equipo',
          name: 'GerenteEquipo',
          component: () => import('@/views/gerente/EquipoView.vue'),
          meta: { title: 'Equipo de Jefes', subtitle: 'Administración del personal a cargo' }
        },
        {
          path: '/gerente/pasantes',
          name: 'GerentePasantes',
          component: () => import('@/views/gerente/PasantesActivosView.vue'),
          meta: { title: 'Pasantes Activos', subtitle: 'Visión global de todos los estudiantes en la empresa' }
        },
        // --- RUTAS DEL SUPER USUARIO (ADMIN) ---
        {
          path: '/admin/dashboard',
          name: 'AdminDashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
          meta: { title: 'Panel Principal', subtitle: 'Centro de control global del sistema' }
        },
        {
          path: '/admin/usuarios',
          name: 'AdminUsuarios',
          component: () => import('@/views/admin/UsuariosView.vue'),
          meta: { title: 'Gestión de Usuarios', subtitle: 'Administración de cuentas por rol' }
        },
        {
          path: '/admin/empresas',
          name: 'AdminEmpresas',
          component: () => import('@/views/admin/EmpresasView.vue'),
          meta: { title: 'Directorio de Empresas', subtitle: 'Registro y validación de empresas aliadas' }
        },
        {
          path: '/admin/pasantias',
          name: 'AdminPasantias',
          component: () => import('@/views/admin/PasantiasGlobalView.vue'),
          meta: { title: 'Catálogo de Pasantías', subtitle: 'Visión global de todas las convocatorias' }
        }
      ]
    }
  ],
})

// ─── Guard de Navegación ─────────────────────────────────────────────────────
// Rutas que NO requieren autenticación
const PUBLIC_ROUTES = ['AuthLogin', 'AuthBienvenida', 'AuthRegistroEstudiante',
  'AuthRegistroTutor', 'AuthRegistroEmpresa', 'AuthRecuperarPassword',
  'AuthConfirmacion', 'home']

router.beforeEach((to, _from) => {
  const auth = useAuthStore()

  const isPublic = PUBLIC_ROUTES.includes(to.name)

  // Si ya está autenticado y quiere ir al login → redirigir al dashboard
  if (auth.isAuthenticated && to.name === 'AuthLogin') {
    return { path: auth.dashboardRoute }
  }

  // Si NO está autenticado y la ruta es privada → redirigir al login
  if (!auth.isAuthenticated && !isPublic) {
    return { name: 'AuthLogin' }
  }
})

export default router

