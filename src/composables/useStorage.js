export function useStorage() {
  const getConfig = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(
        ['baseUrl', 'apiKey', 'selectedModel'],
        resolve
      )
    })
  }

  const setConfig = (config) => {
    return new Promise((resolve) => {
      chrome.storage.sync.set(config, resolve)
    })
  }

  return {
    getConfig,
    setConfig
  }
} 