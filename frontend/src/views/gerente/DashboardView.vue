<template>
  <div class="space-y-6">
    <!-- Tarjetas de Estadísticas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Pasantes Activos"
        :value="pasantesActivos"
        role="gerente"
        icon="mdi-account-hard-hat"
        iconBgClass="bg-success/10"
        iconColorClass="text-success"
      />
      
      <StatCard
        title="Pasantías Publicadas"
        :value="pasantiasPublicadas"
        role="gerente"
        icon="mdi-bullhorn"
        iconBgClass="bg-success/10"
        iconColorClass="text-success"
      />
      
      <StatCard
        title="Equipo (Jefes)"
        :value="equipo"
        role="gerente"
        icon="mdi-account-group"
        iconBgClass="bg-success/10"
        iconColorClass="text-success"
      />
    </div> 

    <!-- Lista de Pasantías Activas Recientes -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 class="font-headline font-bold text-secondary text-lg flex items-center gap-2">
          <v-icon icon="mdi-briefcase-outline" size="20" class="text-primary"></v-icon>
          Resumen Operativo Reciente
        </h2>
        <router-link to="/gerente/pasantias" class="text-sm font-medium text-primary hover:text-blue-700 transition-colors flex items-center gap-1">
          Ver todas las pasantías <v-icon icon="mdi-arrow-right" size="16"></v-icon>
        </router-link>
      </div>
      <div class="p-0">
        <div v-if="loading" class="p-6 text-center text-gray-500">
          <v-icon icon="mdi-loading" size="24" class="animate-spin mr-2"></v-icon>
          Cargando...
        </div>
        <div v-else-if="error" class="p-6 text-center text-danger">
          {{ error }}
        </div>
        <div v-else-if="pasantiasRecientes.length === 0" class="p-6 text-center text-gray-500">
          No hay pasantías publicadas aún
        </div>
        <div v-else>
          <DataTable :columns="columns" :data="pasantiasRecientes">
            <template #jefe="{ item }">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                  {{ item.jefe.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() }}
                </div>
                {{ item.jefe }}
              </div>
            </template>
            
            <template #pasantes="{ item }">
              <span class="font-bold text-secondary">{{ item.pasantes }}</span>
            </template>
            
            <template #postulantes="{ item }">
              <span class="bg-danger/10 text-danger px-2 py-0.5 rounded-full">{{ item.postulantes }}</span>
            </template>
            
            <template #estado="{ item }">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-success/10 text-success">
                <v-icon icon="mdi-check-circle" size="12" class="mr-1"></v-icon> {{ item.estado }}
              </span>
            </template>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import StatCard from '@/components/StatCard.vue'
import DataTable from '@/components/DataTable.vue'

const authStore = useAuthStore()

// Estado de carga
const loading = ref(true)
const error = ref(null)

// Datos del dashboard
const pasantiasRecientes = ref([])

// Columnas para el DataTable
const columns = [
  { key: 'titulo', label: 'Título de Pasantía' },
  { key: 'jefe', label: 'Jefe a Cargo' },
  { key: 'pasantes', label: 'Pasantes', align: 'center' },
  { key: 'postulantes', label: 'Postulantes', align: 'center' },
  { key: 'estado', label: 'Estado' }
]

// Cargar datos del dashboard
onMounted(async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/auth/gerente/dashboard', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    
    const data = response.data
    // Actualizar contadores
    pasantesActivos.value = data.pasantesActivos || 0
    pasantiasPublicadas.value = data.pasantiasPublicadas || 0
    equipo.value = data.equipo || 0
    pasantiasRecientes.value = data.pasantiasRecientes || []
  } catch (err) {
    console.error('Error cargando dashboard:', err)
    error.value = 'No se pudieron cargar los datos del dashboard'
    // Datos por defecto en caso de error
    pasantiasRecientes.value = []
  } finally {
    loading.value = false
  }
})

// Contadores
const pasantesActivos = ref(0)
const pasantiasPublicadas = ref(0)
const equipo = ref(0)
</script>
