<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-headline font-bold text-secondary">Registro como Tutor</h2>
      <p class="text-gray-500 mt-1 font-medium text-sm">Paso {{ step }} de 2</p>
    </div>

    <!-- Progress Bar -->
    <div class="flex gap-2 mb-8">
      <div class="h-1.5 flex-1 rounded-full transition-colors" :class="step >= 1 ? 'bg-primary' : 'bg-gray-200'"></div>
      <div class="h-1.5 flex-1 rounded-full transition-colors" :class="step >= 2 ? 'bg-primary' : 'bg-gray-200'"></div>
    </div>

    <form @submit.prevent="handleNextStep" class="space-y-4">
      <!-- PASO 1: Datos Personales y Profesionales -->
      <div v-if="step === 1" class="space-y-4 animate-fade-in-up">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-secondary mb-1">Nombres</label>
            <input type="text" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-secondary mb-1">Apellidos</label>
            <input type="text" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Correo Electrónico (Preferible Institucional)</label>
          <input type="email" placeholder="ejemplo@umsa.bo" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Especialidad / Área de conocimiento</label>
          <input type="text" placeholder="Ej: Ingeniería de Software, Auditoría..." class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Facultad o Institución a la que pertenece</label>
          <input type="text" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
        </div>
      </div>

      <!-- PASO 2: Seguridad -->
      <div v-if="step === 2" class="space-y-4 animate-fade-in-up">
        <!-- Aviso Ámbar -->
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3 mb-4">
          <v-icon icon="mdi-information-outline" class="text-amber-600 shrink-0"></v-icon>
          <p class="text-xs text-amber-800">
            <strong>Importante:</strong> Tu cuenta quedará en estado <span class="font-bold">Pendiente</span> tras registrarte. Un administrador validará tus credenciales antes de habilitar tu acceso al sistema.
          </p>
        </div>

        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Crear Contraseña</label>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" class="w-full bg-neutral text-sm rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <v-icon :icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" size="18"></v-icon>
            </button>
          </div>
          <!-- Indicador de Fortaleza -->
          <div class="flex gap-1 mt-2">
            <div class="h-1 flex-1 rounded-full bg-danger"></div>
            <div class="h-1 flex-1 rounded-full" :class="password.length > 5 ? 'bg-warning' : 'bg-gray-200'"></div>
            <div class="h-1 flex-1 rounded-full" :class="password.length > 8 ? 'bg-success' : 'bg-gray-200'"></div>
            <div class="h-1 flex-1 rounded-full" :class="password.length > 10 ? 'bg-success' : 'bg-gray-200'"></div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Confirmar Contraseña</label>
          <input type="password" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
        </div>

        <div class="flex items-start gap-2 mt-6">
          <input type="checkbox" id="terminos" class="mt-1 rounded text-primary focus:ring-primary" required />
          <label for="terminos" class="text-xs text-gray-500 leading-tight">
            He leído y acepto los <a href="#" class="text-primary hover:underline font-bold">Términos de Servicio</a>.
          </label>
        </div>
      </div>

      <div class="flex gap-3 pt-4">
        <button v-if="step === 2" type="button" @click="step = 1" class="flex-1 bg-white border border-gray-200 text-secondary font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors">
          Atrás
        </button>
        <button type="submit" class="flex-[2] bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-sm transition-colors">
          {{ step === 1 ? 'Continuar' : 'Enviar Solicitud de Registro' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const step = ref(1)
const showPassword = ref(false)
const password = ref('')

const handleNextStep = () => {
  if (step.value === 1) {
    step.value = 2
  } else {
    // Pasar a confirmación enviando el rol
    router.push({ path: '/auth/confirmacion', query: { rol: 'tutor' } })
  }
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
