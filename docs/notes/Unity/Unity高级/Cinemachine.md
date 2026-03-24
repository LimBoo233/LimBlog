# Cinemachine

## Introduction

Cinemachine 是 Unity 官方提供的一套高级程序化摄像机系统，通过给其指定规则，Cinemachine 可以自动调转场景中摄像机的位移和旋转。

它几乎涵盖了游戏和影视制作中需要的所有镜头调度：
 
- 智能跟随与构图：自动追踪移动的目标，并始终将其保持在画面的特定区域。

- 无缝镜头切换：可以在游戏内布置多个虚拟相机，并在它们之间进行平滑的推拉摇移（Blend）或硬切（Cut）。

- 轨道运镜与推车：让摄像机沿着预设的轨道（Dolly Track）移动，非常适合制作史诗感的游戏开场或复杂的长镜头。

- 程序化镜头震动： 能够极其自然地模拟手持摄像机的呼吸感，或是爆炸、受击时的屏幕震动（Noise）。

它的核心优势有哪些？

- 不用写代码：大部分极其复杂的运镜逻辑，只需在编辑器面板中调整参数即可完成。

- 非破坏性工作流：所有的调整都是实时的。你可以在游戏运行时随时修改参数。

- 高度模块化：无论是简单的 2D 平台跳跃动作，还是复杂的 3D 开放世界，你都可以通过组合不同的镜头模块来搭建出符合当前场景的摄像机逻辑。

## Quick Start

在 GameObject -> Cinemachine 中能够创建各式各样的虚拟相机。所有其他的相机都是由第一个选项`Cinemachine Camera`（以前叫`Virtual Camera`）衍生出来的。

那么接下来，让我们通过`Cinemachine Camera`来快速认识一下这个插件。

![Cinemachine Camera](./image/Cinemachine%20Camera.png)

- **相机之间**

    前几项配置与多个 Cinemachine Camera 之间的切换和更新策略有关，如果你只有一个 Cinemachine Camera，通常让他们保持默认即可。
    
    > [!NOTE]
    > <details>
    > <summary>详细信息</summary>
    > 
    > - Status: Live：点击此按钮可以让当前相机成为主相机的镜头来源。
    > - Priority：勾选后允许指定优先级，优先级高的会控制主相机的更新。当使用带有 Timeline 的 Cinemachine 时此属性会被忽略。
    > - Output Channel：指定此 Cinemachine Camera 把画面数据发送给哪个 Cinemachine Brain（一个挂载在实际相机上的组件）。
    > - Standby Update：当 Cinemachine Camera 没有被激活时（standby），是否在后台继续消耗性能更新它。默认选项 Round Robin 是一种折中方案。
    > - Blend Hint：当从另一个相机平滑过渡到此相机时，指定镜头在空中的轨迹。
    > </details>
    
- **镜头 Lens**

    用于修改视锥体，即 FOV，近远裁剪面等参数。

    > [!NOTE]
    > <details>
    > <summary>详细信息</summary>
    >
    > - Field Of View / Orthographic Size：分别对应透视相机和正交相机的视野范围。
    > - Near Clip Plane / Far Clip Plane：近远裁剪面。
    > - Dutch：荷兰倾斜角，调整画面水平线的倾斜程度。
    > - Mode Override：覆盖镜头的投影模式（透视或正交）。其中 Physics 模式会把相机变为更加遵守现实光学原理的单反相机。
    > </details>
    
- **追踪目标**

    Tracking Target：指定一个 Transfrom 追踪。下方的 Position Control 和 Rotation Control 能制定完整的追踪规则。

- **全局设置 Global Settings**

    - Save During Play：Play 模式下的修改是否保存到当前相机当中。
    - Game View Guides：控制在层级选中此相机时，Game 窗口中的辅助线。
    
