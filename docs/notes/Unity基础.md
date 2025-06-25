# Unity基础

## 3D数学

### 基础

#### Mathf
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
#### 三角函数
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
