# Unity入门

## Lesson 5 时间

### 1. 时间缩放比例
```c#
Time.timeScale = 1f;
```

### 2. 帧间隔时间（秒）
主要是用来计算位移的，需要根据需求选择。
1. 如果希望游戏暂停时候不动的，使用deltaTime。
2. 如果希望不受暂停影响，使用unscaledDeltaTime。

受scale影响的 - Time.deltaTime。

不受scale影响的 - Time.unscaledDeltaTime。

### 3. 游戏开始到现在时间
它主要用来单机游戏的计时。

```c#
Time.time;
Time.unscaledTime;
```

### 4. 物理时间间隔
```c#
private void FixedUpdate()
{
    // 受scale影响
    Time.fixedDeltaTime;
    // 不受scale影响
    Time.fixedUnscaledDeltaTime;
}
```

### 5. 帧数
```c#
Time.frameCount;
```

### 总结：
最常用的:
1. 帧时间间隔：用于计算位移相关内容
2. 时间缩放比例：用来暂停，倍速
3. 帧数（帧同步）

## Lesson 6 向量
### 1. 位置
```c#
// 相对世界坐标系
Vector3 position = transform.position;
// 相对父对象
Vector3 localPosition = transform.localPosition;
```

### 2. 朝向
```c#
Vector3 forward = transform.forward;
Vector3 right = transform.right;
Vector3 up = transform.up;
```

### 3.位移
除了直接+，-，还可以使用Translate方法。一般使用API进行位移。
```c#
// 相对坐标系
transform.Translate(Vector3.forward * speed * Time.deltaTime);
// 世界坐标系
transform.Translate(Vector3.forward * speed * Time.deltaTime, Space.World);
```

## Lesson 8 缩放

### 1. 缩放
缩放只能修改本地坐标系缩放，缩放没有提供修改的API。
```c#
// 相对世界坐标系
Vector3 scale = transform.lossyScale;
// 相对父对象
Vector3 localScale = transform.localScale;
```

### 2. 看向
```c#
transform.LookAt(Camera.main.transform);
```

## Lesson 9 父子关系
### 1. 获取和设置父对象
```c#
Transform parent = transform.parent;
transform.SetParent(newParent);

print(transform.parent?.name ?? "null");
```

### 2. 解除子对象
解除所有的子对象：
```c#
transform.DetachChildren();
```

### 3. 获取子对象

获取子对象有两种方式：
1. 通过索引获取（失活对象也会被计算）
```c#
for (int i = 0; i < transform.childCount; i++)
{
    print(transform.GetChild(i));
}
```

2. 通过名称获取（也可以找到失活对象）
```c#
Transform child = transform.Find("ChildName");
```

### 4. 子对象的操作
```c#
// 判读自己是否是某个对象的子对象
transform1.IsChildOf(transform);

// 获取自身作为子对象的编号
transform1.GetSiblingIndex();

// 把自己设置为第一个儿子
transform1.SetAsFirstSibling();

// 最后一个
transform1.SetAsLastSibling();

// 设置自己为指定编号
// 越界或负数时会设置为最后一个
transform1.SetSiblingIndex(2);
```

## Lesson 10 坐标转化
### 1. 世界坐标系转化为本地坐标系
可以帮我们判断一个相对位置。
```c#
// 点
// 受到缩放影响（会除上一个缩放大小）
transform.InverseTransformPoint(Vector3.forward);

// 方向
// 不受缩放影响
transform.InverseTransformDirection(Vector3.forward);
// 受到缩放影响
transform.InverseTransformVector(Vector3.forward); 
```

## Lesson 12 屏幕
1. 静态属性
```c#
// 当前显示器分辨率
Resolution r = Screen.currentResolution;
print($"{r.width} x {r.height}");

// 屏幕窗口当前宽高
// 一般用下面的做窗口宽高的计算
print($"{Screen.width} x {Screen.height}");

// 屏幕休眠模式
Screen.sleepTimeout = SleepTimeout.NeverSleep;
```