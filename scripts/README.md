# VitePress 侧边栏自动生成脚本

这个脚本会根据 `docs/notes` 目录结构自动生成 VitePress 侧边栏配置。

## 使用方式

### 方式 1：手动生成（推荐日常使用）
```bash
pnpm gen-sidebar
```

### 方式 2：监听模式（实时生成）
在编辑 markdown 文件时自动生成侧边栏配置：
```bash
pnpm gen-sidebar:watch
```

按 `Ctrl+C` 停止监听。

### 方式 3：直接运行脚本
```bash
node scripts/generate-sidebar.cjs
```

监听模式：
```bash
node scripts/generate-sidebar-watch.cjs
```

## 功能特性

- ✅ **自动扫描目录结构** - 根据 `docs/notes` 的目录组织自动生成侧边栏
- ✅ **智能排序** - 按照配置的优先级排序顶层文件夹，中文语言环境排序支持
- ✅ **数字前缀排序** - 文件名中的数字前缀自动用于排序（如 `1.基础.md` 会排在 `2.进阶.md` 之前）
- ✅ **Frontmatter 标题提取** - 优先从 markdown 的 frontmatter 中提取标题
- ✅ **自动折叠** - 默认生成的文件夹是折叠状态
- ✅ **跳过 index 文件** - 不会在侧边栏中显示 `index.md` 文件

## 配置项

在 `scripts/generate-sidebar.cjs` 中可以调整以下配置：

### SORT_PRIORITY 排序优先级
```javascript
const SORT_PRIORITY = [
    'Unity',
    'CSharp',
    '工具',
    '计算机网络',
    '图形学',
    '其他',
];
```

修改这个数组来改变顶层文件夹的显示顺序。

## 输出

脚本会在 `docs/.vitepress/sidebar-config.ts` 生成侧边栏配置文件。

示例输出：
```typescript
/**
 * 自动生成的侧边栏配置
 * 由 scripts/generate-sidebar.cjs 生成
 * 不要手动编辑此文件
 * 
 * 生成时间: 2026-04-10T08:19:12.701Z
 */

export const sidebar = [
  {
    text: "Unity",
    collapsed: true,
    items: [
      {
        text: "Unity主要内容",
        collapsed: true,
        items: [...]
      },
      ...
    ]
  },
  ...
];
```

## 文件命名建议

为了获得最佳的排序效果，建议使用以下命名规范：

- 使用数字前缀表示顺序: `1.基础.md`, `2.进阶.md`, `3.高级.md`
- 使用中文描述性名称: `设计模式.md`, `异步编程.md`
- 避免特殊符号，使用空格分隔单词

## Frontmatter 标题

在 markdown 文件中添加 frontmatter 来自定义侧边栏显示的标题：

```markdown
---
title: "自定义标题"
---

# 实际的文章标题

内容...
```

如果没有 frontmatter，脚本会使用文件名作为标题。

## 更新侧边栏

每次添加、删除或重命名文件后，运行以下命令来更新侧边栏配置：

```bash
pnpm gen-sidebar
```

然后重启开发服务器以看到更新：

```bash
pnpm dev
```
