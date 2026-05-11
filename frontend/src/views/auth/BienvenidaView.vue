<template>
  <div class="w-full">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-headline font-bold text-secondary">Bienvenido a Pasantías UMSA</h2>
      <p class="text-gray-500 mt-2 font-medium">Selecciona tu perfil para comenzar</p>
    </div>

    <div class="space-y-4">
      <router-link to="/auth/registro-estudiante" class="flex items-center p-5 rounded-xl border-2 border-transparent bg-black text-white transition-all hover:bg-gray-800 hover:shadow-lg group">
        <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <v-icon icon="mdi-school-outline" size="24"></v-icon>
        </div>
        <div class="ml-4 flex-1 text-left">
          <h3 class="text-lg font-bold">Soy Estudiante</h3>
          <p class="text-white/80 text-sm">Quiero buscar y postular a pasantías</p>
        </div>
        <v-icon icon="mdi-arrow-right" size="20" class="text-white/70 group-hover:text-white transition-colors group-hover:translate-x-1"></v-icon>
      </router-link>

      <router-link to="/auth/registro-tutor" class="flex items-center p-5 rounded-xl border-2 border-gray-200 bg-white hover:border-black hover:shadow-md transition-all group">
        <div class="w-12 h-12 rounded-full bg-gray-50 text-gray-700 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
          <v-icon icon="mdi-account-tie-outline" size="24"></v-icon>
        </div>
        <div class="ml-4 flex-1 text-left">
          <h3 class="text-lg font-bold text-secondary">Soy Tutor</h3>
          <p class="text-gray-500 text-sm">Quiero hacer seguimiento a estudiantes</p>
        </div>
        <v-icon icon="mdi-arrow-right" size="20" class="text-gray-400 group-hover:text-black transition-colors group-hover:translate-x-1"></v-icon>
      </router-link>

      <router-link to="/auth/registro-empresa" class="flex items-center p-5 rounded-xl border-2 border-gray-200 bg-white hover:border-black hover:shadow-md transition-all group">
        <div class="w-12 h-12 rounded-full bg-gray-50 text-gray-700 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
          <v-icon icon="mdi-domain" size="24"></v-icon>
        </div>
        <div class="ml-4 flex-1 text-left">
          <h3 class="text-lg font-bold text-secondary">Registrar Empresa</h3>
          <p class="text-gray-500 text-sm">Quiero publicar convocatorias</p>
        </div>
        <v-icon icon="mdi-arrow-right" size="20" class="text-gray-400 group-hover:text-black transition-colors group-hover:translate-x-1"></v-icon>
      </router-link>
    </div>

    <div class="mt-10 text-center">
      <p class="text-gray-500">¿Ya tienes una cuenta?</p>
      <router-link to="/auth/login" class="inline-block mt-2 text-black font-bold hover:underline transition-colors">
        Inicia sesión aquí
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>
