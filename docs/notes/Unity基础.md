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

### `Invoke` 和 `InvokeRepeating`

这是 Unity 内置的最简单直接的延迟方法。它通过函数的名字（一个字符串）来调用一个无参数的函数。
```c#
void Start()
{
    Invoke("Explode", 3.0f);
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
`Invoke()` 和 `InvokeRepeating()`都只能调用相同脚本的函数。
:::

如果想要取消延迟调用，可以使用` CancelInvoke()` 方法：
```c#
void CancelTheExplosion()
{
    CancelInvoke("Explode");
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

### 多线程

Unity 支持多线程，但新线程无法访问 Unity 相关对象的内容。在 Unity 中新建的线程需要手动关闭，否则会在编辑器模式中，线程仍会继续执行。
