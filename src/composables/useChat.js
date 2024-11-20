import { ref } from 'vue'

// 创建一个响应式的消息数组
const messages = ref([])
// 创建一个响应式的 isResponding 状态
const isResponding = ref(false)

// 创建一个单例实例
let instance = null

export function useChat() {

  const addMessage = (message) => {
    messages.value.push(message)
  }

  const appendToLastMessage = (content) => {
    if (messages.value.length > 0) {
      const lastMessage = messages.value[messages.value.length - 1]
      lastMessage.content += content
    }
  }

  const clearMessages = () => {
    messages.value = []
  }

  const startResponding = () => {
    isResponding.value = true
  }

  const stopResponse = () => {
    chrome.runtime.sendMessage({
      type: 'stopResponse'
    }).then(() => {
      isResponding.value = false
    })
  }

  if (!instance) {
    instance = {
      messages,
      isResponding,
      addMessage,
      appendToLastMessage,
      clearMessages,
      startResponding,
      stopResponse,
      sendMessage: async () => {
        try {
          startResponding()
          await chrome.runtime.sendMessage({
            type: 'sendMessage',
            data: {
                messages: messages.value.map(msg => ({
                  role: msg.role,
                  content: msg.content
                }))
              }
          })
        } catch (error) {
          console.error('Error sending message:', error)
        }
      }
    }
  }
  return instance
}