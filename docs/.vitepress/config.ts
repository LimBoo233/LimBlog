import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'


// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
    title: "LimBoo233的笔记空间", // 你的网站标题
    description: "保留自己的智慧", // 你的网站描述
    lang: 'zh-CN', // 设置语言
   
    
    head: [
        ['link', { rel: 'icon', href: '/images/favicon2.PNG' }],
        
        // SEO 优化标签
        ['meta', { name: 'keywords', content: 'Unity, C#, 编程, 游戏开发, 笔记, 学习, LimBoo233' }],
        ['meta', { name: 'author', content: 'LimBoo233' }],
        ['meta', { name: 'robots', content: 'index, follow' }],
    
        // 结构化数据
        ['script', { type: 'application/ld+json' }, JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "LimBoo233的笔记空间",
            "description": "保留自己的智慧 - Unity、C#、游戏开发学习笔记",
            "url": "https://lim-blog-rho.vercel.app",
            "author": {
                "@type": "Person",
                "name": "LimBoo233"
            },
            "inLanguage": "zh-CN"
        })],
    ],

    lastUpdated: true, // 启用最后更新时间

    markdown: {
        lineNumbers: true, // 显示行号
        config: (md) => {
        // This is your existing plugin for code group icons
        md.use(groupIconMdPlugin);

        // 👇 Now, add the new rule for headings right here
        md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
            // First, get the default rendered HTML (e.g., "</h1>")
            let htmlResult = slf.renderToken(tokens, idx, options);
            
            // Then, if it's an h1 tag, append your component
            if (tokens[idx].tag === 'h1') {
            htmlResult += `<ArticleMetadata />`;
            }
            
            // Finally, return the combined HTML
            return htmlResult;
        };
        },
    },
    vite: {
        plugins: [
            groupIconVitePlugin({
                customIcon: {
                    cs: 'vscode-icons:file-type-csharp',
                    java: 'vscode-icons:file-type-java',
                    powershell: `vscode-icons:file-type-powershell`,
                    json: `catppuccin:json`,
                    markdown: `catppuccin:markdown`,
                    py: `catppuccin:python`,
                    lua: `vscode-icons:file-type-lua`,
                    // https://icon-sets.iconify.design/
        }
            })
        ],
    },


    // -- 主题配置 --
    themeConfig: {
        // logo
        logo: '/images/favicon.PNG',

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
                        text: 'Unity主要内容',
                        items: [
                            { text: 'Unity入门', link: '/notes/Unity/Unity入门' },
                            { text: 'Unity-GUI', link: '/notes/Unity/Unity-GUI' },
                            { text: 'Unity基础', link: '/notes/Unity/Unity基础' },
                            { text: '数据持久化之-Json', link: '/notes/Unity/数据持久化-Json' },
                            { text: 'Untiy-UGUI', link: '/notes/Unity/Unity-UGUI' },
                            { text: 'Untiy核心', link: '/notes/Unity/Unity核心' }
                        ]
                    }
                ]
            },

            { 
                text: 'CSharp', 
                items: [
                    { text: 'Newtonsoft Json', link: '/notes/CSharp/Newtonsoft Json' },
                    { text: '多线程', link: '/notes/CSharp/多线程' },
                    { text: '异步编程', link: '/notes/CSharp/异步编程' },
                ]
            },


            {text: `Markdown快速指南`, link: '/notes/MyMarkdown/Markdown快速指南'},

        ],

        // 本地搜索功能
        search: {
            provider: 'local'
        },
        
    },

    sitemap: {
        hostname: 'https://lim-blog-rho.vercel.app'
    }
})