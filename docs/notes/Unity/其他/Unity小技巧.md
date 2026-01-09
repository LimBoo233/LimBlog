# Unity小技巧

## 快捷键

- 按下`F2`快速重命名。
- 在 Inspector 中修改参数时，按`Tab`快速切换到下一个参数，`Shift + Tab`为上一个参数。
- `Tab`也可用于移动焦点。
- `Ctrl + 5` 聚焦 Project 窗口
- Edit -> Shortcut 可以自定义快捷键。
- `Ctrl + f`在 project 窗口搜索。
- `Ctrl + k`打开全局搜索。

## 全局搜索

按下`Ctrl + k`打开全局搜索。其功能之强大如同 vscode 里的`Ctrl + Shift + p`。

- 搜索资源
- 执行菜单上的功能
- 场景物体筛选
- 计算

特殊前缀：
- **`t:script`** -> 只搜脚本（t 代表 type 类型）
- **`t:texture player`** -> 只搜名字带 player 的贴图
- **`m:create`** -> 只搜菜单命令（menu）
- **`p:physics`** -> 只搜设置项（preferences）

## 在Untiy3d中导入pmx类型的模型

[参考视频](https://www.bilibili.com/video/BV1i14y1j7eF/?spm_id_from=333.1007.top_right_bar_window_history.content.click&vd_source=b3c97e3d2220b29b554866d21d02bd09)

众所周知，Unity3d 只支持 fbx 类型的文件，而大多数较为精美的人物模型都是 pmx 类型的，
而转换起来又十分麻烦，不过现在可以在Untiy中可以添加名为 MMD4 的插件对模型进行导入。

使用 MMD4Mecanim 插件直接将 pmx 文件导入 Unity，并进行游戏开发。以下是完整的操作步骤和注意事项：

插件下载地址：http://stereoarts.jp/

1. 安装 MMD4Mecanim 插件

	- 在 Unity 中，选择 Assets > Import Package > Custom Package，导入下载的 MMD4Mecanim.unitypackage。

	- 确保导入后项目中出现 MMD4Mecanim 相关文件夹。

2. 导入 PMX 模型

	- 准备 PMX 文件：
		- 确保 PMX 文件及其贴图（.png/.jpg）在同一个文件夹内，不要更改文件结构。
		- 拖入 Unity：
		- 将整个 PMX 文件夹拖入 Unity 的 Assets 目录。
		- 插件会自动生成 .MMD4Mecanim 文件。

	- 转换模型：
		- 选中 .MMD4Mecanim 文件，在 Inspector 窗口勾选使用条款，点击 Process 进行转换。
		- 转换完成后，会在原文件夹下生成 Materials 文件夹（包含所有材质）。

3. 修复材质（避免粉色材质）

	- 问题：MMD4Mecanim 默认使用 MMD 风格的 Shader，Unity 可能不兼容，导致材质变粉。
	- 解决方法：
		- 选中 Materials 文件夹内的所有材质球。
		- 在 Inspector 窗口，将 Shader 改为：
		- 内置渲染管线 → Standard
		- URP（Universal RP） → Universal Render Pipeline/Lit
		- HDRP → HDRP/Lit14。
		- 手动检查贴图是否正确连接（如 Albedo、Normal Map 等）。
	
> [!TIP]
> 该情况暂未出现，如出现会进行详细解答

4. 调整骨骼与动画

	- 骨骼适配：
	- 在 Inspector 窗口，选择 Rig 选项卡，将 Animation Type 改为 Humanoid（适用于角色动画）。
	- 点击 Configure 检查骨骼绑定是否正确（绿色表示正常，红色需调整）。
	- 动画导入：
	- 如果有 .vmd 动作文件，可以一起导入，MMD4Mecanim 会自动转换为 Unity 的 .anim 格式。

5. 物理效果（如头发、裙子摆动）
	- 在 MMD4Mecanim 组件中：
	- 将 Physics Engine 改为 Bullet Physics（优化物理计算）。
	- 勾选 Generate Colliders，使布料、头发等具有物理效果。