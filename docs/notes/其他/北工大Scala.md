# 北工大Scala3

## 速览

**Main 方法**

无命令行参数：

```scala
@main def hello(): Unit =
  println("Hello, Scala 3!")
```

有命令行参数：

```scala
// 这里的 String* 类似于 Java 里的 String[] args
@main def hello(args: String*): Unit =
  println(s"Hello, $name!")
```

**常量与变量**

- 常量：不可变，使用 `val` 关键字声明，鼓励使用常量。

    ```scala
    val x: Int = 10
    // 类型可以省略，Scala 会自动推断
    val y = 15
    ```

- 变量：可变，使用 `var` 关键字声明。

    ```scala
    var y: Int = 20
    y = 30
    ```

**基本数据类型**
| 类型 |  声明 | 
| ---- | ---- |
| `Int` |  `val x = 10` |
| `Long` |  `val x = 10L` |
| `Double` |  `val y = 3.14` |
| `Float` |  `val y = 3.14f` |
| `String` |  `val s = "Hello"` |
| `Boolean` |  `val b = true` |

**if 语句**

if 语句有两种写法，一种使用 `()`，另一种使用 `then` 关键词，这两个是等价的：

```scala
if (x > 34)
  println("x is big")

// 或者
if x > 34 then
  println("x is big")

// 更复杂一点
if x > 0 then
  println("x is positive")
else if x < 0 then
  println("x is negative")
else
  println("x is zero")
```

**while 循环**

语法：`while .... do ...`

```scala
var x = 0
while (x < 10) do
  println(x)
  x += 1
```

**简单的模式匹配**

和 java 中的 switch 语句类似，但功能更强大，目前先简单展示一下：

```scala
val x: Int = getOptionFromGame()
x match
  case 1 => game.start()
  case 2 => game.stop()
  case _ => game.reset()
```

**函数**

定义一个简单的函，其中 `def` 代表要声明一个函数，后面跟上函数名、参数列表，`:` 后为返回类型（即使不指定类型，Scala 也会自动推断）：

```scala
def add(x: Int, y: Int): Int =
  x + y

// Unit 相当于 Java 里的 void，代表没有返回值
def printSum(x: Int, y: Int): Unit =
  println(x + y)
```

调用函数和 java 类似：

```scala
val result = add(5, 10)
```

匿名函数，语法：`(参数: 类型) => 函数体`，例如：

```scala
val plusFive = (num: Int) => num + 5
// 调用这个匿名函数
val result = plusFive(10)
```

**高阶函数**

高阶函数指可以接受另一个函数作为参数的函数。

举一个例子，下面这个 `calculate` 函数会接受一个函数 `f` 和两个整数 `x`、`y` 作为参数，并返回函数应用于这两个整数的结果：

```scala
val calculate = (f: (Int, Int) => Int, x: Int, y: Int) => f(x, y)

// 定义一个加法函数
val add = (a: Int, b: Int) => a + b
// 使用 calculate 函数进行加法运算
val sum = calculate(add, 5, 10)
println(s"Sum: $sum")  // 输出: Sum: 15
```

**包和导入**

声明包和 Java 类型，在文件上使用 `package` 关键字：

```scala
package com.example.myapp
// ..
```

你可以导入一个类，或者导入一个类中的方法：

```scala
// 导入一个类
import scala.math.P
// 导入一个类中的方法
import scala.io.StdIn.readLine

// *：导入包中的所有类
import package.*
// {}：从一个包或对象中导入多个指定的项
import package.{ClassA, ClassB, methodC}
```
