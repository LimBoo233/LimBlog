---
title: Newtonsoft.Json 使用指南
description: 猴子也能看懂的 Newtonsoft.Json 使用指南，涵盖基本用法、序列化与反序列化、LINQ to JSON、JsonSerializerSettings 等等核心概念。
---


# `Newtonsoft.Json`

<update />

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

    当你的类有多个构造函数，或者你想使用一个需要传入参数的构造函数来创建对象时（这对于创建不可变对象或包含验证逻辑的对象很有用），可以使用这个特性。例如：
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



::: details 有关 LINQ 在 Unity 中的使用

在 Unity 开发中，很多人都认为 LINQ 是一个“性能杀手”。这是因为 LINQ 可能会产生大量临时对象，导致垃圾回收 (GC) 频繁触发，从而影响游戏性能。

但随着 C# 语言、.NET 运行时和 Unity 编译技术（特别是 IL2CPP）的不断进步，情况有所改变。编译器和运行时得到优化，许多曾经会产生GC的场景现在已经被优化掉了。例如，现代 C# 对 `List<T>` 等常用集合的 `foreach` 循环已经做了深度优化，不会再产生GC。许多简单的 Lambda 表达式也不会再产生不必要的分配。

因此，其实我认为还是可以尝试去在 Unity 中使用 LINQ 的。LINQ 是提升代码可读性和开发效率的强大工具，关键在于规避其在性能热点路径上的GC开销。

在编辑器脚本与工具，一次性初始化数据，非核心或低频的逻辑中，LINQ 的使用是完全可以接受的。但在需要频繁触发逻辑中与每帧执行的代码中，需要谨慎使用或不适用 LINQ；此外要小心使用 `ToList()`、`ToArray()` 等方法，它们会立即分配一块新内存来存储所有结果，是 LINQ 最主要的GC来源。

当你不确定一段 LINQ 代码是否有性能问题时，打开 Unity Profiler，运行代码并观察 GC.Alloc 列。Profiler 是你判断性能的唯一真理。

:::

LINQ to JSON 是一个非常强大的功能，允许开发者自由地查询、修改和创建 JSON，而不需要为每一个 JSON 结构都预先定义好一个 C# 类。

LINQ to JSON 有三个核心的“动态”类型，它们都位于 `Newtonsoft.Json.Linq` 命名空间下：
1. `JObject`: 代表一个 JSON 对象 (`{...}`)。你可以把它想象成一个 `Dictionary<string, JToken>`，用键来查找值。
2. `JArray`: 代表一个 JSON 数组 (`[...]`)。你可以把它想象成一个 `List<JToken>`，用索引来访问元素。
3. `JToken`: 是以上所有 JSON 元素的基类（包括 `JObject`、`JArray`，以及字符串、数字等）。

基本流程是，先将 JSON 字符串解析成这些 `JToken` 对象，然后用 LINQ 对它们进行操作。

假设我们有一个记录了游戏 Boss 信息的 JSON 文件，我们只想要查询其中的某些数据：
```json
{
  "dungeon": "Icecrown Citadel",
  "bosses": [
    {
      "name": "Lord Marrowgar",
      "level": 80,
      "hp": 1200000,
      "loot": ["Bone Spike", "Marrowgar's Scratching Post"]
    },
    {
      "name": "Lady Deathwhisper",
      "level": 80,
      "hp": 1500000,
      "loot": ["Whispering Tunic", "Deathwhisper's Gown"]
    },
    {
      "name": "The Lich King",
      "level": 83,
      "hp": 5000000,
      "loot": ["Invincible's Reins", "Shadowmourne Fragments"]
    }
  ]
}
```
我们读取这个文件，并将其解析为 `JObject`，然后使用 LINQ 查询我们感兴趣的数据：
```c#
string json = File.ReadAllText("bosses.json");

// 解析 JSON 字符串为 JObject
JObject data = JObject.Parse(json);

// 1. 查询所有 Boss 的名字
var bossNames = data["bosses"].Select(b => b["name"].ToString());

// 2. 直接访问数据
string dungeonName = (string)data["dungeon"];
Console.WriteLine($"Dungeon Name: {dungeonName}");

// 3. 获取 bosses 数组 (JArray)
JArray bosses = (JArray)data["bosses"];

// 4. 使用 LINQ 查询所有等级为 80 的 Boss 的名字
var level80BossNames = bosses
    .Where(b => (int)b["level"] == 80)
    .Select(b => (string)b["name"]);
    
Console.WriteLine("--- Level 80 Bosses ---");
foreach (var bossName in level80BossNames)
{
    Console.WriteLine(bossName);
}

// 5. 查询最终 Boss (The Lich King) 的掉落列表
var lichKingLoot = bosses
    .FirstOrDefault(b => (string)b["name"] == "The Lich King")? // 使用 ? 避免在找不到时出错
    ["loot"]?
    .Select(item => (string)item)
    .ToList();

if (lichKingLoot != null)
{
    Console.WriteLine("--- The Lich King's Loot ---");
    foreach (var item in lichKingLoot)
    {
        Console.WriteLine(item);
    }
}
```

