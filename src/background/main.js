// 在文件顶部添加
let abortController = null;

// 使用原生 Chrome Storage API 获取配置
async function getConfig() {
  return new Promise((resolve) => {
    // 先获取所有存储的内容来调试
    chrome.storage.local.get(null, (allData) => {
      console.log('All storage data:', allData);
      
      // 使用与 useStorage.js 相同的 key
      chrome.storage.local.get(['config'], (result) => {
        console.log('Config from storage:', result);
        
        // 从 config 对象中获取值
        const config = result.config || {};
        resolve({
          baseUrl: config.baseUrl,
          apiKey: config.apiKey,
          selectedModel: config.selectedModel
        });
      });
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === 'toggleSidePanel') {
      if (sender.tab) {
        const tabId = sender.tab.id;
        chrome.sidePanel.toggle(tabId).catch(error => {
          console.error('Error toggling side panel:', error);
        });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.sidePanel.toggle(tabs[0].id).catch(error => {
              console.error('Error toggling side panel:', error);
            });
          }
        });
      }
    }

    console.log('request', request);
    
    if (request.type === 'sendMessage') {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (!tabs[0]?.id) {
          console.error('No active tab found');
          return;
        }
        
        try {
          await handleMessage(request.message, tabs[0].id);
          sendResponse({ success: true });
        } catch (error) {
          console.error('Error handling message:', error);
          sendResponse({ success: false, error: error.message });
        }
      });
      
      return true;
    }
    
    if (request.type === 'stopResponse') {
      if (abortController) {
        abortController.abort();
        abortController = null;
        sendResponse({ success: true });
      }
    }
  } catch (error) {
    console.error('Error in background script:', error);
    sendResponse({ success: false, error: error.message });
  }
});

async function handleMessage(message, tabId) {
  const config = await getConfig();
  console.log('Got config:', config);
  
  if (!config.baseUrl || !config.apiKey) {
    throw new Error('请先配置Base URL和API Key');
  }
  
  try {
    // 创建新的 AbortController
    abortController = new AbortController();
    const signal = abortController.signal;  // 获取 signal
    
    console.log('Sending request to:', config.baseUrl);
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
      }),
      signal  // 使用 signal 而不是 abortSignal
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response not ok:', response.status, errorText);
      throw new Error(`API请求失败: ${response.status} ${errorText}`);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, {stream: true});
      const lines = buffer.split('\n');
      buffer = lines.pop();
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0].delta.content;
            if (content) {
              // 尝试直接发送到 sidepanel
              try {
                await chrome.runtime.sendMessage({
                  type: 'streamResponse',
                  content: content
                });
              } catch (e) {
                // 如果直接发送失败，尝试通过 content script 发送
                chrome.tabs.sendMessage(tabId, {
                  type: 'stream',
                  content: content
                });
              }
            }
          } catch (e) {
            console.error('解析响应失败:', e);
          }
        }
      }
    }
    
    // 发送完成消息
    try {
      await chrome.runtime.sendMessage({
        type: 'streamDone'
      });
    } catch (e) {
      chrome.tabs.sendMessage(tabId, {
        type: 'done'
      });
    }
    
  } catch (error) {
    // 处理中止请求的情况
    if (error.name === 'AbortError') {
      console.log('请求已被用户终止');
      // 发送终止消息到 sidepanel
      try {
        await chrome.runtime.sendMessage({
          type: 'streamDone',
          aborted: true
        });
      } catch (e) {
        chrome.tabs.sendMessage(tabId, {
          type: 'done',
          aborted: true
        });
      }
      return;
    }
    
    console.error('API调用失败:', error);
    throw new Error('调用AI API失败: ' + error.message);
  }
} 