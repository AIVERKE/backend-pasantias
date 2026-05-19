<template>
  <div class="h-full flex flex-col max-w-5xl mx-auto w-full relative">
    
    <!-- Spinner de Carga General -->
    <div v-if="cargandoInicial" class="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <!-- Tarjeta Principal del Perfil -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 flex flex-col md:flex-row items-start justify-between gap-6">
      <div class="flex items-center gap-6 w-full md:w-2/3">
        <div class="w-24 h-24 rounded-full bg-neutral border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
          <v-icon icon="mdi-account" size="48" class="text-gray-300"></v-icon>
        </div>
        <div class="flex-1 space-y-3 w-full">
          <h2 class="text-2xl font-headline font-bold text-secondary mb-1">{{ nombreCompleto }}</h2>
          <div class="flex flex-col md:flex-row gap-4 w-full">
            <div class="flex-1">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mención</label>
              <select v-model="perfil.mencion" class="w-full bg-white text-sm font-medium rounded-lg p-2.5 border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                <option v-for="opcion in opcionesMencion" :key="opcion" :value="opcion">{{ opcion }}</option>
              </select>
            </div>
            
            <div class="w-full md:max-w-[150px]">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Semestre</label>
              <select v-model="perfil.semestre" class="w-full bg-white text-sm font-medium rounded-lg p-2.5 border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                <option v-for="num in 10" :key="num" :value="num">{{ num }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Campo para Link a CV en Drive -->
      <div class="w-full md:w-1/3 mt-2 md:mt-0">
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
          <a v-if="cvLink" :href="cvLink" target="_blank" class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200 shrink-0" title="Ver archivo en Drive">
            <v-icon icon="mdi-open-in-new" size="small"></v-icon>
          </a>
        </div>
      </div>
    </div>

    <!-- Pestañas del Formulario -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
      <div class="flex border-b border-gray-200 bg-gray-50 pt-2 px-4 shrink-0 overflow-x-auto">
        <button 
          @click="activeTab = 'resumen'"
          class="px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap"
          :class="activeTab === 'resumen' ? 'text-primary bg-white rounded-t-lg border-t border-l border-r border-gray-200 font-bold' : 'text-gray-500 hover:text-secondary'"
        >
          Resumen Profesional
          <div v-if="activeTab === 'resumen'" class="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white"></div>
        </button>
        <button 
          @click="activeTab = 'habilidades'"
          class="px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap"
          :class="activeTab === 'habilidades' ? 'text-primary bg-white rounded-t-lg border-t border-l border-r border-gray-200 font-bold' : 'text-gray-500 hover:text-secondary'"
        >
          Habilidades
          <div v-if="activeTab === 'habilidades'" class="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white"></div>
        </button>
        <button 
          @click="activeTab = 'historial'"
          class="px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap"
          :class="activeTab === 'historial' ? 'text-primary bg-white rounded-t-lg border-t border-l border-r border-gray-200 font-bold' : 'text-gray-500 hover:text-secondary'"
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
              class="w-full bg-neutral text-sm rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all resize-none shadow-inner"
              placeholder="Escribe un breve resumen de tu perfil profesional, intereses y objetivos..."
            ></textarea>
          </div>
        </div>

        <!-- Tab: Habilidades -->
        <div v-if="activeTab === 'habilidades'" class="space-y-8 max-w-4xl">
          
          <!-- Habilidades Seleccionadas (Stickers) -->
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <label class="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Tus Habilidades (Stickers)</label>
            
            <v-chip-group column class="mb-4 min-h-[40px]">
              <div v-if="perfil.habilidades.length === 0" class="text-gray-400 text-sm italic py-2">
                No tienes habilidades seleccionadas. Usa el catálogo o escribe abajo.
              </div>
              <v-chip
                v-for="(hab, index) in perfil.habilidades" 
                :key="index"
                class="font-bold text-sm"
                color="primary"
                variant="flat"
                closable
                @click:close="removerHabilidad(hab)"
              >
                {{ hab }}
              </v-chip>
            </v-chip-group>

            <div class="flex flex-col gap-2">
              <v-autocomplete
                v-model="perfil.habilidades"
                :items="catalogoPlano"
                label="Escribe para buscar habilidades..."
                variant="outlined"
                multiple
                hide-details
                class="bg-white"
                no-data-text="No se encontraron habilidades con ese nombre"
              >
                <!-- Ocultamos los chips internos de v-autocomplete para renderizarlos en nuestra propia caja arriba -->
                <template v-slot:chip>
                  <span style="display:none;"></span>
                </template>
              </v-autocomplete>
            </div>
          </div>

          <!-- Catálogo Predefinido -->
          <div>
            <h3 class="text-lg font-bold text-secondary mb-4 border-b border-gray-200 pb-2">Catálogo Sugerido por Áreas</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="(habilidades, categoria) in catalogoAgrupado" :key="categoria" class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <v-icon size="small" color="primary">mdi-star-four-points-outline</v-icon> {{ categoria }}
                </h4>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="hab in habilidades" 
                    :key="hab"
                    @click="toggleHabilidad(hab)"
                    class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
                    :class="perfil.habilidades.includes(hab) ? 'bg-primary text-white border-primary shadow-sm' : 'bg-neutral text-gray-600 border-gray-200 hover:border-primary hover:text-primary hover:bg-blue-50'"
                  >
                    {{ hab }}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Tab: Historial -->
        <div v-if="activeTab === 'historial'" class="space-y-6 max-w-3xl relative">
          
          <div v-if="historialAcademico.length === 0" class="text-center py-8 text-gray-400 text-sm italic">
            Aún no has registrado ningún historial académico ni certificado.
          </div>

          <div v-else class="border-l-2 border-gray-200 ml-3 pl-6 space-y-6">
            <div class="relative" v-for="(entrada, index) in historialAcademico" :key="entrada.id_historial || index">
              <div class="absolute w-3 h-3 bg-primary rounded-full -left-[31px] top-1.5 ring-4 ring-white"></div>
              
              <div class="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h3 class="font-bold text-secondary text-lg">{{ entrada.titulo }}</h3>
                  <p class="text-sm text-gray-500 mb-2 font-medium">{{ entrada.institucion }} <span class="bg-gray-100 text-gray-600 px-2 rounded-md ml-1">{{ entrada.anio }}</span></p>
                </div>
                
                <div class="flex items-center gap-2 mt-3 md:mt-0">
                  <button 
                    v-if="entrada.url_certificado" 
                    @click="abrirPdf(entrada.url_certificado)"
                    class="text-primary bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors shrink-0 shadow-sm"
                  >
                    <v-icon size="small">mdi-file-pdf-box</v-icon> Ver Certificado
                  </button>
                  <button 
                    @click="eliminarEntrada(entrada.id_historial)"
                    class="text-danger bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors shrink-0 shadow-sm"
                    title="Eliminar esta entrada"
                  >
                    <v-icon size="small">mdi-delete-outline</v-icon> Eliminar
                  </button>
                </div>
              </div>

              <p class="text-sm text-gray-600 bg-neutral p-4 rounded-xl border border-gray-100 max-w-2xl mt-2 leading-relaxed shadow-inner">{{ entrada.descripcion }}</p>
            </div>
          </div>
          
          <button @click="abrirModal" class="mt-8 flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-primary border border-blue-100 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors shadow-sm">
            <v-icon icon="mdi-plus-circle" size="18"></v-icon>
            Añadir Entrada Académica
          </button>
        </div>

      </div>

      <!-- Pie del formulario (Guardar Perfil) -->
      <div class="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
        <button 
          @click="fetchPerfil"
          class="px-6 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors border border-transparent"
        >
          Descartar
        </button>
        <button 
          @click="guardarCambios"
          :disabled="guardando"
          class="px-8 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-md shadow-primary/30 flex items-center gap-2"
        >
          <v-icon v-if="guardando" size="small" class="animate-spin">mdi-loading</v-icon>
          <v-icon v-else size="small">mdi-content-save-outline</v-icon>
          {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </div>

    <!-- Ventana Modal: Añadir Entrada Académica -->
    <v-dialog v-model="showModal" max-width="700" persistent scrollable>
      <div class="bg-white rounded-xl shadow-xl flex flex-col h-full max-h-[90vh]">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-xl font-headline font-bold text-secondary">Añadir Entrada Académica</h2>
          <button @click="cerrarModal" class="text-gray-400 hover:text-danger p-1 bg-white rounded hover:bg-red-50 transition-colors">
            <v-icon icon="mdi-close" size="24"></v-icon>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Título del Estudio <span class="text-danger">*</span></label>
            <input v-model="nuevaEntrada.titulo" type="text" class="w-full bg-neutral text-sm rounded-lg p-3 border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Ej. Diplomado en Desarrollo Web">
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Institución <span class="text-danger">*</span></label>
              <input v-model="nuevaEntrada.institucion" type="text" class="w-full bg-neutral text-sm rounded-lg p-3 border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Nombre de la universidad o instituto">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Año de Certificación <span class="text-danger">*</span></label>
              <select v-model="nuevaEntrada.anio" class="w-full bg-neutral text-sm rounded-lg p-3 border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                <option disabled value="">Selecciona el año</option>
                <option v-for="year in aniosValidos" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descripción <span class="text-danger">*</span></label>
            <textarea v-model="nuevaEntrada.descripcion" rows="3" class="w-full bg-neutral text-sm rounded-lg p-3 border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" placeholder="Describe brevemente lo que aprendiste..."></textarea>
          </div>

          <!-- Zona de Carga Drag & Drop -->
          <div class="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <v-icon color="primary" size="small">mdi-file-document-outline</v-icon>
              Documento de Respaldo (Requerido) <span class="text-danger">*</span>
            </label>
            
            <div 
              class="border-2 border-dashed rounded-xl p-8 text-center transition-colors flex flex-col items-center justify-center cursor-pointer"
              :class="isDragging ? 'border-primary bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="$refs.fileInput.click()"
            >
              <input 
                type="file" 
                ref="fileInput" 
                class="hidden" 
                accept="application/pdf" 
                @change="handleFileSelect"
              >
              <v-icon size="48" :color="isDragging ? 'primary' : 'grey-lighten-1'">mdi-cloud-upload-outline</v-icon>
              
              <div v-if="!nuevaEntrada.archivo" class="mt-4">
                <p class="text-sm font-bold text-gray-700">
                  Arrastra tu archivo PDF aquí o <span class="text-primary">haz clic para explorar</span>
                </p>
                <p class="mt-1 text-xs text-gray-500">Solo se permiten archivos .pdf (Máx. 5MB)</p>
              </div>
              
              <div v-else class="mt-4 flex flex-col items-center">
                <p class="text-sm font-bold text-primary flex items-center gap-2">
                  <v-icon size="small">mdi-check-circle</v-icon> {{ nuevaEntrada.archivo.name }}
                </p>
                <p class="text-xs text-gray-500 mt-1">{{ (nuevaEntrada.archivo.size / 1024 / 1024).toFixed(2) }} MB</p>
                <button @click.stop="removerArchivo" class="mt-3 text-xs text-danger font-bold hover:underline">Quitar Archivo</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones del Modal -->
        <div class="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button @click="cerrarModal" class="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors border border-transparent">
            Cancelar
          </button>
          <button 
            @click="guardarEntrada" 
            :disabled="guardandoEntrada"
            class="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-md shadow-primary/30 flex items-center gap-2"
          >
            <v-icon v-if="guardandoEntrada" size="small" class="animate-spin">mdi-loading</v-icon>
            {{ guardandoEntrada ? 'Subiendo archivo...' : 'Guardar Entrada' }}
          </button>
        </div>
      </div>
    </v-dialog>


  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

// --- ESTADO BASE ---
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const idEstudiante = computed(() => authStore.user?.id || 1) // ID simulado en frontend
const cargandoInicial = ref(true)
const guardando = ref(false)

const activeTab = ref('resumen')
const cvLink = ref('')
const nombreCompleto = ref('Cargando...')
const historialAcademico = ref([])

// Opciones restringidas para la mención
const opcionesMencion = [
  'Licenciatura en Informática',
  'Desarrollo de Software e Innovación Tecnológica',
  'Ingeniería de Sistemas',
  'Ciencias de la Computación',
  'Inteligencia Artificial y Ciencia de Datos',
  'Seguridad de la Información',
  'Redes y Tecnologías de la Información y Comunicación (TIC)',
  'Informática Industrial'
]

const perfil = reactive({
  mencion: '',
  semestre: null,
  sobreMi: '',
  habilidades: []
})

// --- CARGA Y GUARDADO DE PERFIL ---
const fetchPerfil = async () => {
  try {
    cargandoInicial.value = true

    // Si el idEstudiante es 1 (hardcodeado y probablemente inválido), buscar el primer estudiante disponible
    try {
      const allEst = await axios.get('/estudiantes')
      if (allEst.data && allEst.data.length > 0) {
        idEstudiante.value = allEst.data[0].id_estudiante
      }
    } catch (e) {
      console.warn('No se pudo obtener la lista de estudiantes', e)
    }

    const res = await axios.get(`/estudiantes/perfil/${idEstudiante.value}`)
    const data = res.data
    
    // Mapeo de campos
    nombreCompleto.value = `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno || ''}`.trim()
    let rawMencion = data.mencion || 'Licenciatura en Informática'
    if (rawMencion.startsWith('Mención ')) {
      rawMencion = rawMencion.substring(8)
    }
    perfil.mencion = rawMencion
    perfil.semestre = data.semestre || 1
    perfil.sobreMi = data.sobreMi || ''
    perfil.habilidades = data.habilidades || []
    cvLink.value = data.cvLink || ''
    historialAcademico.value = data.historialAcademico || []
    
  } catch (error) {
    console.error('Error al cargar el perfil:', error)
  } finally {
    cargandoInicial.value = false
  }
}

onMounted(() => {
  fetchPerfil()
})

const guardarCambios = async () => {
  try {
    guardando.value = true
    
    let mencionAguardar = perfil.mencion
    if (mencionAguardar !== 'Licenciatura en Informática' && !mencionAguardar.startsWith('Mención ')) {
      mencionAguardar = 'Mención ' + mencionAguardar
    }

    await axios.patch(`/estudiantes/${idEstudiante.value}`, {
      mencion: mencionAguardar,
      semestre: perfil.semestre,
      sobre_mi: perfil.sobreMi,
      habilidades: perfil.habilidades,
      cvLink: cvLink.value
    })
    
    // Feedback opcional (Toast o Alert)
    // alert('Perfil actualizado exitosamente.')
  } catch (error) {
    console.error('Error al actualizar:', error)
    alert('Ocurrió un error al guardar los cambios.')
  } finally {
    guardando.value = false
  }
}

// --- HABILIDADES (Catálogo y Lógica de Selección) ---
const catalogoAgrupado = {
  'Desarrollo de Software': ['Vue.js', 'React.js', 'Angular', 'Node.js', 'NestJS', 'Spring Boot', 'Microservicios', 'CI/CD', 'Git', 'Docker', 'Kubernetes'],
  'Ingeniería de Sistemas y Gestión': ['Análisis de Requisitos', 'UML', 'Gestión de Proyectos (Scrum/Agile)', 'Arquitectura de Software', 'ITIL', 'COBIT'],
  'Ciencias de la Computación': ['Algoritmia Avanzada', 'Estructura de Datos', 'C++', 'Rust', 'Go', 'Optimización de Código'],
  'Inteligencia Artificial y Datos': ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'Scikit-learn', 'NLP', 'SQL', 'MongoDB'],
  'Seguridad de la Información': ['Ethical Hacking', 'Pentesting', 'Criptografía', 'Análisis de Vulnerabilidades', 'ISO 27001', 'Análisis de Malware'],
  'Redes y TIC': ['Cisco CCNA/CCNP', 'Enrutamiento (OSPF, BGP)', 'Linux Server', 'Windows Server', 'IPv6', 'Telefonía IP', 'Cloud Computing (AWS/Azure)'],
  'Informática Industrial': ['IoT (Internet de las Cosas)', 'SCADA', 'PLCs', 'Sistemas Embebidos', 'Arduino', 'Raspberry Pi', 'Automatización'],
  'Habilidades Blandas (Soft Skills)': ['Trabajo en equipo', 'Liderazgo', 'Comunicación asertiva', 'Resolución de problemas', 'Adaptabilidad', 'Gestión del tiempo']
}

