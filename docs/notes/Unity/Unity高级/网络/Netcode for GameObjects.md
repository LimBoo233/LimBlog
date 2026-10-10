
# Netcode for GameObjects

> [!TIP]
> Unity 目前有两个联机框架，其一为 Netcode for GameObjects，为玩家数量较少、逻辑复杂度较低的游戏所设计；另一为 Netcode for Game Entities，专为大型和复杂的游戏。

## 建立联系

依赖于 `NetworkManager` 脚本。该脚本负责建立连接和处理底层数据。

该脚本需要一个 Transport，用于在网络上建立连接和传输字节。 `NetworkManager` 位于传输层顶部。

> [!NOTE]
> `PlayerPrefab` 槽位：为连接的客户端生成该预制体作为角色，留空则无。

## 辅助工具包

- Multiplayer Play Mode

	在安装 Unity 的 Multiplayer Play Mode 包后，你可以直接在编辑器里创建一个新的游戏窗口。不用每次测试都 `File -> Build And Run`。
	
	打开 `Windows -> Multiplayer -> Multiplayer Play Mode` 窗口可以创建虚拟玩家。在 Editor 进入 Play 模式时，虚拟玩家窗口中的 Game 窗口也会开始游戏。实际是为虚拟玩家创建了新的 Unity 实例。

- Multiplayer Tools

	Multiplayer Tools 包的 `RuntimeNetworkStatsMonitor`组件能检视网络状态。运行时会自动生成图形化界面。

## `NetworkManager`

`NetworkManager` 组件是 NGO 的必备组件，包含项目中所有与 netcode 相关的设置。

`DefaultNetworkPrefabs` 用来存放在网络上生成的 Prefab。会自动添加，也可自己配置。

Inspector 中看起来神秘的属性：

- `Protocal Version`：用于帮助区分不同版本，防止新版本有新资源和旧版本联机时会导致问题
- `Network Transport`：选择网络协议，当使用 client-server 模式时，slot 里需传入实现实现了 `INetworkTransport` 接口的传输协议组件，默认情况推荐 Unity Transport
- `Tick Rate`：更新频率
- `Ensure Network Variable Length Safety`：确保 Network Variable 长度安全，会导致额外性能与宽带开销
- `Connect Approval`：勾选后，客户端不能直接连进来，必须先经过服务器（或主机）的审批；只有你在代码里写了审批逻辑（ConnectionApprovalCallback），并且返回“允许连接”，客户端才能成功进入游戏。在 distributed authority 拓扑中无效
- `Force Same Prefabs`：强制客户端使用和服务器完全一致的 prefab
- `Enable Scene Management`：使用 ngo 的场景加载方法，使客户端和服务器同步加载场景.**需要异步加载场景时推荐关闭**

```cs
var status = NetworkManager.Singleton.SceneManager.LoadScene("GameScene", LoadSceneMode.Single);

if (status != SceneEventProgressStatus.Started)
{
    Debug.LogError($"场景加载失败: {status}");
}
```

## 连接

启动主机（客户端，服务器同理）：

```cs
NetworkManager.Singleton.StartHost();
```

当客户端尝试连接时，会使用 Transport 组件中的 IP 和端口。服务器需要指定在哪个地址等待：

```cs
NetworkManager.Singleton.GetComponent<UnityTransport>().SetConnectionData
(
    "127.0.0.1",  // 客户端所需服务器地址
    (ushort)12345,
    "0, 0, 0, 0"  // 作为服务器时，监听的地址
);
```

特殊鉴定地址：

- `192.168.1.100`：局域网内的 IP 地址
- `127.0.0.1`：本地回环地址
- `0.0.0.0`：监听所有可用的网络接口

如果服务器公网 ip 直接挂在网卡上（云服务器），也可以将同一个地址填入第一个和第三个参数。

> [!NOTE]
> 如果在使用部分中继服务时，可能不该使用 `SetConnectionData()` 方法。

## 断开连接

`NetworkManager.Shutdown()`

## 网络上的游戏对象

