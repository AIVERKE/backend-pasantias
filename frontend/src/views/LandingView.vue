<template>
  <div class="bg-neutral selection:bg-blue-900/20 min-h-screen font-body text-secondary">
    <!-- TopAppBar -->
    <header class="fixed top-0 w-full z-50 bg-secondary shadow-md h-24 transition-all duration-300 flex items-center">
      <nav class="flex justify-between items-center w-full max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex items-center gap-3">
          <!-- Logo UMSA -->
          <img alt="Logo UMSA" class="h-16 w-auto drop-shadow-sm brightness-200" src="/images/logotipo_letras.png" />
        </div>
        <div class="hidden md:flex items-center space-x-10">
          <a v-for="item in menuItems" :key="item.href" :href="item.href" class="relative text-white/80 hover:text-white font-headline font-semibold tracking-tight transition-colors duration-300 group">
            {{ item.label }}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>
        <div class="flex items-center gap-4">
          <router-link to="/auth/login" class="px-7 py-2.5 rounded-full bg-primary text-white font-bold hover:bg-blue-600 hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all duration-300 text-sm tracking-wide border border-primary/50">
            Iniciar Sesión
          </router-link>
        </div>
      </nav>
    </header>

    <main class="pt-24">
      <!-- Hero Section -->
      <section class="relative min-h-[600px] flex items-center justify-center px-8 text-center bg-white overflow-hidden">
        <!-- Elementos decorativos de fondo -->
        <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-50 to-transparent opacity-60"></div>
        <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div class="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center mt-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-bold uppercase tracking-wide mb-6">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Plataforma Oficial
          </div>
          <h1 class="text-5xl lg:text-7xl font-extrabold text-secondary leading-[1.15] tracking-tighter mb-6">
            Sistema de Gestión de <br /> <span class="text-primary font-light italic">Pasantías</span> UMSA
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl leading-relaxed font-body mb-10 font-medium">
            Facilitamos el puente entre la excelencia académica y el mundo profesional, brindando a los estudiantes de la Universidad Mayor de San Andrés las mejores oportunidades de crecimiento.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            <router-link to="/auth/bienvenida" class="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-primary text-white font-bold text-lg hover:bg-blue-600 hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all duration-300">
              Comenzar Ahora
            </router-link>
            <router-link to="/auth/login" class="inline-flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-gray-200 bg-white text-secondary font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">
              Ya tengo cuenta
            </router-link>
          </div>
        </div>
      </section>

      <!-- Bento Grid for Mision, Vision, Objetivos, Quienes Somos -->
      <section class="max-w-7xl mx-auto px-8 py-20">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-extrabold text-secondary font-headline tracking-tighter">Nuestra Identidad</h2>
          <p class="text-gray-500 mt-4 max-w-2xl mx-auto">Conoce los pilares que impulsan el desarrollo del talento universitario hacia el éxito profesional.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <!-- Misión -->
          <div class="p-10 rounded-3xl bg-white border border-gray-200 hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 text-center flex flex-col items-center h-full shadow-sm" id="mision">
            <div class="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100 text-primary">
              <v-icon icon="mdi-bullseye-arrow" size="32"></v-icon>
            </div>
            <div class="relative z-10 flex flex-col flex-grow">
              <h2 class="text-2xl font-extrabold text-secondary mb-4 font-headline">Misión</h2>
              <p class="text-base text-gray-600 leading-relaxed font-body max-w-md mx-auto">
                {{ info?.mision || 'Nuestra misión es gestionar y promover programas de pasantías de alta calidad que integren el conocimiento teórico con la práctica profesional.' }}
              </p>
            </div>
          </div>

          <!-- Visión -->
          <div class="p-10 rounded-3xl bg-white border border-gray-200 hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 text-center flex flex-col items-center h-full shadow-sm" id="vision">
            <div class="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100 text-primary">
              <v-icon icon="mdi-eye-outline" size="32"></v-icon>
            </div>
            <div class="relative z-10 flex flex-col flex-grow">
              <h2 class="text-2xl font-extrabold text-secondary mb-4 font-headline">Visión</h2>
              <p class="text-base text-gray-600 leading-relaxed font-body max-w-md mx-auto">
                {{ info?.vision || 'Ser el referente nacional en la gestión de talento joven, reconocidos por nuestra eficiencia en la vinculación académica-empresarial.' }}
              </p>
            </div>
          </div>

          <!-- Objetivos -->
          <div class="p-10 rounded-3xl bg-white border border-gray-200 hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 text-center flex flex-col items-center h-full shadow-sm" id="objetivos">
            <div class="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100 text-primary">
              <v-icon icon="mdi-flag-outline" size="32"></v-icon>
            </div>
            <div class="relative z-10 flex flex-col flex-grow">
              <h2 class="text-2xl font-extrabold text-secondary mb-4 font-headline">Nuestros Objetivos</h2>
              <p class="text-base text-gray-600 leading-relaxed font-body max-w-md mx-auto">
                {{ info?.objetivos || 'Estructuramos cada paso del proceso para garantizar que tu transición al mercado laboral sea exitosa y significativa.' }}
              </p>
            </div>
          </div>

          <!-- Quiénes Somos -->
          <div class="p-10 rounded-3xl bg-white border border-gray-200 hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 text-center flex flex-col items-center h-full shadow-sm" id="quienes-somos">
            <div class="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100 text-primary">
              <v-icon icon="mdi-account-group-outline" size="32"></v-icon>
            </div>
            <div class="relative z-10 flex flex-col flex-grow">
              <h2 class="text-2xl font-extrabold text-secondary mb-4 font-headline">¿Quiénes Somos?</h2>
              <div class="space-y-4 text-base text-gray-600 leading-relaxed font-body max-w-md mx-auto">
                <p v-if="info?.quienes_somos">{{ info.quienes_somos }}</p>
                <template v-else>
                  <p>La Unidad de Gestión de Pasantías de la UMSA es el órgano encargado de articular las necesidades del sector productivo con el talento emergente.</p>
                  <p>Con más de dos décadas de experiencia, aseguramos que cada pasantía sea una experiencia transformadora.</p>
                </template>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Empresas Aliadas Section -->
      <section v-if="empresas.length" class="max-w-7xl mx-auto px-8 py-20 border-t border-gray-200">
        <h2 class="text-3xl lg:text-4xl font-extrabold text-secondary mb-12 font-headline text-center tracking-tighter">
          Empresas en <span class="text-primary">Convenio</span>
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div v-for="empresa in empresas" :key="empresa.id_empresa" @click="abrirModal(empresa)" class="p-6 rounded-2xl bg-white border border-gray-200 hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center group cursor-pointer">
            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <v-icon icon="mdi-domain" size="24" class="text-primary"></v-icon>
            </div>
            <h3 class="text-sm font-bold text-secondary text-center">{{ empresa.nombre }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ empresa.rubro }}</p>
          </div>
        </div>
      </section>

      <!-- CTAs -->
      <section class="max-w-5xl mx-auto px-8 pb-20">
        <div class="bg-secondary rounded-[2.5rem] p-12 lg:p-16 text-center relative overflow-hidden shadow-xl">
          <!-- Decoración -->
          <div class="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
          
          <h2 class="text-3xl lg:text-4xl font-extrabold mb-4 font-headline text-white tracking-tighter relative z-10">¿Listo para dar el primer paso?</h2>
          <p class="text-lg mb-10 text-white/80 max-w-xl mx-auto font-body relative z-10">Regístrate hoy y accede a la red de pasantías más prestigiosa de Bolivia.</p>
          <div class="flex flex-col sm:flex-row justify-center gap-5 relative z-10">
            <router-link to="/auth/bienvenida" class="px-8 py-3.5 rounded-full bg-primary text-white font-bold text-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-primary/20">
              Registrarse
            </router-link>
            <router-link to="/auth/registro-empresa" class="px-8 py-3.5 rounded-full border border-white/20 bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-all">
              Portal de Empresas
            </router-link>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="w-full py-12 border-t border-gray-200 bg-white">
      <div class="flex flex-col md:flex-row justify-between items-center px-12 max-w-7xl mx-auto space-y-6 md:space-y-0">
        <div class="flex items-center gap-3">
          <span class="font-headline font-extrabold text-secondary text-2xl tracking-tight">UMSA <span class="text-primary font-light italic">Pasantías</span></span>
        </div>
        <div class="flex flex-wrap justify-center gap-8 font-body text-sm font-semibold text-gray-500">
          <a class="hover:text-primary transition-colors duration-200" href="#">Privacidad</a>
          <a class="hover:text-primary transition-colors duration-200" href="#">Términos</a>
          <a class="hover:text-primary transition-colors duration-200" href="#">Contacto</a>
        </div>
        <div class="text-gray-400 text-sm font-body font-medium">
          © 2026 UMSA
        </div>
      </div>
    </footer>

    <!-- Modal Detalles Empresa -->
    <div v-if="empresaSeleccionada" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-secondary/80 backdrop-blur-sm" @click="cerrarModal"></div>
      
      <!-- Modal Content -->
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 animate-fade-in-up">
        <!-- Header con imagen/color -->
        <div class="h-32 bg-gradient-to-r from-blue-600 to-primary relative rounded-t-3xl">
          <button @click="cerrarModal" class="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
            <v-icon icon="mdi-close" size="20"></v-icon>
          </button>
          
          <div class="absolute -bottom-10 left-8 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-100">
            <v-icon icon="mdi-domain" size="40" class="text-primary"></v-icon>
          </div>
        </div>
        
        <div class="pt-14 px-8 pb-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-2xl font-headline font-bold text-secondary">{{ empresaSeleccionada.nombre }}</h2>
              <div class="flex gap-3 mt-2">
                <span class="inline-flex items-center gap-1 text-xs font-bold bg-blue-50 text-primary px-2.5 py-1 rounded-md">
                  <v-icon icon="mdi-tag-outline" size="14"></v-icon> {{ empresaSeleccionada.rubro }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="space-y-6 text-gray-600 font-body">
            <div>
              <h3 class="text-sm font-bold text-secondary mb-2">Sobre la Empresa</h3>
              <p class="text-sm leading-relaxed">{{ empresaSeleccionada.descripcion || 'Esta empresa aliada ofrece excelentes oportunidades de pasantía para estudiantes de la UMSA, contribuyendo al desarrollo profesional del talento local.' }}</p>
            </div>
            
            <!-- Galería de Fotos -->
            <div v-if="empresaSeleccionada.galeria && empresaSeleccionada.galeria.length > 0">
              <h3 class="text-sm font-bold text-secondary mb-3">Galería Fotográfica</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div v-for="(img, idx) in empresaSeleccionada.galeria" :key="idx" class="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img :src="img.url" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </div>
            <div v-else class="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center">
              <v-icon icon="mdi-image-off-outline" size="32" class="text-gray-300 mb-2"></v-icon>
              <p class="text-xs font-medium text-gray-500">Esta empresa aún no ha subido fotografías a su galería.</p>
            </div>
          </div>
          
          <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <router-link to="/auth/registro-estudiante" class="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors shadow-sm inline-flex items-center gap-2">
              Ver pasantías de esta empresa
              <v-icon icon="mdi-arrow-right" size="16"></v-icon>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const info = ref(null)
const empresas = ref([])
const empresaSeleccionada = ref(null)

const abrirModal = (empresa) => {
  empresaSeleccionada.value = empresa
  document.body.style.overflow = 'hidden' // Bloquear scroll
}

const cerrarModal = () => {
  empresaSeleccionada.value = null
  document.body.style.overflow = '' // Restaurar scroll
}

const menuItems = [
  { label: 'Misión', href: '#mision' },
  { label: 'Visión', href: '#vision' },
  { label: 'Objetivos', href: '#objetivos' },
  { label: 'Quiénes Somos', href: '#quienes-somos' }
]

const fetchData = async () => {
  try {
    // Fetch institucional info
    const infoRes = await axios.get('/informacion-empresa')
    if (infoRes.data && infoRes.data.length > 0) {
      info.value = infoRes.data[0] // Tomamos el primer registro
    }

    // Fetch empresas
    const empresasRes = await axios.get('/empresas')
    empresas.value = empresasRes.data.slice(0, 10) // Mostramos las primeras 10
  } catch (error) {
    console.error('Error fetching data:', error)
    // Cargar datos MOCK si no hay backend
    empresas.value = [
      { id_empresa: 1, nombre: 'TechNova Solutions', rubro: 'Tecnología', descripcion: 'Líderes en desarrollo de software corporativo con operaciones en toda la región andina. Buscamos talento joven para proyectos de innovación.', galeria: [{url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400&h=300'}, {url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400&h=300'}] },
      { id_empresa: 2, nombre: 'Banco Nacional', rubro: 'Banca y Finanzas', descripcion: 'Institución financiera comprometida con el desarrollo social y económico del país. Ofrecemos oportunidades de pasantía en áreas financieras y tecnológicas.', galeria: [] },
      { id_empresa: 3, nombre: 'Innovate SRL', rubro: 'Telecomunicaciones', descripcion: 'Empresa nacional de telecomunicaciones con amplio alcance.', galeria: [{url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=400&h=300'}] },
      { id_empresa: 4, nombre: 'Constructora Alfa', rubro: 'Construcción', descripcion: 'Liderando los proyectos de infraestructura más importantes de la ciudad.', galeria: [] }
    ]
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Animación para el Modal */
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
