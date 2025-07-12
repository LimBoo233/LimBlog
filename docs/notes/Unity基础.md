# Unity基础

## 补充：调试画线
```c#
// 画线段
// 起点 终点 颜色
Debug.DrawLine(a, a + b, Color.red);
// 起点 终点 颜色 持续时间
Debug.DrawLine(a, a + b, Color.red, 1f);

// 画射线
// 起点 方向和长度 颜色
Debug.DrawRay(a, transform.forward, Color.red);
```

## 3D数学 基础


### Mathf
1. Mathf 和 Math
    - Math 是 C# 封装好的用于数学计算的工具类，位于System命名空间下。
    - Mathf 是 Unity 封装好的用于数学计算的工具结构体，位于UnityEngine命名空间下。
2. 区别
    - Mathf 和 Math 中相关的方法几乎一样。
    - Mathf 是Unity专门封装的，不仅包含 Math 中的方法，还包含一些适用于游戏开发的方法。
    - **所以我们在进行 Unity 游戏开发的时候使用 `Mathf` 中的方法即可。**
3. Mathf 中的常用方法 —— 一般只计算一次
    - `Mathf.PI`：圆周率
    - `Mathf.Abs`：返回绝对值
    - `Mathf.CeilToInt`：向上取整
    - `Mathf.FloorToInt`：向下取整
    - `Mathf.RoundToInt`：四舍五入取整
    - `Mathf.Clamp`：限制值在指定范围内
    - `Mathf.Max`：返回最大值
    - `Mathf.Min`：返回最小值
    - `Mathf.Pow`：返回幂
    - `Mathf.Sqrt`：返回平方根
    - `Mathf.Sign`：返回一个数的正负（1 或 -1）
4. Mathf 中的常用方法 —— 一般需要多次计算
    - `Mathf.Lerp`
        - 线性插值
        - `Mathf.Lerp(a, b, t)`：返回 a 和 b 之间的插值。t 为插值系数，范围在 0 到 1 之间。
        - result = a + (b - a) * t
        - 用法一：变化速度咁快后慢，位置无限接近 end，但永远不会到达 end。
        ```c#
        float start = Mathf.Lerp(start, end, Time.deltaTime);
        ```
        - 用法二：匀速变化，位置会到达 end。
        ```c#
        time += Time.deltaTime;
        result = Mathf.Lerp(start, end, time);
        ```
### 三角函数
1. 弧度角度相互转化
    ```c#
    // 弧度转角度
    float radian = 1;
    float degree = radian * Mathf.Rad2Deg; 

    // 角度转弧度
    float degree = 1;
    float radian = degree * Mathf.Deg2Rad; 
    ```
2. 三角函数
    - 掺入的参数需要为弧度值。
    ```c#
    // 正弦
    Mathf.Sin(Mathf.PI / 2); // 1
    // 余弦
    Mathf.Cos(Mathf.PI * 2); // 1
    ```
3. 反三角函数
    - 返回值为弧度。
    ```c#
    // 反正弦
    Mathf.Asin(1); // PI / 2
    // 反余弦
    Mathf.Acos(1); // 0
    // 反正切
    Mathf.Atan(1); // PI / 4
    ```

### 向量
1. 向量的加减
    ```c#
    Vector3 a = new Vector3(1, 2, 3);
    Vector3 b = new Vector3(4, 5, 6);
    // 两点确定一条直线
    Vector3 ab = b - a; // 结果为 (3, 3, 3)

    Vector3 sum = a + b; // 结果为 (5, 7, 9)

    // 负向量
    Vector3 c = -a; // 结果为 (-1, -2, -3)
    ```

2. 向量取模
    ```c#
    // 向量的模长
    float magnitude = a.magnitude; 

    // 两个向量的距离
    Vector3.Distance(a, b); 
    ```

3. 单位向量
    ```c#
    // 单位向量
    Vector3 normalized = a.normalized; 
    ```

4. 通过点乘判断方位
    ```c#
    // 点乘
    float dotProduct = Vector3.Dot(a, b);

    if (dotProduct > 0)
    {
        // a 和 b 方向相同
    }
    else if (dotProduct < 0)
    {
        // a 和 b 方向相反
    }
    else
    {
        // a 和 b 垂直
    }
    ```

    **如何计算两个向量之间的夹角?**

    首先，我们知道点积的几何定义公式是：
    `a ⋅ b = ∣a∣ ⋅ ∣b∣ ⋅ cos(θ)`

    通过这个公式，我们可以推导出夹角 θ 的计算公式：
    `θ = acos((a ⋅ b) / (∣a∣ ⋅ ∣b∣))`

    其实也就是两个单位向量点乘。

    Unity自带的方法：
    ```c#
    // 范围永远在 0 到 180 度之间
    Vector3 angle = Vector3.Angle(a, b);
    ```

5. 向量的叉乘

    叉乘（Cross Product）是两个三维向量的运算，结果是一个垂直于原来两个向量的新向量。

    **计算公式：**
    `a × b = (a.y × b.z - a.z × b.y, a.z × b.x - a.x × b.z, a.x × b.y - a.y × b.x)`

    **几何意义：**
    - 叉乘的结果向量垂直于参与运算的两个向量。
    - 叉乘结果向量的长度等于两个向量构成的平行四边形的面积。
    - 方向遵循右手定则：四指从第一个向量转向第二个向量，拇指指向为叉乘结果方向。

    **Unity中的使用：**
    ```c#
    Vector3 a = new Vector3(1, 0, 0);
    Vector3 b = new Vector3(0, 1, 0);

    // 叉乘运算
    Vector3 crossProduct = Vector3.Cross(a, b);
    // 结果为 (0, 0, 1)，垂直于 a 和 b

    // 计算两个向量构成的平行四边形面积
    float area = crossProduct.magnitude;
    ```

    **实际应用场景：**
    - **判断物体的左右方位**：结合点乘和叉乘可以准确判断目标在自己的左侧还是右侧。
    - **计算法向量**：为平面或三角形计算垂直向量。
    - **计算旋转轴**：两个向量的叉乘可以作为旋转轴。
    - **物理计算**：计算力矩、角动量等。

    **判断左右方位示例：**
    ```c#
    Vector3 forward = transform.forward;  // 自身朝向
    Vector3 toTarget = (target.position - transform.position).normalized;

    Vector3 cross = Vector3.Cross(forward, toTarget);

    if (cross.y > 0)
    {
        Debug.Log("目标在右侧");
    }
    else if (cross.y < 0)
    {
        Debug.Log("目标在左侧");
    }
    else
    {
        Debug.Log("目标在正前方或正后方");
    }
    ```

    **注意事项：**
    - 叉乘不满足交换律：`a × b ≠ b × a`，实际上 `a × b = -(b × a)`。
    - 两个平行向量的叉乘结果为零向量。
    - 叉乘只适用于三维向量，二维向量没有叉乘运算。

