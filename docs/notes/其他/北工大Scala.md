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
while (x < 10) do
  println(x)
  x += 1
```

**for 循环**

语法：for (变量 <- 范围) do ...

```scala
for i <- 1 to 10 do
  println(i)
```

遍历一个集合：

```scala
val fruits = List("apple", "banana", "cherry")
for fruit <- fruits do
  println(fruit)
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

## 对象

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

Scala 中的数组是可变的，使用 `Array` 类型，其长度固定内容可变，通过 `(index)` 来访问和修改元素：

```scala
val arr: Array[Int] = Array(1, 2, 3)
arr(0) = 10 
// 指定长度必须用到 new 关键字
val names = new Array[String](10)
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

## 高阶函数

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

## 集合操作



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

## 柯里化

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

