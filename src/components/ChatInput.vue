<template>
  <div class="chat-input">
    <textarea
      v-model="localValue"
      placeholder="输入消息..."
      @keypress.enter.prevent="handleEnter"
    />
    <button @click="handleSend">发送</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'send'])

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

const handleSend = () => {
  if (!localValue.value.trim()) return
  emit('send', localValue.value)
  localValue.value = ''
}

const handleEnter = (e) => {
  if (!e.shiftKey) {
    handleSend()
  }
}
</script>

<style scoped>
.chat-input {
  padding: 10px;
  border-top: 1px solid #eee;
}

textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 60px;
}

button {
  margin-top: 8px;
  padding: 6px 12px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #1976D2;
}
</style> 