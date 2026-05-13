# KCC

## Introduction

角色控制器制作有难度，且每个游戏对它的需求也大不相同。因此，Kinematic Character Controller 并没有试图预先打包好所有可能问题的解决方案。相反，**它专注于解决创建高度动态且响应迅速的角色控制器时那些最困难的核心物理问题，而把其余部分留给你自己处理**。这种设计理念确保你拥有足够的权力，来制作完全符合你游戏需求的角色控制器，并且能够干净地融入任何项目架构。

- 需要自己编写以下代码：玩家输入、相机控制、动画，角色移动逻辑（告诉它当前速度应该是什么、朝向应该是什么）等等……
- KCC 提供一套能处理复杂角色物理求解的底层组件，帮助你相对轻松地编写出完全自定义的角色控制器。

> [!NOTE] 核心脚本
>
> - `KinematicCharacterMotor`：这是角色系统的核心。该脚本根据给定的速度、朝向和其他因素，解决所有角色移动和碰撞问题。
> - `PhysicsMover`：该脚本用于移动运动学物理对象（移动平台），使角色能够正确站在上面并被其推动。
> - `KinematicCharacterSystem`：负责以正确顺序模拟所有 `KinematicCharacterMotor` 和 `PhysicsMover`。
> - `ICharacterController`：创建一个实现该接口的类，并将其赋值给 `KinematicCharacterMotor`，从而实现你的角色控制器。
> - `IMoverController`：创建一个实现该接口的类，并将其赋值给 `PhysicsMover`，从而实现你的移动平台控制器。

为了给 `KinematicCharacterMotor` 提供输入，你需要创建一个自定义类来实现 `ICharacterController` 接口，并将其赋值给 `KinematicCharacterMotor` 的 `CharacterController` 变量。这样，类就会开始接收来自 Motor 的回调了。

这些回调大多数可以理解为 `KinematicCharacterMotor` 提出的问题：

- `UpdateVelocity`： “我现在的速度应该是什么？”
- `UpdateRotation`： “我现在的朝向应该是什么？”
- `IsColliderValidForCollisions`： “我是否应该与这个碰撞体发生碰撞，还是直接穿过去？”
- 等等……

`KinematicCharacterMotor` 和 `PhysicsMover` 需要遵循严格的执行顺序，该顺序由 `KinematicCharacterSystem` 类负责管理。

组件注册：

- 当 `KinematicCharacterMotor` 和 `PhysicsMover` 被创建时，它们会在 `OnEnable()` 中将自己注册到 `KinematicCharacterSystem` 中。
- 同样，它们会在 `OnDisable()` 中取消注册。
- 之后，`KinematicCharacterSystem` 将以正确的顺序处理所有已注册的`KinematicCharacterMotor` 和 `PhysicsMover` 的更新行为。

> [!TIP]
> `KinematicCharacterSystem` 实现了 Mono 单例，无需也不能手动在场景中创建。（详情参考 `KinematicCharacterSystem.EnsureCreation()`）

---

**根运动**

如果你希望角色使用动画根运动来移动，也是完全可以的。

具体做法是：在你自定义的角色控制器中，在 `OnAnimatorMove()` 函数里保存动画师的根运动（`animator.deltaPosition`），并将其转换为速度（`animator.deltaPosition / deltaTime`），然后在 Motor 的 `UpdateVelocity()` 回调中设置该速度。旋转同样可以在 `UpdateRotation()` 回调中处理。

---

**基本物理模拟循环**

KCC 里面有两种重要的东西：

- `KinematicCharacterMotor`（你的角色）
- `PhysicsMover`（移动平台，比如电梯、传送带）

二者必须按严格顺序更新，否则会出现角色抖动、站不稳移动平台、穿模等问题。`KinematicCharacterSystem` 负责统一调度其更新顺序，默认在 `FixedUpdate()` 中自动执行循环（实际的移动还是在 `Update()` 中处理）。这个循环分为3步：

1. `PreSimulationInterpolationUpdate()`：预备阶段

	- 将所有角色的移动平台的当前位置和旋转（位置 A）保存下来
	- 处理上一帧插值的首尾工作，具体是指让角色和平台立刻移动到上次计算的目标位置。

2. `Simulate()`

	  - 计算移动平台目标位置
	  - 角色 Phase 1
	    - 处理角色和环境的初始重叠（比如角色卡在墙里）
	    - 计算地面检测
	  - 为方便计算，先假使平台瞬移到目标位置
	  - 角色 Phase 2
	    - 调用定义的回调（`UpdateVelocity()`, `UpdateRotation()`）
	    - 进行碰撞和滑动检测
	    - 计算角色这一帧的目标位置，然后假使角色到达目标位置 B

3. `PostSimulationInterpolationUpdate()`

    - 使用 Pre 阶段保存的旧位置 A，平滑移动到 Simulate 计算出的目标位置 B

> [!DANGER]
>
> 1. 永远不要将角色作为移动平台的子物体。
> 2. 角色 GameObject 的 lossyScale（世界缩放）必须为 (1,1,1)，否则物理计算将无法正常工作。这意味着该对象的所有父物体也必须保持 (1,1,1) 的缩放。
> 3. 如果你想在运行时调整胶囊体的大小，必须使用 `KinematicCharacterMotor.SetCapsuleDimensions()` 方法，因为该方法会缓存胶囊体的尺寸信息，后续大部分移动代码都会使用这些缓存数据。

## 前置数学

KCC 的示例代码里有很多叉乘，如果不熟悉的话会很难受，记录下心得：