6. 向量插值

    类似于 `Mathf.Lerp()`。

    **线性插值：**
    ```c#
    // 先快后慢
    A.position = Vector3.Lerp(A.position, target.position, Time.deltaTime);

    // 匀速 确保在 1s 抵达
    if (endPos != target.position) 
    {
        time = 0;
        startPos = B.position;
        endPos = target.position;
    }
    time += Time.deltaTime;
    B.position = Vector3.Lerp(startPos, endPos, time);
    ```

    **球形插值：**

    使用较少。可以用来模拟太阳轨迹。
    
    感觉可以用在角色转身之类的地方。
    
    ```c#
    C.position = Vector3.Slerp(startPos, endPos, time);
    ```

### 四元数 Quaternion
- 欧拉角
    - 直观易理解。
    - 储存空间小。
    - 可以旋转180度以上。
    - 同一旋转表示不唯一。
    - 万向节死锁。
    ```c#
    print(transform.eulerAngles);
    ```

#### 万向节死锁
推荐视频：[无伤理解欧拉角中的“万向死锁”现象](https://www.bilibili.com/video/BV1Nr4y1j7kn)

万向节死锁（Gimbal Lock）是欧拉角旋转系统中的一个经典问题，当其中一个旋转轴与另一个旋转轴重合时，就会失去一个自由度，导致某些旋转无法表示。

**万向节死锁的本质是自由度的丢失。**
- 标准的欧拉角使用三个独立的旋转（例如，绕X轴，然后绕Y轴，最后绕Z轴）来定义一个朝向。问题出在中间那个轴的旋转上。
- 以常用的 Y-X-Z 旋转顺序为例：
    1. 首先绕世界Y轴旋转（偏航, Yaw）。
    2. 然后绕世界X轴旋转（俯仰, Pitch）。
    3. 最后绕世界Z轴旋转（翻滚, Roll）。
    - *当中间的旋转轴（X轴）旋转了 ±90 度时，万向节死锁就发生了。*

::: details **为什么“静态欧拉角”为何也无法幸免？**
假设你把一个静态摄像机的位置设置为欧拉角 (Pitch=90°, Yaw=40°, Roll=50°)。

表面上看：摄像机固定不动，似乎没问题。
潜在的问题：这个姿态本身就处于万向节死锁中。如果你想在这个姿态的基础上，进行一个微小的“偏航”调整（比如想让它向左看一点点），你会发现你无法通过简单地修改 Yaw 值来实现。在这个状态下，改变 Yaw 值会导致 Pitch 值的变化，从而使摄像机失去控制。
:::


#### 解决方案——四元数
四元数是一种数学概念，它扩展了我们熟知的复数，主要用于在三维空间中表示旋转和方向。

你可以将一个单位四元数（长度为1的四元数，用于表示纯旋转）想象成一个“旋转指令”。
- 这个指令包含一个旋转轴 (x,y,z)。
- 这个指令还包含一个旋转角度 θ。

四元数 q = w + xi + yj + zk 将这两者巧妙地编码在一起：
- w = cos( θ/ 2 ) 
- x = sin( θ/ 2 ) * axis.x
- y = sin( θ/ 2 ) * axis.y
- z = sin( θ/ 2 ) * axis.z
> warning 四元数的具体原理较为复杂，感兴趣可以查阅相关资料。此处仅介绍其在 Unity 中的使用。

```c#
// 传统方法：q = w + xi + yj + zk
Quaternion q = new Quaternion(Mathf.Sin(θ / 2), 0, 0, Mathf.Cos(θ / 2));

// 角度 - 轴
Quaternion q = Quaternion.AngleAxis(θ * Mathf.Rad2Deg, axis);
```

**与欧拉角的相互转化**
```c#
// 欧拉角转四元数
Quaternion q = Quaternion.Euler(eulerAngles);

// 四元数转欧拉角
Vector3 euler = q.eulerAngles;
```

**四元数的旋转**

四元数的旋转非常简单，只需要将四元数与向量相乘即可：
```c#
transform.rotation *= Quaternion.AngleAxis(angle, Vector3.up);
```
这里的 `Vector3.up` 表示的是世界坐标系。

#### 单位四元数

单位四元数 (Unit Quaternion) 就是一个专门用来表示纯粹旋转（即不拉伸、不缩放）的四元数。

- 在数学里，“单位”这个词通常意味着“长度为1”。
    - 单位向量 (Unit Vector) 是一个长度为1的向量，它只表示方向，不表示大小。
    - 同样，单位四元数 就是一个“长度”为1的四元数。

    例如，“不进行任何旋转”这个状态，可以用单位四元数 q = 1 + 0i + 0j + 0k 来表示。

- 从“功能”上来理解：
    这是最关键的一点。为什么我们关心它的长度是不是1？
    - 单位四元数 = 纯旋转
    - 非单位四元数 = 旋转 + 缩放

    在游戏开发、动画和机器人学中，我们绝大多数时候只想旋转一个物体，而不想在旋转的同时改变它的大小。因此，我们使用的几乎所有代表旋转的四元数，都是单位四元数。

:::tip
实际上，四元数的计算后长度缩放最后会被抵消，也就是实际上并不会导致缩放。但在实际应用（比如游戏引擎编程）中，为了计算效率，大家常常使用更简单的公式来执行旋转。

在 Unity 里，当你试图将一个非单位四元数赋值给 transform.rotation 属性时，Unity 引擎在后台会自动将您提供的四元数进行“归一化”处理，也就是强制将它的长度变为1，然后再应用给物体。
:::

获取单位四元数：
```c#
Quaternion unitQuaternion = Quaternion.identity; 
```

#### 四元数插值运算
如果Vector3，四元数的插值运算可以使用 `Quaternion.Lerp` 或 `Quaternion.Slerp`。

在四元数中，Lerp 和 Slerp 只有一些细微的差别。但由于算法不同，**Slerp 的效果会更好一些**。在官方的API当中，也推荐使用 Slerp。
```c#
transform.rotation = Quaternion.Slerp(start, end, t); 
```

#### 面向目标
`Quaternion.LookRotation` 可以创建一个旋转，使得 forward 矢量指向 `target.position - transform.position` 的方向。
```c#
Quaternion q = Quaternion.LookRotation(target.position - transform.position);
transform.rotation = q;
```

#### 四元数的乘法

通常不需要手动去记或计算四元数的乘法的复杂的公式，了解其存在即可。在编程中，这都是由库函数完成的。

**四元数相乘**
- 两个四元数相乘，等同于将它们所代表的两个旋转进行叠加。
```c#
// 绕Y轴旋转30度
Quaternion q1 = Quaternion.AngleAxis(30, Vector3.up); 
// 应用这个旋转
transform.rotation *= q1; 
```

**四元数乘向量**
- 四元数乘以向量，等同于将向量进行旋转。
```c#
Vector3 rotatedVector = q * originalVector;
```
:::warning
四元数相乘和四元数乘向量的顺序不可变。
:::

## 延迟函数
延迟函数是一种编程工具，它能让你的代码不立即执行，而是等待一个指定的时间（比如几秒钟）之后再运行。

#### `Invoke` 和 `InvokeRepeating`

这是 Unity 内置的最简单直接延迟的方法。它通过函数的名字（一个字符串）来调用一个无参数的函数。
```c#
void Start()
{
    Invoke(nameof(Explode), 3.0f);
}

void Explode()
{
    Debug.Log("轰！");
}
```

`InvokeRepeating("FunctionName", time, repeatRate)` 则可以用来重复调用一个函数，包含参数：
- `FunctionName` ：要调用的函数名
- `time` ：第一次调用前的延迟时间（秒）。
- `repeatRate` ：之后每次调用的时间间隔。

::: warning
`Invoke()` 和 `InvokeRepeating()`都只能调用同一脚本内的函数。
:::

如果想要取消延迟调用，可以使用` CancelInvoke()` 方法：
```c#
void CancelTheExplosion()
{
    CancelInvoke(namfof(Explode));
}
```
只要取消了指定的延迟调用，无论之前设定了多少次 `Invoke()` 和 `InvokeRepeating()` ，都会被取消。

如果取消了没有设置的延迟调用，Unity 会忽略这个操作，不会报错。

::: tip
虽然不常用，但是可以通过 `IsInvoking()` 和` IsInvoking("FunctionName")` 来检查是否有延迟调用。
```c#
if (IsInvoking()) {}
```
:::

**注意，脚本依附对象失活或脚本自身失活，延迟函数依旧会继续执行。**

如果想要让一个脚本在激活的时候执行延迟函数，在失活的时候取消延迟函数，可以利用生命周期函数 `OnEnable()` 和 `OnDisable()` :
```c#
void OnEnable()
{
    // 开启重复执行的延迟函数
}

void OnDisable()
{
    // 取消重复执行的延迟函数
}
```

## 异步

在 Unity 开发中，我们的首要目标是保证主线程的绝对流畅，以实现稳定的高帧率（如 60 FPS）。主线程负责处理游戏逻辑、玩家输入和最终的画面渲染，任何阻塞主线程的操作都会导致游戏卡顿。

**黄金法则：Unity 的绝大部分 API（如 `GameObject`, `Transform` 等）都不是线程安全的，绝对不能在主线程之外的任何线程上直接调用它们。**

基于此，我们将异步和多线程的需求分为两大类，并采用不同的现代解决方案：
1. **应对“等待”：非阻塞的异步流程**
    - 问题场景：当代码需要等待一个耗时但不消耗 CPU的操作完成时，例如：网络请求、文件读写、计时器或任何需要跨越多帧的逻辑序列。
    - 解决方案：使用 UniTask ( `async/await` )。
    - 核心机制：它在单线程上通过“暂停和恢复”的协作式多任务机制，让主线程在等待期间可以继续执行其他任务，从而避免阻塞。UniTask 是对传统协程（Coroutine）的现代化、零GC（几乎无内存分配）、功能强大的替代方案。
2. **应对“计算”：高性能的并行处理**
    - 问题场景：当代码需要执行一个极其消耗 CPU的密集计算任务时，例如：大规模寻路算法（A*）、程序化内容生成（PCG）、复杂的物理模拟或AI决策。
    - 解决方案：使用 C# Job System 配合 Burst Compiler。
    - 核心机制：这是 Unity 官方提供的、唯一安全且高效地利用多核 CPU 的方式。它将纯数据计算任务（Jobs）调度到后台的**工作线程（Worker Threads）**上并行执行，计算完成后再将结果安全地同步回主线程。

遇到问题先分析——是“等待”还是“计算”？“等待”用 UniTask，“计算”用 Job System。请始终使用这些为 Unity 量身打造的现代化工具，并极力避免直接使用 `new Thread()`。

### 多线程

Unity 支持多线程，但新线程无法访问 Unity 相关对象的内容。在 Unity 中新建的线程需要手动关闭，否则会在编辑器模式中，线程仍会继续执行。

在 Unity 中，新线程无法访问 Unity 相关对象的内容（Unity 的 GameObject、Transform 等对象）。Unity 的 API 主要是单线程的，所有的 Unity 对象和组件都只能在主线程中访问。但我们可以通过新的线程进行计算或处理数据。

::: danger
在现代 Unity 开发中，一个普遍且重要的最佳实践是：
极力避免直接使用 System.Threading.Thread（即 new Thread(...)）。
:::

### 协程

在 Unity 中，协程是一个可以被暂停执行，并在稍后的某个时间点（比如下一帧或几秒后）从暂停处恢复执行的特殊函数。

它的核心价值在于，让你能够将一个跨越多帧的连续动作，写在一个代码块里，而不会阻塞主线程导致游戏卡死。通过分时，程序可以将一个长时间运行的任务分解成多个短小的片段，每个片段在每一帧中执行一部分，从而保持游戏的流畅性。

协程是单线程的异步：整个个过程中，没有创建任何新的线程。所有的代码都运行在同一个主线程上。

**协程函数有两个显著特征：**
1. 它的返回类型必须是 `IEnumerator`。
2. 函数体内必须至少包含一个 `yield return` 语句。

`yield return` 就是协程的“暂停”按钮，你 `yield return` 后面跟的指令（Instruction）决定了协程将在什么时候恢复，例如：

```c#
IEnumerator MyCoroutine(int maxCount = 0)
{
    for (int i = 0; i < maxCount; i++)
    {
        print("Hello from coroutine!");
        // 暂停执行，直到下一秒
        yield return new WaitForSeconds(1f);
    }
}
```

最常用的 `yield` 指令：
1. `yield return null;` 
    - 含义：暂停执行，直到下一帧的 `Update` 之前再恢复。这是最常用、开销最小的“等一帧”方式。`yield return 数字` 也可以用来实现类似效果，但不是官方推荐的“等一帧”写法。
2. `yield return new WaitForSeconds(float seconds);`
    - 含义：暂停执行，等待指定的秒数（真实时间）之后再恢复。
    - 注意：这个等待时间受 `Time.timeScale` 影响。如果游戏暂停（`Time.timeScale = 0`），那么这个等待将永远不会结束。
3. `yield return new WaitForFixedUpdate();`
    - 含义：暂停执行，直到下一次 `FixedUpdate` 调用之后再恢复。非常适合在执行物理相关的逻辑时使用。
4. `yield return new WaitForEndOfFrame();`
    - 含义：暂停执行，直到这一帧所有的摄像机和 GUI 都被渲染完毕之后再恢复。常用于截屏等操作。
5. `yield return StartCoroutine(另一个协程);`
    - 含义：暂停当前协程，直到你启动的另一个协程执行完毕之后再恢复。这可以让你将协程链接起来。
6. `yield return AsyncOperation;`
    - 含义：暂停协程，直到一个 Unity 的内置异步操作（如 `SceneManager.LoadSceneAsync`）完成之后再恢复。
7. `yield break;`
    - 含义：终止当前协程。

通过 `StartCoroutine()` 方法来启动协程：
```c#
// 推荐方式：类型安全，可以直接传递参数
StartCoroutine(MyCoroutine(10)); 

// 不推荐方式：使用字符串，容易出错且效率较低
StartCoroutine(nameof(MyCoroutine), 10);
```

通过 `StopCoroutine()` 方法来停止协程：
```c#
Coroutine c = StartCoroutine(MyCoroutine(10));

// 停止指定的协程
StopCoroutine(c);

// 关闭所有协程
StopAllCoroutines();
```

协程开启后：
- 组件失活协程执行。
- 物体失活协程不执行。
- 组件和物体销毁协程不再执行。

::: tip
返回类型为 `IEnumerator` 的方法（即迭代器块），在被调用时，里面的代码确实一行都不会执行。只有在调用 `MoveNext()` 方法时，才会开始执行代码。

这种方法更像是在“预备”或“装配”一个状态机，而不是在“运行”它。这种“我只在你需要的时候才工作”的模式，就是延迟执行 (Lazy Execution) 的核心。
:::

值得注意的是， Unity 的生命周期函数也有协程的重载版本，例如 `IEnumerator Start()`。

## Resources 资源动态加载

### 特殊文件夹的获取

#### 工程文件夹 Assets 

获取到的该路径一般只在编辑模式下使用。在游戏打包后，该路径就不存在了。

获取工程文件夹：
```c#
// 输出 ex: C:/Users/YourName/YourProject/Assets/
string projectPath = Application.dataPath + "/";
```


#### 资源文件夹 Resources
一个特殊的文件夹，Unity 会在打包时将其所有内容打包到游戏中，并对其压缩加密，设为只读。我们需要手动创建 Resources 文件夹。一般不需要获取这个路径，只通过 Resource 相关 API 进行加载。

一个项目可以有多个 Resources 文件夹，且可以放在不同的路径下。打包时，所有 Resources 文件夹都会被打包在一起。

#### 流动资源文件夹 StreamingAssets 

需要手动创建。这个文件夹的内容打包出去后不会被压缩加密，可以直接读取。在移动平台中，其内容是只读的；在 PC 平台中，可以读写。可以放入一些需要自定义动态加载的初始文件夹。

只能通过该 API 获取（不要尝试路径拼接）：
```c#
string streamingAssetsPath = Application.streamingAssetsPath;
```

#### 持久数据文件夹 PersistentDataPath 
不需要手动创建，在不同平台中不一样，不存在于 Assets 文件夹中。这个文件夹所有平台可读写。一般用于放置动态下载或动态创建的文件，游戏中创建或者获取的文件都放在其中。

获取：
```c#
string persistentDataPath = Application.persistentDataPath;
// 输出 ex: C:/Users/YourName/AppData/LocalLow/YourCompanyName/YourProductName/
```

#### 不那么重要的特殊文件夹

1. 插件文件夹 Plugins 需要我们自己创建。不同平台的插件会相关文件会放在其中，比如 IOS 和 Android 的程序插件。
2. 编辑器文件夹 Editor 需要我们自己创建，一般不尝试获取。主要用于放置开发 Unity 编辑器脚本，内容不会被打包。
3. 默认资源文件夹 Standard Assets 是 Unity 自带的一个特殊文件夹，一般不需要获取。里面包含了一些 Unity 自带的资源和脚本，会被游戏优先编译。一般不会使用该文件夹。

### 资源同步加载

Resources 通过代码动态加载 Resources 文件夹指定路径的资源，可以避免繁琐的拖拽操作。

常用的资源类型：
- `GameObject`：预制体。
- `Texture`：贴图。
- `AudioClip`：音频。
- `TextAsset`：文本文件。
- 其他 - 需要什么用什么类型。

#### `Resources.Load` 

通过这个方法，我们可以加载预设体与其他资源文件，但方法略有不同。

- 加载预设体
    1. 加载预设体的资源文件到内存中：
    ```c#
    // Cube 位于 Resources 文件夹下
    // 泛型方法（推荐）
    GameObject prefab = Resources.Load<GameObject>("Cube");

    // 这个 Object 是 Unity 里实现的类似于 C# 的 object 父类
    Object obj = Resources.Load("Cube");
    ```
    2. 如果是想要将在场景上创建预设体，需要在加载到内存中后使用 `Instantiate` 方法实例化。

- 音效资源文件
    1. 加载到内存中：
    ```c#
    // 加载一个音效文件
    var audioClip = Resources.Load<AudioClip>("Music/MyAudioClip");
    ```
    2. 赋值给对应的变量：
    ```c#
    audioSource.clip = audioClip;
    ```
- 文本资源文件
    1. 加载到内存中：
    ```c#
    // 加载一个文本文件
    var textAsset = Resources.Load<TextAsset>("Txt/MyTextFile");
    ```
    2. 获取文本内容：
    ```c#
    string content = textAsset.text;
    ```
    3. 获取字节数据组：
    ```c#
    byte[] bytes = textAsset.bytes;
    ```

其他类型的资源文件加载方式类似。
::: details 如果资源同名怎么办？
1. 使用泛型方法可以在一定程度上指定资源的类型，从而避免同名问题。

2. 还可以通过为不同类型的资源使用不同的名称（推荐）。这是最简单也最健壮的方法。为你的预设体和图片使用不同的名称，即使它们在不同的子文件夹中，也能一目了然。
    - 例如：`MyPlayerPrefab.prefab` 和 `MyPlayerImage.png`

3. 可以使用子文件夹进行组织。为了更好的组织和避免混淆，将不同类型的资源放在不同的子文件夹中是一个好习惯。
    - `Resources/Prefabs/MyAsset.prefab`
    - `Resources/Textures/MyAsset.png`
:::

### 资源异步加载
在现代 Unity 开发中，异步加载资源主要有以下几种方式：
1. `Addressable Assets System` **(官方推荐)**：最现代、最灵活、功能最强大的方式。
2. `Resources.LoadAsync`：一种相对简单但有局限性的传统方式。
3. `AssetBundle.LoadAssetAsync`：比较底层和复杂的方式，Addressables 系统就是基于它构建的。

↓ 在深入探讨每种方法前，我们先来破解一个关于异步加载的常见迷思：

::: details 核心解密：Unity异步加载真的需要新线程吗？
很多开发者认为，为了不阻塞主线程，Unity 在异步加载资源时会创建一个全新的线程来处理加载任务。

这个理解其实并不完全准确，Unity 的异步机制远比这更巧妙。其核心思想是：**尽可能在主线程上通过“时间分片”完成，仅在必要时才动用后台线程。**

要理解这一点，我们首先要区分两种任务类型：
- **CPU 密集型任务**：需要大量的计算和处理，通常涉及复杂的算法。
- **I/O 密集型任务**：主要涉及输入输出操作，比如文件读取、网络请求等。

对于单纯的 I/O 密集型任务，采用不必要的“多线程并发”反而会带来两大陷阱：
1. **线程资源浪费**：如果为一个I/O任务专门创建一个新线程，而底层的I/O调用是阻塞式的，那么这个新线程绝大部分时间都会因为等待硬件响应而处于“空等”的阻塞状态。这不仅没有利用好CPU，反而白白浪费了创建线程所带来的内存和上下文切换开销
2. **硬件性能背道而驰**：更致命的是，当多个线程并发地从磁盘（尤其是机械硬盘）读取不同文件时，会引发“I/O争用”。这会导致磁盘磁头疯狂地来回寻道，其最终的实际读取速度，反而可能比有序的单线程读取更慢。

因此，最高效的方式其实是单线程异步。主线程在发起I/O请求后，可以把控制权交出去处理其他逻辑（如游戏渲染），当I/O操作完成后，主线程再回来处理结果。`UnityWebRequest` 和传统的 `Resources.LoadAsync` 就更偏向于这种模型

那么，为什么 `Addressables` 会是个例外呢？
这背后的核心原因在于：`Addressables` 的加载是一个 “I/O + CPU” 的混合任务。

`Addressables` 的加载过程可能包含：
它加载的 `AssetBundle` 文件通常是经过高度压缩的。因此，其加载过程分为几个关键阶段：
1. (后台线程) 文件读取 (I/O)：从硬盘或网络读取压缩后的 `AssetBundle` 文件。
2. (后台线程) 数据解压缩 (CPU密集)：使用 LZ4 或 LZMA 等算法将文件解压，这是一个非常消耗 CPU 的计算过程。
3. (主线程) 反序列化与集成：将解压后的数据转换成 Unity 引擎可识别的 `GameObject`、`Texture` 等对象，并将其加载到场景中。此步骤必须在主线程执行，因为它需要安全地调用 Unity 的核心 API。

    ::: tip 结论
    `Addressables` 之所以选择将文件读取和解压缩这两个步骤放在一个专用的后台线程中，正是为了将最耗时的 CPU 密集型解压工作与主线程完全隔离，从而为游戏提供最极致的流畅度。而那些不涉及或很少涉及CPU密集计算的传统异步方法，则可以完全在主线程上通过时间分片完成。
    :::

    ::: details 拓展学习：深入底层原理
    我们刚才探讨的线程管理、I/O模型、CPU调度和进程同步，其实都属于操作系统 (Operating System) 的核心范畴。Unity 的加载策略正是在这些底层原理与游戏开发的实际需求之间做出的权衡。

    如果读者朋友们对这些“为什么”充满好奇，希望成为一名知识体系更扎实的开发者，可以阅读以下经典著作，它们会为你揭开计算机世界的神秘面纱：
    - *操作系统概念 (Operating System Concepts)*：俗称“恐龙书”，是全球最经典的操作系统教材之一。
    - *操作系统原理 (Operating System Principles)*：另一本广受好评的经典教材，理论与实践结合得很好。

     ~~我个人更喜欢*操作系统概念*。~~ 
    :::
:::

#### Addressable Assets System

Addressable Assets System (以下简称 Addressables) 是 Unity 官方推出的现代化、可扩展的资源管理系统。它是对传统的 Resources 文件夹和手动管理 AssetBundle 两种方案的全面超越，是当今 Unity 专业开发的首选。

::: tip 为什么选择 Addressables？
它主要解决了三大核心问题：

- 解耦 (Decoupling): 开发者通过一个逻辑“地址” (Address) 来加载资源，而无需关心资源在项目中的物理路径。这使得资源管理和代码逻辑完全分离。

- 高效内存管理 (Memory Management): Addressables 提供了对资源加载和卸载的精确控制，通过引用计数机制自动处理依赖项，能有效避免内存泄漏。

- 便捷的内容更新 (Content Delivery): 它允许你从远程服务器（如CDN）加载资源，这意味着你可以为已发布的游戏推送内容更新（如新的角色、关卡、活动），而无需让玩家重新下载和安装整个游戏App。这是实现热更新和Live Ops的基础。
:::

**核心理念：从“路径”到“地址”**

传统方式下，我们依赖资源的路径 (Assets/Prefabs/MyCharacter.prefab)。Addressables 的核心转变是为每个资源分配一个稳定的、逻辑上的地址，例如 "player_character"。代码通过这个地址与资源系统交互，系统则负责在后台找到、加载并返回这个资源。

##### 基础工作流：加载一个预制体
让我们通过一个最基础的例子，走完 Addressables 的完整流程。

1. 安装与初始化
- 在 Unity 编辑器中，打开 Window > Package Manager。
- 在 Packages: Unity Registry 下找到 Addressables 并点击 Install。
- 安装后，打开 Window > Asset Management > Addressables > Groups。
- 在弹出的窗口中点击 Create Addressables Settings，完成初始化。

2. 标记资源为 Addressable
- 在 Project 窗口中选中你想管理的资源（例如一个 Player 预制体）。
- 在 Inspector 窗口中，勾选 Addressable 复选框。
- 你可以为它指定一个自定义的、易于记忆的地址，比如 PlayerCharacter。

3. 编写加载脚本
- 这是与 Addressables 交互的核心。我们将使用 `AssetReference` 和 `async/await` 来实现一个健壮的加载器。
    ```c#
    public class AddressableManager : MonoBehaviour
    {
        // 在 Inspector 中使用 AssetReference，这是最安全、最推荐的资源引用方式
        [SerializeField]
        private AssetReferenceGameObject playerPrefabRef;

        // 用于持有加载操作的句柄
        private AsyncOperationHandle<GameObject> loadHandle;

        // 用于持有实例化后的对象
        private GameObject playerInstance;

        async void Start()
        {
            Debug.Log("开始通过 Addressables 加载玩家预制体...");

            // 1. 发起加载请求
            // LoadAssetAsync 不会阻塞主线程，它立即返回一个操作句柄(Handle)
            loadHandle = playerPrefabRef.LoadAssetAsync<GameObject>();

            // 2. 异步等待
            // await 会暂停此方法，将控制权交还给Unity主循环。
            // 当后台加载完成后，代码将从这里继续执行。
            await loadHandle.Task;

            // 3. 检查结果并使用
            if (loadHandle.Status == AsyncOperationStatus.Succeeded)
            {
                Debug.Log("预制体加载成功!");
                GameObject loadedPrefab = loadHandle.Result;
                playerInstance = Instantiate(loadedPrefab, transform);
                playerInstance.name = "Player_Loaded";
            }
            else
            {
                Debug.LogError($"预制体加载失败: {loadHandle.OperationException}");
            }
        }

        void OnDestroy()
        {
            Debug.Log("开始释放 Addressables 资源...");

            // 4. 释放资源 (至关重要！)
            // 首先销毁场景中的实例
            if (playerInstance != null)
            {
                Destroy(playerInstance);
            }

            // 然后，释放 Addressables 加载的资源，减少其引用计数。
            // 当引用计数为0时，资源将从内存中被卸载。
            // 如果忘记释放，将导致内存泄漏。
            if (loadHandle.IsValid()) // 确保句柄是有效的再释放
            {
                Addressables.Release(loadHandle);
            }
            
            // 注意：如果使用 AssetReference 加载，也可以用 playerPrefabRef.ReleaseAsset();
            // 它内部会自动找到对应的句柄并释放，是更便捷的封装。
        }
    }
    ```

    当你在 Unity 中切换场景时，Unity 会**卸载（unload）** 当前场景中所有直接加载的资源。这意味着：
    1. 场景中的所有游戏对象和组件都会被销毁。 比如，你当前场景里的玩家角色、敌人、UI元素等都会消失。
    2. 由这些游戏对象和组件引用的资源（如纹理、模型、音频片段、脚本等），如果它们没有被标记为 `DontDestroyOnLoad` 并且没有被其他活动场景或加载的 AssetBundle 引用，也会被从内存中卸载。

::: tip
通过打开 Profiler (Ctrl + 7)，你可以观察 Addressables 的加载和卸载过程，包括内存使用情况和性能指标。
:::

##### 核心API细节解析
在上面的代码中，有两个关键的角色：`AssetReference` 和 `AsyncOperationHandle`。

1. **`AssetReference`：安全的“资源指针”**
    
    它是一个可序列化的类，让你可以在 Inspector 中像拖拽普通对象一样指定一个 Addressable 资源。它比手打字符串地址更安全，因为它存储的是资源的内部 GUID（全局唯一标识符），即便你重命名或移动了资源文件，引用也不会丢失。

2. **`AsyncOperationHandle`**

    当你调用任何 `Load...Async` 方法时，都会得到一个 `AsyncOperationHandle`。它是你与这次异步操作交互的唯一凭证，一个功能强大的“仪表盘”。

::: details `AsyncOperationHandle` 的关键属性
1. `.Status`: 操作的当前状态 (`Succeeded`, `Failed` 等)。
2. `.Result`: 操作成功后，这里存放着加载到的资源。
3. `.Task`: 提供一个标准的 C# `Task` 对象，用于 `async/await` 等待。
4. `.PercentComplete`: 0.0 到 1.0 的加载进度，用于制作进度条。
5. `.OperationException`: 操作失败时的具体异常信息。
6. `.IsValid()`: 一个检查此句柄是否仍有效的方法，在释放前调用可以增加代码健壮性。
:::

##### 超越基础：更广阔的应用
Addressables 的能力远不止于加载单个预制体。
- 加载任意类型: 使用泛型的 `AssetReferenceT<T>`，你可以加载 `Material`, `AudioClip`, `TextAsset` 等任何资源。
    ````c#
    [SerializeField]
    private AssetReferenceT<AudioClip> musicClipRef;

    async void Start()
    {
        var handle = musicClipRef.LoadAssetAsync<AudioClip>();
        await handle.Task;
        if (handle.Status == AsyncOperationStatus.Succeeded)
        {
            AudioClip clip = handle.Result;
            audioSource.clip = clip;
        }
    }
    ```

- 批量加载: 使用标签 (Labels)，你可以为一组资源（如一个关卡的所有敌人）打上同一个标签，然后用 `Addressables.LoadAssetsAsync()` 一次性将它们全部加载进来。
    ```c#
    // 假设所有敌人预制体都打上了 "Enemy" 标签
    async void LoadAllEnemies()
    {
        // 加载所有打上 "Enemy" 标签的预制体
        var handles = Addressables.LoadAssetsAsync<GameObject>("Enemy", null);
        await handles.Task;
        if (handles.Status == AsyncOperationStatus.Succeeded)
        {
            foreach (var enemyPrefab in handles.Result)
            {
                Instantiate(enemyPrefab);
            }
        }
    }
    ```

- 场景加载: `Addressables.LoadSceneAsync()` 可以异步加载和卸载场景，并且这些场景无需被添加到 Build Settings 中，为大型游戏的模块化开发提供了巨大便利。
    ```c#
    async void LoadMyScene()
    {
        // 场景加载模式：
        // LoadSceneMode.Single: 替换当前场景
        // LoadSceneMode.Additive: 在当前场景上叠加新场景
        var handle = Addressables.LoadSceneAsync("MyScene", LoadSceneMode.Additive);
        await handle.Task;
        if (handle.Status == AsyncOperationStatus.Succeeded)
        {
            Debug.Log("场景加载成功!");
        }
        else
        {
            Debug.LogError($"场景加载失败: {handle.OperationException}");
        }
    }
    ```

##### 终极能力：远程内容更新
这是 Addressables 最令人兴奋的功能。通过将资源组的加载路径设置为远程服务器地址，你可以实现动态的内容分发。

::: info 热更新与 Live Ops
1. 构建内容包: 你将需要更新的资源（新角色、新时装、新活动配置）构建成 Addressables 包。
2. 上传服务器: 将这些包上传到你的 CDN 或任何 HTTP 服务器上。
3. 游戏内检测与下载: 在游戏启动时，客户端代码调用 `Addressables.CheckForCatalogUpdates()` 来检查服务器上是否有新内容。如果有，则调用 `Addressables.UpdateCatalogs()` 来下载最新的资源清单。
4. 无缝加载新内容: 之后，当游戏代码请求某个资源的地址时，Addressables 系统会自动从本地或从刚刚下载的远程包中加载最新版本的资源。

整个过程对玩家来说是无缝的，极大地提升了游戏运营的灵活性。
:::

#### `Resources.LoadAsync`

这是一种较老的方法，适用于一些简单项目或快速原型开发。`Resources.LoadAsync` 通常与协程（Coroutine）一起使用。

简单的异步加载示例：
```c#
public class LoadMyResource : MonoBehaviour
{
    AudioClip _musicClip;
    
    private void Start()
    {
	    StartCoroutine(LoadMusicAsync());
    }

    IEnumerator LoadMusicAsync()
    {
	    ResourceRequest rq = Resources.LoadAsync("MyAudioClip");
        // 等待加载完成
	    yield return rq;
        if (rq.asset is not null)
        {
            _musicClip = rq.asset as AudioClip;
        }
    }
}
```

如果希望显示加载进度，可以使用 `ResourceRequest.progress` 属性：
```c#
IEnumerator LoadMusicAsync()
{
    ResourceRequest rq = Resources.LoadAsync("MyAudioClip");

    // 检查加载是否完成
    while (!rq.isDone)
    {
        // 显示加载进度
        Console.WriteLine($"Loading progress: {rq.progress * 100}%");
        // 等待下一帧
        yield return null;
    }

    // 检查加载结果
    if (rq.asset is not null)
    {
        _musicClip = rq.asset as AudioClip;
    }
}
```

也可以向 `ResourceRequest` 注册回调函数来处理加载完成后的逻辑，但不适合用于多资源加载：
```c#
ResourceRequest rq = Resources.LoadAsync("MyAudioClip");
rq.completed += (AsyncOperation op) =>
{
    if (rq.asset is not null)
    {
        _musicClip = rq.asset as AudioClip;
    }
};
```

`Resources.LoadAsync("MyAudioClip");` 在加载失败时（例如，在 Resources 文件夹中找不到该资源）本身是不会抛出异常的。所以每次加载资源后都需要检查 `rq.asset` 是否为 `null` 来判断加载是否成功。

::: info 资源会重复加载吗？
Resources 在加载一次后会被缓存，后续加载同一资源时不会再次加载，而是直接返回缓存的资源。所以多次加载不会浪费内存，但是会浪费性能（每次加载都会进行查找和验证）。
:::

通过 `Resources.UnloadUnusedAssets()` 可以卸载未使用的资源。一般在过场景和 GC 一起使用。
```c#
Resources.UnloadUnusedAssets();
GC.Collect();
```

可以通过 `Resources.UnloadAssets()` 来手动卸载使用的资源，不可卸载能够实例化的资源（ex：`GameObject`）。这个方法很少使用。
```c#
Resources.UnloadAssets(texture);
```

::: warning
`GC.Collect`() 是 C# 中 `System.GC` 类下的一个静态方法。

它的作用是强制命令 .NET 的垃圾回收器 (Garbage Collector, GC) 立即开始工作，回收不再被引用的对象所占用的内存。

当你调用 `GC.Collect()` 时，会发生的情况
1. 暂停应用程序: 你的程序主线程会被冻结。所有代码执行都会暂停。
2. 标记 (Mark): GC 会遍历所有的对象，找出那些仍然“存活”（即仍然可以从代码的某个地方访问到）的对象。
3. 清除 (Sweep): GC 会回收所有未被标记为“存活”的对象所占用的内存。
4. 压缩 (Compact): GC 会整理剩余的“存活”对象，将它们移动到内存中连续的区域，以减少内存碎片。
5. 恢复应用程序: 回收和整理工作完成后，你的程序才会从暂停的地方继续执行。

这个过程，尤其是对所有内存（所有“代”，即 Generation 0, 1, 2）进行扫描，是一个非常耗费计算资源的操作。

强烈不推荐在游戏代码中随意使用它。能使用的情况非常少，而且必须在严格控制下使用。

**我应该怎么做？ (正确的内存管理)** - 核心思想是：从源头减少垃圾的产生，而不是等垃圾堆积如山了再去清理。

::: details 什么时候可以使用 `GC.Collect()`？
1. 加载/卸载关卡: 在一个大的游戏关卡被卸载后，内存中会留下大量待回收的对象。在显示“加载中”画面，准备加载下一个关卡之前，可以调用一次 `GC.Collect()。` 因为此时玩家正在等待，一次短暂的卡顿是完全可以接受的，并且这能确保下一个关卡在一个更干净的内存环境中开始运行。
2. 场景切换时: 同样，在两个场景切换的间隙，特别是在从一个复杂的场景切换到一个简单的场景（如主菜单）时。

:::

### 场景异步加载

在 Unity 中，异步加载场景主要有两种核心方式：
1. Addressable Assets System (官方首选)：最强大、最灵活的方式，能将场景与构建设置解耦，是实现热更新的基础。
2. `SceneManager.LoadSceneAsync` (传统方式)：Unity 内置的经典方法，简单直接，适用于小型或不需要远程更新的项目。

#### Addressable Assets System

与加载资源类似。

`sceneReference.LoadSceneAsync();` 会默认使用 `LoadSceneMode.Single` 模式加载场景，这意味着它会卸载当前场景并加载新场景。

``` c#
public class MyAddressableAssetLoader : MonoBehaviour
{
	[SerializeField]
	private AssetReference sceneReference;

	private AsyncOperationHandle<SceneInstance> _handle;

    // 加载场景
	private async void LoadScene()
	{
		_handle = sceneReference.LoadSceneAsync();
		
		await _handle.Task;

		if (_handle.Status == AsyncOperationStatus.Succeeded)
		{
			print("加载场景成功: " + _handle.Result.Scene.name);
		}
	}

    // 以叠加的方式加载一个场景 (例如加载一个UI场景)
    public void LoadAdditiveScene()
    {
        // LoadSceneMode.Additive 会在保留当前场景的同时，加载一个新的场景。
        // 这对于加载独立的UI场景、小地图等非常有用。
        Addressables.LoadSceneAsync(sceneReference, LoadSceneMode.Additive);
        // ..
    }
	
    // 卸载场景
	public async void UnLoadScene()
	{
        // 判断句柄是否有效，便避免多次释放报错
		if (!_handle.IsValid())
		{
			Debug.LogWarning("句柄无效，无法卸载场景");
			return;
		}

		var unLoadHandle = Addressables.UnloadSceneAsync(_handle);
		await unLoadHandle.Task;

		if (unLoadHandle.Status == AsyncOperationStatus.Succeeded)
		{
			print("卸载场景成功: " + _handle.Result.Scene.name);
		}
	}
}
```

::: tip
`sceneReference.UnLoadScene()` 效果与 `Addressables.UnloadSceneAsync(_handle)` 类似，但前者只会释放最后一个句柄（handle），而后者会释放所有与该场景相关的句柄。在使用 `LoadSceneMode.Additive` 模式加载场景时，就可能会出产生多个对同一场景的句柄。
:::

#### `SceneManager.LoadSceneAsync`
传统的异步场景加载方法，使用方法与 `Resources.LoadAsync` 类似。

代码示例：
```c#
public class SceneLoader : MonoBehaviour
{
    // 异步加载场景
    public void LoadSceneAsync(string sceneName)
    {
        // 确保加载场景时不会销毁当前对象
        DontDestroyOnLoad(gameObject); 
        StartCoroutine(LoadSceneCoroutine(sceneName));
    }

    private IEnumerator LoadSceneCoroutine(string sceneName)
    {
        AsyncOperation asyncLoad = SceneManager.LoadSceneAsync(sceneName);
        
        // 等待加载完成
        while (!asyncLoad.isDone)
        {
            // 显示加载进度（其实不是很准确）
            Debug.Log($"Loading progress: {asyncLoad.progress * 100}%");
            yield return null; // 等待下一帧
        }

       
        Debug.Log("场景加载完成!");
    }
}
```

由于切换场景后，之前场景的对象会被销毁，协程会自动结束。所以需要设置 `DontDestroyOnLoad(gameObject)` 来确保当前对象不会被销毁。才能继续执行后续逻辑。

::: tip
也可以创建静态类 `SceneLoader`，将加载和卸载场景的逻辑封装在其中。这样可以在项目中任何地方调用，保持代码整洁的同时避免了切换场景时的对象销毁问题。
:::
由于 `AsyncOperation` 的 `progress` 属性在加载场景时并不准确，所以不建议使用它来显示加载进度。可以根据游戏设置自己的进度条加载规则，比如场景1加载结束时显示20%。

## 画线 - LineRenderer

`LineRenderer` 是 Unity 中用于绘制线条的组件。一般可以用于：
1. 绘制攻击范围
2. 武器红外线
3. 辅助功能

组件属性（加粗的是重点）：
1. **`Loop`：是否闭合线条。**
2. **`Positions`：线条的顶点位置数组。** 
    - `Size`：顶点数量。
3. **`Width`：线条宽度。**
    - 右键 `Add Key` 可以添加关键帧，设置不同位置的宽度。
4. **`Color`：线条颜色。**
5. **`Conner Vertices`：在一条线中绘制角时使用了多少额外的顶点(绘制圆角)。**
    - 越高越平滑，但性能开销也越大。
6. **`End Cap Vertices`：在一条线的末端绘制的额外顶点数量。**
7. `Alignment`：对齐方式。
    - `View`：线段对着摄像机。
    - `Transform Z`：线段对着物体的 Z 轴。
8. `Texture Mode`：纹理模式。
    - `Stretch`：拉伸
    - `Tile`：平铺
    - `Distribute Per Segment`：每段分布
    - `Repeat Per Segment`：每段重复
9. `Shadow Bias`：阴影偏移。
10. `Generate Lighting Data`：生成光源数据。
11. **`Use World Space`：是否使用世界坐标系。**
12. **`Material`：材质球。**
13. `Lighting`：光照影响。
    - `Cast Shadows`：开启阴影。
    - `Receive Shadows`：接收阴影。
14. `Probes`：光照探针。
    - `Light Probes`：光探测器模式。
        - `Off`
        - `Blend Probes`：内插广探针。
        - `Use Probes`：三维网格内插光探针。
        - `Custom Provided`：自定义从材质决定。
    - `Reflection Probes`：反射探针模式。
        - `Off`
        - `Blend Probes`：混合反射探针。
        - `Blend Probes Annd SkyBox`：使用反射探针并且和天空盒混合。
        - `Simple`：普通探针，重叠式不混合。
15. `Additional Settings`：附加设置。
    - `Motion Vectors`：运动矢量。
        - `Camera Motion Only`：使用相机运动来跟踪运动
        - `Per Object Motion`：特定对象来跟踪运动
        - `For No Motion`：不跟踪
    - `Dynamic Occludee`：动态遮挡剔除。
    - `Sorting Layer`：排序层。
    - `Order in Layer`：层级顺序。

编辑模式（了解即可）：
- 左侧编辑点
    - `Scene Tool`
    - `Simplify Preview`：简化预览
    - `Tolerance`：容差
    - `Show Wireframe`：显示线框
        - `Subdivide Selected`：在两点之间插入新点
- 右侧添加点
    - `Input`
        - `Mouse Raycast`：鼠标射线检测
        - `Physical Raycast`：物理射线检测
    - `Lay Mask`：射线检测层级
    - `Mini Vector Distance`：最小顶点距离，拖动鼠标创建点的时候会在超出这个歌距离时创建一个点

可以通过代码去控制 `LineRenderer` 的属性。

动态添加一个线段：
```c#
GameObject line = new GameObject();
line.name = "Line";
LineRenderer lineRenderer = line.AddComponent<LineRenderer>();
```

设置首尾相连：
```c#
lineRenderer.loop = true;
```

设置线段开始和结束的宽度：
```c#
// 开始宽度
lineRenderer.startWidth = 0.1f; 
// 结束宽度
lineRenderer.endWidth = 0.1f; 
```

设置线段颜色：
```c#
// 开始颜色
lineRenderer.startColor = Color.red;
// 结束颜色
lineRenderer.endColor = Color.blue;
```

设置材质：
```c#
lineRenderer.material = Resources.Load<Material>("Materials/LineMaterial");
```

设置点：
```c#
// 设置线段的顶点数量
lineRenderer.positionCount = 3; 
// 设置位置（如果没有设置全，多的点会默认在原点位置）
lineRenderer.SetPositions(new Vector3[] 
{ 
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, 0, 1)
});

