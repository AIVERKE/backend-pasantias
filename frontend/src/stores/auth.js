import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

// Mapeo tipo_usuario del backend → ruta del dashboard
const DASHBOARD_BY_ROLE = {
  estudiante: '/estudiante/dashboard',
  tutor: '/tutor/dashboard',
  jefe_pasantes: '/jefe/dashboard',
  gerente: '/gerente/dashboard',
  super_usuario: '/admin/dashboard',
}

export const useAuthStore = defineStore('auth', () => {
  // ─── State ───────────────────────────────────────────────────────────────
  const token = ref(localStorage.getItem('access_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  // ─── Getters ─────────────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value)
  const dashboardRoute = computed(() => {
    if (!user.value) return '/auth/login'
    return DASHBOARD_BY_ROLE[user.value.tipo] ?? '/auth/login'
  })

  // ─── Actions ─────────────────────────────────────────────────────────────
  async function login(email, password) {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { access_token, user: userData } = response.data

      // Persistir en localStorage
      token.value = access_token
      user.value = userData
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('auth_user', JSON.stringify(userData))

      // Configurar axios globalmente para todas las peticiones futuras
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      return { success: true, redirectTo: DASHBOARD_BY_ROLE[userData.tipo] ?? '/' }
    } catch (err) {
      const status = err.response?.status
      const backendMessage = err.response?.data?.message

      if (!err.response) {
        // Sin respuesta del servidor (red caída, backend off, CORS)
        error.value = 'No se pudo conectar con el servidor. Verificá que el backend esté corriendo.'
      } else if (status === 401) {
        error.value = 'Correo o contraseña incorrectos. Verificá tus datos e intentá de nuevo.'
      } else if (status === 404) {
        error.value = 'Ruta no encontrada. Contactá al administrador del sistema.'
      } else if (status >= 500) {
        error.value = 'Error interno del servidor. Intentá más tarde.'
      } else {
        // Usar el mensaje del backend si existe
        error.value = Array.isArray(backendMessage)
          ? backendMessage.join(', ')
          : backendMessage || `Error inesperado (${status}). Intentá más tarde.`
      }

      return { success: false }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    error.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('auth_user')
    delete axios.defaults.headers.common['Authorization']
  }

  function clearError() {
    error.value = null
  }

  // Restaurar el header de axios si ya hay token al iniciar la app
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    dashboardRoute,
    login,
    logout,
    clearError,
  }
})