- **程序化组件 Procedural Components**

    与 2.x 不同，Cinemachine 3.x 将很多功能都被拆解成了独立的组件，挂载在 Cinemachine Camera 上来实现，就比如跟随和旋转。
    
    - Position Control：决定相机的跟随（位移）行为。
    - Rotation Control：决定相机的朝向（旋转）。
    - Noise：添加程序化的镜头震动效果。
    
    如果琳琅满目的配置让你眼花缭乱，可以试试：
    - 3D：Orbital Follow + Hard Look At。
    - 2D：Position Composer

## 位置控件 Position Control

位置控件决定了相机的跟随行为。其中 Orbital Follow，Position Composer，Follow较为泛用，能满足大部分需求。

> [!NOTE]
> <details>
> <summary>详细信息</summary>
>
> - Follow（跟随）：与跟踪目标保持固定的相对位置进行移动。
> - Orbital Follow（轨道跟随）：与跟踪目标保持可变的相对位置进行移动，可以选择接受玩家的输入（例如鼠标或手柄控制视角）。
> - Third Person Follow（第三人称跟随）：摄像机以跟踪目标为中心，围绕玩家进行水平和垂直方向的旋转，同时也会跟随跟踪目标的自身旋转。
> - Position Composer （位置合成器）： 与跟踪目标保持固定的屏幕空间 (screen-space) 相对位置进行移动（即将目标固定在屏幕的特定区域）。
> - Hard Lock to Target（硬锁定目标）：使用与跟踪目标完全相同的三维位置。
> - Spline Dolly（样条线推轨 / 样条轨道车）：让摄像机沿着由样条线 (Spline) 绘制好的预定义路径进行移动。
> </details>

### Postion Composer

Position Composer 允许你指定一个屏幕空间的区域（Dead Zone，Hard Limits），并让相机始终保持跟踪目标在这个区域内。

Position Composer 关心目标在屏幕中的位置，不关心相机在 3D 世界中具体 XYZ 坐标。你可以在屏幕上的单独设置 Dead Zone（死区）和 Hard Limits（硬限制）：

- Dead Zone：当你勾选 Dead Zone 时，Position Composer 会在屏幕上为目标创建一个无色的矩形区域（死区）。当目标在此无色区域移动时，相机会保持不动。
- Hard Limits：勾选 Hard Limits 后，Position Composer 会在屏幕上为目标创建一个红色的矩形区域（硬限制）。当目标移动到这个红色区域之外时，相机会立即强制把目标拉回到这个区域内。
- Soft Limits：勾选 Dead Zone 或 Hard Limits 其一时，屏幕中会出现蓝色的区域，称之为 Soft Limits（软限制）。当目标在蓝色区域内移动时，相机会平滑地跟随目标。

此外 Position Composer 还可以**预测运动以提前移动摄像头**，这对于高速移动的目标通常能产生非常好的视觉效果。勾选 Lookahead 选项以开启此设置。

> [!NOTE] 属性
> <details>
> <summary>详细信息</summary>
>
> - **Camera Position**
> 
>   控制摄像机与目标之间的基础距离关系。
>   - Camera Distance: 摄像机沿着其局部 Z 轴，距离跟踪目标的基础长度。
>   - Dead Zone Depth: 目标沿着摄像机 Z 轴方向可以移动多大距离，而不触发摄像机的前后跟随移动。
>
> - **Composition**
> 
>   控制目标在屏幕画面中的排版和位置规则。
>   - Screen Position: 期望目标在屏幕上所处的固定坐标点（设定画面重心所在的位置）。
>   - Dead Zone: 开启死区控制。
>   - Hard Limits: 开启硬限制控制。 
>   - Center On Activate: 勾选后，当这个摄像机刚被启用或切换到时，会瞬间把目标对齐到设定的屏幕位置，跳过平滑过渡的过程。
>
> - **Target Tracking**
> 
>   控制摄像机追踪目标时的动态表现和手感。
>   - Target Offset: 对目标的实际世界坐标进行偏移微调。
>   - Damping: 摄像机跟随目标移动时的平滑度（延迟感）。数值越大，镜头的跟随越滞后、越柔和；数值为 0 则会瞬间死死锁定目标。X、Y、Z 分别控制三个方向上的独立阻尼。
>   - Lookahead: 开启后会展开详细参数。摄像机会根据目标当前的移动速度和方向进行预测，自动将镜头提前推向目标正在前进的方向。
> </details>

