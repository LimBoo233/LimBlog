import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
    title: "LimBoo233的笔记空间", // 你的网站标题
    description: "保留自己的智慧", // 你的网站描述

    // -- 主题配置 --
    themeConfig: {
        // 顶部导航栏
        nav: [
            { text: '首页', link: '/' },
            { text: '引导', link: '/notes/introduction' } 
        ],

        outline: {
            level: 'deep',
            label: '本页目录' 
        },

        // 侧边栏
        sidebar: [
            { 
                text: 'Unity学习', 
                items: [
                    {
                        text: '唐老师课程',
                        items: [
                            { text: 'Unity入门', link: '/notes/Unity入门' }
                        ]
                    }
                ]
            }
        ],

    }
})