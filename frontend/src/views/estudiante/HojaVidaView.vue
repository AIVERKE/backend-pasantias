<template>
  <div class="h-full flex flex-col max-w-5xl mx-auto w-full relative">
    
    <!-- Tarjeta Principal del Perfil -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div class="flex items-center gap-6 w-full md:w-auto">
        <div class="w-24 h-24 rounded-full bg-neutral border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
          <v-icon icon="mdi-account" size="48" class="text-gray-300"></v-icon>
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-headline font-bold text-secondary mb-1">Juan Pérez</h2>
          <!-- 1. Dropdown Restringido de Mención -->
          <select 
            v-model="perfil.mencion"
            class="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2 mb-2"
          >
            <option disabled value="">Selecciona tu mención...</option>
            <option v-for="opcion in opcionesMencion" :key="opcion" :value="opcion">{{ opcion }}</option>
          </select>
          <div class="flex gap-2">
            <span class="px-2 py-1 bg-blue-50 text-primary rounded text-[11px] font-bold tracking-wider uppercase border border-blue-100">8vo Semestre</span>
            <span class="px-2 py-1 bg-gray-50 text-gray-600 rounded text-[11px] font-bold tracking-wider uppercase border border-gray-200">Inglés B2</span>
          </div>
        </div>
      </div>
      
      <!-- Campo para Link a CV en Drive -->
      <div class="w-full md:w-1/3">
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Enlace a CV en Drive</label>
        <div class="flex gap-2">
          <div class="relative flex-1">
            <v-icon icon="mdi-google-drive" size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-primary"></v-icon>
            <input 
              v-model="cvLink"
              type="url" 
              placeholder="https://drive.google.com/..." 
              class="w-full bg-neutral text-sm rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all"
            />
          </div>
          <button class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm shadow-primary/30 shrink-0">
            Guardar
          </button>
        </div>
      </div>
    </div>

    <!-- Pestañas del Formulario -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
      <div class="flex border-b border-gray-200 bg-gray-50 pt-2 px-4 shrink-0 overflow-x-auto">
        <button 
          @click="activeTab = 'resumen'"
          class="px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap"
          :class="activeTab === 'resumen' ? 'text-primary bg-white rounded-t-lg border-t border-l border-r border-gray-200' : 'text-gray-500 hover:text-secondary'"
        >
          Resumen Profesional
          <div v-if="activeTab === 'resumen'" class="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white"></div>
        </button>
        <button 
          @click="activeTab = 'habilidades'"
          class="px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap"
          :class="activeTab === 'habilidades' ? 'text-primary bg-white rounded-t-lg border-t border-l border-r border-gray-200' : 'text-gray-500 hover:text-secondary'"
        >
          Habilidades
          <div v-if="activeTab === 'habilidades'" class="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white"></div>
        </button>
        <button 
          @click="activeTab = 'historial'"
          class="px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap"
          :class="activeTab === 'historial' ? 'text-primary bg-white rounded-t-lg border-t border-l border-r border-gray-200' : 'text-gray-500 hover:text-secondary'"
        >
          Historial Académico
          <div v-if="activeTab === 'historial'" class="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white"></div>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 md:p-8">
        
        <!-- Tab: Resumen -->
        <div v-if="activeTab === 'resumen'" class="space-y-6 max-w-3xl">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sobre mí</label>
            <textarea 
              v-model="perfil.sobreMi"
              rows="6"
              class="w-full bg-neutral text-sm rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all resize-none"
              placeholder="Escribe un breve resumen de tu perfil profesional, intereses y objetivos..."
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Intereses de Pasantía</label>
            <input 
              v-model="perfil.intereses"
              type="text" 
              class="w-full bg-neutral text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all"
              placeholder="Ej. Desarrollo Web, Bases de Datos, Seguridad..."
            />
          </div>
        </div>

        <!-- Tab: Habilidades -->
        <div v-if="activeTab === 'habilidades'" class="space-y-6 max-w-3xl">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Habilidades Técnicas y Blandas</label>
            
            <!-- 2. Autocompletado predictivo (Datalist HTML5) -->
            <div class="flex gap-2 mb-4 relative">
              <input 
                v-model="nuevaHabilidad"
                list="catalogo-habilidades"
                @keyup.enter="agregarHabilidad"
                type="text" 
                class="flex-1 bg-neutral text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-gray-300 focus:border-primary transition-all"
                placeholder="Busca o selecciona una habilidad..."
              />
              <datalist id="catalogo-habilidades">
                <option v-for="hab in catalogoPlano" :key="hab" :value="hab"></option>
              </datalist>

              <button @click="agregarHabilidad" class="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                Añadir
              </button>
            </div>

            <!-- Catálogo Sugerido (Ayuda Visual) -->
            <div class="mb-4 text-xs text-gray-500">
              Usa el buscador para seleccionar opciones estandarizadas de la base de datos.
            </div>

            <div class="flex flex-wrap gap-2">
              <div 
                v-for="(hab, index) in perfil.habilidades" 
                :key="index"
                class="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-primary/20 shadow-sm"
              >
                <span>{{ hab }}</span>
                <button @click="removerHabilidad(index)" class="hover:text-danger transition-colors focus:outline-none">
                  <v-icon icon="mdi-close" size="14"></v-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Historial -->
        <div v-if="activeTab === 'historial'" class="space-y-6 max-w-3xl relative">
          <div class="border-l-2 border-gray-200 ml-3 pl-6 space-y-6">
            
            <div class="relative" v-for="(entrada, index) in historialAcademico" :key="index">
              <div class="absolute w-3 h-3 bg-primary rounded-full -left-[31px] top-1.5 ring-4 ring-white"></div>
              <h3 class="font-bold text-secondary">{{ entrada.titulo }}</h3>
              <p class="text-sm text-gray-500 mb-2">{{ entrada.institucion }} ({{ entrada.anio }})</p>
              <p class="text-sm text-gray-600 bg-neutral p-3 rounded-lg border border-gray-100">{{ entrada.descripcion }}</p>
            </div>

          </div>
          
          <button @click="abrirModal" class="mt-6 flex items-center gap-2 text-primary text-sm font-bold hover:underline">
            <v-icon icon="mdi-plus" size="18"></v-icon>
            Añadir entrada académica
          </button>
        </div>

      </div>

      <!-- Pie del formulario -->
      <div class="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
        <button class="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
          Descartar
        </button>
        <button class="px-8 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm shadow-primary/30">
          Guardar Cambios
        </button>
      </div>
    </div>

    <!-- 3. Ventana Modal: Añadir Entrada Académica -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-xl font-headline font-bold text-secondary">Añadir Entrada Académica</h2>
          <button @click="cerrarModal" class="text-gray-400 hover:text-danger">
            <v-icon icon="mdi-close" size="24"></v-icon>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Título del Estudio <span class="text-danger">*</span></label>
            <input v-model="nuevaEntrada.titulo" type="text" class="w-full bg-neutral text-sm rounded-lg p-3 border border-gray-200 focus:border-primary focus:outline-none" placeholder="Ej. Diplomado en Desarrollo Web">
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Institución <span class="text-danger">*</span></label>
              <input v-model="nuevaEntrada.institucion" type="text" class="w-full bg-neutral text-sm rounded-lg p-3 border border-gray-200 focus:border-primary focus:outline-none" placeholder="Nombre de la universidad o instituto">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Año de Certificación <span class="text-danger">*</span></label>
              <select v-model="nuevaEntrada.anio" class="w-full bg-neutral text-sm rounded-lg p-3 border border-gray-200 focus:border-primary focus:outline-none">
                <option disabled value="">Selecciona el año</option>
                <option v-for="year in aniosValidos" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descripción <span class="text-danger">*</span></label>
            <textarea v-model="nuevaEntrada.descripcion" rows="3" class="w-full bg-neutral text-sm rounded-lg p-3 border border-gray-200 focus:border-primary focus:outline-none resize-none" placeholder="Describe brevemente lo que aprendiste..."></textarea>
          </div>

          <!-- 4. Zona de Carga de Documentos -->
          <div class="mt-6">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Documento de Respaldo</label>
            <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
              <v-icon icon="mdi-cloud-upload" size="48" class="text-gray-400 group-hover:text-primary transition-colors mb-3"></v-icon>
              <p class="text-sm text-gray-600 font-medium mb-1">Sube el certificado escaneado (PDF o JPG) para validación mediante código QR</p>
              <p class="text-xs text-gray-400 mb-4">Tamaño máximo: 5MB</p>
              <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-secondary hover:border-primary hover:text-primary transition-colors">
                Seleccionar archivo
              </button>
            </div>
          </div>
        </div>

        <!-- 5. Acciones del Modal -->
        <div class="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button @click="cerrarModal" class="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            Cancelar
          </button>
          <button @click="guardarEntrada" class="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm shadow-primary/30">
            Guardar Entrada
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// --- PESTAÑAS Y PERFIL BASE ---
const activeTab = ref('resumen')
const cvLink = ref('https://drive.google.com/file/d/1A2B3C4D5E6F/view')

