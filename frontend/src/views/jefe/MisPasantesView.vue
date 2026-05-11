<template>
  <div class="space-y-6">
    <!-- Tabla de Pasantes con Filtros Inline -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead class="bg-neutral border-b border-gray-200">
            <!-- Títulos de Columnas -->
            <tr>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estudiante</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Pasantía</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Fecha Inicio</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Progreso</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase text-center w-24">Acciones</th>
            </tr>
            <!-- Filtros Inline -->
            <tr class="bg-white border-b border-gray-200">
              <th class="px-3 py-2"><input type="text" placeholder="Buscar..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.estudiante"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Buscar..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.pasantia"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Filtrar..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.fecha"></th>
              <th class="px-3 py-2"></th> <!-- Sin filtro numérico por ahora -->
              <th class="px-3 py-2">
                <select class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.estado">
                  <option value="">Todos</option>
                  <option value="Activo">Activo</option>
                  <option value="Licencia">Licencia</option>
                  <option value="Abandono">Abandono</option>
                  <option value="Conclusión">Conclusión</option>
                </select>
              </th>
              <th class="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in filteredPasantes" :key="item.id" class="hover:bg-neutral/50 transition-colors">
              <td class="py-3 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {{ item.iniciales }}
                  </div>
                  <div class="font-medium text-sm text-secondary truncate max-w-[150px]">{{ item.estudiante }}</div>
                </div>
              </td>
              <td class="py-3 px-6 text-sm text-secondary font-medium truncate max-w-[200px]">{{ item.pasantia }}</td>
              <td class="py-3 px-6 text-sm text-gray-500">{{ item.fechaInicio }}</td>
              <td class="py-3 px-6">
                <div class="flex items-center gap-2">
                  <div class="w-full bg-gray-200 rounded-full h-1.5 max-w-[80px]">
                    <div class="bg-primary h-1.5 rounded-full" :style="{ width: item.progreso + '%' }"></div>
                  </div>
                  <span class="text-xs text-gray-500 font-medium">{{ item.progreso }}%</span>
                </div>
              </td>
              <td class="py-3 px-6">
                <select 
                  v-model="item.estado"
                  class="bg-white border border-gray-200 text-xs rounded py-1 px-2 focus:ring-1 focus:ring-primary focus:border-primary font-medium"
                  :class="{
                    'text-success': item.estado === 'Activo' || item.estado === 'Conclusión',
                    'text-[#D16900]': item.estado === 'Licencia',
                    'text-danger': item.estado === 'Abandono'
                  }"
                >
                  <option value="Activo" class="text-secondary">Activo</option>
                  <option value="Licencia" class="text-secondary">Licencia</option>
                  <option value="Conclusión" class="text-secondary">Conclusión</option>
                </select>
              </td>
              <td class="py-3 px-6 text-center">
                <button 
                  @click="abrirModalBaja(item)"
                  class="text-[11px] font-bold text-danger hover:text-white border border-danger hover:bg-danger px-2 py-1 rounded transition-colors"
                  v-if="item.estado === 'Activo' || item.estado === 'Licencia'"
                >
                  Dar de baja
                </button>
              </td>
            </tr>
            <tr v-if="filteredPasantes.length === 0">
              <td colspan="6" class="py-12 text-center text-gray-500 text-sm">
                No se encontraron pasantes que coincidan con los filtros.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <span class="text-xs text-gray-500">Mostrando {{ filteredPasantes.length }} resultados</span>
      </div>
    </div>

    <!-- Modal "Dar de Baja" -->
    <div v-if="modalAbierto" class="fixed inset-0 z-50 flex items-center justify-center bg-secondary/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-headline font-bold text-secondary text-lg">Dar de baja al pasante</h3>
          <button @click="modalAbierto = false" class="text-gray-400 hover:text-gray-600">
            <v-icon icon="mdi-close" size="20"></v-icon>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600">
            Estás a punto de dar de baja a <span class="font-bold text-secondary">{{ pasanteSeleccionado?.estudiante }}</span>.
            Esta acción cambiará su estado a "Abandono".
          </p>
          
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Motivo principal</label>
            <select class="w-full bg-neutral border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-danger/20 focus:border-danger">
              <option value="">Selecciona un motivo...</option>
              <option value="1">Ausencia injustificada prolongada</option>
              <option value="2">Incumplimiento de tareas</option>
              <option value="3">Decisión del estudiante</option>
              <option value="4">Otro</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Observación detallada</label>
            <textarea 
              rows="3" 
              class="w-full bg-neutral border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-danger/20 focus:border-danger"
              placeholder="Explica brevemente los detalles de la baja..."
            ></textarea>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button @click="modalAbierto = false" class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            Cancelar
          </button>
          <button @click="confirmarBaja" class="px-4 py-2 text-sm font-medium bg-danger text-white hover:bg-red-600 rounded-lg transition-colors shadow-sm">
            Confirmar Baja
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ref({
  estudiante: '',
  pasantia: '',
  fecha: '',
  estado: ''
})

const pasantes = ref([
  { id: 1, iniciales: 'MQ', estudiante: 'María Quispe', pasantia: 'Desarrollador Frontend Jr.', fechaInicio: '01/03/2026', progreso: 45, estado: 'Activo' },
  { id: 2, iniciales: 'LB', estudiante: 'Luis Blanco', pasantia: 'Asistente de Marketing', fechaInicio: '15/02/2026', progreso: 80, estado: 'Activo' },
  { id: 3, iniciales: 'CR', estudiante: 'Carlos Ramos', pasantia: 'Soporte Técnico', fechaInicio: '10/01/2026', progreso: 100, estado: 'Conclusión' },
  { id: 4, iniciales: 'AP', estudiante: 'Andrea Pérez', pasantia: 'Desarrollador Backend', fechaInicio: '20/03/2026', progreso: 10, estado: 'Licencia' },
  { id: 5, iniciales: 'JG', estudiante: 'Jorge Gómez', pasantia: 'Analista de Datos', fechaInicio: '05/02/2026', progreso: 30, estado: 'Abandono' }
])

const filteredPasantes = computed(() => {
  return pasantes.value.filter(item => {
    if (filters.value.estudiante && !item.estudiante.toLowerCase().includes(filters.value.estudiante.toLowerCase())) return false
    if (filters.value.pasantia && !item.pasantia.toLowerCase().includes(filters.value.pasantia.toLowerCase())) return false
    if (filters.value.fecha && !item.fechaInicio.includes(filters.value.fecha)) return false
    if (filters.value.estado && item.estado !== filters.value.estado) return false
    return true
  })
})

// Lógica del Modal
const modalAbierto = ref(false)
const pasanteSeleccionado = ref(null)

const abrirModalBaja = (pasante) => {
  pasanteSeleccionado.value = pasante
  modalAbierto.value = true
}

const confirmarBaja = () => {
  if (pasanteSeleccionado.value) {
    pasanteSeleccionado.value.estado = 'Abandono'
  }
  modalAbierto.value = false
  pasanteSeleccionado.value = null
}
</script>
