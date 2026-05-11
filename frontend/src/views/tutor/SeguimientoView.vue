<template>
  <div class="h-full flex flex-col max-w-6xl mx-auto w-full">
    
    <!-- Encabezado del Perfil del Estudiante -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shrink-0">
      <div class="flex items-center gap-5">
        <button class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-blue-50 transition-colors border border-gray-200">
          <v-icon icon="mdi-arrow-left" size="20"></v-icon>
        </button>
        <div class="w-16 h-16 rounded-full bg-blue-100 text-primary flex items-center justify-center text-2xl font-bold shrink-0">
          LM
        </div>
        <div>
          <h2 class="text-2xl font-headline font-bold text-secondary">Luis Martínez</h2>
          <p class="text-sm text-gray-500 font-medium">Ingeniería de Sistemas • Jalasoft</p>
        </div>
      </div>
      
      <div class="flex gap-6 items-center">
        <div class="text-right">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Progreso General</p>
          <div class="flex items-center gap-2">
            <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-danger rounded-full" style="width: 15%"></div>
            </div>
            <span class="text-sm font-bold text-danger">15%</span>
          </div>
        </div>
        <span class="px-3 py-1 bg-orange-50 text-tertiary rounded font-bold uppercase tracking-wider text-[11px] border border-orange-200">
          En Riesgo
        </span>
      </div>
    </div>

    <!-- Contenido Principal con Pestañas -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
      <!-- Pestañas -->
      <div class="flex border-b border-gray-200 bg-gray-50 pt-2 px-4 shrink-0">
        <button 
          @click="activeTab = 'evaluacion'"
          class="px-6 py-3 text-sm font-medium transition-colors relative"
          :class="activeTab === 'evaluacion' ? 'text-primary bg-white rounded-t-lg border-t border-l border-r border-gray-200' : 'text-gray-500 hover:text-secondary'"
        >
          <div class="flex items-center gap-2">
            <v-icon icon="mdi-clipboard-check" size="18"></v-icon>
            Evaluación Continua
          </div>
          <div v-if="activeTab === 'evaluacion'" class="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white"></div>
        </button>
        <button 
          @click="activeTab = 'bitacora'"
          class="px-6 py-3 text-sm font-medium transition-colors relative"
          :class="activeTab === 'bitacora' ? 'text-primary bg-white rounded-t-lg border-t border-l border-r border-gray-200' : 'text-gray-500 hover:text-secondary'"
        >
          <div class="flex items-center gap-2">
            <v-icon icon="mdi-notebook" size="18"></v-icon>
            Revisión de Bitácora
          </div>
          <div v-if="activeTab === 'bitacora'" class="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white"></div>
        </button>
      </div>

      <!-- Área de Contenido Desplazable -->
      <div class="flex-1 overflow-y-auto p-6 md:p-8">
        
        <!-- Tab: Evaluación Continua -->
        <div v-if="activeTab === 'evaluacion'" class="max-w-3xl space-y-8">
          <div>
            <h3 class="text-lg font-headline font-bold text-secondary mb-4">Registro de Seguimiento</h3>
            <p class="text-sm text-gray-600 mb-6">Completa este formulario tras cada reunión de seguimiento con el estudiante o la empresa.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha de Evaluación</label>
                <input type="date" class="w-full bg-neutral text-sm rounded-lg p-3 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Puntuación Parcial (0-100)</label>
                <input type="number" min="0" max="100" placeholder="Ej. 85" class="w-full bg-neutral text-sm rounded-lg p-3 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Observaciones del Desempeño</label>
              <textarea 
                rows="4" 
                placeholder="Detalla cómo ha sido el avance del estudiante durante este periodo..." 
                class="w-full bg-neutral text-sm rounded-lg p-4 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <div class="mb-6">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recomendaciones / Tareas Correctivas</label>
              <textarea 
                rows="3" 
                placeholder="Acciones a tomar si el estudiante se encuentra en riesgo..." 
                class="w-full bg-orange-50/50 text-sm rounded-lg p-4 border border-orange-200 focus:border-tertiary focus:ring-1 focus:ring-tertiary outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <button class="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm shadow-primary/30">
              Guardar Evaluación
            </button>
          </div>

          <div class="pt-8 border-t border-gray-100">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Historial de Evaluaciones</h3>
            <div class="bg-neutral p-4 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
              No hay evaluaciones registradas previamente para este estudiante.
            </div>
          </div>
        </div>

        <!-- Tab: Revisión de Bitácora -->
        <div v-if="activeTab === 'bitacora'" class="flex gap-6 h-[500px]">
          <!-- Lista de Entradas -->
          <div class="w-1/3 border-r border-gray-100 pr-4 overflow-y-auto">
            <div 
              v-for="semana in semanas" 
              :key="semana.id"
              @click="semanaActiva = semana.id"
              class="p-4 rounded-lg border mb-3 cursor-pointer transition-colors"
              :class="semanaActiva === semana.id ? 'border-primary bg-blue-50/50' : 'border-gray-200 hover:border-primary/50'"
            >
              <div class="flex justify-between items-center mb-1">
                <span class="font-bold text-sm text-secondary">{{ semana.titulo }}</span>
                <span class="text-xs font-medium" :class="semana.revisada ? 'text-success' : 'text-tertiary'">
                  {{ semana.revisada ? 'Revisada' : 'Pendiente' }}
                </span>
              </div>
              <p class="text-xs text-gray-500 truncate">{{ semana.resumen }}</p>
            </div>
          </div>

          <!-- Detalle de la Entrada -->
          <div class="flex-1 overflow-y-auto pl-2 pr-4 flex flex-col" v-if="semanaDetalle">
            <h3 class="text-xl font-headline font-bold text-secondary mb-4">{{ semanaDetalle.titulo }}</h3>
            <div class="bg-neutral p-5 rounded-lg border border-gray-100 text-sm text-gray-600 leading-relaxed whitespace-pre-line mb-6">
              {{ semanaDetalle.entradaCompleta }}
            </div>

            <div class="mt-auto bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h4 class="text-sm font-bold text-secondary mb-3">Retroalimentación del Tutor</h4>
              
              <div v-if="semanaDetalle.revisada" class="text-sm text-gray-700 bg-white p-4 rounded border border-gray-100 mb-4 italic">
                "{{ semanaDetalle.observacion }}"
              </div>
              
              <div v-else>
                <textarea 
                  rows="3" 
                  placeholder="Escribe un comentario sobre esta entrada de la bitácora..." 
                  class="w-full bg-white text-sm rounded-lg p-3 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none mb-3"
                ></textarea>
                <div class="flex justify-end gap-3">
                  <button class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                    Marcar Revisado
                  </button>
                  <button class="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors">
                    Enviar Comentario
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('evaluacion')
const semanaActiva = ref(2)

const semanas = ref([
  {
    id: 2,
    titulo: 'Semana 2',
    resumen: 'Dificultades con el entorno de desarrollo',
    entradaCompleta: 'Durante esta semana tuve muchos problemas configurando los permisos en la base de datos de staging. Esto retrasó mis tareas asignadas y no pude completar el reporte a tiempo.',
    revisada: false,
    observacion: ''
  },
  {
    id: 1,
    titulo: 'Semana 1',
    resumen: 'Inducción en la empresa',
    entradaCompleta: 'Semana de inducción con el equipo de RRHH. Me presentaron al equipo de desarrollo y me dieron accesos.',
    revisada: true,
    observacion: 'Buen inicio. Asegúrate de pedir ayuda si te trabas más de 2 horas en configuración.'
  }
])

const semanaDetalle = computed(() => {
  return semanas.value.find(s => s.id === semanaActiva.value)
})
</script>