- 叉乘方向：`Vector3.Cross(a, b)` ，a 当作左手中指指向前方，b 作为食指，大拇指即为结果方向。当然需要根据 b 的方向转动整个手。
- 两个平面的法向量相乘所得向量所得方向平行于两平面。
- `Quaternion.LookRotation(forward, up)` 返回的是一个 Orientation。它的作用是定义一个全新的局部坐标系，并计算出：如何从世界原点状态旋转，才能让我的 Z 轴指向 forward，且 Y 轴指向 up。

还有 Unity 当中的 `Vector3.ProjectOnPlane(dir, normal)` 的结果其实就是 dir 减去在法线方向的投影。

## Basic Movement

实现了 `ICharacterController` 接口后，通过实现 `UpdateVelocity()` 和 `UpdateRotation()` 回调来控制角色的移动：

```cs
 public class MyCharacterController : MonoBehaviour, ICharacterController
{
    public KinematicCharacterMotor Motor;
    // ..

    public void Start() => Motor.CharacterController = this;
    // ..

    // 其中传入的 currentRotation 其实是上次计算的结果，每次循环需将其更新
    public void UpdateRotation(ref Quaternion currentRotation, float deltaTime)
    {
        // ..
    }

    // 其中传入的 currentVelocity 其实是上次计算的结果，每次循环需将其更新
    public void UpdateVelocity(ref Vector3 currentVelocity, float deltaTime)
    {
        // ..
    }
}
```

KCC 实现了基础移动逻辑，其中大量使用叉乘运算，核心目的只有一个：**垂直方向为角色头顶方向或重力方向而非 y 轴，水平方向为角色所在平面或重力的法平面而非 xz 平面**。

`UpdateRotation()` 还较为简单：

```cs
public void UpdateRotation(ref Quaternion currentRotation, float deltaTime)
{
    if (_lookInputVector == Vector3.zero || OrientationSharpness <= 0f) return;

    // 从当前方向平滑插值到目标方向
    Vector3 smoothedLookInputDirection = Vector3.Slerp(Motor.CharacterForward, _lookInputVector, 1 - Mathf.Exp(-OrientationSharpness * deltaTime)).normalized;

    // 设置当前方向，以供 kcc motor 使用
    currentRotation = Quaternion.LookRotation(smoothedLookInputDirection, Motor.CharacterUp);
}
```

`UpdateVelocity()` 则较为复杂：

- `Motor.GetDirectionTangentToSurface()`：将方向投影到斜面上
- `Motor.GroundingStatus.IsStableOnGround`：是否在可站立的地面上
- `Motor.GroundingStatus.FoundAnyGround`：是否于接触任何地面/墙
- `Motor.GroundingStatus.GroundNormal`：站立面/接触面法线

```cs
public void UpdateVelocity(ref Vector3 currentVelocity, float deltaTime)
{
    Vector3 targetMovementVelocity = Vector3.zero;

    // ===== 如果在可站立的地面上 =====
    if (Motor.GroundingStatus.IsStableOnGround)
    {
        // ① 将当前速度投影到斜面上
        currentVelocity =
            Motor.GetDirectionTangentToSurface(currentVelocity, Motor.GroundingStatus.GroundNormal)
            * currentVelocity.magnitude;

        // ② 计算输入方向在地面上的投影方向
        // 本质：把输入方向压到斜坡上（避免飞起来或钻地）
        Vector3 inputRight = Vector3.Cross(_moveInputVector, Motor.CharacterUp);
        Vector3 reorientedInput =
            Vector3.Cross(Motor.GroundingStatus.GroundNormal, inputRight).normalized
            * _moveInputVector.magnitude;

        // 得到目标速度（沿地面移动）
        targetMovementVelocity = reorientedInput * MaxStableMoveSpeed;

        // ③ 平滑从当前速度 → 目标速度（指数平滑，更自然）
        currentVelocity = Vector3.Lerp(
            currentVelocity,
            targetMovementVelocity,
            1 - Mathf.Exp(-StableMovementSharpness * deltaTime)
        );
    }
    else
    {
        // ===== 空中状态 =====
          
        // ① 有输入时才处理空中控制
        if (_moveInputVector.sqrMagnitude > 0f)
        {
            // 目标空中速度（理想方向）
            targetMovementVelocity = _moveInputVector * MaxAirMoveSpeed;
    
            // ② 当蹭到不可站立的墙时，防止蹭坡/蹭墙往上爬
            if (Motor.GroundingStatus.FoundAnyGround)
            {
                // 等价于：坡法线在角色水平面的投影
                Vector3 obstructionDir = Vector3.ProjectOnPlane(
					Motor.GroundingStatus.GroundNormal,  
					Motor.CharacterUp
					).normalized;
    
                // 去掉“朝坡上”的速度分量
                targetMovementVelocity =
                    Vector3.ProjectOnPlane(targetMovementVelocity, obstructionDir);
            }
    
            // ③ 空中只改变水平速度，不影响重力方向，所以先去掉 currentVelocity 中的垂直速度
            Vector3 velocityDiff =
                Vector3.ProjectOnPlane(targetMovementVelocity - currentVelocity, Gravity);
    
            // 当前速度离目标速度越远，收敛得越快（即加速越快）
            // 此处的加 AirAccelerationSpeed 不是真的物理意义上的加速度，只代表一个收敛系数
            currentVelocity += velocityDiff * AirAccelerationSpeed * deltaTime;
        }
    
        // ④ 重力（单独作用在垂直方向）
        currentVelocity += Gravity * deltaTime;
    
        // ⑤ 空气阻力（平滑减速，在低帧率更加稳定的写法）
        currentVelocity *= (1f / (1f + (Drag * deltaTime)));
    }  
}
```

