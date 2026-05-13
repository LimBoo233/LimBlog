
# Unity Multiplayer SDK

## 序

Unity Multiplayer SDK 是 Unity 官方推出的一体化多人游戏开发工具包，属于 Unity Gaming Services（UGS）核心组件，用于快速构建、托管和运营跨平台多人游戏。它把原本分散的Lobby、Matchmaker、Relay、Multiplay、QoS等独立服务整合为一套统一 API，核心是 **Session（会话）** 抽象层。

使用 Unity 云服务首先需要在 Project Setting -> Services 开启。

## 初始化 Unity 云服务 SDK，登录 Unity Authentication

```cs
using UnityEngine;
using Unity.Services.Core;
using System;
using Unity.Services.Authentication;

public class SessionManager : MonoBehaviour
{
    async void Start()
    {

	    try
	    {
			if (UnityServices.State == ServicesInitializationState.Uninitialized)  
				await UnityServices.InitializeAsync();  
			
			if (!AuthenticationService.Instance.IsSignedIn)  
				await AuthenticationService.Instance.SignInAnonymouslyAsync();
	
			Debug.Log(
				$"匿名登录成功！你的玩家ID: {AuthenticationService.Instance.PlayerId}"
			);
	    }
	    catch (Exception e)
	    {
		     Debug.LogException(e);
	    }
    }

}
```

在上面的代码中：

```cs
await UnityServices.InitializeAsync();
```

这一行会初始化 **Unity Gaming Services SDKs**。

```cs
await AuthenticationService.Instance.SignInAnonymouslyAsync();
```

这一行会对玩家进行**匿名身份认证**。

