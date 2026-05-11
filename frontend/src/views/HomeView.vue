<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="glass-card pa-8 text-center" elevation="0">
        <v-icon
          icon="mdi-rocket-launch"
          size="80"
          color="primary"
          class="mb-4 animate-rocket"
        ></v-icon>
        
        <h1 class="text-h3 font-weight-bold mb-4 gradient-text">
          Pasantías App
        </h1>
        
        <p class="text-subtitle-1 text-medium-emphasis mb-8">
          Estructura organizada: api, stores, views y router activos.
        </p>

        <v-btn
          color="primary"
          size="x-large"
          prepend-icon="mdi-connection"
          variant="flat"
          class="rounded-pill"
          @click="checkBackend"
          :loading="loading"
        >
          Probar Conexión
        </v-btn>

        <v-alert
          v-if="status"
          :type="statusType"
          variant="tonal"
          class="mt-6 rounded-lg"
          closable
        >
          {{ status }}
        </v-alert>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const loading = ref(false)
const status = ref('')
const statusType = ref('info')

const checkBackend = async () => {
  loading.value = true
  status.value = ''
  
  try {
    const response = await axios.get('/')
    status.value = 'Conexión exitosa con el backend!'
    statusType.value = 'success'
  } catch (error) {
    status.value = 'Error al conectar con el backend. ¿Está corriendo en el puerto 3000?'
    statusType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-rocket {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.rounded-pill {
  text-transform: none !important;
  font-weight: 700 !important;
}
</style>
