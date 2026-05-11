<template>
  <div class="space-y-6">
    <!-- Tabla de Informes Finales -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead class="bg-neutral border-b border-gray-200">
            <tr>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estudiante</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Pasantía</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Bitácoras Evaluadas</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Nota Sugerida</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estado Informe</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase text-center w-32">Acciones</th>
            </tr>
            <!-- Filtros Inline -->
            <tr class="bg-white border-b border-gray-200">
              <th class="px-3 py-2"><input type="text" placeholder="Buscar..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.estudiante"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Buscar..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.pasantia"></th>
              <th class="px-3 py-2"></th>
              <th class="px-3 py-2"></th>
              <th class="px-3 py-2">
                <select class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.estado">
                  <option value="">Todos</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Emitido">Emitido</option>
                </select>
              </th>
              <th class="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in filteredInformes" :key="item.id" class="hover:bg-neutral/50 transition-colors">
              <td class="py-3 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {{ item.iniciales }}
                  </div>
                  <div class="font-medium text-sm text-secondary truncate max-w-[150px]">{{ item.estudiante }}</div>
                </div>
              </td>
              <td class="py-3 px-6 text-sm text-secondary font-medium truncate max-w-[200px]">{{ item.pasantia }}</td>
              <td class="py-3 px-6 text-sm text-gray-500">{{ item.bitacorasEvaluadas }} / {{ item.totalBitacoras }}</td>
              <td class="py-3 px-6">
                <span class="text-sm font-bold" :class="item.notaSugerida >= 51 ? 'text-success' : 'text-danger'">
                  {{ item.notaSugerida }} / 100
                </span>
                <span class="text-[10px] text-gray-400 block">Promedio auto-calculado</span>
              </td>
              <td class="py-3 px-6">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                  :class="{
                    'bg-danger/10 text-danger': item.estado === 'Pendiente',
                    'bg-success/10 text-success': item.estado === 'Emitido'
                  }"
                >
                  <v-icon v-if="item.estado === 'Pendiente'" icon="mdi-clock-outline" size="12" class="mr-1"></v-icon>
                  <v-icon v-if="item.estado === 'Emitido'" icon="mdi-check-circle" size="12" class="mr-1"></v-icon>
                  {{ item.estado }}
                </span>
              </td>
              <td class="py-3 px-6 text-center">
                <button 
                  v-if="item.estado === 'Pendiente'"
                  @click="abrirModalEmitir(item)"
                  class="text-[11px] font-bold text-primary hover:text-white border border-primary hover:bg-primary px-3 py-1.5 rounded transition-colors w-full"
                >
                  Emitir Informe
                </button>
                <button 
                  v-else
                  class="text-[11px] font-bold text-gray-500 border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded transition-colors w-full"
                >
                  Ver Informe
                </button>
              </td>
            </tr>
            <tr v-if="filteredInformes.length === 0">
              <td colspan="6" class="py-12 text-center text-gray-500 text-sm">
                No se encontraron informes que coincidan con los filtros.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 text-xs text-gray-500">
        Mostrando {{ filteredInformes.length }} resultados
      </div>
    </div>

    <!-- Modal "Emitir Informe" -->
    <div v-if="modalAbierto" class="fixed inset-0 z-50 flex items-center justify-center bg-secondary/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="font-headline font-bold text-secondary text-lg">Emitir Informe Final</h3>
          <button @click="modalAbierto = false" class="text-gray-400 hover:text-gray-600">
            <v-icon icon="mdi-close" size="20"></v-icon>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600">
            Estás generando el informe final para <span class="font-bold text-secondary">{{ informeSeleccionado?.estudiante }}</span>.
            Una vez emitido, será visible para el estudiante y su tutor académico.
          </p>

          <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
            <div>
              <span class="text-xs text-blue-600 font-bold uppercase tracking-wide">Nota Final Calculada</span>
              <p class="text-xs text-blue-800 mt-1">Basada en el promedio de las bitácoras semanales.</p>
            </div>
            <div class="text-2xl font-headline font-bold text-blue-700">
              {{ informeSeleccionado?.notaSugerida }} <span class="text-sm font-normal">/ 100</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Apreciación Global (Conclusión)</label>
            <textarea 
              rows="4" 
              class="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Redacta la conclusión general sobre el desempeño del pasante durante todo el periodo..."
            ></textarea>
          </div>
          
          <div class="flex items-center gap-2 mt-2">
            <input type="checkbox" id="confirm" class="rounded border-gray-300 text-primary focus:ring-primary">
            <label for="confirm" class="text-xs text-gray-600">Confirmo que la evaluación es definitiva y autorizo su emisión.</label>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button @click="modalAbierto = false" class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors border border-transparent">
            Cancelar
          </button>
          <button @click="confirmarEmision" class="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-blue-600 rounded-lg transition-colors shadow-sm flex items-center gap-2">
            <v-icon icon="mdi-file-certificate" size="16"></v-icon>
            Emitir y Finalizar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ref({ estudiante: '', pasantia: '', estado: '' })

const informes = ref([
  { id: 1, iniciales: 'CR', estudiante: 'Carlos Ramos', pasantia: 'Soporte Técnico', bitacorasEvaluadas: 12, totalBitacoras: 12, notaSugerida: 92, estado: 'Pendiente' },
  { id: 2, iniciales: 'LB', estudiante: 'Luis Blanco', pasantia: 'Asistente de Marketing', bitacorasEvaluadas: 8, totalBitacoras: 8, notaSugerida: 88, estado: 'Emitido' },
  { id: 3, iniciales: 'AP', estudiante: 'Andrea Pérez', pasantia: 'Desarrollador Backend', bitacorasEvaluadas: 10, totalBitacoras: 10, notaSugerida: 45, estado: 'Pendiente' },
])

const filteredInformes = computed(() => {
  return informes.value.filter(item => {
    if (filters.value.estudiante && !item.estudiante.toLowerCase().includes(filters.value.estudiante.toLowerCase())) return false
    if (filters.value.pasantia && !item.pasantia.toLowerCase().includes(filters.value.pasantia.toLowerCase())) return false
    if (filters.value.estado && item.estado !== filters.value.estado) return false
    return true
  })
})

// Lógica del Modal
const modalAbierto = ref(false)
const informeSeleccionado = ref(null)

const abrirModalEmitir = (informe) => {
  informeSeleccionado.value = informe
  modalAbierto.value = true
}

const confirmarEmision = () => {
  if (informeSeleccionado.value) {
    informeSeleccionado.value.estado = 'Emitido'
  }
  modalAbierto.value = false
  informeSeleccionado.value = null
}
</script>
