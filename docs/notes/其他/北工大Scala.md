---
title: 北工大Scala
description: 北京工业大学 Scala 课程笔记，目标是用简单的语言与示例让读者快速上手 Scala 编程语言，涵盖基础语法、面向对象编程、函数式编程、文件操作等内容。
---


# 北工大Scala

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
| Int |  `val x = 10` |
| Long |  `val x = 10L` |
| Double |  `val y = 3.14` |
| Float |  `val y = 3.14f` |
| String |  `val s = "Hello"` |
| Boolean |  `val b = true` |

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
  while x < 10 do
    println(x)
    x += 1
```

**for 循环**

语法：for (变量 <- 范围) do ...

```scala
// until: <
for i <- 1 until 10 do
  println(i)

// to: <=
for i <- 1 to 10 by 2 do
  println(i)
```

遍历一个集合：

```scala
val fruits = List("apple", "banana", "cherry")
for fruit <- fruits do
  println(fruit)

// 跳过第一个元素
for fruit <- fruits.drop(1) do
  println(fruit)

// 遍历索引
for i <- fruits.indices do
  println(s"索引 $i 对应的水果是 ${fruits(i)}")
```

在列表中使用过滤：

```scala
val numbers = List(1, 2, 3, 4, 5, 6)
for n <- numbers if n % 2 == 0 do
  println(s"$n 是偶数")

for 5 <- numbers do
  println("找到了数字 5！")
```

**简单的模式匹配**

和 java 中的 switch 语句类似，但功能更强大，目前先简单展示一下：

```scala
val x: Int = getOptionFromGame()
x match
  case 1 => game.start()
  case 2 => game.stop()
  case _ => game.reset()

val num = 42
num match
  case n if n % 2 == 0 => println(s"$n 是偶数")
  case n if n % 2 != 0 => println(s"$n 是奇数")
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

**变长参数**

定义一个接受变长参数的函数，使用 `*` 符号：

```scala
def sumAll(nums: Int*): Int =
  var total = 0
  for num <- nums do
    total += num
  total
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
// 如果你不想覆盖文件，在 FileWriter 里传入第二个参数 true 启动 append mode
// val bw = new BufferedWriter(new FileWriter("file.txt", true))

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

::: detail Java 11+

Java 11 引入的 `java.nio.file.Files` 其实已经把文件写入简化成一行代码了——无需创建 writer，无需 flush，无需 close。

```scala
import java.nio.file.{Files, Path, StandardOpenOption}

// 写入
val p = Path.of("output.txt") // 1. 定义路径
Files.writeString(p, "Hello World\n") // 2. 直接写，自动创建、自动关闭

// 追加写入
// StandardOpenOption.APPEND 表示追加
Files.writeString(p, "Next Line", StandardOpenOption.APPEND) 
```

:::

## 面对对象

**class**

Scala 的类定义非常简洁，你可以非常轻松地定义一个类的属性和构造函数。例如，下面定义了一个 `Person` 类，有两个属性 `name` 和 `age`：

::: code-group

```scala
class Person(val name: String, var age: Int):

  def greet(): Unit =
    println(s"Hello, my name is $name and I am $age years old.")
```

```java
// 在 Java 中实现同样的功能
class Preson {
    private final String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void greet() {
        System.out.println("Hello, my name is " + name + " and I am " + age + " years old.");
    }
}
```

:::

Scala 中成员默认是 `public` 的，需要手动指定为 `private` 或 `protected`。

```scala
class Time(private var hours: Int)
```

在实例化对象时，你可以省略 `new` 关键字:

```scala
val person = Person("Alice", 30)
```

调用方法的方式和 Java 一样，但在 Scala 中如果一个方法无需参数，你可以省略括号，就像是在访问一个属性一样：

```scala
person.greet() 
person.greet
```

**接口/特质**

Scala 使用 `trait` 来定义接口/特质。

```scala
trait Animal:
  def makeSound(): Unit
  def sleep(): Unit =
    println("Zzz...")
```

实现特质：

```scala
class Dog extends Animal, Guard:
  def makeSound(): Unit =
```

**抽象类**

使用 `abstract class` 来定义抽象类：

```scala
abstract class Shape:
  def area(): Double
```

如果你要实现父类中的非抽象方法，必须使用 `override` 关键字。

```scala

实现抽象类：