`NetworkObject` 组件用来标识要在网络上的 GameObject。参与 NGO 网络逻辑的 GameObject 需要 `NetworkObject` 组件，并配合至少一个 `NetworkBehaviour` 使用，**`NetworkObject` 本身基本不负责同步具体游戏数据**，主要负责物体的网络身份和生命周期。

其中：

| 组件                 | 作用                           |
| ------------------ | ---------------------------- |
| `NetworkObject`    | 让物体成为网络对象                    |
| `NetworkBehaviour` | 写网络逻辑，比如 RPC、NetworkVariable |
| `NetworkTransform` | 同步位置/旋转/缩放                   |
| `NetworkAnimator`  | 同步 Animator 参数/动画状态          |

且 `NetworkObject` 组件需要排在 `NetworkBehaviour` 后面。NetworkBehaviour 组件在 Inspector 视图中排列的顺序，就是每个关联的 `NetworkBehaviour.OnNetworkSpawn` 方法被调用的顺序。


> [!TIP]
> 一个 Network Object 在多个网络节点上，不是同一个物体，而是同一个网络对象在不同机器上的本地副本。生成时，`NetworkObject.GlobalObjectIdHash` 标记本体不同的副本；在本地实例化之后，每个 Network Object 都会被分配相同的 `NetworkObjectId`，用于在网络中关联各个 Network Object。

通过调用 `NetworkObject.Spawn(bool)` 生成一个由服务器同步到所有客户端的对象，布尔参数代表是否要随场景销毁。**在客户端-服务器模型下，只有服务器有权生成和销毁物体，客户端通过 RPC（远程函数调用）调用服务器上的方法。** 运行时，每个被 Spawn 的 `NetworkObject` 都会有一个网络 ID。

调用 `NetworkObject.DeSpawn(bool)` 来 despawn 物体，传入的布尔值代表为 `true` 时（默认值），物体也将被销毁。

```csharp
public override void OnDestroy()
{
    // 清理本地资源..
    // 最后调用 base.OnDestroy() 清理基类资源
    base.OnDestroy();
}
```

> [!WARNING]
> 销毁 NetworkObject 时，选择 `NetworkObject.gameObject` 而非 `NetworkBehaviour.gameObject`，因为后者可能挂载子物体上。


## Ownership

通过给予客户端某游戏物体的 ownership，客户端能够自己控制游戏的一部分，相当于分到了部分 authority。例如，客户端可以自己控制角色的移动避免延迟，同时服务器保持作为游戏权威（具有最终决定权）。

当一个功能由它的 **Owner（所有者）** 来控制时，我们称之为 **所有者权威（Owner Authoritative）**。

在不同的网路拓扑中，Ownership 表现略有不同。在 Client-Server 结构中，服务器默认具有所有的 authority，客户端必须发请求给服务器让服务器代劳，注定会有延迟。成为物体的 owner 后，客户端能使用能被配置为拥有者权威（Owner Authoritative）的功能。

| 操作                       | 权威方 (Authority*) | 拥有者 (Owner) | 相关功能 / 说明                              |
| ------------------------ | ---------------- | ----------- | -------------------------------------- |
| 生成与销毁对象                  | ✅ 是              | ❌ 否         |                                        |
| 为后加入的客户端进行状态同步           | ✅ 是              | ❌ 否         |                                        |
| 变更所有权                    | ✅ 是              | ❌ 否         |                                        |
| 移动 Transform（位置/旋转）      | ✅ 默认可以           | ⚙️ 可配置      | 拥有者权威的 `NetworkTransform`              |
| 更新 NetworkObject 的父子关系   | ✅ 默认可以           | ⚙️ 可配置      | `NetworkObject.AllowOwnerToParent`     |
| 更新 NetworkVariable（网络变量） | ✅ 默认可以           | ⚙️ 可配置      | `NetworkVariableWritePermission.Owner` |


> [!TIP]
> 在同步 Transform 移动时都建议使用 `IsOwner` 来检查，无论你使用的是分 Distributed Authority 还 Client-Server 拓扑结构

## `NetworkBehaviour`

