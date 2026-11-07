import { reactive } from 'vue'

export const defaultCodeFonts = 'JetBrains Mono, Fira Code, Consolas, Monaco, Courier New, monospace'
const defaults = () => ({
  families: { serif: '', sans: '' },
  targets: { body: 'sans', heading: 'serif' },
  codeFamily: defaultCodeFonts
})
export const fontSettings = reactive(defaults())
export const fontCategories = [
  { id: 'serif', label: '衬线字体' },
  { id: 'sans', label: '非衬线字体' },
  { id: 'system', label: '系统字体' }
]
export const customFontCategories = fontCategories.filter(category => category.id !== 'system')
const fallbacks = {
  serif: 'Georgia, "Noto Serif SC", "Songti SC", SimSun, serif',
  sans: 'Arial, "Noto Sans SC", "Microsoft YaHei", sans-serif',
  system: 'system-ui, -apple-system, "Segoe UI", sans-serif'
}
const key = 'limblog-font-settings'
const genericFonts = new Set(['serif', 'sans-serif', 'system-ui', 'ui-monospace', 'monospace'])

export function fontList(category) {
  return fontSettings.families[category] || fallbacks[category]
}

function customFontList(value) {
  return value
    .split(/[,，]/)
    .map(part => part.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
    .map(part => genericFonts.has(part) ? part : JSON.stringify(part))
    .join(', ')
}

function applyFonts() {
  for (const [target, category] of Object.entries(fontSettings.targets)) {
    const name = customFontList(fontSettings.families[category] || '')
    const fallback = fallbacks[category]
    document.documentElement.style.setProperty(`--reader-font-${target}`, `${name ? name + ', ' : ''}${fallback}`)
  }
  const code = customFontList(fontSettings.codeFamily) || customFontList(defaultCodeFonts)
  document.documentElement.style.setProperty('--reader-font-code', code.endsWith('monospace') ? code : `${code}, monospace`)
}

export function saveFonts() {
  applyFonts()
  try {
    localStorage.setItem(key, JSON.stringify(fontSettings))
  } catch {
    // Settings still apply for this visit.
  }
}

export function loadFonts() {
  try {
    const saved = JSON.parse(localStorage.getItem(key))
    if (typeof saved?.codeFamily === 'string' && saved.codeFamily.trim()) {
      fontSettings.codeFamily = saved.codeFamily.slice(0, 150)
    }
    for (const category of customFontCategories) {
      const family = saved?.families?.[category.id]
      if (typeof family === 'string') fontSettings.families[category.id] = family.slice(0, 150)
    }
    for (const target of Object.keys(fontSettings.targets)) {
      const category = saved?.targets?.[target]
      if (fontCategories.some(option => option.id === category)) fontSettings.targets[target] = category
    }
  } catch {
    // Use defaults if storage is unavailable or invalid.
  }
  applyFonts()
}

export function resetFonts() {
  Object.assign(fontSettings, defaults())
  saveFonts()
}
