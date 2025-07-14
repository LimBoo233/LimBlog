# 数据持久化之-Json

JSON 的全称是 JavaScript Object Notation (JavaScript 对象表示法)。它使用一种人类易于阅读和编写，同时机器也易于解析和生成的格式，来组织和交换数据。

JSON 是现代应用开发中的主流和首选。它轻量、易读，并且与 Web 技术（尤其是 JavaScript）完美契合。

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



## Jsonutility
- JsonUtlity 是Unity自带的用于解析Json的公共类
1.  存储字符串到指定路径文件中
    - `File.WriteAllText`
        ``` c#  
        //参数1:填写的是存储的路径
        //参数2：存储的字符串内容
        File.WriteAllText(Application.persistentDataPath+"/Test.json","存储的Json文件");
        ```
2. 在指定路径文件中读取字符串
    - `File.ReadAllText`
        ``` c#  
        string str =  File.ReadAllText(Application.persistentDataPath+"/Test.json");
        ```

### 使用JsonUtlity进行序列化
- 序列化：是将数据结构或对象转换成一种可存储或可传输格式的过程。在序列化后，数据可以被写入文件、发送到网络或存储在数据库中，以便在需要时可以再次还原成原始的数据结构或对象。
- `JsonUtility.ToJson()`
- 数据类型定义
```c#  
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
- 方法:
    ``` c#
    Person p = new Person();
    p.name = "TestName";
    p.age = 20;
    p.sex = false;
    p.testF = 3.14f;
    p.testD = 2.17;
    p.ids = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
    p.ids2 = new List<int>{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
    p.dic = new Dictionary<int, string>{{1,"123"},{2,"456"},{3,"789"}};
    p.dic2 = new Dictionary<string, string>{{"1","123"},{"2","456"}};
    p.s1 = null; //new Student(1, "TestStudentName");
    p.s2s = new List<Student>(){new Student(2, "TestStudentName2"), 
                                new Student(3, "TestStudentName3")}
    //序列化
    string jsonStr =  JsonUtility.ToJson(p);
    File.WriteAllText(Application.persistentDataPath+"/Person.json", jsonStr);
    ```
::: tip 
float序列化时看起来会有一些误差

自定义类需要加上序列化特性[System.Serializable]

想要序列化私有变量需要加上特性[SerializeField]

JsonUtility不支持字典

JsonUtility存储null对象时不会使null 而是默认值的数据
:::
### 使用JsonUtility进行反序列化
- 反序列化：反序列化是序列化的逆过程，它将序列化的数据格式还原成内存中的对象或数据结构。
- `JsonUtility.FormJson(字符串)`
    ```c#
    //读取文件中的Json字符串
    jsonStr =  File.ReadAllText(Application.persistentDataPath+"/Person.json");
    //使用Json字符串内容 转换成类对象
    Person p2 =  JsonUtility.FromJson(jsonStr,typeof(Person)) as Person;
    Person p3 =  JsonUtility.FromJson<Person>(jsonStr);
    ```

::: tip
JsonUtlity无法直接读取Json类型文件

文本编码格式必须是UTF-8
:::

## Litjson
- Litjson 是第三方库，用于处理json的序列化和反序列化
- 因此在使用时 需要获取Litjson
- 数据结构定义
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
- 方法
- `JsonMapper.Tojson()`
```c#
Person2 p = new Person2();
p.name = "TestName";
p.age = 20;
p.sex = false;
p.testF = 3.14f;
p.testD = 2.17;
p.ids = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
p.ids2 = new List<int>{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
//p.dic = new Dictionary<int, string>{{1,"123"},{2,"456"},{3,"789"}};
p.dic2 = new Dictionary<string, string>{{"1","123"},{"2","456"}};
p.s1 = null; //new Student(1, "TestStudentName");
p.s2s = new List<Student2>(){new Student2(2, "TestStudentName2"), 
                            new Student2(3, "TestStudentName3")};
string jsonStr =  JsonMapper.ToJson(p);
print(Application.persistentDataPath);//json文件保存的路径
File.WriteAllText(Application.persistentDataPath+"/Test2.json", jsonStr);
```
::: tip
相对JsonUtlity不需要加特性

不能序列化私有变量

支持字典类型

需要引用LitJson命名空间

能够准确的保存null类型
:::
### 使用LitJson反序列化
- JsonMapper.Tobject()
```c#
//反序列化
jsonStr =  File.ReadAllText(Application.persistentDataPath+"/Test2.json");
JsonData data = JsonMapper.ToObject(jsonStr);
print(data["name"]);//索引器访问
print(data["age"]);
Person2 p2 =  JsonMapper.ToObject<Person2>(jsonStr);//通过泛型转换
```
::: tip
类结构需要无参构造函数 否则反序列化时会报错

字典虽然支持 但只支持字符串

LitJson可以直接读取数据集合

文本编码格式需要使用UTF-8
:::