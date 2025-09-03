# Unity-InputSystem

Unity 的新输入系统将抽象的操作与具体的物理按键彻底分离开来。相比于老系统，新系统通过可视化的输入操作资源让你能轻松地为同一个操作绑定多个不同设备的按键，并内置了对长按、连击等复杂交互的强大支持，同时通过事件驱动的方式让代码更整洁、逻辑更清晰。

官方文档：[Input System 1.14.2](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.14/manual/index.html)

## 导入

在 Unity6 的 URP 项目当中，Input System 已经会自动导入到项目中。如果需要切换输入系统，可以修改 Edit > Project Settings > Player 中的 Active Input Handling。

项目创建好时，Unity 会自动为你生成一个默认的 Input Actions 资产，叫做 `InputSystem_Actions`。这个资产会作为项目的 Project-wide Actions，即为整个项目指定的一个默认的输入操作资源。如若需要替换，可以在 Project Setting 中的 Input System Package 选项中进行修改。

## 纯粹代码获取输入

可以通过代码直接获取当前键盘来判断输入。这种方式和老的 Input Manager 类似，采用硬编码的形式，也因此不推荐在实际开发中使用。

**代码示例**
::: code-group
```csharp [EX1.cs]
// 获取当前连接的键盘
Keyboard keyboard = Keyboard.current;

// 检查 'A' 键本帧是否被按下
if (keyboard.aKey.wasPressedThisFrame)
    Debug.Log("A key was pressed this frame!");

// 检查左 Shift 键是否被按住
if (keyboard.leftShiftKey.isPressed)
    Debug.Log("Left Shift key is being held down.");

// 检查左 Shift 键本帧是否被释放
if (keyboard.leftShiftKey.wasReleasedThisFrame)
    Debug.Log("Left Shift key was released this frame!");
```

```csharp [EX2.cs]
// 订阅 onTextInput 事件，并指定当事件发生时调用 OnTextInput 方法
private void OnEnable()
{
    Keyboard.current.onTextInput += OnTextInput;
}

// 必须在 OnDisable 中取消订阅，防止内存泄漏
private void OnDisable()
{
    Keyboard.current.onTextInput -= OnTextInput;
}

// 当文本输入事件发生时，这个方法会被自动调用
private void OnTextInput(char character)
{
    // 处理文本输入事件
}
```

```csharp [EX3.cs]
// 检查本帧是否有任意键被按下
if (Keyboard.current.anyKey.wasPressedThisFrame)
{
    // 在这里写跳转场景、关闭UI等逻辑
}
```
:::

鼠标输入也是同种形式，且因为不常用不再赘述。

## `InputAction`

`InputAction` 类是对一个命令的抽象，其关注的是玩家的意图，而非具体按下的按键。

虽然你可以在类中声明一个 `InputAction` 字段然后在 Inspector 中编辑，但更常见的作法是在 `.inputactions` 资产文件中集中管理各种 `InputAction`。

**Action Properties：**

- `Action Type`

    决定了一个 Action 应该如何处理、整合以及最终输出从其绑定（Bindings）接收到的原始输入信号。

    | Action Type | 描述 |
    |---|---|
    | `Button` | 用于表示任何按下/松开的离散操作。如果一个开关，只有开和关两种状态。 |
    | `Value` | 用于表示连续变化的、可以是任意维度的模拟信号。可以代表一个具体的数值。 |
    | `Pass Through` | 类似于 `Value`，区别在于如果有多个设备绑定这个 Action，它会将所有设备的输入都传递给绑定的事件。 |

- `Control Type`

    输入系统会根据 `Control Type` 筛选出对于的物理控件，并会把从这些控件接收到的信号转换成一种特定的数据格式。

    | 常用的 Control Type | 描述 | 输出类型 |
    | --- | --- | --- |
    | `Axis` |  用于表示一维的、连续变化的模拟值。 | `float` |
    | `Vector 2` | 表示二维的方向和幅度。 | `Vector2` |
    | `Vector 3` | 表示三维的方向和幅度。 | `Vector3` |

- `Interactions`

    定义输入必须如何被执行才能触发一个 Action。简单来说，`Interactions` 可以帮我我们简单实现诸如长按、连击等复杂交互。

    | 常用的 Interactions | 描述 | 意义 |
    | --- | --- | --- |
    | `Hold` | 长按 | 检测一个控件是否被按住超过了指定的时间。 |
    | `Press` | 按下 | 定义按键触发时机（按下/松开/两者） |
    | `Tap` | 点击 | 可以设置一个单次点击的持续时间（`Max Tap Duration`）。按下按键 (`Started`)，如果用户在持续时间内松开，`Performed` 事件就会在松开的瞬间触发，反之则触发 `Canceled`。|
    | `Slow Tap` | 慢点击 | 类似 `Tap`。当你按下按键并超过持续时间后，松开按键触发 `Performed`。 |
    | `Multi-Tap` | 多次点击 | 可以设置一个 `Tap Count`，表示在指定时间内需要按下的次数。 |

    其中所有 `Interactions` 都会有一个 `Press Point` 参数，代表一个按压阈值。很多设备（ex：手柄）的按键不只有按下和松开两个状态，还有类似半按、轻推的状态。`Press Point` 通过设立0.0~1.0的临界值，只有当扳机键的输入值大于或等于这个值时，才会被视为按下而非误触。

    此外还有一个 `Initial State Check`。默认情况下，如果在一个 Action 被启用时，它所绑定的某个按键已经处于被按下的状态，那么默认情况下 Action 对此一无所知。开启 `Initial State Check` 后，Action 会在启用时立即检查所有绑定的按键状态，并根据这些状态决定是否触发事件。