`NetworkBehaviour` 是 NGO 版的 `MonoBehaviour`，用来写网络相关脚本，**必须依附在有 `NetworkObject` 的物体上。**

```cs
using Unity.Netcode;

public class Player : NetworkBehaviour
{
}
```

它让你的脚本可以使用 NGO 的网络能力，比如：

```cs
IsSpawned  // 所有其他属性只有在 network object 生成时才有意义/有效
IsServer
IsClient
IsHost
IsOwner
IsOwnedByServer
NetworkObject
OwnerClientId
DontDestoryWithOnwer  // 当 owner 离开时，network object 不消失
RPC
ServerRpc
ClientRpc
NetworkVariable


public override void OnNetworkSpawn()
{
}
 
public override void OnNetworkDespawn()
{
    // 调用时机在 OnDestroy 之前
}

public override void OnNetworkPostSpawn()
{
}

public override void OnNetworkPreSpawn()
{
}
```

> [!WARNING]
> `SpawnWithOwnership()` 方法能使 host/server 生成不属于自身对象。此时，虽然服务器端的 `IsOwner` 为 `false`，但依然具有完整的权限。此外如果你在调用`SpawnWithOwnership()` 的同一帧内，立刻尝试在本地修改这个对象的属性，可能会因为权限问题导致意外行为。
> 
> 为了避免潜在问题，如果生成权限需要在生成后进行调整，可先调用 `Spawn()`，完成调整后再调用 `ChangeOwnership()`。

**`OnNetworkSpawn()` 和 `Start()` 之间的调用顺序是不确定的**，因此不应该在它们之间共享状态。不同情况下：

- 在场景中预先放置：`Awake` → `OnNetworkSpawn` → `Start`
- 动态 Spawn：`Awake` → `Start` → `OnNetworkSpawn`

`OnNetworkSpawn` 只有在物体激活且 `Spawn()` 被调用后才会执行。

---

当一个带有 `NetworkObject` 的物体被 Spawn 时，NGO 只会处理当前在 Hierarchy 里处于激活状态的子物体上的 `NetworkBehaviour`。
如果某个子物体被禁用了，那么：

- 它上面的 `NetworkBehaviour` 不会被包含进这次 Spawn 过程
- 在这个 `NetworkObject` 的整个生命周期内，这个子物体上的网络组件都不会再被自动处理

也就是说，inactive 的子物体会被漏掉，网络同步、RPC、NetworkVariable 等功能都不会对它生效。为了解决此问题，有两种做法：

- 不要禁用整个 GameObject，而是只禁用上面的 `NetworkBehaviour` 组件
- 如果一定要先禁用 GameObject，那就在调用 `Spawn()` 之前，先把需要参与网络的子物体全部重新设为 active

## RPC

为方法添加 `[RPC]` 注解和 `xxxRpc` 后缀令其可被远程调用。

Example：

```cs
[RequireComponent(typeof(NetworkObject))]
public class GameVisualManager : NetworkBehaviour
{
	// ..
	
	[Rpc(SendTo.Server)]
	private void SpawnObjRpc(Vector2Int position)
	{
		var obj = Instantiate(prefab);
		var networkObject = obj.GetComponent<NetworkObject>().Spawn(true);
	}
}
```

RPC 方法的参数是有限制的，必须是**可以被网络序列化**的数据。如需传网络对象，可利用 `NetworkObjectReference` 结构体。

常见的可序列化数据有：`int`, `string`, `enum`

Example：

```cs
[Rpc(SendTo.Server)]
private void SelectObjectRpc(NetworkObjectReference objRef)
{
    if (objRef.TryGet(out NetworkObject networkObject))
    {
        Debug.Log(networkObject.name);
    }
}
```

## 同步 Transform

`NetworkTransform` 是 NGO 中用来同步物体 Transform 的组件，挂载在网络物体上。

> [!NOTE]
> `NetworkObject` 中的 `Synchronize Transform` 勾选项只是让物体在 `Spawn()` 时同步位置。需要同步位置时推荐勾选。

