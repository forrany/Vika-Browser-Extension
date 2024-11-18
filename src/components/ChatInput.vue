<template>
  <div class="chat-input">
    <textarea
      v-model="localValue"
      placeholder="输入消息..."
      @keypress.enter.prevent="handleEnter"
    />
    <button @click="handleClick">{{ buttonText }}</button>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useChat } from '../composables/useChat'

const { isResponding, stopResponse } = useChat()

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'send'])

const localValue = ref(props.modelValue)

const buttonText = computed(() => {
  return isResponding.value ? '停止生成' : '发送'
})

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

const handleClick = () => {
  if (isResponding.value) {
    stopResponse()
  } else {
    handleSend()
  }
}

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