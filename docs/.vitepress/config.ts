import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
    title: "LimBoo233的笔记空间", // 你的网站标题
    description: "保留自己的智慧", // 你的网站描述

    head: [
    // 第一个参数是标签名，第二个是该标签的属性
    // rel: 'icon' 表示这是一个 favicon
    // href: '/favicon.ico' 指向 public 文件夹下的 favicon.ico 文件
        // ['link', { rel: 'icon', href: '/images/favicon.PNG' }]
        ['link', { rel: 'icon', href: '/images/favicon2.PNG' }]
    ],

    // 设置默认为暗色主题，保留主题切换器
    appearance: 'dark',

    // Markdown 配置
    markdown: {
        // 启用代码行号
        lineNumbers: false,
    },

    // -- 主题配置 --
    themeConfig: {
        // 顶部导航栏
        nav: [
            { text: '首页', link: '/' },
            { text: '引导', link: '/notes/introduction' } 
        ],

        // markdown 右侧目录信息
        outline: {
            level: [2, 3],
            label: '页面导航'
        },

        // 侧边栏
        sidebar: [
            { 
                text: 'Unity学习', 
                items: [
                    {
                        text: '唐老师课程',
                        items: [
                            { text: 'Unity入门', link: '/notes/Unity/Unity入门' },
                            { text: 'Unity-GUI', link: '/notes/Unity/Unity-GUI' },
                            { text: 'Unity基础', link: '/notes/Unity/Unity基础' },
                            { text: '数据持久化之-Json', link: '/notes/Unity/数据持久化-Json' },
                            { text: 'Untiy-UGUI', link: '/notes/Unity/Unity-UGUI' }
                        ]
                    }
                ]
            },

            { 
                text: 'CSharp基础', 
                items: [
                    { text: '多线程', link: '/notes/CSharp基础/多线程' },
                    { text: '异步编程', link: '/notes/CSharp基础/异步编程' },
                ]
            },


            {text: `Markdown快速指南`, link: '/notes/MyMarkdown/Markdown快速指南'},

        ],

    }
})