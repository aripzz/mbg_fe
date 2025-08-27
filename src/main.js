import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import views
import Dashboard from './views/Dashboard.vue'
import Wilayah from './views/Wilayah.vue'

// Define routes
const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/wilayah', name: 'Wilayah', component: Wilayah }
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create and mount app
const app = createApp(App)
app.use(router)
app.mount('#app')
