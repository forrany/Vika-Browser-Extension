import { ref, onMounted } from 'vue'
import { useStorage } from './useStorage'

const { getConfig, setConfig } = useStorage()
const models = ref([])
const selectedModel = ref('')
const loading = ref(false)

export function useModels() {
  const loadModels = async () => {
    loading.value = true
    try {
      const config = await getConfig()
      // 如果配置中有模型列表，使用配置中的列表
      if (config.models && config.models.length > 0) {
        models.value = config.models
      } else {
        // 否则使用默认列表并保存到配置中
        const defaultModels = [
          { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
          { id: 'gpt-4', name: 'GPT-4' },
          { id: '01-ai/Yi-1.5-34B-Chat-16K', name: 'Yi-1.5-34B-Chat-16K' }
        ]
        await setConfig({
          ...config,
          models: defaultModels
        })
        models.value = defaultModels
      }
      // 设置选中的模型
      selectedModel.value = config.selectedModel || models.value[0]?.id
    } catch (error) {
      console.error('Error loading models:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchModels = async () => {
    loading.value = true
    try {
      const config = await getConfig()
      if (!config.baseUrl || !config.apiKey) {
        throw new Error('请先配置Base URL和API Key')
      }

      const response = await fetch(`${config.baseUrl}/v1/models`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`
        }
      })

      if (!response.ok) {
        throw new Error('获取模型列表失败')
      }

      const data = await response.json()
      const newModels = data.data.map(model => ({
        id: model.id,
        name: model.id
      }))

      // 更新配置中的模型列表
      await updateModels(newModels)
      return newModels
    } catch (error) {
      console.error('Error fetching models:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const setSelectedModel = async (modelId) => {
    loading.value = true
    try {
      const config = await getConfig()
      await setConfig({
        ...config,
        selectedModel: modelId
      })
      selectedModel.value = modelId
    } catch (error) {
      console.error('Error setting selected model:', error)
    } finally {
      loading.value = false
    }
  }

  // 更新模型列表
  const updateModels = async (newModels) => {
    loading.value = true
    try {
      const config = await getConfig()
      await setConfig({
        ...config,
        models: newModels
      })
      models.value = newModels
      // 如果当前选中的模型不在新列表中，选择第一个模型
      if (!newModels.find(m => m.id === selectedModel.value)) {
        await setSelectedModel(newModels[0]?.id)
      }
    } catch (error) {
      console.error('Error updating models:', error)
    } finally {
      loading.value = false
    }
  }

  // 在组件挂载时加载模型列表和选中的模型
  onMounted(() => {
    loadModels()
  })

  return {
    models,
    selectedModel,
    loading,
    setSelectedModel,
    updateModels,
    loadModels,
    fetchModels
  }
} 