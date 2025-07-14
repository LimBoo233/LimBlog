# Unity-UGUI

## 六大基础组件
1. Canvas对象上依附的：
    - `Canvas`:主要用于渲染UI控件
    - `Canvas Scaler`:画布分辨率自适应组件，主要用于分辨绿自适应
    - `Graphic Raycaster`:射线事件交互组件，主要用于控制射线响应相关 
    - `RectTransform`:UI对象位置锚点控制组件，主要用于控制位置和其对应方式
2. EventSystem对象上依附的
    - `EventSystem`:玩家输入事件相应系统
    - `Standalone Input Moudle`:独立输入模块组件,用于监听玩家操作
### Canvas-渲染模式的控制
1. Canvas组件用来干什么
    - Canvas是UGUI中所有UI元素能够被显示的根本
    - 主要负责渲染自己的所有UI子对象
2. 场景中可以有多个Canvas对象 
    - 可以分别管理不同画布的渲染方式，分辨率自适应方式等等参数
    - 如果没有特殊需求，一般一个场景上一个Canvas对象即可
### Canvas组件的三种渲染方式 
- `Screen Space - Overlay`:屏幕空间，覆盖模式，UI始终在前
    - `Pixel Perfect`: 是否开启无锯齿精确渲染模式(性能换效果)
    - `Sort Order`:排序层编号（用于控制多个Canvas时的渲染先后顺序）
    - `Target Dislay`:目标设备(在哪个显示设备上显示)
    - `Additional Shader Channels`:其他着色器通道，决定着色器可以读取那些数据
- `Screen Space - Camera`:屏幕空间，摄像机模式，3D物体可以显示在UI之前
    - `Render Camer`：用于渲染UI的摄像机（如果不设置效果将类似与覆盖模式，不建议设置成主摄像机）
        - 分离主摄像机与UI摄像机,让UI摄像机只渲染自己的图层
    - `Plane Distance`:UI平面在摄像机前方的距离，类似整体Z轴的感觉
    - `Sorting Layer`:所在排序层
    - `Order in Layer`:排序层的序号
- `World Space`:世界空间，3D模式
    - `Event Camera`:用于处理UI事件的摄像机(如果不设置不能正常注册UI事件)

### CanvasScaler——必备知识
1. 用来干什么
- 画布缩放控制器，在不同分辨率下UI控件大小自适应
- 但并不负责位置，位置由`RectTransform`来控制
2. 学前准备
- 画布大小和缩放系数
    - 选中Canvas对象后，在RectTransform组件中可以看到宽高和缩放
    - 宽高 * 缩放系数= 屏幕分辨率
3. CanvasScaler的三种适配模式
- `Constant Pixel Size`:无论屏幕大小如何，UI始终保持相同像素大小
- `Scale With Screen Size`：根据屏幕尺寸进行缩放，随着屏幕尺寸大小缩放
- `Constant Physical Size`：无论屏幕大小和分辨率如何，UI元素始终保持相同物理大小

### CanvasScaler——恒定像素模式
- `Scale Factor`: 缩放系数 按此系数缩放画布中的所有UI元素
- `Reference Pixels` Per Unit: 单位参考像素，多少像素对应Unity中的一个单位
图片设置中的Pixels Per Unit设置，会和该参数一起参与计算
- 恒定像素模式计算公式: 
`UI原始尺寸 = 图片大小（像素）/(Pixels Per Unit/Reference Pixels PerUnit`

### CanvasScaler——缩放模式
- `Reference Resolution`:参考分辨率
- `Screen Match Mode`:屏幕匹配模式，当前屏幕分辨率宽高比不适应参考分辨率时，
用于分辨率大小自适应的匹配模式

    - `Expand`: 水平或垂直拓展画布区域，会根据宽高比的变化大小来放大缩小画布，可能有黑边
        - 拓展匹配，将Canvas Size进行宽或高扩大，让他高于参考分辨率
        - 计算公式：缩放系数 = Mathf.Min(屏幕宽/参考分辨率宽, 屏幕高/参考分辨率高)
        - 画布尺寸 = 屏幕尺寸/缩放系数
    - `Shrink`: 水平或垂直裁剪画布区域，会根据宽高比的变化来放大缩小画布，可能会裁剪
        - 收缩匹配，将Canvas Size进行宽或高收缩，让他低于参考分辨率
        - 计算公式：缩放系数 = Mathf.Max(屏幕宽/参考分辨率宽, 屏幕高/参考分辨率高)
        - 画布尺寸 = 屏幕尺寸/缩放系数
    - `Match Width Or Height`:以宽高或者二者的平均值作为参考来缩放画布区域
        - 宽高匹配：以宽高或者二者的某种平均值作为参考来缩放画布
        - Match：确定用于计算的宽高匹配值