::: info `InputAction` 的事件
1. `Started`：按键首次被按下时触发。
2. `Performed`：满足条件时触发。
3. `Canceled`：总是在用户松开按键等导致当前输入行为结束时触发。
:::

- `Processors`

    可以对原始输入的值行一系列的加工处理（比如过滤、反转、缩放），最后才将一个干净、规整的最终值传递给你的 `InputAction` 和游戏代码。

    | Processor | 描述 |
    |---|---|
    | `Clamp` | 限制输入值在一个指定的范围内。 |
    | `Invert` | 反转输入值（取反）。 |
    | `Scale` | 缩放输入值。 |
    | `Normalize` | 将输入值归一化到一个标准范围内（通常是0~1之间）。 |
    | `Normalize Vector 2` | 标准化向量。 |
    | `Scale` | 缩放。 |
    | `Axis Deadzone` | 忽略单个轴向的微小输入，会将其视为0。 |
    | `Stick Deadzone` | 忽略摇杆中心的微小输入，会将其视为0。 |

## 添加按键绑定

右键 Action 后即可添加绑定。总共有四种类型的绑定：

1. `Add Binding`

    用于将单个物理按键、摇杆轴或鼠标移动，直接映射到一个 Action。

2. `Add Positive/Negative Binding`

    创建一个 1D Axis (一维轴) 复合绑定 (Composite Binding)。

    核心用途: 使用两个相反的按键（比如 A 和 D）来模拟一个一维轴（比如左右移动），输出一个从 `-1.0` 到 `1.0` 的 `float` 值。

3. `Add Binding With One/Two Modifiers`

    用于创建一个带修饰键的复合绑定，也就是我们常说的组合键或快捷键。

    核心用途: 实现像 Ctrl + S 或 Ctrl + Shift + P 这样的输入。

    结构: 它会创建一个父绑定，下面带有子绑定：

    - Modifier (修饰键)：指定哪个键是必须被按住的（如 Ctrl, Shift, Alt）。

    - Binding (按键):指定在修饰键被按住的前提下，需要按下的那个主键（如 S）。

4. 此外还有一些和 `Control Type` 关联的 Bindings，例如：`Add Up/Down/Left/Right Composite`

::: tip
Bindings 里也有 `Interactions` 和 `Processors`。默认情况下，`Processors` 是串联的：先执行绑定的，再执行 Action 的；而一个输入行为必须同时满足两者的 `Interactions` 条件才能触发 `Performed` 事件。

但绝大多数情况下（可以说95%以上），你应该将 `Interactions` 和 `Processors` 直接添加到具体的 Binding 上。
:::

## 全局设置

Project Settings -> Input System Package 里的这些全局设置会影响项目中的所有输入行为，但大部分都可以在具体的 Binding 或 Action 上被覆盖（Override）。

此处只介绍几个，不易直观理解的选项：

- `Update Mode`

    - 它决定了 Input System 在何时处理输入事件和更新状态。这与 Unity 的 `Update` 和 `FixedUpdate` 生命周期紧密相关。

    | 选项 | 描述 |
    |---|---|
    | `Dynamic Update` | **这是默认且最推荐的选项。** 它会根据当前的更新模式自动选择最合适的时机。绝大多数情况下，它会与 `Update()` (游戏逻辑帧) 同步。 |
    | `Fixed Update` | 在每一帧的 `FixedUpdate` 中处理输入。 |
    | `Manual Update` | 禁用自动更新。你需要自己在代码的某个地方手动调用 `InputSystem.Update()` 来驱动系统。|

- `Background Behavior`

    - 它定义了当你的游戏窗口失去焦点（如切到桌面）时，输入系统该如何工作。

    | 选项 | 描述 |
    |---|---|
    | `Reset And Disable All Actions` | 这是独立平台（PC/Mac/Linux）的默认行为。当窗口失焦时，所有按下的按键状态都会被重置（比如角色会停止移动），并且系统不再监听输入。 |
    | `Ignore Focus` | 即使窗口在后台，输入系统仍然会像在前台一样处理所有输入。 |

- `Supported Devices`

    -  一个列表，告诉 Unity 你的游戏打算支持哪些类型的输入设备。

    - 这主要是一个性能优化选项。Input System 只会加载和监听列表中存在的设备类型。

    - 注意：从列表中移除设备不会神奇地让你的游戏不支持它，只会让 Input System 主动忽略它。


除了可以在 Actions 和 Bindings 覆盖的其他选项，其余未选项通常保持默认即可。（ex：`Scroll Delta Behavior` 滚轮增量行为、`Compensate Orientation` 移动设备传感器方向补偿）