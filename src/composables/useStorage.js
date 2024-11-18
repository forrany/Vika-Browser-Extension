export function useStorage() {
  const getConfig = async () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['config'], (result) => {
        resolve(result.config || {});
      });
    });
  };

  const setConfig = async (config) => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ config }, resolve);
    });
  };

  return {
    getConfig,
    setConfig
  };
} 