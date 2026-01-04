# Codex 简易入门

## 安装

**前置**

安装图省事当然是使用 `npm` 了，确保你的电脑里有 [Node.js](https://nodejs.org/)。可以在终端使用 `node --version` 指令检查是否安装，正确显示版本号表示已安装。

ex:

```shell
C:\Users\Megumin>node --version
v22.16.0
```

**安装**

在你的终端输入：

::: code-group

```npm
npm install -g @openai/codex
```

```bash
brew install --cask codex
```

:::


等安装完成在终端输入 `codex` 指令就可以进入使用界面了~

顺便一提，指令 `/quit` 退出。

```shell
╭──────────────────────────────────────────────────╮
│ >_ OpenAI Codex (v0.77.0)                        │
│                                                  │
│ model:     gpt-5.2-codex high   /model to change │
│ directory: ~                                     │
╰──────────────────────────────────────────────────╯

  Tip: Start a fresh idea with /new; the previous session stays in history.


› 这里是你输入的地方: /quit 退出

  100% context left
```

## 选择模型

**指令：`/model`**

可以选择使用的模型，以及 Reasoning Level（推理水平）。

## 项目初始化

**指令：`/init`**

Codex 会通读当前目录下的项目，并自动生成 `AGENTS.md` 将相关信息总结其中，之后 AI 会把它作为上下文参考。

## 开启一段对话

- **开启新的对话：`/new`**

	新开对话，清除先前对话记录。你可以考虑在每次开启新任务时使用这个命令。

- **压缩对话上下文：`/compact`**

  自动压缩上下文，有助于 AI 更好地理解当前项目结构和需求，并且减少 Token 消耗。

- **撤回：`/undo`**

  撤回上一个更改。

- **恢复先前对话：`/resume`**

  当你重新开启 Codex 时，可以使用这个指令选择回复先前的对话。

## 运行权限

**指令：`/approvals`**

用于调整 AI 的修改权限，权限等级：

- Read Only：所有操作都需要批准
- Auto：只有敏感操作需要批准
- Full Access：无需批准，AI 可自由执行命令

## MCP

找到 codex 配置文件（ex: `C:\Users\Megumin\.codex\config.toml`），在里面填入你需要的 MCP server。当然也可以直接让 codex 代劳。

可以通过 `/mcp` 指令查看已有的 MCP 配置。

## 创建简单命令

找到 codex 安装目录下创建 `prompts` 文件夹，在其中创建 `.md` 文件并编写提示词，文件名即为命令名。

::: code-group

```markdown
---
description: 专门用于优化 Unity C# 脚本，关注内存和帧率
---

# Role
你是一位拥有 10 年经验的 Unity 引擎架构师，精通 Unity 6 和 C# 高级特性。

# Goal
分析用户提供的代码，并提供优化后的版本。

# Rules
1. **GC Alloc 零容忍**：严查 `Update` 循环中的 `new` 对象、字符串拼接、LINQ 使用。
2. **Unity API 检查**：
   - 检查是否使用了低效的 API (如 GameObject.Find)。
   - 推荐使用 Hash ID (Animator.StringToHash) 代替字符串比较。
3. **格式**：
   - 先指出 3 个最严重的性能问题。
   - 然后提供完整的、优化后的代码块。
   - 代码中必须包含中文注释解释优化原因。

# Context
用户正在开发一款高性能游戏，请以严苛的标准进行代码审查。
```

```markdown
---
name: refactor
description: 重构代码
arguments: 
  - name: lang
    required: true
  - name: code
    required: true
---

# Task
You are a {{lang}} expert. 
Please refactor the following code to follow best practices for {{lang}}:

```
