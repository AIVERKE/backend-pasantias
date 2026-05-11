<template>
  <div class="space-y-6">
    <!-- Tarjetas-Botón Navegables -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <router-link to="/admin/usuarios" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-secondary flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-md group">
        <div class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
          <v-icon icon="mdi-account-multiple" size="24"></v-icon>
        </div>
        <div class="flex-1">
          <p class="text-[12px] font-medium text-gray-500 uppercase tracking-wider">Usuarios Totales</p>
          <div class="flex items-center justify-between mt-1">
            <h3 class="text-[32px] font-headline font-bold text-secondary leading-none">1,248</h3>
            <v-icon icon="mdi-arrow-right" size="20" class="text-gray-300 group-hover:text-primary transition-colors"></v-icon>
          </div>
        </div>
      </router-link>
      
      <router-link to="/admin/empresas" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-secondary flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-md group relative overflow-hidden">
        <div class="absolute top-0 right-0 bg-danger text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">2 Pendientes</div>
        <div class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
          <v-icon icon="mdi-domain" size="24"></v-icon>
        </div>
        <div class="flex-1">
          <p class="text-[12px] font-medium text-gray-500 uppercase tracking-wider">Empresas Aliadas</p>
          <div class="flex items-center justify-between mt-1">
            <h3 class="text-[32px] font-headline font-bold text-secondary leading-none">42</h3>
            <v-icon icon="mdi-arrow-right" size="20" class="text-gray-300 group-hover:text-primary transition-colors"></v-icon>
          </div>
        </div>
      </router-link>
      
      <router-link to="/admin/pasantias" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-secondary flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-md group">
        <div class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
          <v-icon icon="mdi-bullhorn" size="24"></v-icon>
        </div>
        <div class="flex-1">
          <p class="text-[12px] font-medium text-gray-500 uppercase tracking-wider">Pasantías Globales</p>
          <div class="flex items-center justify-between mt-1">
            <h3 class="text-[32px] font-headline font-bold text-secondary leading-none">156</h3>
            <v-icon icon="mdi-arrow-right" size="20" class="text-gray-300 group-hover:text-primary transition-colors"></v-icon>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Solicitudes Pendientes -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 class="font-headline font-bold text-secondary text-lg flex items-center gap-2">
          <v-icon icon="mdi-bell-badge-outline" size="20" class="text-danger"></v-icon>
          Solicitudes Pendientes de Aprobación
        </h2>
      </div>
      <div class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-neutral border-b border-gray-200">
              <tr>
                <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Solicitante</th>
                <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Tipo / Rol</th>
                <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase text-center w-32">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in solicitudes" :key="item.id" class="hover:bg-neutral/50 transition-colors">
                <td class="py-4 px-6">
                  <div class="font-medium text-sm text-secondary">{{ item.nombre }}</div>
                  <div class="text-xs text-gray-500 mt-0.5"><v-icon icon="mdi-email-outline" size="12" class="mr-1"></v-icon>{{ item.email }}</div>
                </td>
                <td class="py-4 px-6">
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                    :class="{
                      'bg-purple-100 text-purple-700 border border-purple-200': item.tipo === 'Empresa',
                      'bg-blue-100 text-blue-700 border border-blue-200': item.tipo === 'Tutor'
                    }"
                  >
                    <v-icon :icon="item.tipo === 'Empresa' ? 'mdi-domain' : 'mdi-account-school'" size="12" class="mr-1"></v-icon>
                    {{ item.tipo }}
                  </span>
                </td>
                <td class="py-4 px-6 text-sm text-gray-500">{{ item.fecha }}</td>
                <td class="py-4 px-6 text-center">
                  <div class="flex justify-center gap-2">
                    <button class="w-8 h-8 rounded-full bg-success/10 text-success hover:bg-success hover:text-white transition-colors flex items-center justify-center" title="Aprobar">
                      <v-icon icon="mdi-check" size="18"></v-icon>
                    </button>
                    <button class="w-8 h-8 rounded-full bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors flex items-center justify-center" title="Rechazar">
                      <v-icon icon="mdi-close" size="18"></v-icon>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="solicitudes.length === 0">
                <td colspan="4" class="py-12 text-center text-gray-500 text-sm">
                  <v-icon icon="mdi-check-circle-outline" size="48" class="text-success/50 mb-3 block mx-auto"></v-icon>
                  No hay solicitudes pendientes en este momento.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const solicitudes = ref([
  { id: 1, nombre: 'TechNova Solutions S.R.L.', email: 'contacto@technova.com', tipo: 'Empresa', fecha: 'Hace 2 horas' },
  { id: 2, nombre: 'Ing. Fernando Guzmán', email: 'fguzman@umsa.bo', tipo: 'Tutor', fecha: 'Hace 5 horas' },
  { id: 3, nombre: 'InnovaCorp', email: 'rrhh@innovacorp.net', tipo: 'Empresa', fecha: 'Ayer' }
])
</script>
