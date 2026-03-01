# JetBrain系Ide

## 最 cooooool 的快捷键

- 全知的搜索：`Double Shift`
- 无敌的插入：`Alt + Insert` (Windows) / `Cmd + N` (Mac)
- 万用的重构：`Alt + Enter`

其他常用的：
- 打开文件树：`Alt + 1`
- 文件树搜索：打开文件数直接输入
- 重命名：`Shift + F6`
- 复制上一行：`Ctrl + D`
- 复制/删除/剪切当前行：`Ctrl + C/Y/X`
- qurick doc：`Ctrl + Q`
- 查看参数：`Ctrl + P`
- 快速补全：`Ctrl + Space`

切换焦点：
- 回到代码区: `Esc`
- 跳到特定的面板：`Alt + 数字键`

> 目前就想到这么多，将来再补充 >_<

## 最近的位置

`Alt + [左右箭头]`在面对大量文件时就不够看了，此时可通过`Ctrl + E`来打开最近文件在其中快速切换。`Ctrl+Tab`也可以做到类似的效果，它仅会在上方打开的文件中跳转。

此外，`Ctrl + Shift + E`可以在最近操作的位置中快速切换。

## 关闭文件

`Ctrl + F4`可以快速关闭当前阅览的文件。

当你的鼠标移到上方标签页时，你不需要瞄准`x`号，只要把鼠标随便放在标签页的任何位置，按下中键（滚轮），文件瞬间关闭。

当上面开了几十个文件乱成一锅粥时,按住 `Alt` 键，鼠标左键点击你当前正在写的那个文件的`x`号，会迅速关闭其他标签页。

## 树状图

- 类的解剖图-文件结构树：左侧结构按钮，快捷键`Alt + 7`
	- 如果你当前阅读的类里继承了大量来自父类的方法，此页面可能会显得非常杂乱无章，为此你最好取消勾选“从相关文件”选项。
	- `Ctrl + F12`会专门打开一个小的悬浮窗口，显示相同的信息。
	- 此外，你可以利用该树状图在方法和属性间快速跳转。
- 代码的族谱-继承/调用层级树：指针放在类名方法名上，`Ctrl + H`
- 语法树可视化器：

## 调正中文字体及抗锯齿

调整注释和 ide 中的中文字体，并且应用更好的抗锯齿效果以带来更好的体验。

打开设置：
- 注释中文字体：在 Editor -> Font 页面中，打开下方的版式设置，选择回滚字体（ex：Microsoft YaHei）
- Ide 界面中文字体：在 Appearance 中打开无障碍功能，勾选使用自定义字体（推荐：Microsoft YaHei UI）
- 抗锯齿：Appearance 最下方调正抗锯齿，灰度效果最佳

## 方法快速补全

idea 当方法输入一般的时候，会弹出码补全列表。除了利用`↑` / `↓`切换补全提示，更 pro 的方法是利用驼峰匹配快速定位，即输入每个单词的首字母。

例如，当你想要补全`TryGetValue`时，你只需要输入：
- `TGV`/`tgv`
- `TryGV`/`trygv`

## 多光标

- **`Alt + J`**：向下选中下一个相同的单词并添加光标（Mac 上是 `Ctrl + G`）。
	
- **`Alt + Shift + J`**：如果不小心选多了，按这个可以撤销上一个光标（Mac 上是 `Ctrl + Shift + G`）。
	
- **`Ctrl + Alt + Shift + J`**：选中当前文件里所有相同的单词（Mac 上是 `Ctrl + Cmd + G`）。

## IdeaVim

我的配置：

```
" .ideavimrc 是 ideavim 插件的配置文件，语法与原始 .vimrc 相同。
" 完整指令列表：https://jb.gg/h38q75
" 更多配置示例：https://jb.gg/share-ideavimrc

" 使用系统剪贴板完成复制/剪切/粘贴。
set clipboard=unnamedplus
let mapleader = " "
" set timeoutlen=300

" space + w 保存文件
noremap <leader>w :w<CR>

" -- 推荐选项 --
" 光标上下保留数行上下文，避免鼠标靠近窗口边缘时跳动。
set scrolloff=5

" 禁用 ex 模式，把 q 映射为重新排版。
map q gq


" --- Enable IdeaVim plugins https://jb.gg/ideavim-plugins

" 高亮最近复制的文本
plug 'machakann/vim-highlightedyank'
" 注释插件， gc 和 gcc 等
plug 'tpope/vim-commentary'
" 开启 easymotion 扩展，已被 flash 插件替代，以下配置仅供参考。
" plug 'easymotion/vim-easymotion'
" <leader>w 触发单词跳转 (类似 flash 的基础跳转)
" map <leader>w <plug>(easymotion-w)
" <leader>f 触发字符搜索跳转 (输入一个字符后，高亮所有匹配项)
" map <leader>f <plug>(easymotion-s)
" <leader>l 触发当前行跳转 (line)
" map <leader>l <plug>(easymotion-lineforward)
" map <leader>h <plug>(easymotion-linebackward)

" flash 插件是自动开启的，此处不再手动配置
" set flash
" nmap s <Action>(flash.search)
" xmap s <Action>(flash.search)

" 开启 whichkey 插件
" set which-key

" 开启 nerdtree 插件，可以在文件树通过 jk 移动，o (open) . p/p (parent/根目录) 以及 m (menu) 等快捷键操作。
" 推荐修改 ide 的快捷键，将 ctrl + j 和 ctrl + k 映射给编辑器操作的上和下
set nerdtree

set showcmd
" 启用增量搜索，实时高亮匹配。
" 边打字边实时搜索跳转
set incsearch
" 搜索时忽略大小写
set ignorecase
" 如果你输入了包含大写字母的词，则精确匹配大小写
set smartcase
" 搜索结果高亮显示
set hlsearch
" 连按两下 esc 键，不仅退出模式，还顺手清理搜索高亮
nnoremap <esc><esc> :nohlsearch<cr>

" -------------------------------------- 快捷键 --------------------------------------
inoremap jk <esc>

" 将 ctrl+v 映射为进入块选择模式（visual block）。
" ideavim 提供 ctrl+q 作为块模式的替代快捷键。
" 因此这里把 <c-v> 重映射到 <c-q>。
nnoremap <c-v> <c-q>
xnoremap <c-v> <c-q>

" --- 极速移动优化 ---
nnoremap gh ^
nnoremap gl $

" -- 将 ide 动作映射到 ideavim -- https://jb.gg/abva4t
" 将 \r 映射为格式化代码
map <leader>r <Action>(ReformatCode)

" 一键呼出/隐藏文件树 (explorer)
nmap <leader>e <Action>(ActivateProjectToolWindow)

" 在项目文件树中定位当前打开的文件 (Locate in Project View)
nmap <leader>v <Action>(SelectInProjectView)

" 快捷键映射
sethandler <c-e> a:ide
sethandler <c-s> a:ide
" vim 中跳转定义为 gd
" sethandler <c-b> a:ide
sethandler <c-k> a:ide
" vim中功能：向下移动整页
sethandler <c-f> a:ide
" vim中功能：切换分屏/删除单词
sethandler <c-w> a:ide

" lazyvim 风格
nmap <leader><leader> <Action>(SearchEverywhere)
" [b : 切换到上一个 buffer (前一个标签页)
nmap [b <Action>(PreviousTab)
" ]b : 切换到下一个 buffer (后一个标签页)
nmap ]b <Action>(NextTab)
" ctrl + h: 跳到左边窗口
nnoremap <c-h> <c-w>h
" ctrl + l: 跳到右边窗口
nnoremap <c-l> <c-w>l
```