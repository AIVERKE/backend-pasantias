<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-headline font-bold text-secondary">Gestión de Usuarios</h2>
      <button class="bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm">
        <v-icon icon="mdi-account-plus" size="18"></v-icon>
        Nuevo Usuario
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Pestañas de Roles -->
      <div class="flex border-b border-gray-200 overflow-x-auto">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap"
          :class="activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
        >
          {{ tab.label }}
          <span v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
        </button>
      </div>

      <!-- Tabla de Usuarios -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead class="bg-neutral border-b border-gray-200">
            <tr>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Usuario</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Rol</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Institución / Empresa</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th class="py-3 px-6 font-body text-xs font-semibold text-gray-500 uppercase text-center w-32">Acciones</th>
            </tr>
            <!-- Filtros Inline -->
            <tr class="bg-white border-b border-gray-200">
              <th class="px-3 py-2"><input type="text" placeholder="Buscar nombre o correo..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.usuario"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Filtrar rol..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.rol"></th>
              <th class="px-3 py-2"><input type="text" placeholder="Buscar entidad..." class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.entidad"></th>
              <th class="px-3 py-2">
                <select class="w-full bg-neutral text-xs rounded border-none py-1.5 px-2 focus:ring-1 focus:ring-primary" v-model="filters.estado">
                  <option value="">Todos</option>
                  <option value="Activo">Activo</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Suspendido">Suspendido</option>
                </select>
              </th>
              <th class="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in filteredUsuarios" :key="user.id" class="hover:bg-neutral/50 transition-colors">
              <td class="py-4 px-6">
                <div class="font-medium text-sm text-secondary">{{ user.nombre }}</div>
                <div class="text-xs text-gray-500 mt-0.5">{{ user.email }}</div>
              </td>
              <td class="py-4 px-6">
                <span class="text-sm font-medium text-gray-600">{{ user.rol }}</span>
              </td>
              <td class="py-4 px-6 text-sm text-gray-500">{{ user.entidad }}</td>
              <td class="py-4 px-6">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                  :class="{
                    'bg-success/10 text-success': user.estado === 'Activo',
                    'bg-warning/10 text-warning': user.estado === 'Pendiente',
                    'bg-danger/10 text-danger': user.estado === 'Suspendido'
                  }"
                >
                  {{ user.estado }}
                </span>
              </td>
              <td class="py-4 px-6 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button class="w-7 h-7 rounded-md bg-neutral text-gray-500 hover:bg-primary hover:text-white transition-colors flex items-center justify-center" title="Editar">
                    <v-icon icon="mdi-pencil-outline" size="16"></v-icon>
                  </button>
                  <button class="w-7 h-7 rounded-md bg-neutral text-gray-500 hover:bg-danger hover:text-white transition-colors flex items-center justify-center" title="Suspender">
                    <v-icon icon="mdi-account-cancel-outline" size="16"></v-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsuarios.length === 0">
              <td colspan="5" class="py-12 text-center text-gray-500 text-sm">
                No se encontraron usuarios con esos criterios.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 text-xs text-gray-500">
        Mostrando {{ filteredUsuarios.length }} resultados
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('Todos')
const tabs = [
  { id: 'Todos', label: 'Todos los Usuarios' },
  { id: 'Estudiante', label: 'Estudiantes' },
  { id: 'Tutor', label: 'Tutores' },
  { id: 'Jefe', label: 'Jefes de Pasantes' },
  { id: 'Gerente', label: 'Gerentes' }
]

const filters = ref({ usuario: '', rol: '', entidad: '', estado: '' })

const usuarios = ref([
  { id: 1, nombre: 'Ana López', email: 'alopez@umsa.bo', rol: 'Estudiante', entidad: 'Carrera de Informática', estado: 'Activo' },
  { id: 2, nombre: 'Ing. Carlos Mendoza', email: 'cmendoza@umsa.bo', rol: 'Tutor', entidad: 'Facultad de Ingeniería', estado: 'Activo' },
  { id: 3, nombre: 'Lic. María Fernández', email: 'mfernandez@technova.com', rol: 'Jefe', entidad: 'TechNova Solutions', estado: 'Activo' },
  { id: 4, nombre: 'Ing. Roberto Silva', email: 'rsilva@technova.com', rol: 'Gerente', entidad: 'TechNova Solutions', estado: 'Activo' },
  { id: 5, nombre: 'Luis Blanco', email: 'lblanco@umsa.bo', rol: 'Estudiante', entidad: 'Carrera de Sistemas', estado: 'Suspendido' },
  { id: 6, nombre: 'Ing. Fernando Guzmán', email: 'fguzman@umsa.bo', rol: 'Tutor', entidad: 'Facultad de Ciencias Puras', estado: 'Pendiente' },
])

const filteredUsuarios = computed(() => {
  return usuarios.value.filter(item => {
    if (activeTab.value !== 'Todos' && item.rol !== activeTab.value) return false
    if (filters.value.usuario && !item.nombre.toLowerCase().includes(filters.value.usuario.toLowerCase()) && !item.email.toLowerCase().includes(filters.value.usuario.toLowerCase())) return false
    if (filters.value.rol && !item.rol.toLowerCase().includes(filters.value.rol.toLowerCase())) return false
    if (filters.value.entidad && !item.entidad.toLowerCase().includes(filters.value.entidad.toLowerCase())) return false
    if (filters.value.estado && item.estado !== filters.value.estado) return false
    return true
  })
})
</script>
