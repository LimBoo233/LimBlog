# DOTween

> **Animate everything (almost)**

## Introduction

DOTween (Demigiant Tween) 是一款针对 Unity 的高效、类型安全的补间动画 (Tweening) 插件。它允许开发者通过简单的代码，让游戏对象（如 UI、模型、光源等）在指定时间内平滑地改变属性，而无需手动在`Update`中写复杂的计时逻辑。


## Quick Start

概念：

- **Tweener**：控制并动画化某个值的补间动画。
- **Sequence**：一种特殊的补间动画，它不直接控制某个值，而是控制其他的 Tweens，并将它们作为一个组进行动画处理。
- **Tween**：一个通用术语，既可以指 Tweener 也可以指 Sequence。
- **Nested tween**：包含在 Sequence 中的补间动画。

在程序中，**Tween**是**Tweener**和**Sequence**的父类。

前缀：

- **DO**：所有 tween 快捷方式（可以直接从已知对象如`Transform`或`Material`执行 tween 操作）的前缀。也是主类`DOTween`的前缀。
    ```csharp
    transform.DOMoveX(100, 1);
    transform.DORestart();
    DOTween.Play();
    ```
- **Set**：所有可以链式应用于 tween 的设置选项的前缀（`From` 除外，因为它虽然作为设置应用，但本质上不是设置）。
    ```csharp
    myTween.SetLoops(4, LoopType.Yoyo).SetSpeedBased();
    ```
- **On**：所有可以链式应用于 tween 的回调函数的前缀。
    ```csharp
    myTween.OnStart(myStartFunction).OnComplete(myCompleteFunction);
    ```

**Comming soon~**

## 创建一个基本单元：Tweener

Tweener 是 DOTween 中最基本的动画单元。它控制一个值在指定时间内从起始值平滑过渡到目标值。

截至目前，DOTween 支持对以下类型的值进行补间动画：

- C#：`float`、`double`、`int`、`uint`、`long`、`ulong`、`string`
- Unity：`Vector2`、`Vector3`、`Vector4`、`Quaternion`、`Rect`、`RectOffset`、`Color`

（其中部分类型支持特殊的补间方式。）

此外，你还可以创建自定义 DOTween 插件，以支持对自定义值类型进行补间动画。

