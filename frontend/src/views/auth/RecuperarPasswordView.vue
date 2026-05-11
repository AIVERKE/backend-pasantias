<template>
  <div class="w-full">
    <!-- Estado Inicial: Formulario -->
    <div v-if="!enviado" class="animate-fade-in-up">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <v-icon icon="mdi-email-outline" size="32"></v-icon>
        </div>
        <h2 class="text-3xl font-headline font-bold text-secondary">Recuperar Contraseña</h2>
        <p class="text-gray-500 mt-2 font-medium">Ingresa tu correo para recibir las instrucciones de recuperación.</p>
      </div>

      <form @submit.prevent="enviado = true" class="space-y-5">
        <div>
          <label class="block text-sm font-bold text-secondary mb-1">Correo electrónico</label>
          <div class="relative">
            <v-icon icon="mdi-email-outline" size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></v-icon>
            <input 
              type="email" 
              placeholder="ejemplo@umsa.bo" 
              class="w-full bg-neutral text-sm rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary transition-all"
              required
            />
          </div>
        </div>

        <button type="submit" class="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3.5 rounded-lg shadow-sm transition-all hover:shadow-md flex justify-center items-center gap-2 mt-4">
          Enviar Instrucciones
        </button>
      </form>
    </div>

    <!-- Estado de Éxito: Correo Enviado -->
    <div v-else class="text-center animate-fade-in-up">
      <div class="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-4 ring-success/5">
        <v-icon icon="mdi-check" size="40"></v-icon>
      </div>
      <h2 class="text-2xl font-headline font-bold text-secondary">¡Revisa tu correo!</h2>
      <p class="text-gray-500 mt-3 font-medium max-w-sm mx-auto">
        Hemos enviado un enlace de recuperación a tu dirección de correo electrónico. El enlace expirará en 30 minutos.
      </p>

      <div class="mt-8">
        <button @click="enviado = false" class="text-sm font-bold text-primary hover:text-blue-700 hover:underline transition-colors">
          No recibí el correo, intentar nuevamente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const enviado = ref(false)
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
