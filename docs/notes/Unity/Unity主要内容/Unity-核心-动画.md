# Unity-核心-动画

::: details 模型的基本制作过程

3D模型的制作通常包括以下几个主要步骤：

1. **建模**  
   使用三角面片组合，像捏泥人一样拼装出模型的形状。

2. **展UV**  
   UV 是纹理贴图坐标的简称，具有U轴和V轴，类似于三维坐标系的XYZ轴。纹理坐标中的每一个点都和 3D 模型上的位置信息是相互联系的。展 UI 就像是将 3D 模型的表面“拆开”成一张 2D 图片上，方便后续贴图。
   > 如果对具体内容很感兴趣的，可以观看[【Kurt】Blender零基础入门教程 | Blender中文区新手必刷教程(已完结)](https://www.bilibili.com/video/BV14u41147YH/?spm_id_from=333.337.search-card.all.click&vd_source=b3c97e3d2220b29b554866d21d02bd09)

3. **材质和纹理贴图**  
   - **纹理**：一张 2D 图片，包含颜色、细节等信息。
   - **贴图**：通过 UV 坐标将纹理映射到 3D 模型表面。
   - **纹理贴图**：为模型提供颜色、细节、UV 等信息。
   - **材质**：决定模型的表现效果——结合纹理贴图和着色器算法，可呈现金属、塑料、玻璃等不同效果。

4. **骨骼绑定**  
   为模型添加骨骼结构，定义骨骼控制哪些网格区域，实现后续动画控制。

5. **动画制作**  
   利用骨骼的旋转、移动等操作，在时间轴上制作关键帧，通过插值规则让模型在关键帧之间平滑过渡，最终形成完整的动画效果。

:::

## Animation 窗口
Animation 窗口是 Unity 中用于创建和编辑动画片段（`Animation Clip`）的核心工具。通过该窗口，你可以为对象添加关键帧，调整属性曲线，预览动画效果，实现角色、UI 或场景元素的动态表现。它支持逐帧编辑、曲线调整和事件插入，是动画工作流程的基础。

![Animation窗口](./images/Animation窗口.png)

Animation 窗口提供了用于制作单个动画片段的功能，通常位于窗口左上角，功能从左到右分别是：
1. `Preview`：预览当前动画片段的效果。
2. 录制模式
3. 回到第一帧
4. 回到上一关键帧
5. 播放/暂停
6. 前进到下一关键帧
7. 回到最后一帧
8. 显示当前为第几帧

窗口右上角的三个点按钮可以进行更细腻的设置，如动画帧率。

窗口下方还有两个按钮：`DopeSheet`（关键帧模式） 和 `Curves`（曲线模式），用于编辑关键帧。

## 编辑关键帧
> 真正的动画一般都是美术同学制作，程序只要会简单的动画编辑（ex：位移）即可。

选择希望编辑的对象后，在 Animation 窗口中点击 `Create` 按钮为其创建一个新的动画片段，如果先前已经为该物体创建过动画，则点击左侧的动画片段下拉菜单点击 `Create New Clip` 创建新的动画片段。Unity 会自动为物体进行必要的设置：添加 `Animator` 组件，创建 `Animator Controller` 动画状态机并与 `Animator` 关联。

录制模式下，修改 Inspector 面板中物体的属性（如位置、旋转、缩放等），Unity 会自动为这些属性添加关键帧并创建过渡：
![关键帧模式](./images/关键帧模式.png)

可以在 `Curves` 模式下修改关键帧的插值曲线，调整动画的缓动效果：
![曲线模式](./images/曲线模式.png)

在 `Curves` 模式下可以直接拖动关键帧曲线的斜线来调整动画的插值效果，或者在关键帧上右键进行更细致的编辑：
| 切线模式 | 功能 |
| ---- | ---- |
| `Clamped Auto` | 自动插值，保持曲线平滑。 |
| `Auto` | 旧版自动插值，现在几乎不使用。 |
| `Free Smooth ` | 允许您自由地、手动地拖拽关键帧两侧的切线控制柄。 |
| `Flat` | 强制将关键帧两侧的切线都设置为完全水平。 |
| `Broken` | 允许独立地、分别地调整关键帧两侧的切线控制柄。 |

| 插值 | 功能 |
| ---- | ---- |
| `Free` | `Free Smooth` 和 `Broken` 模式的统称或前置状态。当您将一个关键帧的切线设置为 `Free` 时，意味着您放弃了自动计算（如 `Clamped Auto`），转为手动控制。 |
| `Linear` | 在两个关键帧之间创建一条笔直的线。 |
| `Constant` | 一个关键帧的值会保持不变，直到下一个关键帧的时刻，才瞬间跳转到新的值。|
| `Weighted` | 允许您在两个关键帧之间创建一个平滑的过渡，但与 `Free Smooth` 不同的是，它会考虑到关键帧的权重：可以将加权切线的控制柄“拉得更远”或“收得更近”。拉得越远，该切线对曲线形状的“引力”就越强，变化至该关键帧的视觉效果越快。|

## `Animation Clip` 文件
`Animation Clip` 储存了一个动画片段的所有信息。其中的属性大部分不用修改：
| 属性 | 功能 |
| ---- | ---- |
| `Loop Time` | 是否循环播放动画。 |
| `Loop Pose` | 循环播放后是否自动过度至起始状态。|
| `Cycle Offset` | 循环动画在开始播放时的延迟播放偏移量。|

在 Debug 面板（Inspector 右上角三个点按钮列表中开启）下，`Animation Clip` 文件的 Inspector 面板会显示更多信息，如 `Sample Rate` （每秒帧数）和 `Wrap Mode`（循环模式）等。

## 有限状态机
状态机（State Machine） 是一种将复杂行为分解为一系列独立、清晰的状态，并定义这些状态之间如何切换的设计模式。一个对象在任何特定时刻只能处于一种状态。

**状态机的三大核心要素**
1. **状态 (States)**

    代表一个对象在某个时刻所处的具体状况或行为。每个状态都是独立的。
2. **过渡 (Transitions)**

    连接两个状态的路径或规则，定义了从一个状态切换到另一个状态的可能性。

3. **条件 (Conditions) 或 事件 (Events)**

    触发过渡的具体原因。当某个条件满足时，状态机就会沿着预设的过渡路径切换到新的状态。

## `Animator Controller`

`Animator Controller` 是一个可视化的有限状态机 (FSM)，一个存在于您项目中的资产文件（以 `.controller` 为后缀）。它的核心作用是管理一个对象的所有动画片段（`Animation Clip`），并根据预设的逻辑和来自代码的指令，决定在何时播放哪个动画，以及动画之间如何过渡。

::: info `Animator Controller` 窗口
![alt text](./images/Animator%20Controller窗口.png)
:::

**`Animator Controller` 的核心构成元素**

1. 状态 (States)

   状态是状态机的基本单元，表现为一个个彩色的方块。
   - 普通状态：通常直接关联一个 `Animation Clip`。当进入这个状态时，与之关联的动画片段就会播放。
   - 特殊状态节点：
      | 节点类型 | 功能 |
      | ---- | ---- |
      | <span class="badge badge--lime" data-appearance="subtle">Entry</span> | 状态机的起点。当游戏对象被激活时，会自动从 <span class="badge badge--lime" data-appearance="subtle">Entry</span> 节点通过一条过渡线进入<span class="badge badge--orange" data-appearance="subtle">默认状态</span>。 |
      | <span class="badge badge--red" data-appearance="subtle">Exit</span> | 当您希望状态机结束并停止时，可以创建一个到 <span class="badge badge--red" data-appearance="subtle">Exit</span> 节点的过渡。 |
      | <span class="badge badge--blue" data-appearance="subtle">Any State</span> | 一个特殊的“万能”起始点。从 <span class="badge badge--blue" data-appearance="subtle">Any State</span> 引出的过渡，意味着无论当前处于哪个状态，只要满足条件，都可以立即切换到目标状态。非常适合处理“死亡”、“受击”这类需要随时能触发的全局性动画。 |

2. 参数 (Parameters)

   参数是您用来从代码中控制状态机逻辑的变量，用于驱动状态过渡。在 Animator 窗口的左侧 Parameters 标签页中可以创建四种参数：
   - `Float`：浮点数类型的参数，通常用于控制动画的速度、强度等。
   - `Int`：整数类型的参数，常用于状态的切换、计数等。
   - `Bool`：布尔类型的参数，用于表示某个条件是否成立，常用于触发动画的开关。
   - `Trigger`：触发器类型的参数，用于一次性触发某个动画，类似于事件。

3. 过渡 (Transitions)

   过渡是连接两个状态的白色箭头，它定义了状态切换的规则和表现。选中一条过渡线，Inspector 中会显示其详细设置：
   | 属性 | 功能 |
   | ---- | ---- |
   | `Solo`/`Mute` | 调试工具。勾选 `Mute` 后，这条过渡会暂时失效；如果一个状态有多条出路，当您勾选其中一条过渡的 `Solo` 后，其他所有从该状态出发的过渡都会被暂时静音。|
   | `Settings` | - |
   | `Has Exit Time` | 如果勾选：当前动画必须播放完毕（或播放到指定的 `Exit Time`），并且满足 `Conditions`，才会发生过渡。适用于需要完整播放的动画，比如一次完整的攻击动作。 <br> 如果取消勾选：只要 `Conditions` 满足，立即打断当前动画并开始过渡。适用于需要快速响应的动作，比如从“跑步”立即切换到“站立”。 |
   | `Exit Time` | 当 `Has Exit Time` 启用时生效。它是一个 0 到 1 之间的值，代表当前动画播放进度的百分比。例如，0.75 意味着当前动画必须播放到其总时长的 75% 之后，过渡才有可能被触发（如果 `Conditions` 也满足的话）。|
   | `Fixed Duration` | 如果勾选：`Transition Duration` (s) 的单位是秒。无论动画片段本身多长，过渡混合的时间都是一个固定的秒数。<br> 如果取消勾选：`Transition Duration` (s) 的单位是百分比。它的值（0到1）代表过渡时间占当前动画片段总时长的百分比。|
   | `Transition Duration` (过渡持续时间) | 两个动画相互混合、平滑过渡所花费的时间。|
   | `Transition Offset` (过渡偏移) | 决定了目标动画（即将要播放的那个动画）应该从哪个时间点开始播放。值为 0 到 1 之间的百分比。|
   | `Interruption Source` (中断源) | 这是处理“过渡被打断”情况的高级设置，决定了正在进行的过渡可以被哪种新过渡打断。<br> 1. `None`：当前过渡不可被打断。<br> 2. `Current State`：只有从当前状态出发的新过渡可以打断它。<br> 3. `Next State`：只有从目标状态出发的新过渡可以打断它。<br> 4. `Current State, then Next State`（或 `Next State, then Current State`）：定义了打断的检查顺序。|
   | `Ordered Interruption` (有序中断) | 只有当新过渡在 `Transitions` 列表中的顺序高于当前正在进行的过渡时，才允许中断发生。这为您提供了一种用排序来定义“打断优先级”的方法。|
   | `Conditions` | 触发这条过渡必须满足的条件列表。这些条件都基于您之前创建的参数。例如，Speed Greater 0.1。|

4. 层 (Layers)

   动画层允许您在身体的不同部位同时播放不同的动画。

   工作方式：像 PhotoShop 的图层一样，上层动画可以覆盖下层动画。
   - `Weight` (权重)：可以设置每一层的权重（影响力），0 代表完全没影响，1 代表完全覆盖。
   - `Mask` (遮罩)：可以为每个层指定一个“身体遮罩 (`Avatar Mask`)”，告诉 Unity 这一层的动画只应该影响身体的哪些骨骼。
   ::: details 经典用例
   `Base Layer`  负责角色的移动（站立、行走、跑步）。

   创建一个新的 `Upper Body Layer`，设置其 `Mask` 为只影响角色的上半身骨骼。在这个层里放置“射击”、“挥手”等动画。

   这样，角色就可以在一边跑步的同时，一边进行射击。
   :::
   - `Blending` (混合模式)：这个下拉菜单决定了当前层的动画如何与它下面的图层相结合。
      - `Override` (覆盖模式)：前层的动画会完全替换或覆盖下面图层的动画（只针对被 `Mask` 指定的身体部位）。
      - `Additive` (叠加模式)：它不会替换下层动画，而是将当前层的动画效果叠加在下面图层的结果之上。
      ::: details 示例
      底层 `Base Layer` 播放“举枪瞄准”的稳定动画。

      上层 `Recoil Layer` 设置为 `Additive` 模式，播放一个非常短暂的“枪械后坐力”动画（这个动画片段里，只有手臂和枪向上小幅度跳动的位移信息）。

      最终效果：角色在稳定瞄准的同时，每次开火，这个后坐力动画就会被叠加在瞄准动作之上，产生一个真实、可控的“上跳”效果，而不会破坏原有的瞄准姿势。另一个常见用途是叠加轻微的“呼吸”动画，让角色在站立或跑步时显得更生动。
      :::
   - `Sync` (同步)：这是一个极其强大的功能，用于跨层复用一整套状态机逻辑，避免重复搭建复杂的 `Animator Controller`。
      - 勾选 `Sync` 后，当前层会完全复制您指定的另一个层（源层，通常是 `Base Layer`）的状态机结构（包括所有状态、过渡和参数）。
      - 同步之后，您可以只替换其中某些状态所使用的 `Animation Clip`，而逻辑保持不变。
      ::: details 示例
      1. `Base Layer` 有一套完整的移动状态机（站立、走路、跑步）。
      2. 您想为角色增加“持剑”状态下的移动，动作和普通状态下完全不同。
      3. 您可以新建一个 `Sword Layer`，勾选 `Sync` 并选择 `Base Layer` 作为源。
      4. 现在 `Sword Layer` 拥有了和 `Base Layer` 一模一样的状态机。
      5. 您只需在 `Sword Layer` 中，将 `Walk` 状态的动画片段替换为 `Sword_Walk`，将 `Run` 状态的片段替换为 `Sword_Run` 即可。
      6. 在游戏中，当玩家拔出剑时，您用代码将 `Sword Layer` 的权重（`Weight`）从 0 调到 1，角色所有的移动动画就无缝切换到了持剑版本，而您完全不需要重新画一遍状态机的连线和逻辑。
      :::
   - `IK Pass` (IK 通道)：IK 指的是反向动力学 (Inverse Kinematics)，是一种通过目标位置来反向计算骨骼链条如何旋转的技术。
      - 勾选 `IK Pass` 会在动画更新流程中开启一个“IK计算通道”。它告诉 `Animator`：在处理完这一层的常规动画后，准备好执行额外的 IK 计算。
      - 真正的 IK 逻辑通常写在脚本的 `OnAnimatorIK()` 这个特殊回调函数里。您必须勾选 `IK Pass`，这个函数才会被调用。
      ::: details 示例
      **脚贴合不平整的地面**：角色的跑动动画是在平地上制作的，但游戏场景的地面凹凸不平。您可以开启 `IK Pass`，然后在 `OnAnimatorIK()` 中检测角色脚下地面的实际高度，通过代码（如 `animator.SetIKPosition`）强制将脚的骨骼“踩”在正确的地面位置上，避免穿模或悬空。

      **手握住动态物体**：角色需要握住车门把手、方向盘或者另一名角色的手。这些目标的位置是动态变化的。通过 IK，您可以让角色的手精确地“粘”在目标上，无论身体如何移动。
      :::


5. 混合树 (Blend Trees)
   
   这是一种特殊类型的状态，它本身不播放单一动画，而是根据一个或多个浮点数参数，平滑地混合多个动画片段。
   - 1D 混合树：根据一个参数混合。最经典的例子就是根据`Speed` 参数，平滑地混合 `Idle`、`Walk` 和 `Run` 三个动画。
   - 2D 混合树：根据两个参数混合。例如，根据`SpeedX` 和 `SpeedY` 两个参数，混合向前、向后、向左、向右跑的动画，实现360度的自由移动。

## `Animator`

`Animator` 组件是连接着动画逻辑蓝图（`Animator Controller`）、骨骼信息（`Avatar`）和游戏对象本身的桥梁。

**核心属性**
- `Controller`

   指定一个 `Animator Controller` 资产。

- `Avatar`

   这里需要指定一个 `Avatar` 资产，它定义了模型骨骼与 Mecanim 系统的映射关系。

   - 对于 Humanoid (人形) 动画，Avatar 是必需的，它使得动画可以被重定向（Retargeting）；对于 Generic (通用) 动画，Unity 也会为其生成 Avatar 来统一管理骨骼信息。

- `Apply Root Motion` 

   用于决定角色的位移是由动画本身还是由代码来控制。
   
   勾选时由动画驱动位移，如果动画本身包含向前的运动，那么角色在游戏世界里就会真的向前移动；不勾选时动画只在原地播放，需通过代码移动角色，这是更常见的做法。

- `Update Mode`

   决定 `Animator` 的更新时机，与游戏的哪个更新循环同步。
   - `Normal`：在常规的 `Update` 循环中更新，与游戏的渲染帧同步。这是默认和最常用的设置
   - `Animate Physics`：在物理 `FixedUpdate` 循环中更新。
   - `Unscaled Time`：动画的更新将忽略游戏的时间缩放 (`Time.timeScale`)。

- `Culling Mode` (剔除模式)

   一项重要的性能优化设置，用于决定当游戏对象在摄像机视野外时，`Animator` 是否播放动画。
   - `Always Animate`：始终播放动画，即使对象不可见。性能开销最大。
   - `Cull Update Transforms`：当对象不可见时，动画状态机仍在后台运行，但不会更新游戏对象的骨骼变换。当对象再次可见时，它会立即“跳”到正确的姿态。这是推荐的默认值，在性能和表现之间取得了很好的平衡。
   - `Cull Completely`：当对象不可见时，整个动画播放都会暂停。当它再次可见时，会从上次暂停的地方继续播放。


**核心 API**


最常用的一类 API 用于修改 `Animator Controller` 中创建的参数，从而驱动状态机发生过渡。此类 API 通常以“set + 数据类型”的方式命名，且需要传入一个和参数名相同的字符串和一个对应的数据值。例如：

```csharp
animator.SetFloat("<Condition Name>", floatValue)
animator.SetBool("<Condition Name>", boolValue)
animator.SetInteger("<Condition Name>", intValue)
animator.SetTrigger("<Condition Name>")
```

此外还可以不通过 `Conditions` 直接播放动画片段，不过这不是推荐的做法：
```csharp
animator.Play("<State Name>", layerIndex, normalizedStartTime);

animator.CrossFade("<State Name>", transitionDuration);
```

::: details 魔法字符串
直接在代码中反复使用字符串（“魔法字符串” - Magic Strings）来设置变量存在很多隐患，健壮性不强。为了解决这个问题，Unity 提供了一个官方推荐的、更健壮、性能更高的方法：`Animator.StringToHash()`。

这个方法的作用是将一个字符串参数名预先转换成一个独一无二的整数 ID。之后，您在调用 `SetFloat` 等方法时，直接传入这个整数 ID 即可。由于整数的比较和传递远比字符串要快，并且我们将字符串的定义集中在了一个地方，代码的健壮性和性能都得到了极大的提升。

**示例**

对于大型项目，为了方便在多个不同脚本中访问这些参数 ID，最佳实践是创建一个专门的静态类来统一管理它们：
```csharp
// 创建一个新脚本 AnimParams.cs
public static class AnimParams
{
    public static readonly int Speed = Animator.StringToHash("Speed");
    public static readonly int IsJumping = Animator.StringToHash("IsJumping");
    public static readonly int Attack = Animator.StringToHash("Attack");
    // ... 在这里添加所有其他参数
}

// 在您的玩家控制脚本中这样使用：
public class PlayerController_Best : MonoBehaviour
{
    private Animator animator;

    void Awake() { animator = GetComponent<Animator>(); }

    void Update()
    {
        // 直接引用静态类，有代码提示，绝不会拼错
        animator.SetFloat(AnimParams.Speed, Input.GetAxis("Vertical"));
        
        if (Input.GetButtonDown("Fire1"))
            animator.SetTrigger(AnimParams.Attack);
    }
}
```
:::

## 2D 序列帧动画
这是最传统、最经典的 2D 动画技术，原理就像手翻书。

**制作流程**
1. 准备精灵图集 (`Sprite Sheet`)：将一个动画的所有帧绘制在一张大图上。
2. 切割精灵：在 Unity 中选中该图片，在 Inspector 中将 `Texture Type` 设为 `Sprite (2D and UI)`，`Sprite Mode` 设为 `Multiple`。然后点击 `Sprite Editor` 按钮。
3. 在 Sprite Editor 窗口中，使用 `Slice` 工具（例如 `Grid By Cell Size`）将大图自动切割成一个个独立的 `Sprite`。
4. 创建动画片段：
   - 在场景中创建一个空对象或一个 `Sprite` 对象。
   - 打开 Animation 窗口（Window > Animation > Animation）。
   - 选中刚刚切割好的所有 `Sprite` 帧，将它们一次性拖拽到 Animation 窗口的时间轴上。
   - Unity 会自动创建一个 `Animation Clip`，并为 `Sprite Renderer` 组件的 `Sprite` 属性在时间轴上创建好所有关键帧。


对于现代 2D 游戏开发，尤其是制作角色和生物动画，2D 骨骼动画是绝对的主流和推荐方案。序列帧动画则更多地用在需要独特艺术风格、UI 元素或特效的场合。

## 2D 骨骼动画

2D 骨骼动画就是一种用虚拟的骨头驱动 2D 图片部件来制作动画的技术。它结合了传统 2D 美术的视觉表现力和类似 3D 骨骼动画的制作效率与控制方式，是现代 2D 动画（尤其是游戏开发）中非常流行和实用的技术。

这套系统主要由以下几个核心部分组成：
- **美术资源 (Sprite)**

   这就是你看到的角色图片。通常，你会把角色的不同部分（如头、躯干、上臂、下臂、手）画在同一张图上，或者分为不同的图层。

- **骨骼 (Bones)**

   一套看不见的、有关节的骨架。你在角色的图片上创建并放置这些骨骼，形成一个父子层级关系（例如，肩部骨骼是上臂骨骼的父级，移动肩膀时，胳膊会跟着动）。

- **网格 (Mesh)**

   为了让图片能像皮肤一样随着骨骼平滑地变形，Unity 会自动或手动地在你的 2D 图片上生成一个三角面片构成的网格。

- **权重 (Weights)**

   这是最关键的一步，也称为刷权重或蒙皮（Skinning）。它定义了图片网格上的每一个顶点受哪些骨骼的影响以及影响的程度。例如，肘部的顶点会同时受到上臂骨骼和下臂骨骼的影响，这样在弯曲手臂时，肘部才能产生平滑自然的形变，而不是生硬的折断。

通过只改变骨骼的位置（Position）、旋转（Rotation）和缩放（Scale），就能驱动整个角色的网格变形，从而创建出走路、跑步、攻击等各种动画。

在 Unity 中制作 2D 骨骼动画，主要依赖一个官方包：`2D Animation`。

## `2D Animation`

`2D Animation`包是一个强大的内置工具集，能让你直接在 Unity 编辑器中为 2D 精灵（`Sprite`）创建骨骼、添加蒙皮权重并制作复杂的骨骼动画。

为了使图片能够动起来，基本需要3个步骤：

**添加骨骼**    ➡    **绑定网格**    ➡    **刷权重**

如此以来，您就可以通过动画操作角色骨骼来制作各种动画了。

这3个步骤主要通过 `Sprite Editor` 中的 `Skinning Editor` 来完成。

### `Skinning Editor` 

`Skinning Editor` 是 `2D Animation` 包中的核心工具之一。它的主要用作将角色图片（Skin）与骨骼（Bones）进行绑定，并调整当骨骼活动时，图片应该如何自然地变形。

窗口右侧包含了制作骨骼，网格和权重的全部工具。
::: info `Skinning Editor` 窗口
![Skinning-Editor-1](./images/Skinning-Editor-1.png)
:::

**Pose**

这个区域主要用于在不创建实际动画的情况下，快速预览和测试你的骨骼绑定效果。
| 工具 | 效果 | 详细描述 |
| ---- | ---- | ---- |
| `Preview Pose` | 预览姿势 | 该模式下你可以在编辑器里直接拖动骨骼，来观察角色的皮肤（网格）是否会跟随骨骼产生理想的形变，且该模式的修改不会保存。 |
| `Restore Pose` | 恢复姿势 | 如果你在预览模式下调整了骨骼，点击此按钮可以将所有骨骼瞬间恢复到它们最初的、未经改动的绑定姿势（Bind Pose）。 |

**Bones**

这个区域用于创建和编辑构成角色骨架的骨骼。
| 工具 | 效果 | 详细描述 |
| ---- | ---- | ---- |
| `Edit Bone` | 编辑骨骼 | 允许你选择、移动、旋转或拉伸已经存在的骨骼。 |
| `Create Bone` | 创建骨骼 | 你可以在图片上点击并拖拽，来创建父子关系的骨骼链（比如从肩膀到手肘，再到手腕）。 |
| `Split Bone` | 分割骨骼 | 将一根选中的骨骼从中间断开，变成两根。这在你需要增加一个新关节（比如在小臂中间增加一个可以弯曲的节点）时非常有用。 |

**Geometry**

这个区域负责管理图片的网格（Mesh）。所谓的网格，就是你看到的图片上那个橙色的、由许多小三角形组成的轮廓。Unity 不是直接让图片变形，而是让这个网格变形，图片则像贴图一样附着在网格上。
| 工具 | 效果 | 详细描述 |
| ---- | ---- | ---- |
| `Auto Geometry` | 自动生成几何体 | 让 Unity 自动分析图片轮廓，并为你生成一套初始的网格。自动生成的网格是一个很好的起点。 |
| `Edit Geometry` | 编辑几何体 | 手动模式，允许你直接拖动网格的顶点（Vertex）来改变网格形状。 |
| `Create Vertex` | 创建顶点 | 在网格上添加新的顶点，以获得更精细的变形控制。 |
| `Create Edge` | 创建边 | 连接两个顶点，形成一条新的边，从而构成新的三角形面片。 |
| `Split Edge` | 分割边 | 在一条已有的边上增加一个顶点，将其一分为二。 |

**Weights**

这是整个绑定过程中最关键也最需要技巧的一步。“权重”决定了每一个网格顶点在多大程度上受到每一根骨骼的影响。

| 工具 | 效果 | 详细描述 |
| ---- | ---- | ---- |
| `Auto Weights` | 自动计算权重 | 会根据每个顶点离不同骨骼的远近，来分配影响权重。自动权重的计算通常在自动生成网格时就已经执行。 |
| `Weight Slider` | 权重滑块 | 选中一块骨骼或者顶点，可以修改其权重值与受到影响的权重；也可修改特定骨骼对于特定边的权重。 |
| `Weight Brush` | 权重笔刷 | 你可以选择一根骨骼，然后像画画一样，用笔刷在网格上涂抹这根骨骼的影响力。可以调整笔刷的大小、硬度等属性。 |
| `Bone Influence` | 骨骼影响检查 | 选中一个或多个顶点后，这里会列出所有对它们有影响的骨骼以及具体的权重值。 |
| `Sprite Influence` | 精灵影响检查 | 在处理由多个精灵组成的复杂角色时，用来查看是哪个精灵的网格顶点（不常用）。 |

**Rig**

提供复制黏贴功能，是用于工作成果。
- `Copy Rig` (复制绑定): 复制当前精灵上所有的骨骼、网格和权重信息。
- `Paste Rig` (粘贴绑定): 将复制好的绑定信息，粘贴到另一个精灵上。如果你有多个外观相似但颜色不同的敌人，只需为一个制作好绑定，然后就可以将这套设置一键复制给所有其他敌人，极大提升效率。

::: details 常见问题

Bone 的 `Depth` 是做什么用的？
- 简单来说，`Depth` 用来决定骨骼的渲染层级顺序，也就是哪根骨骼及其关联的“皮肤”应该显示在更前面，哪个应该在更后面。

`Auto Geometry` 参数详解：
- `Outline Detail`：这个滑块控制生成的网格轮廓与图片实际边缘的贴合紧密程度。
- `Alpha Tolerance` (Alpha 透明度容差)：这个值决定了引擎在确定图片边缘时，应该在多大程度上“容忍”半透明的像素。
- `Subdivide` (细分)：这个滑块用于增加网格内部的顶点密度，它不影响轮廓形状。

权重的 `Normalized` (归一化) 是什么意思？
- `Normalized` 是一个复选框，通常默认勾选。它的作用是强制让每一个网格顶点上，所有骨骼影响权重的总和永远等于 100% (或 1.0)。

`Weight Brush/Slider` 的三种 `Mode`
- `AddAndSubtract`（加/减模式）：直接增加你当前所选骨骼的权重值。按住 Shift 键则变为减少当前骨骼的权重。
- `GrowAndShrink`（增长/缩减模式）：在已有的权重区域边缘进行扩张或收缩。它会自动将边界向外推或向内拉。
- `Smooth`（平滑模式）：它不增加也不减少权重，而是将你涂抹区域内不同骨骼的权重进行混合和平均化，让权重过渡变得平滑。

:::