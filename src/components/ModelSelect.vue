<template>
  <div class="model-select">
    <input
      type="text"
      v-model="searchQuery"
      placeholder="搜索模型..."
      class="search-input"
      @input="handleSearch"
    >
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :disabled="!models.length"
    >
      <option v-if="!models.length" value="">加载中...</option>
      <option
        v-for="model in filteredModels"
        :key="model.id"
        :value="model.id"
      >
        {{ model.id }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: String,
  models: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const searchQuery = ref('')

const filteredModels = computed(() => {
  if (!searchQuery.value) return props.models
  const query = searchQuery.value.toLowerCase()
  return props.models.filter(model => 
    model.id.toLowerCase().includes(query)
  )
})

let debounceTimer
const handleSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', searchQuery.value)
  }, 300)
}
</script>

<style scoped>
.model-select {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.search-input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
}

select {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style> 