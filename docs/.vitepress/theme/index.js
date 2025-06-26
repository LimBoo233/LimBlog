// 1. 从 vitepress/theme 中导入默认主题
import DefaultTheme from 'vitepress/theme'

import ThemeSwitcher from './ThemeSwitcher.vue' // 1. 导入主题切换组件
import BackToTop from './BackToTop.vue' // 2. 导入返回顶部组件
import { h } from 'vue'

// 2. 导入我们的自定义 CSS 文件
import './style.css'

// 3. 导出一个新的主题配置，它继承了默认主题的所有东西
export default {
  ...DefaultTheme,
  // 在这里，我们未来可以覆盖或扩展默认主题的特定部分
  // 但现在，我们只需要加载自定义 CSS，所以这里保持原样即可

  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 这会将组件添加到导航栏搜索框的后面
      // 如果你希望在其他位置，可以查阅 VitePress 官方文档的 "Layout Slots"
      'nav-bar-content-after': () => h(ThemeSwitcher),
      // 在布局底部添加返回顶部按钮
      'layout-bottom': () => h(BackToTop),
    })
  },

  markdown: {
    // 启用代码行号
    lineNumbers: true,
  },


}