**输出**
```powershell
Dungeon Name: Icecrown Citadel
--- Level 80 Bosses ---
Lord Marrowgar
Lady Deathwhisper
--- The Lich King's Loot ---
Invincible's Reins
Shadowmourne Fragments
```

此外，你也可以完全不依赖字符串，直接在代码中用 `JObject` 和 `JArray` 来构建 JSON 结构。
```c#
// 1. 创建一个根 JObject
JObject playerProfile = new JObject();

// 2. 像操作字典一样添加属性
playerProfile["name"] = "Noctis";
playerProfile["level"] = 99;
playerProfile["isKing"] = true;

// 3. 创建一个 JArray 并添加到 JObject 中
JArray skills = new JArray(
    "Warp-Strike",
    "Armiger",
    "Point-Blank Warp-Strike"
);
playerProfile["skills"] = skills;

// 4. 动态修改：添加一个新属性
playerProfile["hp"] = 4500;

// 5. 动态修改：从数组中移除一个技能
skills.RemoveAt(2);

// 6. 将构建好的 JObject 转换为格式化的 JSON 字符串
string finalJson = playerProfile.ToString(Newtonsoft.Json.Formatting.Indented);

Console.WriteLine("--- 动态创建的 JSON ---");
Console.WriteLine(finalJson);
```
**输出**
```powershell
--- 动态创建的 JSON ---
{
  "name": "Noctis",
  "level": 99,
  "isKing": true,
  "skills": [
    "Warp-Strike",
    "Armiger"
  ],
  "hp": 4500
}
```

## 处理继承与多态

`Newtonsoft.Json` 提供了一个功能，允许开发者在序列化和反序列化时保留对象的类型信息。这是通过在生成 JSON 时，额外写入一个元数据字段来实现的，用来记录对象的原始 C# 类型信息。这个额外的字段名叫 `$type`。

当反序列化时，`Newtonsoft.Json` 会首先检查 JSON 对象中是否存在 `$type` 字段。如果存在，它就会根据这个字段记录的类型信息来创建正确的子类实例，而不是基类实例。

对于简单的场景，可以通过 `TypeNameHandling` 属性来启用这个功能。`TypeNameHandling` 是一个枚举，有几个常用的值：
- `TypeNameHandling.None`: (默认值) 不写入任何类型信息。这就是为什么默认情况下多态会失败。
- `TypeNameHandling.Objects`: (最常用的选项) 为 JSON 对象 (`{...}`) 写入 `$type` 字段。对于简单的值（如字符串、数字）则不写。这是一个很好的平衡。
- `TypeNameHandling.Auto`: 更加智能。只有当对象的实际类型与其声明的类型不一致时，才会写入 `$type`。例如，一个 `GameItem` 类型的变量，如果它实际装着一个 `Weapon` 对象，`$type` 就会被写入。这也是一个非常好的选择。
- `TypeNameHandling.All`: 为所有对象和值写入 `$type`。通常过于冗长，很少使用。

