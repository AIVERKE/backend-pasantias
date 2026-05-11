<template>
  <div class="relative h-[calc(100vh-140px)] flex flex-col">
    <!-- Tabla de Bitácoras (Main Content) -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
      <div class="overflow-x-auto flex-1">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead class="bg-neutral border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estudiante</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Semana</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Fecha Envío</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase text-center w-32">Acciones</th>
            </tr>
            <tr class="bg-white border-b border-gray-200">
              <th class="px-3 py-2"><input type="text" placeholder="Buscar..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.estudiante"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Semana..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.semana"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Filtrar..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.fecha"></th>
              <th class="px-3 py-2">
                <select class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.estado">
                  <option value="">Todos</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Calificada">Calificada</option>
                </select>
              </th>
              <th class="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in filteredBitacoras" :key="item.id" class="hover:bg-neutral/50 transition-colors">
              <td class="py-3 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {{ item.iniciales }}
                  </div>
                  <div class="font-medium text-sm text-secondary truncate max-w-[150px]">{{ item.estudiante }}</div>
                </div>
              </td>
              <td class="py-3 px-6 text-sm text-gray-500 font-medium">Semana {{ item.semana }}</td>
              <td class="py-3 px-6 text-sm text-gray-500">{{ item.fechaEnvio }}</td>
              <td class="py-3 px-6">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                  :class="{
                    'bg-danger/10 text-danger': item.estado === 'Pendiente',
                    'bg-success/10 text-success': item.estado === 'Calificada'
                  }"
                >
                  <v-icon v-if="item.estado === 'Pendiente'" icon="mdi-alert-circle-outline" size="12" class="mr-1"></v-icon>
                  <v-icon v-if="item.estado === 'Calificada'" icon="mdi-check-circle-outline" size="12" class="mr-1"></v-icon>
                  {{ item.estado }}
                </span>
              </td>
              <td class="py-3 px-6 text-center">
                <button 
                  @click="abrirPanel(item)"
                  class="text-[11px] font-bold text-primary hover:text-white border border-primary hover:bg-primary px-3 py-1.5 rounded transition-colors w-full"
                >
                  {{ item.estado === 'Pendiente' ? 'Calificar' : 'Revisar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 text-xs text-gray-500">
        Mostrando {{ filteredBitacoras.length }} resultados
      </div>
    </div>

    <!-- Panel Lateral Deslizante -->
    <div 
      class="fixed inset-y-0 right-0 w-[480px] bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.1)] transform transition-transform duration-300 ease-in-out z-40 flex flex-col"
      :class="panelAbierto ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Header del Panel -->
      <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h3 class="font-headline font-bold text-secondary text-lg">Revisión de Bitácora</h3>
          <p class="text-xs text-gray-500 mt-1" v-if="bitacoraActiva">
            {{ bitacoraActiva.estudiante }} — Semana {{ bitacoraActiva.semana }}
          </p>
        </div>
        <button @click="cerrarPanel" class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-secondary hover:border-gray-400 transition-colors">
          <v-icon icon="mdi-close" size="18"></v-icon>
        </button>
      </div>

      <!-- Cuerpo del Panel (Desplazable) -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6" v-if="bitacoraActiva">
        <!-- Resumen de Actividades Enviadas -->
        <div>
          <h4 class="text-sm font-bold text-secondary mb-3 flex items-center gap-2">
            <v-icon icon="mdi-text-box-outline" size="16" class="text-primary"></v-icon>
            Actividades Reportadas
          </h4>
          <div class="bg-neutral p-4 rounded-lg space-y-3 border border-gray-100">
            <div class="text-sm text-secondary">
              <strong>1. Diseño de Interfaz:</strong> Se completaron los mockups para el módulo de tutores.
            </div>
            <div class="text-sm text-secondary">
              <strong>2. Revisión con el equipo:</strong> Reunión semanal para aprobación de prototipos de alta fidelidad y discusión técnica.
            </div>
          </div>
        </div>

        <!-- Formulario de Calificación -->
        <div class="border-t border-gray-100 pt-6">
          <h4 class="text-sm font-bold text-secondary mb-4 flex items-center gap-2">
            <v-icon icon="mdi-star-outline" size="16" class="text-[#D16900]"></v-icon>
            Evaluación
          </h4>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1">Nota (sobre 100)</label>
              <input type="number" min="0" max="100" class="w-24 bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-secondary" v-model="notaActual" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1">Observaciones / Feedback al pasante</label>
              <textarea 
                rows="4" 
                class="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Escribe tus comentarios sobre el desempeño de esta semana..."
                v-model="observacionActual"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Pie del Panel -->
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
        <button @click="cerrarPanel" class="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors border border-transparent">
          Cancelar
        </button>
        <button @click="guardarCalificacion" class="px-5 py-2 text-sm font-medium bg-primary text-white hover:bg-blue-600 rounded-lg transition-colors shadow-sm flex items-center gap-2">
          <v-icon icon="mdi-content-save" size="16"></v-icon>
          Guardar Calificación
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ref({ estudiante: '', semana: '', fecha: '', estado: '' })

const bitacoras = ref([
  { id: 1, iniciales: 'AL', estudiante: 'Ana López', semana: 4, fechaEnvio: '23/04/2026', estado: 'Pendiente', nota: null, obs: '' },
  { id: 2, iniciales: 'CM', estudiante: 'Carlos Mendoza', semana: 4, fechaEnvio: '22/04/2026', estado: 'Pendiente', nota: null, obs: '' },
  { id: 3, iniciales: 'RJ', estudiante: 'Roberto Jiménez', semana: 3, fechaEnvio: '15/04/2026', estado: 'Calificada', nota: 85, obs: 'Buen trabajo esta semana.' },
  { id: 4, iniciales: 'LB', estudiante: 'Luis Blanco', semana: 2, fechaEnvio: '08/04/2026', estado: 'Calificada', nota: 90, obs: 'Excelente progreso.' }
])

const filteredBitacoras = computed(() => {
  return bitacoras.value.filter(item => {
    if (filters.value.estudiante && !item.estudiante.toLowerCase().includes(filters.value.estudiante.toLowerCase())) return false
    if (filters.value.semana && item.semana.toString() !== filters.value.semana) return false
    if (filters.value.fecha && !item.fechaEnvio.includes(filters.value.fecha)) return false
    if (filters.value.estado && item.estado !== filters.value.estado) return false
    return true
  })
})

// Lógica del Panel
const panelAbierto = ref(false)
const bitacoraActiva = ref(null)
const notaActual = ref('')
const observacionActual = ref('')

const abrirPanel = (bitacora) => {
  bitacoraActiva.value = bitacora
  notaActual.value = bitacora.nota || ''
  observacionActual.value = bitacora.obs || ''
  panelAbierto.value = true
}

const cerrarPanel = () => {
  panelAbierto.value = false
  setTimeout(() => { bitacoraActiva.value = null }, 300) // esperar animación
}

const guardarCalificacion = () => {
  if (bitacoraActiva.value) {
    bitacoraActiva.value.estado = 'Calificada'
    bitacoraActiva.value.nota = notaActual.value
    bitacoraActiva.value.obs = observacionActual.value
  }
  cerrarPanel()
}
</script>
