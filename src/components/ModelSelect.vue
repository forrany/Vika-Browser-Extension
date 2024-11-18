<template>
  <div class="model-select">
    <select
      :value="selectedModel"
      @change="handleModelChange"
      :disabled="loading"
    >
      <option v-if="loading" value="">加载中...</option>
      <template v-else>
        <option
          v-for="model in models"
          :key="model.id"
          :value="model.id"
        >
          {{ model.name }}
        </option>
      </template>
    </select>
  </div>
</template>

<script setup>
import { useModels } from '../composables/useModels'

const { models, selectedModel, loading, setSelectedModel } = useModels()

const handleModelChange = (event) => {
  setSelectedModel(event.target.value)
}
</script>

<style scoped>
.model-select {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

select:disabled {
  background: #f5f5f5;
}
</style> 