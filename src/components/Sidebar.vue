<template>
  <div class="sidebar-container">
    <ModelSelect />
    <div class="messages-container">
      <template v-if="messages.length">
        <ChatMessage
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
        />
      </template>
      <div v-else class="empty-message">
        开始对话...
      </div>
    </div>
    <ChatInput @send="handleSendMessage" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'
import ModelSelect from './ModelSelect.vue'
import { useChat } from '../composables/useChat'

const { messages, addMessage, appendToLastMessage, isResponding, startResponding } = useChat()
const currentMessageContent = ref('')

// 添加消息监听器
onMounted(() => {
  console.log('Sidebar mounted, setting up message listener')
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message in sidebar:', message)
    
    if (message.type === 'streamResponse' || message.action === 'streamResponse') {
      console.log('Received stream response:', message.content)
      if (currentMessageContent.value === '') {
        // 如果是新消息，添加一个新的 AI 消息
        addMessage({
          role: 'assistant',
          content: message.content || ''
        })
        currentMessageContent.value = message.content || ''
      } else {
        // 如果是现有消息的继续，追加内容
        appendToLastMessage(message.content || '')
        currentMessageContent.value += message.content || ''
      }
      
      // 强制更新视图
      nextTick(() => {
        const container = document.querySelector('.messages-container')
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    }
    
    if (message.type === 'streamDone' || message.action === 'streamDone') {
      console.log('Stream completed')
      currentMessageContent.value = '' // 重置当前消息内容
    }
  })
})

const handleSendMessage = async (message) => {
  console.log('Sending message:', message)
  
  // 添加用户消息
  addMessage({
    role: 'user',
    content: message
  })
  
  // 开始响应状态
  startResponding()
  
  // 发送消息到 background script
  try {
    await chrome.runtime.sendMessage({
      type: 'sendMessage',
      message
    })
  } catch (error) {
    console.error('Error sending message:', error)
    addMessage({
      role: 'error',
      content: '发送消息失败: ' + error.message
    })
  } finally {
    // 确保响应状态被重置
    isResponding.value = false
  }
}
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: white;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-message {
  text-align: center;
  color: #666;
  padding: 2rem;
}
</style> 