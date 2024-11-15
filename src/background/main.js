import { useStorage } from '../composables/useStorage'

const { getConfig } = useStorage()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'sendMessage') {
    handleMessage(request.message, sender.tab.id)
      .catch(error => {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: 'error',
          error: error.message
        })
      })
    return true
  }
})

async function handleMessage(message, tabId) {
  const config = await getConfig()
  
  if (!config.baseUrl || !config.apiKey) {
    throw new Error('请先配置Base URL和API Key')
  }
  
  try {
    const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: message
        }],
        model: config.selectedModel || 'gpt-3.5-turbo',
        stream: true
      })
    })
    
    if (!response.ok) {
      throw new Error('API请求失败')
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    
    while (true) {
      const {value, done} = await reader.read()
      if (done) break
      
      buffer += decoder.decode(value, {stream: true})
      const lines = buffer.split('\n')
      buffer = lines.pop()
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices[0].delta.content
            if (content) {
              chrome.tabs.sendMessage(tabId, {
                type: 'stream',
                content: content
              })
            }
          } catch (e) {
            console.error('解析响应失败:', e)
          }
        }
      }
    }
    
    chrome.tabs.sendMessage(tabId, {
      type: 'done'
    })
    
  } catch (error) {
    throw new Error('调用AI API失败: ' + error.message)
  }
} 