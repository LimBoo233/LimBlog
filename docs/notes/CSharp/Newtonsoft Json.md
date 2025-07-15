# `Newtonsoft.Json`

`Newtonsoft.Json` 是目前 Unity 社区乃至整个 .NET 世界中，使用最广泛、功能最强大的 JSON 库，是绝大多数情况下的首选推荐。

官方文档：[Json.NET](https://www.newtonsoft.com/json)

## 安装

在 Visual Studio 和 Rider 中，直接通过 NuGet 包管理器搜索 `Newtonsoft.Json` 并安装即可。

在 Unity 中，直接通过 Unity Package Manager 在 Unity Registry 搜索 `Newtonsoft Json` 并安装即可。

## 简单的序列化与反序列化

对于简单的场景，如果你想要在 JSON 字符串之间进行转换，`JsonConvert` 上的 `SerializeObject()` 和 `DeserializeObject()` 方法提供了一个易于使用的 `JsonSerializer` 封装。

例如，可以通过如下方法使用 `JsonConvert` 进行 JSON 序列化和反序列化：
```c#
// 初始化数据
Product product = new Product();
product.Name = "Apple";
product.ExpiryDate = new DateTime(2008, 12, 28);
product.Price = 3.99M;
product.Sizes = new string[] { "Small", "Medium", "Large" };

// 序列化
string output = JsonConvert.SerializeObject(product);

// 反序列化
Product deserializedProduct = JsonConvert.DeserializeObject<Product>(output);
```

JSON 序列化后的字符串：
```json
{"Name":"Apple","ExpiryDate":"2008-12-28T00:00:00","Price":3.99,"Sizes":["Small","Medium","Large"]}
```

`SerializeObject` 和 `DeserializeObject` 方法都提供了接受 `JsonSerializerSettings` 参数的重载。通过 `JsonSerializerSettings` 对象，您可以在使用简单序列化方法的同时，灵活配置下文列出的多种 `JsonSerializer` 序列化设置。

## 使用 `JsonSerializer`

若想更精细地控制对象的序列化过程，可以直接使用 `JsonSerializer`。`JsonSerializer` 能够通过 `JsonTextReader` 和 `JsonTextWriter`，将 JSON 文本直接读取或写入到一个流 (stream) 中。

同样，也可以使用其他类型的 `JsonWriter`，例如 `JTokenReader` / `JTokenWriter`，用于将你的对象与“LINQ to JSON”对象进行相互转换；或者使用 `BsonReader` / `BsonWriter`，用于与 BSON (二进制 JSON) 格式进行相互转换。

::: details LINQ to JSON
"LINQ to JSON" 就是把 LINQ 的这种强大查询能力，应用到 JSON 数据上。

`Newtonsoft.Json` 库可以将一段 JSON 文本解析成一种灵活的内存对象（`JObject`、`JArray`），然后你就可以用 LINQ 对这些 JSON 对象进行随心所欲的查询、筛选、排序和转换，而不需要提前为它创建固定的 C# 类。
:::

代码示例：
```c#
// 1. 准备一个简单的数据类
public class PlayerProfile
{
    public string Name { get; set; }
    public int Level { get; set; }
    
    // 我们将让这个属性保持为 null
    public string Guild { get; set; } 
}

public class SimpleSerializerExample : MonoBehaviour
{
    void Start()
    {
        // 2. 创建并填充数据对象
        PlayerProfile profile = new PlayerProfile
        {
            Name = "Kirito",
            Level = 96,
            // 显式设为 null，代表“无公会”
            Guild = null 
        };

        // 3. 创建并配置 JsonSerializer
        JsonSerializer serializer = new JsonSerializer();
        
        // 我们只加一条规则：如果属性的值是 null，就不要把它写到 JSON 里
        serializer.NullValueHandling = NullValueHandling.Ignore;
        // 格式化输出，让输出结果好看一点
        serializer.Formatting = Formatting.Indented; 

        // 4. 将对象序列化并写入文件
        string filePath = Path.Combine(Application.persistentDataPath, "player_profile.json");
        
        using (StreamWriter sw = new StreamWriter(filePath))
        using (JsonWriter writer = new JsonTextWriter(sw))
        {
            serializer.Serialize(writer, profile);
        }
        
        Debug.Log("文件已保存到: " + filePath);
        Debug.Log("文件内容:\n" + File.ReadAllText(filePath));
    }
}
```

::: tip
写入文本时即使用 `StreamWriter` 。通过 `JsonTextWriter` 输出人类可读的纯文本 JSON，99% 的情况下，当你需要生成 .json 文本文件时，用的就是它。
:::

## JsonSerializerSettings 

`JsonSerializerSettings` 对象类似于一个“配置方案”或“设置面板”。

通过 `JsonSerializerSettings` 对象，你可以不用每次序列化时都去手动调整 `JsonSerializer` 的各种参数，而是可以预先创建并配置好一个 `JsonSerializerSettings` 对象，把它当成一个“模板”。然后，在任何需要序列化或反序列化的地方，直接把这个“模板”交给 `JsonConvert` 使用。

`JsonSerializerSettings` 包含了几十个属性，以下这些是最常用也最重要的：
- `Formatting`: 控制输出的 JSON 是否需要格式化（换行和缩进）。
- `NullValueHandling`: 控制如何处理值为 `null` 的成员（是忽略还是写入 `null`）。
- `DefaultValueHandling`: 控制如何处理值为默认值的成员（例如 `int` 的 `0`，`bool` 的 `false`）。这在你想节省空间，不写入默认值时很有用。
- `ReferenceLoopHandling`: 控制如何处理循环引用。例如 A 对象引用 B，B 对象又引用 A，如果不处理，序列化时会陷入死循环。这个设置可以帮你自动断开循环。
- `TypeNameHandling`: 在序列化时是否写入对象的类型名称。这是实现多态（继承）序列化的关键。
- `Converters`: 一个转换器列表，可以让你添加自定义的 `JsonConverter` 来处理特殊类型的序列化。
- `ContractResolver`: 一个更高级的设置，允许你通过编程的方式动态地、有条件地决定哪些属性应该被序列化，以及它们的名字应该是什么。

创建一个 `JsonSerializerSettings` 对象的示例：
```c#
JsonSerializerSettings settings = new JsonSerializerSettings
{
    // 我们希望输出格式化的 JSON
    Formatting = Formatting.Indented,
    
    // 我们不希望 JSON 中出现值为 null 的字段
    NullValueHandling = NullValueHandling.Ignore,
    
    // 如果一个对象引用了自己，序列化时忽略这个循环，不要报错
    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
};
```

::: details 完整使用示例演示
**输入**
```c#
using UnityEngine;
using Newtonsoft.Json;

// 1. 准备一个用于测试的类
public class GameSession
{
    public string SessionID { get; set; }
    public string PlayerName { get; set; }
    public int Score { get; set; } // int 的默认值是 0
    public string LastLoginIP { get; set; } // string 的默认值是 null
}

public class UsingSettingsExample : MonoBehaviour
{
    void Start()
    {
        // 2. 创建并配置 settings 对象
        JsonSerializerSettings settings = new JsonSerializerSettings
        {
            Formatting = Formatting.Indented,
            
            // 忽略值为 null 的属性 (例如 LastLoginIP)
            NullValueHandling = NullValueHandling.Ignore,
            
            // 同样忽略值为默认值的属性 (例如 Score 为 0)
            DefaultValueHandling = DefaultValueHandling.Ignore 
        };

        // 3. 准备数据对象
        GameSession session = new GameSession
        {
            SessionID = "sess_1a2b3c",
            PlayerName = "Yuna"
            // Score 和 LastLoginIP 保持默认值
        };

        // 4. 在序列化时传入 settings 对象
        string json = JsonConvert.SerializeObject(session, settings);

        Debug.Log("--- 应用 settings 后的序列化结果 ---");
        Debug.Log(json);
        
        // 5. 在反序列化时也可以传入同一个 settings 对象 (虽然在这个例子中不影响结果)
        GameSession loadedSession = JsonConvert.DeserializeObject<GameSession>(json, settings);
        Debug.Log($"加载后的 Session ID: {loadedSession.SessionID}");
    }
}
```
**输出**
```json
--- 应用 settings 后的序列化结果 ---
{
  "SessionID": "sess_1a2b3c",
  "PlayerName": "Yuna"
}
```
:::

更多属性可以查阅官方文档：[JsonSerializerSettings Class](https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_JsonSerializerSettings.htm)

## 集合与字典的处理
> 这部分并没有什么新的特殊方法，只是展示 `Newtonsoft.Json` 相比其它一些 JSON 库的一个优势。 

`Newtonsoft.Json` 可以非常自然、直观地处理 C# 中几乎所有的集合类型，其中最常用的就是 `List<T>` (列表) 和 `Dictionary<TKey, TValue>` (字典)。

`JsonConvert` 会自动将一个 C# 的 `List<T>` 对象序列化成一个 JSON 数组 (`[]`)，反之亦然。例如:
```c#
// 初始化数据：准备一个 Quest 列表
List<Quest> questLog = new List<Quest>
{
    new Quest { Title = "击败史莱姆", IsCompleted = true },
    new Quest { Title = "寻找大师之剑", IsCompleted = false },
    new Quest { Title = "收集七颗龙珠", IsCompleted = false }
};

// --- 序列化 List<Quest> ---
string json = JsonConvert.SerializeObject(questLog, Formatting.Indented);
Console.WriteLine("--- 任务列表序列化结果 ---");
Console.WriteLine(json);

// --- 反序列化回 List<Quest> ---
List<Quest> loadedQuests = JsonConvert.DeserializeObject<List<Quest>>(json);
Console.WriteLine($"加载的第一个任务: {loadedQuests[0].Title}");


public class Quest
{
    public string Title { get; set; }
    public bool IsCompleted { get; set; }
}
```
**输出**
```powershell
--- 任务列表序列化结果 ---
[
  {
    "Title": "击败史莱姆",
    "IsCompleted": true
  },
  {
    "Title": "寻找大师之剑",
    "IsCompleted": false
  },
  {
    "Title": "收集七颗龙珠",
    "IsCompleted": false
  }
]
加载的第一个任务: 击败史莱姆
```

`Dictionary<TKey, TValue>` 的处理也非常简单，序列化时会转换为一个 JSON 对象 (`{}`)，反之亦然。例如:
```c#
// 准备一个字典来表示库存
Dictionary<string, int> inventory = new Dictionary<string, int>
{
    { "potion_hp_small", 15 },
    { "key_dungeon_01", 1 },
    { "gold_coin", 999 }
};

// --- 序列化 Dictionary ---
string json = JsonConvert.SerializeObject(inventory, Formatting.Indented);
Console.WriteLine("--- 库存字典序列化结果 ---");
Console.WriteLine(json);

// --- 反序列化回 Dictionary ---
Dictionary<string, int> loadedInventory = JsonConvert.DeserializeObject<Dictionary<string, int>>(json);
Console.WriteLine($"加载后的金币数量: {loadedInventory["gold_coin"]}");
```
**输出**
```powershell
--- 库存字典序列化结果 ---
{
  "potion_hp_small": 15,
  "key_dungeon_01": 1,
  "gold_coin": 999
}
加载后的金币数量: 999
```

## 常用特性（Attributes）
特性 (Attribute) 在 C# 中，就像是贴在代码元素（比如类、属性、字段）上的“标签”或“便签”。这些标签本身不执行代码，但可以给其他程序（比如 `Newtonsoft.Json` 的序列化器）提供额外的信息和指令。

通过使用特性，你可以直接在数据类的定义中，精细地控制每个成员的序列化行为，让代码意图更清晰。

此处介绍三个最常用、也最重要的特性。

1. `[JsonProperty]`：指定 JSON 中的名字

    这个特性让你可以为 C# 的属性或字段指定一个在 JSON 中完全不同的名字。

    这是解决命名规范不一致问题的利器。比如，C# 推荐使用帕斯卡命名法（`PlayerName`），而很多 Web API 返回的 JSON 使用蛇形命名法（`player_name`）或驼峰命名法（`playerName`）。

    代码示例：
    ```c#
    public class PlayerDataFromServer
    {
        // C# 属性名
        public int UserId { get; set; }

        // 使用 [JsonProperty] 将 C# 的 PlayerName 属性
        // 映射到 JSON 中的 "player_name" 键
        [JsonProperty("player_name")]
        public string PlayerName { get; set; }
    }

    public class JsonPropertyExample
    {
        public static void Main()
        {
            // --- 序列化 ---
            PlayerDataFromServer player = new PlayerDataFromServer 
            { 
                UserId = 101, 
                PlayerName = "Tidus" 
            };
            string json = JsonConvert.SerializeObject(player, Formatting.Indented);
            Console.WriteLine("--- 序列化结果 ---");
            // 输出的 JSON 中会是 "player_name"
            Console.WriteLine(json); 

            // --- 反序列化 ---
            string jsonFromServer = @"{ ""UserId"": 102, ""player_name"": ""Yuna"" }";
            PlayerDataFromServer loadedPlayer = JsonConvert.DeserializeObject<PlayerDataFromServer>(jsonFromServer);
            // 输出 Yuna
            Console.WriteLine($"从服务器加载的玩家: {loadedPlayer.PlayerName}"); 
        }
    }
    ```
    **输出**
    ```powershell
    --- 序列化结果 ---
    {
      "UserId": 101,
      "player_name": "Tidus"
    }
    从服务器加载的玩家: Yuna
    ```
2. `[JsonIgnore]`：忽略某个成员

    作用：彻底阻止某个公共属性或字段被序列化和反序列化。

    可以使用在当有些数据只在程序运行时有意义，但不应该被保存到文件中时。比如：临时的状态、计算得出的属性、或者敏感信息。

    ```c#
    public class CharacterState
    {
        public float Health { get; set; }
        public float Mana { get; set; }

        // IsDead 是一个根据 Health 计算得出的属性，
        // 它不需要被保存，每次加载时重新计算即可。
        [JsonIgnore]
        public bool IsDead => Health <= 0;

        // IsStunned 是一个临时的战斗状态，不应该被带入存档。
        [JsonIgnore]
        public bool IsStunned { get; set; }
    }

    public class JsonIgnoreExample 
    {
        public static void Main()
        {
            CharacterState character = new CharacterState 
            { 
                Health = 500, 
                Mana = 200, 
                IsStunned = true 
            };
            string json = JsonConvert.SerializeObject(character, Formatting.Indented);
            Console.WriteLine(json);
        }
    }
    ```
    **输出**
    ```powershell
    {
      "Health": 500,
      "Mana": 200
    }
    ```
3. `[JsonConstructor]`：指定使用的构造函数

    作用：在反序列化时，明确告诉 `Newtonsoft.Json` 应该调用哪一个构造函数来创建对象实例。

    当你的类有多个构造函数，或者你想使用一个需要传入参数的构造函数来创建对象时（这对于创建不可变对象或包含验证逻辑的对象很有用），可以使用这个特性。
    ```c#
    // 一个表示二维坐标的类，它的属性是只读的
    public class Point
    {
        // 只能在构造函数中赋值
        public float X { get; } 
        public float Y { get; }

        // 标记这个构造函数为反序列化时使用
        [JsonConstructor]
        public Point(float x, float y)
        {
            X = x;
            Y = y;
            Console.WriteLine("Point 的构造函数被调用了！");
        }
    }

    public class JsonConstructorExample
    {
        public static void Main()
        {
            string json = @"{ ""X"": 10, ""Y"": 20 }";

            // 当下面这行代码执行时，Newtonsoft.Json 会找到带 [JsonConstructor] 的构造函数，
            // 并将 JSON 中的 X 和 Y 的值作为参数传入。
            Point p = JsonConvert.DeserializeObject<Point>(json);

            Console.WriteLine($"加载的点: ({p.X}, {p.Y})");
        }
    }
    ```
    **输出**
    ```powershell
    Point 的构造函数被调用了！
    加载的点: (10, 20)
    ```

    ::: warning
    `Newtonsoft.Json` 在选择使用哪个构造函数时，遵循一个清晰的优先级顺序：

    | 类中存在的情况 | `Newtonsoft.Json` 使用的构造函数 | 反序列化结果 |
    | :--- | :--- | :--- |
    | 存在 `[JsonConstructor]` | ✅ 带 `[JsonConstructor]` 的构造函数 | **成功** |
    | 无 `[JsonConstructor]`, 有 `public` 无参构造 | ✅ `public` 无参构造函数 | **成功** |
    | 无 `[JsonConstructor]`, 无 `public` 无参, 但有 `private` 无参 | ✅ `private` 无参构造函数 | **成功** |
    | 只有带参数的构造函数, 且无 `[JsonConstructor]` | ❌ 找不到可用的构造函数 | **失败 (抛出异常)** |

    对于纯数据类，保留默认的空构造函数最方便通用；而对于需要保证数据始终有效的复杂或不可变对象，则应使用 `[JsonConstructor]` 来明确指定其创建方式。
    :::

更多特性可以查阅官方文档：[Serialization Attributes](https://www.newtonsoft.com/json/help/html/SerializationAttributes.htm)

## LINQ to JSON
**Coming soon...**

## 处理继承与多态
**Coming soon...**

## 编写自定义转换器 `JsonConverter`
**Coming soon...**