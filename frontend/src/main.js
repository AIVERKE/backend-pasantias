import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import pinia from './stores'
import axios from 'axios'
import './assets/tailwind.css'

const app = createApp(App)

// Registrar componentes de Vuetify globalmente
import { VIcon, VBtn, VCard, VImg, VDialog, VTextField, VSelect, VBadge, VTextarea, VProgressCircular, VChip, VChipGroup, VMenu, VList, VListItem, VListItemTitle, VListItemSubtitle } from 'vuetify/components'
app.component('v-icon', VIcon)
app.component('v-btn', VBtn)
app.component('v-card', VCard)
app.component('v-img', VImg)
app.component('v-dialog', VDialog)
app.component('v-text-field', VTextField)
app.component('v-select', VSelect)
app.component('v-badge', VBadge)
app.component('v-textarea', VTextarea)
app.component('v-progress-circular', VProgressCircular)
app.component('v-chip', VChip)
app.component('v-chip-group', VChipGroup)
app.component('v-menu', VMenu)
app.component('v-list', VList)
app.component('v-list-item', VListItem)
app.component('v-list-item-title', VListItemTitle)
app.component('v-list-item-subtitle', VListItemSubtitle)

// Configuración global de Axios
// El baseURL vacío hace que Axios use el origen actual; el prefijo /api lo maneja cada llamada
axios.defaults.baseURL = 'http://localhost:3000/api'

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
