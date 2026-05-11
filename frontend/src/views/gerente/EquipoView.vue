<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-headline font-bold text-secondary">Equipo Coordinador</h2>
      <button 
        @click="modalInvitar = true"
        class="bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm"
      >
        <v-icon icon="mdi-account-plus" size="18"></v-icon>
        Invitar Jefe
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <v-icon icon="mdi-loading" size="32" class="animate-spin text-gray-400"></v-icon>
      <p class="text-gray-500 mt-2">Cargando equipo...</p>
    </div>

    <!-- Lista vacía -->
    <div v-else-if="equipo.length === 0" class="text-center py-12 bg-white rounded-xl border border-gray-200">
      <v-icon icon="mdi-account-group" size="48" class="text-gray-300 mb-4"></v-icon>
      <p class="text-gray-500">No hay chiefs de pasantes en tu empresa</p>
      <button @click="modalInvitar = true" class="text-primary mt-2 hover:underline">
        Invitar primer jefe de pasantes
      </button>
    </div>

    <!-- Lista de Tarjetas de Jefes -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="jefe in equipo" 
        :key="jefe.id" 
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
        :class="{'ring-2 ring-primary border-primary': jefeSeleccionado?.id === jefe.id}"
        @click="seleccionarJefe(jefe)"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-colors"
                   :class="{'bg-primary text-white': jefeSeleccionado?.id === jefe.id}">
                {{ jefe.iniciales }}
              </div>
              <div>
                <h3 class="font-bold text-secondary text-[15px] group-hover:text-primary transition-colors">{{ jefe.nombre }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">{{ jefe.area }}</p>
                <p class="text-xs text-gray-400 mt-1 flex items-center"><v-icon icon="mdi-email-outline" size="12" class="mr-1"></v-icon>{{ jefe.email }}</p>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex items-center gap-4 border-t border-gray-100 pt-4">
            <div class="flex-1 text-center">
              <span class="block text-xl font-bold text-secondary">{{ jefe.pasantiasActivas }}</span>
              <span class="block text-[10px] text-gray-500 uppercase tracking-wide">Pasantías</span>
            </div>
            <div class="w-px h-8 bg-gray-100"></div>
            <div class="flex-1 text-center">
              <span class="block text-xl font-bold text-success">{{ jefe.pasantesAsignados }}</span>
              <span class="block text-[10px] text-gray-500 uppercase tracking-wide">Pasantes</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla Desplegable de Pasantes -->
    <div v-if="jefeSeleccionado" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 animate-fade-in-up">
      <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
        <h3 class="font-headline font-bold text-secondary text-lg flex items-center gap-2">
          <v-icon icon="mdi-account-hard-hat" size="20" class="text-primary"></v-icon>
          Pasantes a cargo de: <span class="text-primary">{{ jefeSeleccionado.nombre }}</span>
        </h3>
        <button @click="jefeSeleccionado = null" class="text-gray-400 hover:text-gray-600 transition-colors bg-white w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
          <v-icon icon="mdi-close" size="18"></v-icon>
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <div v-if="cargandoPasantes" class="p-8 text-center">
          <v-icon icon="mdi-loading" size="24" class="animate-spin text-gray-400"></v-icon>
          <p class="text-gray-500 mt-2">Cargando pasantes...</p>
        </div>
        <div v-else-if="pasantes.length === 0" class="p-8 text-center text-gray-500">
          No hay pasantes asignados a este jefe
        </div>
        <table v-else class="w-full text-left border-collapse min-w-[800px]">
          <thead class="bg-neutral border-b border-gray-200">
            <tr>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estudiante</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Pasantía</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Progreso</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="pasante in pasantes" :key="pasante.id" class="hover:bg-neutral/50 transition-colors">
              <td class="py-4 px-6 font-medium text-sm text-secondary">{{ pasante.nombre }}</td>
              <td class="py-4 px-6 text-sm text-gray-500">{{ pasante.pasantia }}</td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <div class="w-full bg-gray-200 rounded-full h-1.5 max-w-[80px]">
                    <div class="bg-primary h-1.5 rounded-full" :style="{ width: pasante.progreso + '%' }"></div>
                  </div>
                  <span class="text-xs text-gray-500 font-medium">{{ pasante.progreso }}%</span>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-success/10 text-success">
                  {{ pasante.estado }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Invitar Jefe -->
    <div v-if="modalInvitar" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="modalInvitar = false">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-secondary mb-4">Invitar Jefe de Pasantes</h3>
        
        <form @submit.prevent="invitarJefe" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Nombre</label>
            <input v-model="nuevoJefe.nombre" type="text" required class="w-full bg-neutral border border-gray-200 rounded-lg py-2.5 px-3 text-sm" />
          </div>
          
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Apellido</label>
            <input v-model="nuevoJefe.apellido" type="text" required class="w-full bg-neutral border border-gray-200 rounded-lg py-2.5 px-3 text-sm" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Email</label>
            <input v-model="nuevoJefe.email" type="email" required class="w-full bg-neutral border border-gray-200 rounded-lg py-2.5 px-3 text-sm" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Contraseña</label>
            <input v-model="nuevoJefe.contrasena" type="password" required class="w-full bg-neutral border border-gray-200 rounded-lg py-2.5 px-3 text-sm" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Departamento</label>
            <input v-model="nuevoJefe.departamento" type="text" required class="w-full bg-neutral border border-gray-200 rounded-lg py-2.5 px-3 text-sm" />
          </div>

          <div v-if="mensaje" :class="mensaje.includes('Error') ? 'text-danger text-sm' : 'text-success text-sm'">
            {{ mensaje }}
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="modalInvitar = false" class="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" :disabled="invitando" class="flex-1 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
              {{ invitando ? 'Invitando...' : 'Invitar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Estado
const loading = ref(true)
const equipo = ref([])
const jefeSeleccionado = ref(null)
const pasantes = ref([])
const cargandoPasantes = ref(false)

// Modal
const modalInvitar = ref(false)
const invitando = ref(false)
const mensaje = ref('')

const nuevoJefe = reactive({
  nombre: '',
  apellido: '',
  email: '',
  contrasena: '',
  departamento: '',
})

// Cargar equipo
onMounted(async () => {
  try {
    loading.value = true
    const res = await axios.get('/api/auth/gerente/equipo', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    console.log('Equipo data:', res.data)
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
    await axios.post('/api/auth/gerente/equipo/invitar', nuevoJefe, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    mensaje.value = 'Jefe invite correctamente'
    
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
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>