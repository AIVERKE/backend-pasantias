<template>
  <div class="w-full">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-headline font-bold text-secondary">Iniciar Sesión</h2>
      <p class="text-gray-500 mt-2 font-medium">Accede a tu cuenta de Pasantías UMSA</p>
    </div>

    <!-- Alerta de error -->
    <transition name="alert-slide">
      <div
        v-if="authStore.error"
        class="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3"
        role="alert"
      >
        <v-icon icon="mdi-alert-circle-outline" size="20" class="mt-0.5 flex-shrink-0 text-red-500" />
        <div class="flex-1 text-sm font-medium">{{ authStore.error }}</div>
        <button
          type="button"
          @click="authStore.clearError()"
          class="text-red-400 hover:text-red-600 transition-colors"
        >
          <v-icon icon="mdi-close" size="16" />
        </button>
      </div>
    </transition>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <!-- Email -->
      <div>
        <label class="block text-sm font-bold text-secondary mb-1">Correo electrónico</label>
        <div class="relative">
          <v-icon icon="mdi-email-outline" size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            v-model="email"
            placeholder="ejemplo@umsa.bo"
            autocomplete="email"
            :disabled="authStore.loading"
            :class="[
              'w-full bg-neutral text-sm rounded-lg py-3 pl-10 pr-4 transition-all',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'border',
              authStore.error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : 'border-transparent focus:border-primary',
              authStore.loading ? 'opacity-60 cursor-not-allowed' : ''
            ]"
            required
          />
        </div>
      </div>

      <!-- Contraseña -->
      <div>
        <label class="block text-sm font-bold text-secondary mb-1">Contraseña</label>
        <div class="relative">
          <v-icon icon="mdi-lock-outline" size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="••••••••"
            autocomplete="current-password"
            :disabled="authStore.loading"
            :class="[
              'w-full bg-neutral text-sm rounded-lg py-3 pl-10 pr-10 transition-all',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'border',
              authStore.error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : 'border-transparent focus:border-primary',
              authStore.loading ? 'opacity-60 cursor-not-allowed' : ''
            ]"
            required
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            :disabled="authStore.loading"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <v-icon :icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" size="20" />
          </button>
        </div>
      </div>

      <div class="flex items-center justify-end">
        <router-link
          to="/auth/recuperar-password"
          class="text-sm font-bold text-black hover:underline transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </router-link>
      </div>

      <!-- Botón submit -->
      <button
        type="submit"
        :disabled="authStore.loading || !email || !password"
        class="w-full bg-black text-white font-bold py-3.5 rounded-lg shadow-sm transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 hover:shadow-md"
      >
        <template v-if="authStore.loading">
          <v-icon icon="mdi-loading" size="20" class="animate-spin" />
          Verificando...
        </template>
        <template v-else>
          Iniciar Sesión
          <v-icon icon="mdi-login" size="20" />
        </template>
      </button>
    </form>

    <div class="mt-8 text-center pt-8 border-t border-gray-100">
      <p class="text-gray-500">¿No tenés una cuenta?</p>
      <router-link
        to="/auth/bienvenida"
        class="inline-block mt-2 text-black font-bold hover:underline transition-colors"
      >
        Crear una cuenta nueva
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) return

  const result = await authStore.login(email.value, password.value)

  if (result.success) {
    router.push(result.redirectTo)
  }
}
</script>

<style scoped>
.alert-slide-enter-active,
.alert-slide-leave-active {
  transition: all 0.25s ease;
}
.alert-slide-enter-from,
.alert-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
