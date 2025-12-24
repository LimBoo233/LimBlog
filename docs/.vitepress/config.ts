import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { MermaidMarkdown, MermaidPlugin } from 'vitepress-plugin-mermaid';


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
        math: true, // 启用数学公式支持
         theme: {
            dark: 'material-theme-ocean',    
            light: 'catppuccin-latte' 
        },

        // This is your existing plugin for code group icons
        config: (md) => {
        md.use(groupIconMdPlugin);
        md.use(MermaidMarkdown);


        // 自动在 h1 标签后添加表头组件
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
                    lua: `catppuccin:lua`,
                    cpp: `catppuccin:cpp`,
                    go: `catppuccin:go`,
                    bash: `catppuccin:bash`,
                    xml: `catppuccin:xml`,
                    kotlin: `catppuccin:kotlin`,
                    scala: `catppuccin:scala`,
                    // https://icon-sets.iconify.design/
                    }
            }),
            MermaidPlugin(),
        ],
        optimizeDeps: { // include mermaid
            include: ['mermaid'],
        },
        ssr: {
            noExternal: ['mermaid'],
        },
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
                text: 'Unity', 
                items: [
                    {
                        text: 'Unity主要内容',
                        items: [
                            { text: 'Unity-入门', link: '/notes/Unity/Unity主要内容/Unity-入门' },
                            { text: 'Unity-GUI', link: '/notes/Unity/Unity主要内容/Unity-GUI' },
                            { text: 'Unity-基础', link: '/notes/Unity/Unity主要内容/Unity-基础' },
                            { text: '数据持久化之-Json', link: '/notes/Unity/Unity主要内容/数据持久化-Json' },
                            { text: 'Untiy-UGUI', link: '/notes/Unity/Unity主要内容/Unity-UGUI' },
                            { text: 'Untiy-核心-2D', link: '/notes/Unity/Unity主要内容/Unity-核心-2D' },
                            { text: 'Untiy-核心-动画', link: '/notes/Unity/Unity主要内容/Unity-核心-动画' },
                            { text: 'AI Navigation文档翻译', link: '/notes/Unity/Unity主要内容/AI Navigation文档翻译'},
                            { text: 'Tilemap', link: '/notes/Unity/Unity主要内容/Tilemap' },
                            { text: '2D PSD Importer', link: '/notes/Unity/Unity主要内容/2D PSD Importer' },
                            { text: 'Unity-AI Navigation', link: '/notes/Unity/Unity主要内容/Unity-AI Navigation' },
                            { text: 'Unity-InputSystem', link: '/notes/Unity/Unity主要内容/Unity-InputSystem' },
                        ],
                        collapsed: true
                    },
                    {
                        text: '其他',
                        items: [
                            { text: 'Unity小技巧', link: '/notes/Unity/其他/Unity小技巧' },
                            { text: 'AudioMixer', link: '/notes/Unity/其他/AudioMixer' },
                        ],
                        collapsed: true
                    },
                    {
                        text: 'Unity高级',
                        items: [
                            { text: 'UniTask', link: '/notes/Unity/Unity高级/UniTask' },
                        ],
                        collapsed: true
                    },
                    
                ],
                collapsed: true
            },

            { 
                text: 'CSharp', 
                items: [
                    { text: 'CSharp技巧', link: '/notes/CSharp/CSharp技巧' },
                    { text: 'Newtonsoft Json', link: '/notes/CSharp/Newtonsoft Json' },
                    { text: '多线程', link: '/notes/CSharp/多线程' },
                    { text: '异步编程', link: '/notes/CSharp/异步编程' },
                ],
                collapsed: true
            },

            { 
                text: '图形学', 
                items: [
                    {
                        text: 'Games101',
                        items: [
                            { text: 'Lec_1 Overview', link: 'notes/图形学/Games101/Lec_1' },

                        ]
                    }
                ]
            },

            { 
                text: '其他', 
                items: [
                    { text:  '北工大web', link: '/notes/其他/北工大web'},
                    { text: '北工大安卓开发', link: '/notes/其他/北工大安卓开发'},
                    { text: '北工大图形学', link: '/notes/其他/北工大图形学'},
                    { text: '北工大图形学-期中后', link: '/notes/其他/北工大图形学-期中后'},
                    { text: '北工大Scala', link: '/notes/其他/北工大Scala'},
                    { text: '北工大分布式简略版', link: '/notes/其他/北工大分布式简略版'},
                    { text: `Markdown快速指南`, link: '/notes/其他/Markdown快速指南'},
                ],
                collapsed: true
            },

           

        ],

        // 本地搜索功能
        search: {
            provider: 'local'
        },
        
    },

    sitemap: {
        hostname: 'https://lim-blog-rho.vercel.app'
    },

})