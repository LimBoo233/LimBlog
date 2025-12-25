<template>
  <div class="palette-switch" role="group" aria-label="Color palette">
    <button
      type="button"
      :class="['palette-chip', { active: palette === 'default' }]"
      @click="setPalette('default')"
      :aria-pressed="palette === 'default'"
    >
      Default
    </button>
    <button
      type="button"
      :class="['palette-chip', { active: palette === 'nord' }]"
      @click="setPalette('nord')"
      :aria-pressed="palette === 'nord'"
    >
      Nord
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const storageKey = 'vp-color-palette'
const palette = ref('default')

const applyPalette = (value) => {
  const root = document.documentElement
  palette.value = value

  if (value === 'default') {
    root.removeAttribute('data-palette')
    localStorage.removeItem(storageKey)
  } else {
    root.setAttribute('data-palette', value)
    localStorage.setItem(storageKey, value)
  }
}

const setPalette = (value) => {
  if (value === palette.value) return
  applyPalette(value)
}

onMounted(() => {
  const saved = localStorage.getItem(storageKey)
  applyPalette(saved === 'nord' ? 'nord' : 'default')
})
</script>

<style scoped>
.palette-switch {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 4px 8px;
}

.palette-chip {
  border: 1px solid var(--vp-c-border, #d8dee9);
  background: transparent;
  color: inherit;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color var(--transition-base, 0.2s),
    color var(--transition-base, 0.2s),
    border-color var(--transition-base, 0.2s);
}

.palette-chip:hover {
  background-color: var(--vp-c-bg-soft, rgba(0, 0, 0, 0.04));
}

.palette-chip.active {
  background-color: var(--vp-c-brand-soft, rgba(136, 192, 208, 0.14));
  color: var(--vp-c-brand, #88c0d0);
  border-color: currentColor;
}
</style>
