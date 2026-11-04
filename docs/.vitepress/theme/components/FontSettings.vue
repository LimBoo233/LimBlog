<script setup>
import CodePreview from './code-preview.md'
import { fontSettings, fontCategories, customFontCategories, defaultCodeFonts, fontList, saveFonts, resetFonts } from '../utils/fonts'
function chooseFont(target, category) {
  fontSettings.targets[target] = category
  saveFonts()
}
const targets = [{ id: 'body', label: '正文' }, { id: 'heading', label: '标题' }]
</script>

<template>
  <div class="font-workbench">
  <div class="font-settings">
    <section class="appearance-settings" aria-label="主题配色">
      <h3 class="control-title">主题配色</h3>
      <slot name="appearance" />
    </section>
    <div class="font-settings-heading"><h3 class="control-title">阅读字体</h3><span>自动保存</span></div>
    <p class="settings-note">为正文和标题找到各自的节奏。</p>
    <fieldset v-for="target in targets" :key="target.id">
      <legend>{{ target.label }}</legend>
      <div class="font-options">
        <button v-for="category in fontCategories" :key="category.id" type="button" :aria-pressed="fontSettings.targets[target.id] === category.id" @click="chooseFont(target.id, category.id)">{{ category.label }}</button>
      </div>
    </fieldset>
    <details>
      <summary>自定义字体</summary>
      <p>多个字体用逗号分隔，例如 Georgia, 思源宋体。浏览器按顺序选择可用字体，英文可放在中文字体之前。</p>
      <label v-for="category in customFontCategories" :key="category.id">
        <span>{{ category.label }}</span>
        <input :value="fontList(category.id)" maxlength="150" @input="fontSettings.families[category.id] = $event.target.value; saveFonts()" />
      </label>
      <div class="code-font-setting">
        <label for="lab-code-font">代码字体</label>
        <input id="lab-code-font" v-model="fontSettings.codeFamily" maxlength="150" :placeholder="defaultCodeFonts" aria-describedby="lab-code-font-help" @input="saveFonts" />
        <p class="settings-note" id="lab-code-font-help">默认使用项目原有的代码字体列表。可输入设备上已安装的字体，多个字体用逗号分隔；留空恢复默认。</p>
      </div>
    </details>
    <p class="settings-note">设置仅保存在当前浏览器。字体未安装时使用备用字体；系统字体由设备决定。</p>
    <button class="font-reset" type="button" @click="resetFonts">恢复默认字体 <span aria-hidden="true">↺</span></button>
  </div>
  <div class="font-preview-column">
    <div class="font-preview" aria-label="字体预览">
      <div class="preview-topline"><span>实时预览</span><span>随你的设置变化</span></div>
      <p class="preview-kicker">A SMALL MOMENT OF READING</p>
      <h3>文字之间，<br />留一点自己的节奏。</h3>
      <p>午后的光落在书页上，风从窗外轻轻经过。好的阅读体验，藏在每一个字的形状与间距里。</p>
      <p class="preview-english">Find a little room to think, explore, and make something your own.</p>
      <div class="preview-code"><div class="code-caption"><span>一小段代码</span><span>JavaScript</span></div>
        <div class="preview-highlight vp-doc"><CodePreview /></div>
      </div>
      <div class="preview-bottomline">中文 · English · Code</div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.font-workbench { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 48px; align-items: start; }