// 或者逐个设置
// 设置第一个点位置：
// lineRenderer.SetPosition(0, new Vector3(1, 0, 0));
```

设置世界坐标系，决定是否随对象移动：
```c#
lineRenderer.useWorldSpace = false; 
```

让线段受光照影响：
```c#
lineRenderer.generateLightingData = true; 
```

## 范围检测

此处主要讲解瞬时的范围检测。

适用场景：
1. 释放一个范围性技能（AOE），对范围内的所有敌人造成伤害。
2. AI进行周期性索敌，而不是每时每刻都检测。
3. 拾取道具，按下拾取键时检测周围的可拾取物。

实现步骤：
1. 目标物体设置：需要被检测的物体（如敌人、道具）必须有 `Collider` 组件。
2. 编写脚本：在需要执行检测的物体上（如玩家）编写脚本。

#### `Physics.OverlapBox`

用于检测一个盒状（长方体） 区域内存在哪些碰撞体（Collider）。

函数完整的定义方式：
```c#
public static Collider[] OverlapBox(
    Vector3 center, 
    Vector3 halfExtents, 
    Quaternion orientation, 
    int layerMask, 
    QueryTriggerInteraction queryTriggerInteraction
);
```
参数说明：
- `center`：中心点
- `halfExtents`：半个长方体的边长（宽度、高度、深度的一半）
- `orientation`：旋转角度
- `layerMask`：层级遮罩（默认检测所有层）
- `queryTriggerInteraction`：触发器交互方式（默认使用全局设置）
    - `QueryTriggerInteraction.UseGlobal`: 使用物理设置中的默认行为（Edit -> Project Settings -> Physics -> Queries Hit Triggers）
    - `QueryTriggerInteraction.Collide`: 检测触发器
    - `QueryTriggerInteraction.Ignore`: 忽略触发器

::: tip 关于层级遮罩
LayerMask 是一个 32 位的整数。如果我们想要检测特定层级的碰撞体，可以使用位掩码（Bitmask）来指定需要检测的层级。
例如，如果我们只想检测第 8 层和第 9 层，可以这样设置：
```c#
int layerMask = (1 << 8) | (1 << 9);
```
或者：
```c#
int layerMask = 1 << LayerMask.NameToLayer("LayerName1") |
                    1 << LayerMask.NameToLayer("LayerName2");
