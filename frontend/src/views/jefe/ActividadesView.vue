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
        <table class="w-full text-left border-collapse min-w-[800px]">
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
                <button class="w-7 h-7 rounded-md bg-neutral text-gray-500 hover:bg-primary hover:text-white transition-colors flex items-center justify-center mx-auto" title="Editar">
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
              <option value="Carlos Ramos">Carlos Ramos</option>
              <option value="Luis Blanco">Luis Blanco</option>
              <option value="Andrea Pérez">Andrea Pérez</option>
              <option value="María Quispe">María Quispe</option>
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
import { ref, computed } from 'vue'

const filters = ref({ titulo: '', asignado: '', fecha: '', estado: '' })

const actividades = ref([
  { id: 1, titulo: 'Entrega de Diseño UI', descripcion: 'Subir los mockups en Figma', asignado: 'María Quispe', fechaLimite: '28/04/2026', estado: 'Activo' },
  { id: 2, titulo: 'Evaluación de Medio Término', descripcion: 'Completar el cuestionario de autoevaluación', asignado: 'Todos', fechaLimite: '30/04/2026', estado: 'Activo' },
  { id: 3, titulo: 'Revisión de Base de Datos', descripcion: 'Script de migración para entorno de QA', asignado: 'Andrea Pérez', fechaLimite: '20/04/2026', estado: 'Vencido' },
  { id: 4, titulo: 'Setup de Entorno Local', descripcion: 'Instalar Docker y correr los contenedores', asignado: 'Todos', fechaLimite: '05/03/2026', estado: 'Completado' },
])

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
const nuevaActividad = ref({
  titulo: '',
  descripcion: '',
  tipoAsignacion: 'todos',
  pasanteAsignado: '',
  fechaLimite: ''
})

const abrirModalCrear = () => {
  nuevaActividad.value = {
    titulo: '',
    descripcion: '',
    tipoAsignacion: 'todos',
    pasanteAsignado: '',
    fechaLimite: ''
  }
  modalAbierto.value = true
}

const guardarActividad = () => {
  if (!nuevaActividad.value.titulo || !nuevaActividad.value.fechaLimite) return
  
  // Convertir YYYY-MM-DD a DD/MM/YYYY
  const dateObj = new Date(nuevaActividad.value.fechaLimite)
  const fechaFormatted = `${dateObj.getDate() + 1}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`

  actividades.value.unshift({
    id: actividades.value.length + 1,
    titulo: nuevaActividad.value.titulo,
    descripcion: nuevaActividad.value.descripcion,
    asignado: nuevaActividad.value.tipoAsignacion === 'todos' ? 'Todos' : nuevaActividad.value.pasanteAsignado,
    fechaLimite: fechaFormatted,
    estado: 'Activo'
  })
  
  modalAbierto.value = false
}
</script>