### Follow

相比 Position Composer，Follow 更加关注于摄像机与目标在三维世界中的绝对物理距离。

此模式提供了许多 Bind Mode 来决定摄像机的跟随逻辑。World Space 是其中最泛用的：相机只管目标的 XYZ 位置，不关注目标的旋转。

> [!NOTE] Bind Mode
> <details>
> <summary>详细信息</summary>
>
> - World Space (世界空间)：偏移量是基于 Follow 目标原点的世界坐标系来计算的。当目标自身发生旋转时，摄像机不会改变位置。
> - Lock To Target (锁定目标)：使 CinemachineCamera 使用 Follow 目标的局部坐标系。当目标旋转时，摄像机会跟着一起移动，从而保持设定的偏移量和始终一致的观察视角。
> - Lock To Target With World Up (锁定目标并保持世界朝上)：使 CinemachineCamera 使用 Follow 目标的局部坐标系，但强制将俯仰角 (tilt/pitch) 和翻滚角 (roll) 设为 0。这个模式会忽略目标除了偏航角 (yaw/水平转向) 之外的所有旋转。
> - Lock To Target No Roll (锁定目标无翻滚)：使 CinemachineCamera 使用 Follow 目标的局部坐标系，并将翻滚角 (roll) 设为 0。
> - Lock To Target On Assign (分配时锁定目标)：仅在 CinemachineCamera 被激活，或者刚刚把目标分配给它的那一瞬间，让摄像机的方向与目标的局部坐标系对齐。之后这个偏移量在世界空间中就固定不变了，摄像机不会再随目标一起旋转。
> - Lazy Follow (延迟/慵懒跟随)：在摄像机自身的局部空间中解析偏移量和阻尼值。这个模式模拟了真实人类摄像师在被指示跟拍时会采取的动作：摄像机会尽可能少地移动，只求保持与目标相同的距离；摄像机相对于目标的具体方位并不重要。无论目标的朝向如何，摄像机都试图保持与它相同的距离和高度。
> </details>

在 World Space 的 Follow 模式下，其表现其实和 Position Composer 在不开任何 Zone 的情况下表现十分相似。

### Orbital Follow

Orbital Follow 是一个适用于 3D 世界的跟随模式。它能够接受鼠标输入来控制相机。使其位置在给定的轨道中移动。

同样，Orbital Follow 提供了和 Follow 相同种类的 Bind Mode。但其最独特的在于它的轨道系统，一共有两种轨道：

- **Sphere（球面轨道）**：相机以你的主角为圆心，在一个半径固定的三维球体轨道上运动。不过相机的上下移动范围其实有限制的，不用担心相机会倒转。
- **Three Ring（三环轨道）**：在主角周围画 3 个独立设定的水平圆环（Top 顶环、Center 中环、Bottom 底环），然后用一条平滑的曲线把这三个环连起来，形成一个类似酒桶或沙漏的自定义曲面。

> [!NOTE] Recentering（回正目标）
> <details>
> <summary>详细信息</summary>
> 
> Recentering Target 需要配合下面的回正功能使用，决定相机在回正时要对齐到哪个物体的朝向上。
> - Horizontal Axis / Vertical Axis：当前相机水平/垂直轴位置。
> - Radial Axis：径向轴，它是上面 Radius 的一个乘数。
> </details>

此外 Orbital Follow 能通过`Cinemachine Input Axis Controller`组件来接受玩家输入，以移动相机。

