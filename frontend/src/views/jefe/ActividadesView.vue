<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex justify-end">
      <button 
        @click="abrirModalCrear"
        class="bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm"
      >
        <v-icon icon="mdi-plus" size="18"></v-icon>
        Nueva Actividad
      </button>
    </div>

    <!-- Tabla de Actividades -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-neutral border-b border-gray-200">
            <tr>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Actividad</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Asignado A</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Fecha Límite</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estado Global</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase text-center w-24">Acciones</th>
            </tr>
            <!-- Filtros Inline -->
            <tr class="bg-white border-b border-gray-200">
              <th class="px-3 py-2"><input type="text" placeholder="Buscar título..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.titulo"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Filtrar asignación..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.asignado"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Filtrar fecha..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.fecha"></th>
              <th class="px-3 py-2">
                <select class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.estado">
                  <option value="">Todos</option>
                  <option value="Activo">Activo</option>
                  <option value="Vencido">Vencido</option>
                  <option value="Completado">Completado</option>
                </select>
              </th>
              <th class="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in filteredActividades" :key="item.id" class="hover:bg-neutral/50 transition-colors">
              <td class="py-4 px-6">
                <div class="font-medium text-sm text-secondary">{{ item.titulo }}</div>
                <div class="text-xs text-gray-500 mt-1 truncate max-w-[250px]">{{ item.descripcion }}</div>
              </td>
              <td class="py-4 px-6">
                <span v-if="item.asignado === 'Todos'" class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  <v-icon icon="mdi-account-group" size="14" class="mr-1.5"></v-icon> Todos los Pasantes
                </span>
                <span v-else class="inline-flex items-center text-sm text-secondary font-medium">
                  <v-icon icon="mdi-account" size="14" class="mr-1.5 text-gray-400"></v-icon> {{ item.asignado }}
                </span>
              </td>
              <td class="py-4 px-6 text-sm text-gray-500 font-medium">
                <v-icon icon="mdi-calendar-blank" size="14" class="mr-1"></v-icon>
                {{ item.fechaLimite }}
              </td>
              <td class="py-4 px-6">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                  :class="{
                    'bg-success/10 text-success': item.estado === 'Completado',
                    'bg-primary/10 text-primary': item.estado === 'Activo',
                    'bg-danger/10 text-danger': item.estado === 'Vencido'
                  }"
                >
                  {{ item.estado }}
                </span>
              </td>
              <td class="py-4 px-6 text-center">
                <button @click="abrirModalEditar(item)" class="w-7 h-7 rounded-md bg-neutral text-gray-500 hover:bg-primary hover:text-white transition-colors flex items-center justify-center mx-auto" title="Editar">
                  <v-icon icon="mdi-pencil-outline" size="16"></v-icon>
                </button>
              </td>
            </tr>
            <tr v-if="filteredActividades.length === 0">
              <td colspan="5" class="py-12 text-center text-gray-500 text-sm">
                No se encontraron actividades que coincidan con los filtros.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 text-xs text-gray-500">
        Mostrando {{ filteredActividades.length }} resultados
      </div>
    </div>

    <!-- Modal Crear Actividad -->
    <div v-if="modalAbierto" class="fixed inset-0 z-50 flex items-center justify-center bg-secondary/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="font-headline font-bold text-secondary text-lg">Nueva Actividad</h3>
          <button @click="modalAbierto = false" class="text-gray-400 hover:text-gray-600">
            <v-icon icon="mdi-close" size="20"></v-icon>
          </button>
        </div>
        <div class="p-6 space-y-5">
          <!-- Título -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1.5">Título de la Actividad</label>
            <input type="text" v-model="nuevaActividad.titulo" class="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Ej. Presentación de prototipo final" />
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1.5">Descripción y Requisitos</label>
            <textarea v-model="nuevaActividad.descripcion" rows="3" class="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Detalla lo que se espera en esta entrega..."></textarea>
          </div>

          <!-- Asignación -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-2">Asignar a</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="nuevaActividad.tipoAsignacion" value="todos" class="text-primary focus:ring-primary border-gray-300">
                <span class="text-sm text-secondary">Todos los pasantes</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="nuevaActividad.tipoAsignacion" value="especifico" class="text-primary focus:ring-primary border-gray-300">
                <span class="text-sm text-secondary">Pasante específico</span>
              </label>
            </div>
          </div>

          <!-- Select Estudiante (Condicional) -->
          <div v-if="nuevaActividad.tipoAsignacion === 'especifico'" class="bg-neutral p-4 rounded-lg border border-gray-100">
            <label class="block text-xs font-semibold text-gray-500 mb-1.5">Seleccionar Pasante</label>
            <select v-model="nuevaActividad.pasanteAsignado" class="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option value="">Selecciona uno...</option>
              <option v-for="ins in inscripciones" :key="ins.id" :value="ins.id">{{ ins.nombre }}</option>
            </select>
          </div>

          <!-- Fecha Límite -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1.5">Fecha Límite</label>
            <input type="date" v-model="nuevaActividad.fechaLimite" class="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary" />
          </div>
        </div>
        
        <!-- Footer Modal -->
        <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button @click="modalAbierto = false" class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors border border-transparent">
            Cancelar
          </button>
          <button @click="guardarActividad" class="px-5 py-2 text-sm font-medium bg-primary text-white hover:bg-blue-600 rounded-lg transition-colors shadow-sm flex items-center gap-2">
            <v-icon icon="mdi-content-save" size="16"></v-icon>
            Crear y Asignar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const filters = ref({ titulo: '', asignado: '', fecha: '', estado: '' })