.font-settings { display: grid; gap: 20px; min-width: 0; }
p { color: var(--vp-c-text-2); line-height: 1.85; margin: 0; }
.control-title { font-size: 16px; font-weight: 650; margin: 0; }
.appearance-settings { padding-bottom: 24px; border-bottom: 1px solid var(--vp-c-divider); }
.appearance-settings :deep(.palette-wrapper) { align-items: flex-start; margin-top: 12px; }
.appearance-settings :deep(.palette-switch) { padding: 0; }
.font-settings-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.font-settings-heading span { color: var(--vp-c-brand-1); font-size: 12px; }
.settings-note { font-size: 13px; }
.code-font-setting { display: grid; gap: 10px; }
.code-font-setting label { margin: 0; font-size: 14px; font-weight: 600; }
fieldset { border: 0; padding: 0; min-width: 0; margin: 0; }
legend { font-size: 14px; font-weight: 600; margin-bottom: 10px; }
label { display: grid; gap: 6px; margin-top: 14px; font-size: 13px; }
input { width: 100%; min-width: 0; border: 1px solid var(--vp-c-divider); border-radius: 6px; padding: 10px 12px; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.font-options { display: flex; flex-wrap: wrap; gap: 4px; padding: 4px; border: 1px solid var(--vp-c-divider); border-radius: 9px; }
button { cursor: pointer; transition: background-color 0.2s, color 0.2s; }
.font-options button { flex: 1 1 90px; min-height: 40px; border-radius: 6px; padding: 8px; font-size: 13px; white-space: nowrap; color: var(--vp-c-text-2); }
.font-options button:hover { background: var(--vp-c-default-soft); }
.font-options button[aria-pressed="true"] { background: var(--vp-c-brand-soft); box-shadow: inset 0 0 0 1px var(--vp-c-brand-1); color: var(--vp-c-brand-1); font-weight: 600; }
input:focus-visible, button:focus-visible, summary:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
details { border-top: 1px solid var(--vp-c-divider); padding-top: 20px; }
summary { cursor: pointer; font-size: 14px; font-weight: 600; }
details[open] summary { margin-bottom: 12px; }
details p { font-size: 13px; }
.font-reset { justify-self: start; font-size: 13px; color: var(--vp-c-text-2); padding: 4px 0; }
.font-reset:hover { color: var(--vp-c-brand-1); }
.font-reset span { margin-left: 8px; }
.font-preview-column { min-width: 0; position: sticky; top: calc(var(--vp-nav-height) + 24px); }
.font-preview { padding: 28px; border: 1px solid var(--vp-c-brand-1); border-radius: 12px; background: var(--vp-c-bg); box-shadow: var(--shadow-sm); font-family: var(--reader-font-body); }
.preview-topline, .preview-bottomline, .code-caption { font-family: var(--vp-font-family-base); font-size: 12px; color: var(--vp-c-text-2); }
.preview-topline, .code-caption { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; }
.preview-topline { border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 16px; margin-bottom: 30px; }
.preview-topline > :first-child { color: var(--vp-c-brand-1); font-weight: 600; }
.preview-kicker { font-size: 10px; letter-spacing: 0.12em; color: var(--vp-c-text-3); }
.font-preview h3 { font-family: var(--reader-font-heading); font-size: clamp(24px, 2.5vw, 34px); line-height: 1.5; margin: 10px 0 20px; color: var(--vp-c-text-1); }
.preview-english { margin-top: 16px; }
.preview-code { margin-top: 24px; border: 1px solid var(--vp-c-divider); border-radius: 8px; overflow: hidden; background: var(--vp-code-block-bg, var(--vp-c-bg-alt)); }
.code-caption { padding: 10px 14px; border-bottom: 1px solid var(--vp-c-divider); }
.preview-highlight :deep(div[class*='language-']) { margin: 0; border-radius: 0; }
.preview-highlight :deep(pre) { overflow-x: auto; margin: 0; padding: 18px 14px; }
.preview-highlight :deep(code) { font-family: var(--reader-font-code, var(--vp-font-family-mono)); font-size: 13px; line-height: 1.8; padding: 0; }
.preview-highlight :deep(.lang) { display: none; }
.preview-bottomline { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--vp-c-divider); }
@media (max-width: 959px) {
  .font-workbench { grid-template-columns: minmax(0, 1fr); gap: 32px; }
  .font-preview-column { position: static; }
}
@media (max-width: 480px) {
  .font-preview { padding: 20px; }
  .preview-topline { margin-bottom: 24px; }
}
@media (prefers-reduced-motion: reduce) { button { transition: none; } }
</style>
