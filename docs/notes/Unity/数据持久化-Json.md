# 数据持久化之-Json

JSON 的全称是 JavaScript Object Notation (JavaScript 对象表示法)。它使用一种人类易于阅读和编写，同时机器也易于解析和生成的格式，来组织和交换数据。

JSON 是现代应用开发中的主流和首选。它轻量、易读，并且与 Web 技术（尤其是 JavaScript）完美契合。

**本篇聚焦于 JSON 的基本语法和在 Unity 中的较为基础的使用方法。**

## Json 配置规则

JSON 的结构非常简单，建立在两种结构之上：
1. 对象 (Object)：一个无序的 “键/值” (key/value) 对集合。
2. 数组 (Array)：一个有序的值列表。

对象用来组织多个“键/值”对。用花括号 `{}` 包裹。多个“键/值”对之间用逗号 `,` 分隔。

例如：
```json
{
  "name": "Zelda",
  "level": 95,
  "isPlayable": true,
  "hometown": "Hyrule Castle"
}
```

数组用来存放一个值的有序列表，用方括号 `[]` 包裹。多个值之间用逗号 `,` 分隔。

例如：
```json
[
  "Master Sword",
  "Hylian Shield",
  "Ocarina of Time",
  "Fairy Bottle"
]
```

JSON 支持的数据类型可以是以下几种类型：
1. 字符串 (String)：用双引号 `""` 包裹的文本，如 "Hello, World!"。
2. 数字 (Number)：整数或浮点数，如 `101` 或 `3.14`。
3. 布尔值 (Boolean)：`true` 或 `false` 。
4. 数组 (Array)：用 `[]` 包裹的有序列表。
5. 对象 (Object)：用 `{}` 包裹的“键/值”对集合。
6. `null`：表示空值。

| 符号   | 含义             |
|--------|------------------|
| `{}`   | 对象             |
| `[]`   | 数组             |
| `:`    | 键值对对应关系   |
| `,`    | 数据分割         |
| `""`   | 键名或字符串     |

JSON 的强大之处在于可以将对象和数组组合起来，形成复杂的数据结构。
例如：
```json
{
  "name": "Alice",
  "age": 20,
  "address": {
    "city": "Shanghai",
    "zip": "200000"
  },
  "friends": [
    { "name": "Bob", "age": 21 },
    { "name": "Carol", "age": 19 }
  ]
}
```

::: details 序列化示例
在 C# 和 Unity 中，将 JSON 文本转换成程序可以使用的对象的过程称为反序列化 (Deserialization)，反之则称为序列化 (Serialization)。

**输入**
```c#
class Test
{
    string name;
    int age;
    bool sex;
    List<int> ids;
    List<Person> students;
    Home home;
    Person son;
}

class Person
{
    string name;
    int age;
    bool sex;
}

class Home
{
    string address;
    string street;
}
```
**输出**

```json
// 一个 Json 对象
{
  "name": "Test",
  "age": 10,
  "sex": true,
  "testF": 1.5,
  "ids": [1, 2, 3, 4],
  "students": [
    { "name": "P1", "age": 10, "sex": false },
    { "name": "P2", "age": 10, "sex": true }
  ],
  "home": {
    "address": "abc",
    "street": "1233"
  },
  "son": null,
  // 键会变成双引号
  "dic": {
    "1": "123",
    "2": "234"
  }
}
```
:::

## Excel 转 Json

对于一次性、非敏感数据转换，可以使用在线工具或 Excel 插件将 Excel 表格转换为 Json 格式。

