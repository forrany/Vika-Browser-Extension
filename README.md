# 🤖 AI Chat Sidebar Extension

一个基于 Chrome Extension 的 AI 聊天助手，支持流式响应和模型选择。

## ✨ 特性

- 🎯 基于 Chrome Extension Manifest V3
- 📋 使用 Side Panel API，不影响原网页布局
- 💬 支持流式响应的 AI 对话
- 🔄 可配置多种 AI 模型
- 🔑 支持自定义 API 配置
- 🔄 可中断生成

## 🛠️ 技术栈

- ⚡ Vue 3 + Vite
- 🧩 Chrome Extensions API
- 📦 Chrome Storage API
- 🌊 Fetch Streaming API
- 📄 Markdown-it (Markdown渲染)
- 💡 Highlight.js (代码高亮)

## 📦 安装

1. 克隆仓库

```bash
git clone https://github.com/yourusername/ai-chat-sidebar.git
cd ai-chat-sidebar
```

2. 安装依赖

```bash
npm install
```

3. 构建项目

```bash
npm run build
```

4. 在 Chrome 中加载扩展
- 打开 Chrome 扩展管理页面 (`chrome://extensions/`)
- 启用开发者模式
- 点击"加载已解压的扩展程序"
- 选择项目的 `dist` 目录

## 🚀 使用方法

1. 📝 配置
   - 点击扩展图标打开配置面板
   - 输入 Base URL 和 API Key
   - 选择或获取可用的模型列表

2. 💭 开始对话
   - 在任意网页点击扩展图标
   - 在侧边栏中输入消息
   - 实时查看 AI 响应

## 🏗️ 项目结构

```
├── src/
│ ├── assets/ # 静态资源
│ ├── background/ # Chrome扩展后台脚本
│ │ └── main.js
│ ├── components/ # Vue组件
│ │ ├── ChatInput.vue
│ │ ├── ChatMessage.vue
│ │ └── ModelSelect.vue
│ ├── composables/ # Vue组合式函数
│ │ ├── useChat.js
│ │ ├── useModels.js
│ │ └── useStorage.js
│ ├── content/ # Chrome扩展内容脚本
│ │ └── main.js
│ ├── pages/ # 页面
│ │ ├── Popup/ # 弹出窗口
│ │ │ ├── popup.html
│ │ │ ├── popup.js
│ │ │ └── Popup.vue
│ │ └── Sidebar/ # 侧边栏
│ │ ├── sidepanel.html
│ │ ├── sidepanel.js
│ │ └── Sidebar.vue
│ ├── utils/ # 工具函数
│ │ └── sidebar.js
│ └── style.css # 全局样式
├── manifest.json # Chrome扩展配置文件
├── package.json
└── vite.config.js # Vite构建配置
```

## 🔧 开发

1. 本地开发

```bash
npm run dev
```

2. 实时构建
   
在开发过程中，可以实时构建，方便调试，当有代码改动时，会自动重新构建。

```bash
npm run build:watch
```

3. 构建

```bash
npm run build
```


## 🎯 主要功能

### 🔄 状态管理
- 使用 Vue 3 Composition API
- 实现单例模式的状态管理
- 使用 chrome.storage.local 进行持久化

### 📡 消息处理
- 支持流式响应
- 实时显示 AI 回复
- 优雅的错误处理

### 🎛️ 配置管理
- 支持自定义 API 配置
- 动态模型列表
- 配置持久化存储

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

[MIT License](LICENSE)

---

⭐️ 如果这个项目对你有帮助，欢迎 Star！