## 跳跃

**简单跳跃**

跳跃逻辑最终需在 `UpdateVelocity()` 中实现，因此需将跳跃意图保存至类中。

```cs
private bool _jumpRequested = false;
private bool _jumpConsumed = false;
private bool _jumpedThisFrame = false;
private float _timeSinceJumpRequested = Mathf.Infinity;
private float _timeSinceLastAbleToJump = 0f;


public void SetInput(ref PlayerCharacterInputs inputs)
{
    // ..
    if (inputs.JumpDown)
    {
        _timeSinceJumpRequested = 0f;
        _jumpRequested = true;
    } 
}
```

kcc 为了保持移动稳定，会使角色紧贴地面面，禁止起跳。调用 `ForceUnground(int seconds)` 可让角色在数秒内正常离地。

在基础移动逻辑后添加跳跃逻辑：

> [!NOTE]
> `JumpPreGroundingGraceTime` 和 `JumpPostGroundingGraceTime` 分别表示：
> - 落地前额外允许提前按跳跃键的时间（落地后仍会跳起）；
> - 离开稳定地面后额外允许跳跃的时间。

```cs
public void UpdateVelocity(ref Vector3 currentVelocity, float deltaTime)
{
    // ..
    
    // ===== 处理跳跃 =====
    _jumpedThisFrame = false;
    _timeSinceJumpRequested += deltaTime;
    
    if (_jumpRequested)
    {
        // 判断当前是否允许跳跃
        if (
            !_jumpConsumed && // 本次是否已经跳过
            (
                // 是否在可跳状态（地面 或 滑坡）
                (AllowJumpingWhenSliding ? Motor.GroundingStatus.FoundAnyGround : Motor.GroundingStatus.IsStableOnGround)
                // 或者：离开地面后的一小段跳跃宽限时间（coyote time）
                || _timeSinceLastAbleToJump <= JumpPostGroundingGraceTime
            )
        )
        {
            // ===== 计算跳跃方向 =====
            Vector3 jumpDirection = Motor.CharacterUp;
            
            // 如果在不可站立的地面（比如斜坡/墙），用地面法线作为跳跃方向（坡跳/墙跳）
            if (Motor.GroundingStatus.FoundAnyGround && !Motor.GroundingStatus.IsStableOnGround)
            {
                jumpDirection = Motor.GroundingStatus.GroundNormal;
            }
    
            // ===== 强制离地 =====
            // 跳过下一帧的贴地检测/吸地
            Motor.ForceUnground(0.1f);
    
            // ===== 应用跳跃速度 =====
            // 先去掉当前“向上分量”，再添加跳跃速度（保证跳跃高度一致）
            currentVelocity +=
                - Vector3.Project(currentVelocity, Motor.CharacterUp);
                + (jumpDirection * JumpSpeed)
    
            // ===== 重置状态 =====
            _jumpRequested = false;
            _jumpConsumed = true;
            _jumpedThisFrame = true;
        }
    }
}
```

在 `AfterCharacterUpdate()` 中处理计时器和更新状态：

```cs
/// <summary>
/// 由 KinematicCharacterMotor 在 Update 过程中调用
/// 调用时机：角色完成 movement update 之后
/// </summary>
public void AfterCharacterUpdate(float deltaTime)
{
    // ===== 处理跳跃相关状态 =====
    {
        // ===== 跳跃输入缓冲（提前按跳）=====
        if (_jumpRequested && _timeSinceJumpRequested > JumpPreGroundingGraceTime)
        {
            // 如果过了 JumpPreGroundingGraceTime 时间后还不能起跳，就清理 _jum
            _jumpRequested = false;
        }

        // ===== 仍在可跳状态（地面或滑坡）=====
        if (AllowJumpingWhenSliding ? Motor.GroundingStatus.FoundAnyGround : Motor.GroundingStatus.IsStableOnGround)
        {
            // 如果在地面，可允许再次跳跃
            if (!_jumpedThisFrame)  _jumpConsumed = false;
            
            // 重置离开地面时间
            _timeSinceLastAbleToJump = 0f;
        }
        else
        {
            // 记录离开地面的时间（用于跳跃宽限时间）
            _timeSinceLastAbleToJump += deltaTime;
        }
    }
}
```

---

**二段跳**

在 `if (_jumpRequested)` 追加判断：如果角色已经跳跃了一次，并且满足跳跃的必须条件，就可以再次起跳。

修改后的 `UpdateVelocity()`：

