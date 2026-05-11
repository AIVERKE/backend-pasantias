<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
      <!-- Decorative background -->
      <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div>
        <h2 class="text-2xl font-headline font-bold text-gray-800">Gestión de Convocatorias</h2>
        <p class="text-sm text-gray-500 mt-1">Administra las pasantías y convocatorias de tu empresa.</p>
      </div>
      <button 
        @click="abrirCrear"
        class="bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm transform hover:-translate-y-0.5"
      >
        <v-icon icon="mdi-plus-circle-outline" size="20"></v-icon>
        Crear Pasantía
      </button>
    </div>

    <!-- Pestañas de Estado -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="p-16 text-center flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p class="text-gray-500 mt-4 font-medium">Cargando convocatorias...</p>
      </div>
      
      <div v-else>
        <!-- Tabs -->
        <div class="flex border-b border-gray-100 overflow-x-auto hide-scrollbar">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-6 py-4 text-sm font-medium transition-all duration-300 relative whitespace-nowrap outline-none"
            :class="activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'"
          >
            <div class="flex items-center gap-2">
              <v-icon :icon="tab.icon" size="18" :class="activeTab === tab.id ? 'text-primary' : 'text-gray-400'"></v-icon>
              {{ tab.label }}
              <span class="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs" v-if="getCount(tab.id) > 0">{{ getCount(tab.id) }}</span>
            </div>
            <div 
              class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform duration-300 origin-left"
              :class="activeTab === tab.id ? 'scale-x-100' : 'scale-x-0'"
            ></div>
          </button>
        </div>

        <!-- Filters -->
        <div class="bg-gray-50/50 p-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="relative">
            <v-icon icon="mdi-magnify" size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></v-icon>
            <input type="text" placeholder="Buscar por título..." class="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" v-model="filters.titulo">
          </div>
          <div class="relative">
            <v-icon icon="mdi-briefcase-outline" size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></v-icon>
            <input type="text" placeholder="Filtrar por área..." class="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" v-model="filters.area">
          </div>
          <div class="relative">
            <v-icon icon="mdi-account-tie-outline" size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></v-icon>
            <input type="text" placeholder="Buscar por jefe..." class="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" v-model="filters.jefe">
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto min-h-[300px]">
          <table class="w-full text-left border-collapse min-w-[900px]">
            <thead class="bg-white">
              <tr>
                <th class="py-4 px-6 font-medium text-xs text-gray-400 uppercase tracking-wider">Convocatoria</th>
                <th class="py-4 px-6 font-medium text-xs text-gray-400 uppercase tracking-wider">Fecha Inicio</th>
                <th class="py-4 px-6 font-medium text-xs text-gray-400 uppercase tracking-wider">Jefes Asignados</th>
                <th class="py-4 px-6 font-medium text-xs text-gray-400 uppercase tracking-wider text-center">Postulantes</th>
                <th class="py-4 px-6 font-medium text-xs text-gray-400 uppercase tracking-wider text-center w-36">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <TransitionGroup name="list">
                <tr v-for="item in filteredPasantias" :key="item.id" class="hover:bg-blue-50/30 transition-colors group">
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <v-icon icon="mdi-briefcase-variant-outline" size="20"></v-icon>
                      </div>
                      <div>
                        <div class="font-bold text-sm text-gray-800">{{ item.titulo }}</div>
                        <div class="text-xs text-gray-500 mt-0.5 line-clamp-1" :title="item.area">{{ item.area }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-6 text-sm text-gray-600">
                    <div class="flex items-center gap-1.5">
                      <v-icon icon="mdi-calendar-blank-outline" size="14" class="text-gray-400"></v-icon>
                      {{ formatearFecha(item.fecha_inicio) }}
                      <span v-if="item.fecha_fin && item.fecha_fin !== 'Sin fecha'"> - {{ formatearFecha(item.fecha_fin) }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-6">
                    <div class="flex flex-col items-start gap-1.5">
                      <div v-if="item.jefe_pasantes && item.jefe_pasantes.length > 0" class="flex flex-wrap gap-1.5">
                        <span 
                          v-for="jefe in item.jefe_pasantes" 
                          :key="jefe.id_jefe || jefe.id"
                          class="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200 group/badge hover:bg-white hover:border-red-200 hover:text-red-600 transition-colors cursor-default"
                        >
                          <v-icon icon="mdi-account-tie" size="14" class="text-gray-400 group-hover/badge:text-red-400"></v-icon>
                          {{ jefe.usuario?.nombre || jefe.nombre }}
                          <button @click.stop="quitarJefe(item.id_pasantia || item.id, jefe.id_jefe || jefe.id)" class="ml-0.5 text-gray-400 hover:text-red-500 bg-transparent rounded-full hover:bg-red-50 p-0.5" title="Remover jefe">
                            <v-icon icon="mdi-close" size="12"></v-icon>
                          </button>
                        </span>
                      </div>
                      <button @click="abrirAsignarJefe(item)" class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-blue-700 bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-md transition-colors mt-1">
                        <v-icon icon="mdi-account-plus-outline" size="14"></v-icon>
                        <span v-if="!item.jefe_pasantes?.length">Asignar Jefe</span>
                        <span v-else>Añadir otro</span>
                      </button>
                    </div>
                  </td>
                  <td class="py-4 px-6 text-center">
                    <span v-if="item.estado === 'en_curso'" class="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold bg-green-100 text-green-700 shadow-sm border border-green-200">
                      {{ item.postulantes || 0 }}
                    </span>
                    <span v-else class="text-xs text-gray-400 italic font-medium">-</span>
                  </td>
                  <td class="py-4 px-6 text-center">
                    <div class="flex items-center justify-center gap-2 opacity-100 sm:opacity-70 group-hover:opacity-100 transition-opacity">
                      
                      <!-- Botones condicionales por estado -->
                      <template v-if="item.estado === 'pendiente'">
                        <button @click="abrirEditar(item)" class="action-btn bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" title="Editar Convocatoria">
                          <v-icon icon="mdi-pencil-outline" size="16"></v-icon>
                        </button>
                        <button @click="cambiarEstado(item.id_pasantia || item.id, 'en_curso')" class="action-btn bg-green-50 text-green-600 hover:bg-green-600 hover:text-white" title="Publicar Convocatoria">
                          <v-icon icon="mdi-send-outline" size="16"></v-icon>
                        </button>
                        <button @click="eliminarPasantia(item.id_pasantia || item.id)" class="action-btn bg-red-50 text-red-600 hover:bg-red-600 hover:text-white" title="Eliminar">
                          <v-icon icon="mdi-delete-outline" size="16"></v-icon>
                        </button>
                      </template>

                      <template v-else-if="item.estado === 'en_curso'">
                        <button @click="abrirEditar(item)" class="action-btn bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" title="Editar Detalles">
                          <v-icon icon="mdi-pencil-outline" size="16"></v-icon>
                        </button>
                        <button @click="cambiarEstado(item.id_pasantia || item.id, 'pendiente')" class="action-btn bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white" title="Pausar / Volver a Borrador">
                          <v-icon icon="mdi-pause" size="16"></v-icon>
                        </button>
                        <button @click="cambiarEstado(item.id_pasantia || item.id, 'finalizada')" class="action-btn bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white" title="Marcar como Completada">
                          <v-icon icon="mdi-check-decagram-outline" size="16"></v-icon>
                        </button>
                        <button @click="cambiarEstado(item.id_pasantia || item.id, 'cancelada')" class="action-btn bg-gray-100 text-gray-600 hover:bg-gray-600 hover:text-white" title="Archivar">
                          <v-icon icon="mdi-archive-outline" size="16"></v-icon>
                        </button>
                      </template>

                      <template v-else-if="item.estado === 'finalizada'">
                        <button @click="cambiarEstado(item.id_pasantia || item.id, 'en_curso')" class="action-btn bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" title="Reabrir Convocatoria">
                          <v-icon icon="mdi-refresh" size="16"></v-icon>
                        </button>
                        <button @click="cambiarEstado(item.id_pasantia || item.id, 'cancelada')" class="action-btn bg-gray-100 text-gray-600 hover:bg-gray-600 hover:text-white" title="Archivar">
                          <v-icon icon="mdi-archive-outline" size="16"></v-icon>
                        </button>
                      </template>

                      <template v-else-if="item.estado === 'cancelada'">
                        <button @click="cambiarEstado(item.id_pasantia || item.id, 'en_curso')" class="action-btn bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" title="Restaurar y Publicar">
                          <v-icon icon="mdi-restore" size="16"></v-icon>
                        </button>
                      </template>

                    </div>
                  </td>
                </tr>
              </TransitionGroup>
            </tbody>
          </table>
          
          <!-- Empty State -->
          <div v-if="filteredPasantias.length === 0" class="flex flex-col items-center justify-center py-16 px-4">
            <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <v-icon icon="mdi-file-search-outline" size="40"></v-icon>
            </div>
            <h4 class="text-gray-900 font-bold text-lg mb-1">No hay convocatorias</h4>
            <p class="text-gray-500 text-sm text-center max-w-sm mb-6">No se encontraron pasantías en esta categoría con los filtros actuales.</p>
            <button v-if="activeTab === 'pendiente'" @click="abrirCrear" class="text-primary font-medium hover:underline text-sm">
              Crear una nueva pasantía
            </button>
            <button v-else @click="limpiarFiltros" class="text-primary font-medium hover:underline text-sm">
              Limpiar filtros de búsqueda
            </button>
          </div>
        </div>
        
        <div class="bg-gray-50/50 px-6 py-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
          Mostrando {{ filteredPasantias.length }} resultado(s)
        </div>
      </div>
    </div>

    <!-- Modal Formulario Pasantía (Crear/Editar) -->
    <Transition name="modal">
      <div v-if="modalForm" class="fixed inset-0 z-50 flex items-center justify-center px-4" aria-modal="true">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click="cerrarModalForm"></div>
        
        <!-- Panel -->
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all z-10">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <v-icon :icon="modoForm === 'crear' ? 'mdi-briefcase-plus' : 'mdi-pencil'" size="20" class="text-primary"></v-icon>
              {{ modoForm === 'crear' ? 'Nueva Convocatoria' : 'Editar Convocatoria' }}
            </h3>
            <button @click="cerrarModalForm" class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-200">
              <v-icon icon="mdi-close" size="20"></v-icon>
            </button>
          </div>
          
          <form @submit.prevent="guardarPasantia" class="p-6 space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Título del Puesto</label>
              <input v-model="formData.titulo" type="text" required class="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder-gray-400" placeholder="Ej: Desarrollador Frontend Trainee" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Descripción y Requisitos</label>
              <textarea v-model="formData.descripcion" rows="4" required class="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none placeholder-gray-400" placeholder="Detalla las actividades, perfil buscado y beneficios..."></textarea>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Fecha de Inicio Estimada</label>
              <div class="relative">
                <input v-model="formData.fecha_inicio" type="date" required class="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Área</label>
              <input v-model="formData.area" type="text" required class="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder-gray-400" placeholder="Ej: Tecnología, Marketing..." />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Fecha de Fin Estimada</label>
              <div class="relative">
                <input v-model="formData.fecha_fin" type="date" required class="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
              </div>
            </div>

            <Transition name="fade">
              <div v-if="mensaje" class="p-3 rounded-lg text-sm font-medium flex items-center gap-2" :class="mensaje.includes('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'">
                <v-icon :icon="mensaje.includes('Error') ? 'mdi-alert-circle' : 'mdi-check-circle'" size="18"></v-icon>
                {{ mensaje }}
              </div>
            </Transition>

            <div class="flex gap-3 pt-4 border-t border-gray-100">
              <button type="button" @click="cerrarModalForm" class="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" :disabled="procesando" class="flex-1 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow">
                <v-icon v-if="procesando" icon="mdi-loading" size="18" class="animate-spin"></v-icon>
                {{ procesando ? 'Guardando...' : (modoForm === 'crear' ? 'Crear Pasantía' : 'Guardar Cambios') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal Asignar Jefe -->
    <Transition name="modal">
      <div v-if="modalJefe" class="fixed inset-0 z-50 flex items-center justify-center px-4" aria-modal="true">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click.self="modalJefe = false"></div>
        
        <!-- Panel -->
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all z-10 flex flex-col max-h-[85vh]">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
            <div>
              <h3 class="text-lg font-bold text-gray-800">Asignar Mentor / Jefe</h3>
              <p class="text-xs text-gray-500 mt-0.5" v-if="pasantiaJefeSeleccionadaObj">Para: {{ pasantiaJefeSeleccionadaObj.titulo }}</p>
            </div>
            <button @click="modalJefe = false" class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-200">
              <v-icon icon="mdi-close" size="20"></v-icon>
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto custom-scrollbar">
            <div v-if="!JefesDisponibles || JefesDisponibles.length === 0" class="text-center py-8">
              <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-3">
                <v-icon icon="mdi-account-off-outline" size="32"></v-icon>
              </div>
              <p class="text-gray-600 font-medium">No hay jefes registrados</p>
              <p class="text-gray-400 text-xs mt-1">Registra líderes de equipo en la sección de Empresa.</p>
            </div>
            
            <div v-else class="space-y-2">
              <p class="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Selecciona un miembro del equipo</p>
              <button
                v-for="jefe in JefesDisponibles"
                :key="jefe.userId"
                @click="asignarJefe(jefe.userId)"
                class="w-full p-3 text-left rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-blue-50/30 transition-all flex items-center gap-3 group"
              >
                <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {{ jefe.nombre.charAt(0) }}{{ jefe.apellido.charAt(0) }}
                </div>
                <div class="flex-1">
                  <div class="font-bold text-sm text-gray-800">{{ jefe.nombre }} {{ jefe.apellido }}</div>
                  <div class="text-xs text-gray-500">{{ jefe.email }}</div>
                </div>
                <v-icon icon="mdi-plus-circle" size="20" class="text-gray-300 group-hover:text-primary transition-colors"></v-icon>
              </button>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
            <button type="button" @click="modalJefe = false" class="w-full py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors shadow-sm">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const activeTab = ref('en_curso')
const tabs = [
  { id: 'en_curso', label: 'En Curso', icon: 'mdi-rocket-launch-outline' },
  { id: 'pendiente', label: 'Pendiente', icon: 'mdi-file-document-edit-outline' },
  { id: 'finalizada', label: 'Finalizada', icon: 'mdi-check-decagram-outline' },
  { id: 'cancelada', label: 'Cancelada', icon: 'mdi-archive-outline' }
]

const filters = ref({ titulo: '', area: '', jefe: '' })
const loading = ref(true)
const pasantias = ref([])

// Utilidad para limpiar filtros
const limpiarFiltros = () => {
  filters.value = { titulo: '', area: '', jefe: '' }
}

// Obtener count por pestaña
const getCount = (estadoId) => {
  return pasantias.value.filter(p => p.estado === estadoId).length
}

// Formateo de fecha simple
const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  const d = new Date(fecha)
  // Check valid date
  if(isNaN(d.getTime())) return fecha
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Modal Form (Crear/Editar unificado)
const modalForm = ref(false)
const modoForm = ref('crear') // 'crear' | 'editar'
const procesando = ref(false)
const mensaje = ref('')
const formData = ref({ id: null, titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', area: '' })

// Modal asignar jefe
const modalJefe = ref(false)
const pasantiaJefeSeleccionada = ref(null)
const pasantiaJefeSeleccionadaObj = computed(() => pasantias.value.find(p => (p.id_pasantia || p.id) === pasantiaJefeSeleccionada.value))
const JefesDisponibles = ref([])
const empresaId = ref(null)

const abrirCrear = () => {
  modoForm.value = 'crear'
  formData.value = { id: null, titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', area: '' }
  mensaje.value = ''
  modalForm.value = true
}

const abrirEditar = (item) => {
  modoForm.value = 'editar'
  // Format date correctly for input type="date"
  let formattedDate = ''
  if (item.fecha_inicio) {
    const d = new Date(item.fecha_inicio)
    if(!isNaN(d.getTime())) {
      formattedDate = d.toISOString().split('T')[0]
    }
  }

  let formattedEndDate = ''
  if (item.fecha_fin) {
    const d = new Date(item.fecha_fin)
    if(!isNaN(d.getTime())) {
      formattedEndDate = d.toISOString().split('T')[0]
    }
  }

  formData.value = {
    id: item.id_pasantia || item.id,
    titulo: item.titulo,
    descripcion: item.descripcion || '',
    fecha_inicio: formattedDate,
    fecha_fin: formattedEndDate,
    area: item.area || ''
  }
  mensaje.value = ''
  modalForm.value = true
}

const cerrarModalForm = () => {
  modalForm.value = false
  setTimeout(() => {
    mensaje.value = ''
  }, 300)
}

const recargarPasantias = async () => {
  try {
    const res = await axios.get('/api/pasantias/gerente', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    pasantias.value = res.data || []
  } catch(err) {
    console.error('Error recargando', err)
  }
}

const guardarPasantia = async () => {
  try {
    procesando.value = true
    mensaje.value = ''
    
    const payload = {
      titulo: formData.value.titulo,
      descripcion: formData.value.descripcion,
      fecha_inicio: formData.value.fecha_inicio || null,
      fecha_fin: formData.value.fecha_fin || null,
      area: formData.value.area
    }
    
    if (modoForm.value === 'crear') {
      await axios.post('/api/pasantias/gerente', payload, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      mensaje.value = '¡Convocatoria creada exitosamente!'
    } else {
      await axios.patch(`/api/pasantias/${formData.value.id}`, payload, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      mensaje.value = '¡Convocatoria actualizada!'
    }
    
    await recargarPasantias()
    
    setTimeout(() => {
      cerrarModalForm()
    }, 1200)
  } catch (err) {
    console.error('Error:', err)
    mensaje.value = 'Error: ' + (err.response?.data?.message || err.message)
  } finally {
    procesando.value = false
  }
}

// Cambiar estado de pasantía usando enums en mayúsculas
const cambiarEstado = async (id, nuevoEstado) => {
  try {
    await axios.patch(`/api/pasantias/${id}/estado`, { estado: nuevoEstado }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    await recargarPasantias()
  } catch (err) {
    console.error('Error:', err)
    alert('Error al cambiar estado: ' + (err.response?.data?.message || err.message))
  }
}

// Eliminar pasantía
const eliminarPasantia = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar permanentemente esta pasantía?')) return
  
  try {
    await axios.delete(`/api/pasantias/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    await recargarPasantias()
  } catch (err) {
    console.error('Error:', err)
    alert('Error al eliminar: ' + (err.response?.data?.message || err.message))
  }
}

// Abrir modal asignar jefe
const abrirAsignarJefe = async (item) => {
  pasantiaJefeSeleccionada.value = item.id_pasantia || item.id
  
  // Obtener empresaId si no lo tenemos
  if (!empresaId.value && pasantias.value.length > 0) {
    try {
      const perfilRes = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      empresaId.value = perfilRes.data.gerente?.empresa?.id_empresa
    } catch (err) {
      console.error('Error al obtener perfil:', err)
    }
  }
  
  // Cargar jefes disponibles
  if (empresaId.value) {
    try {
      const res = await axios.get(`/api/pasantias/jefes/by-empresa/${empresaId.value}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      JefesDisponibles.value = res.data || []
    } catch (err) {
      console.error('Error al obtener Jefes:', err)
    }
  }
  
  modalJefe.value = true
}

// Asignar jefe
const asignarJefe = async (jefeUserId) => {
  try {
    await axios.patch(`/api/pasantias/${pasantiaJefeSeleccionada.value}/jefe`, {
      jefe_user_id: jefeUserId
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    modalJefe.value = false
    await recargarPasantias()
  } catch (err) {
    console.error('Error:', err)
    alert('Error al asignar jefe: ' + (err.response?.data?.message || err.message))
  }
}

// Quitar un jefe específico de una pasantía
const quitarJefe = async (pasantiaId, jefeId) => {
  if (!confirm('¿Quitar a este jefe de la convocatoria?')) return
  
  try {
    await axios.delete(`/api/pasantias/${pasantiaId}/jefe?jefe_id=${jefeId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    await recargarPasantias()
  } catch (err) {
    console.error('Error:', err)
    alert('Error al remover jefe: ' + (err.response?.data?.message || err.message))
  }
}

// Cargar pasantías iniciales
onMounted(async () => {
  try {
    loading.value = true
    await recargarPasantias()
  } catch (err) {
    console.error('Error de carga:', err)
  } finally {
    loading.value = false
  }
})

const filteredPasantias = computed(() => {
  return pasantias.value.filter(item => {
    if (item.estado !== activeTab.value) return false
    if (filters.value.titulo && !item.titulo.toLowerCase().includes(filters.value.titulo.toLowerCase())) return false
    if (filters.value.area && !item.area.toLowerCase().includes(filters.value.area.toLowerCase())) return false
    
    // Búsqueda por jefe
    if (filters.value.jefe) {
      const searchJefe = filters.value.jefe.toLowerCase()
      const hasMatch = item.jefe_pasantes?.some(jefe => jefe.nombre.toLowerCase().includes(searchJefe))
      if (!hasMatch) return false
    }
    return true
  })
})
</script>

<style scoped>
/* Transición Modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .transform,
.modal-leave-active .transform {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.modal-enter-from .transform,
.modal-leave-to .transform {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

/* Transición Listas (Tabla) */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}
.list-leave-active {
  position: absolute;
}

/* Mensajes Animación */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Animaciones Generales */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Botones de acción */
.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.action-btn:hover {
  transform: scale(1.05);
}
.action-btn:active {
  transform: scale(0.95);
}

/* Esconder Scrollbar general pero mantener funcionalidad */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Custom Scrollbar para Modal */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}
</style>
