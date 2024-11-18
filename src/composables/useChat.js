import { ref } from 'vue'

// 创建一个响应式的消息数组
const messages = ref([])
// 创建一个响应式的 isResponding 状态
const isResponding = ref(false)

// 创建一个单例实例
let instance = null

export function useChat() {
  if (!instance) {
    instance = {
      // 直接暴露响应式的消息数组
      messages,
      isResponding,
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
      },

      // 添加开始响应的方法
      startResponding() {
        isResponding.value = true
        return
      },

      // 添加停止响应的方法
      stopResponse() {
        // 直接发送停止消息到 background script
        chrome.runtime.sendMessage({
          type: 'stopResponse'
        }).then(() => {
          isResponding.value = false
        }).catch(error => {
          console.error('Error sending stop message:', error)
        })
      }
    }
  }
  
  return instance
} 