```cs
private bool _doubleJumpConsumed;

public void UpdateVelocity(ref Vector3 currentVelocity, float deltaTime)
{
    // ..
    
    if (_jumpRequested)
    {
        // =====二段跳判断====
        if (AllowDoubleJump)
        {
            // 判断逻辑和第一次起跳相比多检查了 _doubleJumpConsumed 和 _jumpConsumed
            if (_jumpConsumed && !_doubleJumpConsumed 
                && (AllowJumpingWhenSliding ? !Motor.GroundingStatus.FoundAnyGround : !Motor.GroundingStatus.IsStableOnGround))
            {
                Motor.ForceUnground(0.1f);

                // Add to the return velocity and reset jump state
                currentVelocity += (Motor.CharacterUp * JumpSpeed) - Vector3.Project(currentVelocity, Motor.CharacterUp);
                _jumpRequested = false;
                _doubleJumpConsumed = true;
                _jumpedThisFrame = true;
            }
        }
        
        // 判断当前是否允许跳跃
        if (
            !_jumpConsumed && // 本次是否已经跳过
            (
                // 是否在可跳状态（地面 或 滑坡）
                (AllowJumpingWhenSliding ? Motor.GroundingStatus.FoundAnyGround : Motor.GroundingStatus.IsStableOnGround)
                // 或者：离开地面后的一小段跳跃宽限时间（coyote time）
                || _timeSinceLastAbleToJump <= JumpPostGroundingGraceTime
            )
        )
        {
            // ..
        }
        // ..
}

public void AfterCharacterUpdate(float deltaTime)
{
    // ..
        // ===== 仍在可跳状态（地面或滑坡）=====
        if (AllowJumpingWhenSliding ? Motor.GroundingStatus.FoundAnyGround : Motor.GroundingStatus.IsStableOnGround)
        {
            // 如果在地面，可允许再次跳跃
            if (!_jumpedThisFrame)
            {
                _doubleJumpConsumed = false;
                _jumpConsumed = false;
            }
        
            _timeSinceLastAbleToJump = 0f;
        }
    // ..
}
```

___

**登墙跳**

墙跳逻辑与普通跳跃非常相似，但仅在当前正撞向墙壁时才允许跳跃。为此，需要在 `MyCharacterController` 的 `OnMovementHit()` 方法中添加代码，来记录是否允许墙跳，然后在 `UpdateVelocity()` 中使用该变量来执行实际的跳跃。`OnMovementHit()` 仅在角色移动过程中、沿移动方向发生碰撞时调用；与地面等支撑面（ex：地面）长时间接触不会触发，仅在从空中坠落接触时触发一次。

新的 `OnMovementHit()`：

```cs
public void OnMovementHit(Collider hitCollider, Vector3 hitNormal, Vector3 hitPoint, ref HitStabilityReport hitStabilityReport)
{
    // 只有在不在稳定地面上，并且撞到的是不稳定表面（如墙/陡坡）时，才允许墙跳
    // hitStabilityReport.IsStable：撞到的墙能否站立
    if (AllowWallJump && !Motor.GroundingStatus.IsStableOnGround && !hitStabilityReport.IsStable)
    {
        // 标记本帧可以进行墙跳
        _canWallJump = true;

        // 记录墙的法线，用于后续计算跳跃方向（沿法线弹出）
        _wallJumpNormal = hitNormal;
    }
}
```

新的 `UpdateVelocity()`：

```cs
public void UpdateVelocity(ref Vector3 currentVelocity, float deltaTime)
{
    // ..
    if (_jumpRequested)
       {
           // 判断当前是否允许跳跃
           if (
               _canWallJump || // 能否墙跳 
               !_jumpConsumed && // 本次是否已经跳过
               (
                   // 是否在可跳状态（地面 或 滑坡）
                   (AllowJumpingWhenSliding ? Motor.GroundingStatus.FoundAnyGround : Motor.GroundingStatus.IsStableOnGround)
                   // 或者：离开地面后的一小段跳跃宽限时间（coyote time）
                   || _timeSinceLastAbleToJump <= JumpPostGroundingGraceTime
               )
           )
           {
               // ===== 计算跳跃方向 =====
               Vector3 jumpDirection = Motor.CharacterUp; 
               
               // 真正的墙跳：
               if (_canWallJump)
               {
                   jumpDirection = _wallJumpNormal;
               }
               // 如果在不可站立的地面（比如斜坡/墙），用地面法线作为跳跃方向（坡跳/墙跳）。
               else if (Motor.GroundingStatus.FoundAnyGround && !Motor.GroundingStatus.IsStableOnGround)
               {
                   jumpDirection = Motor.GroundingStatus.GroundNormal;
               }
    // ..
    _canWallJump = false;
}
```

## 检测降落/离开地面

有时需要检测角色是否离开地面和降落地面，只需要在 `PostGroundingUpdate()` 中检测当前和先前地面状态就能实现。`PostGroundingUpdate()` 是 kcc 当中的回调，会在角色完成新接地判断后触发。

```cs
public void PostGroundingUpdate(float deltaTime)
{
    if (Motor.GroundingStatus.IsStableOnGround && !Motor.LastGroundingStatus.IsStableOnGround)
    {
        print("王之迫降！");
    }
    else if (!Motor.GroundingStatus.IsStableOnGround && Motor.LastGroundingStatus.IsStableOnGround)
    {
        print("我已升空，感觉良好。");
    }
}
```

## 施加速度与冲击

如需为角色添加额外的速度或外力，例如爆炸的冲击力，可在角色类对外开放一个 `AddVelocity()` 方法来记录外部速度，然后在 `UpdateVelocity()` 回调里加上这个速度：

```cs
Vector3 _internalVelocityAdd = Vector3.zero;

public void AddVelocity(Vector3 velocity) => _internalVelocityAdd += velocity;

public void UpdateVelocity(ref Vector3 currentVelocity, float deltaTime)
{
    // ..
    if (_internalVelocityAdd.sqrMagnitude > 0f)
    {
        currentVelocity += _internalVelocityAdd;
        _internalVelocityAdd = Vector3.zero;
    }
}
```

> [!TIP]
> 如果希望外力能将角色推入空中，还需补充 `Motor.ForceUnground()`。

## 下蹲

下蹲逻辑可在输入处理时实现：