> [!NOTE] Cinemachine Input Axis Controller
> <details>
> <summary>详细信息</summary>
>
> - **Scan Recursively（递归扫描）**
>    - 不勾选：此组件只会扫描它所在的这一个 GameObject，为需要输入的组件（如 Orbital Follow）提供输入。
>    - 勾选：一层一层地往下遍历所有的子物体，为其提供输入。
> - **Suppress Input While Blending（在混合过渡时抑制输入）**：系统就会在镜头自动过渡期间，强行屏蔽玩家的鼠标输入。
> - **Ignore Time Scale (忽略时间缩放)**
> - **Auto Enable Inputs**：新版 Input System 的动作默认是关闭的，勾选后 Cinemachine 会在需要的时候自动启用它们。
> </details>

## 旋转控件 Rotation Control

旋转控件决定了相机的朝向（旋转）。其中 Hard Look At 是最简单了当的选项，相机会始终朝向目标，适用于大多数情况。

> [!NOTE] Rotation Control
> <details>
> <summary>详细信息</summary>
> 
> - None：无旋转。
> - Pan Tilt（摇摄与俯仰）：彻底将镜头的旋转控制权交给玩家，需配合`Input Axis Controller`一起使用。
> - Hard Look At：相机始终朝向目标。
> - Rotation Composer：和 Position Composer 类似，也会在屏幕上画出红蓝框（死区/软区）。区别在于，它是站在原地不动，通过转动镜头来把目标套在框里。
> - Rotate With Follow Target：顾名思义，相机朝向 target 的前方。
> - Spline Dolly Look At Targets（样条线推车焦点）：这是一个专供特定场景的组合技。如果你的 Position Control 选择了在预设的轨道（Spline）上移动，这个组件可以让相机在沿着轨道滑行的过程中，依次看向你在轨道上设定好的几个不同目标点。适用于播片演出。
> </details>


## 各种各样的扩展

1. **物理、碰撞与边界限制**

    3.0 对扩展进行了大修。旧版本把防穿模和防遮挡揉在一个组件里，3.0 机智地拆分了他们：

    - **CinemachineDecollider（防穿模器）**：它的唯一职责是防止相机撞进或穿透墙壁、地板等物理碰撞体。
    - **CinemachineDeoccluder（防遮挡器）**：它的职责是当主角跑到一堵墙后面，导致相机视线被墙挡住时，它会自动把相机往前拉（或绕开），确保主角始终在画面里。
    - **CinemachineConfiner2D（2D 边界限制）**：它可以给相机画一个 2D 笼子（PolygonCollider2D）。不管主角怎么跑，相机死也不会超出这个笼子的边界，完美防止玩家看到地图边缘的黑边。
    - **CinemachineConfiner3D**：同上，只不过是用 3D 的盒子或网格（Mesh）来限制相机的活动范围。

2. **画面与视觉特效**

    - **CinemachineAutoFocus（自动对焦）**：如果你在 URP 里开启了景深（Depth of Field），挂上它，它会自动计算相机到主角的距离，并实时调整景深的焦距，让主角永远清晰，背景自动虚化。
    - **CinemachineFollowZoom（跟随缩放）**：当主角跑远时，它会自动调整正交大小（或 FOV）把画面放大；主角靠近时又自动缩小，努力保持主角在屏幕上的大小永远不变。
    - **CinemachinePixelPerfect（像素完美）**：专为复古像素风游戏设计。它会强制相机严格对齐屏幕像素网格，彻底解决像素画在移动时边缘闪烁、扭曲的“果冻效应”。
    - **CinemachineVolumeSettings（后处理体积覆盖）**：允许你为这个特定的相机绑定一个单独的 URP Post-Processing 文件。比如切到死亡相机时，画面瞬间变成黑白且四周带有浓重阴影（Vignette）。非常有用。