`NetworkTransform` 不是每帧把真实位置硬同步过去：在收到网络位置后，会在客户端平滑插值。该附加效果是出于对网络延迟的考虑。如需立刻移动到目标位置，可调用 `networkTransform.Teleport()`。

有时你会想将物体跨场景迁移，`Network Obejct` 组件有两个相关选项：

1. `Active scene synchronization`：让物体跨场景保留
2. `Scene migration synchronization`：当 host/server 调用 [`SceneManager.MoveGameObjectToScene`](https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.MoveGameObjectToScene.html) 时，同步移动客户端的 Network Object

选项2是默认开启的，如果没有该方面的需求，建议关闭以节约性能。

## 同步子父物体关系

一个 Network Prefab 的根只能有一个 Network Object，比如不要把一个带 Network Object 的武器 Prefab 直接拖进角色 Prefab 作为子物体，这容易在 `Spawn` 阶段导致问题。但这只是制作 prefab 时的规则，Network Object 本身是可以嵌套的。而且，Network Object 的父物体必须也是 Network Object。

如需使网络物体变成其他网络物体的子物体，通常要在 **Server** 上调用：

```cs
childNetworkObject.TrySetParent(parentNetworkObject);
```

## 区分不同客户端

每个玩家连接到游戏后，NGO 会给他一个 `ClientId`。

`NetworkObject` 会记录 `OwnerClientId`，即这个游戏对象属于哪个客户端。但客户端通常无权生成物体，所以此时 `NetworkObject` 的拥有者需要由服务器来指定。

Example:

```cs
networkObject.SpawnWithOwnership(clientId);

networkObject.ChangeOwnership(clientId);

networkObject.RemoveOwnership();
```

`LocalClientId` 表示当前这台机器在 NGO 里的客户端 ID。

```cs
ulong localId = NetworkManager.Singleton.LocalClientId;
```

常看物体的所有权：

- `NetworkBehaviour.IsOwner`
- `NetworkBehaviour.IsOwnedByServer`

Example:

```cs
private void Update()
{
	// 等同于 IsOwner
    if (OwnerClientId != NetworkManager.Singleton.LocalClientId)
        return;

    // 只有自己的 Player 才读输入
    HandleInput();
}
```


当你要销毁拥有者，但又不想让某个特定的 Network Object 跟着一起被销毁时，可以把该 Network Object 的 `DontDestroyWithOwner` 属性设为 `true`。

## 检测客户端加入服务器

通过 `NetworkManager` 中的 `OnClientConnectedCallback` 回调。

Example:

```cs
public override void OnNetworkSpawn()  
{
	NetworkManager.Singleton.OnClientConnectedCallback += HandleClientConnected;  
}

private void HandleClientConnected(ulong clientId)  
{  
	Debug.Log($"客户端加入了，ClientId = {clientId}");  
}
```

获取已连接客户端的数量：

```cs
NetworkManager.Singleton.ConnectClientsList.Count
```

## 同步数据

`NetworkVariable` 是 NGO 用来同步状态数据的类。

变量的读写权限可在调用 `NetworkVariable` 构造函数时传参修改。默认情况下是：

- 服务器可写
- 所有客户端可读

与 RPC 相同，同步的变量**必须是可以被网络序列化的数据。**

Example:

```cs
public class PlayerScore : NetworkBehaviour
{
	// 0 是默认值，此处也可省略
    private NetworkVariable<int> score = new(0);

    public override void OnNetworkSpawn() =>
        score.OnValueChanged += HandleScoreChanged;

    public override void OnNetworkDespawn() =>
        score.OnValueChanged -= HandleScoreChanged;
    

    private void HandleScoreChanged(int oldValue, int newValue) =>
        Debug.Log($"分数从 {oldValue} 变成 {newValue}");

    [Rpc(SendTo.Server)]
    private void AddScoreRpc() => score.Value++;
}
```


## NGO 序列化数据

`INetworkSerializable` 是 NGO 中自定义类型该如何被网络传输的接口。一般使用 `struct`。

Example:

