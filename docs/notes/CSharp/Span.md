# Span

## 简介

`Span<T>` 是 C# 中一个极为核心的高性能类型，可以把它理解为托管内存的“窗口”。

`Span<T>` 是一种 `ref struct`，它安全地表示任意连续内存区域的一个片段，并且不复制内存，完全不产生 GC 堆分配。
  
使用 Span（零分配）：

```csharp
ReadOnlySpan<char> text = "Hello World".AsSpan();
ReadOnlySpan<char> sub = text.Slice(0, 5); // 没有 new 任何新对象，只是创建了一个视图

// 直接使用 sub，不会产生任何 GC 开销
Console.WriteLine(sub.ToString()); // 输出 Hello（注意 ToString() 这里还是会生成新字符串）
```

在使用 `Span<T>` 时，有两个关键点需要特别注意：

- `ReadOnlySpan<T>`：这是 `Span<T>` 的只读版本。由于 `string` 是不可变的，操作字符串时必须使用 `ReadOnlySpan<char>`。绝大多数涉及字符串高性能解析的场景都会用到它。

- 无法存储在堆上：因为 `Span<T>` 是 `ref struct`，你不能在 `List<Span<int>>` 中使用它，也不能将其作为 `class` 的属性。如果你需要将切片数据持久化存储，最终还是需要复制到数组或 `Memory<T>`（`Memory<T>` 是 `Span` 的可存储堆版本）中。

| 特性       | 说明                             |
| -------- | ------------------------------ |
| **本质**   | 托管内存的安全视图（`ref struct`）        |
| **内存来源** | 数组、栈内存（`stackalloc`）、非托管指针     |
| **性能优势** | **零拷贝切片**、零堆分配、不触发 GC          |
| **主要代价** | 只能在栈上使用，不能作为类成员，不能跨 `async` 方法 |

> 这东西有点太厉害，之后找个时间细致了解下

## `ref struct` 和 `ref` 字段

### `ref struct`

`Span<T>` 是引用结构体，是通过 `ref struct` 关键词声明的。此类结构体让 `Span<T>` 这种在包含托管指针（`ref`）的类型，在保证安全的前提下，快如指针，且无 GC。

`ref struct` **给结构体施加一系列只允许存活在栈上的硬性约束**。编译器会严格执行以下禁令：

- 不能被装箱（不能转为 `object` 或接口）
- 不能作为类的字段
- 不能作为普通结构体的字段（除非该字段本身也是 `ref struct`）
- 不能实现接口（因为实现接口会涉及装箱）
- 不能用于 `async` 异步方法
- 不能用于迭代器（`yield return`）

简略的示例：

```cs
public readonly ref struct Span<T>
{
    private readonly ref T _reference;  // 托管指针，指向内存起始地址
    private readonly int _length;       // 元素个数
    
    // ... 索引器、切片等方法
}
```

::: details `async/await`

当你写一个 `async` 方法时，编译器会在背后偷偷把你的方法**重构成一个类（状态机）**。

- 当代码执行到 `await` 时，当前线程会立即返回（方法被挂起）
- 为了等异步操作完成后能恢复执行，方法里的**所有局部变量**（包括参数、临时变量）都必须被保存下来
- 这些变量被提升（Promote）为这个**状态机类的字段**，分配在托管堆上

```cs
// 不允许的示例
public async Task BadMethod()
{
    Span<int> local = stackalloc int[10]; // 数据在当前栈帧上
    local[0] = 1;
    await Task.Delay(1); // 执行到这里，当前方法返回，栈帧被销毁！
    Console.WriteLine(local[0]); // 恢复执行时，栈内存早已被覆盖，读取的是垃圾数据！
}
```

如果编译通过，`await` 之后去读取 `local[0]`，相当于访问了一块已经释放的栈内存，程序会瞬间崩溃（Access Violation）。虽然存在例外情况数据在堆上（ex: `new int[10].AsSpan()`），但编译器分析不出来，故只要是用 `ref struct` 声明的变量，一律不允许出现在 `await` 的挂起区间内。

不过，虽然编译器禁止的让 `Span` 跨越 `await` 存活，但你仍可以在 `await` 前后使用 `Span`。例如：