```scala
class Circle(val radius: Double) extends Shape:
  def area(): Double = Math.PI * radius * radius
  override def toString: String = s"Circle(radius=$radius)"
```

**case class**

case class 是专门专门用于存储数据的一种类，可以帮忙减少许多模板代码：
- 自动实现 `toString`, `equals`, `hashCode` 等有用方法。
- 构造参数默认是 public 且 immutable (val) 的。

定义一个 case class：

```scala
case class Point(x: Int, y: Int)
```

**`sealed`**

`sealed` 关键词类四 java 里的 `final`，表示这个类或接口只能在当前文件中被继承或实现。这对于模式匹配非常有用，因为编译器可以确保你已经处理了所有可能的子类。

```scala
sealed trait Shape
case class Circle(radius: Double) extends Shape
case class Rectangle(width: Double, height: Double) extends Shape

object ShapeAreaCalculator:
  def area(shape: Shape): Double = shape match
    case Circle(radius) => Math.PI * radius * radius
    case Rectangle(width, height) => width * height
```


## 泛型

Scala 中使用 `<>` 来定义范性。例如：

```scala
class Box[T](var content: T):
  def getContent(): T = content

val intBox = Box[Int](10)
```

在编程语言中这种写法是不被允许的：

```scala
val animals: List[Animal] = List[Dog]()
```

这是因为编译器会将 `animals` 视为 `List[Animal]` 类型，如果你尝试向其中添加一个 `Cat` 对象，就会导致类型不匹配的错误。

但如果我们只是从 `animals` 中读取数据，而不进行写入操作，这样的类型转换是安全的。

**类型边界**

有时候你可能希望限制泛型类型的范围，例如只允许某个类的子类作为泛型参数。Scala 提供了类型边界来实现这一点。
- 上界：使用 `<:` 符号表示，表示泛型类型必须是指定类型的子类或实现类。
- 下界：使用 `>:` 符号表示，表示泛型类型必须是指定类型的父类或超类。

```scala
class Cage[T <: Animal](animal: T):
  def getAnimal(): T = animal
```

**协变 Covariant**

如果你能保证一个泛型类在使用时只会读取数据而不会修改数据，那么你可以将这个泛型类声明为协变的。协变使用 `+` 符号表示。例如：

```scala
class CovariantList[+T](elements: List[T]):
  def get(index: Int): T = elements(index)

val dogs: CovariantList[Dog] = CovariantList(List(new Dog()))
val animals: CovariantList[Animal] = dogs
```

**逆变 Contravariant**

如果一个泛型类在使用时只会修改数据而不会读取数据，那么你可以将这个泛型类声明为逆变的。逆变使用 `-` 符号表示。例如：

```scala
class ContravariantPrinter[-T]:
  def print(item: T): Unit =
    println(item.toString())

val animalPrinter: ContravariantPrinter[Animal] = ContravariantPrinter()
val dogPrinter: ContravariantPrinter[Dog] = animalPrinter
```

::: tip Limb 注
你可能是第一次听说协变和逆变的概念，这其实是一个非常复杂的主题。如果你将来不去写一写非常解藕的框架代码，可能一辈子都不会去用到它们，所以这里我就额外解释了协变和逆变可以做到什么，但不会深入，你也可以先不去理解它们，记住有这么个东西就行。
:::


## 数据结构

Scala 的集合分为两大类：可变集合（mutable）和不可变集合（immutable）。默认情况下，Scala 使用不可变集合。如果你尝试修改一个不可变集合，会得到一个新的集合，而不是修改原有的集合。

- 既有可变版本也有不可变版本的集合：`Set`, `Map`
- 只有不可变版本的集合：`List`
- 只有可变版本的集合：`ListBuffer`, `ArrayBuffer`

**数组**

Scala 中的数组是可变的，使用 `Array` 类型，其长度固定内容可变，通过 `(index)` 来访问和修改元素：

```scala
val arr: Array[Int] = Array(1, 2, 3)
arr(0) = 10 
// 指定长度必须用到 new 关键字
val names = new Array[String](10)
```

**元组**

元组是一种常用且特别的数据结构，可以存储多个不同类型的值。元组使用小括号 `()` 定义，元素之间用逗号分隔。例如：

```scala
val person: (String, Int, Boolean) = ("Alice", 30, true)
val pizza = ("Large", 19.99)
```

元组的元素可以通过类似 `_1`, `_2`, `_3` 的方式访问特定位置的元素，但注意索引是从 1 开始的：

