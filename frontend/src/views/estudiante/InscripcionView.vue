<template>
  <div class="h-full flex flex-col">
    <!-- Pestañas por postulación -->
    <div class="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto pb-1">
      <button 
        v-for="postulacion in postulaciones" 
        :key="postulacion.id"
        @click="activeTabId = postulacion.id"
        class="px-5 py-3 text-sm font-medium transition-colors relative whitespace-nowrap rounded-t-lg"
        :class="activeTabId === postulacion.id ? 'text-primary bg-white border border-b-0 border-gray-200' : 'text-gray-500 hover:text-secondary hover:bg-gray-100'"
      >
        <div class="flex items-center gap-2">
          <span>{{ postulacion.empresa }}</span>
          <div 
            class="w-2 h-2 rounded-full"
            :class="{
              'bg-tertiary': postulacion.estado === 'Pendiente',
              'bg-success': postulacion.estado === 'Aprobada',
              'bg-danger': postulacion.estado === 'Rechazada'
            }"
          ></div>
        </div>
        <div v-if="activeTabId === postulacion.id" class="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-white"></div>
        <div v-if="activeTabId === postulacion.id" class="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-lg transition-all"></div>
      </button>
    </div>

    <!-- Contenido de la Postulación Activa -->
    <div v-if="postulacionActiva" class="flex-1">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-4xl">
        <!-- Encabezado de Estado -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-100 gap-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-neutral flex items-center justify-center font-bold text-2xl text-primary shrink-0">
              {{ postulacionActiva.empresa.charAt(0) }}
            </div>
            <div>
              <h2 class="text-2xl font-headline font-bold text-secondary">{{ postulacionActiva.cargo }}</h2>
              <p class="text-primary font-medium">{{ postulacionActiva.empresa }}</p>
            </div>
          </div>
          
          <div class="flex flex-col items-start md:items-end gap-2">
            <span 
              class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
              :class="{
                'bg-orange-50 text-tertiary border border-orange-200': postulacionActiva.estado === 'Pendiente',
                'bg-green-50 text-success border border-green-200': postulacionActiva.estado === 'Aprobada',
                'bg-red-50 text-danger border border-red-200': postulacionActiva.estado === 'Rechazada'
              }"
            >
              Estado: {{ postulacionActiva.estado }}
            </span>
            <span class="text-xs text-gray-500">Postulado el: {{ postulacionActiva.fecha }}</span>
          </div>
        </div>

        <!-- Alerta según estado -->
        <div 
          class="mb-8 p-4 rounded-lg flex items-start gap-3 border"
          :class="{
            'bg-orange-50 border-orange-200': postulacionActiva.estado === 'Pendiente',
            'bg-green-50 border-green-200': postulacionActiva.estado === 'Aprobada',
            'bg-red-50 border-red-200': postulacionActiva.estado === 'Rechazada'
          }"
        >
          <div class="mt-0.5">
            <span v-if="postulacionActiva.estado === 'Aprobada'" class="text-success text-lg">✓</span>
            <span v-else-if="postulacionActiva.estado === 'Rechazada'" class="text-danger text-lg">✗</span>
            <span v-else class="text-tertiary text-lg">⏱</span>
          </div>
          <div>
            <h4 
              class="text-sm font-bold mb-1"
              :class="{
                'text-tertiary': postulacionActiva.estado === 'Pendiente',
                'text-success': postulacionActiva.estado === 'Aprobada',
                'text-danger': postulacionActiva.estado === 'Rechazada'
              }"
            >
              {{ mensajeEstado(postulacionActiva.estado).titulo }}
            </h4>
            <p class="text-sm text-gray-600">{{ postulacionActiva.mensajeRespuesta || mensajeEstado(postulacionActiva.estado).cuerpo }}</p>
          </div>
        </div>

        <!-- Detalles de la Pasantía -->
        <h3 class="text-lg font-headline font-bold text-secondary mb-4">Detalles de la Convocatoria</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="space-y-4">
            <div>
              <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Modalidad</span>
              <span class="text-sm text-secondary font-medium">{{ postulacionActiva.modalidad }}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Horario Laboral</span>
              <span class="text-sm text-secondary font-medium">{{ postulacionActiva.horario }}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Cupos</span>
              <span class="text-sm text-secondary font-medium">{{ postulacionActiva.cuposOcupados }}/{{ postulacionActiva.cuposTotales }} ocupados</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Requisitos</span>
              <span class="text-sm text-secondary">Perfil enviado: Hoja de Vida Digital</span>
            </div>
          </div>
          <div class="bg-neutral p-4 rounded-xl border border-gray-100">
            <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">Descripción del Puesto</span>
            <p class="text-sm text-gray-600 leading-relaxed">{{ postulacionActiva.descripcion }}</p>
          </div>
        </div>

        <!-- Acciones Inferiores (CTA) -->
        <div class="pt-6 border-t border-gray-100 flex justify-end">
          <!-- ESTADO A: Rechazada -->
          <button v-if="postulacionActiva.estado === 'Rechazada'" class="px-5 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Buscar otras pasantías
          </button>
          
          <!-- ESTADO B: Pendiente -->
          <button v-else-if="postulacionActiva.estado === 'Pendiente'" class="px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            Cancelar Postulación
          </button>
          
          <!-- ESTADO C: Aprobada -->
          <button v-else-if="postulacionActiva.estado === 'Aprobada'" class="px-6 py-2.5 bg-success text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors shadow-sm shadow-success/30">
            Ir a mi Bitácora
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Mock Data Actualizada con 3 estados
const postulaciones = ref([
  {
    id: 1,
    empresa: 'Jalasoft',
    cargo: 'Pasante de Seguridad Informática',
    estado: 'Aprobada',
    fecha: '01 May 2026',
    modalidad: 'Híbrido',
    horario: 'Lun a Vie, 14:00 a 18:00',
    cuposOcupados: 4,
    cuposTotales: 5,
    descripcion: 'Apoyo en auditorías de seguridad, escaneo de vulnerabilidades y elaboración de informes técnicos de mitigación.',
    mensajeRespuesta: '¡Felicidades! Hemos evaluado tu perfil y queremos darte la bienvenida al equipo.'
  },
  {
    id: 2,
    empresa: 'TechCorp Bolivia',
    cargo: 'Desarrollador Frontend Vue.js',
    estado: 'Pendiente',
    fecha: '18 Abr 2026',
    modalidad: 'Remoto',
    horario: 'Lun a Vie, 09:00 a 13:00',
    cuposOcupados: 1,
    cuposTotales: 3,
    descripcion: 'Buscamos un estudiante entusiasta para unirse a nuestro equipo de desarrollo trabajando en plataformas web modernas.',
    mensajeRespuesta: ''
  },
  {
    id: 3,
    empresa: 'Banco Bisa',
    cargo: 'Analista de Base de Datos',
    estado: 'Rechazada',
    fecha: '10 Abr 2026',
    modalidad: 'Presencial',
    horario: 'Lun a Vie, 08:30 a 12:30',
    cuposOcupados: 2,
    cuposTotales: 2,
    descripcion: 'Participación en el equipo de Business Intelligence para optimización de consultas, migración de datos y creación de reportes operativos.',
    mensajeRespuesta: 'Gracias por tu interés. En esta ocasión hemos seleccionado a otro candidato que se ajusta más a nuestros requerimientos técnicos de Oracle DB.'
  }
])

const activeTabId = ref(postulaciones.value[0]?.id)

const postulacionActiva = computed(() => {
  return postulaciones.value.find(p => p.id === activeTabId.value)
})

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
