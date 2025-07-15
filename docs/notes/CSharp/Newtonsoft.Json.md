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


## 常用特性（Attributes）
**Coming soon...**

## 集合与字典的处理
**Coming soon...**

## LINQ to JSON
**Coming soon...**

## 处理继承与多态
**Coming soon...**

## 编写自定义转换器 `JsonConverter`
**Coming soon...**