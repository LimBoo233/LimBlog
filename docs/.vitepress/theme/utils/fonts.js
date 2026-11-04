import { reactive } from 'vue'

export const defaultCodeFonts = 'JetBrains Mono, Fira Code, Consolas, Monaco, Courier New, monospace'
const defaults = () => ({ families: { serif: '', sans: '' }, targets: { body: 'sans', heading: 'serif' }, codeFamily: defaultCodeFonts })
export const fontSettings = reactive(defaults())
export const fontCategories = [{ id: 'serif', label: '衬线字体' }, { id: 'sans', label: '非衬线字体' }, { id: 'system', label: '系统字体' }]
export const customFontCategories = fontCategories.filter(category => category.id !== 'system')
const fallbacks = {
  serif: 'Georgia, "Noto Serif SC", "Songti SC", SimSun, serif',
  sans: 'Arial, "Noto Sans SC", "Microsoft YaHei", sans-serif',
  system: 'system-ui, -apple-system, "Segoe UI", sans-serif'
}
const key = 'limblog-font-settings'

export function fontList(category) {
  return fontSettings.families[category] || fallbacks[category]
}

function customFontList(value) {
  const generic = new Set(['serif', 'sans-serif', 'system-ui', 'ui-monospace', 'monospace'])
  return value.split(/[,，]/).map(part => part.trim().replace(/^["']|["']$/g, '')).filter(Boolean).map(part => generic.has(part) ? part : JSON.stringify(part)).join(', ')
}

export function applyFonts() {
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
  try { localStorage.setItem(key, JSON.stringify(fontSettings)) } catch { /* Settings still apply for this visit. */ }
}

export function loadFonts() {
  try {
    const saved = JSON.parse(localStorage.getItem(key))
    if (typeof saved?.codeFamily === 'string' && saved.codeFamily.trim()) fontSettings.codeFamily = saved.codeFamily.slice(0, 150)
    for (const category of customFontCategories) {
      if (typeof saved?.families?.[category.id] === 'string') fontSettings.families[category.id] = saved.families[category.id].slice(0, 150)
    }
    for (const target of ['body', 'heading']) {
      if (fontCategories.some(c => c.id === saved?.targets?.[target])) fontSettings.targets[target] = saved.targets[target]
    }
  } catch { /* Use defaults if storage is unavailable or invalid. */ }
  applyFonts()
}

export function resetFonts() {
  Object.assign(fontSettings, defaults())
  saveFonts()
}
