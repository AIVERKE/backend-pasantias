<template>
  <div class="h-full flex flex-col">
    <!-- Encabezado de la vista -->
    <div class="mb-6 flex justify-between items-center shrink-0">
      <div>
        <h2 class="text-2xl font-headline font-bold text-secondary">Mis Estudiantes</h2>
        <p class="text-sm text-gray-500">Listado general de los estudiantes que están bajo tu supervisión.</p>
      </div>
      <button class="bg-white border border-gray-200 text-secondary px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
        <v-icon icon="mdi-export" size="18"></v-icon>
        Exportar Reporte
      </button>
    </div>

    <!-- Tabla Global -->
    <div class="flex-1 overflow-hidden min-h-0">
      <DataTable 
        :columns="columns" 
        :data="estudiantes" 
      >
        <!-- Custom Slot for 'estudiante' -->
        <template #estudiante="{ item }">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center text-xs font-bold shrink-0">
              {{ item.estudiante.charAt(0) }}
            </div>
            <div class="font-bold text-secondary">{{ item.estudiante }}</div>
          </div>
        </template>

        <!-- Custom Slot for 'progreso' -->
        <template #progreso="{ value }">
          <div class="flex items-center gap-2 w-full max-w-[150px]">
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full"
                :class="value >= 80 ? 'bg-success' : (value >= 50 ? 'bg-primary' : 'bg-danger')"
                :style="{ width: `${value}%` }"
              ></div>
            </div>
            <span class="text-xs font-bold" :class="value >= 80 ? 'text-success' : (value >= 50 ? 'text-primary' : 'text-danger')">{{ value }}%</span>
          </div>
        </template>

        <!-- Custom Slot for 'estado' -->
        <template #estado="{ value }">
          <span 
            class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border"
            :class="{
              'bg-green-50 text-success border-green-200': value === 'Activo',
              'bg-orange-50 text-tertiary border-orange-200': value === 'En Riesgo',
              'bg-blue-50 text-primary border-blue-200': value === 'Finalizado'
            }"
          >
            {{ value }}
          </span>
        </template>

        <!-- Custom Slot for 'acciones' -->
        <template #acciones>
          <div class="flex items-center justify-end gap-2">
            <button class="p-1.5 text-gray-400 hover:text-primary transition-colors bg-gray-50 hover:bg-blue-50 rounded">
              <v-icon icon="mdi-eye" size="18"></v-icon>
            </button>
            <button class="p-1.5 text-gray-400 hover:text-primary transition-colors bg-gray-50 hover:bg-blue-50 rounded">
              <v-icon icon="mdi-email" size="18"></v-icon>
            </button>
          </div>
        </template>

      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '@/components/DataTable.vue'

// Definición de columnas
const columns = ref([
  { key: 'estudiante', label: 'Estudiante', filterable: true },
  { key: 'carrera', label: 'Carrera', filterable: true },
  { key: 'empresa', label: 'Empresa Asignada', filterable: true },
  { key: 'progreso', label: 'Progreso', filterable: true },
  { key: 'estado', label: 'Estado', filterable: true },
  { key: 'acciones', label: 'Acciones', filterable: false, align: 'right' }
])

// Mock Data
const estudiantes = ref([
  { id: 1, estudiante: 'Luis Martínez', carrera: 'Ing. de Sistemas', empresa: 'Jalasoft', progreso: 15, estado: 'En Riesgo' },
  { id: 2, estudiante: 'Camila Rojas', carrera: 'Informática', empresa: 'Banco Bisa', progreso: 22, estado: 'En Riesgo' },
  { id: 3, estudiante: 'Roberto Fernández', carrera: 'Ing. de Sistemas', empresa: 'TechCorp Bolivia', progreso: 55, estado: 'Activo' },
  { id: 4, estudiante: 'Ana Quispe', carrera: 'Informática', empresa: 'Mojix', progreso: 85, estado: 'Activo' },
  { id: 5, estudiante: 'Jorge Claure', carrera: 'Ing. de Sistemas', empresa: 'AssureSoft', progreso: 100, estado: 'Finalizado' },
  { id: 6, estudiante: 'María Belén', carrera: 'Ing. de Sistemas', empresa: 'TrueNorte', progreso: 40, estado: 'Activo' },
  { id: 7, estudiante: 'Carlos Vera', carrera: 'Informática', empresa: 'Jalasoft', progreso: 90, estado: 'Activo' }
])
</script>
