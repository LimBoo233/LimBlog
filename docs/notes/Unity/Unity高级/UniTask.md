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
>比起默认行为，设置 `cancelImmediately` 为 `true` 并检测立即取消会有更多的性能开销。 这是因为它使用了`CancellationToken.Register`；这比在 PlayerLoop 中检查 CancellationToken 更重度。