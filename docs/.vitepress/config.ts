import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { MermaidMarkdown, MermaidPlugin } from 'vitepress-plugin-mermaid';
// 引入侧边栏生成器
import { generateSidebar } from 'vitepress-sidebar';


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
            "url": "https://limboo233.top",
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
                    powershell: `catppuccin:powershell`,
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
                    macos: `catppuccin:macos`,
                    pacman: `catppuccin:folder-linux`,
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
            { text: 'Labs', link: '/Labs' }
        ],

        // markdown 右侧目录信息
        outline: {
            level: [2, 3],
            label: '页面导航'
        },

        
        // 本地搜索功能
        search: {
            provider: 'local'
        },

        // 侧边栏
        sidebar: generateSidebar({
            documentRootPath: '/docs',
            scanStartPath: '/notes',
            collapseDepth: 1,

            sortFolderTo: 'top',
            manualSortFileNameByPriority: [
                // 排序优先级
                // 直接在此处注册顶层的文件夹即可自动生成侧边栏
                'Unity',
                'CSharp',
                '工具',
                '图形学',
                `Unity主要内容`,
                `Unity高级`,
                '其他',
            ],
            sortMenusOrderNumericallyFromLink: true,
        }),
    },

    sitemap: {
        hostname: 'https://limboo233.top'
    },

})