<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-headline font-bold text-secondary">Directorio de Empresas</h2>
      <button class="bg-white border border-gray-200 hover:bg-gray-50 text-secondary font-medium py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm">
        <v-icon icon="mdi-export-variant" size="18"></v-icon>
        Exportar Datos
      </button>
    </div>

    <!-- Banner de Pendientes -->
    <div v-if="empresasPendientes.length > 0" class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
          <v-icon icon="mdi-alert-circle-outline" size="24"></v-icon>
        </div>
        <div>
          <h3 class="font-bold text-amber-800 text-sm">Atención Requerida</h3>
          <p class="text-xs text-amber-700 mt-0.5">Hay {{ empresasPendientes.length }} empresa(s) pendiente(s) de validación para ingresar al sistema.</p>
        </div>
      </div>
      <button @click="filtrarPendientes" class="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm transition-colors">
        Revisar Pendientes
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Tabla de Empresas -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead class="bg-neutral border-b border-gray-200">
            <tr>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Empresa / Razón Social</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">NIT</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Rubro</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Pasantías</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase text-center w-36">Acciones</th>
            </tr>
            <!-- Filtros Inline -->
            <tr class="bg-white border-b border-gray-200">
              <th class="px-3 py-2"><input type="text" placeholder="Buscar nombre..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.nombre"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Buscar NIT..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.nit"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Filtrar rubro..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.rubro"></th>
              <th class="px-3 py-2"></th>
              <th class="px-3 py-2">
                <select class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.estado">
                  <option value="">Todos</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </th>
              <th class="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="empresa in filteredEmpresas" :key="empresa.id" class="hover:bg-neutral/50 transition-colors">
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                    <v-icon icon="mdi-domain" size="18"></v-icon>
                  </div>
                  <div>
                    <div class="font-medium text-sm text-secondary">{{ empresa.nombre }}</div>
                    <div class="text-[11px] text-gray-500 mt-0.5"><v-icon icon="mdi-map-marker-outline" size="10" class="mr-1"></v-icon>{{ empresa.ciudad }}</div>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 text-sm text-gray-600 font-mono text-xs">{{ empresa.nit }}</td>
              <td class="py-4 px-6 text-sm text-gray-500">{{ empresa.rubro }}</td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center justify-center bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[24px]">
                  {{ empresa.pasantias }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                  :class="{
                    'bg-success/10 text-success': empresa.estado === 'Aprobado',
                    'bg-warning/10 text-warning': empresa.estado === 'Pendiente',
                    'bg-danger/10 text-danger': empresa.estado === 'Rechazado'
                  }"
                >
                  {{ empresa.estado }}
                </span>
              </td>
              <td class="py-4 px-6 text-center">
                <div v-if="empresa.estado === 'Pendiente'" class="flex items-center justify-center gap-2">
                  <button class="w-8 h-8 rounded-full bg-success/10 text-success hover:bg-success hover:text-white transition-colors flex items-center justify-center" title="Aprobar Empresa">
                    <v-icon icon="mdi-check" size="18"></v-icon>
                  </button>
                  <button class="w-8 h-8 rounded-full bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors flex items-center justify-center" title="Rechazar Empresa">
                    <v-icon icon="mdi-close" size="18"></v-icon>
                  </button>
                </div>
                <div v-else class="flex items-center justify-center gap-2">
                  <button class="w-7 h-7 rounded-md bg-neutral text-gray-500 hover:bg-primary hover:text-white transition-colors flex items-center justify-center" title="Ver Detalles">
                    <v-icon icon="mdi-eye-outline" size="16"></v-icon>
                  </button>
                  <button v-if="empresa.estado === 'Aprobado'" class="w-7 h-7 rounded-md bg-neutral text-gray-500 hover:bg-danger hover:text-white transition-colors flex items-center justify-center" title="Suspender">
                    <v-icon icon="mdi-cancel" size="16"></v-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredEmpresas.length === 0">
              <td colspan="6" class="py-12 text-center text-gray-500 text-sm">
                No se encontraron empresas con esos criterios.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
        <span class="text-xs text-gray-500 font-medium">Total: {{ filteredEmpresas.length }} empresas</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ref({ nombre: '', nit: '', rubro: '', estado: '' })

const empresas = ref([
  { id: 1, nombre: 'TechNova Solutions S.R.L.', nit: '10293847012', rubro: 'Tecnología y Software', ciudad: 'La Paz', pasantias: 12, estado: 'Aprobado' },
  { id: 2, nombre: 'InnovaCorp S.A.', nit: '88392019382', rubro: 'Telecomunicaciones', ciudad: 'El Alto', pasantias: 0, estado: 'Pendiente' },
  { id: 3, nombre: 'Banco FIE', nit: '1283920192', rubro: 'Banca y Finanzas', ciudad: 'La Paz', pasantias: 5, estado: 'Aprobado' },
  { id: 4, nombre: 'Constructora Atlas', nit: '9928172839', rubro: 'Construcción', ciudad: 'La Paz', pasantias: 0, estado: 'Rechazado' },
  { id: 5, nombre: 'Agencia de Marketing Digital "Click"', nit: '7728192837', rubro: 'Marketing', ciudad: 'La Paz', pasantias: 0, estado: 'Pendiente' },
])

const empresasPendientes = computed(() => empresas.value.filter(e => e.estado === 'Pendiente'))

const filtrarPendientes = () => {
  filters.value.estado = 'Pendiente'
}

const filteredEmpresas = computed(() => {
  return empresas.value.filter(item => {
    if (filters.value.nombre && !item.nombre.toLowerCase().includes(filters.value.nombre.toLowerCase())) return false
    if (filters.value.nit && !item.nit.includes(filters.value.nit)) return false
    if (filters.value.rubro && !item.rubro.toLowerCase().includes(filters.value.rubro.toLowerCase())) return false
    if (filters.value.estado && item.estado !== filters.value.estado) return false
    return true
  })
})
</script>
