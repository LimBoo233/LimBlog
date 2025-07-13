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
- Constant Pixel Size:无论屏幕大小如何，UI始终保持相同像素大小
- Scale With Screen Size：根据屏幕尺寸进行缩放，随着屏幕尺寸大小缩放
- Constant Physical Size：无论屏幕大小和分辨率如何，UI元素始终保持相同物理大小

### CanvasScaler——恒定像素模式
- `Scale Factor`: 缩放系数 按此系数缩放画布中的所有UI元素
- `Reference Pixels` Per Unit: 单位参考像素，多少像素对应Unity中的一个单位
图片设置中的Pixels Per Unit设置，会和该参数一起参与计算
- 恒定像素模式计算公式: 
`UI原始尺寸 = 图片大小（像素）/(Pixels Per Unit/Reference Pixels PerUnit`

