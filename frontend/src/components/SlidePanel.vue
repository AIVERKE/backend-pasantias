<template>
  <div>
    <!-- Fondo oscuro semitransparente -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black/30 z-[100] transition-opacity"
      @click="close"
    ></div>

    <!-- Panel Lateral -->
    <div 
      class="fixed top-0 bottom-0 right-0 z-[110] bg-white shadow-2xl transition-transform duration-200 flex flex-col"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
      :style="{ width: width }"
    >
      <!-- Cabecera del Panel -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
        <h2 class="text-xl font-headline font-bold text-secondary">{{ title }}</h2>
        <button 
          @click="close"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <v-icon icon="mdi-close" size="24"></v-icon>
        </button>
      </div>

      <!-- Cuerpo desplazable -->
      <div class="flex-1 overflow-y-auto p-6">
        <slot></slot>
      </div>

      <!-- Pie con botones (opcional) -->
      <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end gap-3">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Detalle'
  },
  width: {
    type: String,
    default: '480px' // por defecto 480px, pero Ver Pasantías usa 600px
  }
})

const emit = defineEmits(['update:isOpen', 'close'])

const close = () => {
  emit('update:isOpen', false)
  emit('close')
}

// Prevenir scroll en body cuando está abierto
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>
