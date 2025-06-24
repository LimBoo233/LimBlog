# Unity入门

## Lesson 5 时间

### 1. 时间缩放比例
```c#
Time.timeScale = 1f;
```

### 2. 帧间隔时间（秒）
主要是用来计算位移的，需要根据需求选择。
1. 如果希望游戏暂停时候不动的，使用deltaTime。
2. 如果希望不受暂停影响，使用unscaledDeltaTime。

受scale影响的 - Time.deltaTime。

不受scale影响的 - Time.unscaledDeltaTime。

### 3. 游戏开始到现在时间
它主要用来单机游戏的计时。

```c#
Time.time;
Time.unscaledTime;
```

### 4. 物理时间间隔
```c#
private void FixedUpdate()
{
    // 受scale影响
    Time.fixedDeltaTime;
    // 不受scale影响
    Time.fixedUnscaledDeltaTime;
}
```

### 5. 帧数
```c#
Time.frameCount;
```

### 总结
最常用的:
1. 帧时间间隔：用于计算位移相关内容
2. 时间缩放比例：用来暂停，倍速
3. 帧数（帧同步）

## Lesson 6 向量
### 1. 位置
```c#
// 相对世界坐标系
Vector3 position = transform.position;
// 相对父对象
Vector3 localPosition = transform.localPosition;
```

### 2. 朝向
```c#
Vector3 forward = transform.forward;
Vector3 right = transform.right;
Vector3 up = transform.up;
```

### 3.位移
除了直接+，-，还可以使用Translate方法。一般使用API进行位移。
```c#
// 相对坐标系
transform.Translate(Vector3.forward * speed * Time.deltaTime);
// 世界坐标系
transform.Translate(Vector3.forward * speed * Time.deltaTime, Space.World);
```

## Lesson 8 缩放

### 1. 缩放
缩放只能修改本地坐标系缩放，缩放没有提供修改的API。
```c#
// 相对世界坐标系
Vector3 scale = transform.lossyScale;
// 相对父对象
Vector3 localScale = transform.localScale;
```

### 2. 看向
```c#
transform.LookAt(Camera.main.transform);
```

## Lesson 9 父子关系
### 1. 获取和设置父对象
```c#
Transform parent = transform.parent;
transform.SetParent(newParent);

print(transform.parent?.name ?? "null");
```

### 2. 解除子对象
解除所有的子对象：
```c#
transform.DetachChildren();
```

### 3. 获取子对象

获取子对象有两种方式：
1. 通过索引获取（失活对象也会被计算）
```c#
for (int i = 0; i < transform.childCount; i++)
{
    print(transform.GetChild(i));
}
```

2. 通过名称获取（也可以找到失活对象）
```c#
Transform child = transform.Find("ChildName");
```

### 4. 子对象的操作
```c#
// 判读自己是否是某个对象的子对象
transform1.IsChildOf(transform);

// 获取自身作为子对象的编号
transform1.GetSiblingIndex();

// 把自己设置为第一个儿子
transform1.SetAsFirstSibling();

// 最后一个
transform1.SetAsLastSibling();

// 设置自己为指定编号
// 越界或负数时会设置为最后一个
transform1.SetSiblingIndex(2);
```

## Lesson 10 坐标转化
世界坐标系转化为本地坐标系: 
- 可以帮我们判断一个相对位置。
```c#
// 点
// 受到缩放影响（会除上一个缩放大小）
transform.InverseTransformPoint(Vector3.forward);

// 方向
// 不受缩放影响
transform.InverseTransformDirection(Vector3.forward);
// 受到缩放影响
transform.InverseTransformVector(Vector3.forward); 
```

## Lesson 12 屏幕
1. 静态属性
```c#
// 当前显示器分辨率
Resolution r = Screen.currentResolution;
print($"{r.width} x {r.height}");

// 屏幕窗口当前宽高
// 一般用下面的做窗口宽高的计算
print($"{Screen.width} x {Screen.height}");

// 屏幕休眠模式
Screen.sleepTimeout = SleepTimeout.NeverSleep;
```

*不常用的：*

```c#
// 是否全屏
bool isFullScreen = Screen.fullScreen;
// 窗口模式
// 独占全屏，全屏窗口，最大化窗口，窗口模式
Screen.fullScreenMode = FullScreenMode.MaximizedWindow;

// 移动设备屏幕转向
// 运行自动旋转为左横向
Screen.autorotateToLandscapeLeft = true;

// 指定屏幕显示的方向
Screen.orientation = ScreenOrientation.AutoRotation;
```

2. 静态方法
```c#
// 设置分辨率 一般移动设备不用
Screen.SetResolution(1920, 1080, false);
```