// Opciones restringidas para la mención
const opcionesMencion = [
  'Licenciatura en Informática',
  'Mención Desarrollo de Software e Innovación Tecnológica',
  'Mención Ingeniería de Sistemas',
  'Mención Ciencias de la Computación',
  'Mención Inteligencia Artificial y Ciencia de Datos',
  'Mención Seguridad de la Información',
  'Mención Redes y Tecnologías de la Información y Comunicación (TIC)',
  'Mención Informática Industrial'
]

const perfil = reactive({
  mencion: 'Mención Ingeniería de Sistemas', // Valor por defecto validado
  sobreMi: 'Soy un estudiante apasionado por el desarrollo de software y las nuevas tecnologías. Busco mi primera experiencia profesional en una empresa donde pueda aportar mis conocimientos y seguir aprendiendo de profesionales con experiencia.',
  intereses: 'Desarrollo Web Fullstack, Arquitectura de Software, Cloud Computing',
  habilidades: ['Vue.js', 'Node.js', 'Git']
})


// --- HABILIDADES (Catálogo Predictivo) ---
const catalogoAgrupado = {
  'Desarrollo de Software': ['Vue.js', 'React.js', 'Angular', 'Node.js', 'Spring Boot', 'Microservicios', 'CI/CD', 'Git', 'Docker', 'Kubernetes'],
  'Ingeniería de Sistemas y Gestión': ['Análisis de Requisitos', 'UML', 'Gestión de Proyectos (Scrum/Agile)', 'Arquitectura de Software', 'ITIL', 'COBIT'],
  'Ciencias de la Computación': ['Algoritmia Avanzada', 'Estructura de Datos', 'C++', 'Rust', 'Go', 'Optimización de Código'],
  'Inteligencia Artificial y Datos': ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'Scikit-learn', 'NLP', 'SQL', 'MongoDB'],
  'Seguridad de la Información': ['Ethical Hacking', 'Pentesting', 'Criptografía', 'Análisis de Vulnerabilidades', 'ISO 27001', 'Análisis de Malware'],
  'Redes y TIC': ['Cisco CCNA/CCNP', 'Enrutamiento (OSPF, BGP)', 'Linux Server', 'Windows Server', 'IPv6', 'Telefonía IP', 'Cloud Computing (AWS/Azure)'],
  'Informática Industrial': ['IoT (Internet de las Cosas)', 'SCADA', 'PLCs', 'Sistemas Embebidos', 'Arduino', 'Raspberry Pi', 'Automatización'],
  'Habilidades Blandas (Soft Skills)': ['Trabajo en equipo', 'Liderazgo', 'Comunicación asertiva', 'Resolución de problemas', 'Adaptabilidad', 'Gestión del tiempo']
}

