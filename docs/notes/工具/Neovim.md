# Neovim

## 前置

你得有有个好看的终端模拟器吧，然后你得会科学上网吧，再然后，你需要有一个支持图标的字体。使用命令行安装字体是一个很方便的做法。

字体安利：
- CaskaydiaCove Nerd Font
- FiraCode Nerd Font
- JetBrains Mono Nerd Font

其次你的电脑里需要有一个 C 编译器，Ripgrep(rg) 和 Fd(fd)。

安装示例：
- Ripgrep：`winget install BurntSushi.ripgrep.MSVC`
- Fd：`winget install sharkdp.fd`

## 安装

从 [Neovim 官网](https://neovim.io/)安装，里面有各个系统的安装方法。

ex：

::: code-group

```powershell [Windows WinGet.powershell]
winget install Neovim.Neovim
```

```bash [Homebrew.macOS]
brew install neovim
```

```bash [Pacman.linux]
sudo pacman -S neovim
```

:::

## LazyVim 安装

[LazyVim](https://www.lazyvim.org/) 是目前最流行的 Neovim 配置方案，特点是开箱即用。它把基础功能——代码补全、文件树、语法高亮、Git 集成全都配置好了，甚至还有键位提示，对新手友好。

安装方法参考官网，也是通过命令行，非常简单。

**问题：输入 nvim 卡在安装的界面，显示 Task(3/33) 或 Task(0/30)**

检查一下 Working 是不是显示一个比较大的数字（ex：30），如果是的话，应该是因为同时下载大量插件导致通道阻塞。

解决方法：修改配置文件（`~\AppData\Local\nvim\lua\config\lazy.lua`），在 `require("lazy").setup{}` 中添加一行代码以限制同时下载插件的数量：

```lua
require("lazy").setup({

  spec = {
    -- ...
  },
  -- ...
})
```

再回到 Neovim 中，应该就可以重新下载了。之后你可以考虑再将 `concurrency` 的数值调大一些，比如 4，以加快下载速度。

**问题：假下载**

进入 Neovim 后，有的插件报错。有可能是 Git 因为代理问题，虽然提示下载成功，但实际上下载回来的是一些空的文件夹，或者是包含了 HTML 报错代码的文本文件，而不是真正的 Lua 代码。你需要去对应的文件目录检查（`~\AppData\Local\nvim-data\lazy`）。如果目录里空或只有 `.git` 文件夹，则表示下载错误，你可以直接手动删除，下次进入 Neovim 时会重新下载。

**问题：Mason 插件报错**

输入 `:Mason` 进入图形化界面，如果发现部分包报错，可以回到命令行，使用 `npm install -g <package-name>` 手动安装对应的包。

## 简单的命令

> 在 LazyVim 里，Normal 模式按下 `Space` 键会弹出一个命令面板，会弹出一个菜单，列举出功能的快捷键。

1. 模式切换
    - `i`：进入 Insert 模式
    - `Esc`：进入 Normal 模式

由于 `Esc` 按起来很不方便，推荐改建，前往 `~\AppData\Local\nvim\lua\config\keymaps.lua`，添加以下代码：

```lua
-- 插入模式下，按 jk 快速退出
vim.keymap.set("i", "jk", "<Esc>")

-- 或者：插入模式下，按下 CapsLock 键退出插入模式
vim.keymap.set("i", "<CapsLock>", "<Esc>")
```

2. 简单移动
	- 基础移动
        - `h`：左移
        - `j`：下移
        - `k`：上移
        - `l`：右移
        - 前面可以加数字，表示移动的步数，比如 `5j` 表示下移 5 行
    - 半页
        - `Ctrl + d`：下移半页
        - `Ctrl + u`：上移半页
    - 全页
        - `gg`：移动到文件顶部
        - `G`：移动到文件底部
    - 行
        - `0`：移动到行首
        - `$`：移动到行尾
    - 段落
        - `{`：移动到上一个段落开头
        - `}`：移动到下一个段落开头
    - 单词
        - `w`：移动到下一个单词开头
        - `b`：移动到上一个单词开头
        - `e`：移动到当前/下一个单词结尾

3. 保存与退出——需要在 Normal 模式。

| 效果 | 命令 |
| --- | --- |
| 保存 | `:w` |
| 退出 | `:q` |
| 保存并退出 | `:wq` |
| 强制退出不保存 | `:q!` |

4. 文件树操作
    - 打开/关闭文件树：`Space + e`
    - 文件操作
        - 移动：用 `j` 和 `k` 上下移动
        - 打开/展开：`l` 或 `Enter`
        - 收起：`h`
        - 新建文件/删除：`a` / `d`，对应 add 和 delete
    - 切换焦点：先按 `Ctrl + w`，再按 `hjkl` 切换焦点

## Flash.nvim

Flash.nvim 的功能很像 Ace Jump，可以快速跳转到某个字符处。

- 单词跳转：`s`

    然后输入你想跳转的字符，屏幕上会显示该字符所在位置的快捷键，按下对应的快捷键即可跳转。

- 代码块跳转：`S`

    搜素高亮选区，会自动把整个函数、整个 if 块、整个类圈出来给你选。

- 远程制导：`d + s`

    直接远程删掉一个单词。