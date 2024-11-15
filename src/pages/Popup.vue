<template>
  <div class="popup">
    <div class="form-group">
      <label>Base URL:</label>
      <input 
        type="text" 
        v-model="config.baseUrl"
        placeholder="https://api.openai.com"
      >
    </div>
    <div class="form-group">
      <label>API Key:</label>
      <input 
        type="password" 
        v-model="config.apiKey"
      >
    </div>
    <div class="form-group">
      <label>模型:</label>
      <ModelSelect
        v-model="config.selectedModel"
        :models="models"
      />
      <div v-if="loading" class="loading">
        正在获取可用模型...
      </div>
    </div>
    <button 
      @click="saveConfig"
      :disabled="loading"
    >
      保存配置
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import ModelSelect from '../components/ModelSelect.vue'
import { useModels } from '../composables/useModels'
import { useStorage } from '../composables/useStorage'

const { models, fetchModels } = useModels()
const { getConfig, setConfig } = useStorage()
const loading = ref(false)
const config = reactive({
  baseUrl: '',
  apiKey: '',
  selectedModel: ''
})

onMounted(async () => {
  const savedConfig = await getConfig()
  Object.assign(config, savedConfig)
  
  if (config.baseUrl && config.apiKey) {
    loading.value = true
    await fetchModels(config.baseUrl, config.apiKey)
    loading.value = false
  }
})

const saveConfig = async () => {
  debugger
  loading.value = true
  try {
    const modelsList = await fetchModels(config.baseUrl, config.apiKey)
    if (modelsList.length > 0) {
      if (!config.selectedModel) {
        config.selectedModel = modelsList[0].id
      }
      await setConfig(config)
      alert('配置已保存！')
    } else {
      alert('获取模型列表失败，请检查配置是否正确')
    }
  } catch (error) {
    alert('保存配置失败: ' + error.message)
  }
  loading.value = false
}
</script>

<style scoped>
.popup {
  width: 300px;
  padding: 16px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 4px;
}

input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 8px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  color: #666;
  font-style: italic;
  margin-top: 4px;
}
</style> 