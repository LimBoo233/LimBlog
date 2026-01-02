import DefaultTheme from 'vitepress/theme'
import './style.css'
import { h, onMounted, watch, nextTick } from 'vue'

import BackgroundToggle from './components/BackgroundToggle.vue'
import ArticleMetadata from "./components/ArticleMetadata.vue"
import ThemePaletteSwitch from './components/ThemePaletteSwitch.vue'

// 插件
import 'virtual:group-icons.css'
// 图片放大插件
import mediumZoom from 'medium-zoom';
// 切换页面的进度条
import { NProgress } from 'nprogress-v2/dist/index.js' 
import 'nprogress-v2/dist/index.css' // 进度条样式
// 引入评论插件
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { inBrowser, useData, useRoute, useRouter } from 'vitepress';



export default {
  ...DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 在导航栏左侧内容区域添加调色板切换
      'nav-bar-content-before': () => h(ThemePaletteSwitch),
      // 在导航栏右侧内容区域添加背景切换按钮
      'nav-bar-content-after': () => h(BackgroundToggle),
    })
  },
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('BackgroundToggle', BackgroundToggle),
    app.component('ArticleMetadata' , ArticleMetadata)
    app.component('ThemePaletteSwitch', ThemePaletteSwitch)
  
  },

  setup() {
    // Get frontmatter and route
    const { frontmatter } = useData();
    const route = useRoute();
    const router = useRouter();

    // 图片放大功能
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );

    // 路由进度条与不蒜子统计
    if (inBrowser) {
      NProgress.configure({ showSpinner: false });
      router.onBeforeRouteChange = () => {
        NProgress.start();
      };
      router.onAfterRouteChanged = () => {
        // 若页面已加载不蒜子统计，则刷新数据
        if (window?.busuanzi?.fetch) {
          window.busuanzi.fetch();
        }
        NProgress.done();
      };
    }
      
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
  },
}

