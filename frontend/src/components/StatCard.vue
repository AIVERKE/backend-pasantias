<template>
  <div 
    class="bg-white rounded-xl p-6 shadow-sm border-y border-r border-gray-100 flex flex-col justify-center relative overflow-hidden transition-all"
    :class="[
      borderLeftClass,
      isActionable ? 'cursor-pointer hover:shadow-md hover:bg-gray-50 group' : ''
    ]"
    @click="handleClick"
  >
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center gap-4">
        <!-- Icono Opcional a la izquierda -->
        <div v-if="icon" class="w-12 h-12 rounded-full flex items-center justify-center shrink-0" :class="[iconBgClass, iconColorClass]">
          <v-icon :icon="icon" size="24"></v-icon>
        </div>
        <div>
          <h3 class="text-[12px] font-body text-[#6B7280] font-semibold uppercase tracking-wider mb-2">{{ title }}</h3>
          <div class="text-[32px] font-headline font-bold text-secondary leading-none">{{ value }}</div>
        </div>
      </div>
      
      <!-- Flecha para Super Usuario o tarjetas navegables -->
      <v-icon 
        v-if="isActionable" 
        icon="mdi-arrow-right" 
        size="24" 
        class="text-gray-300 group-hover:text-primary transition-colors group-hover:translate-x-1 shrink-0 ml-2"
      ></v-icon>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  role: { 
    type: String, 
    default: 'tutor', // estudiante, tutor, jefe, gerente, superusuario
    validator: (v) => ['estudiante', 'tutor', 'jefe', 'gerente', 'superusuario'].includes(v)
  },
  isActionable: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  iconBgClass: { type: String, default: 'bg-primary/10' },
  iconColorClass: { type: String, default: 'text-primary' }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (props.isActionable) {
    emit('click')
  }
}

const borderLeftClass = computed(() => {
  switch (props.role) {
    case 'estudiante':
    case 'tutor':
      return 'border-l-4 border-l-[#3B82F6]' // primary
    case 'jefe':
      return 'border-l-4 border-l-[#D16900]' // tertiary (ámbar)
    case 'gerente':
      return 'border-l-4 border-l-[#10B981]' // success (verde)
    case 'superusuario':
      return 'border-l-4 border-l-[#1A2233]' // secondary (marino)
    default:
      return 'border-l-4 border-l-gray-300'
  }
})
</script>
