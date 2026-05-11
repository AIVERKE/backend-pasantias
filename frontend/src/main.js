import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import pinia from './stores'
import axios from 'axios'
import './assets/tailwind.css'

const app = createApp(App)

// Registrar componentes de Vuetify globalmente
import { VIcon, VBtn, VCard, VImg, VDialog, VTextField, VSelect } from 'vuetify/components'
app.component('v-icon', VIcon)
app.component('v-btn', VBtn)
app.component('v-card', VCard)
app.component('v-img', VImg)
app.component('v-dialog', VDialog)
app.component('v-text-field', VTextField)
app.component('v-select', VSelect)

// Configuración global de Axios
// El baseURL vacío hace que Axios use el origen actual; el prefijo /api lo maneja cada llamada
axios.defaults.baseURL = ''

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