使用示例：
```c#
// --- 数据类的定义 ---
public abstract class GameItem
{
    public string Name { get; set; }
}

public class Weapon : GameItem
{
    public int Damage { get; set; }
}

public class Armor : GameItem
{
    public int Defense { get; set; }
}

// --- 主程序 ---
public class Program
{
    public static void Main()
    {
        // 1. 创建一个包含不同子类实例的列表
        List<GameItem> inventory = new List<GameItem>
        {
            new Weapon { Name = "Buster Sword", Damage = 100 },
            new Armor { Name = "Iron Armor", Defense = 50 },
            new Weapon { Name = "Masamune", Damage = 120 }
        };

        // 2. 创建 JsonSerializerSettings 并设置 TypeNameHandling
        JsonSerializerSettings settings = new JsonSerializerSettings
        {
            // 开启多态处理
            TypeNameHandling = TypeNameHandling.Objects, 
            
            // 格式化输出
            Formatting = Formatting.Indented
        };

        // --- 序列化 ---
        string json = JsonConvert.SerializeObject(inventory, settings);

        Console.WriteLine("--- 序列化后的JSON (注意 $type 字段) ---");
        Console.WriteLine(json);

        // --- 反序列化 ---
        List<GameItem> loadedInventory = JsonConvert.DeserializeObject<List<GameItem>>(json, settings);

        Console.WriteLine("--- 反序列化后的对象类型验证 ---");
        foreach (var item in loadedInventory)
        {
            // 检查每个对象的具体类型
            if (item is Weapon weapon)
            {
                Console.WriteLine($"加载到武器: {weapon.Name}, 伤害: {weapon.Damage}");
            }
            else if (item is Armor armor)
            {
                Console.WriteLine($"加载到护甲: {armor.Name}, 防御: {armor.Defense}");
            }
        }
    }
}
```
**输出**
```powershell
--- 序列化后的JSON (注意 $type 字段) ---
[
  {
    "$type": "Weapon",
    "Damage": 100,
    "Name": "Buster Sword"
  },
  {
    "$type": "Armor",
    "Defense": 50,
    "Name": "Iron Armor"
  },
  {
    "$type": "Weapon",
    "Damage": 120,
    "Name": "Masamune"
  }
]
```

::: warning
`TypeNameHandling` 虽然强大，但也带来了两个需要警惕的问题：

1. 安全风险: 如果你反序列化的是来自不受信任来源（比如网络、其他用户）的 JSON，这是一个潜在的安全漏洞。恶意的 JSON 可以将 `$type` 设置成你程序中的任何可实例化的类型，可能导致非预期的对象被创建，甚至执行恶意代码。因此，对于外部数据，请谨慎使用此功能。

2. 版本脆弱性: `$type` 中记录的是完整的类名（包括命名空间）。如果你未来重构代码，修改了类名或命名空间，那么旧的存档文件就会因为找不到对应的类型而反序列化失败。

对于需要长期维护和版本迭代的健壮系统，有更安全的替代方案（如自定义 `SerializationBinder`），但对于绝大多数游戏存档这样的内部使用场景，`TypeNameHandling` 是一个足够好且方便快捷的解决方案。
:::

`TypeNameHandling` 将数据和代码结构（类名、命名空间、程序集名）紧紧地绑定在了一起。这会让你的系统变得非常“脆弱”，任何代码重构都可能导致旧数据的失效。

于是，`Newtonsoft.Json` 提供了一个更安全、更健壮的专业级解决方案：自定义 `SerializationBinder`。该类就像一个翻译官。它允许你完全自定义类型和字符串名称之间的映射关系，从而将存档数据和代码结构解耦。

工作流程：
- 序列化时 (对象 → JSON):
  1. `Newtonsoft.Json` 发现需要写入类型信息
  2. 调用你的 `SerializationBinder.BindToName()` 方法
  3. 你的方法返回一个自定义的字符串名称（而不是完整的类名）
  4. 这个自定义名称被写入到 JSON 的 `$type` 字段中

- 反序列化时 (JSON → 对象):
  1. `Newtonsoft.Json` 从 JSON 中读取到 `$type` 字段的值
  2. 调用你的 `SerializationBinder.BindToType()` 方法，传入这个字符串名称
  3. 你的方法根据字符串名称，返回对应的 `Type` 对象
  4. `Newtonsoft.Json` 使用这个 `Type` 创建正确的对象实例

通过这种方式，你可以使用简短、稳定的标识符（如 "weapon", "armor"）来代替完整的类名，从而实现数据与代码结构的解耦。


代码示例：

::: code-group