例如：[ConvertCSV](https://csvjson.com/csv2json)
::: danger
⚠️ 安全第一：绝对不要在任何在线工具上上传包含个人隐私、公司机密或任何敏感信息的文件。对于这类数据，请务必使用本地脚本（如 Python 或 C#）进行处理。
:::



## `JsonUtility`
`JsonUtility` 是 Unity 自带的用于解析 Json 的公共类，是解析 Json 工作中最基础、最简单的工具。


::: info
`JsonUtility` 并不使用我们通常所说的 C# 反射（`System.Reflection`）。它利用的是 Unity 引擎底层的、原生的 C++ 序列化机制。
:::

我们首先了解一下 C# 中的文件操作读写操作 ↓

通过向 `File.WriteAllText` 存储字符串到指定路径文件中：
``` c#  
File.WriteAllText(Application.persistentDataPath + "/Test.json", "存储的Json文件");
```

通过 `File.ReadAllText` 可在指定路径文件中读取字符串：
``` c#  
string str =  File.ReadAllText(Application.persistentDataPath + "/Test.json");
```


### 使用JsonUtlity进行序列化
序列化是将数据结构或对象转换成一种可存储或可传输格式的过程（此处为转换成Json格式）。在序列化后，数据可以被写入文件、发送到网络或存储在数据库中，以便在需要时可以再次还原成原始的数据结构或对象。

你必须在类的定义上方添加 `[System.Serializable]` 特性 (Attribute)，`JsonUtility` 才能序列化这个类。

这相当于告诉 Unity 这个类的实例是可以被序列化和反序列化的。

可以通过 `JsonUtility.ToJson()` 将对象转换为 Json 字符串。

我们先自定义一个类 `Person`，然后使用 `JsonUtility.ToJson()` 尝试将其实例化为 Json 字符串：
```c#  
[System.Serializable]
public class Person
{
    public string name;
    public int age;
    public bool sex;
    public int[] ids;
    public float testF;
    public double testD;
    public List<int> ids2;
    public Dictionary<int, string> dic;
    public Dictionary<string, string> dic2;
    public Student s1;
    public List<Student> s2s;

    // Unity序列化非公共成员需要加上特性 [SerializeField]
    [SerializeField]
    private int privateI = 1;
    [SerializeField]
    protected int protectedI = 2;
}

[System.Serializable]
public class Student
{
    public int age;
    public string name;

    public Student(int age, string name)
    {
        this.age = age;
        this.name = name;
    }
}
```
初始化成员变量：
``` c#
Person p = new Person();
p.name = "TestName";
p.age = 20;
p.sex = false;
p.testF = 3.14f;
p.testD = 2.17;
p.ids = new int[] {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
p.ids2 = new List<int>{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
p.dic = new Dictionary<int, string>{{1, "123"}, {2, "456"}, {3, "789"}};
p.dic2 = new Dictionary<string, string>{{"1", "123"}, {"2", "456"}};
p.s1 = null;
p.s2s = new List<Student>(){new Student(2, "TestStudentName2"),
                            new Student(3, "TestStudentName3")}
```
调用 `JsonUtility.ToJson()` 进行序列化：
```c#
// 将 Person 对象转换为 Json 字符串
string jsonStr =  JsonUtility.ToJson(p);
// 将 Json 字符串写入文件
File.WriteAllText(Application.streamingAssetsPath + "/Person.json", jsonStr);
```

写入后的结果：
```json
{
  "name": "TestName",
  "age": 20,
  "sex": false,
  "testF": 3.14,
  "testD": 2.17,
  "ids": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "ids2": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

  "s1": "",
  "s2s": [
    {
      "age": 2,
      "name": "TestStudentName2"
    },
    {
      "age": 3,
      "name": "TestStudentName3"
    }
  ]
}
```

注意到 `JsonUtility` 主要只有两个方法，使用十分简便，但它有一些限制：
- 无法储存字典;
- 必须标记 `[System.Serializable]`;
- 无法序列化非公有成员变量，除非使用 `[SerializeField]` 特性;
- 不支持直接序列化数组/列表的顶层结构：`JsonUtility` 期望 JSON 的根是一个对象 (`{}`)，而不是一个数组 (`[]`)。例如：
    ```c#
    // 错误的做法：
    // List<PlayerData> players = new List<PlayerData>();
    // string json = JsonUtility.ToJson(players); // 这不会按预期工作

    // 正确的做法：使用包装类
    [System.Serializable]
    public class PlayerListWrapper
    {
        public List<PlayerData> players;
    }
    ```

::: tip
`float` 序列化时看起来会有一些误差，但在使用 `JsonUtility` 进行反序列化时，这些误差会被自动处理。

此外，`JsonUtility` 存储 `null` 对象时不会储存 `null`，而是对应数据结构的默认值。
:::

### 使用JsonUtility进行反序列化
反序列化：反序列化是序列化的逆过程，它将序列化的数据格式还原成内存中的对象或数据结构。

`JsonUtility.FromJson()` 接受一个文件路径字符串，将 Json 字符串转换为指定类型的对象。例如：
```c#
// 先读取文件中的 Json 字符串
jsonStr =  File.ReadAllText(Application.streamingAssetsPath + "/Person.json");

// 使用Json字符串内容 转换成类对象
// 泛型方法（推荐）
Person p2 =  JsonUtility.FromJson<Person>(jsonStr);
// 非泛型方法
Person p3 =  JsonUtility.FromJson(jsonStr,typeof(Person)) as Person;
```

**`JsonUtility` 读取的 json 文件必须是 UTF-8 编码。强烈推荐并且在实践中应该始终使用 UTF-8 编码。**

根据 JSON 的官方标准 (RFC 8259)，JSON 文本的默认且首选编码就是 UTF-8。虽然标准也允许 UTF-16 和 UTF-32，但明确指出不推荐使用。

::: warning
`JsonUtility` 在序列化时会极力避免在 JSON 中使用 `null` 字面量。它倾向于将 C# 中的 `null` 引用替换为该类型在 JSON 中的“空”或“默认”表示形式。当你读写原先为 `null` 的字段时，这个原则导致了以下两种主要情况：

| 字段类型 | 原始 C# 值 | 序列化后的 JSON | 反序列化后的 C# 值 | 主要风险 |
| :--- | :--- | :--- | :--- | :--- |
| **`string`** | `null` | `""` (空字符串) | `""` (空字符串) | **语义丢失**：无法区分“未设置”(`null`)和“内容为空”(`""`)。依赖 `== null` 的逻辑判断会失效。 |
| **自定义 `class`** | `null` | `{}` (空对象) | `new CustomClass()` (一个所有字段都为默认值的新实例) | **逻辑绕过与延迟崩溃**：对对象本身的 `null` 检查会失效，但在访问其内部为`null`的成员时才会崩溃，使调试变得困难。 |

**`JsonUtility` 是处理简单内置数据的利器，但当需求变得复杂时（如需要存储属性和字典时），果断换用像 `Newtonsoft.Json` 这样的专业库是保证项目质量与开发效率的最佳实践。**
:::


## `Litjson`
`Litjson` 是第三方库，用于处理json的序列化和反序列化。

::: warning
今天不推荐在新项目中使用 `LitJson`，主要有以下三个核心原因：

1. 缺乏维护 👨‍🔧

这是最关键的一点。`LitJson` 项目基本已经停止更新，这意味着不会有 bug 修复、安全更新或新功能，使用它相当于将你的项目置于一个潜在的技术风险之上。

2. 存在更优选择 ✅

过去它流行的原因是 `Newtonsoft.Json` 在 Unity 中安装和使用比较麻烦。但现在，通过 Unity 包管理器可以一键安装 `Newtonsoft.Json`，它已成为功能更全、性能更优、社区支持更好的事实标准。

3. 功能差距 GAP

与现代标准库相比，`LitJson` 在很多重要功能上有所欠缺，比如完善的多态（继承）支持、详细的错误报告、高级的属性定制等，这些对于开发复杂的项目至关重要。
:::

在使用时，需要先获取 `LitJson`。

定义类 `Person2`，然后使用 `LitJson` 进行序列化和反序列化。
``` c#
public class Student2
{
    public int age;
    public string name;

    public Student2(int age, string name)
    {
        this.age = age;
        this.name = name;
    }

    public Student2()
    {
        
    }
}

public class Person2
{
    public string name;
    public int age;
    public bool sex;
    public int[] ids;
    public float testF;
    public double testD;
    
    public List<int> ids2;
   // public Dictionary<int, string> dic;
    public Dictionary<string, string> dic2;

    public Student s1;
    public List<Student2> s2s;
    
    
    private int privateI = 1;
    
    protected int protectedI = 2;
}
```

### 使用LitJson序列化

通过使用 `JsonMapper.ToJson()` 进行序列化 ↓

数据初始化：
```c#
Person2 p = new Person2();
p.name = "TestName";
p.age = 20;
p.sex = false;
p.testF = 3.14f;
p.testD = 2.17;
p.ids = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
p.ids2 = new List<int>{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
// p.dic = new Dictionary<int, string>{{1,"123"},{2,"456"},{3,"789"}};
p.dic2 = new Dictionary<string, string>{{"1","123"},{"2","456"}};
// new Student(1, "TestStudentName");
p.s1 = null; 
p.s2s = new List<Student2>(){new Student2(2, "TestStudentName2"), 
                            new Student2(3, "TestStudentName3")};

```

使用 `JsonMapper.ToJson()` 进行序列化：
```c#
string jsonStr =  JsonMapper.ToJson(p);
// json 文件保存的路径
print(Application.persistentDataPath);
File.WriteAllText(Application.persistentDataPath+"/Test2.json", jsonStr);
```
::: tip
- 相对 `JsonUtility` 不需要加特性;
- 不能序列化私有变量;
- 支持字典类型;
- 需要引用 `LitJson` 命名空间;
- 能够准确的保存 `null` 类型。
:::

### 使用LitJson反序列化

使用 `JsonMapper.ToObject()` 进行反序列化：

```c#
// 反序列化
jsonStr =  File.ReadAllText(Application.persistentDataPath+"/Test2.json");
JsonData data = JsonMapper.ToObject(jsonStr);
print(data["name"]);
print(data["age"]);

// 泛型方法
Person2 p2 =  JsonMapper.ToObject<Person2>(jsonStr);
```

::: tip
- 类结构需要无参构造函数 否则反序列化时会报错;
- 字典虽然支持 但只支持字符串;
- `LitJson` 可以直接读取数据集合;
- 文本编码格式需要使用 UTF-8。
:::