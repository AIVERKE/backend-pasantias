<template>
  <div class="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- Header with Glassmorphism -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-4 z-10">
      <div>
        <h2 class="text-2xl font-headline font-bold text-secondary flex items-center gap-2">
          <v-icon icon="mdi-account-group" class="text-primary"></v-icon>
          Equipo Coordinador
        </h2>
        <p class="text-sm text-gray-500 mt-1">Gestiona los jefes de pasantes de tu empresa</p>
      </div>
      <button 
        @click="modalInvitar = true"
        class="w-full sm:w-auto bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-xl shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-2 text-sm"
      >
        <v-icon icon="mdi-account-plus" size="18"></v-icon>
        Invitar Jefe
      </button>
    </div>

    <!-- Loading State with Spinner -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100">
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 rounded-full border-4 border-gray-100"></div>
        <div class="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p class="text-gray-500 mt-4 font-medium">Cargando equipo...</p>
    </div>

    <!-- Lista vacía with Premium Look -->
    <div v-else-if="equipo.length === 0" class="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <v-icon icon="mdi-account-off-outline" size="40" class="text-gray-400"></v-icon>
      </div>
      <h3 class="text-lg font-bold text-secondary">No hay jefes de pasantes</h3>
      <p class="text-gray-500 mt-1 text-sm max-w-sm mx-auto">Aún no has registrado jefes de pasantes para tu empresa. Empieza invitando a uno.</p>
      <button @click="modalInvitar = true" class="text-primary mt-4 hover:text-blue-700 font-medium text-sm flex items-center gap-1 mx-auto">
        <v-icon icon="mdi-plus" size="16"></v-icon>
        Invitar primer jefe
      </button>
    </div>

    <!-- Lista de Tarjetas de Jefes (Responsive) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="jefe in equipo" 
        :key="jefe.id" 
        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
        :class="{'ring-2 ring-primary border-transparent': jefeSeleccionado?.id === jefe.id}"
        @click="seleccionarJefe(jefe)"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <!-- Avatar with gradient on hover -->
              <div class="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-bold text-xl shrink-0 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-blue-600 group-hover:text-white transition-all shadow-sm"
                   :class="{'bg-gradient-to-br from-primary to-blue-600 text-white': jefeSeleccionado?.id === jefe.id}">
                {{ jefe.iniciales }}
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-secondary text-base group-hover:text-primary transition-colors truncate">{{ jefe.nombre }}</h3>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mt-1">
                  {{ jefe.area }}
                </span>
              </div>
            </div>
            
            <!-- Acciones -->
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click.stop="abrirModalEdicion(jefe)" class="text-gray-400 hover:text-primary p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <v-icon icon="mdi-pencil" size="18"></v-icon>
              </button>
              <button @click.stop="confirmarEliminacion(jefe)" class="text-gray-400 hover:text-error p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <v-icon icon="mdi-trash-can-outline" size="18"></v-icon>
              </button>
            </div>
          </div>
          
          <div class="mt-4 flex items-center text-xs text-gray-500">
            <v-icon icon="mdi-email-outline" size="14" class="mr-1.5 text-gray-400"></v-icon>
            <span class="truncate">{{ jefe.email }}</span>
          </div>
        </div>

        <!-- Metrics with subtle background -->
        <div class="bg-gray-50/80 px-6 py-4 flex items-center gap-4 border-t border-gray-100 mt-auto">
          <div class="flex-1 text-center">
            <span class="block text-2xl font-bold text-secondary">{{ jefe.pasantiasActivas }}</span>
            <span class="block text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Pasantías</span>
          </div>
          <div class="w-px h-8 bg-gray-200"></div>
          <div class="flex-1 text-center">
            <span class="block text-2xl font-bold text-success">{{ jefe.pasantesAsignados }}</span>
            <span class="block text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Pasantes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla Desplegable de Pasantes with Glassmorphism -->
    <div v-if="jefeSeleccionado" class="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-8 animate-fade-in-up">
      <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-white">
        <div>
          <h3 class="font-headline font-bold text-secondary text-lg flex items-center gap-2">
            <v-icon icon="mdi-account-hard-hat" size="20" class="text-primary"></v-icon>
            Pasantes a cargo
          </h3>
          <p class="text-xs text-gray-500 mt-0.5">Asignados a <span class="font-medium text-secondary">{{ jefeSeleccionado.nombre }}</span></p>
        </div>
        <button @click="jefeSeleccionado = null" class="text-gray-400 hover:text-gray-600 transition-colors bg-white w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center shadow-sm hover:shadow">
          <v-icon icon="mdi-close" size="18"></v-icon>
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <div v-if="cargandoPasantes" class="p-10 text-center">
          <v-icon icon="mdi-loading" size="24" class="animate-spin text-gray-400"></v-icon>
          <p class="text-gray-500 mt-2 text-sm font-medium">Cargando pasantes...</p>
        </div>
        <div v-else-if="pasantes.length === 0" class="p-10 text-center text-gray-500 flex flex-col items-center">
          <v-icon icon="mdi-account-question-outline" size="32" class="text-gray-300 mb-2"></v-icon>
          <p class="text-sm">No hay pasantes asignados a este jefe</p>
        </div>
        <table v-else class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-100">
              <th class="py-3.5 px-6 font-body text-xs font-semibold text-gray-500 uppercase tracking-wider">Estudiante</th>
              <th class="py-3.5 px-6 font-body text-xs font-semibold text-gray-500 uppercase tracking-wider">Pasantía</th>
              <th class="py-3.5 px-6 font-body text-xs font-semibold text-gray-500 uppercase tracking-wider">Progreso</th>
              <th class="py-3.5 px-6 font-body text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="pasante in pasantes" :key="pasante.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="py-4 px-6 font-medium text-sm text-secondary">{{ pasante.estudiante }}</td>
              <td class="py-4 px-6 text-sm text-gray-500">{{ pasante.pasantia }}</td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-full bg-gray-100 rounded-full h-2 max-w-[100px]">
                    <div class="bg-primary h-2 rounded-full transition-all duration-500" :style="{ width: pasante.progreso + '%' }"></div>
                  </div>
                  <span class="text-xs text-gray-600 font-medium">{{ pasante.progreso }}%</span>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                  {{ pasante.estado }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Invitar Jefe with Premium Look -->
    <div v-if="modalInvitar" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="modalInvitar = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <div class="flex justify-between items-center mb-5">
          <div>
            <h3 class="text-xl font-headline font-bold text-secondary">Invitar Jefe de Pasantes</h3>
            <p class="text-xs text-gray-500 mt-0.5">Completa los datos para enviar el acceso</p>
          </div>
          <button @click="modalInvitar = false" class="text-gray-400 hover:text-gray-600 bg-gray-50 w-8 h-8 rounded-full flex items-center justify-center">
            <v-icon icon="mdi-close" size="18"></v-icon>
          </button>
        </div>
        
        <form @submit.prevent="invitarJefe" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
              <input v-model="nuevoJefe.nombre" type="text" required class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
            
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1">Apellido</label>
              <input v-model="nuevoJefe.apellido" type="text" required class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Email Corporativo</label>
            <input v-model="nuevoJefe.email" type="email" required class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Contraseña de acceso</label>
            <input v-model="nuevoJefe.contrasena" type="password" required class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Min. 6 caracteres" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Departamento / Área</label>
            <input v-model="nuevoJefe.departamento" type="text" required class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Ej. Desarrollo, RRHH" />
          </div>

          <!-- Feedback Alert -->
          <div v-if="mensaje" 
               :class="mensaje.includes('Error') ? 'bg-danger/10 text-danger border-danger/20' : 'bg-success/10 text-success border-success/20'"
               class="border rounded-lg p-3 text-sm flex items-center gap-2">
            <v-icon :icon="mensaje.includes('Error') ? 'mdi-alert-circle-outline' : 'mdi-check-circle-outline'" size="16"></v-icon>
            {{ mensaje }}
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="modalInvitar = false" class="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
              Cancelar
            </button>
            <button type="submit" :disabled="invitando" class="flex-1 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 font-medium text-sm transition-colors flex items-center justify-center gap-2">
              <v-icon v-if="invitando" icon="mdi-loading" size="16" class="animate-spin"></v-icon>
              {{ invitando ? 'Enviando...' : 'Enviar Invitación' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>

    <!-- Modal Editar Jefe -->
    <div v-if="modalEditar" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="modalEditar = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <div class="flex justify-between items-center mb-5">
          <div>
            <h3 class="text-xl font-headline font-bold text-secondary">Editar Jefe de Pasantes</h3>
            <p class="text-xs text-gray-500 mt-0.5">Actualiza los datos del jefe de pasantes</p>
          </div>
          <button @click="modalEditar = false" class="text-gray-400 hover:text-gray-600 bg-gray-50 w-8 h-8 rounded-full flex items-center justify-center">
            <v-icon icon="mdi-close" size="18"></v-icon>
          </button>
        </div>
        
        <form @submit.prevent="actualizarJefe" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
              <input v-model="jefeEditado.nombre" type="text" required class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
            
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1">Apellido</label>
              <input v-model="jefeEditado.apellido" type="text" required class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Email Corporativo</label>
            <input v-model="jefeEditado.email" type="email" required class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Departamento / Área</label>
            <input v-model="jefeEditado.departamento" type="text" required class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="modalEditar = false" class="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
              Cancelar
            </button>
            <button type="submit" :disabled="editando" class="flex-1 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 font-medium text-sm transition-colors flex items-center justify-center gap-2">
              <v-icon v-if="editando" icon="mdi-loading" size="16" class="animate-spin"></v-icon>
              {{ editando ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const authStore = useAuthStore()

// Estado
const loading = ref(true)
const equipo = ref([])
const jefeSeleccionado = ref(null)
const pasantes = ref([])
const cargandoPasantes = ref(false)

// Modales
const modalInvitar = ref(false)
const invitando = ref(false)
const mensaje = ref('')

const modalEditar = ref(false)
const editando = ref(false)
const jefeAEditar = ref(null)

const nuevoJefe = reactive({
  nombre: '',
  apellido: '',
  email: '',
  contrasena: '',
  departamento: '',
})

const jefeEditado = reactive({
  nombre: '',
  apellido: '',
  email: '',
  departamento: '',
})

// Cargar equipo
onMounted(async () => {
  try {
    loading.value = true
    const res = await axios.get('/api/auth/gerente/equipo', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    equipo.value = res.data || []
  } catch (err) {
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
})

// Seleccionar jefe y cargar pasantes
const seleccionarJefe = async (jefe) => {
  if (jefeSeleccionado.value?.id === jefe.id) {
    jefeSeleccionado.value = null
    pasantes.value = []
  } else {
    jefeSeleccionado.value = jefe
    try {
      cargandoPasantes.value = true
      const res = await axios.get(`/api/auth/gerente/equipo/${jefe.id}/pasantes`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      pasantes.value = res.data || []
    } catch (err) {
      console.error('Error:', err)
      pasantes.value = []
    } finally {
      cargandoPasantes.value = false
    }
  }
}

// Invitar nuevo jefe
const invitarJefe = async () => {
  try {
    invitando.value = true
    mensaje.value = ''
    await axios.post('/api/auth/gerente/equipo/invitar', nuevoJefe, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    mensaje.value = 'Jefe invitado correctamente'
    
    // Recargar equipo
    const res = await axios.get('/api/auth/gerente/equipo', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    equipo.value = res.data || []
    
    // Cerrar modal
    setTimeout(() => {
      modalInvitar.value = false
      mensaje.value = ''
      nuevoJefe.nombre = ''
      nuevoJefe.apellido = ''
      nuevoJefe.email = ''
      nuevoJefe.contrasena = ''
      nuevoJefe.departamento = ''
    }, 1500)
  } catch (err) {
    console.error('Error:', err)
    mensaje.value = 'Error al invitar jefe: ' + (err.response?.data?.message || err.message)
  } finally {
    invitando.value = false
  }
}

const abrirModalEdicion = (jefe) => {
  jefeAEditar.value = jefe
  jefeEditado.nombre = jefe.nombre.split(' ')[0] || ''
  jefeEditado.apellido = jefe.nombre.split(' ')[1] || ''
  jefeEditado.email = jefe.email
  jefeEditado.departamento = jefe.area
  modalEditar.value = true
}

const actualizarJefe = async () => {
  try {
    editando.value = true
    await axios.patch(`/api/auth/gerente/equipo/${jefeAEditar.value.id}`, jefeEditado, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    
    Swal.fire({
      icon: 'success',
      title: '¡Actualizado!',
      text: 'El jefe de pasantes ha sido actualizado correctamente.',
      timer: 2000,
      showConfirmButton: false
    })
    
    modalEditar.value = false
    
    // Recargar equipo
    const res = await axios.get('/api/auth/gerente/equipo', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    equipo.value = res.data || []
  } catch (err) {
    console.error('Error:', err)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo actualizar el jefe de pasantes.'
    })
  } finally {
    editando.value = false
  }
}

const confirmarEliminacion = async (jefe) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar a ${jefe.nombre}? Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await axios.delete(`/api/auth/gerente/equipo/${jefe.id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      
      Swal.fire(
        '¡Eliminado!',
        'El jefe de pasantes ha sido eliminado.',
        'success'
      )
      
      // Recargar equipo
      const res = await axios.get('/api/auth/gerente/equipo', {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      equipo.value = res.data || []
      
      if (jefeSeleccionado.value?.id === jefe.id) {
        jefeSeleccionado.value = null
        pasantes.value = []
      }
    } catch (err) {
      console.error('Error:', err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el jefe de pasantes.'
      })
    }
  }
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>