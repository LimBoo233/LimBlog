// 1. 从 vitepress/theme 中导入默认主题
import DefaultTheme from 'vitepress/theme'

// 2. 导入我们的自定义 CSS 文件
import './style.css'

// 3. 导出一个新的主题配置，它继承了默认主题的所有东西
export default {
  ...DefaultTheme,
  // 在这里，我们未来可以覆盖或扩展默认主题的特定部分
  // 但现在，我们只需要加载自定义 CSS，所以这里保持原样即可
}