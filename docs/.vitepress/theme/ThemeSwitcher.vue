<script setup>
import { ref, watch, onMounted } from 'vue'

// 使用 ref 创建一个响应式变量来存储当前主题
// 初始值为 'dark'，默认使用暗色主题
const currentTheme = ref('dark')

// 定义所有可用的主题
const themes = [
  { key: 'dark', name: '默认(暗色)' },
  { key: 'light', name: '亮色' },
  { key: 'ocean', name: '海洋' },
]

// 更新主题的函数
function updateTheme(themeKey) {
  // 获取 <html> 元素
  const htmlEl = document.documentElement
  
  // 先移除所有可能的主题 class
  htmlEl.classList.remove('dark', 'theme-forest', 'theme-ocean')

  // 处理不同主题的逻辑
  if (themeKey === 'light') {
    // 亮色主题（现在是特殊情况）
    localStorage.setItem('vitepress-theme-appearance', 'auto')
  } else if (themeKey === 'ocean') {
    // 海洋主题：基于暗色主题
    htmlEl.classList.add('dark', 'theme-ocean')
    localStorage.setItem('vitepress-theme-appearance', 'dark')
  } else {
    // 默认暗色主题
    htmlEl.classList.add('dark')
    localStorage.setItem('vitepress-theme-appearance', 'dark')
  }

  // 更新当前主题的 ref
  currentTheme.value = themeKey
  // 将用户的选择保存到 localStorage
  localStorage.setItem('custom-theme-selection', themeKey)
}

// Vue 的 onMounted 生命周期钩子，在组件挂载到页面后执行
onMounted(() => {
  // 尝试从 localStorage 获取用户上次的选择，默认为暗色主题
  const savedTheme = localStorage.getItem('custom-theme-selection') || 'dark'
  updateTheme(savedTheme)
})

// 监听 currentTheme 的变化，当用户在下拉菜单中选择时触发
watch(currentTheme, (newTheme) => {
  updateTheme(newTheme)
})
</script>

<template>
  <div class="theme-switcher">
    <label for="theme-select" style="margin-right: 8px; font-size: 14px;">主题:</label>
    <select id="theme-select" v-model="currentTheme">
      <option v-for="theme in themes" :key="theme.key" :value="theme.key">
        {{ theme.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
/* 为下拉菜单添加一些简单样式 */
.theme-switcher {
  display: flex;
  align-items: center;
}
select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
}
</style>