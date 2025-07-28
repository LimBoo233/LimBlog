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

可有时这样的命名空间不是我们想要的，我们希望它能更简洁一些，比如 `MyGame.Model` 这样的。

为此，你需要修改一些属性。在上面这种情况下，通过右键 `_MyGame` 和 `Scripts`，找到属性（properties），然后取消勾选命名空间提供程序选项。此时，Rider 自动生成的命名空间将会变得更为简洁，例如：
```csharp [Assets/_MyGame/Scripts/Model/UserCredentials.cs]
namespace Model
{
    // ..
}
```

但我们仍希望能自动生成 `MyGame.Model` 这样的规范命名空间，如果手动添加的话既麻烦又会导致编辑器警告。

如果要解决这个问题，首先将编辑器左上角切换问解决方案（Solution Explorer），下方右键 `Assembly-CSharp` 并打开属性（Properties），修改根命名空间（Root Namespace）属性。效果如下：
```csharp [Assets/_MyGame/Scripts/Model/UserCredentials.cs]
namespace MyGame.Model
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

此外，C# 还提供了 `??` 运算符，用于处理可能为 `null` 的情况。

例如：
```csharp
string value = nullableValue ?? "默认值";
```

有时可以通过按位或运算符 `|` 来简化多个条件的判断。

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

## 可为空的 `struct`-`Nullable<T>`糖
在 C# 中，`struct` 是值类型，不能为 `null`。但有时我们需要一个可以表示“无值”的 `struct`，这时可以使用 `Nullable<T>` 结构体。例如：
```csharp
int? nullableInt = null; 

// 本质上
Nullable<int> nullableInt = new Nullable<int>();
```