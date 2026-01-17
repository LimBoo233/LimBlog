
# Addressables 快速实战

> 参考教程：[How to use Addressables FASTER Loading FREE Memory SMALL Download](https://www.youtube.com/watch?v=C6i_JiRoIfk)

Addressables 提供了更多最资源加载的控制权，按需在后台加载，易获得加载时间。

任何被脚本直接应用的对象，都会直接被加载到内存中。

## 安装

安装：Window -> Package Manager -> Unity Registry -> Addressables

安装完成后，通过 Window -> Asset Manaagement -> Addressables 打开相关设置。

## 组织 AB 包

Addressables 将资源已一个个组 (Groups) 管理，在 Window -> Asset Manaagement -> Addressables -> Groups 可以创建、删除、编辑组。每个组最终都会打包为一个 AB 包。

把资源/文件夹划入一个组：

1. 你可以直接将一个资源/文件夹拖入 Groups 窗口中的一个组，也可也选中资源/文件夹在 Inspector 窗口中找到 Addressables 勾选项。

2. 资源在标记为 Addressables 后，会自动被赋予一个用来标记文件的 Path。你可以随意修改文件的 Path，它与资源的实际储存路径无关的。

当你把文件夹整个标记为 Addressable 时，其中的文件会自动变成可寻址的 (Addressable)。当你往文件夹中丢入和删除新的文件时，Addressables 也会自动将它们加入/踢出 group。

> [!INFO]
> 虽然你能将文件夹标记为 Addressable，当你实际上不同通过代码直接加载整个文件夹，你需要为一个文件夹赋予一个特定的标签 (Label)，然后通过标签来加载其中的资源，这些资源会自动被赋予与文件夹相同的标签。

## 加载单个资源

使用 Addressables，你不用再遵顼加载 AB包 -> 加载资源的固定流程，取而代之的是，你可以将利用 Addressables 的专注于加载特定的资源上。

通过`Addressable`中的静态方法`LoadAssetAsync<TOject>()`来加载一个对象到内存中。此方法接受的参数类型虽为`object`，但其实它可以接受并处理此类对象：

- `string`：根据资源的 path 加载
- `AssetReference`与其子类`AssetReferenceT<TObject>`：指向资源在 Addressable 中的引用
- `AssetLabelReference`：根据 label 加载资源，但当多个资源使用同一 label 时会出错，所有请不要使用它加载单个资源

```cs
AsyncOperationHandle<GameObject> handle = Addressables.LoadAssetAsync<GameObject>("Prefabs/Chisa.prefab");

// 完成回调，也可以作为参数传给 LoadAssetAsync()
handle.Completed += handle => if (handle.AsyncOperationStatus.Succeeded) Instantiate(handle.result)
```

当根据 reference 加载资源时，你可以使用 `assetReference.LoadAssetAsync<T>`方法作为替代，与`LoadAssetAsync`是一样的效果。

```cs
// --- 加载资源 ----
AsyncOperationHandle<GameObject> handle =  assetReference.LoadAssetAsync<GameObject>();

// --- 加载游戏物体资源并实例化 ---
assetReferenceGameObject.InstantiateAsync();
```

除了`AssetReferenceGameObject`，你也可以通过继承`AssetReferenceT<TObject>`来实现自定义的`AssetReferenceGameObject`。

```cs
[System.Serialize]
public AssetReferenceAudioClip: AssetReferenceT<AudioClip>
{
	public AssetReferenceAudioClip(string guid) : base(guid) {}
}
```

**使用 UniTask 可以使用`await`关键词等待`LoadAssetAsync<T>`方法的完成。**

```cs
GameObject prefab = await Addressables.LoadAssetAsync<GameObject>("Key");

// 如果需要获取 handle:
var handle = Addressables.LoadAssetAsync<GameObject>("key");
GameObject prefab = await handle;
```

可以使用`ToUniTask()`方法将一个`AsyncOperationHandle`转化为`UniTask`,如此一来便可以使用更多Task 的特性，比如取消任务、查看进度。

```cs
var prefab = await Addressables.LoadAssetAsync<GameObject>("Key")
	.ToUniTask(cancellationToken: token, 
	Progress.Create<float>(x => Debug.Log(x));
```

## 批量加载

`LoadAssetAsync`一次只能加载一个资源，而`LoadAssetsAsync`可以一次性批量加载多个资源。你可以为其传入两种不同类型的参数：

- Label：`string`或`AssetLabelReference`
- 一个包含 key, asset reference 和 Label 的列表

```cs
// --- Label ---
AsyncOperationHandle<IList<GameObject>> handle = 
	Addressables.LoadAssetsAsync<GameObject>("Weapon", loadedAsset => 
	{ 
		// 每加载完一个资源，就会调用一次回调函数
		Debug.Log("加载到了一个武器: " + loadedAsset.name); 
	});
	
// --- List ---
var keys = new List<string> { 
	"Prefabs/Chisa.prefab", 
	"Prefabs/Robot.prefab",
	"Prefabs/Tree.prefab"
};

// 必须传入一个回调，此处先传入 null
var handle = Addressables.LoadAssetsAsync<GameObject>(key, null)；

handle.Completed += op =>
{
    foreach(var go in op.Result)
    {
        Instantiate(go);
    }
};

// --- UniTask ---
var handle = Addressables.LoadAssetsAsync<GameObject>(key, null); var assets = await handle.ToUniTask();
```

> [!TIP]
> 由于`LoadAssetsAsync` 传入 Label 时，会将所有带有该 Label 的资源一次性加载进内存，所以Label 最适合小批量、必须同时存在的资源，适合“大库”。

## 资源的加载与释放直接

Unity Addressables 系统最核心的内存管理机制是**引用计数（Reference Counting）**。

与传统的`Resources.Load`不同，Addressables 会记录资源的状态，并要求你通过**句柄（AsyncOperationHandle）**来追踪资源的使用情况。

以下是 Addressables 加载与释放的详细机制拆解：

1. Addressables 系统中，内存管理的最小单位通常是一个 AB 包，而不是单个 Asset。

	- 当你加载一个资源时，系统会找到包含该资源的 AssetBundle
	    
	- 该 Bundle 的引用计数 +1
	    
	- 只有当 Bundle 的引用计数归零时，该 Bundle 才会真正从内存中卸载
	
2. 释放资源必须显式调用 `Addressables.Release(handle)`。
	
	- 传入句柄：你将加载时获得的`AsyncOperationHandle`传给 Release 方法
	    
	- 计数减少：Addressables 会将该资源及其对应的 AB包 的引用计数 -1
	    
	- 触发卸载 (当计数=0)：
	    - 如果该 Bundle 的引用计数变为 0，系统会调用`AssetBundle.Unload(true)`
	        
	    - 这意味着该 Bundle 内的所有资源都会从内存中被清除
## 释放资源

通过调用`Addressables.Release(handle)`来释放资源。

```cs
// 检查资源是否有效
if (handle.IsValid())
{ 
	Addressables.Release(handle);
	// 把 handle 重置回默认值，防止此处多次释放同一资源
	handle = default;
}
```

如果出于某些原因无法获取 handle（比如调用了`InstantiateAsync`），也可也使用`Addressables.Release(reuslt)`来释放资源，这利用了 Addressables 系统自身维护的字典。

ex:

```cs
var texture = await Addressables.LoadAssetAsync<Texture2D>("MyTexture");

Addressables.Release(texture);
// 或者当处理通过 InstantiateAsync 加载的 GameObject 时，此方法语义更清晰
Addressables.ReleaseInstance(gameObject)
```

没有 handle 时便无法通过`handle.IsValid()`提前检查资源的有效性（ex：是否还在内存中），此时只能通过`Addressables.Release()`方法返回的布尔值折中一下，得知释放的结果。

ex:

```cs
bool success = Addressables.ReleaseInstance(gameObject);

if (!success) {
    Debug.LogWarning("释放失败！可能原因：\n" +
        "1. 这个物体根本不是通过 Addressables 实例化的。\n" +
        "2. 这个物体已经被释放过了。\n" +
        "3. 这个物体已经被 Destroy 掉了。");
}
```

## 其他窗口工具

在 Window -> Asset Manaagement -> Addressables 中还有许多其他窗口：

- Profile：用于快速切换开发环境和生产环境，且可以设置更新相关。
- Settings：决定 Addressables 的整体行为。比如，构建出的包放在哪里，是从本地加载还是从服务器加载，是否开启自动更新。
- Event Viewer：实时显示当前的**引用计数**状态。
- Analyze：**查重工具。** 检查资源是否有重复打包。
- Hosting：模拟远程服务器。

## 切换场景

Addressables 还有专门用于加载场景的方法，它不仅能替代传统的`SceneManager.LoadSceneAsync`，还顺带解决了场景资源下载和依赖管理的问题。

它的用法和`LoadAssetAsync`非常像，但有一些针对场景的专属参数。参数说明：

1. `SceneAddress`: 场景在 Group 里的 Key
2. `LoadSceneMode`: `Single` (替换当前场景) 或 `Additive` (叠加到当前场景)
3. `activateOnLoad`: 加载完是否自动激活（默认为 `true`）

```cs
var handle = Addressables.LoadSceneAsync(
	"Level_01", 
	LoadSceneMode.Single
	);
	
handle.Completed += handle => 
{
	if (handle.Status == AsyncOperationStatus.Succeeded) 
	{
		// 获取场景实例对象
		SceneInstance sceneInstance = handle.Result; 
	}
};
```

卸载资源：

```cs
Addressables.UnloadSceneAsync(handle);
// 无 handle
Addressables.UnloadSceneAsync(sceneInstance);
```