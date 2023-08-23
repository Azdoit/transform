import { createApp } from 'vue'
import './styles/index.scss'
import 'ol/ol.css'
import router from './router'
import mLibs from './libs'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/reset.css'
// 响应式设置页面的font-size大小
import { useREM } from '@/utils/flexible.js'
import 'virtual:svg-icons-register'
import App from './App.vue'
useREM()

createApp(App)
  .use(createPinia().use(piniaPluginPersistedstate))
  .use(mLibs)
  .use(router)
  .mount('#app')
