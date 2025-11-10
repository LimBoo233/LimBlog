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

**字符串**

使用 `"""` 来定义多行字符串：

```scala
val multiLineString = """爆裂吧现实！
粉碎吧精神！
放逐这个世界！"""
```

使用 `+` 和 `*` 来拼接字符串和 `char`：

```scala
val hello = "Hello, " + "World" + '!' 
val repeated = "Ha" * 3  // 结果是 "HaHaHa"
```

模板字符串，使用 `$` 来引用变量，称为 s 插值器。如果你要在字符串中嵌入表达式，可以使用 `${}`：

```scala
val x = 5
val y = 10
println(s"$x 和 $y 求和结果是  ${x + y}")
// 如果你只想打印 $ 符号，可以使用 $$：
println(s"价格是 $$100") // 输出：价格是 $100
```

此外还可以使用 `f` 来格式化字符串，类似于 C 语言的 `printf`，称为 f 插值器。语法：`f"...."`，变量后面跟一个 `printf` 风格的格式化指令（如 `%f`, `%d`, `%s`） 。

```scala
val pi = 3.14159
println(f"Pi 大约等于： $pi%.2f")  // .2f 表示保留两位小数
```

使用 `raw` 来表示原始字符串，转义字符不会被处理，例如 `/n` 会被当作普通字符处理，称为 raw 插值器：

```scala
val sec = raw"\section{Title}\label{sec:title}"
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

**输入和输出**

输出：
- `println()`: 打印内容并换行
- `print()`: 打印内容，不换行
- `printf()`: 格式化打印，语法和 f 插值器一样

输入：
Scala 通过 `scala.io.StdIn` 对象来读取命令行输入，例如：

```scala
import scala.io.StdIn.readLine

@main def main(): Unit =
  println("输入学生姓名：:")
  // 读取一行输入
  val name = readLine() 
  println(s"早上好中午好下午好晚上好总之你好，$name ！")
```

- 此外还有 `readInt()`, `readDouble()`, `readBoolean()` 等方法可以直接读取特定类型。
- 如果用户输入的类型无法转换（例如使用 `readInt()` 读取道 `Hello_World`），会抛出异常 `NumberFormatException`。

## 文件读取

有三种方法：
1. 使用 Java 对象
2. 使用 Scala 对象
3. 使用库 (OS-Lib)

读取主要使用 Scala 自带的 `scala.io.Source` 类，而写入则使用 Java 的 `FileWriter` 类。

**读取**

Scala 提供了 `scala.io.Source` 类，通过 `fromFile()` 方法先打开一个文件，然后使用 `getLines()` 方法获取一个迭代器 `Iterator` 来逐行读取文件内容。例如：

```scala
import scala.io.Source

val s = Source.fromFile("name.txt")
val lines = s.getLines()
// 逐行读取
while lines.hasNext do
  val line = lines.next()
  // 处理每一行内容
```

还有一个简单方法 `s.mkString` 可以把整个文件读成一个大字符串。

**写入**

```scala
import java.io.{BufferedWriter, FileWriter}

val bw = new BufferedWriter(new FileWriter("file.txt"))
bw.write("Hello, World!")
// 写入一个换行符
bw.newLine() 
bw.write("This is a test file.\n")
// 关闭
bw.close() 
```

和 Java 不同，Scala 不强迫去 try-catch 异常（如 `FileNotFoundException`） 。不过，这并不意味着你不需要处理异常，建议使用 `try-catch-finally` 块来捕获和处理可能的异常，确保资源正确关闭。例如：

```scala
try
  val br = new BufferedReader(new FileReader("name.txt"))
  // ...
catch
  case nf: FileNotFoundException =>
    println("无法找到指定文件。")
  case io: IOException => 
    println("发生了 IO 异常。")
finally
  // 关闭资源
```