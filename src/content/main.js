import { createApp } from 'vue'
import Sidebar from '../components/Sidebar.vue'

// 创建容器
const container = document.createElement('div')
document.body.appendChild(container)

// 创建Vue应用
const app = createApp(Sidebar)
app.mount(container) 