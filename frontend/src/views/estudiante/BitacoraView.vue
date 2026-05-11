<template>
  <div class="h-full flex flex-col md:flex-row gap-6">
    <!-- Columna Izquierda: LISTA (LIFO) -->
    <div class="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div class="p-4 border-b border-gray-100 shrink-0 bg-gray-50 flex justify-between items-center">
        <h2 class="font-headline font-bold text-secondary text-lg">Semanas</h2>
        <span class="text-xs font-bold bg-neutral text-gray-500 px-2 py-1 rounded-full">{{ semanas.length }} Registradas</span>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <button 
          v-for="semana in semanas" 
          :key="semana.id"
          @click="semanaActiva = semana.id"
          class="w-full text-left p-4 border-b border-gray-50 transition-colors hover:bg-neutral relative"
          :class="semanaActiva === semana.id ? 'bg-blue-50/50' : ''"
        >
          <div v-if="semanaActiva === semana.id" class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          <div class="flex justify-between items-start mb-1">
            <span class="font-bold text-sm" :class="semanaActiva === semana.id ? 'text-primary' : 'text-secondary'">{{ semana.titulo }}</span>
            <span class="text-xs text-gray-400">{{ semana.fecha }}</span>
          </div>
          <p class="text-xs text-gray-500 mb-2 truncate">{{ semana.resumen }}</p>
          <div class="text-xs text-gray-400 font-medium">
            {{ semana.actividades.length }} actividades asignadas
          </div>
        </button>
      </div>
    </div>

    <!-- Columna Derecha: PANEL -->
    <div class="w-full md:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden" v-if="semanaDetalle">
      <!-- Encabezado del Panel -->
      <div class="flex border-b border-gray-100 bg-gray-50 p-6 shrink-0 justify-between items-center">
        <div>
          <h2 class="text-xl font-headline font-bold text-secondary">Actividades de la Semana</h2>
          <p class="text-sm text-gray-500 mt-1">{{ semanaDetalle.titulo }} ({{ semanaDetalle.fecha }})</p>
        </div>
      </div>

      <!-- Contenido del Panel -->
      <div class="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        
        <div v-if="semanaDetalle.actividades.length === 0" class="text-center py-8 text-gray-500 text-sm">
          No hay actividades asignadas para esta semana.
        </div>

        <!-- Tarjetas de Actividades (LIFO) -->
        <div 
          v-for="act in semanaDetalle.actividades" 
          :key="act.id"
          class="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col gap-3 relative overflow-hidden"
        >
          <!-- Borde superior de color según estado -->
          <div class="absolute top-0 left-0 right-0 h-1"
               :class="{
                 'bg-gray-300': act.estado === 'Pendiente',
                 'bg-yellow-400': act.estado === 'En curso',
                 'bg-green-500': act.estado === 'Completada',
                 'bg-red-500': act.estado === 'No completada'
               }">
          </div>

          <div class="flex justify-between items-start pt-1">
            <h4 class="font-bold text-base text-secondary">{{ act.titulo }}</h4>
            <!-- Semáforo de Estado (Badge) -->
            <span 
              class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
              :class="{
                'bg-gray-50 text-gray-600 border-gray-200': act.estado === 'Pendiente',
                'bg-yellow-50 text-yellow-700 border-yellow-200': act.estado === 'En curso',
                'bg-green-50 text-success border-green-200': act.estado === 'Completada',
                'bg-red-50 text-danger border-red-200': act.estado === 'No completada'
              }"
            >
              {{ act.estado }}
            </span>
          </div>

          <p class="text-sm text-gray-600 leading-relaxed">{{ act.descripcion }}</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 bg-neutral p-4 rounded-lg border border-gray-100">
            <div>
              <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Detalles de Asignación</span>
              <div class="text-xs text-gray-600 space-y-1">
                <p><strong>Asignado:</strong> {{ act.fechaAsignacion }}</p>
                <p><strong>Por:</strong> {{ act.responsable }}</p>
              </div>
            </div>
            
            <div class="flex flex-col items-start md:items-end justify-center">
              <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Evaluación</span>
              <div v-if="act.nota !== null" class="text-lg font-headline font-bold text-success">
                Calificación: {{ act.nota }} <span class="text-xs text-gray-400 font-normal">/ 100</span>
              </div>
              <div v-else class="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-md">
                Sin calificar
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

// Lógica LIFO: Los datos deben estar ordenados del más reciente al más antiguo
const semanas = ref([
  {
    id: 3,
    titulo: 'Semana 3',
    fecha: '15 May - 19 May',
    resumen: 'Desarrollo de módulos e integraciones con API.',
    actividades: [
      { 
        id: 302, 
        titulo: 'Manejo de Errores Globales', 
        descripcion: 'Implementar un interceptor de Axios para capturar errores 500 y 401, y mostrar notificaciones visuales al usuario.', 
        estado: 'En curso',
        fechaAsignacion: '17 de Mayo',
        responsable: 'Ing. Roberto Carlos - Jefe de Pasantes',
        nota: null
      },
      { 
        id: 301, 
        titulo: 'Vista Tabla de Usuarios', 
        descripcion: 'Crear componente de tabla de usuarios con datos provenientes de la API REST interna.', 
        estado: 'Pendiente',
        fechaAsignacion: '15 de Mayo',
        responsable: 'Ing. Roberto Carlos - Jefe de Pasantes',
        nota: null
      }
    ]
  },
  {
    id: 2,
    titulo: 'Semana 2',
    fecha: '08 May - 12 May',
    resumen: 'Refactorización y mejoras de componentes.',
    actividades: [
      { 
        id: 202, 
        titulo: 'Migración a Tailwind', 
        descripcion: 'Eliminar el CSS personalizado antiguo y migrar todos los estilos de la vista de login a TailwindCSS.', 
        estado: 'No completada',
        fechaAsignacion: '10 de Mayo',
        responsable: 'Ing. Roberto Carlos - Jefe de Pasantes',
        nota: 45
      },
      { 
        id: 201, 
        titulo: 'Refactor del Navbar', 
        descripcion: 'Optimizar la barra de navegación para que sea totalmente responsive en dispositivos móviles.', 
        estado: 'Completada',
        fechaAsignacion: '08 de Mayo',
        responsable: 'Ing. Roberto Carlos - Jefe de Pasantes',
        nota: 95
      }
    ]
  },
  {
    id: 1,
    titulo: 'Semana 1',
    fecha: '01 May - 05 May',
    resumen: 'Inducción y configuración del entorno de desarrollo.',
    actividades: [
      { 
        id: 102, 
        titulo: 'Lectura de estándares', 
        descripcion: 'Leer y comprender el manual de estilo de código de la empresa para frontend.', 
        estado: 'Completada',
        fechaAsignacion: '02 de Mayo',
        responsable: 'Lic. Laura Méndez - RRHH',
        nota: 100
      },
      { 
        id: 101, 
        titulo: 'Configuración de entorno', 
        descripcion: 'Instalar Node.js, configurar Git y solicitar accesos a los repositorios correspondientes.', 
        estado: 'Completada',
        fechaAsignacion: '01 de Mayo',
        responsable: 'Ing. Roberto Carlos - Jefe de Pasantes',
        nota: 100
      }
    ]
  }
])

const semanaActiva = ref(semanas.value[0].id)

const semanaDetalle = computed(() => {
  return semanas.value.find(s => s.id === semanaActiva.value)
})
</script>
