
# ScriptableObject

## 简介

ScriptableObject是 Unity 中一种用于**独立存储数据**的容器类，它不需要像 MonoBehaviour 那样挂载到 GameObject 上，而是作为项目中的**资源文件 (.asset)** 存在。它的核心价值在于**数据复用**与**内存优化**。

**先前**

```cs
public class Bullet: MonoBehaviour
{
	// 每次创建 Bullet，都会在内存中分配这些数据
	// 减少了单个类的内存占用，与大量赋值的开销
	private readonly float _speed = 1.0f  // 4 字节
	private readonly int _damage = 10  // 4 字节
	public GameObject hitPrefab;  // 8 字节 (引用)
}
```

**使用 ScriptableObject 共享只读数据**

```cs
public class Bullet: MonoBehaviour
{
	public BulletData _data;
}

public class BulletData: ScriptableObject
{
	public float Speed = 1.0f;
	public int Damage = 10;
	public GameObject hitPrefab;
}
```

## 创建一个 ScriptableObject

只要创建一个继承自`ScriptableObject`的类即可。要使其中的数据能在 Inspector 面板中编辑，需将字段声明为`public`或添加`[SerializeField]`，此外对于自定义类也需添加`[System.Serializable]`。

你在脚本中定义的 ScriptableObject 类只是一个模板，此时为属性赋值相当于提供默认数据。 

```cs
public class BulletData: ScriptableObject
{
	public float Speed = 1.0f;
	public int Damage = 10;
	public GameObject hitPrefab;
	
	public List<Data> data;
}

[Serializable]
public class Data 
{
	public int num; 
}
```

其次，为了能在 Project 窗口右键菜单中创建 ScriptableObject 资产，需要为类添加`[CreateAssetMenu]`特性：

```cs
// fileName 默认为类名
[CreateAssetMenu(
	fileName = "子弹数据", 
	menuName = "ScriptableObject/游戏数据"，
	order = 0)]
public class BulletData: ScriptableObject { }
```

::: details 相对麻烦一些的方法

通过扩展编辑器，可以自定义创建 ScriptableObject 资产的菜单项。

> [!WARNING]
> 这些代码绝对不能被打包到最终的游戏（exe/apk）里，否则打包时会直接报错。此类脚本必须存放在名为 Editor > 的特殊文件夹里，或者用 `#if UNITY_EDITOR` 宏包裹起来。

```cs
using UnityEngine;
using UnityEditor;

public class ScriptableObjectTool
{
    // 在 Unity 顶部菜单栏添加一个选项 "ScriptableObject" -> "CreateMyData"
    [MenuItem("ScriptableObject/CreateMyData")]
    public static void CreateMyData()
    {
        // 1. 书写创建数据资源文件的代码
        // CreateInstance 创建的是内存中的实例，还没存到硬盘上
		// 此处 asset 中的属性不受 Inspector 设置的默认值影响
        MyData asset = ScriptableObject.CreateInstance<MyData>();

        // 2. 通过编辑器 API 根据数据创建一个数据资源文件
        AssetDatabase.CreateAsset(asset, "Assets/SO/MyDataTest.asset");

        // 3. 保存创建的资源
        AssetDatabase.SaveAssets();

        // 4. 刷新界面（让 Unity 编辑器立刻显示出新文件）
        AssetDatabase.Refresh();
    }
}


public class MyData : ScriptableObject
{
    public int exampleValue = 10;
}

```
:::

## 通过资源加载关联信息

除了直接在 Inspector 中管理，还可以通过资源加载的形式获取 SO。

**AB 包**