```scala
val name = person._1  // "Alice"
```

之所以说元组特别，是因为它和我们平时使用的数据结构（ex: `List`）不一样，我们通常不会用其储存一些需要反复操作长久使用的数据，而是用来临时存储一些相关联的数据，例如函数的返回值。

```scala
// 函数返回多个值
def getUserInfo(userId: Int): (String, Int) =
  // 假设从数据库获取用户信息
  ("Alice", 30)

val (name, age) = getUserInfo(1)
println(s"Name: $name, Age: $age")
```

元组在构建 `Map` 时非常有用：
 
```scala
val capitals: Map[String, String] = Map(
  ("USA", "Washington D.C."),
  ("France", "Paris"),
  ("Japan", "Tokyo")
)

// 使用 -> 创建二元元组，更优雅
val capitals: Map[String, String] = Map(
  "USA" -> "Washington D.C.",
  "France" -> "Paris",
  "Japan" -> "Tokyo"
)
```



::: tip
此处 `->`  其实是一个方法，实现了隐式类型转换方法，但 for 循环里的 `<-` 确实是关键词，并且 for 循环也可以自动解构赋值给元组。
:::

**Map**

```scala
// 创建一个不可变 Map
val scores = Map(
  "Alice" -> 95,
  "Bob" -> 88,
  "Charlie" -> 72
)

// 获取值
println(scores("Bob"))
// 使用 get 返回 Option，防止崩溃，详细会在异常处理章节介绍
scores.get("Charlie") match {
  case Some(s) => println(s"分数是 $s")
  case None    => println("没找到")
}
// 或者提供默认值
println(scores.getOrElse("Charlie", 0))

// 添加元素
val updatedScores = scores + ("David" -> 85)
// 删除元素
val reducedScores = scores - "Alice"
// 更新元素
val newScores = scores + ("Alice" -> 100)

// 遍历 Map
for (name, score) <- scores do
  println(s"$name: $score")
```

**Set**

大部分方法和 `Map` 类似。

```scala
// 创建一个不可变 Set
val fruits = Set("apple", "banana", "cherry")

// 检查是否存在
println(fruits.contains("banana"))
```

## 简单 FP

函数式编程 FP 的核心原则：
- 声明式 (Declarative): 告诉计算机要什么结果，而不是怎么做。
- 确定性 (Deterministic): 相同的输入总是产生相同的输出，没有副作用。
- 无副作用 (No Side-Effects): 函数不修改外部状态，也不进行 I/O，只依赖输入参数。
- 纯函数 (Pure Functions): 既确定又没有副作用的函数。
- 头等函数 (First-Class Functions): 函数可以像数据一样被赋值给变量、作为参数传递、或者作为返回值返回。
- 不可变数据 (Immutable Data): 数据一旦创建就不能修改，这有助于保证函数是纯函数。
- 递归 (Recursion): 用递归代替循环，因为循环通常依赖可变变量（如 `i++`）。

**尾递归**

每次函数的调用都会创建一个新的栈帧 (Stack Frame)，如果递归调用过深，可能会导致栈溢出 (Stack Overflow)。

尾递归是一种特殊的递归形式，允许编译器优化递归调用，避免栈溢出。如果递归调用是函数执行的最后一个动作且递归调用回来后不再做任何运算 ，就叫尾递归。

```scala
// 尾递归
def factorialTailRec(n: Int, accumulator: Int = 1): Int =
  if n <= 1 then accumulator
  else factorialTailRec(n - 1, n * accumulator)

// 非尾递归
def factorial(n: Int): Int =
  if n <= 1 then 1
  else n * factorial(n - 1)
```

上面这个例子其实也展示了一个常见的技巧：使用累加器 (Accumulator) 来保存中间结果，从而实现尾递归。

在 Scala 中，如果你为函数标记 `@tailrec`，编译器不仅会检查你的函数是不是真的尾递归，还会自动把尾递归优化成类似 `while` 循环的高效代码，保证不会爆栈。

```scala
import scala.annotation.tailrec

@tailrec
def factorialTailRec(n: Int, accumulator: Int = 1): Int =
  if n <= 1 then accumulator
  else factorialTailRec(n - 1, n * accumulator)
```

**高阶函数**

函数是头等公民 (First-Class Citizens)，这意味着函数不再只是代码，而是可以像数据一样被传递和操作的实体。函数可以作为参数传递给其他函数，也可以作为返回值返回。

