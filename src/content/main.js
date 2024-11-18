
// 监听来自 background script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'stream' || message.type === 'done') {
    // 直接转发消息到 sidepanel，添加错误处理
    chrome.runtime.sendMessage({
      action: message.type === 'stream' ? 'streamResponse' : 'streamDone',
      content: message.content
    }).catch(error => {
      // 如果 sidepanel 未准备好，消息会发送失败，这是正常的
      console.log('Message forwarding failed (this is normal if sidepanel is not ready):', error);
    });
  }
}); 