```cs
private async UniTask LoadFromAB(string bundlePath)
{
	// 1. 异步加载 AB 包文件
	// LoadFromFileAsync 返回 AssetBundleCreateRequest
	var bundleRequest = await AssetBundle.LoadFromFileAsync(bundlePath);
	
	var myBundle = bundleRequest; // 获取加载好的 Bundle

	// 2. 异步从包里提取 SO
	// LoadAssetAsync 返回 AssetBundleRequest
	var assetRequest = await myBundle.LoadAssetAsync<BulletData>("MyBulletData");

	// AssetBundleRequest 遗留问题：存贮的 asset 是 Object 类型，需要类型转换
	var data = assetRequest as BulletData;

	// 卸载 (false = 保留已加载出的 data，只卸载包头)
	myBundle.Unload(false);
}
```

**AA 包**

```cs
private async UniTask LoadBulletData()
{
	// ToUniTask() 将 Handle 转换为高效的 UniTask
	var data = await Addressables.LoadAssetAsync<BulletData>("MyBulletConfig")
									.ToUniTask(); 
	// 记得在合适的时机（比如对象销毁时）释放资源：
	// Addressables.Release(data); 
}
```

## 在游戏运行时修改 SO

打包后，的资源通常被压缩在 .sharedassets、AssetBundle 或 catalog 中。这些文件在运行时是只读的，这意味着游戏时尝试修改 SO 时，只会修改在内存中副本的数据，这些数据并不会写回磁盘上。

而在编辑器环境下修改 SO，Unity 编辑器为了方便开发者调试，默认将内存中的修改同步回 Asset Database。

**但注意，SO 最适合的还是做只读的配置文件。**

## SO 单例

> 为 SO 实现单例模式，别的类直接通过`static Instance`来获取 SO，而不是在 Inspector里关联，会不会比较好？

这是一个在 Unity 架构中非常经典且**有争议**的话题。

**这种做法叫做 "ScriptableSingleton"**

把 SO 做成单例，意味着你不需要在任何 Monobehaviour 上定义 `public MyData data;` 也能访问它。但，你也不能利用它创建多个 .asset 资产文件了.

你需要考虑："这个数据在游戏世界里，真的只需要一份吗？"

**优点：**

1. **代码极其干净**：`AudioManager.Instance.MasterVolume` 直接就能用，哪里需要点哪里。
    
2. **告别拖拽**：不用在几十个场景的几十个物体上反复拖拽同一个配置文件。
    
3. **防止引用丢失**：因为是代码里写死的加载路径，不会出现“哎呀我忘了把 SO 拖进 Inspector”导致的空引用报错。
    

**缺点：**

1. **硬编码依赖（Hard Dependency）**：代码写死了 SO 引用。如果那天你想测试，你没法通过简单的拖拽替换文件来测试，只能改代码。
    
2. **隐藏了依赖关系**：如果在 Inspector 里拖拽，看一眼 Prefab 就知道依赖的 SO 配置。但如果是单例，在 Inspector 根本无法知道这个怪脚本内部偷偷读取了全局配置。
    
3. **加载黑盒**：SO 不在场景里，内存里一开始是没有的。你必须使用 `Resources.Load` 或者 `Addressables` 去加载它。如果加载逻辑写得不好，可能会导致卡顿。

> [!TIP]
> 针对**全局单例 ScriptableObject** 这个特定场景，使用同步加载会更好。
> - ScriptableObject 文件通常较小
> - 无需处理竞态条件（多个系统同时请求）
> - 更易用，易编写

## 声明周期函数

SO 生命周期函数中常用的有（~~实际上都不常用~~）：

- **`Awake()`**
    
    - 当 SO 实例被创建或**首次加载**时调用。
        
    - 类似于构造函数，用于初始化。
        
- **`OnEnable()`** 【最常用】
    
    - 当 SO 被加载到内存，或者在编辑器里代码重新编译后调用。
        
    - **重要用途**：通常在这里进行“数据重置”或“注册事件”。
        
- **`OnDisable()`**
    
    - 当 SO 即将从内存中卸载，或者游戏退出时调用。
        
    - **重要用途**：取消事件注册，清理临时数据。
        
- **`OnDestroy()`**
    
    - 当 SO 被彻底销毁时调用（比如你手动调用 `Resource.UnloadUnusedAssets` 清理了它）。