const actividades = ref([])
const inscripciones = ref([])

const token = localStorage.getItem('access_token')

const cargarDatos = async () => {
  try {
    const [actividadesRes, inscripcionesRes] = await Promise.all([
      axios.get('/api/actividades/jefe', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('/api/auth/jefe/inscripciones', { headers: { Authorization: `Bearer ${token}` } })
    ])

    // Mapear actividades
    actividades.value = actividadesRes.data.map(t => ({
      id: t.id_tarea,
      titulo: t.titulo,
      descripcion: t.descripcion,
      asignado: t.inscripcion ? `${t.inscripcion.estudiante.usuario.nombre} ${t.inscripcion.estudiante.usuario.apellido}` : 'Todos',
      fechaLimite: new Date(t.fecha_limite).toLocaleDateString('es-BO'),
      estado: t.estado,
      id_inscripcion: t.inscripcion ? t.inscripcion.id_inscripcion : null
    }))

    // Mapear inscripciones para el select
    inscripciones.value = inscripcionesRes.data.map(i => ({
      id: i.id,
      nombre: i.estudiante
    }))
  } catch (error) {
    console.error('Error cargando datos:', error)
  }
}

onMounted(() => {
  cargarDatos()
})

const filteredActividades = computed(() => {
  return actividades.value.filter(item => {
    if (filters.value.titulo && !item.titulo.toLowerCase().includes(filters.value.titulo.toLowerCase())) return false
    if (filters.value.asignado && !item.asignado.toLowerCase().includes(filters.value.asignado.toLowerCase())) return false
    if (filters.value.fecha && !item.fechaLimite.includes(filters.value.fecha)) return false
    if (filters.value.estado && item.estado !== filters.value.estado) return false
    return true
  })
})

// Lógica del Modal
const modalAbierto = ref(false)
const esEdicion = ref(false)
const actividadEditandoId = ref(null)

const nuevaActividad = ref({
  titulo: '',
  descripcion: '',
  tipoAsignacion: 'todos',
  pasanteAsignado: '',
  fechaLimite: ''
})

const abrirModalCrear = () => {
  esEdicion.value = false
  actividadEditandoId.value = null
  nuevaActividad.value = {
    titulo: '',
    descripcion: '',
    tipoAsignacion: 'todos',
    pasanteAsignado: '',
    fechaLimite: ''
  }
  modalAbierto.value = true
}

const abrirModalEditar = (actividad) => {
  esEdicion.value = true
  actividadEditandoId.value = actividad.id
  nuevaActividad.value = {
    titulo: actividad.titulo,
    descripcion: actividad.descripcion,
    tipoAsignacion: actividad.asignado === 'Todos' ? 'todos' : 'especifico',
    pasanteAsignado: actividad.id_inscripcion || '',
    // Convertir DD/MM/YYYY a YYYY-MM-DD para el input date
    fechaLimite: actividad.fechaLimite.split('/').reverse().join('-')
  }
  modalAbierto.value = true
}

const guardarActividad = async () => {
  if (!nuevaActividad.value.titulo || !nuevaActividad.value.fechaLimite) return
  
  const payload = {
    titulo: nuevaActividad.value.titulo,
    descripcion: nuevaActividad.value.descripcion,
    fecha_limite: nuevaActividad.value.fechaLimite,
    id_inscripcion: nuevaActividad.value.tipoAsignacion === 'todos' ? null : nuevaActividad.value.pasanteAsignado
  }

  try {
    if (esEdicion.value) {
      await axios.patch(`/api/actividades/jefe/${actividadEditandoId.value}`, payload, { headers: { Authorization: `Bearer ${token}` } })
    } else {
      await axios.post('/api/actividades/jefe', payload, { headers: { Authorization: `Bearer ${token}` } })
    }
    
    modalAbierto.value = false
    cargarDatos() // Recargar datos
  } catch (error) {
    console.error('Error guardando actividad:', error)
  }
}
</script>
