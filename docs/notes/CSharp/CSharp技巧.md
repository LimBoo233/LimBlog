# CSharp 技巧

## 为程序创建命名空间

我们常常需要为每个脚本创建一个命名空间，以便更好地组织代码。Rider 能很好地为我们自动生成命名空间，例如：

```csharp [Assets/_MyGame/Scripts/Model/UserCredentials.cs]
namespace _MyGame.Scripts.Model
{
    public class UserCredentials 
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
```

可有时这样的命名空间不是我们想要的，我们希望它能更简洁一些，比如`MyGame.Model`这样的。

为此，你需要修改一些属性。在上面这种情况下，通过右键`_MyGame`和`Scripts`，找到属性（properties），然后取消勾选命名空间提供程序选项。此时，Rider 自动生成的命名空间将会变得更为简洁，例如：

```csharp [Assets/_MyGame/Scripts/Model/UserCredentials.cs]
namespace Model
{
    // ..
}
```

但我们仍希望能自动生成`MyGame.Model`这样的规范命名空间，如果手动添加的话既麻烦又会导致编辑器警告。

如果要解决这个问题，首先将编辑器左上角切换问解决方案（Solution Explorer），下方右键`Assembly-CSharp`并打开属性（Properties），修改根命名空间（Root Namespace）属性。效果如下：
```csharp [Assets/_MyGame/Scripts/Model/UserCredentials.cs]
namespace MyGame.Model
{
  // ..
}
```

> [!warning]
但 Rider 目前似乎有 Bug，修改根命名空间后进行切屏后再切回来，根命名空间会被重置为空字符串。

## 模式匹配替代 `as`

**C# 7.0 +**

使用 `is T value` 来代替 as，且模式匹配还支持可空类型：

```cs
if (v is T tv)
{
	// ..
}
```

## if 语句简化
最常见的简化方式是三元运算法，这种语法在许多编程语言中都存在。

例如：
```csharp
string result = (number > 5) ? "大于5" : "小于或等于5";
```

此外，C# 还提供了`??`运算符，用于处理可能为`null`的情况。

例如：
```csharp
string value = nullableValue ?? "默认值";
```

有时可以通过按位或运算符`|`来简化多个条件的判断。

例如：
```csharp
autoLoginToggle.onValueChanged.AddListener(isOn => rememberMeToggle.isOn |= isOn);

// 等价于
if (isOn)
{
    rememberMeToggle.isOn = true;
}
```

同理，也可以通过按位与运算符 `&` 来简化多个条件的判断。

例如：
```csharp
rememberMeToggle.onValueChanged.AddListener(isOn => autoLoginToggle.isOn &= isOn);

// 等价于
if (!isOn)
{
    rememberMeToggle.isOn = false;
}
```

## 可空结构体 `struct`-`Nullable<T>`糖

在 C# 中，`struct`是值类型，不能为`null`。但有时我们需要一个可以表示“无值”的`struct`，这时可以使用`Nullable<T>`结构体。例如：

```csharp
int? nullableInt = null; 

// 本质上
Nullable<int> nullableInt = new Nullable<int>();
```

> [!CAUTION]
> 可空结构体（`Nullable<T>`）和结构体（`T`）比较时非常容易混乱，故建议提前将 `T` 转化为 `Nullable<T>` 在

## 为什么结构体不能有默认值

C# 10 之前，结构体有一个硬性限制：**不允许显式定义无参构造函数，也不允许为实例字段/属性直接设置初始值**。

这是出于 CLR 的底层效率考虑：结构体是值类型，通常在栈上分配，或者作为数组的一部分连续存储。在 C# 核心设计中，初始化一个结构体最快的方式是**直接将对应的内存块全部清零（Zero-initialized）**，例如：

```cs
HexTile[] map = new HexTile[1000];  // 在底层，这只是把一块内存全部刷成 0
```


如果允许设置默认值，那么当运行 `new HexTile[1000]` 时，CLR 必须逐个遍历以调用初始化代码，而不能使用高效的内存清零操作。这极大地违背了结构体“高性能、低开销”的设计初衷。

**尽管在 C# 10+ 后放宽了限制，但隐式初始化依然会绕过默认值**。例如：

```cs
// 方式 A：显式调用（C# 10 引入了隐式的无参构造函数）
HexTile tileA = new HexTile(); 

// 方式 B：使用默认值（最底层的内存清零）
HexTile tileB = default; 
```

## 单例模式饿汉和懒汉的真正差异

单例模式有两种常见的实现方式：饿汉式和懒汉式。

饿汉式在类加载时就创建实例，如下：
```csharp
public class EagerSingleton
{
    public static EagerSingleton Instance { get; } = new EagerSingleton();

    private EagerSingleton() { }
}
```

懒汉式则是在第一次访问实例时才创建，如下：
```csharp
public class LazySingleton
{
    private static LazySingleton _instance;

    public static LazySingleton Instance
    {
        get
        {
            if (instance == null)
            {
                // 线程不安全，需要锁
                instance = new LazySingleton();
            }
            return instance;
        }
    }

    private LazySingleton() { }
}
```

