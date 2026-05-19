<template>
  <div class="h-full flex flex-col">
    <!-- Pestañas de Filtrado -->
    <div v-if="tabsVisibles" class="flex gap-4 mb-6 border-b border-gray-200">
      <button 
        v-for="tab in tabsDinamicos" 
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative min-h-[200px]">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      
      <div 
        v-for="pasantia in pasantiasFiltradas" 
        :key="pasantia.id_pasantia"
        class="bg-white rounded-xl p-5 border border-white/5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full group"
        @click="abrirDetalle(pasantia)"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 rounded-lg bg-neutral flex items-center justify-center font-bold text-primary group-hover:scale-105 transition-transform overflow-hidden">
             <img v-if="pasantia.empresa?.url_logo" :src="pasantia.empresa.url_logo" alt="Logo" class="w-full h-full object-cover" />
             <span v-else>{{ pasantia.empresa?.nombre?.charAt(0) || 'E' }}</span>
          </div>
          <!-- Insignia (Badge) -->
          <span 
            class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-primary"
          >
            Presencial
          </span>
        </div>

        <h3 class="text-lg font-headline font-bold text-secondary mb-1">{{ pasantia.titulo }}</h3>
        <p class="text-sm text-gray-500 font-medium mb-4">{{ pasantia.empresa?.nombre }}</p>

        <div class="mt-auto space-y-2">
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="text-[11px] bg-neutral text-gray-600 px-2 py-1 rounded-md">
              {{ pasantia.area || 'General' }}
            </span>
          </div>
          <div class="flex items-center gap-2 mb-3 text-xs font-medium text-gray-500">
            <span class="w-2 h-2 rounded-full" :class="pasantia.cupos_ocupados >= pasantia.cupos_totales ? 'bg-red-400' : 'bg-green-400'"></span>
            Cupos: {{ pasantia.cupos_ocupados || 0 }}/{{ pasantia.cupos_totales }} ocupados
          </div>
          <div class="flex justify-between items-center pt-3 border-t border-gray-100">
            <span class="text-xs text-gray-400">Inicio: {{ pasantia.fecha_inicio ? new Date(pasantia.fecha_inicio).toLocaleDateString() : 'Por definir' }}</span>
            <button class="text-primary text-sm font-medium hover:underline">Ver detalle</button>
          </div>
        </div>
      </div>
      
      <div v-if="!loading && pasantiasFiltradas.length === 0" class="col-span-full py-12 text-center text-gray-500">
        No hay pasantías disponibles en esta área.
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
          <div class="w-full h-24 bg-gradient-to-r from-blue-500 to-primary rounded-xl mb-12 relative" :style="pasantiaSeleccionada.empresa?.url_portada ? `background-image: url(${pasantiaSeleccionada.empresa.url_portada}); background-size: cover; background-position: center;` : ''">
            <div class="absolute -bottom-8 left-6 w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center text-2xl font-bold text-primary border border-gray-100 overflow-hidden">
              <img v-if="pasantiaSeleccionada.empresa?.url_logo" :src="pasantiaSeleccionada.empresa.url_logo" alt="Logo" class="w-full h-full object-cover" />
              <span v-else>{{ pasantiaSeleccionada.empresa?.nombre?.charAt(0) || 'E' }}</span>
            </div>
          </div>
          
          <div class="px-2">
            <h2 class="text-2xl font-headline font-bold text-secondary">{{ pasantiaSeleccionada.titulo }}</h2>
            <p class="text-primary font-medium mt-1">{{ pasantiaSeleccionada.empresa?.nombre }}</p>
          </div>
        </div>

        <!-- Tarjetas de Resumen (Grises) -->
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-neutral p-4 rounded-lg">
            <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Modalidad</span>
            <span class="font-medium text-secondary text-sm">Presencial</span>
          </div>
          <div class="bg-neutral p-4 rounded-lg">
            <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Horario laboral</span>
            <span class="font-medium text-secondary text-sm">{{ pasantiaSeleccionada.horario_laboral || 'Horario de oficina' }}</span>
          </div>
          <div class="bg-neutral p-4 rounded-lg">
            <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Cupos</span>
            <span class="font-medium text-secondary text-sm">{{ pasantiaSeleccionada.cupos_ocupados || 0 }}/{{ pasantiaSeleccionada.cupos_totales }} ocupados</span>
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
              <li v-for="(req, idx) in pasantiaSeleccionada.requisitos || ['Estudiante de la carrera afín', 'Interés en aprender']" :key="idx">{{ req }}</li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Actividades a Desarrollar</h3>
            <ul class="space-y-2">
              <li v-for="(act, idx) in pasantiaSeleccionada.actividades || ['Apoyo en proyectos del área', 'Otras actividades asignadas']" :key="idx" class="flex items-start gap-2 text-sm text-gray-600">
                <span class="text-primary mt-0.5">✓</span>
                <span>{{ act }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 3. Sección de Comentarios (Feedback) -->
        <div class="mt-8 pt-6 border-t border-gray-100">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Comentarios de Ex Pasantes</h3>
          
          <div v-if="pasantiaSeleccionada.comentarios?.length > 0" class="space-y-4">
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
            class="px-6 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
            :class="ctaConfig.classes"
            @click="actionCTA"
          >
            <v-icon v-if="ctaConfig.loading" size="small" class="animate-spin">mdi-loading</v-icon>
            {{ ctaConfig.text }}
          </button>
        </div>
      </template>
    </SlidePanel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import SlidePanel from '@/components/SlidePanel.vue'

import { useAuthStore } from '@/stores/auth'

// Estado Global
const authStore = useAuthStore()
const idEstudiante = computed(() => authStore.user?.id || 1) // ID del estudiante actual
const pasantias = ref([])
const inscripciones = ref([])
const loading = ref(true)

// Estado del Panel
const isPanelOpen = ref(false)
const activeTab = ref('todas')
const pasantiaSeleccionada = ref(null)

const fetchData = async () => {
  try {
    loading.value = true
    const [resPasantias, resInscripciones] = await Promise.all([
      axios.get('/pasantias'),
      axios.get(`/inscripciones/estudiante/${idEstudiante.value}`)
    ])
    pasantias.value = resPasantias.data
    inscripciones.value = resInscripciones.data
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const tabsDinamicos = computed(() => {
  const uniqueCategories = new Set(pasantias.value.map(p => p.area).filter(Boolean));
  const tabsArray = [{ id: 'todas', label: 'Todas las áreas' }];
  uniqueCategories.forEach(cat => {
    const label = cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ');
    tabsArray.push({ id: cat, label });
  });
  return tabsArray;
});

const tabsVisibles = computed(() => tabsDinamicos.value.length > 2);

const pasantiasFiltradas = computed(() => {
  if (activeTab.value === 'todas') return pasantias.value
  return pasantias.value.filter(p => p.area === activeTab.value)
})

const abrirDetalle = (pasantia) => {
  pasantiaSeleccionada.value = pasantia
  isPanelOpen.value = true
}

// Lógica Condicional del Botón CTA
const postulando = ref(false)

const inscripcionActual = computed(() => {
  if (!pasantiaSeleccionada.value) return null
  return inscripciones.value.find(i => i.pasantia?.id_pasantia === pasantiaSeleccionada.value.id_pasantia)
})

const hasAprobada = computed(() => {
  return inscripciones.value.some(i => i.estado === 'aprobada' || i.estado === 'completada')
})

const cancelarPostulacion = async () => {
  try {
    postulando.value = true
    const id = inscripcionActual.value.id_inscripcion
    await axios.patch(`/inscripciones/${id}/cancelar`)
    await fetchData()
    isPanelOpen.value = false
  } catch (error) {
    alert(error.response?.data?.message || 'Error al cancelar la postulación')
  } finally {
    postulando.value = false
  }
}

const postularse = async () => {
  try {
    postulando.value = true
    await axios.post('/inscripciones', {
      id_estudiante: idEstudiante.value,
      id_pasantia: pasantiaSeleccionada.value.id_pasantia
    })
    await fetchData()
  } catch (error) {
    alert(error.response?.data?.message || 'Error al enviar la postulación')
  } finally {
    postulando.value = false
  }
}

const actionCTA = () => {
  if (ctaConfig.value.action === 'cancelar') {
    cancelarPostulacion()
  } else if (ctaConfig.value.action === 'postular') {
    postularse()
  }
}

const ctaConfig = computed(() => {
  if (!pasantiaSeleccionada.value) return {}

  // ESTADO B: Postulado / En Espera / Aprobada
  if (inscripcionActual.value) {
    if (inscripcionActual.value.estado === 'pendiente') {
      return {
        disabled: postulando.value,
        text: postulando.value ? 'Cancelando...' : 'Cancelar Postulación',
        classes: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-sm',
        action: 'cancelar',
        loading: postulando.value
      }
    } else if (inscripcionActual.value.estado === 'aprobada' || inscripcionActual.value.estado === 'completada') {
      return {
        disabled: true,
        text: 'Inscripción aceptada',
        classes: 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200',
        action: null,
        loading: false
      }
    } else {
      return {
        disabled: true,
        text: `Postulación ${inscripcionActual.value.estado}`,
        classes: 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200',
        action: null,
        loading: false
      }
    }
  }

  /* 
  // SI YA TIENE UNA APROBADA (Bloqueo Global para nuevas postulaciones desactivado temporalmente para pruebas)
  if (hasAprobada.value) {
    return {
      disabled: true,
      text: 'Ya tienes una pasantía activa',
      classes: 'bg-gray-300 text-gray-500 cursor-not-allowed',
      action: null,
      loading: false
    }
  }
  */

  // ESTADO A: Sin Postulación Previa (Disponible)
  return {
    disabled: postulando.value,
    text: postulando.value ? 'Enviando...' : 'Postularme',
    classes: 'bg-primary text-white hover:bg-blue-600 shadow-sm shadow-primary/30',
    action: 'postular',
    loading: postulando.value
  }
})
</script>
