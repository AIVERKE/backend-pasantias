<template>
  <div class="space-y-6">
    <!-- Tarjetas de Resumen -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-[#D16900] flex flex-col justify-between hover:shadow-md transition-shadow">
        <h3 class="font-body text-xs font-semibold text-gray-500 uppercase tracking-wider">Pasantes Activos</h3>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="font-headline text-3xl font-bold text-secondary">{{ pasantesActivos }}</span>
          <span class="text-sm text-success font-medium">+2 este mes</span>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-[#D16900] flex flex-col justify-between hover:shadow-md transition-shadow">
        <h3 class="font-body text-xs font-semibold text-gray-500 uppercase tracking-wider">Inscripciones Pendientes</h3>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="font-headline text-3xl font-bold text-secondary">{{ inscripcionesPendientes }}</span>
          <span class="text-sm text-danger font-medium">Requieren revisión</span>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-[#D16900] flex flex-col justify-between hover:shadow-md transition-shadow">
        <h3 class="font-body text-xs font-semibold text-gray-500 uppercase tracking-wider">Informes por Emitir</h3>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="font-headline text-3xl font-bold text-secondary">{{ informesPorEmitir }}</span>
          <span class="text-sm text-gray-500 font-medium">Fin de pasantía</span>
        </div>
      </div>
    </div>

    <!-- Barra de Búsqueda Rápida y Título de Lista -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 mb-4">
      <h2 class="text-lg font-headline font-bold text-secondary">Inscripciones Recientes</h2>
      <div class="relative w-full md:w-80">
        <v-icon icon="mdi-magnify" size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></v-icon>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por nombre o CI..." 
          class="w-full bg-white text-sm rounded-lg py-2 pl-9 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
        />
      </div>
    </div>

    <!-- Lista de Inscripciones Recientes (Scroll) -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="max-h-[400px] overflow-y-auto">
        <div v-if="loading" class="p-6 text-center text-gray-500">
          <v-icon icon="mdi-loading" size="24" class="animate-spin mr-2"></v-icon>
          Cargando...
        </div>
        <div v-else-if="error" class="p-6 text-center text-danger">
          {{ error }}
        </div>
        <div v-else-if="filteredInscripciones.length === 0" class="p-6 text-center text-gray-500">
          No se encontraron inscripciones
        </div>
        <table v-else class="w-full text-left border-collapse">
          <thead class="bg-neutral sticky top-0 z-10 border-b border-gray-200">
            <tr>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estudiante</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Pasantía</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="inscripcion in filteredInscripciones" :key="inscripcion.id" class="hover:bg-neutral/50 transition-colors">
              <td class="py-3 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {{ inscripcion.iniciales }}
                  </div>
                  <div>
                    <div class="font-medium text-sm text-secondary">{{ inscripcion.estudiante }}</div>
                    <div class="text-xs text-gray-500">CI: {{ inscripcion.ci }}</div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-6 text-sm text-secondary font-medium">{{ inscripcion.pasantia }}</td>
              <td class="py-3 px-6 text-sm text-gray-500">{{ inscripcion.fecha }}</td>
              <td class="py-3 px-6">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                  :class="{
                    'bg-orange-50 text-tertiary border border-orange-200': inscripcion.estado === 'Pendiente',
                    'bg-green-50 text-success border border-green-200': inscripcion.estado === 'Aprobada',
                    'bg-red-50 text-danger border border-red-200': inscripcion.estado === 'Rechazada'
                  }"
                >
                  <v-icon v-if="inscripcion.estado === 'Pendiente'" icon="mdi-clock-outline" size="12" class="mr-1"></v-icon>
                  {{ inscripcion.estado }}
                </span>
              </td>
              <td class="py-3 px-6 text-center">
                <button 
                  @click="revisarInscripcion(inscripcion.id)"
                  class="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  Revisar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Modal "Revisar Inscripción" -->
    <div v-if="modalAbierto" class="fixed inset-0 z-50 flex items-center justify-center bg-secondary/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="font-headline font-bold text-secondary text-lg">Revisar Inscripción</h3>
          <button @click="modalAbierto = false" class="text-gray-400 hover:text-gray-600">
            <v-icon icon="mdi-close" size="20"></v-icon>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div v-if="selectedInscripcion">
            <div class="grid grid-cols-3 gap-2 text-sm">
              <span class="text-gray-500 font-medium">Estudiante:</span>
              <span class="col-span-2 text-secondary font-bold">{{ selectedInscripcion.estudiante }}</span>
              
              <span class="text-gray-500 font-medium">CI:</span>
              <span class="col-span-2 text-secondary">{{ selectedInscripcion.ci }}</span>
              
              <span class="text-gray-500 font-medium">Pasantía:</span>
              <span class="col-span-2 text-secondary font-medium">{{ selectedInscripcion.pasantia }}</span>
              
              <span class="text-gray-500 font-medium">Fecha:</span>
              <span class="col-span-2 text-secondary">{{ selectedInscripcion.fecha }}</span>
              
              <span class="text-gray-500 font-medium">Estado:</span>
              <span class="col-span-2">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                  :class="{
                    'bg-orange-50 text-tertiary border border-orange-200': selectedInscripcion.estado === 'Pendiente',
                    'bg-green-50 text-success border border-green-200': selectedInscripcion.estado === 'Aprobada',
                    'bg-red-50 text-danger border border-red-200': selectedInscripcion.estado === 'Rechazada'
                  }"
                >
                  {{ selectedInscripcion.estado }}
                </span>
              </span>
            </div>
            
            <hr class="my-4 border-gray-200" />
            
            <p class="text-sm text-gray-600 mb-4">¿Desea aprobar o rechazar esta inscripción?</p>
            
            <div class="flex gap-3">
              <button 
                @click="evaluar('rechazada')" 
                class="flex-1 py-2 px-4 bg-red-50 hover:bg-red-100 text-danger border border-red-200 rounded-lg text-sm font-bold transition-colors"
              >
                Rechazar
              </button>
              <button 
                @click="evaluar('aprobada')" 
                class="flex-1 py-2 px-4 bg-green-50 hover:bg-green-100 text-success border border-green-200 rounded-lg text-sm font-bold transition-colors"
              >
                Aprobar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Estado
const loading = ref(true)
const error = ref(null)

// Métricas
const pasantesActivos = ref(0)
const inscripcionesPendientes = ref(0)
const informesPorEmitir = ref(0)

// Inscripciones
const allInscripciones = ref([])
const searchQuery = ref('')

// Modal
const modalAbierto = ref(false)
const selectedInscripcion = ref(null)

// Computed para filtrar
const filteredInscripciones = computed(() => {
  if (!searchQuery.value) return allInscripciones.value
  
  const query = searchQuery.value.toLowerCase()
  return allInscripciones.value.filter(ins => 
    ins.estudiante.toLowerCase().includes(query) || 
    ins.ci.toLowerCase().includes(query)
  )
})

// Cargar datos
const loadData = async () => {
  try {
    loading.value = true
    
    // Cargar métricas
    const dashRes = await axios.get('/api/auth/jefe/dashboard', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    
    pasantesActivos.value = dashRes.data.pasantesActivos
    inscripcionesPendientes.value = dashRes.data.inscripcionesPendientes
    informesPorEmitir.value = dashRes.data.informesPorEmitir
    
    // Cargar todas las inscripciones para la tabla y búsqueda
    const insRes = await axios.get('/api/auth/jefe/inscripciones', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    
    allInscripciones.value = insRes.data
    
  } catch (err) {
    console.error('Error cargando datos del dashboard:', err)
    error.value = 'No se pudieron cargar los datos. Por favor, intente de nuevo.'
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const revisarInscripcion = (id) => {
  selectedInscripcion.value = allInscripciones.value.find(ins => ins.id === id)
  modalAbierto.value = true
}

const evaluar = async (nuevoEstado) => {
  try {
    loading.value = true
    await axios.patch(`/api/inscripciones/${selectedInscripcion.value.id}/evaluacion`, {
      estado: nuevoEstado
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    
    modalAbierto.value = false
    
    // Recargar datos
    await loadData()
    
    alert(`Inscripción ${nuevoEstado === 'aprobada' ? 'aprobada' : 'rechazada'} con éxito.`)
  } catch (err) {
    console.error('Error evaluando inscripción:', err)
    alert('No se pudo completar la acción.')
  } finally {
    loading.value = false
  }
}
</script>
