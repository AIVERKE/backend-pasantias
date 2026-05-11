<template>
  <div class="h-full flex flex-col gap-6">
    <!-- Tarjetas de Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard 
        title="Estudiantes Asignados" 
        value="24" 
        role="tutor" 
      />
      <StatCard 
        title="Evaluaciones Pendientes" 
        value="5" 
        role="tutor" 
      />
    </div>

    <!-- Lista de Estudiantes con Menos Progreso -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
        <div>
          <h2 class="text-lg font-headline font-bold text-secondary">Estudiantes con Menor Progreso</h2>
          <p class="text-xs text-gray-500 mt-1">Requieren seguimiento o asistencia adicional</p>
        </div>
        <button class="text-sm font-bold text-primary hover:underline">Ver todos los estudiantes</button>
      </div>

      <div class="flex-1 overflow-y-auto p-0">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white border-b border-gray-200">
              <th class="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Estudiante</th>
              <th class="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Empresa</th>
              <th class="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Progreso</th>
              <th class="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Última Actividad</th>
              <th class="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="est in estudiantesRiesgo" :key="est.id" class="hover:bg-gray-50 transition-colors">
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center text-xs font-bold">
                    {{ est.nombre.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-bold text-sm text-secondary">{{ est.nombre }}</div>
                    <div class="text-xs text-gray-400">{{ est.carrera }}</div>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <div class="text-sm text-secondary">{{ est.empresa }}</div>
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-danger rounded-full" :style="{ width: `${est.progreso}%` }"></div>
                  </div>
                  <span class="text-xs font-bold text-danger">{{ est.progreso }}%</span>
                </div>
              </td>
              <td class="py-4 px-6 text-sm text-gray-500">
                {{ est.ultimaActividad }}
                <span v-if="est.diasInactivo > 7" class="ml-2 px-2 py-0.5 bg-red-50 text-danger text-[10px] rounded border border-red-100 font-bold">
                  {{ est.diasInactivo }} días inactivo
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <button class="text-primary hover:text-blue-700 font-medium text-sm transition-colors">
                  Contactar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '@/components/StatCard.vue'

const estudiantesRiesgo = ref([
  {
    id: 1,
    nombre: 'Luis Martínez',
    carrera: 'Ing. de Sistemas',
    empresa: 'Jalasoft',
    progreso: 15,
    ultimaActividad: 'Hace 10 días',
    diasInactivo: 10
  },
  {
    id: 2,
    nombre: 'Camila Rojas',
    carrera: 'Informática',
    empresa: 'Banco Bisa',
    progreso: 22,
    ultimaActividad: 'Hace 8 días',
    diasInactivo: 8
  },
  {
    id: 3,
    nombre: 'Roberto Fernández',
    carrera: 'Ing. de Sistemas',
    empresa: 'TechCorp Bolivia',
    progreso: 30,
    ultimaActividad: 'Ayer',
    diasInactivo: 1
  }
])
</script>
