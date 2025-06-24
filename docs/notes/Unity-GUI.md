# Unity-GUI

## 1.1 GUI是什么
全程即时模式游戏交互界面IMGUI，是一个代码驱动的UI系统。

## 1.2 GUI的主要作用
1. 程序员的调试工具。
2. 为脚本组件创建自定义检视面板。
3. 创建新的编辑器窗口和工具以扩展Unity本身。

**注意：不用它为玩家制作UI功能。**

## 1.3 GUI的使用
在继承MonoBehaviour的脚本中的特殊函数里。
1. `OnGUI()`：每帧调用一次，相当于是专门用于绘制绘制GUI的函数。
2. 一般只在其中执行GUI相关界面绘制和操作逻辑。
3. 该函数在 `OnDisable()` 之前和 `LateUpdate()` 之后调用。
```c#
private void OnGUI()
{
    // 在这里编写GUI代码
}
```

## 2.1 GUI控件绘制的共同点
1. 他们都是GUI公共类中提供的静态函数。
2. 他们的参数都大同小异
    - 位置参数：`Rect`，表示控件在屏幕上的位置和大小。
    - 文本参数：`string`，表示控件显示的文本内容。
    - 图片参数：`Texture`，表示控件显示的图片内容。
    - 综合信息：`GUIContent`，包含了位置、文本和图片等信息。
    - 自定义样式：`GUIStyle`，用于设置控件的样式。
3. 每一种控件都有多重重载，都是各个参数信息的排列组合。
    - 必备的参数是位置参数 `Rect` 和 显示信息。

## 2.2 文本控件
1. 基本用法
```c#
public class Lesson2 : MonoBehaviour
{
	[SerializeField] private Texture texture;
	[SerializeField] private Rect rect;
	[SerializeField] private GUIContent guiContent;

	private void OnGUI()
	{
        // 显示文字
		GUI.Label(new Rect(0, 0, 100, 20), "第一条信息");
        // 显示图片
		GUI.Label(rect, texture);
        // 显示文字和图片
        GUI.Label(rect, guiContent);
	}
}
```

guiContent.tooltip可以设置一个提示信息，当鼠标悬停时可以通过 `Debug.Log(GUI.tooltip);` 获取到。

