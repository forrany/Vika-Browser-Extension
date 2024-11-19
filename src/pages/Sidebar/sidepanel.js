import { createApp } from 'vue'
import Sidebar from './Sidebar.vue'
import '../../styles/global.css'  // 如果有全局样式的话

const app = createApp(Sidebar)
app.mount('#app')