- 函数作变量： 你可以把函数赋值给一个 `val`。

  ```scala
  val plusFive = (num: Int) => num + 5
  ```

- 函数作参数： 你可以把一个函数传给另一个函数。

  ```scala
  val ans = someFunction(plusFive, 100.15)
  ```

Sclala 非常喜欢简化代码：
1. 类型省略：如果编译器能猜出类型，就可以省略。
2. 括号省略：如果函数只有一个参数，可以省略括号。
3. 下划线 `_`: 如果参数在函数体里只出现一次，并且顺序对应，可以直接用 `_` 代替参数名。
    ```scala
    val addTen = x => x + 10
    val addTenSimplified = _ + 10
    ```

**柯里化**

柯里化（Currying）在数学上是将一个接受多个参数的函数，转换成一连串接受单个参数的函数的技术 。

有三种方式可以实现柯里化：

- 手动闭包

    ```scala
    // 普通函数
    val sum = (a: Int, b: Int) => a + b
    // 柯里化
    val sumCurried = (a: Int) => (b: Int) => a + b
    ```

- `.curried` 方法

    ```scala
    val sumCurried = sum.curried
    ```

- 多参数列表语法糖

    ```scala
    def sumCurried(a: Int)(b: Int): Int = a + b
    ```

在 Scala 里使用柯里化可以突破可变参数的限制：

```scala
def foo(as: Int*)(bs: Int*) = as.sum / bs.sum
```


## 集合操作

For 推导式可以生成新的集合，本质上是集合操作函数的语法糖，其基本结构如下：

```scala
for 
  item <- collection   // 生成器 (Generator)
  if condition        // 守卫 (Guard/Filter)
  if anotherCondition // 另一个守卫
yield result         // 结果表达式
```

- 映射

  ```scala
  val nums = List(1, 2, 3)
  // 返回一个新的 List(2, 4, 6)
  val doubled = for (n <- nums) yield n * 2
  ```

- 过滤

  ```scala
  val nums = List(1, 2, 3, 4, 5, 6)
  // 返回一个新的 List(2, 4, 6)
  val evens = for (n <- nums if n % 2 == 0) yield n
  ```
- 多重迭代

  ```scala
  val numbers = List(1, 2)
  val letters = List("a", "b", "c")
  // 返回一个新的 List("1a", "1b", "1c", "2a", "2b", "2c")
  val combinations = for
    n <- numbers
    l <- letters
  yield s"$n$l"
  ```

此外 For 推导式还可以用于异常处理，不过这就是后话了，我们之后还会提到。


集合操作函数 HOFs 可以让我们很方便地对集合进行各种操作，而不需要手动编写循环。

- `filter`：保留集合中返回值为 `true` 的元素。

  ```scala
  iL.filter(_ > 50)  // 保留大于50的数
  ```

- `map`：把集合里的每个元素映射成另一个元素，会返回一个新的集合。

  ```scala
  iL.map(_ * 2). // 每个数字乘 2
  SL.map(_.toUpperCase)  // 变成大写
  ```

- `foreach`：对集合中的每个元素作为参数，传入一个指定的单参数函数。

  ```scala
  iL.foreach(println)
  ```

- `flatMap`：先对集合中的每个元素应用一个函数，然后把结果扁平化成一个新的集合。

  ```scala
  val a = List(1, 2, 3)
  val b = List(4, 5, 6)
  // List(5, 6, 7, 6, 7, 8, 7, 8, 9)
  val combinations = a.flatMap(x => b.map(y => x + y)) 
  ```

你可以使用类似的方式对集合进行排序：

- `sorted`：按照自然顺序排列。

  ```scala
  val sortedList = nums.sorted
  ```

- `sortBy`：指定按对象的哪个属性排序。

  ```scala
  val newPersons = persons.sortBy(_.age)
  ```

- `sortWith`：自定义排序，需要提供一个比较函数。

  ```scala
  val newPersons = persons.sortWith((p1, p2) => p1.age < p2.age)
  ```



## 函数组合

**组合与配对**

组合和配对用于将多个函数连接在一起，形成一个新的函数。

- `compose`：组合函数

    ```scala
    f.compose(g)  // 相当于 f(g(x))
    ```

- `andThen`：与 `compose` 的运行顺序相反

    ```scala
    f.andThen(g)  // 相当于 g(f(x))
    ```

