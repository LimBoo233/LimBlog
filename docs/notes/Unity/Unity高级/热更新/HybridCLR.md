# HybridCLR

HybridCLR 是成熟、高性能的热更新方案，开发者可以直接用热更 C# 代码，对语言特性几乎无限制，且不依赖虚拟机，更无需写繁琐的桥接代码。

项目需要由 IL2CPP 构建，最后的热更代码是 IL，由嵌入 IL2CPP 的 HybridCLR 解释执行。

> HybridCLR 以前叫华佗（Huatuo）

本篇大部分内容是直接引用自官方文档的。

## 安装与配置

### 安装

git URL: `https://gitee.com/focus-creative-games/hybridclr_unity.git` / `https://github.com/focus-creative-games/hybridclr_unity.git`

为了减少 package 自身大小，有一些文件需要从 Unity Editor 的安装目录复制。因此安装完插件后，还需要一个额外的初始化过程。点击菜单 `HybridCLR/Installer...`，弹出安装界面。

`com.code-philosophy.hybridclr` 中 `Data~/hybridclr_version.json` 中已经配置了当前 package 版本对应的兼容 hybridclr 及 il2cpp_plus 的分支或者 tag， Installer 会安装配置中指定的版本，不再支持自定义待安装的版本。

::: details 可能的配置示例
```json
{
    "versions": [
    {
        "unity_version":"2019",
        "hybridclr" : { "branch":"v2.0.1"},
        "il2cpp_plus": { "branch":"v2019-2.0.1"}
    },
    {
        "unity_version":"2020",
        "hybridclr" : { "branch":"v2.0.1"},
        "il2cpp_plus": { "branch":"v2020-2.0.1"}
    },
    {
        "unity_version":"2021",
        "hybridclr" : { "branch":"v2.0.1"},
        "il2cpp_plus": { "branch":"v2021-2.0.1"}
    }
    ]
}
```
:::