```cs
public async Task ProcessAsync(int[] array)
{
    // 1. await 之前：创建 Span，干活
    Span<int> span1 = array.AsSpan();
    // 此时 span1 变量还在栈上，但我们准备 await 了，不再使用它

    // 2. 执行异步等待（此时 array 作为引用被保存在状态机里，存活在堆上）
    await Task.Delay(100); 

    // 3. await 之后：基于依然活着的 array，重新在栈上创建一个全新的 Span
    Span<int> span2 = array.AsSpan(); 
}
```

- 这种思路很常见，后来催生了 `Memory<T>`：可以安稳地躺在 `async` 状态机里普通结构体。你只需要在需要使用数据的同步代码块中，调用 `Memory<T>.Span` 即可。

- `Memory<T>` 作为字段确实会增大状态机对象的内存占用大小。但这对 GC 的影响微乎其微，甚至可以说是完全忽略不计的。因为 **GC 的压力主要来自于分配次数（频率），而不是单次对象的大小（只要没超大）**。

:::

### `ref` 字段

示例中使用了**引用字段**，他使你能在结构体中，声明一个直接指向另一个变量的**托管引用**（Managed Pointer），而不是存储那份数据的副本。

`ref`  字段相较于 `T* _ptr` 是受保护的，安全的：当 GC 压缩堆时，运行时**会自动更新**这个引用指向的新地址。

但既然 `ref` 字段指向外部变量，编译器就必须确保**被指向的变量活得比这个结构体久**。因此，`ref` 字段只能出现在 **`ref struct`** 中，受严格的安全检查。

合法的示例：

```cs
public ref struct Container
{
    private ref int _refField;
    // 通过构造函数从外部传入引用
    public Container(ref int value)
    {
        _refField = ref value; // ✅ 正确，由调用方保证生命周期
    }
}

// 使用
int[] array = new int[10];
Container c = new Container(ref array[0]); // 指向堆上的数组元素
```

非法的示例：

```cs
public ref struct Container
{
    private ref int _refField;

    public Container()
    {
        int local = 42;
        _refField = ref local; // ❌ 编译错误！local 是局部变量，
                               // 方法结束就销毁，不能让字段指向它。
    }
}
```

现在的 C# 允许你在字段前面组合使用 `ref` 和 `readonly`，以表达不同的意图：

| 字段声明                             | 含义                                   |
| -------------------------------- | ------------------------------------ |
| `private ref T _field;`          | 可以**读写**指向的内存。                       |
| `private readonly ref T _field;` | 只能**读取**指向的内存（类似 `in` 参数）。           |
| `private ref readonly T _field;` | **（常见于只读引用）** 指向一个只读变量，且字段本身不能被重新赋值。 |

### `stackalloc`

`stackalloc` 是 C# 中的一个**上下文关键字**，它的作用非常直白：**在线程栈（Thread Stack）上直接分配一块连续的内存空间。**

特点：

| 特性      | 详细说明                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------- |
| 极致速度    | 分配内存仅仅是移动一下栈指针（CPU 的一条指令），比 `new byte[1024]` 快一个数量级                                                           |
| 零 GC    | 栈上的内存在方法执行完毕后**自动弹出销毁**，GC 完全不会扫描这块区域                                                                         |
| 生存期极短   | 分配的内存**只能在当前方法内使用**，方法返回时立即失效。绝对不能把这块内存的引用返回出去                                                                |
| 大小有限制   | 线程栈默认只有 **1MB（32位）** 或 **4MB（64位）** 左右。如果你 `stackalloc` 一个 10MB 的缓冲区，会直接触发 `StackOverflowException`（栈溢出），程序崩溃 |
| 只能用于值类型 | 分配的元素必须是值类型（如 `int`、`byte`、`char`），不能是引用类型（如 `string`、`object`）                                               |

示例：

```cs
// 分配并初始化为 1, 2, 3
Span<int> numbers = stackalloc int[] { 1, 2, 3 };

// 针对小于特定大小的优化（避免栈溢出风险）
int length = 256;
Span<byte> buffer = length <= 1024 ? stackalloc byte[length] : new byte[length];
```

虽然 `stackalloc int[] { 1, 2, 3 };` 创建了新的数组，但由于他是分配在栈上的，故方法结束则释放内存，完全不受 GC 管理。