二者的主要区别在于：饿汉式在类加载时，CLR 就会创建实例；而懒汉式则是在 CLR 加载完类之后，自己通过代码创建实例。

**但实际上，在同步场景下，延迟一点的加载不会为懒汉式带来更高的性能。**

饿汉式还是懒汉式，都是在第一次访问`Instance`的时候加载的实例，他们都会一口气把所有必有的字段和属性加载完毕，加载时机都是在访问`Instance`这个时机上。在饿汉式中，我们会在需要`Instance` 时，才会去访问其静态 getter，CLR 为会在此时把类加载好（.NET 按需加载）；在懒汉中，也是我们需要`Instance`才会去访问其静态 getter，虽然 CLR 在类加载时不会帮忙创建实例，但紧接着我们就自己手动创建实例了。

**可以看到，在不访问其他静态成员的情况下，二者的加载时机是一样的。**

> [!TIP]
当然也意味着，如果你在访问`Instance`之前，访问了其他静态成员，那么懒汉式会确实会比饿汉式更晚加载实例。


**那么，为什么我们还要区分它们？**

两者依然存在一个根本性的、架构层面的区别，这个区别和用户体验无关，而是和 CLR 何时执行构造函数有关。

简单来说，就 JIT 在分析你的代码时以和预编译时，可能会发现`EagerSingleton`饿汉类型在程序启动后很快就会被用到。它可能会决定，作为启动优化的一部分，在你的`Main`函数第一行业务代码执行前，就提前加载和初始化这个类型（为了初始化静态属性）。这份开销会使得你的程序启动时间变长。

```csharp
public class EagerSingleton
{
    // JIT 可能提前初始化这个静态属性，导致实例的创建
    public static EagerSingleton Instance { get; } = new EagerSingleton();
}
```

而懒汉模式中，JIT 可能会决定不去提前初始化这个类型，因为它没有静态字段需要初始化。这样就避免了在程序启动时创建实例的开销。

```csharp
public class LazySingleton
{
    // 没有设置初始值，故而 JIT 只可能给它赋值 null
    private static LazySingleton _instance;

    public static LazySingleton Instance => _instance ??= new LazySingleton();
}
```

## 更优雅的懒汉单例：`Lazy<T>`

懒汉式单例需要手动处理线程安全问题，代码比较繁琐且容易出错。从 .NET 4.0 开始提供了一个专门用于延迟初始化的类：`System.Lazy<T>`。

使用`Lazy<T>`可以让我们的懒汉式单例代码变得极其简洁、安全且意图明确。例如：

```csharp {5,8}
public sealed class ModernLazySingleton
{
    // 1. 创建一个 Lazy<T> 实例，并传入一个用于创建实例的工厂委托
    private static readonly Lazy<ModernLazySingleton> lazy = 
        new Lazy<ModernLazySingleton>(() => new ModernLazySingleton());

    // 2. 将 Instance 属性的返回值指向 lazy.Value
    public static ModernLazySingleton Instance => lazy.Value;

    // 模拟耗时初始化
    private ModernLazySingleton() => Thread.Sleep(1000); 
}
```

`Lazy<T>`接受一个委托（在这里是`() => new ModernLazySingleton()`）作为构造函数参数，指明了实例如何创建。当我们第一次访问`lazy.Value`属性时`Lazy<T>`会执行传入的委托，并缓存实例。并且，`Lazy<T>`内部已经帮我们实现了所有复杂的线程安全逻辑（双重检查锁定等）。

`Lazy<T>`是一个类对象，且多一个委托，比手动实现需要分配更多的内存，但并不重要。由于`lazy`是 `static readonly`的，它会一直存在于程序的整个生命周期中，**不会在运行时被垃圾回收**。

在游戏开发中，我们最担心的 GC 是在游戏主循环中（比如`Update`方法里）频繁发生的内存分配，因为这会导致性能下降和卡顿。而`Lazy<T>`的这点开销是在游戏启动加载时一次性付清的，对游戏运行时的性能毫无影响。

## `null`值处理

#### 空值条件运算符`?.` (C# 6.0+)

如果左边的对象不是`null`，就访问右边的成员；否则，整个表达式的结果就是 `null`，并且不会继续执行。

最常见的用法是调用事件：

```csharp
ButtonClick?.Invoke();
```

#### 空值合并运算符`??` (C# 8.0+)

用于提供一个默认值。

`??`左侧的值如果不是`null`，就返回左侧的值；否则，返回右侧的值。

**输入**

```csharp
Node node = null;
Node currentNode = node ?? new Node();
Console.WriteLine(currentNode is null);
```

**输出**

```powershell
False
```

#### 空值合并赋值运算符`??=` (C# 8.0+)

这个运算符可以简化“如果变量为`null`，就给它赋值”的场景。

```csharp
public class Manager
{
    private readonly static Manager _instance;
    public static Manager Instance => _instance ??= new Manager();
}
```

#### 可空引用类型 (C# 8.0+)

`null`检查从运行时提前到了编译时。

