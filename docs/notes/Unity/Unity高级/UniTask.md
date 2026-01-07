# UniTask

## 简介

> 大量内容直接源于 Github 上 UniTask 的 README_CN。
> [UniTask Github 仓库](https://github.com/Cysharp/UniTask/tree/master)

UniTask 是一个高性能，零堆内存分配的 async/await 异步框架。

- 基于值类型的`UniTask<T>`和自定义的 AsyncMethodBuilder 来实现零堆内存分配
- 使所有 Unity 的 AsyncOperations 和 Coroutines 可等待
- 基于 PlayerLoop 的任务（`UniTask.Yield`，`UniTask.Delay`，`UniTask.DelayFrame`等..）可以替换所有协程操作
- 对 MonoBehaviour 消息事件和 uGUI 事件进行可等待/异步枚举扩展
- 完全在 Unity 的 PlayerLoop 上运行，因此不使用 Thread，并且同样能在 WebGL、wasm 等平台上运行。
- 带有 Channel 和 AsyncReactiveProperty 的异步 LINQ
- 提供一个 TaskTracker EditorWindow 以追踪所有 UniTask 分配来预防内存泄漏
- 与原生 Task/ValueTask/IValueTaskSource 高度兼容的行为

原生 Task 太重，与 Unity 线程（单线程）相性不好。Unity 的异步对象由 Unity 的引擎层自动调度，而 UniTask 不使用线程和 SynchronizationContext/ExecutionContext。它实现了更快和更低的分配，并且与Unity完全兼容。

::: details
```cs
// 使用 UniTask 所需的命名空间
using Cysharp.Threading.Tasks;

// 您可以返回一个形如 UniTask<T>(或 UniTask) 的类型，这种类型事为Unity定制的，作为替代原生 Task<T> 的轻量级方案
// 为 Unity 集成的零堆内存分配，快速调用，0消耗的 async/await 方案
async UniTask<string> DemoAsync()
{
    // 您可以等待一个 Unity 异步对象
    var asset = await Resources.LoadAsync<TextAsset>("foo");
    var txt = (await UnityWebRequest.Get("https://...").SendWebRequest()).downloadHandler.text;
    await SceneManager.LoadSceneAsync("scene2");

    // .WithCancellation 会启用取消功能，GetCancellationTokenOnDestroy 表示获取一个依赖对象生命周期的 Cancel 句柄，当对象被销毁时，将会调用这个 Cancel 句柄，从而实现取消的功能
    // 在 Unity 2022.2之后，您可以在 MonoBehaviour 中使用`destroyCancellationToken`
    var asset2 = await Resources.LoadAsync<TextAsset>("bar").WithCancellation(this.GetCancellationTokenOnDestroy());

    // .ToUniTask 可接收一个 progress 回调以及一些配置参数，Progress.Create 是 IProgress<T> 的轻量级替代方案
    var asset3 = await Resources.LoadAsync<TextAsset>("baz").ToUniTask(Progress.Create<float>(x => Debug.Log(x)));

    // 等待一个基于帧的延时操作（就像一个协程一样）
    await UniTask.DelayFrame(100); 

    // yield return new WaitForSeconds/WaitForSecondsRealtime 的替代方案
    await UniTask.Delay(TimeSpan.FromSeconds(10), ignoreTimeScale: false);
    
    // 可以等待任何 playerloop 的生命周期（PreUpdate，Update，LateUpdate等）
    await UniTask.Yield(PlayerLoopTiming.PreLateUpdate);

    // yield return null 的替代方案
    await UniTask.Yield();
    await UniTask.NextFrame();

    // WaitForEndOfFrame 的替代方案
#if UNITY_2023_1_OR_NEWER
    await UniTask.WaitForEndOfFrame();
#else
    // 需要 MonoBehaviour（CoroutineRunner）
    await UniTask.WaitForEndOfFrame(this); // this是一个 MonoBehaviour
#endif
    
    // yield return new WaitForFixedUpdate 的替代方案，（等同于 UniTask.Yield(PlayerLoopTiming.FixedUpdate)）
    await UniTask.WaitForFixedUpdate();
    
    // yield return WaitUntil 的替代方案
    await UniTask.WaitUntil(() => isActive == false);

    // WaitUntil 扩展，指定某个值改变时触发
    await UniTask.WaitUntilValueChanged(this, x => x.isActive);

    // 您可以直接 await 一个 IEnumerator 协程
    await FooCoroutineEnumerator();

    // 您可以直接 await 一个原生 task
    await Task.Run(() => 100);

    // 多线程示例，在此行代码后的内容都运行在一个线程池上
    await UniTask.SwitchToThreadPool();

    /* 工作在线程池上的代码 */

    // 转回主线程（等同于 UniRx 的`ObserveOnMainThread`）
    await UniTask.SwitchToMainThread();

    // 获取异步的 webrequest
    async UniTask<string> GetTextAsync(UnityWebRequest req)
    {
        var op = await req.SendWebRequest();
        return op.downloadHandler.text;
    }

    var task1 = GetTextAsync(UnityWebRequest.Get("http://google.com"));
    var task2 = GetTextAsync(UnityWebRequest.Get("http://bing.com"));
    var task3 = GetTextAsync(UnityWebRequest.Get("http://yahoo.com"));

    // 构造一个 async-wait，并通过元组语义轻松获取所有结果
    var (google, bing, yahoo) = await UniTask.WhenAll(task1, task2, task3);

    // WhenAll 的简写形式，元组可以直接 await
    var (google2, bing2, yahoo2) = await (task1, task2, task3);

    // 返回一个异步值，或者您也可以使用`UniTask`（无结果），`UniTaskVoid`（不可等待）
    return (asset as TextAsset)?.text ?? throw new InvalidOperationException("Asset not found");
}
```
:::
## 入门

您可以在使用`using Cysharp.Threading.Tasks`时对多种步操作进行 await，例如：
- `AsyncOperation`
- `ResourceRequest`
- `AssetBundleRequest`
- `AssetBundleCreateRequest`
- `UnityWebRequestAsyncOperation`
- `AsyncGPUReadbackRequest`
- `IEnumerator`

UniTask 提供了三种模式的扩展方法：

```cs
await asyncOperation;
.WithCancellation(CancellationToken);
.ToUniTask(IProgress, PlayerLoopTiming, CancellationToken);
```

`WithCancellation`是`ToUniTask`的简化版本，两者都返回`UniTask`。

直接 await 依赖 Unity 的 `completed` 事件，当事件完成后立刻唤醒并执行后续代码（ex：可能在 PreUpdate 阶段）。而`WithCancellation()` 会固定在 Update 阶段，`ToUniTask()`是从指定的 PlayerLoop 生命周期执行时返回。

`UniTask`可以使用`UniTask.WhenAll`，`UniTask.WhenAny`，`UniTask.WhenEach`等实用函数。它们就像`Task.WhenAll`和`Task.WhenAny`，但它们返回的数据类型更好用——它们会返回值元组，因此您可以传递多种类型并解构每个结果：

```cs
public async UniTaskVoid LoadManyAsync()
{
    // 并行加载.
    var (a, b, c) = await UniTask.WhenAll(
        LoadAsSprite("foo"),
        LoadAsSprite("bar"),
        LoadAsSprite("baz"));
}

async UniTask<Sprite> LoadAsSprite(string path)
{
    var resource = await Resources.LoadAsync<Sprite>(path);
    return (resource as Sprite);
}
```

`UniTaskCompletionSource<T>` 是`TaskCompletionSource<T>`的轻量级版本，它们用于将一个回调转换为可以被 await 的 UniTask/Task。

ex:

```cs
public UniTask<int> WrapByUniTaskCompletionSource()
{
    var utcs = new UniTaskCompletionSource<int>();

    // 当操作完成时，调用 utcs.TrySetResult();
    // 当操作失败时，调用 utcs.TrySetException();
    // 当操作取消时，调用 utcs.TrySetCanceled();
    
    utcs.TrySetResult(10)
    return utcs.Task; //本质上就是返回了一个 UniTask<int>
}

// 调用
var result = await WrapByUniTaskCompletionSource();
Debug.Log($"执行完成：{result}")
```

## 类型转换

您可以进行如下转换：  
- `Task` -> `UniTask` ：使用`AsUniTask`。
	```cs
	// 第三方库返回了一个原生的 Task
	Task<int> standardTask = SomeLibrary.GetDataAsync();
	
	// 把它转成 UniTask 接着用
	UniTask<int> uniTask = standardTask.AsUniTask();
	```
- `UniTask` -> `UniTask<AsyncUnit>`：使用`AsAsyncUnitUniTask` ，把一个“没有返回值”的任务（`void`），伪装成一个“有返回值”的任务（`T`），只不过这个返回值是一个毫无意义的空结构体 `AsyncUnit`。
	```cs
	// 原始方法，啥也不返回
	UniTask DoSomething() { ... }
	
	// 转换后，它变成了一个“返回空”的方法
	UniTask<AsyncUnit> wrapped = DoSomething().AsAsyncUnitUniTask();
	```
- `UniTask<T>` -> `UniTask`：使用`AsUniTask`，这种转换是无消耗的。
	```cs
	// 这是一个有返回值的方法
	UniTask<int> CalculateAsync() { return UniTask.FromResult(100); }
	
	// 丢弃 <int> 部分
	UniTask taskOnly = CalculateAsync().AsUniTask();
	```

## 取消异步任务

可以通过原生的[`CancellationTokenSource`](https://docs.microsoft.com/en-us/dotnet/api/system.threading.cancellationtokensource)将 CancellationToken 传递给参数：

```cs
var cts = new CancellationTokenSource();

cancelButton.onClick.AddListener(() =>
{
    cts.Cancel();
});

await UnityWebRequest.Get("http://google.co.jp")
	.SendWebRequest()
	.WithCancellation(cts.Token);

await UniTask.DelayFrame(1000, cancellationToken: cts.Token);
```

CancellationToken 可通过`CancellationTokenSource`或 MonoBehaviour 的扩展方法`GetCancellationTokenOnDestroy`来创建：

```cs
// 这个 CancellationToken 的生命周期与 GameObject 的相同
await UniTask.DelayFrame(
	1000, 
	cancellationToken: this.GetCancellationTokenOnDestroy());
```

在Unity 2022.2之后，Unity在[MonoBehaviour.destroyCancellationToken](https://docs.unity3d.com/ScriptReference/MonoBehaviour-destroyCancellationToken.html)和[Application.exitCancellationToken](https://docs.unity3d.com/ScriptReference/Application-exitCancellationToken.html)中添加了 CancellationToken。

> [!TIP]
> 对于链式取消，建议所有异步方法的最后一个参数都接受`CancellationToken cancellationToken`，并将`CancellationToken`从头传递到尾。

当检测到取消时，所有方法都会向上游抛出并传播`OperationCanceledException`。当异常（不限于`OperationCanceledException`）没有在异步方法中处理时，它将被传播到`UniTaskScheduler.UnobservedTaskException`。

- 默认情况下，将接收到的未处理异常作为一般异常写入日志。可以使用`UniTaskScheduler.UnobservedExceptionWriteLogType`更改日志级别。

- 若想对接收到未处理异常时的处理进行自定义，请为`UniTaskScheduler.UnobservedTaskException`设置一个委托。

而`OperationCanceledException`是一种特殊的异常，会被`UnobservedTaskException`无视。

如果要取消异步 UniTask 方法中的行为，请手动抛出`OperationCanceledException`：

```cs
public async UniTask<int> FooAsync()
{
    await UniTask.Yield();
    throw new OperationCanceledException();
}
```

抛出和捕获`OperationCanceledException`有点重度，如果比较在意性能开销，请使用`UniTask.SuppressCancellationThrow`以避免抛出 `OperationCanceledException`。它将返回`(bool IsCanceled, T Result)`而不是抛出异常。例如：

```cs
var (isCanceled, _) = await UniTask.DelayFrame(10, cancellationToken: cts.Token)
	.SuppressCancellationThrow();
if (isCanceled)
{
    // ...
}
```

许多 UnTask 的功能（ex: `UniTask.Yield`, `UniTask.Delay`）依赖于 Unity 的 PlayerLoop，这意味它们会在 PlayerLoop 中确定`CancellationToken`状态。 这导致当`CancellationToken`被触发时，它们不会立刻被取消。

如果要更改此行为，实现立刻取消，可将`cancelImmediately`标志设置为 `true`。

```cs
await UniTask.Yield(cancellationToken, cancelImmediately: true);
```

>[!WARNING]
>比起默认行为，设置 `cancelImmediately` 为 `true` 并检测立即取消会有更多的性能开销。 这是因为它使用了`CancellationToken.Register`；这比在 PlayerLoop 中检查 CancellationToken 更重。

## 超时机制

### 古法超时

超时是取消的一种变体。您可以通过`CancellationTokenSouce.CancelAfterSlim(TimeSpan)`设置超时并将 CancellationToken 传递给异步方法。例如：

```cs
// 创建cts
var cts = new CancellationTokenSource();
cts.CancelAfterSlim(TimeSpan.FromSeconds(5)); // 设置5s超时

// 开启异步任务
try
{
    await UnityWebRequest.Get("http://foo")
	    .SendWebRequest()
		.WithCancellation(cts.Token);
}
catch (OperationCanceledException ex)
{
    if (ex.CancellationToken == cts.Token)
        Debug.Log("已超时...");
}
```

> [!WARNING]
> `CancellationTokenSouce.CancelAfter`是一个原生的 api。但是在 Unity 中您不应该使用它，因为它依赖于线程计时器。`CancelAfterSlim`是 UniTask 的扩展方法，它使用 PlayerLoop 代替了线程计时器。

如果想要将超时 CancellationToken 配合取消 CancellationToken 一起使用，可以使用`CancellationTokenSource.CreateLinkedTokenSource`将多个 Token 链接在一起。

例如：

```cs
// --- 取消 token ---
var cancelToken = new CancellationTokenSource();
// --- 超时 token ---
var timeoutToken = new CancellationTokenSource();
timeoutToken.CancelAfterSlim(TimeSpan.FromSeconds(5));
// --- 链接 ---
var linkedTokenSource = CancellationTokenSource.CreateLinkedTokenSource(
	cancelToken.Token, 
	timeoutToken.Token);
```

### TimeoutController

为减少每次调用异步方法时用于超时的 CancellationTokenSource 的堆内存分配，您可以使用 UniTask 的`TimeoutController`进行优化：

```cs
// 提前创建好，以便复用
TimeoutController timeoutController = new TimeoutController(); 

async UniTask FooAsync() 
{
	try 
	{
		await UnityWebRequest.Get("http://foo")
			.SendWebRequest()
			.WithCancellation(timeoutController.Timeout(TimeSpan.FromSeconds(5)));
        
        // 当 await 完成后调用 Reset（停止超时计时器，并准备下一次复用）
        timeoutController.Reset(); 
	}
	catch (OperationCanceledException ex)
	{
		if (timeoutController.IsTimeout())
			UnityEngine.Debug.Log("已超时");
	}
}
```

如果想将超时结合其他取消源一起使用，需使用`new TimeoutController(CancellationToken)`：

```cs
TimeoutController timeoutController;
CancellationTokenSource clickCancelSource;

void Start()
{
    this.clickCancelSource = new CancellationTokenSource();
    this.timeoutController = new TimeoutController(clickCancelSource);
}
```

> [!WARNING]
> UniTask 还有`.Timeout`，`.TimeoutWithoutException`方法，但如果可以的话，尽量不要使用这些方法，请传递`CancellationToken`。这些方法不会实际停止这些任务，只是让调用者不再等待它们，所以仍然会有执行任务的开销。
## 获取任务进度

一些 Unity 的异步操作具有`ToUniTask(IProgress<float> progress = null, ...)`的扩展方法。

使用 `Cysharp.Threading.Tasks.Progress` 来创建无需堆内存的 Progress。这个 Progress 工厂类有两个方法：`Create`和`CreateOnlyValueChanged`。`CreateOnlyValueChanged`仅在进度值更新时调用。

为调用者实现 IProgress 接口会更好，这样不会因使用 lambda 而产生堆内存分配：

```cs
public class Foo : MonoBehaviour, IProgress<float>
{
    public void Report(float value)
    {
        UnityEngine.Debug.Log(value);
    }

    public async UniTaskVoid WebRequest()
    {
        var request = await UnityWebRequest.Get("http://google.co.jp")
            .SendWebRequest()
            .ToUniTask(progress: this);
    }
}
```

 UniTask 对于 `IProgress` 的实现很简单且极致（零 gc），它相信你的操作（ex: `Addressable`）是在主线程的。对于`Addressable`等原生异步，`ToUniTask`通过在主线程轮询的方式安全地触发 `Report`。但当你真的跑到后台线程时（ex: `UniTask.SwitchToThreadPool()`），再尝试更新 UI 时就会报错，此时可以退而求其次考虑使用 .NET 原装的 `System.Progress` 或者尝试自己去轮询。
## PlayerLoop

UniTask 运行在自定义的[PlayerLoop](https://docs.unity3d.com/ScriptReference/LowLevel.PlayerLoop.html)中。UniTask 中基于 PlayerLoop 的方法（如`Delay`、`DelayFrame`、`asyncOperation.ToUniTask`等）接受这个`PlayerLoopTiming`。

```cs
public enum PlayerLoopTiming
{
    Initialization = 0,
    LastInitialization = 1,

    EarlyUpdate = 2,
    LastEarlyUpdate = 3,

    FixedUpdate = 4,
    LastFixedUpdate = 5,

    PreUpdate = 6,
    LastPreUpdate = 7,

    Update = 8,
    LastUpdate = 9,

    PreLateUpdate = 10,
    LastPreLateUpdate = 11,

    PostLateUpdate = 12,
    LastPostLateUpdate = 13
    
#if UNITY_2020_2_OR_NEWER
    TimeUpdate = 14,
    LastTimeUpdate = 15,
#endif
}
```

它表明了异步任务会在哪个时机运行，您可以查阅[PlayerLoopList.md](https://gist.github.com/neuecc/bc3a1cfd4d74501ad057e49efcd7bdae)以了解 Unity 的默认 PlayerLoop 以及注入的 UniTask 的自定义循环。

在 Unity 2023.1或更高的版本中，`await UniTask.WaitForEndOfFrame();`不再需要 MonoBehaviour。因为它使用了`UnityEngine.Awaitable.EndOfFrameAsync`。

> 这一章有些复杂而且感觉不是太关键，我先跳了 >_<。

## `async void` 与 `async UniTaskVoid`

`async void`是一个原生的 C# 任务系统，因此它不在 UniTask 系统上运行。也最好不要使用它。

`async UniTaskVoid`是`async UniTask`的轻量级版本，专门用于不需要等待（一发即忘）的任务。当其抛出异常时，会向`UniTaskScheduler.UnobservedTaskException`报告错误并输出到 Console 上，所以不用担心异常会摧毁整个程序。不过要解除警告，您需要在尾部添加`Forget()`。

ex:

```cs
public async UniTaskVoid FireAndForgetMethod()
{
    // do anything...
    await UniTask.Yield();
}

public void Caller()
{
    FireAndForgetMethod().Forget();
}
```

UniTask 也有`Forget`方法，与`UniTaskVoid`类似且效果相同。如果您完全不需要使用`await`，那么使用`UniTaskVoid`会更高效。

要使用注册到事件的异步 lambda，请不要使用`async void`。您可以使用`UniTask.Action` 或 `UniTask.UnityAction`来代替，这两者都通过`async UniTaskVoid` lambda 来创建委托。

```cs
Action actEvent;
UnityAction unityEvent; // UGUI 特供

// 这样是不好的: async void
actEvent += async () => { };
unityEvent += async () => { };

// 这样是可以的: 通过 lamada 创建 Action
actEvent += UniTask.Action(async () => { await UniTask.Yield(); });
unityEvent += UniTask.UnityAction(async () => { await UniTask.Yield(); });
```

`UniTaskVoid`也可以用在 MonoBehaviour 的`Start`方法中。

```cs
class Sample : MonoBehaviour
{
    async UniTaskVoid Start()
    {
        // 异步初始化代码。
    }
}
```

## UniTaskTracker

对于检查（泄露的）UniTasks 很有用。您可以在`Window -> UniTask Tracker`中打开跟踪器窗口。

- Enable AutoReload(Toggle) - 自动重新加载。
- Reload - 重新加载视图（重新扫描内存中UniTask实例，并刷新界面）。
- GC.Collect - 调用 GC.Collect。
- Enable Tracking(Toggle) - 开始跟踪异步/等待 UniTask。性能影响：低。
- Enable StackTrace(Toggle) - 在任务启动时捕获 StackTrace。性能影响：高。

UniTaskTracker 仅用于调试用途，因为启用跟踪和捕获堆栈跟踪很有用，但会对性能产生重大影响。推荐的用法是只在查找任务泄漏时启用跟踪和堆栈跟踪，并在使用完毕后禁用它们。

## 外部拓展

默认情况下，UniTask 支持：

- TextMeshPro（`BindTo(TMP_Text)`和像原生 uGUI `InputField` 那样的事件扩展，如`TMP_InputField`）
- OTween（`Tween`作为可等待的）
- Addressables（`AsyncOperationHandle`和`AsyncOperationHandle<T>`作为可等待的）

它们被定义在了如`UniTask.TextMeshPro`，`UniTask.DOTween`，`UniTask.Addressables`等单独的 asmdef文件中。

从包管理器中导入软件包时，会自动启用对 TextMeshPro 和 Addressables 的支持。 但对于 DOTween 的支持，则需要从 DOTWeen assets 中导入并定义脚本定义符号`UNITASK_DOTWEEN_SUPPORT`后才能启用。

```cs
// 动画序列
await transform.DOMoveX(2, 10);
await transform.DOMoveZ(5, 20);

// 并行，并传递 cancellation 用于取消
var ct = this.GetCancellationTokenOnDestroy();

await UniTask.WhenAll(
    transform.DOMoveX(10, 3).WithCancellation(ct),
    transform.DOScale(10, 3).WithCancellation(ct));
```

> 不细说，这啥啥我都还不会呢。

## AsyncEnumerable 和 Async LINQ

在异步时代，你有了除 `void Update()` 之外的第二种选择来写每帧逻辑：

```cs
// Unity 2020.2，C# 8.0
// EveryUpdate() 的返回类型为 IUniTaskAsyncEnumerable<T>
await foreach (var _ in UniTaskAsyncEnumerable.EveryUpdate().WithCancellation(token))
{
    Debug.Log("Update() " + Time.frameCount);
}
```

`UniTask.WhenEach`类似于 .NET 9 的`Task.WhenEach`，它可以使用新的方式来等待多个任务。

`WhenEach` 所返回的类型 `IUniTaskAsyncEnumerable<WhenEachResult<T>>`，其中`WhenEachResult<T>`包含两个特殊属性：

- `T Result`：代表成功执行时的结果
- `Exception Exception`：代表执行失败所抛出的异常

您可以检查`IsCompletedSuccessfully`或`IsFaulted`以确定任务的执行情况。

```cs
await foreach (var result in UniTask.WhenEach(task1, task2, task3))
{
   if (result.IsCompletedSuccessfully) 
   { 
	   Debug.Log($"成功: {result.Result}"); 
   } 
   else if (result.IsFaulted) 
   {
	   // 哪怕这个任务失败了，循环还会继续，等待下一个任务完成 
	   Debug.LogError($"失败: {result.Exception}"); 
   }
}
```

如果希望在 `IsCompletedSuccessfully` 时获取结果，在 `IsFaulted` 时直接抛出异常，可以使用 `GetResult()`。如果任务失败，`GetResult()`方法会自动抛出异常。

`UniTaskAsyncEnumerable` 实现了异步 LINQ，类似于 LINQ 的`IEnumerable<T>`或 Rx 的 `IObservable<T>`。所有标准 LINQ 查询运算符都可以应用于异步流。

ex:

```cs
// 以下代码展示了如何将 Where 过滤器应用于每两次单击运行一次的按钮点击异步流

// 获取这个流
var stream = okButton.OnClickAsAsyncEnumerable().Where((x, i) => i % 2 == 0);

await foreach (var _ in stream)
{
    Debug.Log("点中了（偶数次）！");
}
// 只有当流结束了（比如按钮销毁了），才会运行到这里

// --- 简化，本质就是上述步骤的包装 ---
await okButton.OnClickAsAsyncEnumerable()
	.Where((x, i) => i % 2 == 0)
	.ForEachAsync(_ =>
{
	// ...
});
```

> [!CAUTION]
> 无论你用 `await foreach` 还是 `ForEachAsync`，请多留意开头的 **`await`**。`UniTaskAsyncEnumerable` 通常是**无限流**，这意味着：**`await` 下方的代码，可能永远不会执行。**
> 
> 如果你不希望它卡住主流程（即发即弃），请不要用 `ForEachAsync` + `await`，而是使用 `Subscribe`或者不 await（但这需要小心异常管理）。

一发即忘（Fire and Forget）风格（例如，事件处理），您也可以使用`Subscribe`：

```cs
okButton.OnClickAsAsyncEnumerable().Subscribe(_ =>
{
	// ...
});
```

::: details
在引入`using Cysharp.Threading.Tasks.Linq;`后，异步 LINQ 将被启用，并且`UniTaskAsyncEnumerable`在 asmdef 文件`UniTask.Linq`中定义。

- `UniTaskAsyncEnumerable`是类似`Enumerable`的入口点。除了标准查询操作符之外，还为 Unity 提供了其他生成器，例如：

`EveryUpdate`、`Timer`、`TimerFrame`、`Interval`、
	`IntervalFrame`和`EveryValueChanged`

- 此外，还添加了 UniTask 原生的查询操作符，如：

`Append`，`Prepend`，`DistinctUntilChanged`，`ToHashSet`，`Buffer`，`CombineLatest`，`Do`，`Never`，`ForEachAsync`，`Pairwise`，`Publish`，`Queue`，`Return`，`SkipUntil`，`TakeUntil`，`SkipUntilCanceled`，`TakeUntilCanceled`，`TakeLast`，`Subscribe`
:::

以 `Func` 作为参数的方法具有三个版本，另外两个是`***Await`和`***AwaitWithCancellation`。如果在 func 内部使用`async`方法，请使用`***Await`或`***AwaitWithCancellation`。

以 `Select` 为例:

```cs
Select(Func<T, TR> selector)
SelectAwait(Func<T, UniTask<TR>> selector)
SelectAwaitWithCancellation(Func<T, CancellationToken, UniTask<TR>> selector)
```


如何创建异步迭代器：

C# 8.0 支持异步迭代器（`async yield return`），但它只允许`IAsyncEnumerable<T>`。UniTask 支持使用`UniTaskAsyncEnumerable.Create`方法来创建自定义异步迭代器。

```CS
// IAsyncEnumerable，C# 8.0 异步迭代器。
// 请不要这样使用，因为 IAsyncEnumerable 不被 UniTask 所控制
public async IAsyncEnumerable<int> MyEveryUpdate([EnumeratorCancellation]CancellationToken cancelationToken = default)
{
    var frameCount = 0;
    await UniTask.Yield();
    while (!token.IsCancellationRequested)
    {
        yield return frameCount++;
        await UniTask.Yield();
    }
}

// UniTaskAsyncEnumerable.Create 
// 用 `await writer.YieldAsync` 代替 `yield return`.
public IUniTaskAsyncEnumerable<int> MyEveryUpdate()
{
    // writer(IAsyncWriter<T>) 有 `YieldAsync(value)` 方法。
    return UniTaskAsyncEnumerable.Create<int>(async (writer, token) =>
    {
        var frameCount = 0;
        await UniTask.Yield();
        while (!token.IsCancellationRequested)
        {
            await writer.YieldAsync(frameCount++); // 代替 `yield return`
            await UniTask.Yield();
        }
    });
}
```

## 可等待事件

所有 uGUI 组件都实现了`***AsAsyncEnumerable`，以实现对事件的异步流的转换。

ex:

```cs
async UniTask TripleClick()
{
    // 默认情况下，使用了button.GetCancellationTokenOnDestroy 来管理异步生命周期
    await button.OnClickAsync();
    await button.OnClickAsync();
    await button.OnClickAsync();
    Debug.Log("Three times clicked");
    //性能略差：
	// 每次调用 `OnClickAsync()` 实际上都会在该帧内部注册一个新的监听器，用完销毁。
}

// 更高效的方法
async UniTask TripleClick()
{
    using (var handler = button.GetAsyncClickEventHandler())
    {
        await handler.OnClickAsync();
        await handler.OnClickAsync();
        await handler.OnClickAsync();
        Debug.Log("Three times clicked");
    }
}

// 使用异步 LINQ
async UniTask TripleClick(CancellationToken token)
{
    await button.OnClickAsAsyncEnumerable().Take(3).Last();
    Debug.Log("Three times clicked");
}

// 使用异步 LINQ
async UniTask TripleClick(CancellationToken token)
{
    await button.OnClickAsAsyncEnumerable().Take(3).ForEachAsync(_ =>
    {
        Debug.Log("Every clicked");
    });
    Debug.Log("Three times clicked, complete.");
}
```

所有 MonoBehaviour 消息事件均可通过`AsyncTriggers`转换成异步流，`AsyncTriggers`可以使用`GetAsync***Trigger`来创建，并将它作为 UniTaskAsyncEnumerable 来触发。

支持的事件例如：
- 生命周期：`GetAsyncUpdateTrigger`, `GetAsyncStartTrigger`, `GetAsyncOnDestroyTrigger`...
- 物理：`GetAsyncCollisionEnterTrigger`, `GetAsyncTriggerEnterTrigger`...
- UI/鼠标：`GetAsyncPointerClickTrigger`, `GetAsyncDragTrigger`...
- 动画：`GetAsyncAnimatorMoveTrigger`...

```cs
// 类似于 handler
// 获取碰撞事件的监听器 (Handler)
var trigger = this.GetOnCollisionEnterAsyncHandler();
await trigger.OnCollisionEnterAsync(); 
await trigger.OnCollisionEnterAsync(); 
await trigger.OnCollisionEnterAsync();
Debug.Log("第3次撞到了");

// -- 转化为异步流 ---
await this.GetAsyncMoveTrigger().ForEachAsync(axisEventData => 
{ 
	// 每次触发 OnMove，都会执行这里
	Debug.Log($"正在移动: {axisEventData.moveVector}"); 
});
```

**AsyncReactiveProperty** 是 UniTask 提供的一种“会报警的变量”：
- **响应式变量 (`AsyncReactiveProperty<int>`)**：值一旦改变，就会自动通知所有关注它的人（比如 UI 组件、监听函数）。 
- **特性**：它本质上是一个异步流 (`IUniTaskAsyncEnumerable`)，所以可以使用 `ForEachAsync`、`Where` 等 LINQ 操作符来处理它的变化。

```cs
// 用于演示绑定的 UI 组件
public Text textComponent; 

async UniTaskVoid Start()
{
	// --- A. 创建 ---
	// 创建一个初始值为 99 的响应式变量
	var rp = new AsyncReactiveProperty<int>(99);

	// --- B. 监听 (订阅变化) ---
	// 就像监听按钮点击一样，持续监听这个变量的变化
	rp.ForEachAsync(x => 
	{
		Debug.Log($"收到新值: {x}");
	}, this.GetCancellationTokenOnDestroy()).Forget();

	// --- C. 修改值 ---
	// 这里的赋值操作不仅仅是改变数据，还会触发上面的 ForEachAsync
	rp.Value = 10; // 控制台打印: 10
	rp.Value = 11; // 控制台打印: 11

	// --- D. 自动绑定 UI (核心功能) ---
	// BindTo 是一个扩展方法，把变量的值直和 UI 组件绑定
	// 当 rp.Value 变了，textComponent.text 也会自动跟着变
	// WithoutCurrent()：忽略初始值，此处是99
	rp.WithoutCurrent().BindTo(this.textComponent);

	// --- E. 异步等待 ---
	// 这行代码会卡住，直到 rp.Value 再次发生变化才会往下走
	await rp.WaitAsync(); 
	Debug.Log("变量又变了一次，等待结束");

	// --- F. 组合与只读 ---
	var rp2 = new AsyncReactiveProperty<int>(100);
	
	// CombineLatest(rp1, pr2) ：把 rp1 和 rp2 捏在一起看
	// 只要 rp1 或 rp2 任意一个变了，就会触发后面的逻辑： ((x, y) => (x, y))
	// ToReadOnly... 把它转换成一个只读变量，防止外部随意修改
	var rorp = rp.CombineLatest(rp2, (x, y) => (x, y))
				 .ToReadOnlyAsyncReactiveProperty(CancellationToken.None);
}
```

UniTask 的异步流默认是**拉取模式”(Pull-based)**。这意味着：只有当前一个异步任务完全执行完毕后，才会去处理下一个事件。

如果事件触发的频率高于处理速度（例如用户点击按钮速度快于代码处理按钮响应逻辑的速度），会导致以下三种不同的结果：

**1. 默认模式：阻塞并丢弃（防连点）**

如果前一次点击的逻辑（如 3 秒延迟）还没跑完，后续的点击会被直接忽略和丢弃，不会触发任何逻辑。

- 适用场景：防止按钮被重复点击（防连点）。
    
- 缺点：如果需要记录每一次操作（如输入密码），会导致数据丢失。

```cs
// 【串行阻塞】
// 如果你在 3 秒内连续点击 5 次：
// 第 1 次：被执行。
// 第 2~5 次：在前 3 秒内发生的点击会被直接丢弃，没有任何反应。
await button.OnClickAsAsyncEnumerable().ForEachAwaitAsync(async x =>
{
    await UniTask.Delay(TimeSpan.FromSeconds(3));
});
```

**2. 排队模式：缓存并顺序执行**

使用 `.Queue()` 方法可以在内存中创建一个缓冲区。

当正在处理前一个任务时，后续的点击不会丢失，而是**在队列中排队**，等前一个完成后按顺序执行。

```cs
// 【串行排队】
// 如果你在 3 秒内连续点击 5 次：
// 所有 5 次点击都会被记录。
// 它们会一个接一个地执行，总共耗时 15 秒（3秒 x 5次）。
await button.OnClickAsAsyncEnumerable().Queue().ForEachAwaitAsync(async x =>
{
    await UniTask.Delay(TimeSpan.FromSeconds(3));
});
```

**3. 并发模式：一发即忘（互不阻塞）**

使用 `.Subscribe()` 方法。

它不会等待当前任务完成，而是每次点击都**立即启动一个新的独立任务**。

```cs
// 【并行处理】
// 如果你在 3 秒内连续点击 5 次：
// 5 个任务几乎同时启动。
// 它们各自运行 3 秒，互不干扰，几乎同时结束。
button.OnClickAsAsyncEnumerable().Subscribe(async x =>
{
    await UniTask.Delay(TimeSpan.FromSeconds(3));
});
```

## Channel

Channel 是一个支持 `await` 的高性能队列，其行为与 Go 语言的 Channel 类似。它本质是 .NET 原生 `System.Threading.Channels` 的 Unity 特供优化版。

- **特点**：
    
    - **多生产者 (Multi-Producer)**：允许任意数量的地方同时往里写数据（线程安全）。
        
    - **单消费者 (Single-Consumer)**：默认情况下，**只允许一个**地方去读取数据。
        
    - **无界 (Unbounded)**：容量没有限制，如果不及时取出，内存会一直增加。

**基础操作**

- **创建**：使用 UniTask 提供的工厂方法 `Channel.CreateSingleConsumerUnbounded<T>()`。
    
- **写入 (Writer)**：
    
    - `TryWrite(item)`：往通道里推送一个数据。
        
    - `TryComplete()`：关闭通道。
	
- **读取 (Reader)**：
    
    - `ReadAllAsync()`：将通道转换为 `IUniTaskAsyncEnumerable`（异步流）。这意味着你可以直接配合 `await foreach` 或 LINQ (`Where`, `Select`) 使用。

```cs
public class AsyncMessageBroker<T> : IDisposable
{
    // 1. 原始通道（负责接收，1对1）
    Channel<T> channel;

    // 2. 多播源（负责分发，1对多）
    // IConnectable... 代表这是一个“需要插电”的热流
    IConnectableUniTaskAsyncEnumerable<T> multicastSource;
    
    // 3. 连接句柄（电源插头）
    IDisposable connection;

    public AsyncMessageBroker()
    {
        // 创建原始通道
        channel = Channel.CreateSingleConsumerUnbounded<T>();

        // 【关键步骤】
        // .Publish(): 把单消费者通道转换成多消费者广播
        // .Connect(): 正式启动广播（相当于插上电源），开始从 Channel 吸取数据
        multicastSource = channel.Reader.ReadAllAsync().Publish();
        connection = multicastSource.Connect(); 
    }

    // --- 发送端 ---
    // 外部调用此方法发送消息，只需往原始通道里扔
    public void Publish(T value)
    {
        channel.Writer.TryWrite(value);
    }

    // --- 接收端 ---
    // 外部调用此方法来订阅
    // 返回 IUniTaskAsyncEnumerable，让使用者可以用 .ForEachAsync 或 LINQ 来处理
    public IUniTaskAsyncEnumerable<T> Subscribe()
    {
        return multicastSource;
    }

    // --- 资源清理 ---
    public void Dispose()
    {
        channel.Writer.TryComplete(); // 关闭通道入口
        connection.Dispose();         // 断开广播连接
    }
}
```

只有在消息发送“之前”就已经订阅（Subscribe）的人，才能收到早发送的消息。对于“迟到”的家伙，只能收到以后发送的新消息，旧消息便全然错过了。

## IEnumerator.ToUniTask 的限制

您可以将协程（IEnumerator）转换为 UniTask（或直接 await），但它有一些限制。

- 不支持`WaitForEndOfFrame`，`WaitForFixedUpdate`，`Coroutine`
- 生命周期与`StartCoroutine`不一样，它使用指定的`PlayerLoopTiming`，并且默认情况下，`PlayerLoopTiming.Update`在 MonoBehaviour 的`Update`和`StartCoroutine`的循环之前执行。

如果您想要实现从协程到异步的完全兼容转换，请使用`IEnumerator.ToUniTask(MonoBehaviour coroutineRunner)`重载。它会在传入的 MonoBehaviour 实例中执行 StartCoroutine 并在 UniTask 中等待它完成。

## 单元测试

> 后续基本都直接引用 github 上[README_CN.md](https://github.com/Cysharp/UniTask/blob/master/README_CN.md#%E4%B8%8E-awaitable-%E5%AF%B9%E6%AF%94)了

Unity 的`[UnityTest]`属性可以测试协程（IEnumerator）但不能测试异步。`UniTask.ToCoroutine`将 async/await 桥接到协程，以便您可以测试异步方法。

```cs
[UnityTest]
public IEnumerator DelayIgnore() => UniTask.ToCoroutine(async () =>
{
	// ...
});
```

UniTask 自身的单元测试是使用 Unity Test Runner 和[Cysharp/RuntimeUnitTestToolkit](https://github.com/Cysharp/RuntimeUnitTestToolkit)编写的，以集成到 CI 中并检查 IL2CPP 是否正常工作。

## 线程池的限制

大多数 UniTask 方法在单个线程 (PlayerLoop) 上运行，只有`UniTask.Run`（等同于`Task.Run`）和`UniTask.SwitchToThreadPool`在线程池上运行。如果您使用线程池，它将无法与 WebGL 等平台兼容。

`UniTask.Run`现在已弃用。您可以改用`UniTask.RunOnThreadPool`。并且还要考虑是否可以使用`UniTask.Create`或`UniTask.Void`。

## 关于 UnityEditor

UniTask 可以像编辑器协程一样在 Unity 编辑器上运行。但它有一些限制。

- UniTask.Delay 的 DelayType.DeltaTime、UnscaledDeltaTime 无法正常工作，因为它们无法在编辑器中获取 deltaTime。因此在 EditMode 下运行时，会自动将 DelayType 更改为能等待正确的时间的`DelayType.Realtime`。
- 所有 PlayerLoopTiming 都在`EditorApplication.update`生命周期上运行。
- 带`-quit`的`-batchmode`不起作用，因为 Unity 不会执行 `EditorApplication.update` 并在一帧后退出。因此，不要使用`-quit`并使用`EditorApplication.Exit(0)`手动退出。

## 与 Awaitable 对比

"Unity 6 引入了可等待类型[Awaitable](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Awaitable.html)。简而言之，Awaitable 可以被认为是 UniTask 的一个子集，并且事实上，Awaitable的设计也受 UniTask 的影响。它应该能够处理基于 PlayerLoop 的 await，池化 Task，以及支持以类似的方式使用`CancellationToken`进行取消。随着它被包含在标准库中，您可能想知道是继续使用 UniTask 还是迁移到 Awaitable。以下是简要指南。

首先，Awaitable 提供的功能与协程提供的功能相同。使用 await 代替`yield return`；`await NextFrameAsync()`代替`yield return null`；`WaitForSeconds`和`EndOfFrame`等价。然而，这只是两者之间的差异。就功能而言，它是基于协程的，缺乏基于 Task 的特性。在使用 async/await 的实际应用程序开发中，像`WhenAll`这样的操作是必不可少的。此外，UniTask 支持许多基于帧的操作（如`DelayFrame`）和更灵活的 PlayerLoopTiming 控制，这些在 Awaitable 中是不可用的。当然，它也没有跟踪器窗口。

因此，我推荐在应用程序开发中使用 UniTask。UniTask 是 Awaitable 的超集，并包含了许多基本特性。对于库开发，如果您希望避免外部依赖，可以使用 Awaitable 作为方法的返回类型。因为 Awaitable 可以使用`AsUniTask`转换为 UniTask，所以支持在 UniTask 库中处理基于 Awaitable 的功能。即便是在库开发中，如果您不需要担心依赖关系，使用 UniTask 也会是您的最佳选择。"



## 与原生 Task API 对比

UniTask 有许多原生的类Task API。此表展示了两者相对应的 API。

使用原生类型。

|.NET 类型|UniTask 类型|
|---|---|
|`IProgress<T>`|---|
|`CancellationToken`|---|
|`CancellationTokenSource`|---|

使用 UniTask 类型。

|.NET 类型|UniTask 类型|
|---|---|
|`Task`/`ValueTask`|`UniTask`|
|`Task<T>`/`ValueTask<T>`|`UniTask<T>`|
|`async void`|`async UniTaskVoid`|
|`+= async () => { }`|`UniTask.Void`, `UniTask.Action`, `UniTask.UnityAction`|
|---|`UniTaskCompletionSource`|
|`TaskCompletionSource<T>`|`UniTaskCompletionSource<T>`/`AutoResetUniTaskCompletionSource<T>`|
|`ManualResetValueTaskSourceCore<T>`|`UniTaskCompletionSourceCore<T>`|
|`IValueTaskSource`|`IUniTaskSource`|
|`IValueTaskSource<T>`|`IUniTaskSource<T>`|
|`ValueTask.IsCompleted`|`UniTask.Status.IsCompleted()`|
|`ValueTask<T>.IsCompleted`|`UniTask<T>.Status.IsCompleted()`|
|`new Progress<T>`|`Progress.Create<T>`|
|`CancellationToken.Register(UnsafeRegister)`|`CancellationToken.RegisterWithoutCaptureExecutionContext`|
|`CancellationTokenSource.CancelAfter`|`CancellationTokenSource.CancelAfterSlim`|
|`Channel.CreateUnbounded<T>(false){ SingleReader = true }`|`Channel.CreateSingleConsumerUnbounded<T>`|
|`IAsyncEnumerable<T>`|`IUniTaskAsyncEnumerable<T>`|
|`IAsyncEnumerator<T>`|`IUniTaskAsyncEnumerator<T>`|
|`IAsyncDisposable`|`IUniTaskAsyncDisposable`|
|`Task.Delay`|`UniTask.Delay`|
|`Task.Yield`|`UniTask.Yield`|
|`Task.Run`|`UniTask.RunOnThreadPool`|
|`Task.WhenAll`|`UniTask.WhenAll`|
|`Task.WhenAny`|`UniTask.WhenAny`|
|`Task.WhenEach`|`UniTask.WhenEach`|
|`Task.CompletedTask`|`UniTask.CompletedTask`|
|`Task.FromException`|`UniTask.FromException`|
|`Task.FromResult`|`UniTask.FromResult`|
|`Task.FromCanceled`|`UniTask.FromCanceled`|
|`Task.ContinueWith`|`UniTask.ContinueWith`|
|`TaskScheduler.UnobservedTaskException`|`UniTaskScheduler.UnobservedTaskException`|

## 对象池配置

UniTask 为了极致性能，内部实现了一个对象池（TaskPool）：

- 当任务创建时，从池中取出一个旧对象复用。
    
- 当任务完成时，将对象重置并放回池中。

UniTask 默认会**缓存所有**生成的异步对象（无限容量）。这意味着如果有瞬间的高并发，池子的容量就会急剧膨胀，并且不会自动缩小。意味着这种策略虽然通过减少 gc 节省了 CPU，但可能会占用过多的内存。

**A. 监控池子状态 (Debug)** 如果在性能分析时发现内存占用过高，可以使用此方法查看池子中当前“闲置”的对象数量。

```cs
// 遍历并打印当前池中缓存的对象类型和数量
foreach (var (type, size) in TaskPool.GetCacheSizeInfo())
{
    // type: 任务类型 (如 UniTask.DelayPromise)
    // size: 当前缓存的数量
    Debug.Log($"对象类型: {type}, 缓存数量: {size}");
}
```

**B. 限制池子大小 (Optimization)** 如果你的游戏内存非常紧张，可以手动设置每种任务类型的最大缓存数量。超出限制的对象会被直接销毁，而不是放入池中。

```cs
// 在游戏启动时配置
void Start()
{
    // 将最大缓存数限制为 100 个
    // 意味着：第 101 个并发任务结束后，会被直接销毁（产生 GC），不再回收
    TaskPool.SetMaxPoolSize(100);
}
```

> [!TIP]
> - **一般情况**：使用默认配置即可，UniTask 的内存开销通常是可以接受的。
> - **什么时候才是特殊情况**：只有在内存极度受限，或者检测到内存泄漏时，才需要使用 `SetMaxPoolSize` 进行限制。

