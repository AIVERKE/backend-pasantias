<template>
  <div class="space-y-6">
    <!-- Pestañas de Estado -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="flex border-b border-gray-200">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-6 py-4 text-sm font-medium transition-colors relative"
          :class="activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
        >
          <div class="flex items-center gap-2">
            {{ tab.label }}
            <span v-if="tab.badge" class="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {{ tab.badge }}
            </span>
          </div>
          <span v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
        </button>
      </div>

      <!-- Tabla con Filtros Inline -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead class="bg-neutral border-b border-gray-200">
            <!-- Títulos de Columnas -->
            <tr>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estudiante</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">CI</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Pasantía</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase text-center w-32">Acciones</th>
            </tr>
            <!-- Filtros Inline -->
            <tr class="bg-white border-b border-gray-200">
              <th class="px-3 py-2"><input type="text" placeholder="Buscar..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.estudiante"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Filtrar..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.ci"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Buscar..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.pasantia"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Filtrar..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.fecha"></th>
              <th class="px-3 py-2">
                <select class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.estado">
                  <option value="">Todos</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Aprobada">Aprobada</option>
                  <option value="Rechazada">Rechazada</option>
                </select>
              </th>
              <th class="px-3 py-2"></th> <!-- Sin filtro en Acciones -->
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in filteredInscripciones" :key="item.id" class="hover:bg-neutral/50 transition-colors">
              <td class="py-3 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {{ item.iniciales }}
                  </div>
                  <div class="font-medium text-sm text-secondary truncate max-w-[150px]">{{ item.estudiante }}</div>
                </div>
              </td>
              <td class="py-3 px-6 text-sm text-gray-500">{{ item.ci }}</td>
              <td class="py-3 px-6 text-sm text-secondary font-medium truncate max-w-[200px]">{{ item.pasantia }}</td>
              <td class="py-3 px-6 text-sm text-gray-500">{{ item.fecha }}</td>
              <td class="py-3 px-6">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                  :class="{
                    'bg-orange-50 text-tertiary border border-orange-200': item.estado === 'Pendiente',
                    'bg-green-50 text-success border border-green-200': item.estado === 'Aprobada',
                    'bg-red-50 text-danger border border-red-200': item.estado === 'Rechazada'
                  }"
                >
                  <v-icon v-if="item.estado === 'Pendiente'" icon="mdi-clock-outline" size="12" class="mr-1"></v-icon>
                  {{ item.estado }}
                </span>
              </td>
              <td class="py-3 px-6 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button class="w-7 h-7 rounded-md bg-neutral text-gray-500 hover:bg-primary hover:text-white transition-colors flex items-center justify-center" title="Ver detalles">
                    <v-icon icon="mdi-eye-outline" size="16"></v-icon>
                  </button>
                  <button v-if="item.estado === 'Pendiente'" class="w-7 h-7 rounded-md bg-neutral text-success hover:bg-success hover:text-white transition-colors flex items-center justify-center" title="Aprobar">
                    <v-icon icon="mdi-check" size="16"></v-icon>
                  </button>
                  <button v-if="item.estado === 'Pendiente'" class="w-7 h-7 rounded-md bg-neutral text-danger hover:bg-danger hover:text-white transition-colors flex items-center justify-center" title="Rechazar">
                    <v-icon icon="mdi-close" size="16"></v-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredInscripciones.length === 0">
              <td colspan="6" class="py-12 text-center text-gray-500 text-sm">
                No se encontraron inscripciones que coincidan con los filtros.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Paginación Mock -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <span class="text-xs text-gray-500">Mostrando {{ filteredInscripciones.length }} de {{ inscripciones.length }} resultados</span>
        <div class="flex gap-1">
          <button class="px-2 py-1 rounded text-gray-400 hover:bg-neutral transition-colors cursor-not-allowed" disabled>
            <v-icon icon="mdi-chevron-left" size="20"></v-icon>
          </button>
          <button class="px-2 py-1 rounded text-primary hover:bg-primary/10 transition-colors">
            <v-icon icon="mdi-chevron-right" size="20"></v-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('pendientes')

const tabs = [
  { id: 'pendientes', label: 'Pendientes', badge: '3' },
  { id: 'aprobadas', label: 'Aprobadas' },
  { id: 'rechazadas', label: 'Rechazadas' },
  { id: 'todas', label: 'Todas' }
]

const filters = ref({
  estudiante: '',
  ci: '',
  pasantia: '',
  fecha: '',
  estado: ''
})

const inscripciones = ref([
  { id: 1, iniciales: 'AL', estudiante: 'Ana López', ci: '8392123 LP', pasantia: 'Desarrollador Frontend Jr.', fecha: '23/04/2026', estado: 'Pendiente' },
  { id: 2, iniciales: 'CM', estudiante: 'Carlos Mendoza', ci: '6283920 LP', pasantia: 'Analista de Datos', fecha: '22/04/2026', estado: 'Pendiente' },
  { id: 3, iniciales: 'RJ', estudiante: 'Roberto Jiménez', ci: '7382910 LP', pasantia: 'Soporte Técnico', fecha: '21/04/2026', estado: 'Pendiente' },
  { id: 4, iniciales: 'MQ', estudiante: 'María Quispe', ci: '9203812 LP', pasantia: 'Desarrollador Frontend Jr.', fecha: '20/04/2026', estado: 'Aprobada' },
  { id: 5, iniciales: 'FV', estudiante: 'Fernando Vargas', ci: '5928371 LP', pasantia: 'Diseñador UI/UX', fecha: '19/04/2026', estado: 'Rechazada' },
  { id: 6, iniciales: 'LB', estudiante: 'Luis Blanco', ci: '4829102 SC', pasantia: 'Asistente de Marketing', fecha: '18/04/2026', estado: 'Aprobada' }
])

const filteredInscripciones = computed(() => {
  return inscripciones.value.filter(item => {
    // Filtro por Pestaña
    if (activeTab.value === 'pendientes' && item.estado !== 'Pendiente') return false
    if (activeTab.value === 'aprobadas' && item.estado !== 'Aprobada') return false
    if (activeTab.value === 'rechazadas' && item.estado !== 'Rechazada') return false
    
    // Filtros Inline
    if (filters.value.estudiante && !item.estudiante.toLowerCase().includes(filters.value.estudiante.toLowerCase())) return false
    if (filters.value.ci && !item.ci.toLowerCase().includes(filters.value.ci.toLowerCase())) return false
    if (filters.value.pasantia && !item.pasantia.toLowerCase().includes(filters.value.pasantia.toLowerCase())) return false
    if (filters.value.fecha && !item.fecha.includes(filters.value.fecha)) return false
    if (filters.value.estado && item.estado !== filters.value.estado) return false

    return true
  })
})
</script>