默认情况下，C# 中所有的引用类型（如 `string`, `GameObject`）都可以是`null`。但当你启用可空引用类”这个功能后，规则就反过来了：

- 默认引用类型不可为 null：

    `string name;`声明了一个不可为`null`的字符串。如果你不初始化它，或者试图给它赋`null`，编译器会给你一个警告

- 需要显式声明可为 null：
    `string? name;` 通过在类型后加`?`，你明确告诉编译器：这个变量可以是 `null`

想要使用此功能需要手动开启。

::: details 在标准的 .NET 项目中开启
1. 打开项目的 `.csproj` 文件。
2. 在 `<PropertyGroup>` 区域内，添加 `<Nullable>enable</Nullable>` 这一行。
```xml {9}
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net9.0</TargetFramework> 
    <ImplicitUsings>enable</ImplicitUsings>
    
    <Nullable>enable</Nullable> 
    
  </PropertyGroup>

</Project>
```

也可以局部启用：
```csharp
// 在这个文件的顶部，开启可空检查
#nullable enable
```
:::

::: details 在 Unity 中开启
1. 根目录下，找到一个名为 `csc.rsp` 的文本文件（没有则手动创建）。这是一个C# 编译器响应（C# Compiler Response）文件。在编译你的 C# 脚本时，会读取这个文件，并将里面的内容作为命令行参数传递给 `csc.exe` 编译器。

2. 打开 `csc.rsp` 文件，在里面输入以下内容并保存：
   ```
   -nullable:enable
   ```
3. 重启 Unity 编辑器
:::


对于编译器发出的不必要的空值警告，你可以使用`!`来抑制。`!` 被称为 null 包容运算符（null-forgiving operator），相当于向编译器承诺：相信我，这个字段在使用前一定会被赋值的。

```csharp
public GameObject playerModel = null!;
```

## 初始化数组&列表

C# 12+：

```cs
string[] keysToLoad = [
    "Prefabs/Chisa.prefab", 
    "Prefabs/Robot.prefab"
];

// --- 列表 ---
List<string> keysToLoad = [
    "Prefabs/Chisa.prefab",
    "Prefabs/Robot.prefab",
    "Prefabs/Tree.prefab"
];
```

C# 9+:

```cs
var keysToLoad = new[] { 
    "Prefabs/Chisa.prefab", 
    "Prefabs/Robot.prefab" 
};

string[] keysToLoad = { "A", "B" };

// --- 列表 ---
// 利用 C# 自身的类型推导
List<string> keysToLoad = new() 
{ 
    "Prefabs/Chisa.prefab",
    "Prefabs/Robot.prefab",
    "Prefabs/Tree.prefab"
};
```

## `List<T>` 很多时候其实不能提高缓存命中率

1. 当 `T` 是值类型（如 `int`, `float`，或 C#/C++ 中的 Struct）时
    - 这个时候，`List<T>` 的可以享受连续内存带来的**高缓存命中率优势**。
    - 因为值类型的真实数据是直接塞在数组的内存块里的。CPU 加载这一段内存时，拿到的是实实在在挨在一起的连续数据。此时，CPU 缓存命中率极高，性能极好。

2. 当 `T` 是引用类型（如 Java 或 C# 中的 Class）时

    在这种情况下，`List<T>` 底层的那个连续数组里，存的并不是对象本身，而是一堆内存地址（指针）。
    真正的对象实体在被 `new` 出来的时候，是由垃圾回收器（GC）随机分配在堆内存（Heap）的各个角落的。
    
    当系统遍历 `List<UserClass>` 去修改每个用户的状态时，CPU 经历了如下极其痛苦的过程：
    
    1. CPU 从数组里极快地读取到了连续的指针（这一步缓存命中率确实高）。
    2. CPU 解析第一个指针，发现真正的 User 数据在堆内存的 A 处。
    3. CPU 去 A 处抓取数据（此时 L1 缓存里没有 A 周围的数据，发生 Cache Miss，CPU 停下等待主存）。
    4. 处理完第一个对象，CPU 解析第二个指针，发现真正的 User 数据在堆内存里的 B 处。
    5. CPU 去 B 处抓取数据（再次 Cache Miss，再次等待主存）。
    
    **这就是指针追逐（Pointer Chasing）。虽然存放引用的数组是连续的，但实际的数据访问路径是随机且碎片化的。**
  
话虽如此，`List<T>` 存在的该问题，其实链表也有。比如链表访问一个对象要经历**两次指针追逐**。

解决方法：

- 使用结构体
- DOD（面向数据设计） 与 SoA

## 少用继承

**coming soon....**

关键词：

- 强耦合
- 虚函数表
- 接口的默认实现，与其静态绑定：因为接口无状态的特性，使编译器可以将其默认实现优化成静态方法

## 从多对一到一对多

与其让所有对象都依赖一个对象，不如一个对象去控制其他对象

**coming soon....**

关键词：

1. 控制反转（IoC，Inversion of Control）：把依赖关系的控制权交出去。
2. 中介者模式（Mediator Pattern）：用一个“调停者”来统一控制和协调多个对象，把网状的相互依赖变成星状的单向控制。