
# TextMeshPro

## 简介

TextMeshPro (TMP) 是 Unity 引擎中目前标准且推荐的文本渲染方案。它已经完全取代了旧版的 `Unity UI Text`（Legacy）。

| **功能特性** | TMP                  | 旧版 Text        | 核心优势                       |
| -------- | -------------------- | -------------- | -------------------------- |
| **渲染原理** | **SDF (有符号距离场)**     | Bitmap (位图/像素) | 放大几百倍边缘依然锐利，不会模糊。          |
| **视觉特效** | **Shader 原生支持**      | 需挂载额外组件        | 只需调整材质即可实现描边、阴影、发光，性能开销极低。 |
| **图文混排** | **支持 `<sprite>` 标签** | 不支持            | 可以在文字中间直接插入表情包或图标。         |
| **排版控制** | **专业级**              | 基础             | 支持字间距、行间距、对齐方式、软连字符等精细调整。  |
| **性能表现** | **高 (批处理优化好)**       | 低 (特效需额外网格)    | 在大量文字和特效场景下，TMP 运行更流畅。     |
## 组件

### TMP - Text (UI)

#### 属性

大部分属性很好理解，类似于编辑 word 文档。

**通常属性**

- Material Preset：材质预设， 专为设置视觉特效
- Enable RTL Editor：从右向左书写，常用于特定语言（ex：阿拉伯语）
- Override Tags：忽略富文本标记更改文本颜色
- Alignment 
	- Geometry Center`|三|`：根据网格而不是文本居中
	- ~line：根据文字的基线对齐
	- capline：第一行中间与显示区域对其
- Wrapping：根据控件大小换行
- Overflow：当文本超出显示区域时如何显示
	- Overflow 和 Masking 效果十分类似
	- 官方推荐使用 Masking 替代 Scroll Rect
	- Page 分页推荐和 Wrapping 配合使用
	- Linked 可以让文本内容扩展到另一个 TMP-Text
- Horizontal/Vertical Mapping，Line Offset：SDF Shader 中 UV 映射，纹理拉伸相关
	- Character：每个文字在垂直/水平方向拉伸纹理
	- Line：图片会垂直/水平拉伸，覆盖这一整行文字
	- Paragraph：整个文本框区域垂直/水平拉伸纹理
	- Match Aspect：水平缩放纹理，保持长宽比，不会出现拉伸导致的变形

**Extra Settings**

主要用于处理排版边距、交互渲染以及文本解析规则。

- Geometry Sorting：排序，Normal 模式使离摄像机越近的排的越靠前 
- Is Scale Static：确认不会修改文本的 Scale，从而让 TMP 跳过缩放相关计算，以节省性能
---
- Rich Text：开启富文本
- Raycast Target：开启射线检测，使组件能被交互
- Maskable：是否能被遮罩
- Parse Escape Characters：识别转移字符（ex: `\n`）
- Sprite Asset：允许文本嵌入的图片资源
- Style Sheet Asset：应用文本样式资源，可扩充 Text Style 
---
- Visble Descender：使可见文本会逐渐下降
- Kerning：自动调整字符间距，提示可读性与美观度
- Extras Padding：自动把扩展每个字母的网格，使特效不会超出字符所在网格而不显示

#### 脚本控制

TMP Text 在代码里对应`TextMeshProUGUI`。

**基础属性**
- 内容：`text`,
- 字体样式：`font`, `fontSize`, `color`, `richText`
- 排版：`alignment`, `lineSpacing`

**常用方法**

```cs
// 1. 设置文本内容，支持富文本格式
// 组件会拖到本帧快结束时才渲染新文字（lazy）
tmpText.SetText("123")
// 2. 强行让 TMP 立即更像网格 
// 效果一定程度代替 Rebuild()，但 Rebuild() 官方建议通常不要手动调用它
tmpText.ForceMeshUpdate();
```

**获取元素数组**

```cs
var linkArr = tmpUIText.textInfo.linkInfo
//wordInfo
//characterInfo
//lineInfo
```

