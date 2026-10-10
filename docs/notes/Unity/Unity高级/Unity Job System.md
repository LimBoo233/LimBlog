
# Unity Job System

Unity 的作业系统允许您创建多线程代码，从而让应用程序使用所有可用的 CPU 核心，提高性能。

- 为了提高性能，还可使用专为 Unity 的作业系统编译作业而设计 [Burst 编译器](https://docs.unity3d.com/Packages/com.unity.burst@latest/)。Burst 编译器改进了代码生成，从而提高了性能，并减少了移动设备的电池消耗。

- 您还可以让作业系统搭配 Unity 的[实体组件系统](https://docs.unity3d.com/Packages/com.unity.entities@latest/) 使用，从而创建高性能的面向数据的代码。

为了多线程下读写的安全、竞态问题，作业系统会向每项作业分别发送其操作所需的数据副本，而不是对主线程中的数据进行引用。这种副本可以隔离数据。但这也导致作业只能访问 [blittable 数据类型](https://en.wikipedia.org/wiki/Blittable_types)。它们在托管代码和原生代码之间传递时不需要进行转换。

## Job

### 概念

作业是特定任务的一个小工作单位。作业会接收参数并对数据进行操作，其行为方式类似于方法调用。作业可以是独立的，也可能要依赖其他作业的完成。在 Unity 中，作业是指任何实现 [`IJob` 接口](https://docs.unity3d.com/cn/current/ScriptReference/Unity.Jobs.IJob.html)的结构体。

仅主线程可以调度并完成作业。

- [IJob](https://docs.unity3d.com/cn/current/ScriptReference/Unity.Jobs.IJob.html)：在作业线程上运行单个任务。
- [IJobParallelFor](https://docs.unity3d.com/cn/current/ScriptReference/Unity.Jobs.IJobParallelFor.html)：自动将任务拆分给多个 worker，多线程并行执行。运行的每个工作线程都有一个排他性的索引，用于安全访问作业线程之间共享的数据。
- [IJobParallelForTransform](https://docs.unity3d.com/cn/current/ScriptReference/Jobs.IJobParallelForTransform.html)：并行运行单个任务。并行运行的每个工作线程都有一个来自变换层级的排他性变换可供操作。
- [IJobFor](https://docs.unity3d.com/cn/current/ScriptReference/Unity.Jobs.IJobFor.html)：与 `IJobParallelFor` 相同，但可以让您调度作业以避免并行运行。

### 创建

要创建并成功运行作业，您必须执行以下步骤：

- 创建作业：实现 [`IJob`](https://docs.unity3d.com/cn/current/ScriptReference/Unity.Jobs.IJob.html) 接口。
- 调度作业：对作业调用 [`Schedule`](https://docs.unity3d.com/cn/current/ScriptReference/Unity.Jobs.IJobExtensions.Schedule.html) 方法。
- 等待作业完成：如果作业早已完成，则会立即返回，当需要访问数据时，可以对作业调用 [`Complete`](https://docs.unity3d.com/cn/current/ScriptReference/Unity.Jobs.JobHandle.Complete.html) 方法。

使用 `IJob` 的实现即可调度与正在运行的其他作业并行运行的单个作业。

`IJob` 拥有一个必需的方法 [`Execute`](https://docs.unity3d.com/cn/current/ScriptReference/Unity.Jobs.IJob.Execute.html)。只要[工作线程](https://docs.unity3d.com/cn/current/Manual/job-system-overview.html#multithreading)运行作业，Unity 就会调用此方法。创建作业时，还可以为其创建 [`JobHandle`](https://docs.unity3d.com/cn/current/ScriptReference/Unity.Jobs.JobHandle.html)，以供其他方法引用该作业时使用。

> [!DANGER]
> 没有任何保护措施可以防止从作业内部访问非只读或可变静态数据。访问此类数据会绕过所有安全系统，并可能导致应用程序或 Unity 编辑器崩溃。

Unity 运行时，作业系统会创建被调度作业数据的副本，从而防止会有一个以上的线程读取或写入相同的数据。作业完成后，只能访问写入 `NativeContainer` 的数据。这是因为作业使用的 `NativeContainer` 副本和原始 `NativeContainer` 对象都指向同一内存。

### 运行

调用 `Schedule`。这会将作业放入作业队列中，作业系统会在作业的所有[依赖项](https://docs.unity3d.com/cn/current/Manual/job-system-job-dependencies.html)（如果有）完成后开始执行作业。一旦被调度就不能中断作业。只能从主线程调用 `Schedule`。

> [!TIP]
> 作业有一个 [`Run`](https://docs.unity3d.com/cn/current/ScriptReference/Unity.Jobs.IJobExtensions.Run.html) 方法，可以使用此方法代替 `Schedule` 在主线程上立即执行作业。可将此方法用于调试。

调用 `Schedule` 且作业系统执行作业后，即可对 `JobHandle` 调用 [`Complete`](https://docs.unity3d.com/cn/current/ScriptReference/Unity.Jobs.JobHandle.Complete.html) 方法以访问作业中的数据。调用 `Complete` 时，主线程可以安全访问作业之前所使用的 [`NativeContainer`](https://docs.unity3d.com/cn/current/Manual/job-system-native-container.html) 实例。调用 `Complete` 也会清除安全系统中的状态。不这样做会引发内存泄漏。

最佳实践是拿到作业所需的数据后就立即对作业调用 `Schedule`，并仅在需要结果时才对作业调用 `Complete`。

> [!TIP]
> 可以使用[性能分析器](https://docs.unity3d.com/cn/current/Manual/Profiler.html)查看 Unity 等待作业完成的位置。主线程上的标记 `WaitForJobGroupID` 表示了位置。此标记意味着您可能在某处引入了应处理的数据依赖项。请查找 `JobHandle.Complete` 来搜查让主线程强制等待的数据依赖项的位置。

作业启动后，该作业的工作线程就会致力于完成该作业，之后才会运行其他作业。所以如果有长作业一直占据一个线程，就困难延后后续主要任务的执行。因此，最好将长时间运行的作业拆分为[相互依赖](https://docs.unity3d.com/cn/current/Manual/job-system-job-dependencies.html)的小型作业。

**场景1**：每帧对 50,000 个敌人/粒子做简单位置更新 + 距离计算。

::: code-group

```csharp
using Unity.Jobs;
using Unity.Collections;
using Unity.Burst;
using Unity.Mathematics;   // 推荐用 math 代替 Vector3

[BurstCompile]
public struct MoveJob : IJobParallelFor
{
    public NativeArray<float3> positions;   // 输入输出
    public NativeArray<float> speeds;

    public float deltaTime;

    public void Execute(int index)
    {
        // 简单移动逻辑（可以写很复杂的计算）
        positions[index] += new float3(0, 0, 1) * speeds[index] * deltaTime;

        // 示例：边界检查
        if (positions[index].z > 100f)
            positions[index] = new float3(positions[index].x, positions[index].y, 0);
    }
}
```

```csharp
public class JobTest : MonoBehaviour
{
    private NativeArray<float3> positions;
    private NativeArray<float> speeds;
    private JobHandle currentHandle;

    void Start()
    {
        int count = 50000;

        positions = new NativeArray<float3>(count, Allocator.Persistent);
        speeds = new NativeArray<float>(count, Allocator.Persistent);

        // 初始化数据
        for (int i = 0; i < count; i++)
        {
            positions[i] = new float3(i % 100, 0, i / 100);
            speeds[i] = 5f + (i % 10);
        }
    }

    void Update()
    {
        // 1. 确保上一个 Job 完成
        currentHandle.Complete();

        // 2. 创建 Job
        var job = new MoveJob
        {
            positions = positions,
            speeds = speeds,
            deltaTime = Time.deltaTime
        };

        // 3. Schedule 并行执行
        currentHandle = job.Schedule(positions.Length, 64);  // 64 是 batchSize，调 32~128 通常最佳
    }

    void LateUpdate()
    {
        // 推荐在 LateUpdate Complete，保证渲染前数据是最新的
        currentHandle.Complete();

        // 这里可以把 positions 数据写回 Transform 或其他（但要小心性能）
    }

    void OnDestroy()
    {
        currentHandle.Complete();        // 防止内存泄漏
        positions.Dispose();
        speeds.Dispose();
    }
}
```

:::

**场景2**：如你有两个 Job，先计算速度，再移动位置。

多个依赖可以用 `JobHandle.CombineDependencies` 合并。

```csharp
public struct CalculateSpeedJob : IJobParallelFor { ... }

public struct MoveJob : IJobParallelFor { ... }

void Update()
{
    currentHandle.Complete();

    var speedJob = new CalculateSpeedJob { ... };
    JobHandle speedHandle = speedJob.Schedule(count, 64);

    var moveJob = new MoveJob
    {
        positions = positions,
        speeds = speeds,
        deltaTime = Time.deltaTime
    };

    // 建立依赖：moveJob 要等 speedJob 完成
    currentHandle = moveJob.Schedule(speedHandle, count, 64);
}
```

## 其他

- `Allocator`：用 `Persistent`（跨帧），`TempJob`（单帧内用完）。
- `batchSize`：32~128 通常最好，根据数据量调。
- 不要在 Job 里访问：`GameObject`、`Transform`、静态变量、`List`/`Dictionary` 等。
- 数据准备：主线程把数据拷到 `NativeArray`，Job 里算完再拷回来（或直接用 Native）。
- 性能查看：Deep Profile + Job System 模块看 Worker Threads。
- 常见模式：
    - 每帧 `Schedule` + `LateUpdate Complete`。
    - 长时间 Job 用 `Schedule` 后 `CompleteAsync()`（配合 UniTask/Awaitable）。