// Aplanamos el catálogo para pasarlo a v-autocomplete
const catalogoPlano = computed(() => {
  return Object.values(catalogoAgrupado).flat().sort()
})

const removerHabilidad = (hab) => {
  perfil.habilidades = perfil.habilidades.filter(h => h !== hab)
}

const toggleHabilidad = (hab) => {
  if (perfil.habilidades.includes(hab)) {
    removerHabilidad(hab)
  } else {
    perfil.habilidades.push(hab)
  }
}


// --- HISTORIAL ACADÉMICO (Modal de Creación y Subida) ---
const showModal = ref(false)
const guardandoEntrada = ref(false)
const aniosValidos = ['Presente', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018']

const nuevaEntrada = reactive({
  titulo: '',
  institucion: '',
  anio: '',
  descripcion: '',
  archivo: null
})

// Variables y métodos para Drag & Drop
const isDragging = ref(false)
const fileInput = ref(null)

const validateAndSetFile = (file) => {
  if (file && file.type === 'application/pdf') {
    if (file.size <= 5 * 1024 * 1024) { // Max 5MB
      nuevaEntrada.archivo = file
    } else {
      alert('El archivo supera los 5MB permitidos.')
    }
  } else {
    alert('Solo se permiten archivos en formato .pdf')
  }
}

const handleDrop = (e) => {
  isDragging.value = false
  const droppedFiles = e.dataTransfer.files
  if (droppedFiles.length > 0) {
    validateAndSetFile(droppedFiles[0])
  }
}

const handleFileSelect = (e) => {
  const selectedFiles = e.target.files
  if (selectedFiles.length > 0) {
    validateAndSetFile(selectedFiles[0])
  }
  // Resetear el input para permitir seleccionar el mismo archivo si fue eliminado
  e.target.value = ''
}

const removerArchivo = () => {
  nuevaEntrada.archivo = null
}

const abrirModal = () => {
  showModal.value = true
  Object.assign(nuevaEntrada, { titulo: '', institucion: '', anio: '', descripcion: '', archivo: null })
}

const cerrarModal = () => {
  showModal.value = false
}

const guardarEntrada = async () => {
  // Manejo correcto del array vs objeto en v-file-input
  const pdfFile = Array.isArray(nuevaEntrada.archivo) ? nuevaEntrada.archivo[0] : nuevaEntrada.archivo

  if (!nuevaEntrada.titulo || !nuevaEntrada.institucion || !nuevaEntrada.anio || !nuevaEntrada.descripcion || !pdfFile) {
    alert('Por favor, completa todos los campos obligatorios y asegúrate de cargar un PDF válido.')
    return
  }

  try {
    guardandoEntrada.value = true
    
    // Preparar el FormData para el interceptor
    const formData = new FormData()
    formData.append('titulo', nuevaEntrada.titulo)
    formData.append('institucion', nuevaEntrada.institucion)
    formData.append('anio', nuevaEntrada.anio)
    formData.append('descripcion', nuevaEntrada.descripcion)
    formData.append('certificado', pdfFile)

    await axios.post(`/estudiantes/${idEstudiante.value}/historial-academico`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    cerrarModal()
    await fetchPerfil() // Recargar los datos para mostrar el nuevo historial
  } catch (error) {
    console.error('Error al subir certificado:', error)
    alert(error.response?.data?.message || 'Error al guardar la entrada académica')
  } finally {
    guardandoEntrada.value = false
  }
}

const eliminarEntrada = async (idHistorial) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esto! Se eliminará el registro y su documento de respaldo.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await axios.delete(`/estudiantes/historial-academico/${idHistorial}`)
      Swal.fire('¡Eliminado!', 'La entrada académica ha sido eliminada con éxito.', 'success')
      await fetchPerfil()
    } catch (error) {
      console.error('Error al eliminar la entrada:', error)
      Swal.fire('Error', 'Hubo un problema al intentar eliminar la entrada.', 'error')
    }
  }
}

const abrirPdf = (url) => {
  if (url) {
    const fullUrl = getPdfUrl(url)
    window.open(fullUrl, '_blank')
  }
}

const getPdfUrl = (url) => {
  if (!url) return ''
  // Asumiendo que el backend corre en el puerto 3000
  return `http://localhost:3000${url}`
}
</script>