```cs
public void SetInputs(ref PlayerCharacterInputs inputs)
{
    // ..
    if (inputs.CrouchDown)
    {
        _shouldBeCrouching = true;

        if (!_isCrouching)
        {
            _isCrouching = true;
            // 修改碰撞箱和表现层大小
            Motor.SetCapsuleDimensions(0.5f, 1f, 0.5f);
            MeshRoot.localScale = new Vector3(1f, 0.5f, 1f);
        }
    }
    else if (inputs.CrouchUp)
    {
        _shouldBeCrouching = false;
    }
}
```

因为起立时角色的碰撞箱会变大，需要判断角色所在位置是否有足够空间，因此逻辑需延后至计算完移动之后(`AfterCharacterUpdate()`)：

```cs
// 缓存碰撞体
private Collider[] _probedColliders = new Collider[8];

public void AfterCharacterUpdate(float deltaTime)
{
    // ..
    if (_isCrouching && !_shouldBeCrouching)
    {
        // 暂时将角色回复到站立体型进行物理检测
        Motor.SetCapsuleDimensions(0.5f, 2f, 1f);
        if (Motor.CharacterCollisionsOverlap(
                Motor.TransientPosition,
                Motor.TransientRotation,
                _probedColliders) > 0)
        {
            // 空间不足，让角色回到蹲下状态
            Motor.SetCapsuleDimensions(0.5f, 1f, 0.5f);
        }
        else
        {
            // 空间充足，修改角色表现层的缩放
            MeshRoot.localScale = new Vector3(1f, 1f, 1f);
            _isCrouching = false;
        }
    }   
}
```

- 此处使用 `Motor.CharacterCollisionsOverlap()` 而非 `OverlapCapsule()`，是因为前者使用了 kcc 的物理检测，且能过滤特定碰撞箱。它返回检测到碰撞体的数量。
- `Motor.TransientPosition` 和 `Motor.TransientRotation`
	- 当前模拟计算中正在使用的临时位置，kcc 会在 `Simulate()` → `UpdatePhase2()` 过程中不断修改它们。
	- 同一帧内，该值在不同回调中也可能不同，因为它们表示的是当前计算的值。
	- Ex：在 `UpdateVelocity()` 中，该值可视作尚未移动的位置；在 `AfterCharacterUpdate()` 中可视作最终位置。

## 任意方向重力

基于先前设计，可轻松实现任意方向的重力。

随重力方向旋转示例：

```cs
public bool OrientTowardsGravity = true;

public void UpdateRotation(ref Quaternion currentRotation, float deltaTime)
{
    // ..
   if (OrientTowardsGravity)
    {
        currentRotation = Quaternion.FromToRotation((currentRotation * Vector3.up), -Gravity) * currentRotation;
    }
}
```

## 移动平台

类似角色控制器，移动平台需要挂载 `PhysicsMover` 组件，该组件需要一个实现了 `IMoverController` 接口的对象。

在 `IMoverController` 实现类中与 `PhysicsMover` 关联：

```cs
public class MyMovingPlatform : MonoBehaviour, IMoverController
{
    public PhysicsMover Mover;
    // ..

    private void Start()
    {
        Mover.MoverController = this;
    }
    //..
}
```

`IMoverController` 接口要求实现 `UpdateMovement` 方法。

---

**通过动画获取位移的移动平台示例**

让动画只负责算出下一帧应该去哪里，实际移动由 `PhysicsMover` 来执行，以确保 kcc 物理系统正确运作。

使用 Animator：

```cs
public class MyMovingPlatformAnimator : MonoBehaviour, IMoverController
{
    [Header("=== Animator 设置 ===")]
    public PhysicsMover Mover;
    public Animator Animator;
    public string AnimationClipName = "PlatformMoveLoop";

    private Transform _transform;
    private Vector3 _positionBeforeAnim;
    private Quaternion _rotationBeforeAnim;

    private void Start()
    {
        _transform = transform;
        Mover.MoverController = this;

        // 让 Animator 只在 FixedUpdate 里手动驱动（避免和 PhysicsMover 冲突）
        Animator.updateMode = AnimatorUpdateMode.Manual;
    }

    // KCC 每 FixedUpdate 调用这里
    public void UpdateMovement(out Vector3 goalPosition, out Quaternion goalRotation, float deltaTime)
    {
        // 1. 记住动画前的真实位置
        _positionBeforeAnim = _transform.position;
        _rotationBeforeAnim = _transform.rotation;

        // 2. 手动驱动 Animator
        Animator.Update(deltaTime);

        // 3. 把动画算出的位置告诉 PhysicsMover
        goalPosition = _transform.position;
        goalRotation = _transform.rotation;

        // 4. 重置回动画前的位置，让 PhysicsMover 真正负责移动
        _transform.position = _positionBeforeAnim;
        _transform.rotation = _rotationBeforeAnim;
    }
}
```

使用 Animancer：