## Lesson 14 相机
1. 重要静态成员
```c#
# region 1. 获取摄像机
// 主摄像（必须有tag为MainCamera的摄像机）
print(Camera.main.name);
// 获取摄像机数量
print(Camera.allCamerasCount);
// 获得所有摄像机
Camera[] allCameras = Camera.allCameras;
# endregion

# region 2. 渲染相关委托
// 摄像机剔除前处理委托函数
Camera.onPreCull += (c) => {};
// 摄像机 渲染前处理委托
Camera.onPreRender += (c) => {};
// 摄像机 渲染后处理委托
Camera.onPostRender += (c) => {};
# endregion
```

2. 重要成员
```c#
# region 1. 界面上的参数，都可以在Camera上获取到
Camera.main.depth = -1;
# endregion

# region 2. 世界坐标转屏幕坐标
// 转化后，x和y对应的就是屏幕坐标，z对应的是这个坐标距屏幕的纵深距离
// 用的最多的地方时用来制作头顶进度条的功能
Vector3 screenPoint = Camera.main.WorldToScreenPoint(Vector3.forward);
# endregion

# region 3. 屏幕坐标转世界坐标
// 如果不改变z，转换过去的永远都是一个点，即相机世界坐标
Vector3 position = Input.mousePosition + Vector3.forward * 10;
print(Camera.main.ScreenToWorldPoint(position));
# endregion
```

## Lesson 15 光源
面板上的参数都可以通过代码控制。
```c#
myLight.intensity = .5f;
```

## Lesson 16 碰撞
1. 物理碰撞检测响应函数
```c#
// 碰撞接触触发时，会自动执行这个函数
private void OnCollisionEnter(Collision collision)
{
    // Collision 包含了碰到自己的对象的信息
    
    // 关键参数
    // 1. 碰撞到的对象碰撞器的信息
    collision.collider;

    // 2. 碰撞对象的依附的对象
    collision.gameObject;

    // 3. 碰撞对象的依附对象的位置信息
    collision.transform;

    // 4. 触碰点数
    int contactCount = collision.contactCount;
    ContactPoint[] contacts = collision.contacts;
}

// 碰撞结束分离时
private void OnCollisionExit(Collision collision)
{
    // 处理碰撞结束的逻辑
}

// 两个物体相互接触时，不停地调用
private void OnCollisionStay(Collision collision)
{
    // 处理碰撞持续的逻辑
}
```

2. 触发器检测函数
```c#
// 第一次接触会调用
private void OnTriggerEnter(Collider other)
{
    // 处理触发器进入的逻辑
}

// 触发器分离时
private void OnTriggerExit(Collider other)
{
    // 处理触发器分离的逻辑
}

// 两个物体相互接触时，不停地调用
private void OnTriggerStay(Collider other) 
{
    // 处理触发器持续的逻辑
}
```

## Lesson 17 刚体加力
1. 刚体自带添加力的方法
```c#
_rigidbody = GetComponent<Rigidbody>();

// 添加力
// 本地坐标系
_rigidbody.AddRelativeForce(Vector3.forward * 10);
// 世界坐标系
_rigidbody.AddForce(Vector3.forward * 10);

// 添加扭矩
// 本地坐标系
_rigidbody.AddRelativeTorque(Vector3.up * 10);
// 世界坐标系
_rigidbody.AddTorque(Vector3.up * 10);

// 直接改变速度
_rigidbody.velocity = Vector3.forward * 10;

// 模版爆炸的效果
// 只影响本身
// 所有想要被爆炸影响的对象都要调用他们刚体的这个方法
_rigidbody.AddExplosionForce(10, Vector3.zero, 10);
```
2. 力的几种模式- 第二个参数
    - 力的模式 
    - 主要的作用就是**计算方式不同**


```c#
// 1. Acceleration
// 给物体一个持续的加速度，忽略其质量
// t：物理帧间隔 
// m：1kg
_rigidbody.AddForce(Vector3.forward, ForceMode.Acceleration);

// 2. Force
// 给物体一个持续的力，受质量影响
// t：物理帧间隔
_rigidbody.AddForce(Vector3.forward, ForceMode.Force);

// 3. Impulse
// 给物体一个瞬间的冲击力，时间默认为1
_rigidbody.AddForce(Vector3.forward, ForceMode.Impulse);

// 4. VelocityChange
// 给物体一个瞬间的速度变化，忽略其质量
_rigidbody.AddForce(Vector3.forward, ForceMode.VelocityChange);
```

3. 力场脚本
存在一个叫做ConstantForce的脚本，可以给物体添加一个持续的力。

4. 补充：刚体休眠
```c#
_rigidbody.Sleep();
if (_rigidbody.IsSleeping())
{
    _rigidbody.WakeUp();
}
```

