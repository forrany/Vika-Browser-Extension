import { ref } from 'vue'

// 创建一个响应式的消息数组
const messages = ref([])

// 创建一个单例实例
let instance = null

export function useChat() {
  if (!instance) {
    instance = {
      // 直接暴露响应式的消息数组
      messages,
      
      addMessage(message) {
        console.log('Adding message:', message)
        messages.value.push(message)
      },
      
      appendToLastMessage(content) {
        console.log('Appending content:', content)
        if (messages.value.length > 0) {
          const lastMessage = messages.value[messages.value.length - 1]
          lastMessage.content += content
        }
      },
      
      clearMessages() {
        messages.value = []
      }
    }
  }
  
  return instance
} 