2. 自定义样式
此处建议感兴趣建议查阅官方文档：
[GUIStyle](https://docs.unity.cn/cn/2021.3/ScriptReference/GUIStyle.html)
    - 核心属性
        - **Name**: 控件的名称
    - 状态（State）
        - Normal (正常显示时)
            - **Background**: 背景图
            - **Text Color**: 字体颜色
    - Hover (鼠标悬停在控件上时)
    当鼠标指针移动到按钮上方时的状态。
    - Active (按下控件时)
    当用鼠标左键点击并按住按钮时的状态。

    - Focused (具有键盘焦点时)
    当按钮通过键盘（如 Tab 键）被选中时的状态。

    - 启用状态下的交互 (On...)
    这些设置定义了当控件本身是"启用"状态时，对上述各种状态的响应。
        - **On Normal** - 处于启用状态时
        - **On Hover** - 处于启用状态并且鼠标悬停在其上方时
        - **On Active** - 启用和按下时
        - **On Focused** - 启用且具有键盘焦点时

    - 布局与边距 (Layout & Margin)
        - **Border** (背景图像边框) - 用于设置背景图的九宫格切片边框
        - **Margin** (与其他控件边距) - 按钮控件的外边距，定义其与周围其他控件的距离
        - **Padding** (边缘到内容开始处间隔空间) - 按钮的内边距，定义其边框与内部内容（如文字或图标）之间的距离
        - **Overflow** (要添加到背景图像的额外空间) - 允许内容超出背景图像边界的额外空间

    - 字体与文本 (Font & Text)
        - **Font**: None (Font) - 该控件的字体
        > 注释：不设置则使用默认字体
        - **Font Size**: 0 - 字体大小
        - **Font Style**: Normal - 字形，如常规、粗体、斜体等
        - **Alignment**: Middle Center - 文本在按钮内的对齐方式
        - **Word Wrap** - 是否自动换行，如果文本长度超过按钮宽度，是否自动换行显示
        - **Rich Text** - 启用HTML样式标记，勾选后可以在文本中使用类似 HTML 的标签来设置样式（如 `<b>` 加粗, `<color=red>` 改变颜色）
        - **Text Clipping**: Clip - 文本超出边界时的裁剪方式
        - **Image Position**: Image Left - 如果按钮同时有图片和文字，图片的相对位置

## 3.3 按钮控件
1. 基本用法
```c#
GUI.Button(btnRect, btnContent, btnStyle);
```
2. 综合使用
```c#
// 按钮按下再抬起才算一次点击
if (GUI.Button(btnRect, btnContent, btnStyle))
{
    // 按钮被点击时执行的代码
    Debug.Log("按钮被点击了");
}

// 按钮被持续按下时不断调用
if (GUI.RepeatButton(btnRect, btnContent, btnStyle))
{
    // 按钮被持续按下时执行的代码
    Debug.Log("按钮被长按");
}
```

## 4.1 多选框
1. 普通样式
```c#
private bool isSelected = false; 

private void OnGUI()`
{
    isSelected = GUI.Toggle(toggleRect, isSelected, "选项1");
}
```
2. 自定义样式
    - 修改固定宽高 `fixedWidth` 和 `fixedHeight` 属性来调整图片大小。
    - 修改从 GUIStyle 边缘到内容起始处的空间 `padding` 。
```c#
isSelected = GUI.Toggle(toggleRect, isSelected, "选项1", guiStyle);
```
## 4.2 单选框
是基于多选框的。
```c#
private int selectedIndex = 0; // 选中的索引

private void OnGUI()
{
    // 绘制单选框 - 推荐的传统方式
    if (GUI.Button(rect1, "选项1", guiStyle)) selectedIndex = 0;
    if (GUI.Button(rect2, "选项2", guiStyle)) selectedIndex = 1;
    if (GUI.Button(rect3, "选项3", guiStyle)) selectedIndex = 2;
}
```

## 5.1 输入框
1. 普通输入
```c#
private string _inputString;

private void OnGUI()
{
    // 限制长度 5
    _inputString = GUI.TextArea(new Rect(10, 10, 300, 300), _inputString, 5);
}
```
2. 密码输入
```c#
private string _inputPassword;

private void OnGUI()
{
    _inputPassword = GUI.PasswordField(new Rect(10, 10, 100, 20), _inputPassword, '*');
}
```
## 5.2 拖动条
1. 水平拖动条
```c#
public Rect rect;
private float _value;

private void OnGUI()
{
_value = GUI.HorizontalSlider(rect, _value, 0, 1);
}
```
2. 垂直拖动条
```c#
_value = GUI.VerticalSlider(rect, _value, 0, 1);
```

## 6 图片绘制和框绘制
1. 图片绘制
    - `ScaleMode.ScaleToFit`：保持图片比例缩放到适合的大小。
    - `ScaleMode.ScaleAndCrop`：保持图片比例缩放到填满整个区域，但可能会裁剪图片的一部分。
    - `ScaleMode.StretchToFill`：拉伸图片填满整个区域，可能会失去原有比例。
    - `alphaBlend`：使用透明度混合绘制图片。
    - `imageAspect`：设置图片的宽高拉伸比例。
```c#
GUI.DrawTexture(rect, texture, ScaleMode.ScaleToFit, true, 0f);
```

2. 绘制框
```c#
GUI.Box(rect, "这是一个框");
```

## 7 工具栏和选择网格
1. 工具栏
```c#
public Rect rect;
private int _toolbarIndex = 0;
private string[] _toolbarInfos = new[] { "选项一", "选项二", "选项三" };

private void OnGUI()
{
    _toolbarIndex = GUI.Toolbar(rect, _toolbarIndex, _toolbarInfos);

        switch (_toolbarIndex)
		{
			case 0:
				break;
			case 1:
				break;
			case 2:
				break;
			default:
				break;
		}
}
```
2. 选择网格
    - 相对 toolbar 多了一个参数，表示每行显示的按钮数量。
```c#
GUI.SelectionGrid(rect, _toolbarIndex, _toolbarInfos, 3);
```

## 8 滚动列表和分组
1. 分组
    - 用于批量控制控件位置。
    - 可以理解为：包裹这的控件加了一个父对象。
    - 可以通过控制分组来控制包裹控件的位置。
    ```c#
    public Rect rect;
	
	private void OnGUI()
	{
		GUI.BeginGroup(rect);
		GUI.Button(new Rect(0f, 0f, 100, 100), "<UNK>");
		GUI.Label(new  Rect(100f, 0f, 100, 100), "<UNK>");
		GUI.EndGroup();
	}
    ```
2. 滚动列表
    ```c#
    public Rect posRect;
	public Rect viewRect;

	private Vector2 _nowPos;
	
	private void OnGUI()
	{
		_nowPos = GUI.BeginScrollView(posRect, _nowPos, viewRect);
        
        // 绘制内容
        GUI.Button(new Rect(0f, 0f, 100, 100), "<UNK>");

		GUI.EndScrollView();
	}
    ```