>详细见： [Class TextMeshProUGUI | TextMeshPro | 3.0.6](https://docs.unity.cn/Packages/com.unity.textmeshpro@3.0/api/TMPro.TextMeshProUGUI.html)

### TMP - Text

之前我们讨论的都是 **UI Text** (Canvas 里的)，而 **3D TMP Text**（在菜单里通常显示为 `3D Object` -> `Text - TextMeshPro`） 是直接存在于游戏世界（World Space）里的。其属性和 Text (UI) 高度相似。

**它的本质不是 UI，而是一个形状长得像文字的 3D 模型（Mesh）。**

代码中的区别：


```cs
// 如果是 UI 里的字：
public TextMeshProUGUI myUiText; 

// 如果是头顶飘出的伤害数字（3D）：
public TextMeshPro myWorldText; 
```

在 3D 游戏或 2.5D 游戏中，如果你转动视角，文字会变成纸片而看不清。如果你希望伤害数字无论怎么转视角，永远正对着屏幕，你需要挂一个简单的脚本（Billboard Script）在文字物体上：

```CS
void LateUpdate() {
	transform.forward = Camera.main.transform.forward;
}
```

## 字体资源

### 导入/创建字体资源

我们可以将一个字体文件（ex: `.ttf`）转化为 TMP 所需的字体资源文件（本质 Scriptable Object）。

简单点的方法，你直接右键字体资源文件，Create -> TextMeshPro -> Create Font Asset，即可创建对应 Scriptable Object。

更细致，定制化字体资源：打开创建器，点击顶部菜单栏：Window -> TextMeshPro -> Font Asset Creator。

### 字体 SO 参数

一般情况下，你都不需要手动去修改这些设置。

**Face Info**
- Update Atlas Texture：更新纹理图集
---
- Family Name：字体名称；Style Name：在 Font Family 中的变体；Point Size：图集中字号
- Scale：缩放；Line Height：行高
- Line 参数：字符位置，汉字通常只需考虑 Baseline
	- Baseline：所有的字母都坐在这一条线上，就像你写字时底下垫的那行横线
	- Mean Line：小写字母的头顶
	- Cap Line：大写字母的头顶
	- Ascent Line：字体设计中允许到达的最高点，通常比 Cap Line 还要高一点点，为类似于 Ě 的字符
---
- Underline Offset：下划线偏移，相对于 Baseline；Underline Thickness：下划线厚度
- Strikethrough Offset：删除线偏移，都是相对于 Baseline
- Superscript Offset：上标偏移量；Superscript Size：上标/下标大小比例；Subscript Offset：下标偏移
- Tab Wideth：制表符（Tab 键）宽度
--- 
**Gerneration Settings**
- Atlas Pupulation Mode：纹理图集生成方式
	- Dynamic： 纹理图集会在根据需求和源字体文件动态生成，可以显示更多字符，适合中文字体
	- Static：字体集已经被图集确定，占内存小性能高
 - Render Mode：渲染模式，效果 SDF > 平滑抗锯齿 > 位图 RASTER
 - Sampling Point Size：采样点大小，设置用于生成字体纹理的字体大小（单位：磅）
 - Atlas Width / Atals Height：图集大小
 - Multi Atlas Textures：生成多个图纹理纹理，可以在多个图集间灵活切换，性能更好
 - Clear Dynamic Data On Build：在打包时清除动态生成的数据，推荐勾选，减小包体
 ---
 **Font Weights**：主要控制字体在粗体、斜体下的样式
 - 字体资源列表：可以关联一个字体资源 SO，决定在不同样式下的显示
 - Normal Weight：正常显示下的粗细；Spacing Offset：正常显示下字符间距的偏移
 - Bold Weight：粗体粗细；Bold Offset：粗体下字符间距的偏移
 - Italic Style：斜体倾斜度
 - Tap Multiple：制表符宽度（Space 数量）
 ---
 **Fallback Font Asset**：回滚字体列表

**Character Table**：字符表，一般不修改，若有需求推荐利用 Table 修改字符

**Glyph Table**：字形表；第一行参数决定字符在图集中的位置，不要修改；BX 和 BY 是基线偏移；AD 离下一个字符宽度

**Glyph Adjustment Table**：修改特定两个字符间的间隔

> [!TIP]
> 你可以创建一个资源变体 (Create -> TMP -> Font Asset Variant) 并修改 Source Font File 来快速创建一个与先前字体配置相同的回滚字体。
### Font Asset Creator

有时用其创建字体图集，有时用其更新字体纹理图集。

- Sampling Point Size：采样点大小，auto sizeiing 会尝试尽可能填满
- Padding：图集中字符间隔大小
- Packing Method： 包装方式，调整图集中字体的布局。
	- Fast：打包速度优先，测试考虑使用
	- Optimum：最佳布局优先，确定使用改字体时使用
- Atlas Resolution：图集分辨率
	- ACSII 字符：512 x 512 即可
	- 中文字体：1024 x 1024 或更高，用于移动设备时最好不要超过 2024
- Charater Set： 字符集
	- 前几个字符集主要包括英文+字符+数字
	- Custom Range：输入数字（十进制）指定包含的 Unicode 范围（ex: `20-34, 2340`）
	- Unicode Range：输入数字（十六进制）指定包含的 Unicode 范围
	- Custom Character List / Characters from File：自定义包含的字符
- Render Mode：渲染模式，效果 SDF > 平滑抗锯齿 > 位图 RASTER 
- Get Kerning Pairs： 获取字偶间距调整 (kerning) 对，部分字符会更紧凑，提供更好视觉效果

> [!TIP]
> 拉宽 Font Asset Creator 窗口，你可以预览生成好的字体图集。

## 富文本

Rich Text 允许你在同一个文本框内，通过类似 HTML 的标签语言，给不同的字设置不同的样式。

最常用的格式化标签，用法和 HTML 几乎一样。

| 常见标签    | 语法                                                           |
| ------- | ------------------------------------------------------------ |
| 加粗      | `<b>Text</b>`                                                |
| 斜体      | `<i>Text</i>`                                                |
| 下划线     | `<u>Text</u>`                                                |
| 删除线     | `<s>Text</s>`                                                |
| 换行      | `<br>`                                                       |
| 字体大小    | `<size=数值>Text</size>`                                       |
| 颜色      | `<color=#RGBA-16>Text</color>`（十六进制）                         |
| 对齐      | `<align=left/center/right/left/justified/flush>Text</aligh>` |
| 之后内容皆透明 | `<alpha=#16>Text`（十六进制）                                      |
| 背景填充    | `<mark=#RGBA-16>Text</mark>`                                 |
| 大写      | `<allcaps>Text</allcaps>`                                    |
| 字体与材质   | `<font="字体 SO 名" meterial="材质名（可选）">Text<.font>`             |
| 上标      | `<sup>2</sup>`                                               |
| 下表      | `<sub>2</sup>`                                               |
| 超链接     | `<link="链接">我是一个有超链接的字符</link>`                              |

## 样式表

样式表分离了样式定义和文本内容。

你可以为每个 TMP Text 组件指定 Style Sheet Asset，也可以指定一个全局样式配置文件（默认叫 Default Style Sheet）。 你可以在菜单栏找到它：Edit -> Project Settings -> TextMesh Pro -> Default Style Sheet。

打开它，你会看到一个列表，每一行包含三部分：

| **属性**       | **解释**     | **例子**                       |
| ------------ | ---------- | ---------------------------- |
| Name         | 样式名        | `H1`                         |
| opening Tags | 样式开始时的标签   | `<size=60><color=yellow><b>` |
| Closing Tags | 样式结束时的闭合标签 | `</b></color></size>`        |

除了在 Text Style 下拉菜单里直接选择你定义好的名字，你还可以只给这句话里的某几个字加样式 (`<style="样式名">内容</style>`)，例如：

```html
普通小怪，但是 <style="BossName">精英怪</style> 出现了！
```

## 颜色渐变预设

颜色渐变预设 (Color Gradient Preset) 是 TextMeshPro 中用于批量管理文字渐变色的功能。

- 创建预设：在 Project 窗口右键 -> Create -> TextMeshPro -> Color Gradient
- 应用预设：勾选 Text 组件的 Color Gradient 复选框，把预设拖入在 Color Preset

## 插入 Sprite 图集

创建 Sprite 图集资源：
1. 将 Texture Type 设置为 `Sprite (2D and UI)`，Sprite Mode 为 `Multiple`	
2. 打开 Sprite Editor 切割图片 (Slicing)
3. 右键图集 Create -> TMP -> Sprite Asset

你可以为每个 TMP Text 组件指定 Style Sheet Asset，也可以指定一个全局样式配置文件。你可以在菜单栏找到它：Edit -> Project Settings -> TextMesh Pro -> Default Sprite Asset。

富文本语法：
- `<sprite index=图片ID>`  / `<sprite=图片ID>` / `<sprite='资源名' index=图片ID>`
- `<sprite name=图片名>` / `<sprite=图片名>` / `<sprite='资源名' name=图片名>`
- 可选参数 `color=#RGBA-16`

## TMP Settings

- Default Font Asset：默认字体
- Path：资源的查找路径，用于富文本中的动态加载
---
- Fallback Font Assets：默认回滚字体
- Fallback Material Presets：默认回滚字体采用默认字体的材质，使其更相似默认字体
---
- Get Font Features as Runtime ：开启运行时获取字体功能
- Missing Character Unicode：无对应字符时所采取字符的 Unicode
- Disable warnings：关闭 Unity 为每个缺失的字符的警告
--- 
**Text Container Default Settings**：（文本容器默认设置）
- TMP：3D 文本容器默认大小
- TMP UI：UI 文本容器默认大小
- Enable Raycast Target：默认开启文本对象的射线检测
- Auto Size Text Container：令文本容器自动包裹住默认文字 (ex: `New Text`)
-  ：文本组件默认勾选 Is Scale Static
--- 
**Text Componet Default Settings**（文本组件默认设置）
- Defalut Font Size：默认字体大小
- Word Wraipping：自动换行
- Kerning：启用字偶间距调整
- Extra Padding：字符网格额外填充
- Tint All Sprties：当你改变文本的颜色时，是否要连同里面的 Sprite 一起变色
- Parse Escape Sequence：解析转义字符
--- 
**Default Sprite Asset**
- Missing Sprite Unicode： 精灵缺失时采用的替代付，默认为方形轮廓
- IOS Emoji Support： 是否支持IOS表情符号
- Path： Sprite 资源存储位置，用于富文本动态加载 (ex: `<sprite="GeneralIcons" index=0>`)
--- 
**Default Style Sheet**：指定样式表资源存储位置

**Color Gradient Presets**：指定颜色渐变预设存储位置

---
**Line Breaking for asian languages**： 用于处理亚洲语言的换行规则
- Leading Characters：前导符号。一般不允许这些符号出现在开头 遇到这些字符触发自动换行时，不触发换行，让其显示在尾部
- Following Characters：尾随符号。一般不允许这些符号出现在行的结尾，如果这些符号在行的结尾出现自动换行了 会将这些符号放倒下一行
**Korean Language Options**： 韩语相关设置
- Use Modern Line Breaking： 使用现代换行，启用后将采用更符合韩语规则的换行规则

## SDF

### 材质球

SDF 是一种**存储图形形状**的特殊方式，它让字体和图标可以**无限放大而不模糊**，并且能以极低的性能消耗实现描边、阴影和发光效果。

传统位图记录每个像素是有颜色还是透明，而 SDF 记录当前像素距离字符边缘有多远：
- **Signed (有符号)：** 正数表示在字符里面，负数表示在字符外面。 
- **Distance (距离)：** 数值大小代表距离字符边缘的远近（0~1）。

SDF 的贴图上存储的是从 0 到 1 的渐变值，TMP 的 Shader 会设定一个阈值，只有大于阈值的像素会被涂满颜色。

在 Unity 中，你可以在 TMP Text 组件下，或每个字体 SO 下找到对应的 SDF 材质球。

### 基础设置

**Face**
- Color: 文本表面颜色，该颜色会和 TMP 组件中设置的颜色相乘进行叠加
- Texture：为文本添加贴图
	- Tiling：平铺（缩放） 
	- Offset：偏移 
	- Speed：贴图滚动速度（可以配合 UV 配置使用）
- Softness：边缘柔和度
- Dilate：扩张，实际为调整 Shader 中的阈值
---
**Outline**
- Color：轮廓/边缘线颜色；Thickness：轮廓粗细
- Texture：轮廓纹理
---
**Underlay**：底图阴影
- Underlay Type：底图阴影类型；
	- Normal：正常底图阴影
	- Inner：反转底图，用原始文本遮罩它
- Color：阴影颜色；Softness：边缘柔和度；Dilate：扩张
---
**Lighting**：模拟光照效果
- Bevel：斜面（模拟光照必须要搭配 Bevel，光照需要物体有凹凸不平的表面才能看出效果）
- Local Lighting
	- Light Angle: 光照角度，模拟局部光的角度
	- Specular Color：镜面反射颜色
	- Specular Power：镜面发射强度
	- Reflectivity Power：反射强度，值越大越能反应周围环境的颜色
	- Diffuse Shadow：漫反射阴影，调整整体阴影的等级，值越高，阴影越强
	- Amblent Shadow：环境阴影，调整环境光照水平
- Bump Map：凹凸贴图，使文字表面模拟粗糙细节
	- Texture：凹凸贴图
	- Face：凹凸影响程度；Outline：凹凸贴图对文本轮廓的影响程度
- Environment Map：环境设置，给文字增加模拟反射效果
	- Texture：赋予环境一个 Cubemap（立方体贴图）或者一张全景图
	- Reflection Color：反射的颜色
	- Rotation：旋转环境贴图
---
**Glow**
- Color：发光颜色；Offset：发光效果中心偏移值；Power：发光强度
- Inner：发光效果向内延伸距离；Outer：发光效果向外延伸距离

### 调试设置

主要公布了 Shader 内部的一些属性，一般不会去刻意修改。

**Debug Settings**
- Font Atlas：字体图集
- Gradient Scale：渐变比例
- Texture Width/Height：纹理宽高
- Scale X\Y：SDF 比例乘数，越大越清晰，越小越模糊
- Sharpness：清晰度
- Perspective Filter：透视过滤器 使用透视摄像机时，调整该设置，可以让文本看起来更柔和
- Offset X、Y：每个字符顶点位置的偏移量
- Mask：蒙版
- Clip Rect：剪辑矩形，用于设置遮罩矩阵范围
- Stencil ID：模板ID；Stencil Comp：模板成分
- Use Ratios：使用率
- Cull Mode：裁剪模式

### 工具类

### TMP_TextEventHandler

> 这个脚本包含在 TMP Extras & Samples 中。可以在 Window 中找到导入选项。

`TMP_TextEventHandler`是 TextMeshPro 包内的一个实用工具脚本，用于处理鼠标悬停时与文本内部特定元素（ex：单词、行、Sprite、超链接）的交互。

可以通过代码注册，这种方式通过 ide 的代码提示可以清楚地知道函数所需参数。例如：

```cs
TMP_TextEventHandler tmpHandler = GetComponent<TMP_TextEventHandler>();
tmpHandler.onLinkSelection.AddListener(content, link, index => 
	// ...
)
```

如果通过拖拽函数的方式，你需要了解这个脚本需要的函数中，所需的三个参数的规律：
- 第一个`string`：悬停处的内容
- 第二个`string`：超链接中的 link
- 第一个`int`：索引值
- 如果有两个`int`，最后一个`int`：长度

### TMP_TextUtilities

`TMP_TextUtilities`用于处理点击交互：可利用该类在点击文本时，来获取点击到的具体内容。

例如：我们可以为一个 UI 控件的脚本添加`IPointerClickHandler`并实现`OnPointerClick()`方法。在用户点击整个控件时，我们利用`TMP_TextUtilities`来获取点击到的具体元素。

**实现**

```cs
public class ClickHandler : MonoBehaviour, IPointerClickHandler
{
    public TextMeshProUGUI tmpUIText;

    public void OnPointerClick(PointerEventData eventData)
    {
		// 传入 null 使用默认主相机
		int linkIndex = TMP_TextUtilities.FindIntersectingLink(tmpUIText,
		 eventData.position, 
		 null);

        //如果不为-1 就证明点击到了一个超链接信息
        if (linkIndex != -1)
        {
            //这是得到超链接显示的文本信息
            print(tmpUIText.textInfo.linkInfo[linkIndex].GetLinkText());
            //这是得到富文本标签<link=?>中的?具体的地址信息
            print(tmpUIText.textInfo.linkInfo[linkIndex].GetLinkID());
        }
    }
}
```

**常用的方法**

1. 获取给定位置文本中的具体信息:
	- 获取链接索引：`int FindIntersectingLink()`
	- 获取单词索引：`int FindIntersectingWord()`
	- 获取单字符索引：`int FindIntersectingCharacter()`
	- 获取行索引：`int FindIntersectingLine()`
2. 获取离给定位置最新的文本中的具体信息
	- 获取链接索引：`int FindNearestLink()`
	- 获取单词索引：`int FindNearestWord()`
	- 获取单字符索引：`int FindNearestCharacterOnLine()`
	- 获取行索引：`int FindNearestLine()`

> 更多API：[Class TMP_TextUtilities | TextMeshPro | 4.0.0-pre.2](https://docs.unity3d.com/Packages/com.unity.textmeshpro@4.0/api/TMPro.TMP_TextUtilities.html)

### 其他工具类

- `TMP_Math`：提供一些基础的数学计算
- `TMP_FontAssetUtilities`：提供字体资源的操作和查询等方法
- `TMP_TextParsingUtilities`：提供解析文本内容的工具

> 更多工具类：[Namespace TMPro | TextMeshPro | 4.0.0-pre.2](https://docs.unity3d.com/Packages/com.unity.textmeshpro@4.0/api/TMPro.html)