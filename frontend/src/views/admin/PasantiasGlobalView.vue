<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-headline font-bold text-secondary">Catálogo de Pasantías</h2>
      <button class="bg-white border border-gray-200 hover:bg-gray-50 text-secondary font-medium py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm">
        <v-icon icon="mdi-filter-variant" size="18"></v-icon>
        Filtros Avanzados
      </button>
    </div>

    <!-- Stats Rapidas -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-xl border border-gray-200 text-center">
        <div class="text-2xl font-bold text-success">{{ stats.activas }}</div>
        <div class="text-xs text-gray-500 uppercase tracking-wide mt-1">Activas</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-200 text-center">
        <div class="text-2xl font-bold text-gray-400">{{ stats.borradores }}</div>
        <div class="text-xs text-gray-500 uppercase tracking-wide mt-1">Borradores</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-200 text-center">
        <div class="text-2xl font-bold text-danger">{{ stats.reportadas }}</div>
        <div class="text-xs text-gray-500 uppercase tracking-wide mt-1">Reportadas</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-200 text-center">
        <div class="text-2xl font-bold text-gray-500">{{ stats.archivadas }}</div>
        <div class="text-xs text-gray-500 uppercase tracking-wide mt-1">Archivadas</div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Tabla de Pasantías -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[1100px]">
          <thead class="bg-neutral border-b border-gray-200">
            <tr>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Título de Pasantía</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Empresa</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Carrera Destino</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase text-center">Cupos</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase text-center w-36">Acciones Globales</th>
            </tr>
            <!-- Filtros Inline -->
            <tr class="bg-white border-b border-gray-200">
              <th class="px-3 py-2"><input type="text" placeholder="Buscar título..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.titulo"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Buscar empresa..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.empresa"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Filtrar carrera..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.carrera"></th>
              <th class="px-3 py-2"></th>
              <th class="px-3 py-2">
                <select class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.estado">
                  <option value="">Todos</option>
                  <option value="Activa">Activa</option>
                  <option value="Borrador">Borrador</option>
                  <option value="Archivada">Archivada</option>
                </select>
              </th>
              <th class="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="pasantia in filteredPasantias" :key="pasantia.id" class="hover:bg-neutral/50 transition-colors">
              <td class="py-4 px-6">
                <div class="font-medium text-sm text-secondary">{{ pasantia.titulo }}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">Publicada: {{ pasantia.fechaPublicacion }}</div>
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <v-icon icon="mdi-domain" size="14" class="text-gray-400"></v-icon>
                  <span class="text-sm font-medium text-gray-600">{{ pasantia.empresa }}</span>
                </div>
              </td>
              <td class="py-4 px-6 text-sm text-gray-500">{{ pasantia.carrera }}</td>
              <td class="py-4 px-6 text-center">
                <span class="inline-flex items-center justify-center bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px]">
                  {{ pasantia.postulantes }} / {{ pasantia.cupos }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                  :class="{
                    'bg-success/10 text-success': pasantia.estado === 'Activa',
                    'bg-gray-100 text-gray-500': pasantia.estado === 'Borrador',
                    'bg-secondary/10 text-secondary': pasantia.estado === 'Archivada'
                  }"
                >
                  {{ pasantia.estado }}
                </span>
                <span v-if="pasantia.reportada" class="ml-2 inline-flex items-center text-danger" title="Reportada por irregularidades">
                  <v-icon icon="mdi-alert-octagon" size="14"></v-icon>
                </span>
              </td>
              <td class="py-4 px-6 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button class="w-7 h-7 rounded-md bg-neutral text-gray-500 hover:bg-primary hover:text-white transition-colors flex items-center justify-center" title="Ver Detalles Completos">
                    <v-icon icon="mdi-eye-outline" size="16"></v-icon>
                  </button>
                  <button v-if="pasantia.estado === 'Activa'" class="w-7 h-7 rounded-md bg-neutral text-gray-500 hover:bg-danger hover:text-white transition-colors flex items-center justify-center" title="Dar de baja administrativamente">
                    <v-icon icon="mdi-block-helper" size="16"></v-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPasantias.length === 0">
              <td colspan="6" class="py-12 text-center text-gray-500 text-sm">
                No se encontraron pasantías con esos criterios.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
        <span>Mostrando {{ filteredPasantias.length }} resultados globales</span>
        <span>Última sincronización: Hoy 08:30 AM</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ref({ titulo: '', empresa: '', carrera: '', estado: '' })

const stats = ref({ activas: 84, borradores: 45, reportadas: 2, archivadas: 25 })

const pasantias = ref([
  { id: 1, titulo: 'Desarrollador Frontend React/Vue', empresa: 'TechNova Solutions S.R.L.', carrera: 'Informática / Sistemas', cupos: 3, postulantes: 12, estado: 'Activa', fechaPublicacion: '10/04/2026', reportada: false },
  { id: 2, titulo: 'Analista de Datos Financieros', empresa: 'Banco FIE', carrera: 'Economía / Estadística', cupos: 2, postulantes: 45, estado: 'Activa', fechaPublicacion: '05/04/2026', reportada: false },
  { id: 3, titulo: 'Diseñador UI/UX Junior', empresa: 'TechNova Solutions S.R.L.', carrera: 'Diseño Gráfico / Informática', cupos: 1, postulantes: 8, estado: 'Borrador', fechaPublicacion: '-', reportada: false },
  { id: 4, titulo: 'Marketing y Ventas', empresa: 'InnovaCorp S.A.', carrera: 'Marketing / Adm. Empresas', cupos: 5, postulantes: 22, estado: 'Activa', fechaPublicacion: '01/04/2026', reportada: true },
  { id: 5, titulo: 'Soporte Técnico Nivel 1', empresa: 'Telecom Bolivia', carrera: 'Informática / Electrónica', cupos: 10, postulantes: 10, estado: 'Archivada', fechaPublicacion: '15/01/2026', reportada: false },
])

const filteredPasantias = computed(() => {
  return pasantias.value.filter(item => {
    if (filters.value.titulo && !item.titulo.toLowerCase().includes(filters.value.titulo.toLowerCase())) return false
    if (filters.value.empresa && !item.empresa.toLowerCase().includes(filters.value.empresa.toLowerCase())) return false
    if (filters.value.carrera && !item.carrera.toLowerCase().includes(filters.value.carrera.toLowerCase())) return false
    if (filters.value.estado && item.estado !== filters.value.estado) return false
    return true
  })
})
</script>
