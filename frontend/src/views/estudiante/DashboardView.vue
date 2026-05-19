<template>
  <div>
    <!-- Estado Vacío -->
    <div v-if="!pasantiaActiva" class="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-briefcase-variant-off</v-icon>
      <h2 class="text-xl font-headline font-bold text-gray-700">Aún no tienes una pasantía activa</h2>
      <p class="text-gray-500 mt-2 text-center max-w-md">
        Cuando el Jefe de Pasantes apruebe tu postulación y cambie el estado de ejecución, podrás visualizar aquí tu progreso y actividades.
      </p>
    </div>

    <!-- Dashboard Dinámico (Solo visible si hay pasantía activa) -->
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Tarjeta 1 -->
        <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary">
          <h3 class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">ESTADO DE PASANTÍA</h3>
          <div class="text-3xl font-headline font-bold text-secondary">
            {{ datosPasantia.estado === 'En Curso' ? 'En curso' : 'Ninguna' }}
          </div>
          <div v-if="datosPasantia.estado === 'En Curso'" class="text-sm font-body text-gray-500 mt-1">
            Empresa: {{ datosPasantia.empresa }}
          </div>
        </div>
        
        <!-- Tarjeta 2 -->
        <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary">
          <h3 class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">TAREAS COMPLETADAS</h3>
          <div class="text-3xl font-headline font-bold text-secondary">
            {{ estadisticas.completadas }} <span class="text-sm font-body text-gray-400 font-normal">/ {{ estadisticas.total }}</span>
          </div>
          <div class="text-sm font-body text-gray-500 mt-1">actividades completadas</div>
        </div>
        
        <!-- Tarjeta 3 -->
        <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary">
          <h3 class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">EVALUACIÓN PROMEDIO</h3>
          <div class="text-3xl font-headline font-bold text-secondary">
            {{ estadisticas.promedio ? estadisticas.promedio : '-' }}
            <span v-if="estadisticas.promedio" class="text-sm font-body text-gray-400 font-normal">/ 100</span>
          </div>
        </div>
      </div>

      <!-- Tabla Inferior -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-lg font-headline font-bold text-secondary">Actividades Asignadas y Recientes</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th class="p-4 font-semibold">Actividad</th>
                <th class="p-4 font-semibold">Fecha Asignación</th>
                <th class="p-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody class="text-sm divide-y divide-gray-100">
              <tr v-for="actividad in actividades" :key="actividad.id" class="hover:bg-gray-50 transition-colors cursor-pointer" @click="goToBitacora">
                <td class="p-4 text-secondary font-medium">{{ actividad.titulo }}</td>
                <td class="p-4 text-gray-500">{{ actividad.fechaAsignacion }}</td>
                <td class="p-4">
                  <!-- Badges Semánticos Estrictos -->
                  <span v-if="actividad.estado === 'Completada'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Completada</span>
                  <span v-else-if="actividad.estado === 'En_curso'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">En Curso</span>
                  <span v-else-if="actividad.estado === 'Pendiente'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-blue-700">Pendiente</span>
                  <span v-else-if="actividad.estado === 'No_completada'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">No Completada</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const router = useRouter();
const authStore = useAuthStore();

// Estado Reactivo Principal
const pasantiaActiva = ref(false);

const datosPasantia = ref({
  estado: 'Ninguna',
  empresa: ''
});

const estadisticas = ref({
  completadas: 0,
  total: 0,
  promedio: null
});

const actividades = ref([]);

const goToBitacora = () => {
  router.push('/estudiante/bitacora');
};

const loadDashboardData = async () => {
  if (!authStore.isAuthenticated || !authStore.user) return;

  try {
    const idEstudiante = authStore.user.id || 1;
    const { data } = await axios.get(`/dashboard/estudiante/${idEstudiante}`);
    
    if (data.estado_pasantia && data.estado_pasantia !== 'Sin Pasantía') {
      pasantiaActiva.value = true;
      datosPasantia.value.estado = data.estado_pasantia;
      datosPasantia.value.empresa = data.actividades_recientes.length > 0 ? 'Empresa de Pasantía' : 'Pendiente Asignación'; // Mock, deberíamos retornar nombre de empresa si se requiere. En service solo retorna estado
      
      estadisticas.value.completadas = data.tareas_completadas.completadas;
      estadisticas.value.total = data.tareas_completadas.totales;
      estadisticas.value.promedio = data.evaluacion_promedio;

      actividades.value = data.actividades_recientes.map(a => ({
        id: a.id,
        titulo: a.titulo,
        fechaAsignacion: new Date(a.fecha).toLocaleDateString(),
        estado: a.estado
      }));
    } else {
      pasantiaActiva.value = false;
    }
  } catch (error) {
    console.error("Error cargando dashboard:", error);
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>