```cs
public class MyMovingPlatformSoloAnimancer : MonoBehaviour, IMoverController
{
    [Header("=== SoloAnimation 设置 ===")]
    public PhysicsMover Mover;
    public SoloAnimation SoloAnimation;

    private Transform _transform;
    private Vector3 _posBefore;
    private Quaternion _rotBefore;

    private void Awake()
    {
        _transform = transform;
        Mover.MoverController = this;

        // SoloAnimation 默认就是 Loop + 自动播放
        SoloAnimation.Play();
    }

    // KCC 每 FixedUpdate 调用这里
    public void UpdateMovement(out Vector3 goalPosition, out Quaternion goalRotation, float deltaTime)
    {
        // 1. 记住动画播放前的真实位置
        _posBefore = _transform.position;
        _rotBefore = _transform.rotation;

        // 2. 让 SoloAnimation 更新（它会自动驱动 Transform）
        SoloAnimation.Update(deltaTime);

        // 3. 把动画算出的位置告诉 PhysicsMover
        goalPosition = _transform.position;
        goalRotation = _transform.rotation;

        // 4. 重置回去，让 PhysicsMover 真正负责移动
        _transform.position = _posBefore;
        _transform.rotation = _rotBefore;
    }
}
```

## 过滤碰撞箱

在 Motor 的 `IsColliderValidForCollisions()` 回调中返回 `false` 以过滤特定碰撞箱。

Example：

```cs
public List<Collider> IgnoredColliders = new List<Collider>();

public bool IsColliderValidForCollisions(Collider coll) => !IgnoredColliders.Contains(coll))
```

## 关闭物理和碰撞检测

通常会同时调用三种方法以关闭物理和碰撞检测：
- `Motor.SetCapsuleCollisionsActivation(false)`：使胶囊体不参与 Unity 物理引擎的碰撞检测（对实际表现无明显影响，只调用另外两个方法也可实现穿墙）。
- `Motor.SetMovementCollisionsSolvingActivation(false)`：关闭 kcc 自定义的碰撞解决算法，物体完全不进行碰撞检测和滑动处理。
- `Motor.SetGroundSolvingActivation(false)`：关闭地面检测和地面吸附。

## 游泳

**准备工作**

游泳和默认行走行为差异很大，故将其分为两种状态：

```cs
public enum CharacterState
{
    Default,
    Swimming,
}
```

角色控制器脚本需要能切换状态（状态机）：

```cs
public void TransitionToState(CharacterState newState)
{
    CharacterState tmpInitialState = CurrentCharacterState;
    OnStateExit(tmpInitialState, newState);
    CurrentCharacterState = newState;
    OnStateEnter(newState, tmpInitialState);
}

public void OnStateEnter(CharacterState state, CharacterState fromState)
{
    switch (state)
    {
        case CharacterState.Default:
            {
                Motor.SetGroundSolvingActivation(true);
                break;
            }
        case CharacterState.Swimming:
            {
                // 游泳状态关闭地面检测
                Motor.SetGroundSolvingActivation(false);
                break;
            }
    }
}

public void OnStateExit(CharacterState state, CharacterState toState)
{
    switch (state)
    {
        case CharacterState.Default:
            {
                break;
            }
    }
}
```

---

**状态检测**

在角色下添加一个游戏物体 SwimReference，用于游泳状态的检测：当 SwimReference 被水淹没时，进入游泳状态；反之回到默认状态。

在角色开始移动之前（`BeforeCharacterUpdate()`）检测是否落水：

```cs
public void BeforeCharacterUpdate(float deltaTime)
{
    // 第一次落水检测：角色是否在水中
    if (Motor.CharacterOverlap(Motor.TransientPosition, Motor.TransientRotation, _probedColliders, WaterLayer, QueryTriggerInteraction.Collide) > 0)
    {
        // 第二次落水检测：SwimReference 也在水中
        if (Physics.ClosestPoint(SwimmingReferencePoint.position, 
                _probedColliders[0], 
                _probedColliders[0].transform.position, 
                _probedColliders[0].transform.rotation) == SwimmingReferencePoint.position)
        {
            if (CurrentCharacterState == CharacterState.Default)
            {
                TransitionToState(CharacterState.Swimming);
                _waterZone = _probedColliders[0];
            }
        }
        else
        {
            // SwimmingReference 不在水中，回到默认状态
            if (CurrentCharacterState == CharacterState.Swimming)
            {
                TransitionToState(CharacterState.Default);
            }
        }
    }
}
```

> [!TIP]
> `Physics.ClosestPoint()` 会返回碰撞体上离某位置最近的点；如果这个位置本来就在碰撞体内部，或者正好在边界上，它会直接返回输入位置本身。

---

**游泳逻辑**

在水下时，角色会根据输入和摄像机的朝向移动，类似于 CS2 中的 noclip 模式。当角色将在下一帧离开水面时，将速度向量重新投影到水平面上（字面意思~）。除非角色按下跳跃键或沿斜面往地面走，否则不让角色游出水面。

Example：

```cs
public void UpdateVelocity(ref Vector3 currentVelocity, float deltaTime)
{
    switch(CurrentCharacterState)
    {
        case CharacterState.Default:
            // ..
            break;
        case CharacterState.Swimming:
            
            float verticalInput = 0f + (_jumpInputIsHeld ? 1f : 0f) + (_crouchInputIsHeld ? -1f : 0f);

            // 平滑插值
            Vector3 targetMovementVelocity = (_moveInputVector + Motor.CharacterUp * verticalInput).normalized * SwimmingSpeed;
            Vector3 smoothedVelocity = Vector3.Lerp(currentVelocity, targetMovementVelocity, 1 - Mathf.Exp(-SwimmingMovementSharpness * deltaTime));

            // 计算 SwimmingReference 下一帧的位置
            Vector3 resultingSwimmingReferancePosition = SwimmingReferencePoint.position + smoothedVelocity * deltaTime;
            Vector3 closestPointWaterSurface = Physics.ClosestPoint(
                resultingSwimmingReferancePosition,
                _waterZone,
                _waterZone.transform.position,
                _waterZone.transform.rotation
            );

            // 如果 SwimmingReference 将要离开水面
            if (closestPointWaterSurface != resultingSwimmingReferancePosition)
            {
                Vector3 waterSurfaceNormal = (resultingSwimmingReferancePosition - closestPointWaterSurface).normalized;
                smoothedVelocity = Vector3.ProjectOnPlane(smoothedVelocity, waterSurfaceNormal);

                // 如果按下跳跃键，跃出水面
                if (_jumpRequested)
                {
                    smoothedVelocity += (Motor.CharacterUp * JumpSpeed) - Vector3.Project(currentVelocity, Motor.CharacterUp);
                }
            }
        
            currentVelocity = smoothedVelocity;
            break;
            
    }
}
```

