import DefaultTheme from 'vitepress/theme'
import './style.css'
import { h } from 'vue'

import BackgroundToggle from './components/BackgroundToggle.vue'
import ArticleMetadata from "./components/ArticleMetadata.vue"

// 插件
import 'virtual:group-icons.css'
// 引入评论插件
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';


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
    app.component('BackgroundToggle', BackgroundToggle),
    app.component('ArticleMetadata' , ArticleMetadata)
  
  },
  setup() {
    // Get frontmatter and route
    const { frontmatter } = useData();
    const route = useRoute();
      
    // giscus配置
    // https://giscus.app/zh-CN
    giscusTalk({
      repo: 'LimBoo233/LimBlog', //仓库
      repoId: 'R_kgDOPABz2Q', //仓库ID
      category: 'General', // 讨论分类
      categoryId: 'DIC_kwDOPABz2c4CtCvy', //讨论分类ID
      mapping: 'pathname',
      inputPosition: 'bottom',
      lang: 'zh-CN',
      }, 
      {
        frontmatter, route
      },
      //默认值为true，表示已启用，此参数可以忽略；
      //如果为false，则表示未启用
      //您可以使用“comment:true”序言在页面上单独启用它
      true
    );
  }

}