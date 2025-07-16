import DefaultTheme from 'vitepress/theme'
import './style.css'
import { h } from 'vue'

import BackgroundToggle from './components/BackgroundToggle.vue'
import ArticleMetadata from "./components/ArticleMetadata.vue"
import GiscusComments from './components/GiscusComments.vue';

// 插件
import 'virtual:group-icons.css'

// 导出一个新的主题配置，它继承了默认主题的所有东西
export default {
  ...DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 在导航栏右侧内容区域添加背景切换按钮
      'nav-bar-content-after': () => h(BackgroundToggle),
      // 在页面底部添加Giscus评论组件
      'doc-after': () => h(GiscusComments),
    })
  },
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('BackgroundToggle', BackgroundToggle),
    app.component('ArticleMetadata' , ArticleMetadata)
  
  },

}