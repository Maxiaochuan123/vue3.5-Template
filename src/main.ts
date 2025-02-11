import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import naive from 'naive-ui'

import App from './App.vue'
import router from './router/instance'
import { btnPermission } from '@/core/directives/btnPermission'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(naive)

// 注册自定义指令
app.directive('btnPermission', btnPermission)

app.mount('#app')