## 根据目标计算速度

根据目标位置计算速度：

```cs
// 返回在下一个角色更新帧内移动到目标位置所需的速度
var currentVelocity = Motor.GetVelocityForMovePosition(Motor.TransientPosition, targetPosition, deltaTime);
```

## 根运动 

如需应该根运动，需要将 `OnAnimatorMove()` 中的位移和旋转转化为 kcc 可用的速度。

**Example**

首先在 `OnAnimatorMove()` 方法记录位移和旋转：

```cs
Vector3 _rootMotionPositionDelta;
Quaternion _rootMotionRotationDelta;

void OnAnimatorMove()
{
    _rootMotionPositionDelta += CharacterAnimator.deltaPosition;
    _rootMotionRotationDelta = CharacterAnimator.deltaRotation * _rootMotionRotationDelta;   
}
```

在 `UpateVelovity()` 和 `UpdateRotation()` 中计算和更新速度/旋转：

```cs
 public void UpdateVelocity(ref Vector3 currentVelocity, float deltaTime)
{
    if (!Motor.GroundingStatus.IsStableOnGround)
    {
        // .. 处理重力
        return;
    }
    
    currentVelocity = _rootMotionPositionDelta / deltaTime;
    currentVelocity = Motor.GetDirectionTangentToSurface(currentVelocity, Motor.GroundingStatus.GroundNormal) * currentVelocity.magnitude;
}

public void UpdateRotation(ref Quaternion currentRotation, float deltaTime) =>
    currentRotation = _rootMotionRotationDelta * currentRotation;
```

最后在 `AfterCharacterUpdate()` 中清理状态：

```cs
public void AfterCharacterUpdate(float deltaTime)
{
    _rootMotionPositionDelta = Vector3.zero;
    _rootMotionRotationDelta = Quaternion.identity;
}
```

## 帧完美旋转

由于角色移动是基于带插值的 `FixedUpdate`，在高帧率下玩家可能会注意到：即使完全不给角色旋转添加任何平滑处理，其旋转仍会有一点延迟。这在可能需要极致响应的游戏中导致问题，例如第一人称射击游戏。

解决方法：挂有 kcc 组件的根物体仍在 `FixedUpdate()` 中旋转，代表角色外观/Mesh 的子物体则每帧旋转。

**Example**

控制玩家输入的脚本：

```cs
public class MyPlayer : MonoBehaviour
{
    // ..
    
    private void Update()
    {
        HandleCharacterInput();
    }

    private void LateUpdate()
    {
        HandleCameraInput();
        Character.PostInputUpdate(Time.deltaTime, OrbitCamera.transform.forward);
    }
    
    // ..
}
```

角色控制器脚本中的 `PostInputUpdate()`：

```cs
public void SetInput()
{
    // ..
    _lookInputVector = cameraPlanarDirection;
}

public void PostInputUpdate(float deltaTime, Vector3 cameraForward)
{
    _lookInputVector = Vector3.ProjectOnPlane(cameraForward, Motor.CharacterUp);

    Quaternion newRotation = default;
    HandleRotation(ref newRotation, deltaTime);
    MeshRoot.rotation = newRotation;
}

private void HandleRotation(ref Quaternion rot, float deltaTime) => 
    rot = Quaternion.LookRotation(_lookInputVector, Motor.CharacterUp);
```
 
## 手动模拟

如需对模拟过程精确控制，可将 `KinematicCharacterSystem.AutoSimulation` 设置为 `false`。

此时模拟的执行将由你自己负责。这在网络同步等场景中非常有用，你可能需要在同一帧内多次调用 `Simulate()` 来重新模拟过去的输入。

建议查看 `KinematicCharacterSystem.FixedUpdate()` 的源码，以了解默认的自动模拟循环是如何实现的。

## 额外内容

**Navmesh**

要让 KCC使用 NavMesh，请按以下步骤操作：

- 使用适合你角色胶囊体半径、台阶高度等的 Agent 参数烘焙 NavMesh。
- 使用你选择的 NavMesh 解决方案计算路径查询。
- 给 KCC 一个速度，让它朝向 NavMesh 路径上计算出的下一个点前进。你可以根据需要让这个行为变得非常简单或非常复杂。

---

**网络同步**

Kinematic Character Controller 在设计时就考虑了权威服务器网络架构，并支持延迟补偿（lag-compensation）和客户端预测（client-side prediction）。因此它具有以下特性：

- 模拟可以手动驱动（Tick）这通过 `KinematicCharacterSystem` 实现：
  - 确保在运行时通过脚本将 `KinematicCharacterSystem.AutoSimulation` 设置为 `false`。
  - 游戏代码中调用 `KinematicCharacterSystem.Simulate(deltaTime)`。这就是驱动角色模拟的 Tick 操作。

