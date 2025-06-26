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

    如何计算两个向量之间的夹角?

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

::: tip **为什么“静态欧拉角”为何也无法幸免？**


假设你把一个静态摄像机的位置设置为欧拉角 (Pitch=90°, Yaw=40°, Roll=50°)。

表面上看：摄像机固定不动，似乎没问题。
潜在的问题：这个姿态本身就处于万向节死锁中。如果你想在这个姿态的基础上，进行一个微小的“偏航”调整（比如想让它向左看一点点），你会发现你无法通过简单地修改 Yaw 值来实现。因为在这个状态下，改变 
:::