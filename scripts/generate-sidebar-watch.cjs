#!/usr/bin/env node

/**
 * VitePress 侧边栏自动生成脚本（监听模式）
 * 监听 docs/notes 目录变化，自动生成侧边栏配置
 * 
 * 使用方式: node scripts/generate-sidebar-watch.cjs
 */

const fs = require('fs');
const path = require('path');

// 配置项
const DOCS_ROOT = path.join(__dirname, '../docs');
const NOTES_PATH = path.join(DOCS_ROOT, 'notes');
const OUTPUT_PATH = path.join(__dirname, '../docs/.vitepress/sidebar-config.ts');

// 排序优先级（顶层文件夹）
const SORT_PRIORITY = [
    'Unity',
    'CSharp',
    '工具',
    '计算机网络',
    '图形学',
    '其他',
];

let debounceTimer;

/**
 * 获取文件的标题
 */
function getTitle(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            const titleMatch = frontmatter.match(/title\s*:\s*['"](.*?)['"]|title\s*:\s*(.+)/);
            if (titleMatch) {
                return titleMatch[1] || titleMatch[2];
            }
        }
    } catch (e) {
        // 忽略
    }

    const fileName = path.basename(filePath, '.md');
    return fileName.replace(/^\d+\.\s*/, '').replace(/^\d+_/, '');
}

/**
 * 获取链接路径
 */
function getLink(filePath) {
    const relativePath = path.relative(DOCS_ROOT, filePath);
    let link = '/' + relativePath.replace(/\\/g, '/').replace(/\.md$/, '');
    if (link.endsWith('/index')) {
        link = link.slice(0, -6);
    }
    return link;
}

/**
 * 获取排序优先级
 */
function getSortPriority(name) {
    const index = SORT_PRIORITY.indexOf(name);
    return index === -1 ? SORT_PRIORITY.length : index;
}

/**
 * 递归扫描目录
 */
function scanDirectory(dirPath) {
    const items = [];

    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        const folders = [];
        const files = [];

        for (const entry of entries) {
            if (entry.name.startsWith('.') || entry.name === 'node_modules') {
                continue;
            }

            if (entry.isDirectory()) {
                folders.push(entry.name);
            } else if (entry.name.endsWith('.md')) {
                files.push(entry.name);
            }
        }

        folders.sort((a, b) => {
            const priorityA = getSortPriority(a);
            const priorityB = getSortPriority(b);
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            return a.localeCompare(b, 'zh-CN');
        });

        for (const folder of folders) {
            const folderPath = path.join(dirPath, folder);
            const children = scanDirectory(folderPath);

            if (children.length > 0) {
                items.push({
                    text: folder,
                    collapsed: true,
                    items: children,
                });
            }
        }

        files.sort((a, b) => {
            const numA = parseInt(a.match(/^\d+/)?.[0] || '999');
            const numB = parseInt(b.match(/^\d+/)?.[0] || '999');
            if (numA !== numB) {
                return numA - numB;
            }
            return a.localeCompare(b, 'zh-CN');
        });

        for (const file of files) {
            if (file !== 'index.md') {
                const filePath = path.join(dirPath, file);
                const link = getLink(filePath);
                const title = getTitle(filePath);

                items.push({
                    text: title,
                    link: link,
                });
            }
        }
    } catch (error) {
        console.error(`错误：无法读取目录 ${dirPath}`, error.message);
    }

    return items;
}

/**
 * 生成侧边栏配置
 */
function generateSidebarConfig() {
    const sidebar = scanDirectory(NOTES_PATH);

    const content = `/**
 * 自动生成的侧边栏配置
 * 由 scripts/generate-sidebar-watch.cjs 生成
 * 不要手动编辑此文件
 * 
 * 生成时间: ${new Date().toISOString()}
 */

export const sidebar = ${JSON.stringify(sidebar, null, 2)};
`;

    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');

    const time = new Date().toLocaleTimeString('zh-CN');
    console.log(`[${time}] ✓ 侧边栏配置已更新`);
}

/**
 * 防抖生成
 */
function debouncedGenerate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        try {
            generateSidebarConfig();
        } catch (error) {
            console.error('生成失败:', error.message);
        }
    }, 500); // 500ms 防抖
}

/**
 * 监听文件变化
 */
function watchNotesDirectory() {
    console.log('👀 侧边栏自动生成监听启动...');
    console.log(`📁 监听目录: ${NOTES_PATH}\n`);

    try {
        fs.watch(NOTES_PATH, { recursive: true }, (eventType, filename) => {
            // 忽略 .DS_Store 等系统文件
            if (filename && !filename.startsWith('.')) {
                if (filename.endsWith('.md') || !filename.includes('.')) {
                    console.log(`📝 检测到变化: ${filename}`);
                    debouncedGenerate();
                }
            }
        });

        // 初始化生成一次
        generateSidebarConfig();
    } catch (error) {
        console.error('启动监听失败:', error.message);
        process.exit(1);
    }
}

/**
 * 主函数
 */
function main() {
    if (!fs.existsSync(NOTES_PATH)) {
        console.error(`✗ 错误: ${NOTES_PATH} 目录不存在`);
        process.exit(1);
    }

    watchNotesDirectory();

    // 优雅关闭
    process.on('SIGINT', () => {
        console.log('\n\n👋 侧边栏生成监听已停止');
        process.exit(0);
    });
}

main();