更详细或其他需求继续参考官方文档：[安装 | HybridCLR](https://www.hybridclr.cn/docs/basic/install)

> [!NOTE]
> `il2cpp_plus` 

### 配置

配置 PlayerSettings：`Scripting Backend` 切换为 `il2cpp`, WebGL 平台不用设置此选项。**自`v2.4.0`起，会自动设置此选项，可以不用手动执行此操作**。

配置热更新程序集：

对于需要热更新的代码应该拆分为独立的程序集，才能方便地热更新。Assembly-CSharp 是Unity的默认全局程序集，未被特意划分的程序都会自动被分配到该程序集。

项目代码必须合理拆分为 AOT（即编译到游戏主包内）程序集 和热更新程序集，才能进行热更新。HybridCLR 对于 怎么拆分程序集并无任何限制，甚至可以把第三方工程中的代码作为热更新程序集。一般来说，游戏刚启动时，至少需要一个 AOT 程序集来负责启动及热更新相关工作。

常见的拆分方式有几种：

- Assembly-CSharp 作为 AO T程序集。剩余代码拆分为 N 个 AOT 程序集和 M 个热更程序集。
- Assembly-CSharp 作为热更程序集。剩余代码拆分为 N 个 AOT 程序集和 M 个热更程序集。

> [!NOTE]
>无论哪种拆分方式，正确设置好程序集之间的引用关系即可。**如果你们项目把 Assembly-CSharp 作为 AOT 程序集，强烈建议关闭热更新程序集的 `auto reference` 选项**。因为 Assembly-CSharp 是最顶层 assembly，它会自动引用剩余所有 assembly，很容易就出现失误引用热更新程序集的情况。

点击菜单 `HybridCLR/Settings` 打开配置界面。

- 如果是 Assembly Definition(asmdef) 方式定义的程序集，加入`hotUpdateAssemblyDefinitions`
- 如果是普通 dll 或者 Assembly-CSharp.dll，则将程序集名字（不包含 '.dll' 后缀，如 Main、Assembly-CSharp）加入 `hotUpdateAssemblies`

`hotUpdateAssemblyDefinitions` 和 `hotUpdateAssemblies` 列表是等价的，不要重复添加，否则会报错。

官方文档：[配置 | HybridCLR](https://www.hybridclr.cn/docs/basic/projectsettings)

## 加载和运行

### 加载

根据你们项目资源管理的方式（ex: Addressables），获得热更新 dll 的 bytes 数据，然后再直接调用 `Assembly.Load(byte[] assemblyData)` 即可。

EX:

```cs
// 从你的资源管理系统中获得热更新 dll 的数据
byte[] assemblyData = xxxx; 

// Assembly.Load 内部会自动复制 assemblyData
// 调用完此函数可以释放 assemblyData，不需要保存起来。
Assembly ass = Assembly.Load(assemblyData);

// 同时加载 dll 和 pdb 文件
byte[] assData2 = yyy;
byte[] pdbData2 = zzz;
Assembly ass2 = Assembly.Load(assData2, pdbData2);
```

多个 dll 要**按照依赖顺序加载**。加载完热更新 dll 后，有多种方式运行热更新代码，这些技巧跟不考虑热更新时完全相同。

> [!TIP]
> 如果Assembly.Load花费太多时间，造成卡顿，你可以在其他线程异步加载

### 运行

假设热更新集中有HotUpdateEntry类，主入口是静态的Main函数，代码类似：

```cs
class HotUpdateEntry
{
    public static void Main() => UnityEngine.Debug.Log("hello, HybridCLR");
}
```

**通过反射直接运行热更新函数**

```cs
// ass 为 Assembly.Load 返回的热更新assembly
// 你也可以在 Assembly.Load 后通过类似如下代码查找获得。
// Assembly ass = AppDomain.CurrentDomain.GetAssemblies().First(assembly => assembly.GetName().Name == "Your-HotUpdate-Assembly");
Type entryType = ass.GetType("HotUpdateEntry");
MethodInfo method = entryType.GetMethod("Main");

method.Invoke(null, null);
```

**通过反射创造出 Delegate 后运行**

```cs
Type entryType = ass.GetType("HotUpdateEntry");
MethodInfo method = entryType.GetMethod("Main");

Action mainFunc = (Action)Delegate.CreateDelegate(typeof(Action), method);
mainFunc();
```

---

**通过反射创建出对象后，再调用接口函数**

假设 AOT 中有这样的接口：

```cs
public interface IEntry
{
    void Start();
}
```

热更新中实现了这样的类：

```cs
class HotUpdateEntry : IEntry
{
    public void Start() => UnityEngine.Debug.Log("hello, HybridCLR");
}
```

运行：

```cs
Type entryType = ass.GetType("HotUpdateEntry");

IEntry entry = (IEntry)Activator.CreateInstance(entryType);
entry.Start();
```

---

**通过动态 `AddComponeny` 运行脚本代码**

假设热更新中有这样的代码：

```cs
class Rotate : MonoBehaviour
{
    void Update()
    {
		// ..
    }
}
```

AOT 中运行：

```cs
Type type = ass.GetType("Rotate");
GameObject go = new GameObject("Test");
go.AddComponent(type);
```

---
**通过初始化从打包成 assetbundle 的 prefab 或者 scene 还原挂载的热更新脚本**

假设热更新中有这样的入口脚本，这个脚本被挂到 `HotUpdatePrefab.prefab` 上：

```cs
public class HotUpdateMain : MonoBehaviour
{
    void Start() => Debug.Log("hello, HybridCLR");
}
```

通过实例化这个 prefab，即可运行热更新逻辑：

```cs
AssetBundle prefabAb = xxxxx;  // 获得HotUpdatePrefab.prefab所在的AssetBundle
GameObject testPrefab = Instantiate(prefabAb.LoadAsset<GameObject>("HotUpdatePrefab.prefab"));
```

> [!TIP]
> 该方法不需要借助任何反射，且跟原生的启动流程相同，故推荐使用这种方式初始化热更新入口代码

## 打包

由于热更新本身的要求以及 Unit y资源管理的一些限制，对打包工作流需要一些特殊处理，主要分为几部分：

- 设置UNITY_IL2CPP_PATH环境变量
- 打包时自动排除热更新assembly
- 打包时将热更新dll名添加到assembly列表
- 将打包过程中生成的裁剪后的aot dll拷贝出来，供补充元数据使用
- 编译热更新dll
- 生成一些打包需要的文件和代码
- iOS平台的特殊处理

手动操作这些是烦琐易错的，**`com.code-philosophy.hybridclr` package包含了打包工作流相关的标准工具脚本，将这些复杂流程简化为一键操作**。 详细实现请看源码或者[com.code-philosophy.hybridclr介绍](https://www.hybridclr.cn/docs/basic/com.code-philosophy.hybridclr)

打包流程：

1. 运行菜单 `HybridCLR/Generate/All` 一键执行必要的生成操作（ex：生成桥接代码）
2. 将`HybridCLRData/HotUpdateDlls`下的热更新dll添加到项目的热更新资源管理系统
3. 将`HybridCLRData/AssembliesPostIl2CppStrip`下的补充元数据 dll添加到项目的热更新资源管理系统
4. 根据你项目原来的打包流程打包


---

**优化的打包流程，替换第一步：**`HybridCLR/Generate/All` 命令运行过程中会执行一次导出工程，以生成裁剪后的  AOT dll。这对于大型项目来说可能非常耗时，几乎将打包时间增加了一倍。如需优化打包时间，可以按照如下流程一次出包。

1. 运行 `HybridCLR/Generate/LinkXml`
2. 导出工程
3. 运行 `HybridCLR/Generate/Il2cppDef`
4. 运行 `HybridCLR/Generate/MethodBridgeAndReversePInvokeWrapper`生成桥接函数
5. 将  `{proj}\HybridCLRData\LocalIl2CppData-{platform}\il2cpp\libil2cpp\hybridclr\generated`目录 替换导出工程中的此目录
6. 在导出工程上执行 build
---

- 更多内容，包括 iOS 平台的特殊处理：[打包工作流 | HybridCLR](https://www.hybridclr.cn/docs/basic/buildpipeline)
- [发布WebGL平台 | HybridCLR](https://www.hybridclr.cn/docs/basic/buildwebgl)

## 代码裁剪

根据日志错误日志确定哪个类型或函数被裁减，在l `link.xml` 里保留这个类型或函数，或者在主工程里显式地加上对这些类或函数的调用。

但手动执行该方法又麻烦又浪费多时间，**`com.code-philosophy.hybridclr` 包提供了一个便捷的菜单命令 `HybridCLR/Generate/LinkXml`， 能一键生成热更新工程里的所有 AOT 类型及函数引用**。

> [!WARNING]
> 如果你主工程中没有引用过某个程序集（ex: `Newtonsoft.Json`）的任何代码，即使在`link.xml` 中保留，该程序集也会被完全裁剪。因此对于每个要保留的 AOT 程序集， 请确保在主工程代码中显式引用过它的某个类或函数。

更多：[代码裁剪 | HybridCLR](https://www.hybridclr.cn/docs/basic/codestriping)

## `MonoBehaviour` 支持

HybridCLR 完全支持热更新 `MonoBehaviour` 和 `ScriptableObject` 工作流，即可以在代码里在GameObject 上 Add 热更新脚本或者在资源上直接挂载热更新脚本。但由于 Unity 资源管理机制的特殊性，对于资源上挂载热更新脚本，需要打包工作流上作一些特殊处理。

**通过代码使用**

`AddComponent<T>()`或者`AddComponent(Type type)`任何时候都是完美支持的。只需要提前通过`Assembly.Load` 将热更新 dll 加载到运行时内即可。

**在资源上挂载 `MonoBehaviour` 或者创建 `ScriptableObject` 类型资源**

1. 脚本所在的 dll 已经加载到运行时中
2. 必须是使用 AssetBundle 打包的资源（addressable 之类间接使用了ab的框架也可以）
3. 脚本所在的 dll 必须添加到打包时生成的 assembly 列表文件。这个列表文件是 unity 启动时即加载的，不可变数据。不同版本的 Unity 的列表文件名和格式不相同

如果未对打包流程作任何处理，不满足条件三，运行时会出现 `Scripting Missing`的错误。为此你需要把项目中的热更新 assembly 添加到 `HybridCLRSettings` 配置的 `HotUpdateAssemblyDefinitions` 或 `HotUpdateAssemblies` 字段中。

> [!TIP]
> 只限制了热更新资源以 ab 包形式打包，热更新 dll 打包方式没有限制。你可以按照项目需求**自由选择热更新方式**，可以将 dll 打包到 ab 中，或者裸数据文件，或者加密压缩等等。只要能保证在加载热更新资源前使用 Assembly.Load 将其加载即可。

需要被挂到资源上的脚本所在 dll 名称上线后勿修改，因为 assembly 列表文件打包后无法修改。

更多：[MonoBehaviour支持 | HybridCLR](https://www.hybridclr.cn/docs/basic/monobehaviour)

## AOT 泛型问题

对于**热更新代码中定义**的泛型类，可以随意使用没有限制，但是对于**AOT泛型**，则遇到了一些问题。

> 目前先只专注于基于补充元数据的泛型函数实例化技术

更多，包括类型共享：[AOT泛型 | HybridCLR](https://www.hybridclr.cn/docs/basic/aotgeneric#%E5%85%B1%E4%BA%AB%E7%B1%BB%E5%9E%8B%E8%AE%A1%E7%AE%97%E8%A7%84%E5%88%99)

### 加载时机

::: details
AOT 泛型元数据中除了函数以外的所有元数据都可以通过 Inflate 技术在内存中实例化，唯独函数无法实例化。AOT 泛型函数无法实例化的问题本质上因为il2cpp执行`IL -> C++`翻译过程中丢失了原始函数体IL元数据。 以 `List<T>.Add` 函数为例，如果没有原始的 IL 函数信息，凭现成的 `List<int>.Add` 或者 `List<object>.Add` 是无法获得正确的 `List<long>.Add` 的实现的。我们的解决思路很巧妙——补充上丢失的原始泛型函数体元数据。
:::

使用 `com.code-philosophy.hybridclr package` 中的 `HybridCLR.RuntimeApi.LoadMetadataForAOTAssembly` 函数为 AOT 的 assembly 补充对应的元数据。 `LoadMetadataForAOTAssembly` 函数可以在任何时机调用，另外既可以在 AOT 中调用，也可以在热更新中调用，只要在使用 AOT 泛型前调用即可（只需要调用一次）。 理论上越早加载越好，实践中比较合理的时机是热更新完成后，或者热更新 dll 加载后但还未执行任何代码前。如果补充元数据的 dll 作为额外数据文件也打入了主包（例如放到 StreamingAssets 下），则主工程启动时加载更优。

**补充元数据没有加载顺序的要求**。但补充元数据加载后，大约会占用6倍 dll 大小的内存，而且这些内存无法回收。对内存有较高的要求，请使用商业版本的完全泛型共享技术，不再需要补充元数据，节省这部分内存。

### 获得补充元数据dll

**打包过程**生成的裁剪后的 AOT dll 可以用于补充元数据。`com.code-philosophy.hybridclr` 插件会自动把它们复制到 `{project}/HybridCLRData/AssembliesPostIl2CppStrip/{target}`。注意，不同BuildTarget 的裁剪 AOT dll 不可复用。

使用 `HybridCLR/Generate/AotDlls` 命令也可以立即生成裁剪后的 AOT dll，它的工作原理是通过导出一个 Temp 工程来获得裁剪 AOT dll。

> [!TIP]
> 打包完成后，补充元数据dll不会发生变化，请**不要在每次热更新时使用最新生成的AOT dll**。

### 应该补充元数据的 assembly 列表

`HybridCLR/generate/AOTGenericReference` 命令生成的 `AOTGenericReferences.cs` 文件中包含了应该补充元数据的 assembly 列表，示例如下。你不需要运行游戏也能快速知道应该补充哪些元数据。

EX:

```cs
using System.Collections.Generic;
public class AOTGenericReferences : UnityEngine.MonoBehaviour
{

    // {{ AOT assemblies
    public static readonly IReadOnlyList<string> PatchedAOTAssemblyList = new List<string>
    {
        "Main.dll",
        "System.Core.dll",
        "UnityEngine.CoreModule.dll",
        "mscorlib.dll",
    };

        // {{ constraint implement type
    // }} 

    // {{ AOT generic types
    // AOTDefs.HierarchyGeneric2<int>
    // IBar<object>
    // IRun<object>
    // System.Action<UnityEngine.RaycastHit>
}
```

补充元数据 dll 是可以热更的，不用担心发布后在某个版本突然遇到泛型错误的问题。


> [!TIP]
> `PatchedAOTAssemblyList` 列表的计算结果是保守的，实践中很可能不需要补充这么多。如果没有明显的内存压力，直接按列表全补充比较省事。如果需要优化则可以只补充最常见的几个 dll（如mscorlib之类），后面遇到 AOT 泛型错误再加上相应的 dll。

### 元数据模式 HomologousImageMode

目前支持两种元数据模式：

- `HomologousImageMode::Consistent` 模式，即补充的 dll 与打包时裁剪后的 dll 精确一致。因此必须使用build过程中生成的裁剪后的 dll，则不能直接复制原始 dll。
- `HomologousImageMode::SuperSet` 模式，即补充的 dll 是打包时裁剪后的 dll 的超集。这个模式放松对了 AOT dll 的要求，你既可以用裁剪后的 AOT dll，也可以用原始 AOT dll。

### 加载补充元数据示例代码

代码中加载补充元数据dll的方式见以下示例代码，你也可以参考 [hybridclr_trial](https://github.com/focus-creative-games/hybridclr_trial)。

```cs
public static unsafe void LoadMetadataForAOTAssembly()
{
	List<string> aotDllList = new List<string>
	{
		"mscorlib.dll",
		"System.dll",
		"System.Core.dll", // 如果使用了Linq，需要这个
		// "Newtonsoft.Json.dll",
		// "protobuf-net.dll",
	};

	AssetBundle dllAB = LoadDll.AssemblyAssetBundle;
	foreach (var aotDllName in aotDllList)
	{
		byte[] dllBytes = dllAB.LoadAsset<TextAsset>(aotDllName).bytes;
		// 执行补充元数据时内部会自动将dllBytes复制一份，调用完成后请不要将dllBytes保存，造成无谓的内存浪费
		int err = HybridCLR.RuntimeApi.LoadMetadataForAOTAssembly(dllBytes, HomologousImageMode.SuperSet);
		  Debug.Log($"LoadMetadataForAOTAssembly:{aotDllName}. ret:{err}");
	}
}
```

执行 `HybridCLR.RuntimeApi.LoadMetadataForAOTAssembly` 时会在内部将传入的 `dllBytes` 复制一份，调用完该接口后**请不要保存 `dllBytes`**，否则会造成内存浪费。

> [!TIP]
> 如果 `RuntimeApi.LoadMetadataForAOTAssembly` 花费太多时间，造成卡顿，你可以在其他线程异步加载。

### 小优化

#### 优化补充元数据 dll 大小

加载补充元数据dll不仅增加了包体或者热更新资源大小，运行时加载也消耗了可观的内存空间，详细见[内存与GC](https://www.hybridclr.cn/docs/basic/memory)文档。优化补充元数据dll大小 对于内存敏感的场合有积极意义。

补充元数据技术只用到了补充元数据 dll 中泛型函数的元数据信息，补充元数据 dll 中包含的非泛型函数的元数据是多余的，将它们完全剔除不会 影响补充元数据机制的正常工作。因此 `com.code-philosophy.hybridclr` 自 v4.0.16 版本起提供了补充元数据优化工具类`HybridCLR.Editor.AOT.AOTAssemblyMetadataStripper` 实现这个剔除优化工作。

这个剔除效果因 assembly 而异，效果差别较大，以下是测试结果：

|程序集名|原始大小|优化后大小|优化率|
|---|---|---|---|
|mscorlib|2139k|1329k|37.9%|
|System|186k|63.0k|66.2%|
|System.Core|96.3k|89.1k|7.4%|

::: details 自动生成的示例代码
```cs
/// 进一步剔除AOT dll中非泛型函数元数据，输出到StrippedAOTAssembly2目录下
public static void StripAOTAssembly()
{
	BuildTarget target = EditorUserBuildSettings.activeBuildTarget;
	string srcDir = SettingsUtil.GetAssembliesPostIl2CppStripDir(target);
	string dstDir = $"{SettingsUtil.HybridCLRDataDir}/StrippedAOTAssembly2/{target}";
	foreach (var src in Directory.GetFiles(srcDir, "*.dll"))
	{
		string dllName = Path.GetFileName(src);
		string dstFile = $"{dstDir}/{dllName}";
		AOTAssemblyMetadataStripper.Strip(src, dstFile);
	}
}
```
:::

#### 尝试类型共享

如果 AOT 泛型补充相应的泛型元数据，同时 il2cpp 泛型共享实例化也存在，**为了最大程度提升性能，HybridCLR 会优先尝试 il2cpp 泛型共享**。

基于补充元数据的泛型函数实例化技术虽然相当完美，但毕竟实例化的函数以解释方式执行，**如果能提前在 AOT 中泛型实例化，可以大幅提升性能**。所以对于常用尤其是性能敏感的泛型类和函数，可以提前在 AOT 中实例化。HybridCLR 提供了工具帮助自动扫描收集相应的泛型实例，你运行菜单命令  `HybridCLR/Generate/AOTGenericReference` 即可。

> [!TIP]
> 该命令只收集了热更新中用到的AOT泛型实例，并且生成的全部是注释形式的代码，需要你自己参考这个文件，根据实际需求在其他地方显式地实例化部分泛型。
