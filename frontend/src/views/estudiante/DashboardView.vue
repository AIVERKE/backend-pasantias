<template>
  <div>
    <!-- Dashboard Mockup -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Tarjeta 1 -->
      <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary">
        <h3 class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">ESTADO DE PASANTÍA</h3>
        <div class="text-3xl font-headline font-bold text-secondary">En curso</div>
        <div class="text-sm font-body text-gray-500 mt-1">Empresa: Tech Solutions S.A.</div>
      </div>
      
      <!-- Tarjeta 2 -->
      <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary">
        <h3 class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">TAREAS COMPLETADAS</h3>
        <div class="text-3xl font-headline font-bold text-secondary">5 <span class="text-sm font-body text-gray-400 font-normal">/ 12</span></div>
        <div class="text-sm font-body text-gray-500 mt-1">actividades completadas</div>
      </div>
      
      <!-- Tarjeta 3 -->
      <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary">
        <h3 class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">EVALUACIÓN PROMEDIO</h3>
        <div class="text-3xl font-headline font-bold text-secondary">85 <span class="text-sm font-body text-gray-400 font-normal">/ 100</span></div>
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
              <th class="p-4 font-semibold">Fecha Límite</th>
              <th class="p-4 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            <!-- Fila Completada -->
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="p-4 text-secondary font-medium">Revisión de requerimientos iniciales</td>
              <td class="p-4 text-gray-500">12 Oct 2026</td>
              <td class="p-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Completada</span>
              </td>
            </tr>
            <!-- Fila En Curso -->
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="p-4 text-secondary font-medium">Desarrollo de módulo de reportes</td>
              <td class="p-4 text-gray-500">15 Oct 2026</td>
              <td class="p-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">En Curso</span>
              </td>
            </tr>
            <!-- Fila Pendiente -->
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="p-4 text-secondary font-medium">Pruebas de integración</td>
              <td class="p-4 text-gray-500">20 Oct 2026</td>
              <td class="p-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">Pendiente</span>
              </td>
            </tr>
            <!-- Fila Vencida / No Completada -->
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="p-4 text-secondary font-medium">Documentación técnica (Fase 1)</td>
              <td class="p-4 text-gray-500">05 Oct 2026</td>
              <td class="p-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">No Completada</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