### CanvasScaler——恒定物理模式(一般不会使用)
- `DPI`：图像每英寸长度内的像素点数
- `Physical Unit`：物理单位，使用的物理单位种类
- `Fallback Screen DPI`：备用DPI，当找不到设备DPI时，使用此值
- `Default Sprite DPI`：默认图片DPI
- 计算公式：新单位参考像素 = 单位参考像素 *Physical Unit/Default Sprite DPI

### Graphic Raycater——图形射线投射器组件
1. 用来干什么？
- 意思是图形射线投射器
- 用于检测UI输入事件的射线发射器
- 主要负责通过射线检测玩家和UI元素的交互，判断是否点击到了UI元素
2. 相关参数
- `Ignore Reversed Graphics`:是否忽略反转图形 
- `Blocking Objects`: 射线被哪些类型的碰撞器阻挡（在覆盖渲染模式下无效）
- `Blocking Mask`: 射线被哪些层级的碰撞器阻挡（在覆盖渲染模式下无效）

### EventSystem和Standalone Input Module
1. EventSystem组件用来干什么
- 它是用于管理玩家的输入事件并分发给各UI控件
- 它是实践逻辑处理模块
- 所有的UI事件都通过EventSystem组件中轮询检测并做相应的执行
- 它类似一个中转站，和许多模块一起共同协作
2. EventSystem组件参数
- `First Selected`：首先选择的游戏对象，可以设置游戏一开始的默认选择
- `Send Navigation Events`：是否允许导航事件（移动 按下 取消）
- `Drag Threshold`：拖曳操作的阈值（移动多少像素算拖曳）
3. Standalone Input Module组件用来干什么
- 独立输入模块
- 主要针对处理鼠标、键盘、控制器、触屏的输入
- 输入的事件通过EventSystem进行分发
- 他依赖于EventSystem组件，他们俩缺一不可
4. Standalone Input Module组件参数(一般不会修改)
- `Horizontal Axis`:水平轴按钮对应的热键名(该名字对应Input管理器)
- `Vertical Axis`:垂直轴按钮对应的热键名(该名字对应Input管理器)
- `Submit Button`:提交(确定)按钮对应的热建名(该名字对应Input管理器)
- `Cancel Button`:取消按钮对应的热建名(该名字对应Input管理器)
- `Input Actions Per Second`:每秒允许键盘/控制器输入的数量
- `Repeat Delay`:每秒输入操作重复率生效前的延迟时间
- `ForceModule Active`:是否强制模块处于激活状态

### RectTransform
1. 用来干什么
- 继承于`Transform` 是专门用于处理UI元素位置大小相关的组件
- `Transform`组件只处理位置、角度、缩放
- `RectTransform`在此基础上加入了矩形相关，将UI元素当做矩形来处理
加入了中心点、锚点、长宽等属性
- 其目的是更加方便的控制其他笑以及分辨率自适应中的位置适应
2. 组件参数
- `Pivot`:轴心(中心)点，取值范围0~1
- `Anchors`(相对父矩形锚点)
    - Min是矩形锚点范围X和Y的最小值,
    - Max是矩形锚点范围X和Y的最大值,
    - 取值范围都是0~1
- `Pos(X,Y,Z)`:轴心点(中心点)相对锚点的位置
- `Width/Height`:矩形的宽高
- `Left/Top/Right/Bottom`:矩形边缘相对于锚点的位置;当锚点分离时会出现这些内容
- `Rotation`:围绕轴心点旋转的角度