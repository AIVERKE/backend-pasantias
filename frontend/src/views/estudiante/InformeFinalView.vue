<template>
  <div class="h-full flex flex-col md:flex-row gap-6 relative">
    
    <!-- Columna Izquierda: Lista de Pasantías Realizadas -->
    <div class="w-full md:w-1/3 flex flex-col gap-4">
      <h2 class="text-lg font-headline font-bold text-secondary mb-2">Historial de Pasantías</h2>
      
      <div 
        v-for="pasantia in pasantias" 
        :key="pasantia.id"
        @click="pasantiaActiva = pasantia.id"
        class="bg-white rounded-xl p-4 shadow-sm border transition-all cursor-pointer flex flex-col gap-3"
        :class="[
          pasantiaActiva === pasantia.id ? 'border-primary ring-1 ring-primary' : 'border-gray-100 hover:border-gray-300',
          pasantia.estado === 'Abandonada' ? 'opacity-70 bg-gray-50' : ''
        ]"
      >
        <div class="flex items-center gap-4">
          <div 
            class="w-12 h-12 rounded-lg flex items-center justify-center font-bold shrink-0 text-xl"
            :class="pasantia.estado === 'Abandonada' ? 'bg-gray-200 text-gray-500' : 'bg-neutral text-primary'"
          >
            {{ pasantia.empresa.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-secondary truncate">{{ pasantia.cargo }}</h3>
            <p class="text-xs text-gray-500 truncate">{{ pasantia.empresa }}</p>
          </div>
        </div>
        
        <div class="flex justify-between items-end mt-1 pt-3 border-t border-gray-50">
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md"
                :class="{
                  'bg-green-50 text-success': pasantia.estado === 'Finalizada',
                  'bg-yellow-50 text-yellow-700': pasantia.estado === 'En Curso',
                  'bg-gray-200 text-gray-600': pasantia.estado === 'Abandonada'
                }">
            {{ pasantia.estado }}
          </span>
          
          <div v-if="pasantia.estado === 'Finalizada'" class="flex items-center gap-1">
            <span class="text-xs text-gray-500 font-medium">Nota:</span>
            <span class="text-sm font-bold font-headline" :class="pasantia.nota >= 51 ? 'text-success' : 'text-danger'">
              {{ pasantia.nota }}/100
            </span>
          </div>
          <div v-else class="text-xs text-gray-400 italic">
            Sin calificación
          </div>
        </div>
      </div>
    </div>

    <!-- Columna Derecha: Detalle del Informe -->
    <div class="w-full md:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden" v-if="informeSeleccionado">
      
      <!-- ESTADO: EN CURSO -->
      <div v-if="informeSeleccionado.estado === 'En Curso'" class="flex flex-col items-center justify-center h-full p-12 text-center">
        <v-icon icon="mdi-account-hard-hat" size="64" class="text-tertiary mb-4"></v-icon>
        <h2 class="text-2xl font-headline font-bold text-secondary mb-2">Pasantía en progreso</h2>
        <p class="text-gray-500 max-w-md">El informe final estará disponible aquí una vez que tu Jefe de Pasantes concluya el periodo de evaluación y emita la calificación definitiva.</p>
      </div>

      <!-- ESTADO: ABANDONADA -->
      <div v-else-if="informeSeleccionado.estado === 'Abandonada'" class="flex flex-col items-center justify-center h-full p-12 text-center">
        <v-icon icon="mdi-close-octagon" size="64" class="text-gray-400 mb-4"></v-icon>
        <h2 class="text-2xl font-headline font-bold text-gray-600 mb-2">Pasantía Cerrada Prematuramente</h2>
        <p class="text-gray-500 max-w-md">Esta pasantía fue marcada como abandonada o dada de baja antes de su finalización. No existe un informe final disponible.</p>
      </div>

      <!-- ESTADO: FINALIZADA -->
      <template v-else-if="informeSeleccionado.estado === 'Finalizada'">
        <!-- Encabezado del Informe -->
        <div class="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start shrink-0">
          <div>
            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-success border border-green-200 mb-3 inline-block">
              Informe Emitido
            </span>
            <h2 class="text-2xl font-headline font-bold text-secondary">Informe Final de Desempeño</h2>
            <p class="text-sm text-gray-500 mt-1">Emitido por {{ informeSeleccionado.evaluador }} (Jefe de Pasantes)</p>
          </div>
          
          <button class="flex items-center gap-2 px-4 py-2 bg-neutral text-secondary font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
            <v-icon icon="mdi-download" size="18"></v-icon>
            Descargar PDF
          </button>
        </div>

        <!-- Contenido del Informe -->
        <div class="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          <!-- Resumen de Notas -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-neutral p-6 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Promedio de Actividades</span>
              <span class="text-4xl font-headline font-bold text-secondary">{{ informeSeleccionado.promedioActividades }}</span>
              <span class="text-xs text-gray-400 mt-1">Calculado automáticamente</span>
            </div>
            
            <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
              <span class="text-xs font-bold text-primary uppercase tracking-wider mb-2">Nota Final Aprobada</span>
              <span class="text-5xl font-headline font-bold text-primary">{{ informeSeleccionado.nota }}</span>
              <span class="text-xs text-blue-400 mt-1">Puntuación Definitiva</span>
            </div>
          </div>

          <!-- Evaluación Cualitativa -->
          <div>
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Evaluación Cualitativa</h3>
            <div class="bg-gray-50 p-6 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {{ informeSeleccionado.comentarios }}
            </div>
          </div>

          <!-- Criterios Evaluados -->
          <div>
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Desglose por Criterios</h3>
            <div class="space-y-4">
              <div v-for="criterio in informeSeleccionado.criterios" :key="criterio.nombre" class="flex items-center gap-4">
                <span class="w-1/3 text-sm text-gray-600 font-medium">{{ criterio.nombre }}</span>
                <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all"
                    :class="criterio.puntaje >= 80 ? 'bg-success' : (criterio.puntaje >= 60 ? 'bg-tertiary' : 'bg-danger')"
                    :style="{ width: `${criterio.puntaje}%` }"
                  ></div>
                </div>
                <span class="w-10 text-right text-sm font-bold text-secondary">{{ criterio.puntaje }}%</span>
              </div>
            </div>
          </div>

          <!-- SECCIÓN CRÍTICA: Feedback del Estudiante -->
          <div class="mt-8 pt-8 border-t border-gray-200">
            <h3 class="text-lg font-headline font-bold text-secondary mb-4">Evalúa tu experiencia</h3>
            
            <div v-if="informeSeleccionado.resenaEstudiante" class="bg-neutral p-6 rounded-xl border border-gray-200">
              <div class="flex items-center gap-1 mb-3 text-tertiary">
                <v-icon v-for="n in 5" :key="n" :icon="n <= informeSeleccionado.resenaEstudiante.estrellas ? 'mdi-star' : 'mdi-star-outline'" size="20"></v-icon>
              </div>
              <p class="text-sm text-gray-600 italic">"{{ informeSeleccionado.resenaEstudiante.comentario }}"</p>
              <p class="text-xs text-gray-400 mt-2">Reseña publicada y visible para otros estudiantes.</p>
            </div>
            
            <div v-else class="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col items-center text-center">
              <p class="text-sm text-gray-600 mb-4">Tu opinión es muy importante. Ayuda a otros estudiantes a conocer cómo es realizar prácticas en esta empresa.</p>
              <button @click="abrirModalResena" class="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-secondary font-bold text-sm rounded-lg hover:border-primary hover:text-primary transition-colors shadow-sm">
                ✍️ Escribir reseña de la empresa
              </button>
            </div>
          </div>

          <!-- Firmas (Visuales) -->
          <div class="mt-12 pt-8 border-t border-gray-200 flex justify-around">
            <div class="text-center">
              <div class="w-48 border-b border-gray-400 mb-2"></div>
              <span class="text-xs text-gray-500 font-medium block">{{ informeSeleccionado.evaluador }}</span>
              <span class="text-[10px] text-gray-400 uppercase tracking-wide">Jefe de Pasantes</span>
            </div>
            <div class="text-center">
              <div class="w-48 border-b border-gray-400 mb-2"></div>
              <span class="text-xs text-gray-500 font-medium block">Sello Empresa</span>
              <span class="text-[10px] text-gray-400 uppercase tracking-wide">{{ informeSeleccionado.empresa }}</span>
            </div>
          </div>

        </div>
      </template>
    </div>

    <!-- Modal para Escribir Reseña -->
    <div v-if="mostrarModalResena" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-xl font-headline font-bold text-secondary">Califica tu experiencia</h2>
          <button @click="cerrarModalResena" class="text-gray-400 hover:text-danger">
            <v-icon icon="mdi-close" size="24"></v-icon>
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <div class="text-center">
            <p class="text-sm font-bold text-gray-600 mb-2">¿Cómo calificarías a {{ informeSeleccionado.empresa }}?</p>
            <div class="flex justify-center gap-2 text-gray-300">
              <button 
                v-for="star in 5" 
                :key="star" 
                @click="nuevaResena.estrellas = star"
                class="hover:scale-110 transition-transform focus:outline-none"
                :class="star <= nuevaResena.estrellas ? 'text-tertiary' : ''"
              >
                <v-icon icon="mdi-star" size="40"></v-icon>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tu reseña pública</label>
            <textarea 
              v-model="nuevaResena.comentario" 
              rows="4" 
              class="w-full bg-neutral text-sm rounded-lg p-3 border border-gray-200 focus:border-primary focus:outline-none resize-none" 
              placeholder="¿Qué te pareció el ambiente laboral? ¿El tutor fue de apoyo? ¿Recomiendas esta empresa a otros estudiantes?"
            ></textarea>
          </div>
        </div>

        <div class="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button @click="cerrarModalResena" class="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            Cancelar
          </button>
          <button @click="guardarResena" class="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm shadow-primary/30">
            Publicar Reseña
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const pasantiaActiva = ref(1)

const pasantias = ref([
  {
    id: 1,
    estado: 'Finalizada',
    empresa: 'TechCorp Bolivia',
    cargo: 'Desarrollador Frontend Vue.js',
    periodo: 'Julio 2025 - Diciembre 2025',
    nota: 92,
    promedioActividades: 90,
    evaluador: 'Ing. Carlos Mendoza',
    comentarios: 'El estudiante demostró excelentes habilidades técnicas y una gran capacidad de aprendizaje rápido.\n\nSe adaptó perfectamente a nuestro flujo de trabajo ágil y logró completar todas las tareas asignadas en los tiempos estimados. Además, propuso mejoras significativas en la interfaz de usuario del proyecto principal.\n\nRecomendamos ampliamente al estudiante para futuras posiciones en el área de desarrollo.',
    criterios: [
      { nombre: 'Conocimiento Técnico', puntaje: 95 },
      { nombre: 'Responsabilidad', puntaje: 100 },
      { nombre: 'Trabajo en Equipo', puntaje: 85 },
      { nombre: 'Iniciativa', puntaje: 90 }
    ],
    resenaEstudiante: null // Para probar cuando no hay reseña aún
  },
  {
    id: 2,
    estado: 'En Curso',
    empresa: 'Jalasoft',
    cargo: 'Pasante de Seguridad Informática',
    periodo: 'Enero 2026 - Presente',
    nota: null,
    promedioActividades: null,
    evaluador: null,
    comentarios: null,
    criterios: [],
    resenaEstudiante: null
  },
  {
    id: 3,
    estado: 'Abandonada',
    empresa: 'Innovación IT Labs',
    cargo: 'Pasante de QA Automation',
    periodo: 'Enero 2024 - Febrero 2024',
    nota: null,
    promedioActividades: null,
    evaluador: null,
    comentarios: null,
    criterios: [],
    resenaEstudiante: null
  },
  {
    id: 4,
    estado: 'Finalizada',
    empresa: 'Banco Bisa',
    cargo: 'Analista de Base de Datos',
    periodo: 'Julio 2024 - Diciembre 2024',
    nota: 88,
    promedioActividades: 85,
    evaluador: 'Lic. Mariana Ríos',
    comentarios: 'Buen desempeño general en la optimización de consultas en nuestra base de datos Oracle.',
    criterios: [
      { nombre: 'Conocimiento Técnico', puntaje: 85 },
      { nombre: 'Responsabilidad', puntaje: 90 },
      { nombre: 'Trabajo en Equipo', puntaje: 85 },
      { nombre: 'Iniciativa', puntaje: 95 }
    ],
    // Ejemplo de una reseña ya existente
    resenaEstudiante: {
      estrellas: 4,
      comentario: 'Fue una buena experiencia, aprendí mucho sobre bases de datos corporativas gigantes. El tutor a veces estaba muy ocupado, pero en general recomiendo mucho el lugar para aprender.'
    }
  }
])

const informeSeleccionado = computed(() => {
  return pasantias.value.find(p => p.id === pasantiaActiva.value)
})

// LÓGICA DE LA RESEÑA
const mostrarModalResena = ref(false)
const nuevaResena = reactive({
  estrellas: 0,
  comentario: ''
})

const abrirModalResena = () => {
  nuevaResena.estrellas = 0
  nuevaResena.comentario = ''
  mostrarModalResena.value = true
}

const cerrarModalResena = () => {
  mostrarModalResena.value = false
}

const guardarResena = () => {
  if (nuevaResena.estrellas === 0) {
    alert('Por favor selecciona al menos una estrella.')
    return
  }
  if (!nuevaResena.comentario.trim()) {
    alert('Por favor escribe un breve comentario de tu experiencia.')
    return
  }
  
  // Guardar en el mock local
  const pasantia = pasantias.value.find(p => p.id === pasantiaActiva.value)
  if (pasantia) {
    pasantia.resenaEstudiante = {
      estrellas: nuevaResena.estrellas,
      comentario: nuevaResena.comentario
    }
  }
  
  cerrarModalResena()
}
</script>