- `zip`：配对函数，将两个集合的对应元素配对成元组。

    ```scala
    val a = List(1, 2, 3)
    val b = List("a", "b", "c")
    val zipped = a.zip(b)  
    // 结果是 List((1, "a"), (2, "b"), (3, "c"))
    ```

**折叠与归约**

用于把一个集合中的元素压缩成一个值。

- `reduce`：直接把集合里的元素两两操作。

    ```scala
    val nums = List(1, 2, 3, 4)
    val sum = nums.reduce(_ + _) 
    ```
  
- `fold`：和 `reduce` 类似，但可以指定一个初始值。

    ```scala
    val sum = nums.fold(0)(_ + _) 
    ```

- `foldLeft`/`foldRight`：此方法可以明确 `fold` 的执行顺序，通常使用 `foldLeft`。

    ```scala
    val resultLeft = nums.foldLeft(0)(_ + _)  
    ```

- `scan`：类似于 `fold`，但返回的是每一步的中间结果组成的集合。

    ```scala
    val scanResult = nums.scan(0)(_ + _)  
    // 结果是 List(0, 1, 3, 6, 10)
    ```



## `Object`

**单例对象**

Scala 使用 `object` 关键字来定义单例对象，这可以说是对单例模式的语法糖。而且通过 `Object` 关键词定义的单例是惰性的，你不需要担心线程安全问题。

```scala
object BookService:
  private val books = scala.collection.mutable.ListBuffer[String]()

  def addBook(book: String): Unit =
    books += book

  def listBooks(): List[String] =
    books.toList
```

**`apply` 方法**

`apply` 方法允许你像调用函数一样调用对象。它通常用于工厂方法，简化对象的创建过程。

```scala
object MathUtils:
  def apply(x: Int): Int = x * x

// 相当于 MathUtils.apply(5)
val square = MathUtils(5)  
```

**`unapply` 方法**

`unapply` 解构方法用于模式匹配，允许你从对象中提取值。它通常与 `case class` 一起使用，但也可以在普通对象中定义。

```scala
class Email(val address: String)

object Email:
  def apply(address: String): Email =
    new Email(address)

  def unapply(email: String): Option[(String, String)] =
    val parts = email.split("@")
    if parts.length == 2 then Some((parts(0), parts(1)))
    else None

// case 可以自动调用 unapply 方法进行解构
val email = "user@example.com" match
  case Email(user, domain) => s"User: $user, Domain: $domain"
  case _ => "Invalid email"
```

**Companion Object**

如果一个 `class` 和一个同名 `object` 在同一个文件里，它们互为伴生，可以互相访问对方的 private 成员。

```scala
class Counter(private var count: Int):
  def increment(): Unit =
    count += 1

object Counter:
  def apply(): Counter = Counter(0)
```

::: tip
Scala 中并没有 `static` 关键字，不过伴生对象 `object` 可以一定程度替代 `static` 的生态位。
:::

**`case object`**

`case object` 是 `case class` 的单例版本，此外，case class 还替代了枚举类的生态位：

```scala
// 定义一组状态
sealed trait State
case object Idle extends State
case object Running extends State
case object Finished extends State

// 它们既是单例对象，又能直接用于 match case，还自带 toString
val current: State = Idle

current match
  case Idle => println("System is idle.")
  case Running => println("System is running.")
  case Finished => println("System has finished.")
```



## 运算符

**列表运算符**

列表运算符允许你使用类似数学符号的方式来操作集合：
- `:+ `: 在末尾追加元素
- `+:` : 在开头插入元素
- `++` : 连接两个列表
- `::` : 在开头插入（不局限于 List）
- `:::` : 连接两个列表
```scala
val list1 = List(1, 2, 3)
val list2 = List(4, 5, 6)

// 连接两个列表
val combined = list1 ++ list2
// 添加元素到列表开头
val prepended = 0 :: list1
// 添加元素到列表末尾
val appended = list1 :+ 4
```

**运算符重载**

其实在 Scala 中，并没有 `+`，`-` 等运算符，他们本质上都是方法。当你写 `a + b` 时，Scala 会把它翻译成 `a.+(b)`。

```scala
class Vector(val x: Int, val y: Int):
  def +(that: Vector): Vector =
    Vector(this.x + that.x, this.y + that.y)

val v1 = Vector(1, 2)
val v2 = Vector(3, 4)
val v3 = v1 + v2 
```

## 异常处理

**引用透明 Referential Transparency**