3. **游戏机制与核心手感**

    - **CinemachineImpulseListener（震动接收器）**：只要场景里发生了爆炸或重击触发了震波（Impulse），挂了这个组件的相机就会随之剧烈晃动（屏幕震动）。需要配合 Cinemachine Impulse Source 组件使用。
    - **CinemachineThirdPersonAim（第三人称瞄准）**：专为越肩视角的射击游戏（如《生化危机》）设计，用来精确校准屏幕准星和枪口射线，解决看着瞄准了但打不中的痛点。

4. **高级调优与辅助工具**

    - **CinemachineCameraOffset（相机偏移）**：在所有相机逻辑算完之后，最后强行给相机的 XYZ 加一个固定的位移距离。常用于微调机位。
    - **CinemachineRecomposer（二次构图）**：类似 Offset，只不过它是用来在最后强行微调相机的倾斜和旋转角度。
    - **CinemachineFreeLookModifier / GroupFraming**：它们是专门为 FreeLook（自由视角）和 TargetGroup（群像目标）这两种特殊相机提供的额外修改器。
    - **CinemachineShotQualityEvaluator（镜头质量评估）**：给人工智能导演（如 ClearShot 最佳视野相机）用的。它会实时给当前镜头的角度打分（比如被挡住了扣分，离得太远扣分），帮助导演决定要不要切换到备用相机。
    - **CinemachineStoryboard（故事板）**：纯开发辅助工具。能在你的游戏画面上直接半透明叠盖一张美术画好的 2D 概念图，方便你一边拖拽地图，一边完美对齐原画的构图。

## 各式各样的相机

我们可以把这些相机分为四大类：

1. **基础与全能选手**

    Cinemachine Camera（前 Virtual Camera）：这是整个系统的绝对核心。后面提到的大多数相机，本质上都是官方帮你预先配置好组件的 Cinemachine Camera 快捷版。

2. **目标导向预设**

    这类相机开箱即用，专门针对常见的游戏视角设计：
    
    - FreeLook Camera（自由视角相机）：它围绕角色生成三个不同高度的圆环轨道，允许玩家通过鼠标/摇杆 360 度自由旋转和俯仰视角。适用于 3D 动作或 RPG 游戏。
    
    - Third Person Aim Camera（越肩瞄准相机）：相机固定在角色肩膀侧后方，画面中心与准星对齐。专为射击或投掷系统设计。
    
    - Target Group Camera（目标组相机）： 非常聪明的群像相机。你把多个物体（比如玩家和 Boss）丢给它，它会自动计算距离并拉远/推近焦距，确保所有人始终都在屏幕画面内，很适合格斗游戏或局部多对多战斗。

    - 2D Camera & Follow Camera：顾名思义，前者专为 2D 横版或俯视角锁定平面移动；后者则是简单的始终跟在目标后方。

3. **轨道与路径运镜**

    Dolly Camera with Spline & Dolly Cart with Spline：影视级运镜利器。你可以用样条线（Spline）在场景里画一条路线，让相机像坐过山车一样严格沿着轨道移动。这非常适合用来制作游戏开场的大气环境展示，或者特定路线的追逐戏长镜头。

4. **逻辑与导演系统**

    这类组件是相机的管理者，负责决定当前该用哪个相机：

    - State-Driven Camera（状态驱动相机）：它直接与角色的动画状态机（Animator）绑定。例如，角色切换到潜行状态时自动用低机位相机，奔跑时自动切到视野更广的相机。它完美地将复杂的运镜逻辑拆解到了每一个动作小状态中。
    
    - ClearShot Camera（最佳视野相机）：自动避障专家。如果你在狭窄的房间里放了几个不同角度的相机，它会实时计算，自动切换到那个没有被柱子或墙壁挡住主角的最佳机位。
    
    - Sequencer Camera（序列相机）& Mixing Camera（混合相机）：前者按照设定的时间顺序，像播片一样挨个播放一组镜头；后者则是根据你设置的权重，把几个相机的画面平滑地组合在一起。