- 移动短时间内内有足够确定性，适合客户端预测。
  - 角色状态可以轻松保存和应用这通过 `KinematicCharacterMotor` 实现：
  - 调用 `KinematicCharacterMotor.GetState()` 获取包含当前状态所有必要信息的结构体。
- 调用 `KinematicCharacterMotor.ApplyState()` 立即应用已有的状态。

- 输入处理由你自己负责（不在角色类内部自动处理）。
- 默认插值可以关闭，以便让你自行处理特定的网络插值：在运行时将`KinematicCharacterSystem.Interpolate` 设置为 `false`。

具体如何实现良好的网络架构，或如何将 KCC 集成到现有的网络系统中，超出了本项目的范围。不过，这里有一些关于快速节奏多人游戏网络的优秀学习资源：

- “*Fast-Paced Multiplayer”，作者 Gabriel Gambetta*（请阅读全部 4 部分）

  http://www.gabrielgambetta.com/client-server-game-architecture.html

- *“The DOOM III Network Architecture”，作者 J.M.P. van Waveren*

  http://mrelusive.com/publications/papers/The-DOOM-III-Network-Architecture.pdf
- *“Source Multiplayer Networking”，作者 Valve*

  https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking
- “Making Fast-Paced Multiplayer Networked Games is Hard”，作者 Mark Mennell

  https://www.gamasutra.com/blogs/MarkMennell/20140929/226628/Making_FastPaced_Multiplayer_Networked_Games_is_Hard.php
- *“Snapshot Interpolation”，作者 Glenn Fielder*（他的其他文章也非常有价值，但目前这一篇就足够了）

  https://gafferongames.com/post/snapshot_interpolation/

## 补充与经验之谈

KCC 把速度分成了几部分：

| 属性 / 变量                                      | 含义               | 包含什么内容                                 | 什么时候用          |
| -------------------------------------------- | ---------------- | -------------------------------------- | -------------- |
| **Motor.BaseVelocity**                       | 角色自身运动的速度（最常用）   | 你自己设置的移动、跳跃、冲刺速度                       | 读取用            |
| **ref currentVelocity** (UpdateVelocity 参数)  | 当前帧正在计算的速度（引用传递） | 进入 `UpdateVelocity` 时 `= BaseVelocity` | 在状态机/控制器中修改速度用 |
| **Motor.Velocity**                           | 最终实际移动的速度（只读为主）  | `BaseVelocity` + 平台速度                  | 读取最终速度         |
| **Motor.StableInteractiveRigidbodyVelocity** | 站立的移动平台带给角色的速度   | 只包含平台的速度                               | 动画、音效判断        |
`KinematicCharacterMotor.BaseVelocity` 是 KCC 中非常核心的一个属性，它代表：角色自身运动产生的速度（不包含平台/移动物体的带动速度）。常用于获取角色移动方向，也可用于某些需要立即清除残留速度的场景。

---

KCC 适合于 3D 角色，但如果用于 3D 世界中的 2D 角色，推荐旋转不要完全依赖修改 `UpdateRotation()` 方法，而可以使用 `SpriteRender` 中的 `flipX` 选项。

**两个个硬用 `UpdateRotation()` 方法的示例**

移动状态：

```cs
// 按需更改左右方向
public override void UpdateRotation(ref Quaternion currentRotation, float deltaTime)
{
	base.UpdateRotation(ref currentRotation, deltaTime);
	
	currentRotation = Quaternion.LookRotation(
		// 这里的 CameraDirection 是已经投影到角色水平面上的
		_player.IntentData.CameraDirection, 
		_player.Motor.CharacterUp);
	
	// 计算水平速度，如果太小就不旋转了
	Vector3 horizontalVel = Vector3.ProjectOnPlane(
		_player.Motor.BaseVelocity,
		_player.Motor.CharacterUp);
	if (horizontalVel.sqrMagnitude < 0.1f) return;
	
	// 判断角色的移动方向和 2d 角色的面朝方向是否一致
	bool isOpposite = Vector3.Dot(
		_player.Motor.BaseVelocity, 
		currentRotation * Vector3.right) < 0;
	
	if (isOpposite)
	{
		currentRotation =Quaternion.LookRotation(
			-_player.IntentData.CameraDirection, 
			_player.Motor.CharacterUp);
	}
}
```

站立状态：

```cs
// 根据之前的状态计算自己的旋转
public override void UpdateRotation(ref Quaternion currentRotation, float deltaTime)
{
	base.UpdateRotation(ref currentRotation, deltaTime);
	// 计算默认状态下的旋转
	var newRotation = Quaternion.LookRotation(
		_player.IntentData.CameraDirection, 
		_player.Motor.CharacterUp);
	
	// 此处的目的是为了保留上个状态的左右旋转
	// 如果默认状态下的旋转和上次旋转差距过大，就说明先前做过一次水平翻折旋转
	float angle = Quaternion.Angle(currentRotation, newRotation);
	currentRotation = angle > 160f 
		? Quaternion.LookRotation(-_player.IntentData.CameraDirection, _player.Motor.CharacterUp) 
		: newRotation;
}
```

顺便一提，这个例子只要将 `currentRotation * Vector3.right` 替换为 `_player.transform.right` 就会出现角色反复翻折鬼畜的问题，你仔细头脑风暴下就能明白：从第二次 Update 中 `if(isOpposite) {}` 代码块不会执行就开始出问题了。**总之就是尽可能不要使用 `transform` 中的属性**。