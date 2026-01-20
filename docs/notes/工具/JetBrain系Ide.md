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

> 目前就想到这么多，将来再补充 >_<

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