```c# [GameItemBinder.cs]
// --- 1. 自定义 SerializationBinder ---
public class GameItemBinder : SerializationBinder
{
    // 序列化时：将 Type 转换为字符串名称
    public override void BindToName(Type serializedType, out string assemblyName, out string typeName)
    {
        assemblyName = null; // 我们不需要程序集名称
        
        // 将具体的类型映射到简短的标识符
        if (serializedType == typeof(Weapon))
            typeName = "weapon";
        else if (serializedType == typeof(Armor))
            typeName = "armor";
        else if (serializedType == typeof(Consumable))
            typeName = "consumable";
        else
            typeName = serializedType.Name; // 对于未知类型，使用默认名称
    }
    
    // 反序列化时：将字符串名称转换回 Type
    public override Type BindToType(string assemblyName, string typeName)
    {
        // 将简短标识符映射回具体的类型
        switch (typeName)
        {
            case "weapon":
                return typeof(Weapon);
            case "armor":
                return typeof(Armor);
            case "consumable":
                return typeof(Consumable);
            default:
                return null; // 未知类型
        }
    }
}
```

```c# [GameItem.cs]
// --- 2. 数据类定义 ---
public abstract class GameItem
{
    public string Name { get; set; }
    public int Value { get; set; }
}

public class Weapon : GameItem
{
    public int Damage { get; set; }
}

public class Armor : GameItem
{
    public int Defense { get; set; }
}

public class Consumable : GameItem
{
    public string Effect { get; set; }
}
```

```c# [SerializationBinderExample.cs]
// --- 3. 使用示例 ---
public class SerializationBinderExample
{
    public static void Main()
    {
        // 创建测试数据
        List<GameItem> inventory = new List<GameItem>
        {
            new Weapon { Name = "Excalibur", Value = 1000, Damage = 150 },
            new Armor { Name = "Dragon Scale Mail", Value = 800, Defense = 100 },
            new Consumable { Name = "Health Potion", Value = 50, Effect = "Restore 100 HP" }
        };

        // 配置序列化设置
        JsonSerializerSettings settings = new JsonSerializerSettings
        {
            TypeNameHandling = TypeNameHandling.Objects,
            SerializationBinder = new GameItemBinder(), // 使用自定义绑定器
            Formatting = Formatting.Indented
        };

        // --- 序列化 ---
        string json = JsonConvert.SerializeObject(inventory, settings);
        Console.WriteLine("--- 使用自定义绑定器的序列化结果 ---");
        Console.WriteLine(json);

        // --- 反序列化 ---
        List<GameItem> loadedInventory = JsonConvert.DeserializeObject<List<GameItem>>(json, settings);
        
        Console.WriteLine("\n--- 反序列化验证 ---");
        foreach (var item in loadedInventory)
        {
            Console.WriteLine($"类型: {item.GetType().Name}, 名称: {item.Name}");
        }
    }
}
```

:::

**输出**
```powershell
--- 使用自定义绑定器的序列化结果 ---
[
  {
    "$type": "weapon",
    "Damage": 150,
    "Name": "Excalibur",
    "Value": 1000
  },
  {
    "$type": "armor",
    "Defense": 100,
    "Name": "Dragon Scale Mail",
    "Value": 800
  },
  {
    "$type": "consumable",
    "Effect": "Restore 100 HP",
    "Name": "Health Potion",
    "Value": 50
  }
]

--- 反序列化验证 ---
类型: Weapon, 名称: Excalibur
类型: Armor, 名称: Dragon Scale Mail
类型: Consumable, 名称: Health Potion
```

::: tip 优势对比
**使用默认 TypeNameHandling 的输出**：
```json
"$type": "MyGame.Items.Weapon, MyGame.Core, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"
```

**使用自定义 SerializationBinder 的输出**：
```json
"$type": "weapon"
```

通过自定义绑定器，我们获得了：
- ✅ **更简洁的 JSON**：标识符更短，文件更小
- ✅ **版本稳定性**：重构代码不会影响现有存档
- ✅ **跨平台兼容**：不依赖具体的程序集信息
- ✅ **更好的可读性**：JSON 文件更容易人工阅读和调试
:::

这种方法特别适合游戏存档、配置文件等需要长期维护的数据格式。



## 编写自定义转换器 `JsonConverter`
**Coming soon...**