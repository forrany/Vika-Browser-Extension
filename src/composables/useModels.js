import { ref } from 'vue'
import { useStorage } from './useStorage'

export function useModels() {
  const models = ref([])
  const selectedModel = ref('')
  const { getConfig, setConfig } = useStorage()

  const fetchModels = async (baseUrl, apiKey) => {
    try {
      const response = await fetch(`${baseUrl}/v1/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      })
      
      if (!response.ok) throw new Error('获取模型列表失败')
      
      const data = await response.json()
      models.value = data.data || []
      return models.value
    } catch (error) {
      console.error('获取模型列表错误:', error)
      return []
    }
  }

  const initModels = async () => {
    const config = await getConfig()
    if (config.baseUrl && config.apiKey) {
      await fetchModels(config.baseUrl, config.apiKey)
      selectedModel.value = config.selectedModel || 
        (models.value.length > 0 ? models.value[0].id : '')
    }
  }

  const updateSelectedModel = async (modelId) => {
    selectedModel.value = modelId
    await setConfig({ selectedModel: modelId })
  }

  return {
    models,
    selectedModel,
    fetchModels,
    initModels,
    updateSelectedModel
  }
} 