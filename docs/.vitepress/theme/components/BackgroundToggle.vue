<template>
  <button
    @click="toggleBackground"
    class="background-toggle"
    :class="{ 'bg-enabled': backgroundEnabled }"
    :title="backgroundEnabled ? '关闭背景图片' : '开启背景图片'"
    aria-label="切换背景图片"
  >
    <span class="toggle-icon">
      <Icon :icon="backgroundEnabled ? 'catppuccin:image' : 'catppuccin:unity'" />
    </span>
  </button>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'

// 背景图片开关状态
const backgroundEnabled = ref(true)

// 切换背景图片
function toggleBackground() {
  backgroundEnabled.value = !backgroundEnabled.value
  updateBodyClass()
  // 保存用户偏好到 localStorage
  localStorage.setItem('background-enabled', backgroundEnabled.value.toString())
}

// 更新 body 类名
function updateBodyClass() {
  const body = document.body
  if (backgroundEnabled.value) {
    body.classList.remove('no-background')
  } else {
    body.classList.add('no-background')
  }
}

// 监听状态变化
watch(backgroundEnabled, updateBodyClass)

// 组件挂载时恢复用户偏好
onMounted(() => {
  // 从 localStorage 读取用户偏好，默认开启
  const saved = localStorage.getItem('background-enabled')
  if (saved !== null) {
    backgroundEnabled.value = saved === 'true'
  }
  updateBodyClass()
})
</script>

<style scoped>
.background-toggle {
  /* 模仿 VitePress 导航栏按钮样式 */
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  background-color: transparent;
  color: var(--vp-c-text-1);
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  cursor: pointer;
  transition: all 0.25s;
  
  /* 确保在导航栏中对齐 */
  margin-left: 8px;
}

.background-toggle:hover {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.background-toggle.bg-enabled {
  background-color: transparent;
  color: var(--vp-c-brand-1);
}

.background-toggle.bg-enabled:hover {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-brand-1);
}

.toggle-icon {
  font-size: 16px;
  line-height: 1;
  user-select: none;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .background-toggle {
    width: 28px;
    height: 28px;
    margin-left: 4px;
  }
  
  .toggle-icon {
    font-size: 14px;
  }
}
</style>
