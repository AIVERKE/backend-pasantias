<template>
  <div class="h-full flex flex-col">
    <!-- Pestañas de Filtrado -->
    <div class="flex gap-4 mb-6 border-b border-gray-200">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="pb-3 px-1 text-sm font-medium transition-colors relative"
        :class="activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-secondary'"
      >
        {{ tab.label }}
        <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full transition-all duration-150"></div>
      </button>
    </div>

    <!-- Grid de Tarjetas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="pasantia in pasantiasFiltradas" 
        :key="pasantia.id"
        class="bg-white rounded-xl p-5 border border-white/5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full group"
        @click="abrirDetalle(pasantia)"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 rounded-lg bg-neutral flex items-center justify-center font-bold text-primary group-hover:scale-105 transition-transform">
            {{ pasantia.empresa.charAt(0) }}
          </div>
          <!-- Insignia (Badge) -->
          <span 
            class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            :class="pasantia.tipo === 'Remoto' ? 'bg-blue-50 text-primary' : 'bg-green-50 text-success'"
          >
            {{ pasantia.tipo }}
          </span>
        </div>

        <h3 class="text-lg font-headline font-bold text-secondary mb-1">{{ pasantia.titulo }}</h3>
        <p class="text-sm text-gray-500 font-medium mb-4">{{ pasantia.empresa }}</p>

        <div class="mt-auto space-y-2">
          <div class="flex flex-wrap gap-2 mb-3">
            <span v-for="tag in pasantia.tags" :key="tag" class="text-[11px] bg-neutral text-gray-600 px-2 py-1 rounded-md">
              {{ tag }}
            </span>
          </div>
          <div class="flex items-center gap-2 mb-3 text-xs font-medium text-gray-500">
            <span class="w-2 h-2 rounded-full" :class="pasantia.cuposOcupados >= pasantia.cuposTotales ? 'bg-red-400' : 'bg-green-400'"></span>
            Cupos: {{ pasantia.cuposOcupados }}/{{ pasantia.cuposTotales }} ocupados
          </div>
          <div class="flex justify-between items-center pt-3 border-t border-gray-100">
            <span class="text-xs text-gray-400">Vence: {{ pasantia.fechaLimite }}</span>
            <button class="text-primary text-sm font-medium hover:underline">Ver detalle</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel Lateral de Detalles (600px según prompt) -->
    <SlidePanel 
      :isOpen="isPanelOpen" 
      :title="'Detalle de Pasantía'" 
      width="600px"
      @close="isPanelOpen = false"
    >
      <div v-if="pasantiaSeleccionada" class="space-y-6">
        <!-- 1. Encabezado e Información Rápida -->
        <div class="border-b border-gray-100 pb-6">
          <!-- Banner corporativo simulado -->
          <div class="w-full h-24 bg-gradient-to-r from-blue-500 to-primary rounded-xl mb-12 relative">
            <div class="absolute -bottom-8 left-6 w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center text-2xl font-bold text-primary border border-gray-100">
              {{ pasantiaSeleccionada.empresa.charAt(0) }}
            </div>
          </div>
          
          <div class="px-2">
            <h2 class="text-2xl font-headline font-bold text-secondary">{{ pasantiaSeleccionada.titulo }}</h2>
            <p class="text-primary font-medium mt-1">{{ pasantiaSeleccionada.empresa }}</p>
          </div>
        </div>

        <!-- Tarjetas de Resumen (Grises) -->
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-neutral p-4 rounded-lg">
            <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Modalidad</span>
            <span class="font-medium text-secondary text-sm">{{ pasantiaSeleccionada.tipo }}</span>
          </div>
          <div class="bg-neutral p-4 rounded-lg">
            <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Horario laboral</span>
            <span class="font-medium text-secondary text-sm">{{ pasantiaSeleccionada.horario }}</span>
          </div>
          <div class="bg-neutral p-4 rounded-lg">
            <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Cupos</span>
            <span class="font-medium text-secondary text-sm">{{ pasantiaSeleccionada.cuposOcupados }}/{{ pasantiaSeleccionada.cuposTotales }} ocupados</span>
          </div>
        </div>

        <!-- 2. Cuerpo del Contenido (Secciones) -->
        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Descripción del Puesto</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ pasantiaSeleccionada.descripcion }}</p>
          </div>

          <div>
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Requisitos del Puesto</h3>
            <ul class="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li v-for="(req, idx) in pasantiaSeleccionada.requisitos" :key="idx">{{ req }}</li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Actividades a Desarrollar</h3>
            <ul class="space-y-2">
              <li v-for="(act, idx) in pasantiaSeleccionada.actividades" :key="idx" class="flex items-start gap-2 text-sm text-gray-600">
                <span class="text-primary mt-0.5">✓</span>
                <span>{{ act }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 3. Sección de Comentarios (Feedback) -->
        <div class="mt-8 pt-6 border-t border-gray-100">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Comentarios de Ex Pasantes</h3>
          
          <div v-if="pasantiaSeleccionada.comentarios.length > 0" class="space-y-4">
            <div v-for="(comentario, idx) in pasantiaSeleccionada.comentarios" :key="idx" class="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {{ comentario.autor.charAt(0) }}
                  </div>
                  <span class="text-sm font-bold text-secondary">{{ comentario.autor }}</span>
                </div>
                <!-- Componente visual de valoración (Estrellas) -->
                <div class="flex text-yellow-400 text-sm">
                  <span v-for="i in 5" :key="i">
                    {{ i <= comentario.rating ? '★' : '☆' }}
                  </span>
                </div>
              </div>
              <p class="text-sm text-gray-600 mt-2">{{ comentario.texto }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 italic">No hay comentarios de ex pasantes para esta empresa aún.</p>
        </div>
      </div>

      <!-- 4. Barra Inferior Fija (Botón de Acción - CTA) -->
      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <button 
            @click="isPanelOpen = false" 
            class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            :disabled="ctaConfig.disabled"
            class="px-6 py-2 text-sm font-bold rounded-lg transition-colors"
            :class="ctaConfig.classes"
          >
            {{ ctaConfig.text }}
          </button>
        </div>
      </template>
    </SlidePanel>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SlidePanel from '@/components/SlidePanel.vue'

// Estado Global Simulado del Estudiante
// Puedes cambiar a 'con_pasantia' para ver el estado de bloqueo
const estadoEstudianteGlobal = ref('disponible') 
// IDs de pasantías a las que ya se postuló
const pasantiasPostuladas = ref([2]) 

// Estado del Panel
const isPanelOpen = ref(false)
const activeTab = ref('todas')
const pasantiaSeleccionada = ref(null)

// Datos Mock Actualizados
const tabs = [
  { id: 'todas', label: 'Todas las áreas' },
  { id: 'sistemas', label: 'Ingeniería de Sistemas' },
  { id: 'informatica', label: 'Informática' }
]

const pasantias = ref([
  {
    id: 1,
    titulo: 'Desarrollador Frontend Vue.js',
    empresa: 'TechCorp Bolivia',
    tipo: 'Remoto',
    horario: 'Lun - Vie, 09:00 a 13:00',
    cuposTotales: 3,
    cuposOcupados: 1,
    categoria: 'sistemas',
    fechaLimite: '30 Abr 2026',
    tags: ['Vue.js', 'Tailwind', 'APIs'],
    descripcion: 'Buscamos un estudiante entusiasta para unirse a nuestro equipo de desarrollo trabajando en plataformas web modernas. Aprenderás buenas prácticas de código y metodologías ágiles.',
    requisitos: [
      'Estudiante de último año de Ingeniería de Sistemas.',
      'Conocimientos básicos en HTML, CSS y JavaScript.',
      'Familiaridad con frameworks frontend (Vue.js o React).'
    ],
    actividades: [
      'Maquetación de interfaces web usando Tailwind CSS.',
      'Consumo de APIs RESTful.',
      'Participación en dailies y revisión de código.'
    ],
    comentarios: [
      { autor: 'Ana López', rating: 5, texto: 'Excelente ambiente laboral, los tutores realmente se preocupan por que aprendas. Totalmente recomendado.' },
      { autor: 'Carlos Ruiz', rating: 4, texto: 'Mucho aprendizaje en poco tiempo. A veces el ritmo es alto pero vale la pena.' }
    ]
  },
  {
    id: 2,
    titulo: 'Analista de Base de Datos',
    empresa: 'Banco Bisa',
    tipo: 'Presencial',
    horario: 'Lun - Vie, 08:30 a 12:30',
    cuposTotales: 2,
    cuposOcupados: 0,
    categoria: 'informatica',
    fechaLimite: '15 May 2026',
    tags: ['SQL', 'Oracle', 'ETL'],
    descripcion: 'Participación en el equipo de Business Intelligence para optimización de consultas, migración de datos y creación de reportes operativos.',
    requisitos: [
      'Sólidos conocimientos en SQL y bases de datos relacionales.',
      'Conocimientos en metodologías de diseño de bases de datos.',
      'Proactividad y capacidad de análisis.'
    ],
    actividades: [
      'Optimización de consultas SQL lentas.',
      'Diseño y ejecución de procesos ETL básicos.',
      'Apoyo en la creación de dashboards de BI.'
    ],
    comentarios: []
  },
  {
    id: 3,
    titulo: 'Pasante de Seguridad Informática',
    empresa: 'Jalasoft',
    tipo: 'Híbrido',
    horario: 'Lun - Vie, 14:00 a 18:00',
    cuposTotales: 5,
    cuposOcupados: 4,
    categoria: 'sistemas',
    fechaLimite: '10 May 2026',
    tags: ['Pentesting', 'Redes', 'Linux'],
    descripcion: 'Apoyo en auditorías de seguridad, escaneo de vulnerabilidades y elaboración de informes técnicos de mitigación.',
    requisitos: [
      'Conocimiento en redes (TCP/IP, enrutamiento).',
      'Manejo de sistemas operativos basados en Linux.',
      'Interés comprobable en ciberseguridad.'
    ],
    actividades: [
      'Ejecución de escaneos de vulnerabilidades automatizados.',
      'Redacción de reportes técnicos de hallazgos.',
      'Apoyo en auditorías de seguridad internas.'
    ],
    comentarios: [
      { autor: 'Miguel Soto', rating: 5, texto: 'Una oportunidad increíble para aplicar conceptos de seguridad en proyectos reales.' }
    ]
  }
])

const pasantiasFiltradas = computed(() => {
  if (activeTab.value === 'todas') return pasantias.value
  return pasantias.value.filter(p => p.categoria === activeTab.value)
})

const abrirDetalle = (pasantia) => {
  pasantiaSeleccionada.value = pasantia
  isPanelOpen.value = true
}

// Lógica Condicional del Botón CTA
const ctaConfig = computed(() => {
  if (!pasantiaSeleccionada.value) return {}

  // ESTADO 1: Bloqueo por Pasantía Activa
  if (estadoEstudianteGlobal.value === 'con_pasantia') {
    return {
      disabled: true,
      text: 'Tienes una pasantía en curso',
      classes: 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }
  }

  // ESTADO 2: Ya Postulado a ESTA pasantía
  if (pasantiasPostuladas.value.includes(pasantiaSeleccionada.value.id)) {
    return {
      disabled: true,
      text: 'Postulación enviada',
      classes: 'bg-green-50 text-green-600 border border-green-200 cursor-not-allowed'
    }
  }

  // ESTADO 3: Disponible para Postular
  return {
    disabled: false,
    text: 'Postularme',
    classes: 'bg-primary text-white hover:bg-blue-600 shadow-sm shadow-primary/30'
  }
})
</script>
