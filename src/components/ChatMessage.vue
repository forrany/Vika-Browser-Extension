<template>
  <div 
    class="message"
    :class="{ 
      'user-message': message.isUser,
      'ai-message': !message.isUser 
    }"
  >
    {{ message.content }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.message {
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
}

.user-message {
  background: #e3f2fd;
  margin-left: 20px;
}

.ai-message {
  background: #f5f5f5;
  margin-right: 20px;
}
</style> 