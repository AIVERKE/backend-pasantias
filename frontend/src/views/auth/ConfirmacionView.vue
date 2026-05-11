<template>
  <div class="w-full text-center animate-fade-in-up">
    
    <!-- ESTUDIANTE: Aprobación Inmediata -->
    <div v-if="rol === 'estudiante'" class="space-y-6">
      <div class="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto shadow-sm ring-4 ring-success/5">
        <v-icon icon="mdi-check-decagram" size="56"></v-icon>
      </div>
      
      <div>
        <h2 class="text-3xl font-headline font-bold text-secondary mb-2">¡Registro Exitoso!</h2>
        <p class="text-gray-500 font-medium max-w-sm mx-auto">
          Tu cuenta ha sido creada correctamente. Ya puedes acceder al sistema, armar tu perfil profesional y explorar las pasantías disponibles.
        </p>
      </div>

      <div class="pt-4">
        <router-link to="/estudiante/dashboard" class="inline-flex items-center justify-center gap-2 w-full bg-primary hover:bg-blue-600 text-white font-bold py-3.5 rounded-lg shadow-sm transition-all hover:-translate-y-0.5">
          Ir a mi Panel Principal
          <v-icon icon="mdi-arrow-right" size="18"></v-icon>
        </router-link>
      </div>
    </div>

    <!-- TUTOR / EMPRESA: Pendiente de Aprobación -->
    <div v-else class="space-y-6">
      <div class="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-4 ring-amber-50">
        <v-icon icon="mdi-account-clock" size="56"></v-icon>
      </div>
      
      <div>
        <h2 class="text-3xl font-headline font-bold text-secondary mb-2">Solicitud Enviada</h2>
        <p class="text-gray-500 font-medium max-w-sm mx-auto">
          Hemos recibido tus datos correctamente. Tu cuenta pasará por un proceso de <span class="font-bold text-amber-600">validación institucional</span> por parte de la UMSA.
        </p>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6 text-sm text-gray-600 text-left">
          <v-icon icon="mdi-email-fast-outline" size="18" class="text-primary mr-2 mb-1"></v-icon>
          Recibirás un correo electrónico de confirmación tan pronto como tu perfil haya sido aprobado y activado.
        </div>
      </div>

      <div class="pt-4">
        <router-link to="/" class="inline-flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-secondary font-bold py-3.5 rounded-lg transition-colors">
          Volver a la página principal
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const rol = computed(() => route.query.rol || 'estudiante')
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
