<template>
  <div class="popup-container">
    <div class="form-group">
      <label>Base URL</label>
      <input v-model="config.baseUrl" type="text" placeholder="请输入Base URL" />
    </div>
    <div class="form-group">
      <label>API Key</label>
      <input v-model="config.apiKey" type="password" placeholder="请输入API Key" />
    </div>
    <div class="form-group">
      <label>模型</label>
      <ModelSelect />
      <div class="model-count" v-if="models.length">
        已加载 {{ models.length }} 个模型
      </div>
      <button 
        @click="handleFetchModels" 
        :disabled="loading || !config.baseUrl || !config.apiKey"
        class="fetch-button"
      >
        {{ loading ? '加载中...' : '获取模型列表' }}
      </button>
    </div>
    <div class="actions">
      <button @click="handleOpenSidebar" class="sidebar-button">打开侧边栏</button>
      <button @click="handleSave" :disabled="loading">保存</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStorage } from '../../composables/useStorage'
import { useModels } from '../../composables/useModels'
import ModelSelect from '../../components/ModelSelect.vue'
import { openSidebar } from '../../utils/sidebar'

const { getConfig, setConfig } = useStorage()
const { fetchModels, loading, models } = useModels()
const config = ref({
  baseUrl: '',
  apiKey: '',
})

onMounted(async () => {
  const savedConfig = await getConfig()
  config.value = {
    baseUrl: savedConfig.baseUrl || '',
    apiKey: savedConfig.apiKey || '',
  }
})

const handleSave = async () => {
  try {
    // 保存时合并现有配置，但保留模型相关信息
    const currentConfig = await getConfig()
    await setConfig({
      ...currentConfig,
      baseUrl: config.value.baseUrl,
      apiKey: config.value.apiKey,
    })
    window.close()
  } catch (error) {
    console.error('Error saving config:', error)
  }
}

const handleFetchModels = async () => {
  try {
    await fetchModels()
  } catch (error) {
    console.error('Error fetching models:', error)
    // 这里可以添加错误提示
  }
}

const handleOpenSidebar = async () => {
  try {
    await openSidebar();
    window.close();
  } catch (error) {
    console.error('Error opening sidebar:', error);
  }
};
</script>

<style scoped>
.popup-container {
  padding: 1rem;
  min-width: 300px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.actions {
  margin-top: 1rem;
  text-align: right;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

button {
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.fetch-button {
  margin-top: 0.5rem;
  width: 100%;
  background: #2196F3;
}

.fetch-button:disabled {
  background: #ccc;
}

.model-count {
  margin-top: 0.5rem;
  font-size: 0.9em;
  color: #666;
  text-align: center;
}

.sidebar-button {
  background: #9C27B0;
}

.sidebar-button:hover {
  background: #7B1FA2;
}
</style> 