## Lesson 20 代码控制音频
---
一个音频播放器的初始化：
```c#
public class AudioContoller : MonoBehaviour
{
    private AudioSource _audioSource;

    [SerializeField] private GameObject obj;
    [SerializeField] private AudioClip clip;

    private void Start() 
    {
        _audioSource = GetComponent<AudioSource>();
        _audioSource.playOnAwake = false;
    }
 
}
```
---

1. 代码控制播放
```c#
// 播放音频
_audioSource.Play();
// 延迟播放（秒）
_audioSource.PlayDelayed(5f);

// 停止播放
_audioSource.Stop();

// 暂停播放
_audioSource.Pause();

// 取消暂停 和 暂停后play 效果是一样的
_audioSource.UnPause();
```

2. 如何检测音效播放完毕

如果希望在某一个音效完后，做些事情，那么可以在update函数中，不停地去检测它的属性。如果是false就代表播放完毕了。

```c#
private void Update()
{
    if (!_audioSource.isPlaying)
    {
        // 播放完毕
        print("播放完毕");
    }
}
```

3. 如何动态的控制音效播放
    - 直接在要播放音效的对象上挂载脚本，控制播放。
    - 实例化挂载了音效源脚本的对象。
        - 这种方法使用较少
        ```c#
        Instantiate(obj);
        ```
    - 用一个AudioSource来控制播放不同的音效
    ```c#
    // 一个GameObject可以挂载多个AudioSource脚本
    AudioSource audioSource = gameObject.AddComponent<AudioSource>();
    audioSource.clip = clip;
    audioSource.Play();
    ```

## Lesson 21 麦克风输入相关
1. 获取麦克风信息
```c#
// 获取麦克风设备列表
string[] devices = Microphone.devices;
foreach (var device in devices)
{
    print(device);
}
```

2. 开始录音
    - 参数一：设备名 默认空设备
    - 参数二：超过录制时长，是否重头录制
    - 参数三：录制时长
    - 参数四：采样率
```c#
if (Input.GetKeyDown(KeyCode.Space))
{
    _audioClip = Microphone.Start(null, false, 10, 44100);
}
```

3. 结束录制
```c#
if (Input.GetKeyUp(KeyCode.Space))
{
    Microphone.End(null);

    // 获取 AudioSource 组件
    var audioSource = GetComponent<AudioSource>();
    if (audioSource is null)
    {
        audioSource = gameObject.AddComponent<AudioSource>();
    }

    // 设置音频剪辑并且播放
    audioSource.clip = _audioClip;
    audioSource.Play();
}
```

4. 获取音频数据用于传输
    - 规则： 用于储存数组数据的长度必须等于 声道数 * 剪辑长度
```c#
float[] f = new float[_audioClip.channels * _audioClip.samples];
_audioClip.GetData(f, 0);
```

## Lesson 22 场景切换
1. 场景切换
    - 切换到场景二
```c#
// 需要把对应场景加载到场景列表当中
SceneManager.LoadScene("Scene2");

// 过时的老方法：
Application.LoadLevel("Scene2");
```

2. 退出游戏
```c#
// 在编辑模式没有用到，在运行模式下可以退出游戏
Application.Quit();
```

## Lesson 23 隐藏鼠标
1. 隐藏鼠标
```c#
// 隐藏鼠标
Cursor.visible = false;
```
2. 锁定鼠标
```c#
// None 不锁定
Cursor.lockState = CursorLockMode.None;

// Locked 锁定 鼠标会被锁定到屏幕中间并被影藏，可以通过ESC拜托编辑模式下的锁定 
Cursor.lockState = CursorLockMode.Locked;

// Confined 限制在窗口范围内
Cursor.lockState = CursorLockMode.Confined;
```

3. 设置光标图片
    - 参数一： 图片（如果不是正方形图片，会被压缩。图片的Texture Type最好设置成Cursor）
    - 参数二： 偏移位置，相对图片左上角
    - 参数三： 平台支持的光标模式（软件或硬件）
```c#
Cursor.SetCursor(texture2D, Vector2.zero, CursorMode.Auto);
```

## Lesson 24 随机数
1. 随机数
    - Unity的随机数，不是C#自己的随机数
    - int左闭右开，而float的重载是左闭右闭
```c#
int num = Random.Range(0, 100);

// C#
System.Random random = new System.Random();
```

2. 委托
    - UnityAction 是一个委托类型，和Action一样。
    - UnityEvent 是一个事件类型，和C#的事件类似。
```c#
// C#
Action ac = () => print("123");

Action<int> ac2 = i => print(1);

Func<int, int> ac3 = i => i + 1;

// Unity
UnityAction uac = () => print("234");
```
