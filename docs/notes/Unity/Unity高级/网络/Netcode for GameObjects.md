
# Netcode for GameObjects

> [!TIP]
> Unity 目前有两个联机框架，其一为 Netcode for GameObjects，为玩家数量较少、逻辑复杂度较低的游戏所设计；另一为 Netcode for Game Entities，专为大型和复杂的游戏。

## 建立联系

依赖于 `NetworkManager` 脚本。该脚本负责建立连接和处理底层数据。

该脚本需要一个 Transport，用于在网络上建立连接和传输字节。 `NetworkManager` 位于传输层顶部。

## 辅助工具包

- Multiplayer Play Mode

	在安装 Unity 的 Multiplayer Play Mode 包后，你可以直接在编辑器里创建一个新的游戏窗口。不用每次测试都 `File -> Build And Run`。
	
	打开 `Windows -> Multiplayer -> Multiplayer Play Mode` 窗口可以创建虚拟玩家。在 Editor 进入 Play 模式时，虚拟玩家窗口中的 Game 窗口也会开始游戏。实际是为虚拟玩家创建了新的 Unity 实例。

- Multiplayer Tools

	Multiplayer Tools 包的 `RuntimeNetworkStatsMonitor`组件能检视网络状态。运行时会自动生成图形化界面。

## 网络上的游戏对象

`NetworkObject` 组件用来标识要在网络上的 GameObject。能参与 NGO 网络逻辑的 GameObject 通常需要 `NetworkObject` 组件，并配合至少一个 `NetworkBehaviour` 使用。**`NetworkObject` 本身基本不负责同步具体游戏数据**，主要负责物体的网络身份和生命周期。

其中：

| 组件                 | 作用                           |
| ------------------ | ---------------------------- |
| `NetworkObject`    | 让物体成为网络对象                    |
| `NetworkBehaviour` | 写网络逻辑，比如 RPC、NetworkVariable |
| `NetworkTransform` | 同步位置/旋转/缩放                   |
| `NetworkAnimator`  | 同步 Animator 参数/动画状态          |

> [!TIP]
> 一个 Network Object 在多个网络节点上，不是同一个物体，而是同一个网络对象在不同机器上的本地副本。

通过调用 `NetworkObject.Spawn(bool)` 生成一个由服务器同步到所有客户端的对象，布尔参数代表是否要随场景销毁。**在客户端-服务器模型下，只有服务器有权生成和销毁物体，客户端通过 RPC（远程函数调用）调用服务器上的方法。**

运行时，每个被 Spawn 的 `NetworkObject` 都会有一个网络 ID。

## RPC

`NetworkBehaviour` 是 NGO 版的 `MonoBehaviour`，用来写网络相关脚本，**必须依附在有 `NetworkObject` 的物体上。**

```cs
using Unity.Netcode;

public class Player : NetworkBehaviour
{
}
```

它让你的脚本可以使用 NGO 的网络能力，比如：

```cs
IsServer
IsClient
IsOwner
IsHost
NetworkObject
OwnerClientId
RPC
ServerRpc
ClientRpc
NetworkVariable

public override void OnNetworkSpawn()
{
}

public override void OnNetworkDespawn()
{
}
```


为方法添加 `[RPC]` 注解和 `***Rpc` 后缀令其可被远程调用。

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
> `NetworkObject` 中的 `Synchronize Transform` 勾选项只是让物体在 `Spawn()` 时同步位置。

`NetworkTransform` 不是每帧把真实位置硬同步过去：在收到网络位置后，会在客户端平滑插值。该附加效果是出于对网络延迟的考虑。如需立刻移动到目标位置，可调用 `networkTransform.Teleport()`。

## 同步子父物体关系

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
        => score.OnValueChanged += HandleScoreChanged;

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


## `DefaultNetworkPrefabs`

用来存放在网络上生成的 Prefab。会自动添加。