```cs
using Unity.Netcode;
using UnityEngine;

public struct GridData : INetworkSerializable
{
    public Vector2Int Position;
    public int PlayerId;

    public void NetworkSerialize<T>(BufferSerializer<T> serializer)
        where T : IReaderWriter
    {
        serializer.SerializeValue(ref Position);
        serializer.SerializeValue(ref PlayerId);
    }
}
```

> [!TIP] 为什么要用 `ref`？
> 因为同方法同时负责写入和读取网络数据。

`[SerializeField]` / `[Serializable]` 解决的是 **Unity 编辑器/存档式序列化**；`INetworkSerializable` 解决的是 **NGO 网络传输序列化**。二者不能相互代替。\

## 控制物体对各个 client 的可见性

可以控制 Network Object 只对部分客户端课件。

- `SpawnWithObservers` 属性为 `false` ，在 Spawn 一个 Network Object 时，**不会给任何客户端初始可见权限**（即不让任何客户端一开始就看到这个物体）。这个属性只在服务器最初 Spawn 这个物体时起作用，后续修改不会有实际效果。
- 如果你只是想全局地控制“这个物体生成时默认对所有客户端不可见”，那么推荐使用 `SpawnWithObservers = false`，而不是去写` CheckObjectVisibility`。它只在生成 Spawn 的那一刻生效。
- 如果你需要更精细的、每个客户端单独控制可见性（比如某些客户端能看到，某些不能看到），那就应该使用 `CheckObjectVisibility` 回调。

## `NetworkUpdateLoop`

网络系统（传输层收发包、RPC 队列处理、NetworkVariable 同步、Tick 等）经常需要在特定时机执行，有时要在普通游戏逻辑之前，有时要在之后。NetworkUpdateLoop 就是通过 Unity 底层的 Player Loop API，把网络相关的更新逻辑注入到这些标准阶段里，让网络代码能精确控制执行时机。大多数人不需要直接操作它。

可以用它替代在 Update 里写 `if (!IsSpawned) return;`

1. `Initialization`： 最早的初始化
2. `EarlyUpdate`： 在 Update 之前执行的固定频率更新
3. `FixedUpdate`： 对应普通 FixedUpdate
4. `PreUpdate`： 对应普通 Update 之前
5. `Update`： 对应普通 Update
6. `PreLateUpdate`： 对应普通 LateUpdate 之前
7. `LateUpdate`： 对应普通 LateUpdate
8. `PostLateUpdate`： 对应普通 LateUpdate 之后、渲染之后


`NetworkUpdateLoop` 提供了四个注册方法：

- `void RegisterNetworkUpdate(INetworkUpdateSystem updateSystem, NetworkUpdateStage updateStage)`
- `void RegisterAllNetworkUpdates(INetworkUpdateSystem updateSystem)`
- `void UnregisterNetworkUpdate(INetworkUpdateSystem updateSystem, NetworkUpdateStage updateStage)`
- `void UnregisterAllNetworkUpdates(INetworkUpdateSystem updateSystem)`

简略示例：

```csharp
public class MyNetworkUpdater : NetworkBehaviour, INetworkUpdateSystem
{
    public override void OnNetworkSpawn()
    {
        // 注册到 Update 阶段（也可以选 EarlyUpdate、FixedUpdate 等）
        this.RegisterNetworkUpdate(NetworkUpdateStage.Update);
    }

    public override void OnNetworkDespawn()
    {
        // 记得取消注册，防止内存泄漏或报错
        this.UnregisterNetworkUpdate(NetworkUpdateStage.Update);
    }

    public void NetworkUpdate(NetworkUpdateStage updateStage)
    {
        // 可以根据阶段做不同逻辑
        switch (updateStage)
        {
            case NetworkUpdateStage.Update:
                // 这里写你的网络相关逻辑
                if (!IsOwner) return;

                // 例如：处理输入、更新状态等
                Debug.Log($"NetworkUpdate 在 Update 阶段执行，Tick: {NetworkManager.LocalTime.Tick}");
                break;
        }
    }
}
```

## `NetworkManager` 子系统