如果一个表达式（比如一个函数调用）可以被它的运算结果（返回值）直接替换，而不会改变程序的行为，那么这个表达式就是引用透明的。

For instance:

```scala
def add(x: Int, y: Int): Int = x + y

val result = add(2, 3) + add(3, 2)
// 可以替换为：
val result = 5 + 5
```

引用透明的函数易于预测和理解，不会引起副作用 (Side Effects)，这使得代码更容易测试和重用。然而像 Java 那样抛出异常会破坏引用透明性，所以在 Scala 中我们最好另寻他法。

**`Option` 类型**

使用 `Option` 类型替换 null，表示一个可能存在也可能不存在的值。`Option` 有两个子类型：
- `Some`：表示存在值
-  `None`：表示不存在值

```scala
def safeDivide(x: Int, y: Int): Option[Int] =
  if y == 0 then None
  else Some(x / y)

// 这里其实是调用了解构函数
val result = safeDivide(10, 2) match
  case Some(value) => s"Result: $value"
  case None => "Cannot divide by zero."

// 也可以用在 for 循环中
val results: List[Option[Int]] = List(Some(10), None, Some(20), None)

 for Some(value) <- results do
  // None 的情况会自动匹配失败，然后被静默跳过
  println(s"获取到数值: $value")
```

**`Try` 类型**

使用 `Try` 类型来替换 try-catch 块，它捕获异常并将其放入一个对象中，而不是中断程序。
- `Success(value)`：代码执行成功
- `Failure(exception)`： 代码抛出了异常，异常被包裹在这里 

```scala
import scala.util.{Try, Success, Failure}

val result: Try[Int] = Try("123a".toInt)

// 可以检查结果，或者提供默认值
val finalResult = result.getOrElse(0)

// 或者
result match
  case Success(value) => println(s"Parsed value: $value")
  case Failure(exception) => println(s"Failed to parse integer: ${exception.getMessage}")
```

**`Either` 类型**

`Either` 类型用于表示两种可能的结果，通常用于函数可能返回两种不同类型的值的情况。`Either` 有两个子类型：
- `Left(value)`：通常表示错误或异常情况
- `Right(value)`：通常表示成功情况

```scala
def divide(x: Int, y: Int): Either[String, Int] =
  if y == 0 then Left("Cannot divide by zero.")
  else Right(x / y)

val result = divide(10, 0) match
  case Left(errorMessage) => s"Error: $errorMessage"
  case Right(value) => s"Result: $value"
```

**使用 For 推导式处理 `Option`, `Try`, `Either`**

使用 For 推导式可以避免大量的 `if a != null do if b != null do ...` 嵌套检查。

::: code-group

```scala [使用 For]
val maybeA: Option[Int] = Some(10)
val maybeB: Option[Int] = Some(20)
// val maybeB: Option[Int] = None

// 如果 maybeA 或 maybeB 是 None，直接停止并返回 None
val sum: Option[Int] = for {
  a <- maybeA
  b <- maybeB 
} yield a + b  // Some(30)
```

```scala [不使用 For]
val maybeA: Option[Int] = Some(10)
val maybeB: Option[Int] = Some(20)

val sum: Option[Int] = 
  if maybeA.isDefined then
    val a = maybeA.get
    if maybeB.isDefined then
      val b = maybeB.get
      Some(a + b)
    else
      None
  else
    None
```
:::

## 用函数式思想编写 Model

在传统的 OOP 中会将数据类和操作逻辑写在一起，但在 FP 中更倾向于将逻辑和数据分离，数据类只储存不可变数据，这种做法也称作：Skinny Domain Models。例如：

::: code-group

```scala [FP.scala]
// 1. 定义数据类
case class Pizza(size: String, price: Double)

// 2. 定义逻辑
def calculatePrice(p: Pizza): Double =
  p.price * 1.5
```


```csharp [OOP.cs]
public class Pizza {
    public string Size { get; set; }
    public double Price => size * 1.5;
}
```

:::

至于逻辑代码具体写在哪里，这里提供四种方法：
1. 伴生对象：把逻辑写在伴生对象里，好处是可以编写能访问 private 成员的纯函数。~~fw~~

2. 模块化方法 Modular Approach：先使用 Trait 定义服务接口，再实现。~~典~~

3. Functional Objects：逻辑还在对象里，但这些方法不会修改对象，而是返回一个新的对象。

