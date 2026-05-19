<template>
  <div class="flex h-screen bg-neutral font-body text-secondary overflow-hidden">
    <!-- Overlay para móvil -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-black/50 z-40 md:hidden" 
      @click="isSidebarOpen = false"
    ></div>

    <!-- Barra Lateral Izquierda -->
    <aside 
      class="w-[240px] bg-secondary text-white flex flex-col shrink-0 transition-all duration-300 fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0"
      :class="[isSidebarOpen ? 'translate-x-0' : '-translate-x-full']"
    >
      <!-- Sección Superior: Logo -->
      <div class="h-28 flex items-center justify-center py-4 px-2 border-b border-white/10">
        <!-- Logo UMSA (logotipo_letras.png) -->
        <img src="/images/logotipo_letras.png" alt="Sistema de Gestión de Pasantías" class="h-full object-contain drop-shadow-md brightness-200 scale-125" />
      </div>

      <!-- Sección Media: Menú de Navegación -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <!-- Aquí irán los links dinámicos según el rol -->
        <router-link 
          v-for="item in menuItems" 
          :key="item.path" 
          :to="item.path"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-colors"
          active-class="bg-primary text-white border-l-[3px] border-l-white font-medium"
          :class="[$route.path === item.path ? '' : 'text-white/70 hover:text-white/90 hover:bg-white/5']"
        >
          <v-icon :icon="item.icon" size="20"></v-icon>
          <span>{{ item.label }}</span>
          
          <!-- Badge de pendientes -->
          <span v-if="item.badge" class="ml-auto bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {{ item.badge }}
          </span>
        </router-link>
      </nav>

      <!-- Sección Inferior: Perfil y Cerrar Sesión -->
      <div class="p-4 border-t border-white/10 flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <!-- Círculo Avatar -->
          <div class="w-9 h-9 rounded-full bg-white text-secondary flex items-center justify-center text-sm font-bold shrink-0">
            {{ userInitials }}
          </div>
          <div class="flex flex-col overflow-hidden">
            <span class="text-[13px] font-medium text-white truncate">{{ userName }}</span>
            <span class="text-[11px] text-white/60 truncate">{{ userRoleName }}</span>
          </div>
        </div>
        <button @click="handleLogout" class="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 text-[12px] mt-2 transition-colors px-3 py-2 rounded-lg">
          <v-icon icon="mdi-logout" size="16"></v-icon>
          Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Área de Contenido Derecha -->
    <main class="flex-1 flex flex-col min-w-0">
      <!-- Barra Superior -->
      <header class="h-[48px] bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <div class="flex items-center gap-4">
          <!-- Botón Hamburguesa -->
          <button 
            @click="isSidebarOpen = !isSidebarOpen" 
            class="text-gray-500 hover:text-secondary focus:outline-none md:hidden"
            aria-label="Abrir menú"
          >
            <v-icon icon="mdi-menu" size="24"></v-icon>
          </button>
          
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <!-- Migas de pan -->
            <span>Pasantías UMSA</span>
            <v-icon icon="mdi-chevron-right" size="16"></v-icon>
            <span class="text-secondary font-medium">{{ currentRouteName }}</span>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <div class="w-64 hidden sm:block">
            <!-- Búsqueda Global -->
            <div class="relative">
              <v-icon icon="mdi-magnify" size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></v-icon>
              <input 
                type="text" 
                placeholder="Buscar..." 
                class="w-full bg-neutral text-sm rounded-md py-1.5 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary"
              />
            </div>
          </div>
          
          <!-- Notificaciones (Campana) -->
          <button id="notif-btn" class="relative text-gray-500 hover:text-primary transition-colors focus:outline-none">
            <v-badge
              :content="unreadNotifications"
              color="error"
              :model-value="unreadNotifications > 0"
            >
              <v-icon icon="mdi-bell-outline" size="24"></v-icon>
            </v-badge>

            <v-menu activator="parent" location="bottom end" transition="slide-y-transition">
              <v-list class="py-0 rounded-xl elevation-3 border border-gray-100 mt-2 overflow-hidden" max-width="320">
                <div class="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <span class="text-sm font-bold text-secondary">Notificaciones</span>
                </div>
                
                <div class="max-h-[350px] overflow-y-auto">
                  <div v-if="notificacionesPrueba.length === 0" class="py-6 text-center text-sm text-gray-500 font-medium">
                    No tienes notificaciones
                  </div>
                  <v-list-item 
                    v-for="(notif, idx) in notificacionesPrueba" 
                    :key="idx" 
                    link 
                    class="border-b border-gray-50 hover:bg-blue-50/50 py-3"
                    @click="manejarClickNotificacion(idx)"
                  >
                    <template v-slot:prepend>
                      <div class="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center mr-3 border border-blue-100">
                        <v-icon :icon="notif.icon" size="small"></v-icon>
                      </div>
                    </template>
                    <v-list-item-title class="text-[13px] font-bold text-gray-700 mb-0.5" style="white-space: normal;">
                      {{ notif.titulo }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-[11px] text-gray-500" style="white-space: normal;">
                      {{ notif.texto }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </div>
              </v-list>
            </v-menu>
          </button>
        </div>
      </header>

      <!-- Zona de Contenido Desplazable -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Encabezado de Página -->
        <div class="mb-6">
          <h1 class="text-[24px] font-headline font-bold text-secondary">{{ pageTitle }}</h1>
          <p class="text-[14px] text-gray-500 mt-1">{{ pageSubtitle }}</p>
        </div>

        <!-- Renderiza la vista hija aquí -->
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isSidebarOpen = ref(false)
const unreadNotifications = ref(0)
let notifInterval = null

// Datos de prueba solicitados para el diseño del menú
const notificacionesPrueba = ref([
  { icon: 'mdi-message-text-outline', titulo: 'Mensaje nuevo', texto: 'Respuesta del Jefe de Pasantes en Actividad X', tiempo: 'Hace 5 min' },
  { icon: 'mdi-message-text-outline', titulo: 'Mensaje nuevo', texto: 'Consulta del Tutor Académico', tiempo: 'Hace 1 hora' },
  { icon: 'mdi-message-text-outline', titulo: 'Mensaje nuevo', texto: 'Corrección enviada', tiempo: 'Ayer' },
  { icon: 'mdi-pin-outline', titulo: 'Actividad asignada', texto: 'Nueva tarea inyectada en la Bitácora', tiempo: 'Ayer' },
])

const fetchNotifications = async () => {
  // Mock logic para la UI: se basa en nuestro array de prueba en lugar del backend temporalmente
  unreadNotifications.value = notificacionesPrueba.value.length
}

const manejarClickNotificacion = (idx) => {
  // 1. Borrar la notificación del array
  notificacionesPrueba.value.splice(idx, 1)
  
  // 2. Actualizar el contador de la campana
  unreadNotifications.value = notificacionesPrueba.value.length

  // 3. Navegar a la bitácora
  if (authStore.user?.tipo === 'estudiante') {
    router.push('/estudiante/bitacora')
  }
}

onMounted(() => {
  fetchNotifications()
})

onUnmounted(() => {
  if (notifInterval) clearInterval(notifInterval)
})

// Cerrar sidebar al cambiar de ruta
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

// Detectar rol actual basado en la ruta (Mock)
const isTutor = computed(() => route.path.includes('/tutor'))
const isJefe = computed(() => route.path.includes('/jefe'))
const isGerente = computed(() => route.path.includes('/gerente'))
const isAdmin = computed(() => route.path.includes('/admin'))

// Datos del usuario desde el store de auth
const currentUser = computed(() => authStore.user)
const isAuth = computed(() => authStore.isAuthenticated)

const userName = computed(() => {
  if (!isAuth.value || !currentUser.value) return 'Usuario'
  return `${currentUser.value.nombre} ${currentUser.value.apellido}`.trim()
})

const userInitials = computed(() => {
  if (!isAuth.value || !currentUser.value) return 'U'
  const nombre = currentUser.value.nombre || ''
  const apellido = currentUser.value.apellido || ''
  if (nombre && apellido) return `${nombre[0]}${apellido[0]}`.toUpperCase()
  return (nombre[0] || apellido[0] || 'U').toUpperCase()
})

const userRoleName = computed(() => {
  if (!isAuth.value || !currentUser.value) return 'Usuario'
  const roleMap = {
    super_usuario: 'Super Usuario',
    gerente: 'Gerente General',
    jefe_pasantes: 'Jefe de Pasantes',
    tutor: 'Tutor UMSA',
    estudiante: 'Estudiante'
  }
  return roleMap[currentUser.value.tipo] || 'Usuario'
})

// Menús dinámicos
const menuItems = computed(() => {
  if (isAdmin.value) {
    return [
      { label: 'Panel Principal', path: '/admin/dashboard', icon: 'mdi-view-dashboard' },
      { label: 'Usuarios', path: '/admin/usuarios', icon: 'mdi-account-multiple' },
      { label: 'Empresas', path: '/admin/empresas', icon: 'mdi-domain', badge: '2' },
      { label: 'Pasantías', path: '/admin/pasantias', icon: 'mdi-bullhorn' }
    ]
  } else if (isGerente.value) {
    return [
      { label: 'Panel Principal', path: '/gerente/dashboard', icon: 'mdi-view-dashboard' },
      { label: 'Mi Empresa', path: '/gerente/empresa', icon: 'mdi-domain' },
      { label: 'Pasantías', path: '/gerente/pasantias', icon: 'mdi-bullhorn' },
      { label: 'Equipo', path: '/gerente/equipo', icon: 'mdi-account-group' },
      { label: 'Pasantes Activos', path: '/gerente/pasantes', icon: 'mdi-account-hard-hat' }
    ]
  } else if (isJefe.value) {
    return [
      { label: 'Panel Principal', path: '/jefe/dashboard', icon: 'mdi-view-dashboard' },
      { label: 'Inscripciones', path: '/jefe/inscripciones', icon: 'mdi-inbox-arrow-down' },
      { label: 'Mis Pasantes', path: '/jefe/pasantes', icon: 'mdi-account-hard-hat' },
      { label: 'Bitácoras', path: '/jefe/bitacoras', icon: 'mdi-notebook-check' },
      { label: 'Informes Finales', path: '/jefe/informes', icon: 'mdi-file-certificate' },
      { label: 'Actividades', path: '/jefe/actividades', icon: 'mdi-format-list-checks' }
    ]
  } else if (isTutor.value) {
    return [
      { label: 'Panel Principal', path: '/tutor/dashboard', icon: 'mdi-view-dashboard' },
      { label: 'Mis Estudiantes', path: '/tutor/estudiantes', icon: 'mdi-account-group' },
      { label: 'Seguimiento', path: '/tutor/seguimiento', icon: 'mdi-clipboard-check' }
    ]
  } else {
    return [
      { label: 'Panel Principal', path: '/estudiante/dashboard', icon: 'mdi-view-dashboard' },
      { label: 'Ver Pasantías', path: '/estudiante/pasantias', icon: 'mdi-bullhorn' },
      { label: 'Mi Inscripción', path: '/estudiante/inscripcion', icon: 'mdi-clipboard-text' },
      { label: 'Bitácora', path: '/estudiante/bitacora', icon: 'mdi-notebook' },
      { label: 'Mi Hoja de Vida', path: '/estudiante/hoja-vida', icon: 'mdi-file-document' },
      { label: 'Mi Informe Final', path: '/estudiante/informe', icon: 'mdi-chart-bar' }
    ]
  }
})

const currentRouteName = computed(() => route.meta.title || 'Inicio')
const pageTitle = computed(() => route.meta.title || 'Panel Principal')
const pageSubtitle = computed(() => route.meta.subtitle || 'Bienvenido al sistema')

const handleLogout = async () => {
  const token = authStore.token  // Guardar token ANTES de limpiar
  
  // 1. Limpiar estado local INMEDIATO (sin esperar al backend)
  authStore.logout()
  
  // 2. Llamar al backend para auditoría (si tenemos token válido)
  if (token) {
    axios.post('/api/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {
      // Silenciar errores - el logout local ya se ejecutó
    })
  }
  
  // 3. Redireccionar al login
  await router.push('/auth/login')
}
</script>
