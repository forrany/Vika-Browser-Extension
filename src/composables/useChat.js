import { ref } from 'vue'
import { nanoid } from 'nanoid'

export function useChat() {
  const messages = ref([])
  const inputMessage = ref('')
  let currentMessageId = null

  const appendMessage = (content, isUser) => {
    const message = {
      id: nanoid(),
      content,
      isUser,
      timestamp: Date.now()
    }
    messages.value.push(message)
    if (!isUser) {
      currentMessageId = message.id
    }
    return message.id
  }

  const updateMessage = (content) => {
    if (currentMessageId) {
      const message = messages.value.find(m => m.id === currentMessageId)
      if (message) {
        message.content += content
      }
    }
  }

  const sendMessage = async (content) => {
    if (!content.trim()) return
    
    appendMessage(content, true)
    appendMessage('', false)
    
    chrome.runtime.sendMessage({
      type: 'sendMessage',
      message: content
    })
  }

  chrome.runtime.onMessage.addListener((message) => {
    switch (message.type) {
      case 'stream':
        updateMessage(message.content)
        break
      case 'error':
        if (currentMessageId) {
          const message = messages.value.find(m => m.id === currentMessageId)
          if (message) {
            message.content = '发送消息失败: ' + message.error
            message.error = true
          }
        }
        break
      case 'done':
        currentMessageId = null
        break
    }
  })

  return {
    messages,
    inputMessage,
    sendMessage
  }
} 