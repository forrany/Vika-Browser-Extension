<template>
  <div class="ai-chat-sidebar">
    <ModelSelect 
      v-model="selectedModel"
      :models="models"
      @search="handleSearch"
    />
    <div class="chat-container" ref="chatContainer">
      <ChatMessage
        v-for="msg in messages"
        :key="msg.id"
        :message="msg"
      />
    </div>
    <ChatInput
      v-model="inputMessage"
      @send="sendMessage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ModelSelect from './ModelSelect.vue'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'
import { useModels } from '../composables/useModels'
import { useChat } from '../composables/useChat'

const { models, selectedModel, initModels } = useModels()
const { messages, sendMessage, inputMessage } = useChat()
const chatContainer = ref(null)

onMounted(async () => {
  await initModels()
})

const handleSearch = (searchTerm) => {
  // 模型搜索逻辑
}
</script>

<style scoped>
.ai-chat-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 5px rgba(0,0,0,0.1);
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
</style> 