// Aplanamos el catálogo para el datalist
const catalogoPlano = computed(() => {
  return Object.values(catalogoAgrupado).flat()
})

const nuevaHabilidad = ref('')

const agregarHabilidad = () => {
  const hab = nuevaHabilidad.value.trim()
  if (hab !== '' && catalogoPlano.value.includes(hab) && !perfil.habilidades.includes(hab)) {
    perfil.habilidades.push(hab)
    nuevaHabilidad.value = ''
  } else if (hab !== '' && !catalogoPlano.value.includes(hab)) {
    alert("Por favor, selecciona una habilidad válida del catálogo propuesto.")
  }
}

const removerHabilidad = (index) => {
  perfil.habilidades.splice(index, 1)
}


// --- HISTORIAL ACADÉMICO (Modal) ---
const historialAcademico = ref([
  {
    titulo: 'Ingeniería de Sistemas',
    institucion: 'Universidad Mayor de San Andrés',
    anio: 'Presente',
    descripcion: 'Estudiante regular de 8vo semestre. Participación en la feria de ciencias con proyecto de inteligencia artificial.'
  },
  {
    titulo: 'Diplomado en Desarrollo Web',
    institucion: 'Instituto de Tecnologías',
    anio: '2024',
    descripcion: 'Curso intensivo de 6 meses sobre tecnologías Frontend y Backend.'
  }
])

const showModal = ref(false)
const aniosValidos = ['Presente', '2026', '2025', '2024', '2023', '2022', '2021', '2020']

const nuevaEntrada = reactive({
  titulo: '',
  institucion: '',
  anio: '',
  descripcion: ''
})

const abrirModal = () => {
  showModal.value = true
  // Reset fields
  Object.assign(nuevaEntrada, { titulo: '', institucion: '', anio: '', descripcion: '' })
}

const cerrarModal = () => {
  showModal.value = false
}

const guardarEntrada = () => {
  if (nuevaEntrada.titulo && nuevaEntrada.institucion && nuevaEntrada.anio && nuevaEntrada.descripcion) {
    historialAcademico.value.unshift({ ...nuevaEntrada })
    cerrarModal()
  } else {
    alert('Por favor, completa todos los campos obligatorios.')
  }
}
</script>
