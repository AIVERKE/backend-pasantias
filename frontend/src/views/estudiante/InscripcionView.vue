<template>
  <div class="h-full flex flex-col">
    <!-- Estado Vacío (Sin postulaciones) -->
    <v-container fluid v-if="!loading && postulaciones.length === 0" class="flex-1 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-8 w-full">
      <v-icon size="80" color="grey-lighten-2" class="mb-6">mdi-folder-open-outline</v-icon>
      <h2 class="text-2xl font-headline font-bold text-gray-700 mb-2">No tienes postulaciones activas</h2>
      <p class="text-gray-500 text-center max-w-lg mb-6">
        Aún no has aplicado a ninguna oferta de pasantía. Te invitamos a explorar las convocatorias vigentes y enviar tu postulación.
      </p>
      <router-link to="/estudiante/pasantias">
        <v-btn color="primary" class="font-bold text-none px-6">
          Ver Pasantías Disponibles
        </v-btn>
      </router-link>
    </v-container>

    <div v-else class="flex-1 flex flex-col w-full">
      <div v-if="loading" class="flex-1 flex items-center justify-center min-h-[300px]">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <template v-else>
        <!-- Pestañas por postulación -->
        <div v-if="postulaciones.length > 1" class="flex gap-2 border-b border-gray-200 overflow-x-auto pt-2 px-4 relative z-10">
          <button 
            v-for="postulacion in postulaciones" 
            :key="postulacion.id_inscripcion"
            @click="activeTabId = postulacion.id_inscripcion"
            class="px-5 py-3 text-sm font-medium transition-colors relative whitespace-nowrap rounded-t-xl"
            :class="activeTabId === postulacion.id_inscripcion ? 'text-primary bg-white border border-b-0 border-gray-200 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]' : 'text-gray-500 hover:text-secondary hover:bg-gray-100'"
          >
            <div class="flex items-center gap-2">
              <span>{{ postulacion.pasantia?.empresa?.nombre }}</span>
              <div 
                class="w-2 h-2 rounded-full"
                :class="{
                  'bg-tertiary': formatEstado(postulacion.estado) === 'Pendiente',
                  'bg-success': formatEstado(postulacion.estado) === 'Aprobada',
                  'bg-danger': formatEstado(postulacion.estado) === 'Rechazada'
                }"
              ></div>
            </div>
            <!-- Elemento superpuesto para tapar el borde inferior cuando está activo -->
            <div v-if="activeTabId === postulacion.id_inscripcion" class="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-white"></div>
            <div v-if="activeTabId === postulacion.id_inscripcion" class="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-xl transition-all"></div>
          </button>
        </div>

        <!-- Contenido de la Postulación Activa -->
        <div v-if="postulacionActiva" class="w-full relative z-0">
          <div class="bg-white shadow-sm border border-gray-200 p-6 md:p-8 w-full max-w-5xl"
               :class="postulaciones.length > 1 ? 'rounded-b-xl rounded-tr-xl border-t-0' : 'rounded-xl'">
            
            <!-- Encabezado de Estado -->
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-100 gap-4">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-xl bg-neutral flex items-center justify-center font-bold text-2xl text-primary shrink-0 overflow-hidden border border-gray-100">
                  <img v-if="postulacionActiva.pasantia?.empresa?.url_logo" :src="postulacionActiva.pasantia.empresa.url_logo" alt="Logo" class="w-full h-full object-cover" />
                  <span v-else>{{ postulacionActiva.pasantia?.empresa?.nombre?.charAt(0) || 'E' }}</span>
                </div>
                <div>
                  <h2 class="text-2xl font-headline font-bold text-secondary">{{ postulacionActiva.pasantia?.titulo }}</h2>
                  <p class="text-primary font-medium">{{ postulacionActiva.pasantia?.empresa?.nombre }}</p>
                </div>
              </div>
              
              <div class="flex flex-col items-start md:items-end gap-2">
                <span 
                  class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                  :class="{
                    'bg-orange-50 text-tertiary border border-orange-200': formatEstado(postulacionActiva.estado) === 'Pendiente',
                    'bg-green-50 text-success border border-green-200': formatEstado(postulacionActiva.estado) === 'Aprobada',
                    'bg-red-50 text-danger border border-red-200': formatEstado(postulacionActiva.estado) === 'Rechazada'
                  }"
                >
                  Estado: {{ formatEstado(postulacionActiva.estado) }}
                </span>
                <span class="text-xs text-gray-500">Postulado el: {{ postulacionActiva.fecha_inscripcion ? new Date(postulacionActiva.fecha_inscripcion).toLocaleDateString() : 'Por definir' }}</span>
              </div>
            </div>

            <!-- Alerta según estado -->
            <div 
              class="mb-8 p-5 rounded-xl flex items-start gap-4 border shadow-sm"
              :class="{
                'bg-orange-50/50 border-orange-200': formatEstado(postulacionActiva.estado) === 'Pendiente',
                'bg-green-50/50 border-green-200': formatEstado(postulacionActiva.estado) === 'Aprobada',
                'bg-red-50/50 border-red-200': formatEstado(postulacionActiva.estado) === 'Rechazada'
              }"
            >
              <div class="mt-1">
                <v-icon v-if="formatEstado(postulacionActiva.estado) === 'Aprobada'" color="success" size="large">mdi-check-circle</v-icon>
                <v-icon v-else-if="formatEstado(postulacionActiva.estado) === 'Rechazada'" color="error" size="large">mdi-close-circle</v-icon>
                <v-icon v-else color="warning" size="large">mdi-clock-outline</v-icon>
              </div>
              <div>
                <h4 
                  class="text-sm font-bold mb-1.5"
                  :class="{
                    'text-tertiary': formatEstado(postulacionActiva.estado) === 'Pendiente',
                    'text-success': formatEstado(postulacionActiva.estado) === 'Aprobada',
                    'text-danger': formatEstado(postulacionActiva.estado) === 'Rechazada'
                  }"
                >
                  {{ mensajeEstado(formatEstado(postulacionActiva.estado)).titulo }}
                </h4>
                <p class="text-sm text-gray-600 leading-relaxed">{{ postulacionActiva.comentario_jefe || mensajeEstado(formatEstado(postulacionActiva.estado)).cuerpo }}</p>
              </div>
            </div>

            <!-- Detalles de la Pasantía -->
            <div class="mb-8">
              <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Información de la Convocatoria</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <!-- Tarjeta Modalidad -->
                <div class="bg-gray-50/80 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow flex items-start gap-3">
                  <div class="p-2 bg-blue-100 text-primary rounded-lg shrink-0">
                    <v-icon size="small">mdi-office-building-marker</v-icon>
                  </div>
                  <div>
                    <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Modalidad</span>
                    <span class="text-sm text-secondary font-bold">Presencial</span>
                  </div>
                </div>

                <!-- Tarjeta Horario -->
                <div class="bg-gray-50/80 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow flex items-start gap-3">
                  <div class="p-2 bg-blue-100 text-primary rounded-lg shrink-0">
                    <v-icon size="small">mdi-clock-outline</v-icon>
                  </div>
                  <div>
                    <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Horario Laboral</span>
                    <span class="text-sm text-secondary font-bold">{{ postulacionActiva.pasantia?.horario_laboral || 'Horario Oficina' }}</span>
                  </div>
                </div>

                <!-- Tarjeta Cupos -->
                <div class="bg-gray-50/80 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow flex items-start gap-3">
                  <div class="p-2 bg-blue-100 text-primary rounded-lg shrink-0">
                    <v-icon size="small">mdi-account-group-outline</v-icon>
                  </div>
                  <div>
                    <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Cupos</span>
                    <span class="text-sm text-secondary font-bold">{{ postulacionActiva.pasantia?.cupos_ocupados || 0 }}/{{ postulacionActiva.pasantia?.cupos_totales }} Ocupados</span>
                  </div>
                </div>

                <!-- Tarjeta Requisitos -->
                <div class="bg-gray-50/80 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow flex items-start gap-3">
                  <div class="p-2 bg-blue-100 text-primary rounded-lg shrink-0">
                    <v-icon size="small">mdi-file-document-check-outline</v-icon>
                  </div>
                  <div>
                    <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Requisitos</span>
                    <span class="text-sm text-secondary font-bold">Hoja de Vida</span>
                  </div>
                </div>
              </div>

              <!-- Descripción del puesto -->
              <div class="bg-neutral p-5 rounded-xl border border-gray-100 shadow-inner">
                <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-3 flex items-center gap-2">
                  <v-icon size="small" color="primary">mdi-text-box-outline</v-icon> Descripción del Puesto
                </span>
                <p class="text-sm text-gray-600 leading-relaxed">{{ postulacionActiva.pasantia?.descripcion }}</p>
              </div>
            </div>

            <!-- Acciones Inferiores (CTA) -->
            <div class="pt-6 border-t border-gray-100 flex justify-end">
              <!-- ESTADO A: Rechazada -->
              <router-link v-if="formatEstado(postulacionActiva.estado) === 'Rechazada'" to="/estudiante/pasantias">
                <button class="px-5 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Buscar otras pasantías
                </button>
              </router-link>
              
              <!-- ESTADO B: Pendiente -->
              <button 
                v-else-if="formatEstado(postulacionActiva.estado) === 'Pendiente'" 
                class="px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 border border-transparent hover:border-red-200"
                :disabled="cancelando"
                @click="cancelarPostulacion(postulacionActiva.id_inscripcion)"
              >
                <v-icon v-if="cancelando" size="small" class="animate-spin">mdi-loading</v-icon>
                <v-icon v-else size="small">mdi-close-circle-outline</v-icon>
                {{ cancelando ? 'Cancelando...' : 'Cancelar Postulación' }}
              </button>
              
              <!-- ESTADO C: Aprobada -->
              <router-link v-else-if="formatEstado(postulacionActiva.estado) === 'Aprobada'" to="/estudiante/bitacora">
                <button class="px-6 py-2.5 bg-success text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors shadow-md shadow-success/30 flex items-center gap-2">
                  <v-icon size="small">mdi-notebook-check-outline</v-icon>
                  Ir a mi Bitácora
                </button>
              </router-link>
            </div>

          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const idEstudiante = computed(() => authStore.user?.id || 1) // Simulado: ID del estudiante actual