Authentication SDK 支持匿名认证，也支持适用于特定平台的外部认证方案，包括移动端和 PC 平台。更多细节可以参考[身份验证方法 • Authentication • Unity Docs](https://docs.unity.com/zh-cn/authentication/approaches-to-authentication)。

匿名认证不需要特殊配置，因此相比外部认证更容易使用，也更适合用于原型开发。

作为开发者，你必须在代码中初始化 Multiplayer Services 之后，对玩家进行身份认证。

> [!TIP]
> 有时候项目的云服务会出问题，一般重新打开 Edit > Project Settings > Services 就行。

## 创建 session

> [!NOTE]
> Session 功能依赖于 NGO 或 DOTS 包中的 `NetworkManager` 组件。

`CreateOrJoinSessionAsync()` 方法执行结果：

1. 加入一个具有指定 ID 的已有会话。
2. 如果这个 ID 对应的会话不存在，则创建一个新的会话。

该方式确保：当多个客户端尝试加入同一会话时，只会创建一个会话。这种情况通常被称为**竞态条件**。

```cs
var session = await MultiplayerService.Instance.CreateOrJoinSessionAsync(
	sessionId, 
	options
);
```

---

`SessionOptions` 决定 session 的各项属性，例如最大玩家数量和密码。

更多：[Class SessionOptions | Multiplayer Services | 1.2.1](https://docs.unity3d.com/Packages/com.unity.services.multiplayer@1.2/api/Unity.Services.Multiplayer.SessionOptions.html)

Example:

```cs
async Task StartSessionAsHost()
{
    var options = new SessionOptions
    {
        MaxPlayers = 2
    }.WithRelayNetwork(); 
    // 如果是 Dedicated Server，去掉 .WithRelayNetwork()
    // 或者使用   来用 Distributed Authority 替代 Relay

    var session = await MultiplayerService.Instance.CreateSessionAsync(options);

    Debug.Log($"Session {session.Id} 已创建。join code: {session.Code}");
}
```

使用 `WithRelayNetwork()`，或者 `WithDistributedAuthorityNetwork()`，会将该会话配置为使用 **Relay**，或者 **Distributed Authority** 网络，而不是使用直接连接。换句话说，它不会依赖固定的 IP 地址和端口进行直连。这是在互联网环境下进行点对点连接时推荐的最佳实践。

> [!NOTE]
> `WithDistributedAuthorityNetwork()` 依然解决了 NAT 和防火墙等问题。

## 加入 session

玩家可以通过以下几种方式加入会话：

1. Join code：加入代码
2. Browse sessions in a list：在列表中浏览会话
3. Reconnect to a session：重新连接到会话

通过加入代码加入：

```cs
await MultiplayerService.Instance.JoinSessionByCodeAsync(joinCode);
```

你可以在游戏中生成一个会话列表，让用户浏览并加入。用户可能会希望根据不同参数筛选这个列表。

筛选并列出，未满和公开的会话：

```cs
await MultiplayerService.Instance.QuerySessionsAsync(queryOptions);
```

列表中只会显示该会话的公开属性，例如会话名称。然后玩家可以通过 **session ID** 直接加入该会话。

> [!TIP]
> Session ID 和 join code 不是一个东西。

---

如果一个玩家从会话中断开连接并且还有没有被踢出，那他可以重连。

首先，调用 `GetJoinedSessionIdsAsync()` 获取当前用户所在的所有会话：

```cs
await MultiplayerService.Instance.GetJoinedSessionIdsAsync();
```

然后，调用 `ReconnectAsync` 重新连接到选定的会话：

```cs
await sessionManager.ReconnectAsync(sessionId);
```

你也可以在重新连接请求中添加自定义网络处理器实现。做法是指定一个 `ReconnectSessionOptions`，并使用你自己的 network handler 实现：

```cs
await sessionManager.ReconnectAsync(
    sessionId,
    new ReconnectSessionOptions().WithNetworkHandler(customNetworkHandler)
);
```

> [!NOTE]
>  Multiplayer SDK 没有保存 session id 和 session type 的映射，如有需求需要自己建立。
## 匹配

[Match players • Multiplayer • Unity Docs](https://docs.unity.com/zh-cn/mps-sdk/matchmake-session)

### Quick Join API

```cs
var quickJoinOptions = new QuickJoinOptions()
{
    Filters = new List<FilterOption>
    {
        new(FilterField.AvailableSlots, "1", FilterOperation.GreaterOrEqual),
        new (FilterField.StringIndex1, "map 1", FilterOperation.Equal)
    },
    Timeout = TimeSpan.FromSeconds(5),
    CreateSession = true
};

var sessionOptions = new SessionOptions()
{
    MaxPlayers = 2,
    Type = "Session",
}.WithRelayNetwork();

ISession session = await MultiplayerService.Instance.MatchmakeSessionAsync(
	quickJoinOptions, 
	sessionOptions
);
```


`QuickJoinOptions` 是找房规则，本示例中：

1. 第一个过滤条件：至少有 1 个空位

```cs
new(FilterField.AvailableSlots, "1", FilterOperation.GreaterOrEqual)
```

即：

```cs
AvailableSlots >= 1
```

2. 第二个过滤条件：地图必须是 `map 1`

```cs
new(FilterField.StringIndex1, "map 1", FilterOperation.Equal)
```

即：

```cs
StringIndex1 == "map 1"
```

这里的 `StringIndex1` 可以理解成 Lobby / Session 上的一个可查询字符串字段。比如你创建 Session 的时候可能给它设置了类似：

```cs
map = "map 1"
```

3. `Timeout`：最多找 5 秒
4. `CreateSession`：找不到就创建

`SessionOptions` 是如果要创建房间，怎么创建。`Type = "Session"` 是该 Session 的类型标识，可以理解成：这个房间属于哪种类型。

### Advanced matchmaking

Matchmaker 和 Quick Join 不一样，是根据更高级的规则搭建的匹配系统。

Matchmaker 不能只靠客户端代码，必须先配置：

- Queue：匹配队列，不同游戏模式（ex：休闲 / 排位）对应不同队列
- Pool：是 Queue 里面的进一步分类，考虑地区、平台、托管方式等特殊规则
- Match Rules：更细致的，符合游戏规则的匹配方式，考虑例如队伍人数和玩家间关系
- Hosting Type

Example:

- 如果 Matchmaker Pool 配的是你的服务器托管提供商，推荐用 `WithDirectNetwork()`；
- `WithDirectNetwork()` 会让客户端直接连接分配到的服务器 IP 和端口；
- 如果是 client-hosted，也就是玩家主机 / P2P 游戏，推荐用 `WithRelayNetwork()` 或 `WithDistributedAuthorityNetwork()`。

```cs
var matchmakerOptions = new MatchmakerOptions
{
    QueueName = "Friendly"
};

var sessionOptions = new SessionOptions()
{
    MaxPlayers = 2
}.WithDirectNetwork();

var matchmakerCancellationSource = new CancellationTokenSource();


ISession session = await MultiplayerService.Instance.MatchmakeSessionAsync(
	matchmakerOptions,
	sessionOptions,
	matchmakerCancellationSource.Token
);
```

## 管理 session 属性

### Host 

Host 可以对一个 Session 的属性进行：

- 读取
- 添加
- 更新
- 删除

#### Session 属性 API

##### 读取

下面的 API 允许 Host 读取 Session 属性：

```cs
IReadOnlyDictionary<string, SessionProperty> ISession.Properties { get; }
```

Example:

```cs
if (clientSession.Properties.TryGetValue("colour", out var colour))
{
    Debug.Log($"The colour session property is {colour.Value}");
}
```

##### 写入

下面的 API 允许 Host 修改 Session 属性：

```cs
void IHostSession.SetProperties(Dictionary<string, SessionProperty> properties);
void IHostSession.SetProperty(string key, SessionProperty property);
Task IHostSession.SavePropertiesAsync();
```

> [!TIP]
> 即使你是 Host，一开始拿到的对象也可能只是普通的 `ISession`。如果想使用 Host 专属操作，需要先把它转换成 `IHostSession`。

要给 Session 添加属性，你必须先决定这个属性的**可见性**：

| 可见性       | 含义                |
| --------- | ----------------- |
| `Public`  | 所有人可见，并且会包含在查询结果中 |
| `Member`  | Session 成员可见      |
| `Private` | 只有设置该属性的成员可见      |
决定好需要的可见性之后，你需要：

1. 创建 `SessionProperty`
2. 设置到 `Session`上
3. 保存到 `Session`

添加/修改 `colour` 属性示例：

```cs
var redColourProperty = new SessionProperty("red", VisibilityOptions.Public);
hostSession.SetProperty("colour", redColourProperty);
await hostSession.SavePropertiesAsync();
```

若要删除，可直接将属性设为 `null`。

删除 `colour` 属性示例：

```cs
hostSession.SetProperty("colour", null);
```

#### 玩家属性操作

##### 读取

Host 读取玩家属性 API：

```cs
IReadOnlyList<IPlayer> IHostSession.Players { get; }
IReadOnlyDictionary<string, PlayerProperty> IReadOnlyPlayer.Properties { get; }
```

Example:

```cs
if(hostSession.Players.First().Properties.TryGetValue("colour", out var colour))
{
    Debug.Log($"First player colour property is {colour.Value}");
}
```

##### 写入

Host 修改修改玩家属性 API：

```cs
IReadOnlyList<IPlayer> IHostSession.Players { get; }
Task IHostSession.SavePlayerDataAsync(string playerId);
void IPlayer.SetProperty(string key, PlayerProperty property);
void IPlayer.SetProperties(Dictionary<string, PlayerProperty> properties);
```

同样需要为 `PlayerProperty` 设置可见性。

Example:

```cs
var firstPlayer = hostSession.Players.First()
var redColourProperty = new PlayerProperty("red");
firstPlayer.SetProperty("colour", redColourProperty);
await hostSession.SavePlayerDataAsync(firstPlayer.Id);
```

删除同样是修改属性为 `null`。

#### 选举新的 Session Host

下面的代码展示了如何根据某个玩家的 ID，把该玩家选为新的 Host：

```cs
public Task ElectPlayerAsHostAsync(string playerId)
{
    _session.AsHost().Host = player.Id;
    return _session.AsHost().SavePropertiesAsync();
}
```

设置完 Session 的 Host ID 之后，需要保存更改，修改才会生效。Host 选举过程**不会处理网络 Session 的数据迁移**。如果你需要迁移网络数据，需要参考：[Migrate session host • Multiplayer • Unity Docs](https://docs.unity.com/zh-cn/mps-sdk/session-host-migration)。

### Client

#### Session 属性 API

Client 可以读取 Session 的属性，但不能写。

Client 读取玩家属性：

```cs
IPlayer ISession.CurrentPlayer { get; }
IReadOnlyList<IReadOnlyPlayer> ISession.Players { get; }
```

其中：

- `CurrentPlayer`：当前客户端自己对应的玩家
- `Players`：当前 Session 里的玩家列表

下面的代码展示了如何读取玩家的 `colour` 属性：

```cs
if (clientSession.Players.First().Properties.TryGetValue("colour", out var colour))
{
    Debug.Log($"First player colour property is {colour.Value}");
}
```

#### Client 属性 API

Client 可以访问所有对自己可见的玩家属性。但是，Client 只能增删改**自己的玩家属性**。
##### 读取

API:

```cs
IPlayer ISession.CurrentPlayer { get; }
IReadOnlyList<IReadOnlyPlayer> ISession.Players { get; }
```

##### 写入

API:

```cs
IPlayer ISession.CurrentPlayer { get; }
Task ISession.SaveCurrentPlayerDataAsync();
void IPlayer.SetProperty(string key, PlayerProperty property);
void IPlayer.SetProperties(Dictionary<string, PlayerProperty> properties);
```

也就是说，Client 修改自己的玩家属性时，一般流程是：

拿到 `CurrentPlayer` -> `SetProperty()` / `SetProperties()` -> `SaveCurrentPlayerDataAsync()`

## 在 Session 中同步玩家名字

当玩家通过 **Authentication service** 完成身份验证后，你可以把玩家的名字作为玩家属性写入 session，并且在 session 生命周期中更新它。

你可以使用下面两个扩展方法来实现这个功能。

在创建或加入 session 时启用玩家名同步：

```cs
WithPlayerName(VisibilityPropertyOptions visibility)
```

从 session 读取玩家名：

```cs
GetPlayerName()
```


使用 `WithPlayerName()` 可以把玩家经过 Authentication 的名字同步到 session 中，并且可以选择可见性。

下面的示例展示了如何在创建 Session 时启用玩家名字同步：

```cs
var myPlayerName = "CustomName";

await UnityServices.InitializeAsync();
await AuthenticationService.Instance.SignInAnonymouslyAsync();
await AuthenticationService.Instance.UpdatePlayerNameAsync(myPlayerName);

// 配置 Session，并启用名字同步
// Member 可见性表示其他 Session 成员也可以读取这个名字
var sessionOptions = new SessionOptions
{
    MaxPlayers = 4,
    Type = "Session"
}.WithPlayerName(VisibilityPropertyOptions.Member);
```

如果某个名字因为任何原因不可用，`GetPlayerName()` 会返回 `null`。

## Monitor & Debug

Services -> Multiplayer -> Sessions Viewer

## 和 NGO

- Host：创建 Relay Allocation，拿到 Relay Join Code  
- Client：使用这个 Relay Join Code 加入 Host 创建的 Relay Allocation

Host 创建 Relay Join Code：

```cs
// allocation 是 Relay 服务器给 Host 分配的一块连接资源，传入运行进入的 client 总数
var allocation = await RelayService.Instance.CreateAllocationAsync(maxPlayers - 1);
var joinCode = await RelayService.Instance.GetJoinCodeAsync(allocation.AllocationId);

// 然后 Host 配置自己的 Transport
var transport = NetworkManager.Singleton.GetComponent<UnityTransport>();
// 让 UnityTransport：不用默认的本地 IP 直连，改用 Relay allocation 来通信，"dtls" 协议
transport.SetRelayServerData(new RelayServerData(allocation, "dtls"));

NetworkManager.Singleton.StartHost();
```

这时 Host 拿到的 `joinCode` 是用来发给其他玩家的。这个 `joinCode` 通常长得像 ABCD12, X7K9QZ

Client:

```cs
var joinAllocation = await RelayService.Instance.JoinAllocationAsync(joinCode);

// 配置 Transport
var transport = NetworkManager.Singleton.GetComponent<UnityTransport>();
transport.SetRelayServerData(new RelayServerData(joinAllocation, "dtls"));

NetworkManager.Singleton.StartClient();
```

> [!TIP]
> dtls 是种通信协议，可以简单理解成加密版 UDP。