4. 扩展方法 Extension Methods：扩展方法是像 Scala 等比较新的语言中非常 pro 的一个特性，允许你在不修改原始代码而为一个类添加新方法。

  ```scala
  case class Pizza(size: Int)

  // 扩展方法
  extension (p: Pizza)
    def isLarge(): Boolean = p.size >= 12

  // 调用
  val pizza = Pizza(14)
  println(pizza.isLarge())  // true
  ```


## Laziness, Monoids, and Monads

### 惰性

惰性意味值不会被立刻计算，而推迟到需要时才计算。

语法：`lazy val`

```scala
lazy val text = {
  println("Reading file...")
  scala.io.Source.fromFile("data.txt").mkString
}

// ... 过了很久 ...
// 此时才会打印 "Reading file..." 并读取文件
println(text)
```

惰性列表的长度是按需计算的，而不是预先定义好的，这也意味着你可以定义一个无限长的列表。定义惰性列表需要用到 `#::` 操作符，类似于 `::`。

```scala
// 生成从 n 开始的无限自然数序列
def from(n: Int): LazyList[Int] = n #:: from(n + 1)

val nats = from(1) // 此时只计算了 1
println(nats.take(3).force) // 强制取出前3个：List(1, 2, 3)
```

函数可以定义惰性参数，此类参数只有在函数体内被使用时才会被计算，此特性在英文里叫做 Call-by-Name Parameters。

语法：`param: => Type`

```scala
// msg 本质上是一个没有参数的函数
def logIfDebug(msg: => String): Unit =
  val debug = true // 假设这是从配置文件读取的
  if debug then
    println(msg) // 只有在 debug 模式下才会计算 msg

logIfDebug({
  println("Computing log message...")
  "This is a debug message."
})
```

### Monoids

这是一个数学概念，在编程中是一种通用的组合模式。

一个数据类型如果满足以下三个条件，就可以称为 Monoid：
1. 一个类型 `T`。
2. 存在一个满足结合律的二元操作 op(a, b)，例如 `a + (b + c) = (a + b) + c`。
3. 存在一个单位元 Identity `zero`。即 `op(a, zero) == a`。

在 Scala 中，常见的 Monoid 实例有：
- 整数加法：类型 `Int`，操作 `+`，单位元 `0`。
- 字符串连接：类型 `String`，操作 `+`，单位元 `""`。
- 列表连接：类型 `List[T]`，操作 `++`，单位元 `Nil`。

满足 Monoid 条件的数据类型可以方便地进行聚合操作和并行计算，例如使用 `fold` 来累积结果。

```scala
val numbers = List(1, 2, 3, 4, 5)
val sum = numbers.fold(0)(_ + _)
```

### Functors & Monads

#### Functors

简单来说，Functor 就是一个可以被 `map` 的容器：它有一个 `map` 方法，接受一个函数 `A => B`，将容器里的 A 变成 B，但容器结构不变。

`List`, `Option`, `Future` 都是 Functor。

Functor 在代码中被如下定义：

```scala
trait Functor[F[_]]:
  def map[A, B](fa: F[A])(f: A => B): F[B]
```

其中, `F[_]` 是一个高级类型 Higher-kinded Type，代表着 `F` 是一个类型构造器 Type Constructor，它接受一个类型 `A` 并生成一个新的类型 `F[A]`。简单来说，`F[_]` 代表一个容器。

实现 Functor：

```scala
val listFunctor = new Functor[List] {
  def map[A, B](fa: List[A])(f: A => B): List[B] = {
    // 这里的 fa 就是一个 List，直接调用 Scala 原生的 map
    fa.map(f) 
  }
}
```

#### Monads

Monads 是 Functor 的加强版，其有两个核心操作：
- `unit` (或 `pure`/`apply`): 把一个普通值放入容器中，如 `Some(1)`。
- `flatMap`: 它接受一个返回容器的函数，`flatMap` 会把嵌套的容器拆箱拍平。

使用 Monads 可以方便地进行链式操作，避免嵌套的容器结构。比如我们有一连串的步骤，但这些步骤中需要频繁进行 `null` 检查：

```scala
// 使用 flatMap 链式调用
Option(name).flatMap(n => 
  Option(phone).flatMap(p => 
    Some(Customer(n, p))
  )
)

// 或者更简单的 For-Comprehension (语法糖):
for {
  n <- Option(name)
  p <- Option(phone)
} yield Customer(n, p)
```