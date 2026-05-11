<template>
  <div class="space-y-6">
    <!-- Tarjetas de Resumen -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-[#D16900] flex flex-col justify-between hover:shadow-md transition-shadow">
        <h3 class="font-body text-xs font-semibold text-gray-500 uppercase tracking-wider">Pasantes Activos</h3>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="font-headline text-3xl font-bold text-secondary">12</span>
          <span class="text-sm text-success font-medium">+2 este mes</span>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-[#D16900] flex flex-col justify-between hover:shadow-md transition-shadow">
        <h3 class="font-body text-xs font-semibold text-gray-500 uppercase tracking-wider">Inscripciones Pendientes</h3>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="font-headline text-3xl font-bold text-secondary">3</span>
          <span class="text-sm text-danger font-medium">Requieren revisión</span>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-[#D16900] flex flex-col justify-between hover:shadow-md transition-shadow">
        <h3 class="font-body text-xs font-semibold text-gray-500 uppercase tracking-wider">Informes por Emitir</h3>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="font-headline text-3xl font-bold text-secondary">5</span>
          <span class="text-sm text-gray-500 font-medium">Fin de pasantía</span>
        </div>
      </div>
    </div>

    <!-- Barra de Búsqueda Rápida y Título de Lista -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 mb-4">
      <h2 class="text-lg font-headline font-bold text-secondary">Inscripciones Recientes</h2>
      <div class="relative w-full md:w-80">
        <v-icon icon="mdi-magnify" size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></v-icon>
        <input 
          type="text" 
          placeholder="Buscar por nombre o CI..." 
          class="w-full bg-white text-sm rounded-lg py-2 pl-9 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
        />
      </div>
    </div>

    <!-- Lista de Inscripciones Recientes (Scroll) -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="max-h-[400px] overflow-y-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-neutral sticky top-0 z-10 border-b border-gray-200">
            <tr>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estudiante</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Pasantía</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="inscripcion in inscripciones" :key="inscripcion.id" class="hover:bg-neutral/50 transition-colors">
              <td class="py-3 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {{ inscripcion.iniciales }}
                  </div>
                  <div>
                    <div class="font-medium text-sm text-secondary">{{ inscripcion.estudiante }}</div>
                    <div class="text-xs text-gray-500">CI: {{ inscripcion.ci }}</div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-6 text-sm text-secondary font-medium">{{ inscripcion.pasantia }}</td>
              <td class="py-3 px-6 text-sm text-gray-500">{{ inscripcion.fecha }}</td>
              <td class="py-3 px-6">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                  :class="{
                    'bg-orange-50 text-tertiary border border-orange-200': inscripcion.estado === 'Pendiente',
                    'bg-green-50 text-success border border-green-200': inscripcion.estado === 'Aprobada',
                    'bg-red-50 text-danger border border-red-200': inscripcion.estado === 'Rechazada'
                  }"
                >
                  <v-icon v-if="inscripcion.estado === 'Pendiente'" icon="mdi-clock-outline" size="12" class="mr-1"></v-icon>
                  {{ inscripcion.estado }}
                </span>
              </td>
              <td class="py-3 px-6 text-center">
                <button class="text-primary hover:text-primary/80 transition-colors text-sm font-medium">Revisar</button>
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

// Mock Data
const inscripciones = ref([
  { id: 1, iniciales: 'AL', estudiante: 'Ana López', ci: '8392123 LP', pasantia: 'Desarrollador Frontend Jr.', fecha: '23/04/2026', estado: 'Pendiente' },
  { id: 2, iniciales: 'CM', estudiante: 'Carlos Mendoza', ci: '6283920 LP', pasantia: 'Analista de Datos', fecha: '22/04/2026', estado: 'Pendiente' },
  { id: 3, iniciales: 'RJ', estudiante: 'Roberto Jiménez', ci: '7382910 LP', pasantia: 'Soporte Técnico', fecha: '21/04/2026', estado: 'Pendiente' },
  { id: 4, iniciales: 'MQ', estudiante: 'María Quispe', ci: '9203812 LP', pasantia: 'Desarrollador Frontend Jr.', fecha: '20/04/2026', estado: 'Aprobada' },
  { id: 5, iniciales: 'FV', estudiante: 'Fernando Vargas', ci: '5928371 LP', pasantia: 'Diseñador UI/UX', fecha: '19/04/2026', estado: 'Rechazada' },
])
</script>