```
通过位运算我们可以轻松地组合多个层级进行检测。
:::

#### `Physics.OverlapBoxNonAlloc`
与 `OverlapBox` 类似，但它不会分配新的数组，而是将结果存储到提供的数组中。在需要检测是有碰撞再执行对应逻辑时，这种方式更简洁。

每次手动创建数组并传入，虽然不够优雅，但可以避免频繁的内存分配和垃圾回收，也算是一种取舍：
```c#
// 只检测10个碰撞体
Collider[] colliders = new Collider[10];
if (Physics.OverlapBoxNonAlloc(Vector3.zero, Vector3.one, colliders) > 0)
{
    // 有碰撞体在盒子内
}
```

#### `Physics.OverlapSphere`
类似于 `OverlapBox`，但用于检测一个球形区域内的碰撞体。

函数完整的定义方式：
```c#
public static Collider[] OverlapSphere(
    Vector3 position, 
    float radius, 
    int layerMask, 
    QueryTriggerInteraction queryTriggerInteraction
);
```

#### `Physics.OverlapSphereNonAlloc`
类似于 `Physics.OverlapBoxNonAlloc`。

```c#
Collider[] colliders = new Collider[10];
if (Physics.OverlapSphereNonAlloc(Vector3.zero, 1f, colliders) > 0)
{
    // 有碰撞体在球形区域内
}
```

#### `Physics.OverlapCapsule`

用于检测并返回一个胶囊体形状区域内的所有碰撞体。

```c#
public static Collider[] OverlapCapsule(
    Vector3 point0, 
    Vector3 point1, 
    float radius, 
    int layerMask, 
    QueryTriggerInteraction queryTriggerInteraction
);
```

1. `point0`
    - 类型: `Vector3`
    - 含义: 胶囊体第一个端点半球的球心坐标。
2. `point1`
    - 类型: `Vector3`
    - 含义: 胶囊体第二个端点半球的球心坐标。
    - 关键：`point0` 和 `point1` 之间的直线构成了胶囊体中间圆柱部分的轴线。
3. `radius`
    - 类型: `float`
    - 含义: 胶囊体的半径。这个半径同时作用于两个半球形的端点和中间的圆柱部分。

#### `Physics.OverlapCapsuleNonAlloc`
代码示例：
```c#
Collider[] colliders = new Collider[10];
if (Physics.OverlapCapsuleNonAlloc(point0, point1, radius, colliders) > 0)
{
    // 有碰撞体在胶囊体区域内
}
```