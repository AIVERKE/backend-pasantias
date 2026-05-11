<template>
  <div class="min-h-screen flex font-body selection:bg-blue-900/50">
    <!-- COLUMNA IZQUIERDA: Branding (Oculta en móviles) -->
    <div class="hidden lg:flex flex-col justify-between w-1/2 bg-[#0d1117] relative overflow-hidden p-12">
      <!-- Fondo: Patrón Geométrico (Simulado con gradientes) -->
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')]"></div>

      <!-- Contenido Superior -->
      <div class="relative z-10">
        <router-link to="/" class="inline-flex flex-col gap-4 group">
          <img src="/images/logotipo.png" alt="Símbolo UMSA" class="h-16 w-auto object-contain brightness-200 origin-left transition-transform group-hover:scale-105" />
          <div class="text-white mt-4">
            <h1 class="text-3xl font-headline font-bold leading-tight tracking-tight">Sistema de Gestión <br/> de <span class="text-primary font-light italic">Pasantías</span></h1>
          </div>
        </router-link>
      </div>

      <!-- Contenido Inferior -->
      <div class="relative z-10 mt-auto">
        <p class="text-white/70 text-lg font-medium leading-relaxed max-w-md">
          "Conectando el talento universitario con el mundo profesional"
        </p>
        <div class="mt-8 flex gap-2">
          <div class="w-12 h-1 bg-primary rounded-full"></div>
          <div class="w-2 h-1 bg-white/20 rounded-full"></div>
          <div class="w-2 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- COLUMNA DERECHA: Formulario -->
    <div class="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 relative overflow-y-auto">
      <!-- Botón Volver (Opcional, visible solo si no es la pantalla de bienvenida) -->
      <router-link 
        v-if="$route.path !== '/auth/bienvenida' && $route.path !== '/auth/confirmacion'" 
        to="/auth/bienvenida" 
        class="absolute top-8 left-8 text-gray-400 hover:text-secondary flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <v-icon icon="mdi-arrow-left" size="18"></v-icon>
        Volver
      </router-link>

      <!-- Logo Mobile (Solo visible en pantallas pequeñas) -->
      <div class="lg:hidden absolute top-8 text-center w-full">
        <img :src="['/auth/login', '/auth/bienvenida'].includes($route.path) ? '/images/logotipo.png' : '/images/logotipo_letras.png'" alt="Símbolo UMSA" class="h-12 w-auto mx-auto object-contain" style="filter: brightness(0) invert(0.1);" />
      </div>

      <!-- Contenedor dinámico del formulario -->
      <div class="w-full max-w-md mt-16 lg:mt-0 animate-fade-in-up">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
// El layout simplemente renderiza las vistas hijas dentro de router-view
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
