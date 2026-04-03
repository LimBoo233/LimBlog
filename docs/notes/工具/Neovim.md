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

  concurrency = 1

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

非常好的互动式教学，也是我第一个完整看完的英文教程：[OpenVim](https://www.openvim.com/)

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
	- 快速跳转：`f + [任意字符]` 跳转到下一个该字符的出现处
	- 括号：`%` 在两个括号间跳转。
	- 同个单词间：`#` 前 `*` 后
	- 搜索单词
		- `/ + [单词]`
		- `n` / `N`：根据你的上个搜索结果，往后/往前跳转到这个单词。
    - 半页
        - `Ctrl + d`：下移半页
        - `Ctrl + u`：上移半页
    - 全页
        - `gg`：文件顶部
        - `G`：文件底部
        - `[数字] + G` / `:[数字]`：指定行
    - 行
        - `0`：行首
        - `$`：行尾
        - `^`：此行有内容的头部
        - `I`：此行内容的头部：同时进入 insert 模式
        - `A`：行尾，同时进入 insert 模式（可以用于行尾插入`;`）
        - `f` / `F` + `[字母]`：同行找对应字母移动，`;` / `,`上/下
        - `g_`：跳转到行尾的最后一个非空字符。
    - 段落
        - `{`：移动到上一个段落开头
        - `}`：移动到下一个段落开头
    - 单词
        - `w`：移动到下一个单词开头
        - `b`：移动到上一个单词开头
        - `e`：移动到当前/下一个单词结尾
        
> [!TIP]
> vim 的大部操作前面都可以加数字，以表示多次重复。
> ex：`3fq` 跳转到从此处开始，`q` 第三次出现的地方。 

3. 保存与退出——需要在 Normal 模式。

| 效果 | 命令 |
| --- | --- |
| 保存 | `:w` |
| 退出 | `:q` |
| 保存并退出 | `:wq` |
| 强制退出不保存 | `:q!` |

4. 文件树操作
    - 打开/关闭文件树：`Space + e`
    - 切换焦点：先按 `Ctrl + w`，再按 `hjkl` 切换焦点
    - 文件操作
        - 移动：用 `j` 和 `k` 上下移动
        - 打开和展开：`l` 和 `Enter`
        - 收起：`h`
        - 新建文件/删除：`a` / `d`，对应 add 和 delete
        
5. 在多个文件间（缓冲区）切换
    - `Shift + h/l`：在前后标签页（buffer）切换（lazy vim）
    - `[` / `]` + `b`：上/下一个 Buffer（lazy vim）
    - `Space + b + d`：关闭当前 Buffer（lazy vim）
    - `gt` / `gT`：在前后标签页切换（传统 vim，不推荐，`gT`非常难按）

## Flash.nvim

> Neovim 限定操作

Flash.nvim 的功能很像 Ace Jump，可以快速跳转到某个字符处。

- 单词跳转：`s`

    然后输入你想跳转的字符，屏幕上会显示该字符所在位置的快捷键，按下对应的快捷键即可跳转。

- 代码块跳转：`S`

    搜素高亮选区，会自动把整个函数、整个 if 块、整个类圈出来给你选。

- 远程制导：`d + s`

    直接远程删掉一个单词。

## 搜索

- 当前文件
	- 向下搜：`/`
	- 向上搜：`?`
	- 前进/后退：`n`/`N`
- 找文件：
	- `Ctrl + Shift + N` (Windows) / `Cmd + Shift + O` (Mac)
	- `Space` + `f` + `f` (LazyVimk)
- 最近用过的文件：`Ctrl + E`
- 基于整个项目寻找代码
	- `Space` + `/` (LazyVim)
	- `Space` + `s` + `g` (Standard)

## 编辑

基础操作：

- 插入新行
    - 下方：`o`
    - 上方：`O`
- 替换字母：`r`
- 全局替换：
	- 基础命令：`:%s/旧文本/新文本`——替换当前行中的文本
	- 基础命令 + `/g`：当前文件全局替换
	- 基础命令 + `/gc`：当前文件全局替换，但每次替换前需确认
	- `行数1，行数2` + 全局替换：指定行数替换
	- `#` 可以替换命令中的 `/`
- 删除
	- `x`/`X`：光标下一个/上一个字符（类似 Delete 键）
	- `d` 是删除指令的前缀（实际剪切），可以和一个移动指令结合：
		- `dd`：整行
		- `dw`：一个单词
		- `D`：从光标位置到行尾的所有内容
		- `dt + [字符]`：删除光标到字符处的内容
- 复制粘贴
    - `y`：复制选中的内容 (Yank)
    - `yy/Y`：复制当前行
    - `p`：在光标前粘贴
    - `P`：在光标后粘贴
- 撤销
	- `u`：撤销 (Undo)
	- `Ctrl + r`：重做 (Redo)
	- `U`：还原你光标进入此行后做的修改
- 重复上个修改指令：`.`
	

> [!TIP]
> `d` 的前或后可加上数字。
> 此外重复操作 `.` 其实很好用。

更 pro 操作：

- 格式化：`Space + c + f`
- 转到定义：`gd`（go to defi）
- 折叠
	- `za`：切换折叠状态
	- `zM`/`zR`：折叠/展开所有方法
- 注释
    - `gcc`：注释当前行
    - `gc + j`：注释当前行和下面一行
    - 选中几行按 `gc`：注释选中的代码块
- 快速修改/替换
	- `cw`：从光标处开始，改到单词结束
    - `ci"`：修改引号里的内容 (Change Inner Quotes)
    - `ci`：修改括号里的内容 (Change Inner Parentheses)
    - `ci + [边界]`
	    - `ciw`：修改单词 (Change Inner Word)
	    - `ci(`：修改括号内容
	    - `ci{`：修改大括号内容
    - `C`：修改光标到结尾的内容
    - `ct + [字符]`：删除光标到字符处的内容

虽说在 Insert 模式下，可以如此换行：按下 `Ctrl + o` 临时进入 normal 模式输一个命令，按下 `o` 创建新行。但我还是推荐你直接回到 Normal 模式再按 `o` 或者直接在 Insert 模式下按回车，这两种方式都比前者更符合直觉，而且快得多。

> [!TIP]
> 插入也是允许重复的的，具体为：在进入 Insert 模式前，先按下一个数字（ex: 3），再在 Insert 模式输入（go），退出 Insert 模式时会输入的内容就会被多次复制（ex：gogogo）。通过按下 `o` 等操作进入 Insert 模式时同样适用。

## Visual Mode

可以在可视模式里选择一段文本，然后对其进行操作，比如复制、删除、注释等。

进入可视模式 (Visual Mode)：
- `v`：按字符选择（像鼠标拖动）
- `V`：按行选择（最常用）
- `Ctrl + v/q`：矩形选中

在可视模式下，按 `d` 可以直接选中的内容，`U` 会将其变为大写。

## 多光标

原生 Vim：`gb` 

- 把光标放在任何一个单词上，按下 **`gb`**。
	
- 瞬间，这个单词会被选中，并且屏幕上下一个相同的单词处会自动生成第二根光标
	
- 继续按 `gb`，就会不断往下加光标（完美等同于 VS Code 里的 `Ctrl+D`）。
	
- 加完光标后，按下 `c` (修改) 或者 `I` (在前面插入)，就能同时操作了，按 `Esc` 完美退出。


## 多窗口

窗口操作以`<leader>w`为前缀（比如`<leader>ww`切换窗口，`<leader>wd`关闭窗口）。

- **`<leader>ww`**: 切换到下一个窗口 (Window switch)
- **`<leader>wd`**: 关闭当前窗口 (Window delete)
- **`<leader>w-`**: 水平分屏
- **`<leader>w|`**: 垂直分屏

LazyVim 窗口切换快捷键：
- **`Ctrl + h`**：切换到 **左边** 的窗口
- **`Ctrl + l`**：切换到 **右边** 的窗口
- **`Ctrl + j`**：切换到 **下方** 的窗口
- **`Ctrl + k`**：切换到 **上方** 的窗口

命令`:only`可以一口气关掉所有其他窗口。
