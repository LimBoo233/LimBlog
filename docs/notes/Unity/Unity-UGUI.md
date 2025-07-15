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

## 三大基础控件

### Image——图像控件
1. Image是什么？
- 是UGUI中用于显示精灵图片的关键组件
- 除了背景图等大图，一般都使用Image来线束UI中的图片元素
2. 相关参数
- `Source lmage`:图片来源(图片类型必须是”精灵“类型)
- `Color`:图像的颜色
- `Material`:图像的材质(一般不修改，会使用U的默认材质)
- `Raycast Target`:是否作为射线检测的目标(如果不勾选将不会响应射线检测)
- `Maskable`:是否能被遮罩(之后结合遮罩相关知识点进行讲解)
- `Image Type`:图片类型
    - `Simple`-普通模式，均匀缩放整个图片
    - `Sliced`-切片模式，9宫格拉伸，只拉伸中央十字区域(需要在图片上设置边框)
    ::: tip
    需要安装2D Sprite包
    下图为切片模式效果,左边为切片模式，右边为普通模式
    :::
    ![切片模式效果](./images/切片模式.png)
    - `Tiled`-平铺模式，重复平铺中央部分
    - `Filled`-填充模式
        - `Fill Method`:填充方式
        - `Fill Origin`:填充原点
        - `Fill Amount`:填充量
        - `Clockwise`:顺时针方向
        - `Preserve Aspect`:保持宽高比
- `Use Sprite Mesh`:使用精灵网格，勾选的话Unity会帮我们生成图片网格
- `Preserve Aspect`:确保图像保持其现有尺寸
- `Set Native Size`:设置为图片资源的原始大小
3. 代码控制
```c#
   void Start()
    {
        Image image = this.GetComponent<Image>();
        image.sprite = Resources.Load<Sprite>("ui_TY_fanhui_01");
        //其余均可点出来使用
    }
```
:::tip
一定要注意将图片类型转换为精灵
:::

### Text——文本控件
:::warning
注意在新版Unity中Text已经被遗弃，使用的是TextMeshPro
TextMeshPro会在后续的课程中讲解
:::
|特性    | Text  | TextMeshPro       |
|-------|--------|------------------|
|渲染质量| 低分辨率，缩放时易模糊  | 高分辨率，缩放时保持锐利（SDF技术）。          |
|  性能  |轻量级，但大文本或复杂UI效率较低。 | 优化更好，适合大量文本或动态内容。     |
| 富文本支持   | 仅支持简单标签  | 支持复杂富文本（颜色、动画、超链接等）  |
| 字体控制     | 有限（依赖系统字体或动态字体）。	   | 支持自定义SDF字体、字距调整、基线控制等。        |
|多语言支持    | 基础支持（依赖字体字符集）。   | 更好支持（如表情符号、特殊字符）。     |
| 动态布局     | 	需手动调整   | 支持自动换行、文本对齐、溢出处理等。        |
|3D场景文本    | 仅限UI Canvas。   | 	支持3D场景中的TextMeshPro组件    |

1. 相关参数
![Text相关参数](./images/Text相关参数.png)
#### 富文本开启后
可以以类似html的格式对文本进行编辑
```html
<i><b>1231</b>23123131123</i>
```

### RawIamge——原始图像控件    
1. 是什么?
- 是UGUI中用于显示任何纹理图片的关键组件
- 它和Image的区别是 一般RawImage用于显示大图(背景图，不需要打入突击的图片，网络下载的图等等)
2. 参数相关
- `Texture`:图像纹理
- `UV Rect`:图像在UI矩形内的偏移和大小
- 位置偏移X和Y(取值0~1)
- 大小偏移W和H(取值0~1)
- 改变他们图像边缘将进行拉伸来填充UV矩形周围的空间
3. 代码控制
```c#
    void Start()
    {
        RawImage raw = GetComponent<RawImage>();
        raw.texture = Resources.Load<Texture>("ui_TY_erjikuang_01");
    }
```
## UGUI——组合控件

### Button组合控件
1. `Button`是什么
- 是UGUI中用于处理玩家按钮相关交互的关键组件
- 默认创建的`Button`由2个对象组成
- 父对象——B`utton`组件依附对象 同时挂载了一个Image组件作为按钮背景图
- 子对象——按钮文本(可选)
:::tip
由于旧的Text文本已经被遗弃，现在子对象上的组件是`TextMeshPro`，其余无大区别
:::
2. 相关重要参数
- `Interactable`:是否接受输入
- `Transition`:响应用户输入的过渡效果
    - `None`:没有状态变化效果
    - `ColorTint`:用颜色表示不同的状态变化
    - `Sprite Swap`:用图片表示不同状态的变化
    -  `Animation`:用动画表示不同状态的变化
- `Navigation`:导航模式,可以设置UI元素如何在播放模式中控制导航
3. 代码控制
```c#
    void Start()
    {
        Button btn = this.GetComponent<Button>();
        btn.interactable = true;
        Image img = this.GetComponent<Image>();
    }
```
4. 监听点击事件的两种方式
- 点击事件是在按钮区域按下抬起一次 就算点击
```c#
public class L10 : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        Button btn = this.GetComponent<Button>();
        btn.interactable = true;
        Image img = this.GetComponent<Image>();
        //1.通过拖的形式
        //2.采用代码添加法
        btn.onClick.AddListener(ClickBtn2);
        btn.onClick.AddListener(() =>
        {
            print("通过表达式直接添加");
        });
        btn.onClick.RemoveListener(ClickBtn2);
    }
    public void ClickBtn()
    {
        print("按钮点击，通过拖代码的形式");
    }

    private void ClickBtn2()
    {
        print("按钮点击，通过代码的形式");
    }
}
```
### `Toggle`开关控件
1. `Toggle`是什么
- 是UGUI中用于处理晚间单选框多选框相关交互的关键组件
- 可以通过配合ToggleGroup组件制作为单选框
- 默认个创建的Toggle由4个对象组成
- 父对象——Toggle组件依附
- 子对象——背景图（必备）、选中图（必备）、说明文字（可选）
2. 相关重要参数
- `IsOn`:当前是否处于打开状态
- `Toggle Transition`:在开关值变化时的过渡方式
    - `None`:无任何过渡直接显示隐藏
    - `Fade`:淡入淡出
- `Graphic`: 用于表示选中状态的图片
- `Group`: