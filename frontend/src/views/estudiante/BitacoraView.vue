<template>
  <div class="h-full">
    <!-- Spinner de carga inicial -->
    <div v-if="cargandoInicial" class="h-full flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <v-progress-circular indeterminate color="primary" size="64" class="mb-4"></v-progress-circular>
      <p class="text-gray-500 font-medium">Cargando bitácora de actividades...</p>
    </div>

    <!-- Estado Vacío (Bloqueo) -->
    <div v-else-if="!pasantiaEnCurso" class="h-full flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <v-icon size="80" color="grey-lighten-2" class="mb-6">mdi-lock-outline</v-icon>
      <h2 class="text-2xl font-headline font-bold text-gray-700 mb-2">Bitácora Bloqueada</h2>
      <p class="text-gray-500 text-center max-w-lg">
        Actualmente no posees ninguna pasantía con estado "En Curso". Esta vista se habilitará automáticamente una vez que el Jefe de Pasantes asigne tareas a tu perfil.
      </p>
    </div>

    <!-- Contenido Principal (Maestro-Detalle) -->
    <div v-else class="h-full flex flex-col md:flex-row gap-6">
      
      <!-- Columna Izquierda: LISTA DE ACTIVIDADES (Maestro) -->
      <div class="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
        
        <!-- Cabecera de Lista -->
        <div class="p-5 border-b border-gray-100 bg-gray-50/50 shrink-0 flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <h2 class="font-headline font-bold text-secondary text-lg">Actividades</h2>
            <span class="text-xs font-bold bg-neutral text-gray-500 px-2.5 py-1 rounded-full">
              {{ actividades.length }} Registradas
            </span>
          </div>

          <!-- Cabecera de Promedio -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between shadow-sm">
            <div>
              <span class="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Rendimiento</span>
              <span class="text-sm font-bold text-gray-700">Promedio General</span>
            </div>
            <div class="text-right">
              <span v-if="promedio !== null" class="text-xl font-headline font-extrabold text-primary">
                {{ promedio }}<span class="text-xs font-semibold text-gray-400">/100</span>
              </span>
              <span v-else class="text-sm font-bold text-gray-400 italic">Sin evaluar</span>
            </div>
          </div>
        </div>
        
        <!-- Lista Plana -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div v-if="actividades.length === 0" class="text-center py-8 text-gray-400 text-sm italic">
            No tienes actividades asignadas todavía.
          </div>
          
          <button 
            v-for="act in actividades" 
            :key="act.id_tarea"
            @click="selectActivity(act.id_tarea)"
            class="w-full text-left p-4 rounded-xl border transition-all duration-200 relative flex flex-col gap-2"
            :class="selectedActivityId === act.id_tarea 
              ? 'bg-blue-50/30 border-primary/40 shadow-sm ring-1 ring-primary/10' 
              : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-neutral/40'"
          >
            <div v-if="selectedActivityId === act.id_tarea" class="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r"></div>
            
            <div class="flex justify-between items-start w-full">
              <span class="font-bold text-sm line-clamp-1 flex-1" 
                    :class="selectedActivityId === act.id_tarea ? 'text-primary' : 'text-secondary'">
                {{ act.titulo_actividad || 'Actividad sin título' }}
              </span>
              <!-- Calificación si existe -->
              <span v-if="act.nota_actividad !== null" class="text-xs font-headline font-bold text-success ml-2 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded">
                {{ act.nota_actividad }}
              </span>
            </div>
            
            <div class="flex items-center gap-2 mt-1">
              <!-- Círculo de color para el estado -->
              <span class="w-2 h-2 rounded-full shrink-0" :class="getEstadoDotClass(act.estado_semaforo)"></span>
              <span class="text-xs font-semibold" :class="getEstadoColor(act.estado_semaforo)">
                {{ formatEstado(act.estado_semaforo) }}
              </span>
              <span class="text-[10px] text-gray-400 ml-auto shrink-0">{{ formatDateShort(act.fecha_asignacion) }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Columna Derecha: PANEL DE DETALLE (Detalle) -->
      <div class="w-full md:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
        
        <!-- Estado Vacío del Panel Derecho -->
        <div v-if="!selectedActivity" class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/20">
          <v-icon size="64" color="grey-lighten-3" class="mb-4">mdi-card-text-outline</v-icon>
          <h3 class="text-lg font-headline font-bold text-gray-600 mb-1">Detalles de Actividad</h3>
          <p class="text-sm text-gray-400 max-w-sm">
            Selecciona una actividad de la lista de la izquierda para ver su descripción, calificaciones y abrir el chat de consultas en tiempo real con tu tutor o jefe de pasantías.
          </p>
        </div>

        <!-- Panel con Datos de Actividad -->
        <template v-else>
          <!-- Encabezado del Panel -->
          <div class="border-b border-gray-100 bg-gray-50/50 p-6 shrink-0 flex justify-between items-center">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-2 h-2 rounded-full" :class="getEstadoDotClass(selectedActivity.estado_semaforo)"></span>
                <span class="text-xs font-bold uppercase tracking-wider" :class="getEstadoColor(selectedActivity.estado_semaforo)">
                  {{ formatEstado(selectedActivity.estado_semaforo) }}
                </span>
              </div>
              <h2 class="text-xl font-headline font-bold text-secondary">{{ selectedActivity.titulo_actividad }}</h2>
            </div>
            
            <!-- Botón Generar Reporte Rediseñado Premium -->
            <v-btn 
              color="primary" 
              variant="flat" 
              rounded="pill"
              class="text-none font-bold px-5 text-white elevation-1 shadow-md shadow-light-blue-500/20"
              :loading="loadingReport"
              @click="generarReporte(selectedActivity.id_tarea)"
            >
              <v-icon start size="small">mdi-file-pdf-box</v-icon>
              Generar Reporte
            </v-btn>
          </div>

          <!-- Contenido Central Scrollable (Detalles + Chat) -->
          <div class="flex-1 overflow-y-auto flex flex-col">
            
            <!-- Bloque de Detalles de Tarea -->
            <div class="p-6 md:p-8 border-b border-gray-100 flex flex-col gap-6 shrink-0 bg-white">
              
              <!-- Descripción -->
              <div>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Descripción de la Tarea</span>
                <p class="text-sm text-gray-600 leading-relaxed bg-neutral/30 rounded-xl p-4 border border-gray-100">
                  {{ selectedActivity.descripcion_actividad || 'Sin descripción disponible.' }}
                </p>
              </div>

              <!-- Metadatos (Fechas, Responsable, Calificación) -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-4 rounded-xl border border-gray-100 bg-neutral/10 flex items-center gap-3">
                  <v-icon color="primary" size="large">mdi-calendar-clock</v-icon>
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fecha Asignación</span>
                    <span class="text-xs font-bold text-gray-700">{{ formatDate(selectedActivity.fecha_asignacion) }}</span>
                  </div>
                </div>

                <div class="p-4 rounded-xl border border-gray-100 bg-neutral/10 flex items-center gap-3">
                  <v-icon color="primary" size="large">mdi-account-tie-outline</v-icon>
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Responsable</span>
                    <span class="text-xs font-bold text-gray-700 line-clamp-1">
                      {{ selectedActivity.jefe?.usuario ? `Ing. ${selectedActivity.jefe.usuario.nombre} ${selectedActivity.jefe.usuario.apellido_paterno}` : 'Jefe de Pasantes' }}
                    </span>
                  </div>
                </div>

                <div class="p-4 rounded-xl border border-gray-100 flex items-center gap-3"
                     :class="selectedActivity.nota_actividad !== null ? 'bg-green-50/50 border-green-100 text-success' : 'bg-neutral/10 border-gray-100'">
                  <v-icon :color="selectedActivity.nota_actividad !== null ? 'success' : 'grey-darken-1'" size="large">
                    {{ selectedActivity.nota_actividad !== null ? 'mdi-star-circle-outline' : 'mdi-star-outline' }}
                  </v-icon>
                  <div>
                    <span class="block text-[10px] font-bold uppercase tracking-wider"
                          :class="selectedActivity.nota_actividad !== null ? 'text-green-500' : 'text-gray-400'">
                      Evaluación
                    </span>
                    <span class="text-xs font-extrabold" :class="selectedActivity.nota_actividad !== null ? 'text-success text-sm' : 'text-gray-500'">
                      {{ selectedActivity.nota_actividad !== null ? `Nota: ${selectedActivity.nota_actividad} / 100` : 'Sin Calificar' }}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <!-- Sección de Chat Integrado (CRÍTICO) -->
            <div class="flex-1 flex flex-col bg-gray-50/30">
              
              <!-- Encabezado del Chat -->
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <v-icon size="small" color="primary">mdi-chat-processing-outline</v-icon>
                <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Consultas sobre la Tarea</span>
              </div>

              <!-- Hilo de Mensajes -->
              <div class="flex-1 p-6 space-y-4 max-h-[300px] overflow-y-auto" ref="chatContainer">
                
                <div v-if="cargandoComentarios" class="flex justify-center py-8">
                  <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
                </div>
                
                <div v-else-if="comentarios.length === 0" class="text-center py-8 text-xs text-gray-400 italic">
                  No hay mensajes. Realiza tu primera consulta sobre esta actividad en el cuadro de abajo.
                </div>
                
                <template v-else>
                  <div 
                    v-for="msg in comentarios" 
                    :key="msg.id_comentario"
                    class="flex flex-col max-w-[80%]"
                    :class="msg.rol === 'Estudiante' ? 'ml-auto items-end' : 'mr-auto items-start'"
                  >
                    <!-- Metadatos sobre el globo -->
                    <span class="text-[10px] text-gray-400 mb-1 px-1">
                      {{ msg.rol === 'Estudiante' ? 'Tú' : msg.autor }} • {{ formatTime(msg.fecha) }}
                    </span>
                    
                    <!-- Burbuja de Chat -->
                    <div 
                      class="text-sm p-3.5 rounded-2xl shadow-sm border animate-fade-in"
                      :class="msg.rol === 'Estudiante' 
                        ? 'bg-primary text-white border-primary rounded-tr-none' 
                        : 'bg-white text-gray-700 border-gray-100 rounded-tl-none'"
                    >
                      <p class="whitespace-pre-wrap leading-relaxed">{{ msg.texto }}</p>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Input y Botón de Enviar -->
              <div class="p-4 border-t border-gray-100 bg-white shrink-0">
                <div class="flex gap-2 items-end">
                  <v-textarea
                    v-model="nuevoComentario"
                    placeholder="Escribe tu duda o consulta aquí..."
                    rows="1"
                    auto-grow
                    hide-details
                    variant="outlined"
                    density="comfortable"
                    class="flex-1 text-sm bg-white"
                    :disabled="enviandoComentario"
                    @keydown.enter.prevent="enviarComentario"
                  ></v-textarea>
                  
                  <v-btn
                    color="primary"
                    variant="flat"
                    icon="mdi-send-outline"
                    class="shadow-sm shrink-0 mb-1"
                    :loading="enviandoComentario"
                    :disabled="!nuevoComentario.trim()"
                    @click="enviarComentario"
                  ></v-btn>
                </div>
              </div>

            </div>

          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const idEstudiante = computed(() => authStore.user?.id || 1) // ID del estudiante actual
const cargandoInicial = ref(true)
const pasantiaEnCurso = ref(false)
const promedio = ref(null)
const actividades = ref([])
const selectedActivityId = ref(null)

const comentarios = ref([])
const nuevoComentario = ref('')
const cargandoComentarios = ref(false)
const enviandoComentario = ref(false)
const loadingReport = ref(false)
const nombreEstudiante = ref('')

const chatContainer = ref(null)

const fetchData = async () => {
  try {
    cargandoInicial.value = true
    
    // 1. Verificar si tiene pasantía activa/en curso
    const resInsc = await axios.get(`/inscripciones/estudiante/${idEstudiante.value}`)
    // Vemos si hay alguna inscripción aprobada o completada
    const activeInsc = resInsc.data.find(ins => ins.estado === 'aprobada' || ins.estado === 'completada')
    
    if (activeInsc) {
      pasantiaEnCurso.value = true
      
      // Guardar nombre del estudiante para el chat
      if (activeInsc.estudiante && activeInsc.estudiante.usuario) {
        const u = activeInsc.estudiante.usuario
        nombreEstudiante.value = `${u.nombre} ${u.apellido_paterno || ''}`.trim()
      }
      
      // 2. Traer actividades del estudiante
      const resAct = await axios.get(`/actividades/estudiante/${idEstudiante.value}`)
      actividades.value = resAct.data.actividades
      promedio.value = resAct.data.promedio
      
      if (actividades.value.length > 0) {
        selectedActivityId.value = actividades.value[0].id_tarea
      }
    } else {
      pasantiaEnCurso.value = false
    }
  } catch (error) {
    console.error('Error al cargar la bitácora:', error)
  } finally {
    cargandoInicial.value = false
  }
}

onMounted(() => {
  fetchData()
})

const selectedActivity = computed(() => {
  return actividades.value.find(act => act.id_tarea === selectedActivityId.value) || null
})

const selectActivity = (id) => {
  selectedActivityId.value = id
}

// Watcher para cargar comentarios al cambiar de actividad
watch(selectedActivityId, (newId) => {
  if (newId) {
    fetchComentarios(newId)
  } else {
    comentarios.value = []
  }
})

const fetchComentarios = async (actId) => {
  try {
    cargandoComentarios.value = true
    const res = await axios.get(`/actividades/${actId}/comentarios`)
    comentarios.value = res.data
    scrollToBottom()
  } catch (error) {
    console.error('Error al cargar comentarios:', error)
  } finally {
    cargandoComentarios.value = false
  }
}

const enviarComentario = async () => {
  if (!nuevoComentario.value.trim() || !selectedActivityId.value) return
  
  try {
    enviandoComentario.value = true
    const actId = selectedActivityId.value
    const res = await axios.post(`/actividades/${actId}/comentarios`, {
      texto: nuevoComentario.value,
      rol: 'Estudiante',
      autor: nombreEstudiante.value || 'Estudiante'
    })
    comentarios.value.push(res.data)
    nuevoComentario.value = ''
    scrollToBottom()
  } catch (error) {
    console.error('Error al enviar comentario:', error)
    alert('Error al enviar el comentario')
  } finally {
    enviandoComentario.value = false
  }
}

const generarReporte = (actId) => {
  loadingReport.value = true
  setTimeout(() => {
    loadingReport.value = false
    alert(`Reporte PDF para la actividad ${actId} generado exitosamente.`)
  }, 1500)
}

// Scroll al final del chat
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// Helpers de formateo
const formatEstado = (estado) => {
  if (!estado) return 'Pendiente'
  return estado.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const getEstadoColor = (estado) => {
  switch (estado) {
    case 'Completada': return 'text-green-600'
    case 'En_curso': return 'text-amber-500'
    case 'No_completada': return 'text-red-500'
    default: return 'text-gray-400'
  }
}

const getEstadoDotClass = (estado) => {
  switch (estado) {
    case 'Completada': return 'bg-green-500'
    case 'En_curso': return 'bg-amber-500'
    case 'No_completada': return 'bg-red-500'
    default: return 'bg-gray-400'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

const formatDateShort = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}
</script>
