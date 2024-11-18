/**
 * 打开Chrome扩展的侧边栏
 * @param {number} [tabId] - 可选的标签页ID,如果不传则使用当前活动标签页
 * @returns {Promise<void>}
 */
export async function openSidebar(tabId) {
  try {
    // 如果没有传入tabId,则获取当前活动标签页
    if (!tabId) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      tabId = tab?.id;
    }

    if (!tabId) {
      throw new Error('No valid tab ID found');
    }

    // 设置侧边栏选项
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'src/pages/sidepanel.html',
      enabled: true
    });

    // 打开侧边栏
    await chrome.sidePanel.open({
      tabId
    });

    return true;
  } catch (error) {
    console.error('Error opening sidebar:', error);
    throw error;
  }
} 