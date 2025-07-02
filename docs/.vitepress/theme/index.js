// 1. 从 vitepress/theme 中导入默认主题
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

// 2. 导入我们的自定义 CSS 文件
import './style.css'

// 3. 导入背景切换组件
import BackgroundToggle from './components/BackgroundToggle.vue'

// 4. 导出一个新的主题配置，它继承了默认主题的所有东西
export default {
  ...DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 在导航栏右侧内容区域添加背景切换按钮
      'nav-bar-content-after': () => h(BackgroundToggle),
    })
  },
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('BackgroundToggle', BackgroundToggle)
  }
}