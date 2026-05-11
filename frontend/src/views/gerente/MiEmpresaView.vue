<template>
  <div class="space-y-6">
    <!-- Perfil de la Empresa (Editable) -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 class="font-headline font-bold text-secondary text-lg flex items-center gap-2">
          <v-icon icon="mdi-domain" size="20" class="text-primary"></v-icon>
          Mi Empresa
        </h2>
        <div v-if="mensaje" :class="mensaje.includes('Error') ? 'text-danger' : 'text-success'" class="text-sm font-medium">
          {{ mensaje }}
        </div>
        <button 
          @click="guardarCambios"
          :disabled="guardando"
          class="text-sm font-medium bg-primary text-white hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <v-icon v-if="guardando" icon="mdi-loading" size="16" class="animate-spin"></v-icon>
          <v-icon v-else icon="mdi-content-save" size="16"></v-icon>
          {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <v-icon icon="mdi-loading" size="32" class="animate-spin text-gray-400"></v-icon>
          <p class="text-gray-500 mt-2">Cargando...</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div class="col-span-1 md:col-span-2">
            <label class="block text-xs font-semibold text-gray-500 mb-1.5">Nombre de la Empresa / Razón Social</label>
            <input type="text" v-model="empresa.nombre" class="w-full bg-neutral border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-secondary" />
          </div>
          
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1.5">Rubro / Industria</label>
            <input type="text" v-model="empresa.rubro" class="w-full bg-neutral border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1.5">Teléfono</label>
            <input type="text" v-model="empresa.telefono" class="w-full bg-neutral border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary" />
          </div>

          <div class="col-span-1 md:col-span-2">
            <label class="block text-xs font-semibold text-gray-500 mb-1.5">Dirección Principal</label>
            <input type="text" v-model="empresa.direccion" class="w-full bg-neutral border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Estado
const loading = ref(true)
const guardando = ref(false)
const mensaje = ref('')

// Empresa - usar reactive para el formulario
const empresa = reactive({
  nombre: '',
  rubro: '',
  telefono: '',
  direccion: '',
})

// Cargar empresa
onMounted(async () => {
  try {
    loading.value = true
    
    // Cargar empresa
    const empRes = await axios.get('/api/auth/gerente/empresa', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const emp = empRes.data
    
    empresa.nombre = emp.nombre || ''
    empresa.rubro = emp.rubro || ''
    empresa.telefono = emp.telefono || ''
    empresa.direccion = emp.direccion || ''
    
  } catch (err) {
    console.error('Error cargando empresa:', err)
    mensaje.value = 'Error al cargar los datos'
  } finally {
    loading.value = false
  }
})

// Guardar empresa
const guardarCambios = async () => {
  try {
    guardando.value = true
    await axios.patch('/api/auth/gerente/empresa', {
      nombre: empresa.nombre,
      rubro: empresa.rubro,
      telefono: empresa.telefono,
      direccion: empresa.direccion,
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    mensaje.value = 'Cambios guardados correctamente'
    setTimeout(() => mensaje.value = '', 3000)
  } catch (err) {
    console.error('Error guardando:', err)
    mensaje.value = 'Error al guardar los cambios'
  } finally {
    guardando.value = false
  }
}
</script>