const postulaciones = ref([])
const activeTabId = ref(null)
const loading = ref(true)
const cancelando = ref(false)

const fetchData = async () => {
  try {
    loading.value = true
    const res = await axios.get(`/inscripciones/estudiante/${idEstudiante.value}`)
    postulaciones.value = res.data
    if (postulaciones.value.length > 0 && !activeTabId.value) {
      activeTabId.value = postulaciones.value[0].id_inscripcion
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const postulacionActiva = computed(() => {
  return postulaciones.value.find(p => p.id_inscripcion === activeTabId.value)
})

const formatEstado = (estado) => {
  if (!estado) return ''
  return estado.charAt(0).toUpperCase() + estado.slice(1)
}

const cancelarPostulacion = async (id) => {
  try {
    cancelando.value = true
    await axios.patch(`/inscripciones/${id}/cancelar`)
    activeTabId.value = null
    await fetchData()
  } catch (error) {
    alert(error.response?.data?.message || 'Error al cancelar la postulación')
  } finally {
    cancelando.value = false
  }
}

const mensajeEstado = (estado) => {
  if (estado === 'Pendiente') {
    return {
      titulo: 'En revisión por la empresa',
      cuerpo: 'Tu postulación ha sido enviada correctamente y está siendo evaluada por el Jefe de Pasantes de la empresa. Recibirás una notificación cuando haya una respuesta.'
    }
  } else if (estado === 'Aprobada') {
    return {
      titulo: '¡Felicidades! Has sido seleccionado para esta pasantía',
      cuerpo: 'Has sido aceptado oficialmente en este puesto. Por favor dirígete a tu Bitácora para iniciar tu proceso.'
    }
  } else {
    return {
      titulo: 'Postulación Rechazada',
      cuerpo: 'Esta postulación ha sido cerrada.'
    }
  }
}
</script>
