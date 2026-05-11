<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-headline font-bold text-secondary">Registro de Empresa Aliada</h2>
      <p class="text-gray-500 mt-1 font-medium text-sm">Paso {{ step }} de 3</p>
    </div>

    <!-- Progress Bar -->
    <div class="flex gap-2 mb-8">
      <div class="h-1.5 flex-1 rounded-full transition-colors" :class="step >= 1 ? 'bg-primary' : 'bg-gray-200'"></div>
      <div class="h-1.5 flex-1 rounded-full transition-colors" :class="step >= 2 ? 'bg-primary' : 'bg-gray-200'"></div>
      <div class="h-1.5 flex-1 rounded-full transition-colors" :class="step >= 3 ? 'bg-primary' : 'bg-gray-200'"></div>
    </div>

    <form @submit.prevent="handleNextStep" class="space-y-4">
      <!-- PASO 1: Datos de la Empresa -->
      <div v-if="step === 1" class="space-y-4 animate-fade-in-up">
        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Nombre o Razón Social</label>
          <input type="text" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-secondary mb-1">NIT</label>
            <input type="text" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-secondary mb-1">Rubro de la Empresa</label>
            <input type="text" placeholder="Ej: Tecnología, Banca..." class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Dirección Oficial</label>
          <input type="text" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Teléfono Institucional</label>
          <input type="tel" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
        </div>
      </div>

      <!-- PASO 2: Datos del Gerente/Responsable -->
      <div v-if="step === 2" class="space-y-4 animate-fade-in-up">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-secondary mb-1">Nombres del Responsable</label>
            <input type="text" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-secondary mb-1">Apellidos</label>
            <input type="text" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Correo Corporativo</label>
          <input type="email" placeholder="gerente@empresa.com" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Cargo en la Empresa</label>
          <input type="text" placeholder="Ej: Gerente General, Director RRHH" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Carreras de Interés para Pasantías</label>
          <input type="text" placeholder="Ej: Informática, Administración" class="w-full bg-neutral text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary" required />
        </div>
      </div>

      <!-- PASO 3: Seguridad -->
      <div v-if="step === 3" class="space-y-4 animate-fade-in-up">
        <!-- Aviso Ámbar -->
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3 mb-4">
          <v-icon icon="mdi-information-outline" class="text-amber-600 shrink-0"></v-icon>
          <p class="text-xs text-amber-800">
            <strong>Importante:</strong> Las empresas aliadas requieren validación institucional. Una vez enviada la solicitud, el Super Usuario verificará los datos antes de habilitar tu acceso.
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
            Acepto el <a href="#" class="text-primary hover:underline font-bold">Convenio de Pasantías</a> y las regulaciones institucionales de la UMSA para empresas aliadas.
          </label>
        </div>
      </div>

      <div class="flex gap-3 pt-4">
        <button v-if="step > 1" type="button" @click="step--" class="flex-1 bg-white border border-gray-200 text-secondary font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors">
          Atrás
        </button>
        <button type="submit" class="flex-[2] bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-sm transition-colors">
          {{ step < 3 ? 'Continuar' : 'Enviar Solicitud Institucional' }}
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
  if (step.value < 3) {
    step.value++
  } else {
    // Pasar a confirmación enviando el rol
    router.push({ path: '/auth/confirmacion', query: { rol: 'empresa' } })
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