创建 Tweener 主要有 3 种方式：[通常方式](#通常方式)、[快捷方式](#快捷方式) 和 [其他通用方法](#其他通用方法)。

### 通常方式

通用方式是最灵活的方式，也是其他方式的基石。你可以用它将基本所有类型的值平滑过渡到目标值。

```csharp
static DOTween.TO(getter, setter, to, float duration);
```

> [!NOTE] 方法参数
> <details>
>
> - `getter`：一个返回当前值的函数，形如`() => myValue`。
> - `setter`：一个接受一个值并将其应用到对象上的函数，形如`x => myValue = x`。
> - `to`：目标值。
> - `duration`：动画持续时间（以秒为单位）。
> 
> </details>

通用方法也有 FROM 的变体版本。只需要在 Tweener 后面链式调用一个`From()`，就能让这个动画变成『从目标过来』，而不是『飞向目标』。

Example：

```csharp
DOTween.TO(() => myVector3, x => myVector3 = x, new Vector3(1, 2, 3), 1f);
```

### 快捷方式

DOTween 为一些常见的 Unity 对象提供了快捷方法，例如`Transform`、`Rigidbody`和`Material`。你可以直接通过这些对象的引用启动 tween，并且对象本身会自动被设置为 tween 的目标。

常见写法示例：

```csharp
transform.DOMoveX(3f, 1f);
rigidbody.DOMove(new Vector3(0, 2, 0), 0.8f);
material.DOColor(Color.red, 0.5f);
```

这些快捷方法（除特别标注的情况外）通常也有`FROM`的变体。只需要在`Tweener`后链式调用`From()`，就能把动画从默认的`TO`（到目标值）替为`FROM`（从目标值出发）。

> [!IMPORTANT]
> 当你给 tween 调用`From()`时，目标对象会在代码执行到该行时立刻跳到`FROM`的起始值，而不是等到 tween 正式播放时再跳转。

`From()` 示例：

```csharp
transform.DOMoveX(3f, 1f).From();
material.DOColor(Color.green, 0.6f).From();
transform.DOScale(1.2f, 0.4f).From();
```

> 更多快捷方式请参考官方文档：[DOTween API](https://dotween.demigiant.com/documentation.php#creatingTweener)

### 其他通用方法

这是一些额外的通用方法，用于以特定方式对值进行补间动画。

除特别说明外，这些方法通常也支持`FROM`变体：在`Tweener`后链式调用`From()`，即可让动画从“到目标值（TO）”改为“从目标值出发（FROM）”。

#### `DOTween.Punch`

```csharp
static Tweener DOTween.Punch(
    getter,
    setter,
    Vector3 direction,
    float duration,
    int vibrato = 10,
    float elasticity = 1f
)
```

无`FROM`版本。用于让`Vector3`朝指定方向做一次“冲击”并弹回起点，效果类似弹簧。

> [!NOTE] 方法参数
> <details>
>
> - `getter`：返回当前值的委托，例如`() => myValue`。
> - `setter`：设置当前值的委托，例如`x => myValue = x`。
> - `direction`：冲击方向与力度。
> - `duration`：动画持续时间（秒）。
> - `vibrato`：震动次数，值越大震动越密集。
> - `elasticity`：回弹强度，范围`0`到`1`。
>
> </details>

```csharp
DOTween.Punch(() => myVector, x => myVector = x, Vector3.up * 2f, 1f, 8, 0.8f);
```

#### `DOTween.Shake`

```csharp
static Tweener DOTween.Shake(
    getter,
    setter,
    float duration,
    float strength = 1f,
    int vibrato = 10,
    float randomness = 90f,
    bool ignoreZAxis = true
)
```

无`FROM`版本。用于让`Vector3`在坐标轴上产生抖动效果。

> [!NOTE] 方法参数
> <details>
>
> - `getter`：返回当前值的委托，例如`() => myValue`。
> - `setter`：设置当前值的委托，例如`x => myValue = x`。
> - `duration`：动画持续时间（秒）。
> - `strength`：抖动强度。可用`float`（统一强度）或`Vector3`（各轴独立强度）。
> - `vibrato`：抖动频率。
> - `randomness`：随机角度范围（`0`到`360`，通常不建议超过`90`）。
> - `ignoreZAxis`：`true`时只在`X/Y`轴抖动（`strength`为`Vector3`时不适用）。
>
> </details>

```csharp
DOTween.Shake(() => myVector, x => myVector = x, 1f, 5f, 10, 45f, false);
```

#### `DOTween.ToAlpha`

```csharp
static Tweener DOTween.ToAlpha(getter, setter, float to, float duration)
```

将`Color`的 Alpha 从当前值补间到目标值。

> [!NOTE] 方法参数
> <details>
>
> - `getter`：返回当前值的委托，例如`() => myColor`。
> - `setter`：设置当前值的委托，例如`x => myColor = x`。
> - `to`：目标 Alpha 值。
> - `duration`：动画持续时间（秒）。
>
> </details>

```csharp
DOTween.ToAlpha(() => myColor, x => myColor = x, 0f, 1f);
```

#### `DOTween.ToArray`

```csharp
static Tweener DOTween.ToArray(
    getter,
    setter,
    Vector3[] endValues,
    float[] durations
)
```

无`FROM`版本。让`Vector3`按多段目标值依次补间，缓动作用于每一段而非整体。

> [!NOTE] 方法参数
> <details>
>
> - `getter`：返回当前值的委托，例如`() => myVector`。
> - `setter`：设置当前值的委托，例如`x => myVector = x`。
> - `endValues`：每一段的目标值数组。
> - `durations`：每一段对应的持续时间数组。
> - `endValues`与`durations`的长度必须一致。
>
> </details>

```csharp
Vector3[] endValues = new[]
{
    new Vector3(1, 0, 1),
    new Vector3(2, 0, 2),
    new Vector3(1, 4, 1)
};
float[] durations = new[] { 1f, 1f, 1f };
DOTween.ToArray(() => myVector, x => myVector = x, endValues, durations);
```

#### `DOTween.ToAxis`

```csharp
static Tweener DOTween.ToAxis(
    getter,
    setter,
    float to,
    float duration,
    AxisConstraint axis = AxisConstraint.X
)
```

将`Vector3`的单一轴从当前值补间到目标值。

> [!NOTE] 方法参数
> <details>
>
> - `getter`：返回当前值的委托，例如`() => myVector`。
> - `setter`：设置当前值的委托，例如`x => myVector = x`。
> - `to`：目标值。
> - `duration`：动画持续时间（秒）。
> - `axis`：要补间的轴（如`AxisConstraint.X`、`AxisConstraint.Y`、`AxisConstraint.Z`）。
>
> </details>

```csharp
DOTween.ToAxis(() => myVector, x => myVector = x, 3f, 1f);
DOTween.ToAxis(() => myVector, x => myVector = x, 3f, 1f, AxisConstraint.Y);
```

#### 虚拟补间（Virtual Tween）

```csharp
static Tweener DOTween.To(
    setter,
    float startValue,
    float endValue,
    float duration
)
```

该方法用于补间“虚拟值”，通过`setter`把每一帧计算结果传给外部方法或属性。

> [!NOTE] 方法参数
> <details>
>
> - `setter`：接收补间结果并执行逻辑的委托。
> - `startValue`：起始值。
> - `endValue`：目标值。
> - `duration`：动画持续时间（秒）。
>
> </details>

```csharp
DOTween.To(MyMethod, 0f, 12f, 0.5f);
// 其中 MyMethod 的签名示例：void MyMethod(float value)

DOTween.To(x => someProperty = x, 0f, 12f, 0.5f);
```

## 用 Sequence 组合 Tween

`Sequence`和`Tweener`类似，但它不是直接补间某个属性值，而是把多个`Tweener`或`Sequence`组合成一条时间线统一播放。

你可以把`Sequence`嵌套进另一个`Sequence`，层级深度没有硬性上限。

被编排的 tween 不必首尾相接；你可以用`Insert`在时间线的任意时间点插入动画，实现重叠播放。

需要注意：

- 一个 tween（`Tweener`或`Sequence`）只能嵌套到一个父`Sequence`中，不能在多个`Sequence`里复用同一个实例。
- 父`Sequence`会接管其内部所有子 tween，子 tween 不能再被独立控制。
- 被加入`Sequence`的子 tween 不能设置无限循环（根`Sequence`可以）。

> [!IMPORTANT]
> 不要创建空的`Sequence`，这通常意味着逻辑设计有问题。

创建`Sequence`通常分两步：

1. 创建并保存一个`Sequence`引用。
2. 在启动前向其中添加 tween、间隔和回调。

```csharp
static Sequence DOTween.Sequence()
```

返回一个可用的`Sequence`实例，你可以继续往里追加内容。

```csharp
Sequence mySequence = DOTween.Sequence();
```

> [!NOTE] 使用规则
> <details>
>
> - 以下编排方法必须在`Sequence`开始播放前调用（通常是创建后的下一帧；如果暂停则例外）。
> - 任意要嵌套的`Tweener`或`Sequence`都应先完整配置，再加入父`Sequence`。
> - 延迟和有限循环在嵌套场景中同样有效。
>
> </details>

> [!NOTE] 编排方法
> <details>
>
> - `Append(Tween tween)`：在末尾追加 tween。
> - `AppendCallback(TweenCallback callback)`：在末尾追加回调。
> - `AppendInterval(float interval)`：在末尾追加时间间隔。
> - `Insert(float atPosition, Tween tween)`：在指定时间点插入 tween。
> - `InsertCallback(float atPosition, TweenCallback callback)`：在指定时间点插入回调。
> - `Join(Tween tween)`：与当前末尾 tween 同时播放。
> - `Prepend(Tween tween)`：在最前面插入 tween。
> - `PrependCallback(TweenCallback callback)`：在最前面插入回调。
> - `PrependInterval(float interval)`：在最前面插入时间间隔。
>
> </details>

> [!TIP]
> 你可以创建只包含回调的`Sequence`，把它当作一个轻量计时器使用。

示例 1：分步构建 Sequence

```csharp
Sequence mySequence = DOTween.Sequence();

// 开场先移动
mySequence.Append(transform.DOMoveX(45f, 1f));

// 移动结束后旋转
mySequence.Append(transform.DORotate(new Vector3(0f, 180f, 0f), 1f));

// 整体前置延迟 1 秒
mySequence.PrependInterval(1f);

// 从 0 秒开始插入缩放，使其与主时间线重叠
mySequence.Insert(0f, transform.DOScale(new Vector3(3f, 3f, 3f), mySequence.Duration()));
```

示例 2：链式写法（与上例等价）

```csharp
Sequence mySequence = DOTween.Sequence();
mySequence.Append(transform.DOMoveX(45f, 1f))
    .Append(transform.DORotate(new Vector3(0f, 180f, 0f), 1f))
    .PrependInterval(1f)
    .Insert(0f, transform.DOScale(new Vector3(3f, 3f, 3f), mySequence.Duration()));
```

## Settings, options and callbacks

DOTween 可以通过链式调用为 Tweener 和 Sequence 设置各种选项和回调函数，或者你也可也通过修改全局设置来影响所有 tween 的默认行为。

### 全局设置

通常，你无需修改全局设置。

你可以打开 Tools -> Demigiant -> DOTween Utility Panel -> Preferences 来访问 DOTween 的全局设置。如果是通过代码修改全局设置，需要确保在创建任何 tween 之前执行。

详见官方文档：[DOTween Global Settings](https://dotween.demigiant.com/documentation.php#options)

### Tweener 和 Sequence 设置

#### 属性

`float timeScale`

- 默认值：`1`
- 作用：设置该 tween 的内部播放速度倍率。

```csharp
// 将该 tween 的播放速度设置为 0.5 倍（半速）
myTween.timeScale = 0.5f;
```

> [!TIP]
> 这个值本身也可以被另一个 tween 补间，从而实现平滑的慢动作效果。

#### 链式设置

链式设置适用于几乎所有 tween，并且大多数可以在运行时修改。

> [!IMPORTANT]
> 以下方法必须在 tween 启动前设置，否则无效：`SetAs`、`SetInverted`、`SetLoops`、`SetRelative`。

常用链式设置速览：

- `SetEase(Ease / AnimationCurve / EaseFunction)`：设置缓动。`Sequence` 默认是 `Ease.Linear`。
- `SetAs(Tween other)` / `SetAs(TweenParams params)`：复制另一个 tween 的通用参数（不包含具体 `SetOptions`）。
- `SetAutoKill(bool autoKillOnCompletion = true)`：完成后自动销毁（默认开启）。
- `SetId(object id)`：设置筛选 ID，推荐用 `int` 或 `string`，筛选更快。
- `SetInverted()`：实验性功能，反转起终点逻辑。
- `SetLink(GameObject target, LinkBehaviour behaviour)`：把 tween 与对象生命周期绑定。
- `SetLoops(int loops, LoopType loopType = LoopType.Restart)`：设置循环；`loops = -1` 为无限循环。
- `SetRecyclable(bool recyclable)`：控制 tween 被 Kill 后是回收还是销毁。
- `SetRelative(bool isRelative = true)`：改为相对值补间（`endValue = startValue + endValue`）。
- `SetTarget(object target)`：手动设置筛选目标，快捷方法通常无需手动设置。
- `SetUpdate(UpdateType updateType, bool isIndependentUpdate = false)`：设置更新时机及是否忽略 `Time.timeScale`。

```csharp
transform.DOMoveX(4f, 1f)
    .SetId("supertween")
    .SetEase(Ease.InOutQuint)
    .SetLoops(3, LoopType.Yoyo)
    .SetAutoKill(false);

transform.DOMoveX(4f, 1f).SetLink(aGameObject, LinkBehaviour.PauseOnDisableRestartOnEnable);
transform.DOMoveX(4f, 1f).SetUpdate(UpdateType.Late, true);
transform.DOMoveX(4f, 1f).SetEase(EaseFactory.StopMotion(5, Ease.InOutQuint));
DOTween.To(() => myInstance.aFloat, x => myInstance.aFloat = x, 2.5f, 1f).SetTarget(myInstance);
```

`SetEase` 补充：

- `Back` / `Elastic` 可额外设置 `overshoot`、`amplitude`、`period`。
- `Flash` 系列中：`overshoot` 表示闪烁次数，`period` 表示强度时间分布（`-1` 到 `1`）。
- `EaseFactory.StopMotion(fps, ease)` 可把任意缓动包装成定格动画风格。

```csharp
transform.DOMoveX(4, 1).SetEase(EaseFactory.StopMotion(5, Ease.InOutQuint));
```

> Ease 参考：[easings.net](https://easings.net/)。
> AnimationCurve 能被序列化，在 Inspector 中可视化编辑。 

#### 回调函数

tween 在其生命周期中的各个时刻会触发不同的回调函数。所有回调方法都可以链式调用。

常用回调速览：

- `OnComplete`：tween 完成时触发（包括所有循环）。
- `OnKill`：tween 被销毁时触发。
- `OnPlay`：tween 开始播放时触发（含延迟后）；每次从暂停恢复时也会触发。
- `OnPause`：tween 暂停时触发。
- `OnRewind`：tween 退回起点播放时触发（同一次`Rewind`中不会重复触发）。
- `OnStart`：tween 首次开始播放时触发（含延迟后）。
- `OnStepComplete`：tween 每完成一个循环时触发。
- `OnUpdate`：tween 每帧更新时触发。
- `OnWaypointChange`：tween 当前目标路径点改变时触发。

基础用法示例：

```csharp
transform.DOMoveX(4, 1).OnComplete(MyCallback);
transform.DOMoveX(4, 1).OnStart(MyCallback);
transform.DOMoveX(4, 1).OnUpdate(MyCallback);
transform.DOMoveX(4, 1).OnKill(MyCallback);
```

某些回调（如`OnWaypointChange`）需要接收参数。对于这些情况，使用 Lambda 表达式：

```csharp
// 无参数回调
transform.DOMoveX(4, 1).OnComplete(MyCallback);

// 有参数回调（使用 Lambda）
transform.DOMoveX(4, 1).OnComplete(() => MyCallback(someParam, someOtherParam));

// 路径 tween 回调（接收当前路径点索引）
Vector3[] waypoints = new[] { /* ... */ };
transform.DOPath(waypoints, 1).OnWaypointChange(waypointIndex =>
{
    Debug.Log("Waypoint changed to " + waypointIndex);
});
```

> [!NOTE]
> - Sequence 中的嵌套 tween 的回调也会按正确顺序触发。
> - `OnWaypointChange`是特殊回调，需要接收一个`int`参数（路径点索引）。

### Tweener 专属设置

以下设置仅适用于 `Tweener`，对 `Sequence` 无效。

#### `From`
将 tween 改为 **FROM** 模式（即从“目标值”补间回“当前值”），或者显式指定起始值。

> [!IMPORTANT]
> `From()` 必须链式调用在其他所有设置之前（`SetOptions` 除外）。

- `From()`：当前值作为终点，设定值作为起点。
- `From(bool isRelative)`：是否使用相对坐标。
- `From(T fromValue, bool setImmediately = true)`：显式指定起点值。

```csharp
// 常规：从当前位置移动到 2
transform.DOMoveX(2, 1);

// From：从 2 移动到当前位置
transform.DOMoveX(2, 1).From();

// From Relative：从（当前位置 + 2）移动到当前位置
transform.DOMoveX(2, 1).From(true);
```

#### `SetDelay`
设置启动延迟。

```csharp
// 延迟 1 秒启动
transform.DOMoveX(4, 1).SetDelay(1);
```

> [!NOTE]
> 如果直接对 Sequence 中的 tween 使用 `SetDelay`，不仅会产生延迟，还会像 `PrependInterval` 一样改变 Sequence 的总时长。

#### `SetSpeedBased`
将动画设为**基于速度**。此时 `duration` 参数不再表示“持续时间”，而表示“每秒移动的单位数”。

```csharp
transform.DOMoveX(4, 1).SetSpeedBased();
```

> [!TIP]
> 如果你想实现**恒定速度**移动，请同时设置`SetEase(Ease.Linear)`。

#### `SetOptions`

某些特定类型的 Tweener 拥有特殊的选项（如`Snapping`取整）。如果你使用通用方式`DOTween.To`创建 tween，这些选项不会自动应用，需要通过 `SetOptions` 手动开启。

> [!IMPORTANT]
> `SetOptions` 必须紧跟在 tween 创建方法之后调用，中间不能插入其他设置。

常见选项速览：

- **Vector / Rect / float**：`SetOptions(bool snapping)` —— 是否取整。
- **Color**：`SetOptions(bool alphaOnly)` —— 是否仅补间 Alpha 通道。
- **String**：`SetOptions(bool richTextEnabled, ScrambleMode scrambleMode...)` —— 是否支持富文本，以及乱码效果。
- **Path**：`SetOptions(bool closePath, ...)` —— 是否闭合路径。

```csharp
// 让移动只在整数坐标上进行
transform.DOMove(new Vector3(10, 10, 10), 5).SetOptions(true);

// 文本乱码效果
DOTween.To(()=>myText.text, x=>myText.text=x, "Hello World", 2)
    .SetOptions(true, ScrambleMode.All);
```

详见官方文档：[DOTween SetOptions](https://dotween.demigiant.com/documentation.php#options)

### TweenParams

TweenParams 是一个专门用来存储 tween 设置的类。你可以创建一个 TweenParams 实例，配置好一系列设置，然后把它分配给多个 tween。

```csharp
// Store settings for an infinite looping tween with elastic ease

TweenParams tParams = new TweenParams().SetLoops(-1).SetEase(Ease.OutElastic);

// Apply them to a couple of tweens
transformA.DOMoveX(15, 1).SetAs(tParams);
transformB.DOMoveY(10, 1).SetAs(tParams);
```

## 控制 Tween 的播放

你有 3 种方式来控制 Tween 动画。

它们的方法名大体一致，主要区别是：如果使用快捷扩展方法（shortcut-enhanced），方法名前需要加 `DO` 前缀。

### 主要控制方式

#### 1. 通过静态方法与过滤器

`DOTween` 类提供了许多控制动画的全局静态方法。每个控制动作通常有两个版本：

- `All` 版本（例如 `DOTween.KillAll()`）：作用于当前场景中所有存在的动画。
- 过滤版本（例如 `DOTween.Kill(myTargetOrId)`）：通过 `id` 或 `target`（目标）进行精准操作。

> [!NOTE]
> `id` 是你通过 `.SetId()` 手动设置的标签；`target` 是使用快捷方法创建动画时，DOTween 自动绑定的对象。

这些静态方法通常会返回一个 `int`，表示实际成功执行该操作的动画数量。

```csharp
// 暂停全场所有的动画
DOTween.PauseAll();

// 暂停所有标签 (id) 为 "badoom" 的动画
DOTween.Pause("badoom");

// 暂停所有作用于 someTransform 这个目标 (target) 上的动画
DOTween.Pause(someTransform);
```

#### 2. 直接通过动画实例调用

你也可以直接用你保存的动画实例引用，来调用同名方法。

```csharp
// 直接暂停这个特定的动画
myTween.Pause();
```

#### 3. 通过快捷扩展方法调用

和上面的逻辑类似，但你是直接在具体的游戏对象（比如 Transform）上调用。请记住，在这种情况下，为了将它们与对象本身自带的方法区分开来，方法名需要加上 DO 前缀。

```csharp
// 暂停 transform 这个物体上挂载的所有动画
transform.DOPause();
```

### 控制方法

这些控制方法在三种调用方式中名称基本一致：

- 全局静态：如 `DOTween.PauseAll()`
- Tween 实例：如 `myTween.Pause()`
- 快捷扩展：如 `transform.DOPause()`（多了 `DO` 前缀）

> [!IMPORTANT]
> 如果希望在 tween 结束后继续对它调用控制方法，需要提前设置 `SetAutoKill(false)`；否则 tween 完成时会被自动销毁。

常用控制方法速览：

- `CompleteAll` / `Complete(bool withCallbacks = false)`：直接跳到终点（无限循环 tween 无效）；`withCallbacks` 仅对 `Sequence` 有效。
- `FlipAll` / `Flip()`：倒放。
- `GotoAll` / `Goto(float to, bool andPlay = false)`：跳转到指定时间点；`andPlay=true` 时跳转后继续播放。
- `KillAll` / `Kill(bool complete = false, params object[] idsOrTargetsToExclude)`：销毁 tween；可先完成再销毁。`KillAll` 可排除指定 `id/target`。
- `PauseAll` / `Pause()`：暂停。
- `PlayAll` / `Play()`：播放。
- `PlayBackwardsAll` / `PlayBackwards()`：倒放。
- `PlayForwardAll` / `PlayForward()`：正向播放。
- `RestartAll` / `Restart(bool includeDelay = true, float changeDelayTo = -1)`：重启；可选择是否包含延迟，并可覆盖延迟值。
- `RewindAll` / `Rewind(bool includeDelay = true)`：回到起点并暂停。
- `SmoothRewindAll` / `SmoothRewind()`：平滑回退到起点（不包含延迟），并跳过已完成循环（`LoopType.Incremental` 除外）。
- `TogglePauseAll` / `TogglePause()`：在播放和暂停之间切换。

### 特殊控制方法

- `ForceInit()`：可用于 `Tween`、`Tweener`、`Sequence`，强制立即初始化。适合在播放前读取初始化后才可用的数据（如路径长度）。
- `GotoWaypoint(int waypointIndex, bool andPlay = false)`：仅适用于路径 tween，且要求 `Linear` 缓动；跳转到指定路径点。若 `waypointIndex` 超出范围，会跳到最后一个路径点。

> [!NOTE]
> `GotoWaypoint` 跳转后 `LookAt` 方向可能不准确，必要时需要手动修正。

```csharp
myPathTween.GotoWaypoint(2);
```

## 获取 Tween 信息

函数名已经很清晰了，这里就不赘述了。详见官方文档：[Getting data from tweens](https://dotween.demigiant.com/documentation.php#gettingData)。

## 协程与 Tasks

DOTween 支持将 tween 转为 Unity 协程或 C# 任务，以便接入异步流程。两套 API 方法名一致，主要区别在返回类型；这里仅整理 `Task` 版本。

- `AsyncWaitForCompletion()`：等待 tween 被销毁或完整结束。
- `AsyncWaitForElapsedLoops(int elapsedLoops)`：等待 tween 被销毁，或已完成指定循环次数。
- `AsyncWaitForKill()`：等待 tween 被销毁。
- `AsyncWaitForPosition(float position)`：等待 tween 被销毁，或到达指定时间位置（包含循环时间，不包含延迟时间）。
- `AsyncWaitForRewind()`：等待 tween 被销毁，或已回退到起点。
- `AsyncWaitForStart()`：等待 tween 被销毁，或首次进入播放状态（包含可能存在的启动延迟）。

```csharp
await myTween.AsyncWaitForCompletion();
```

## 更多方法

### 虚拟方法（DOVirtual）

所谓的 Virtual Methods，指的是那些不绑定任何具体游戏物体，只负责生成一段随时间变化的数值的方法。

> [!NOTE]
> 虚拟方法不能放入 `Sequence`。

这些方法会创建 virtual tween 并在每帧通过回调返回当前值。你仍可对返回的 tween 使用常规链式设置，但不要再使用 `OnUpdate`，否则会覆盖 `onVirtualUpdate`。

- `static Tweener DOVirtual.Float(float from, float to, float duration, TweenCallback<float> onVirtualUpdate)`
    对虚拟 `float` 做补间。

- `static Tweener DOVirtual.Int(int from, int to, float duration, TweenCallback<int> onVirtualUpdate)`
    对虚拟 `int` 做补间。

- `static Tweener DOVirtual.Vector3(Vector3 from, Vector3 to, float duration, TweenCallback<Vector3> onVirtualUpdate)`
    对虚拟 `Vector3` 做补间。

- `static Tweener DOVirtual.Color(Color from, Color to, float duration, TweenCallback<Color> onVirtualUpdate)`
    对虚拟 `Color` 做补间。

- `static float DOVirtual.EasedValue(float from, float to, float lifetimePercentage, Ease easeType / AnimationCurve animCurve)`
    根据缓动类型与生命周期百分比（`0` 到 `1`）计算当前 `float` 值。

- `static Vector3 DOVirtual.EasedValue(Vector3 from, Vector3 to, float lifetimePercentage, Ease easeType / AnimationCurve animCurve)`
    根据缓动类型与生命周期百分比（`0` 到 `1`）计算当前 `Vector3` 值。

- `static Tween DOVirtual.DelayedCall(float delay, TweenCallback callback, bool ignoreTimeScale = true)`
    延迟触发回调，并返回可管理的 `Tween`（可暂停、销毁等）。

Example：

```csharp
// 从 0 补间到 100，持续 1 秒，每帧打印当前值
DOVirtual.Float(0, 100, 1, value => Debug.Log("Current value: " + value));
```

### 额外方法

这部分属于几何数学工具。在游戏开发中，如果你想让物体不是走直线，而是走那种丝滑的曲线（比如抛物线或 S 型路径），就需要贝塞尔曲线。

以下方法用于处理三次贝塞尔曲线分段：

- `DOCurve.CubicBezier.GetPointOnSegment(...)`
    计算曲线分段上某一百分比位置（`factor` 为 `0` 到 `1`）的点。

- `DOCurve.CubicBezier.GetSegmentPointCloud(..., int resolution = 10)`
    返回该曲线分段的点云数组；`resolution` 最小为 `2`。

- `DOCurve.CubicBezier.GetSegmentPointCloud(List<Vector3> addToList, ..., int resolution = 10)`
    计算点云并追加到已有 `List<Vector3>`（不会自动清空原列表）。

## 编辑器扩展

用于在 Unity 编辑器中预览 tween（非 Play Mode）。

- `DOTweenEditorPreview.PrepareTweenForPreview(bool clearCallbacks = true, bool preventAutoKill = true, bool andPlay = true)`

    将指定 tween 准备为编辑器预览模式：把更新方式设为 `Manual`，并应用额外预览设置。
    - `clearCallbacks`：为 `true` 时（推荐）移除预览期间的回调（如 `OnComplete`、`OnRewind` 等）。
    - `preventAutoKill`：为 `true` 时，预览结束时不自动销毁 tween。
    - `andPlay`：为 `true` 时，准备完成后立即播放。

- `DOTweenEditorPreview.Start(Action onPreviewUpdated = null)`

    启动编辑器中的 tween 预览更新循环；在 Play Mode 下无效。
    - 调用前需先使用 `DOTweenEditorPreview.PrepareTweenForPreview` 将 tween 加入预览循环。
    - `onPreviewUpdated`：每次预览更新后触发的可选回调。

- `DOTweenEditorPreview.Stop()`

    停止预览更新循环，并清理已注册的回调。

Example：

::: code-group

```csharp [MyPreviewEditor.cs]
[CustomEditor(typeof(MyPreviewObject))]
public class MyPreviewEditor : Editor
{
    public override void OnInspectorGUI()
    {
        // 1. 绘制默认的 Inspector 内容（变量等）
        DrawDefaultInspector();

        MyPreviewObject script = (MyPreviewObject)target;

        GUILayout.Space(10);

        // 2. 创建预览按钮
        if (GUILayout.Button("▶ 预览 DOTween 动画"))
        {
            // 创建动画实例
            Tween myTween = script.CreateMyTween();

            // 核心步骤：准备预览（会自动处理不销毁、不执行回调等）
            DOTweenEditorPreview.PrepareTweenForPreview(myTween);

            // 启动编辑器更新循环，让动画动起来
            DOTweenEditorPreview.Start();
        }

        // 3. 创建停止按钮（良好的习惯）
        if (GUILayout.Button("■ 停止并重置"))
        {
            DOTweenEditorPreview.Stop();
            // 可选：手动把物体位置重置回原点，方便反复调试
        }
    }
}
```

```csharp [MyPreviewObject.cs]

public class MyPreviewObject : MonoBehaviour
{
    // 定义动画逻辑，返回一个 Tween 方便编辑器脚本调用
    public Tween CreateMyTween()
    {
        // 比如：做一个简单的跳跃并旋转
        return transform.DOJump(transform.position + Vector3.right * 2, 2, 1, 1f)
                        .Join(transform.DORotate(new Vector3(0, 360, 0), 1f, RotateMode.FastBeyond360));
    }
}
```

:::