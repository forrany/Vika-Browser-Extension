<template>
  <div 
    class="message"
    :class="{ 
      'user-message': message.role === 'user',
      'ai-message': message.role === 'assistant' 
    }"
  >
    <div v-html="renderedContent" class="markdown-content"></div>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it';
import { full as emoji } from 'markdown-it-emoji'
import taskLists from 'markdown-it-task-lists';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { computed } from 'vue';

// 创建 markdown-it 实例并配置选项
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return '';
  }
});

// 使用插件
md.use(emoji)
  .use(taskLists);

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
});

// 使用 markdown-it 渲染内容
const renderedContent = computed(() => {
  return md.render(props.message.content);
});
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

.stop-btn {
  padding: 4px 8px;
  border-radius: 4px;
  background: #ff4444;
  color: white;
  border: none;
  cursor: pointer;
}

.stop-btn:hover {
  background: #ee3333;
}

.markdown-content :deep(p) {
  margin: 0.5em 0;
}

.markdown-content :deep(pre) {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  border: 1px solid #e1e4e8;
  margin: 0.5em 0;
}

.markdown-content :deep(pre code) {
  padding: 0;
  font-size: 0.9em;
  line-height: 1.5;
}

.markdown-content :deep(:not(pre) > code) {
  font-family: monospace;
  background: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.9em;
  color: #e83e8c;
}

.markdown-content :deep(ul), 
.markdown-content :deep(ol) {
  padding-left: 20px;
}
</style> 