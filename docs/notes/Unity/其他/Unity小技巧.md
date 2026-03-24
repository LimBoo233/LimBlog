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

## 大幅减少进入播放模式时的加载时间

勾选 Project Setting -> Editor ->Enter Play Mode Options 以跳过（或减少）进入播放模式时的重新加载过程，从而大幅缩短等待时间。

默认情况下，每次你按下 Play 键，Unity 为了保证一个“绝对干净”的运行环境，会执行两个非常耗时的操作：

1. **Domain Reload (域重载)**：卸载并重新加载所有的 C# 程序集（DLLs）。这会重置所有的 `static` 变量，确保你的单例（Singleton）或静态数据回到初始状态。
    
2. **Scene Reload (场景重载)**：重新加载当前的场景文件，重置所有 GameObject 的初始状态。
    
当你开启`Enter Play Mode Options`后，你可以选择勾选以下两个选项：

- **Reload Domain (不勾选 = 禁用重载)**： Unity 不再重启 C# 的虚拟机环境。点击 Play 时，脚本立刻开始运行。
    
    - **速度提升**：极其明显，几乎是秒开。
        
- **Reload Scene (不勾选 = 禁用重载)**： Unity 不再从硬盘重新加载场景。
    
    - **速度提升**：对于物体极其密集的场景，提升巨大。

但是如果你**禁用了 Domain Reload**，由于 C# 域没有重启，**静态变量的值会保留上一次运行后的结果。** 所以如果有时候你的游戏刚才还运行得好好的，再运行突然出了 Bug，考虑一下是不是因为开启了这个选项。

## 不受帧率影响的阻尼

```cs
Func<float, float> func = (float time) => 1 - Mathf.Exp(-time * Time.deltaTime);

var t = func(10f)
postion = Vector3.Lerp(position, target, t)
```

公式的原理可以类比物理中**半衰期**的概念。

## `Instantiate<Component>`

实例化一个游戏对象并且避免之后`GetComponet<T>`的开销：

```cs
Component c = UnityEngine.Object.Instantiate<Component>(prefab);
```

## 将无需移动旋转缩放的物体标记为`Static`

当你勾选 Inspector 面板右上角的`Static`复选框时，你是在告诉 Unity 这个物体在游戏运行时**不会移动、旋转或缩放**。”这样 Unity 就可以预先计算一些复杂的物理、光照和渲染数据，从而减轻 CPU 和 GPU 的负担。

性能优势

- **降低 CPU 开销**：减少了每帧计算物体位置和剔除逻辑的压力
    
- **降低 GPU 开销**：通过静态合批减少渲染次数
    
- **更真实的画面**：可以使用烘焙光照实现高精度的软阴影和全局光照（GI）
    

注意事项

- **内存消耗**：静态合批会创建新的合并网格，可能会增加内存占用
    
- **灵活性丧失**：一旦标记为 Static，你在脚本中尝试通过 `transform.position` 移动它通常是无效的（或者会导致巨大的重新计算开销）

标记为`Static`后，记得在 Rendering -> Lighting 窗口烘培光照。

## 警惕根运动动画间的过渡

根运动动画间的过渡非常容易产生问题，例如从竖直爬墙的根运动动画可能会和跑步动画混合，导致在动画过渡期间角色向前上方爬取，容易造成角色卡入墙内然后直接被物理系统弹飞。因此，警惕根动画过渡期间可能运行的逻辑。

```cs
// 让动画播放到10%之后再进行动画匹配，给根运动动画些时间过渡
_animator.MatchTarget(  
   matchPosition,  
   Quaternion.identity,  
   AvatarTarget.RightHand,  
   new MatchTargetWeightMask(new Vector3(0, 1, 0), 0),  
   0.10f,  
   0.25f  
);  
```

## Collider + Kinematic Rigidbody

在 Unity 的物理引擎眼中，一个只有 Collider 没有 Rigidbody 的物体被称为 **静态碰撞体 (Static Collider)**。 物理引擎会理所当然地认为这是一个建筑物、一面墙或者一块永远不会动的石头。为了优化性能，引擎会在游戏加载时，把这些静态物体的信息“烘焙”成一个极其复杂的空间树结构（BVH）。

如果你通过播放动画或者代码，强行改变了这个静态碰撞体的 Transform（比如挥舞巨剑），物理引擎就会因为发现“墙居然动了”而引发大地震——它**被迫在这一帧重新计算并重建整个场景的静态空间树**。如果你频繁挥剑，CPU 就会出现极大的开销，导致游戏严重卡顿。

当你给巨剑加上 Rigidbody 时，你就等于向物理引擎声明：这是一个**动态物体 (Dynamic Object)**，它随时都会移动，把它放进动态物体的处理列表里。这样一来，物理引擎就不会因为它的移动而重新计算整个场景了，性能开销骤降。+

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