#!/usr/bin/env node

/**
 * VitePress 侧边栏自动生成脚本
 * 根据 docs/notes 目录结构生成侧边栏配置
 * 
 * 使用方式: node scripts/generate-sidebar.cjs
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

/**
 * 获取文件的标题（从文件名或frontmatter中提取）
 */
function getTitle(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        // 尝试从frontmatter中提取title
        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            const titleMatch = frontmatter.match(/title\s*:\s*['"](.*?)['"]|title\s*:\s*(.+)/);
            if (titleMatch) {
                return titleMatch[1] || titleMatch[2];
            }
        }
    } catch (e) {
        // 忽略读取错误
    }

    // 使用文件名作为标题，去掉 .md 扩展名和数字前缀
    const fileName = path.basename(filePath, '.md');
    return fileName.replace(/^\d+\.\s*/, '').replace(/^\d+_/, '');
}

/**
 * 获取链接路径（相对于 /docs）
 */
function getLink(filePath) {
    const relativePath = path.relative(DOCS_ROOT, filePath);
    // 转换为 URL 路径格式
    let link = '/' + relativePath.replace(/\\/g, '/').replace(/\.md$/, '');
    // 处理 index 文件
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
 * 递归扫描目录并生成侧边栏结构
 */
function scanDirectory(dirPath, basePath = '') {
    const items = [];

    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        // 分离文件夹和文件
        const folders = [];
        const files = [];

        for (const entry of entries) {
            // 忽略隐藏文件和特定目录
            if (entry.name.startsWith('.') || entry.name === 'node_modules') {
                continue;
            }

            if (entry.isDirectory()) {
                folders.push(entry.name);
            } else if (entry.name.endsWith('.md')) {
                files.push(entry.name);
            }
        }

        // 处理文件夹（递归）
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
            const children = scanDirectory(folderPath, path.join(basePath, folder));

            if (children.length > 0) {
                items.push({
                    text: folder,
                    collapsed: true,
                    items: children,
                });
            }
        }

        // 处理文件
        files.sort((a, b) => {
            // 提取数字前缀用于排序
            const numA = parseInt(a.match(/^\d+/)?.[0] || '999');
            const numB = parseInt(b.match(/^\d+/)?.[0] || '999');
            if (numA !== numB) {
                return numA - numB;
            }
            return a.localeCompare(b, 'zh-CN');
        });

        for (const file of files) {
            if (file !== 'index.md') {  // 跳过 index 文件
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

    // 生成 TypeScript 配置文件
    const content = `/**
 * 自动生成的侧边栏配置
 * 由 scripts/generate-sidebar.cjs 生成
 * 不要手动编辑此文件
 * 
 * 生成时间: ${new Date().toISOString()}
 */

export const sidebar = ${JSON.stringify(sidebar, null, 2)};
`;

    // 确保目录存在
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 写入文件
    fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');
    console.log(`✓ 侧边栏配置已生成: ${OUTPUT_PATH}`);
    console.log(`✓ 共生成 ${countItems(sidebar)} 项`);
}

/**
 * 计算总项数
 */
function countItems(items) {
    let count = 0;
    for (const item of items) {
        count++;
        if (item.items) {
            count += countItems(item.items);
        }
    }
    return count;
}

/**
 * 主函数
 */
function main() {
    console.log('🚀 开始生成 VitePress 侧边栏配置...\n');

    if (!fs.existsSync(NOTES_PATH)) {
        console.error(`✗ 错误: ${NOTES_PATH} 目录不存在`);
        process.exit(1);
    }

    try {
        generateSidebarConfig();
        console.log('\n✅ 侧边栏配置生成成功！');
    } catch (error) {
        console.error('\n✗ 生成失败:', error.message);
        process.exit(1);
    }
}

main();
