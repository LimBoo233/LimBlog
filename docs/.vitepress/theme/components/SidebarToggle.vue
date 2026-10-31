<script setup>
import { onBeforeUnmount, ref } from 'vue'

const collapsed = ref(false)

function toggleSidebar() {
  collapsed.value = !collapsed.value
  document.documentElement.classList.toggle('desktop-sidebar-collapsed', collapsed.value)
}

onBeforeUnmount(() => {
  document.documentElement.classList.remove('desktop-sidebar-collapsed')
})
</script>

<template>
    <button
      class="desktop-sidebar-rail"
      type="button"
      aria-controls="VPSidebarNav"
      :aria-expanded="!collapsed"
      :aria-label="collapsed ? '展开目录' : '收起目录'"
      :title="collapsed ? '展开目录' : '收起目录'"
      @click="toggleSidebar"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M9 4v16" />
        <path :d="collapsed ? 'm13 9 3 3-3 3' : 'm16 9-3 3 3 3'" />
      </svg>
    </button>
</template>
