import { createApp } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import '../style.css'  // 如果有全局样式的话

const app = createApp(Sidebar)
app.mount('#app')
