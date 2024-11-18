# 🤖 AI Chat Sidebar Extension

一个基于 Chrome Extension 的 AI 聊天助手，支持流式响应和模型选择。

## ✨ 特性

- 🎯 基于 Chrome Extension Manifest V3
- 📋 使用 Side Panel API，不影响原网页布局
- 💬 支持流式响应的 AI 对话
- 🔄 可配置多种 AI 模型
- 🔑 支持自定义 API 配置

## 🛠️ 技术栈

- ⚡ Vue 3 + Vite
- 🧩 Chrome Extensions API
- 📦 Chrome Storage API
- 🌊 Fetch Streaming API

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
src/
├── background/ # 后台服务
├── components/ # Vue 组件
│ ├── ChatInput # 聊天输入
│ ├── ChatMessage # 消息显示
│ ├── ModelSelect # 模型选择
│ └── Sidebar # 侧边栏
├── composables/ # 组合式函数
│ ├── useChat # 聊天状态管理
│ ├── useModels # 模型管理
│ └── useStorage # 存储管理
├── content/ # 内容脚本
└── pages/ # 页面
├── Popup # 配置弹窗
└── SidePanel # 侧边栏页面
```

## 🔧 开发

1. 本地开发

```bash
npm run dev
```

2. 构建

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
