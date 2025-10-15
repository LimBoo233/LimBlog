# 北工大web

## Introduction

**What are we going to learn**

前端三件套：
- HTML
- CSS
- JavaScript

后端：
- Python
- 数据库访问

进阶：
- JQuery 和 AJAX：这是JavaScript的扩展技术，能让你更容易地操作网页，并实现不刷新整个页面的情况下与服务器进行数据交换

## HTML

HTML（超文本标记语言 HyperText Markup Language）是一种标记形语言，可以通过标签（Tags）组织出多样的文本页面，定义文本的结构和内容。

标签由一些特殊的字符（比如 &lt; 和 &gt;）和特殊的单词组成 。

这些特殊的单词告诉浏览器这个标记应该做什么 。例如，&lt;p&gt; 标签告诉浏览器："这里面的内容是一个段落"。

**一个 HTML 文档由文本内容和 HTML 元素组成。**

- 元素（Elements）
    - 一个元素可以包含文本、其他元素，也可以是空的。它是由标签来标识的 。
    - 结构通常是这样的：&lt;标签名&gt;内容&lt;/标签名&gt;
- 属性 (Attributes)
    - 属性可以为 HTML 元素提供更多的信息。
    - 它是一个 名称=值 的配对，写在元素的开始标签里。
    - 例如：&lt;a href="https://www.baidu.com"&gt;这是一个链接&lt;/a&gt;

**一个完整HTML页面的基本结构**

```html
<!DOCTYPE html>
<html>
<head>
    <title>My page title</title>
</head>
<body>
    <h1>This is a big heading</h1>
    <p>This is a paragraph...</p>
</body>
</html>
```

让我们来分解一下这个结构：

- &lt;!DOCTYPE html&gt;
    - 它不是一个HTML标签，而是一个 文档类型声明 。
    - 它的作用是告诉浏览器，你接下来要处理的是一个HTML文档 。
- &lt;html&gt;, &lt;head&gt;, 和 &lt;body&gt;
    - &lt;html&gt; 元素是 根元素，它包含了文档中所有其他的HTML元素 。
    - 一个HTML页面被分为两个主要部分：头部 (&lt;head&gt;) 和身体 (&lt;body&gt;) 。头部包含了页面的元数据（metadata），而身体包含了页面的实际内容（ex：文本、图片等）。

#### Headings

标题是用来展示文档结构的。&lt;h1&gt;是最高级别的标题（最重要的），&lt;h6&gt;是最低级别的 。这不仅能让读者一目了然，对搜索引擎优化（SEO）也很有帮助。

浏览器会为不同级别的标题提供默认的样式（比如&lt;h1&gt;字号最大、字体最粗） ，不过这些样式后续都可以通过CSS来自由修改 。

```html
<html>
<body>
    <h1>一级标题</h1>
    <h2>二级标题</h2>
    <h3>三级标题</h3>
    <h4>四级标题</h4>
    <h5>五级标题</h5>
    <h6>六级标题</h6>
</body>
</html>
```

#### Paragraphs

段落是 HTML 文档中最基本的文本单位。网页上的绝大部分正文内容，都应该放在&lt;p&gt;标签里。

&lt;p&gt;标签是一个容器，里面除了可以放文字，还可以嵌套包含其他的“内联HTML元素”（比如链接&lt;a&gt;和强调&lt;strong&gt;） 。

```html
<html>
<body>
    <p>这是一个段落。</p>
    <p>这是另一个段落。</p>
</body>
</html>
```

#### Links

链接可以让用户从一个页面跳转到另一个页面，或者跳转到同一页面的不同位置。

一个链接包含两个主要部分：目标地址 (destination) 和 显示文本 (label) 。

```html
<a href="https://www.baidu.com">这是一个链接</a>
```

&lt;a&gt;标签功能非常强大，可以创建多种链接 ：
- 链接到外部网站 
- 链接到自己网站内部的其他页面 
- 链接到当前页面的其他位置（页内跳转） 
- 触发邮件客户端 
- 触发执行 JavaScript 函数

在链接到外部网站时，需要使用绝对路径（absolute URL） 。
```html
<a href="https://www.baidu.com">百度</a>
```

而在链接到自己网站内部的其他页面时，可以使用相对路径（relative URL） 。
```html
<!-- 会链接到同一目录下的 about.html -->
<a href="/about.html">关于我们</a>
```

#### Empty Elements

大部分 HTML 元素都是一个“容器”，可以嵌套其他内容。但有些元素不能嵌套任何东西，它们被称为空元素。

常见例子：
- &lt;br&gt;: 强制换行
- &lt;hr&gt;: 插入一条水平分割线
- &lt;img&gt;: 插入一张图片

#### Images

当图片是网页的实际内容时（比如产品图、新闻照片，就应该使用&lt;img&gt;标签。如果图片仅仅是为了装饰（比如背景图案）那么更推荐用 CSS 来处理。

重要属性：
- `src`: 图片的路径（同样可以是绝对路径或相对路径）
- `alt`: 图片加载失败时显示的替代文本
- `title`: 鼠标悬停在图片上时显示的提示文字
- `width` / `height`: 设置图片的宽度和高度

```html
<img src="path/to/image.jpg" alt="描述图片内容" title="图片标题" width="600" height="400">
```

当你需要为一张图片（或其他插图内容）配上标题说明时，推荐使用&lt;figure&gt;元素把它包裹起来，并用&lt;figcaption&gt;来写标题。这样做语义更清晰。

```html
<figure>
    <img src="path/to/image.jpg" alt="描述图片内容">
    <figcaption>图片标题</figcaption>
</figure>
```

::: tip
不是所有图片都需要用&lt;figure&gt;包裹，只有那些作为独立单元且需要标题说明的内容才适合使用 。
:::

#### Lists

当您需要列出一些项目时，使用列表可以让内容看起来更清晰。HTML 提供了三种类型的列表，我们主要学习最常用的两种。

**无序列表 (Unordered Lists)**

整个列表用 &lt;ul&gt; 标签包裹，每个列表项用 &lt;li&gt; 标签。


输入：
```html
<ul>
    <li>列表项 1</li>
    <li>列表项 2</li>
    <li>列表项 3</li>
</ul>
```

输出：
- 列表项 1
- 列表项 2
- 列表项 3

**有序列表 (Ordered Lists)**

整个列表用 &lt;ol&gt; 标签包裹，每个列表项用 &lt;li&gt; 标签。

```html
<ol>
    <li>第一项</li>
    <li>第二项</li>
    <li>第三项</li>
</ol>
```

输出：
1. 第一项
2. 第二项
3. 第三项

#### Tables

HTML 表格用于显示由行和列组成的网格数据。

基本结构：一个表格由以下几个核心标签构成：

- `<table>`: 整个表格的容器
- `<tr>`: 代表 表格中的一行 (Table Row) 
- `<td>`: 代表 行中的一个单元格 (Table Data)，普通的数据都放在这里
- `<th>`: 代表 表头单元格 (Table Header)，用于定义列的标题，通常会加粗并居中显示

**输入**

```html
<table>
    <tr>
        <th>干员姓名</th>
        <th>干员种类</th>
        <th>分支</th>
    </tr>
    <tr>
        <td>Amiya</td>
        <td>术士</td>
        <td>本源术士</td>
    </tr>
    <tr>
        <td>Exusiai</td>
        <td>狙击</td>
        <td>速射手</td>
    </tr>
    <tr>
        <td>Skadi</td>
        <td>近卫</td>
        <td>无畏者</td>
    </tr>
</table>
```

**输出**

| 干员姓名 | 干员种类 | 分支     |
|----------|----------|----------|
| Amiya    | 术士     | 本源术士 |
| Exusiai  | 狙击     | 速射手   |
| Skadi    | 近卫     | 无畏者   |

使用 `colspan` 和 `rowspan` 属性，可以让单元格跨越多列或多行。

**输入**

```html
<table>
    <tr>
        <th>姓名</th>
        <th colspan="2">联系方式</th>
    </tr>
    <tr>
        <td>张三</td>
        <td>电话</td>
        <td>123456789</td>
    </tr>
    <tr>
        <td>李四</td>
        <td>Email</td>
        <td>lisi@example.com</td>
    </tr>
</table>
```

**输出**

<table>
    <tr>
        <th>姓名</th>
        <th colspan="2">联系方式</th>
    </tr>
    <tr>
        <td>张三</td>
        <td>电话</td>
        <td>123456789</td>
    </tr>
    <tr>
        <td>李四</td>
        <td>Email</td>
        <td>lisi@example.com</td>
    </tr>
</table>

#### Forms

前面的所有标签都是为了展示信息，而表单则是为了收集信息，是让网页与用户进行交互的桥梁。

一个表单通常包含各种类型的输入控件，比如文本框、单选按钮、复选框、下拉菜单等。

表单让一个网页变得可以交互 。它包含两个部分：
- 前端：用HTML写的、用户能看到的表单界面
- 后端：是一种运行在服务器上的程序（比如用 Python, PHP 等语言编写），负责接收和处理前端发来的数据

表单的核心标签：`<form>`

- 所有的表单控件都必须放在 `<form>` 标签内部。
- `action`属性：这个属性至关重要，它指定了服务器上接收表单数据的程序的URL（地址）。

常见的表单控件：
- 单行文本输入框：`<input type="text">`

    这是最常用的输入框，用于输入单行的文本，比如用户名、搜索关键词等。

    `name` 属性：每个表单控件都应该有一个 `name` 属性，它相当于这个数据的标签，后端程序通过该属性来识别是哪个输入框的数据。

    `value` 属性：这个属性用来设置输入框的默认值。

- 提交按钮：`<input type="submit">`

    用于提交整个表单的按钮 。当用户点击它时，表单数据就会被发送到action属性指定的地址。

    ```html
    <form action="/submit_form">
        用户名：
        <input type="text" name="username" value="默认用户名">
        <input type="submit" value="提交">
    </form>
    ```

- 多行文本输入框：`<textarea>`

    当需要用户输入多行文本时（如评论、留言），使用 `<textarea>`。

    可以用 `rows` 和 `cols` 属性来控制它的大小。

    ```html
    <textarea name="comments" rows="4" cols="50">请输入您的评论...</textarea>
    ``` 

- 单选按钮：`<input type="radio">`

    用于提供多个选项，但只允许用户 选择其中一个 。

    关键点：要让一组单选按钮成为“互斥”的整体，它们必须拥有 完全相同的 `name` 属性。

    ```html
    <input type="radio" name="gender" value="male"> 男
    <input type="radio" name="gender" value="female"> 女
    ```

- 复选框：`<input type="checkbox">`

    用于提供多个选项，允许用户 选择零个、一个或多个。

    ```html
    <input type="checkbox" name="hobby" value="reading"> 阅读
    <input type="checkbox" name="hobby" value="traveling"> 旅行
    <input type="checkbox" name="hobby" value="sports"> 运动
    ```

- 下拉选择列表：`<select>` 和 `<option>`

    使用 `<select>` 来创建一个下拉列表。

    列表中的每一个选项都用一个 `<option>` 标签来定义。

    `value` 属性：通常我们会给每个 `<option>` 添加一个 `value` 属性。提交表单时，被选中选项的 `value` 值会被发送到服务器。如果没有 `value`，则发送选项的文本内容。
    
    ```html
    <select name="country">
        <option value="us">美国</option>
        <option value="cn">中国</option>
        <option value="uk">英国</option>
    </select>
    ```

- 分组控件：`<fieldset>` 和 `<legend>`

    `<fieldset>`可以为表单中逻辑相关的一组控件画上一个边框。

    `<legend>`则为这个分组提供一个标题。

    ```html
    <fieldset>
        <legend>个人信息</legend>
        姓名：<input type="text" name="name"><br>
        年龄：<input type="text" name="age"><br>
    </fieldset>
    ```

    

HTML5新增的输入类型：

HTML5增加了很多智能的输入类型，它们能提供更好的用户体验和内置的数据验证。

- 文件上传: `<input type="file">`
- 数字输入: `<input type="number">`，可以设置最大/最小值
- 范围滑块: `<input type="range">` 
- 日期和时间: `<input type="date">`, `<input type="time">` 等
- 颜色选择器: `<input type="color">` 

## CSS

CSS 是一种用来描述HTML元素外观和表现形式 (presentation) 的标准。

在 HTML 中使用 CSS 主要使用外部样式表 (External Style Sheet) 的方式：
- 我们将所有的 CSS 规则写在一个单独的 `.css` 文件里。
- 然后在 HTML 文件的 `<head>` 部分，使用 `<link>` 标签来引入这个CSS文件。
```html
<head>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
```

此外还有内部样式表 (Internal Stylesheet) 法和行内样式 (Inline Styles) 法，但不推荐使用。 

```html
<!-- 内部样式表 -->
<head>
    <style>
        body {
            background-color: lightblue;
        }
    </style>
</head>
<!-- 行内样式 -->
<p style="color: red;">这是一个红色的段落。</p>
```

#### CSS 语法基础

一个 CSS 文件由一条或多条样式规则 (style rules) 组成 。

每一条规则都包含两个部分：选择器 (Selector) 和 声明块 (Declaration Block) 。
- 选择器：指定要应用样式的 HTML 元素。
- 声明块：包含一个或多个声明 (declarations)，每个声明由属性 (property) 和 值 (value) 组成。

```css
/* h1 是选择器 */
h1 {
    /* "color: blue;" 是一条声明 */
    /* "color" 是属性, "blue" 是值 */
    color: blue;
    background-color: yellow;
    border: 1px solid black;
}

/* p 是选择器 */
p {
    color: red;
}
```

#### 选择器

首先，为了能让CSS选中元素，我们通常会在HTML里给元素加上两种“标签”：`id` 和 `class`。
- `id` - 元素的“身份证号”，在整个 HTML 页面中必须是唯一的。
- `class` - 元素的“标签”或“分组名”，可以被多个元素重复使用。

1. 基础选择器 (Basic Selectors)

    ```css
    /* 元素选择器 (Element Selector) */
    /* 选择所有的 <p> 元素 */
    p {
        color: red;
    }

    /* 分组选择器 (Grouped Selectors) */
    /* 选择所有的 <h1> 和 <h2> 元素 */
    h1, h2 {
        font-family: Arial, sans-serif;
    }

    /* 类选择器 (Class Selector) */
    /* 选择所有 class="highlight" 的元素 */
    .highlight {
        background-color: yellow;
    }

    /* ID 选择器 (ID Selector) */
    /* 选择 id="main-title" 的元素 */
    #main-title {
        font-size: 24px;
    }
    ```

2. 关系选择器 (Combinators)

    这类选择器通过元素之间的层级或兄弟关系来筛选元素，非常强大。

    ```css
    /* 后代选择器 (Descendant Selector) */
    /* 选择所有 <div> 内的 <p> 元素 */
    div p {
        color: blue;
    }

    /* 子元素选择器 (Child Selector) */
    /* 选择所有 <ul> 的直接子元素 <li> */
    ul > li {
        /*ul > li { ... } 只会选中<ul>的直接子元素<li>，
        如果<li>内部还嵌套了另一个列表，那个列表里的<li>则不会被选中。*/
        list-style-type: square;
    }


    /* 相邻兄弟选择器 (Adjacent Sibling Selector) */
    /* 它会选中 紧跟 在某个元素之后的 那一个 同级元素 。*/
    /* 选择紧跟在 <h1> 后面的第一个 <p> 元素 */
    h1 + p {
        margin-top: 0;
    }

    /* 普通兄弟选择器 (General Sibling Selector) */
    /* 它会选中 紧跟 在某个元素之后的 所有 同级元素 。*/
    /* 选择所有紧跟在 <h1> 后面的 <p> 元素 */
    h1 ~ p {
        color: green;
    }
    ```

3. 伪类选择器 (Pseudo-class Selectors)

    伪类用于定义元素的特殊状态，比如鼠标悬停、链接被访问过等。

    最常见的用法是定义链接 `<a>` 标签在不同状态下的样式：

    ```css
    a:link {
        color: blue; /* 未访问的链接 */
    }
    a:visited {
        color: purple; /* 已访问的链接 */
    }
    a:hover {
        color: red; /* 鼠标悬停时 */
    }
    a:active {
        color: orange; /* 点击时 */
    }
    ```

#### 常用 CSS 属性 

1. 文本颜色
    ```css
    color: red; /* 设置文本颜色 */
    /* 颜色可以用颜色名称、十六进制值、RGB值、RGBA值等多种方式表示 */
    ```

2.  背景

    我们可以为元素设置背景颜色或背景图片。

    ```css
    background-color: lightblue; /* 设置背景颜色 */
    background-image: url('path/to/image.jpg'); /* 设置背景图片 */
    background-size: cover; /* 让背景图片覆盖整个元素 */
    background-repeat: no-repeat; /* 不重复背景图片 */
    /* 
    repeat: 默认值，在水平和垂直方向重复。
    repeat-x: 只在水平方向重复 。
    repeat-y: 只在垂直方向重复 。
    no-repeat: 不重复 。
    */
    background-position: center; /* 背景图片居中 */
    ```

    背景简写 (Shorthand)：为了方便，我们可以把所有背景相关的属性写在一个 `background `属性里 。

    ```css
    background: lightblue url('path/to/image.jpg') no-repeat center/cover;
    ```

3. 边框

    边框用于在元素的周围创建线条，以区分或突出内容。

    边框主要有三个属性可以设置：
    ```css
    /* 边框宽度 */
    /* 顺时针规则 ：上 右 下 左 */
    /* 此处为：上下边框宽度为2px，左右边框宽度为4px */
    border-width: 2px  4px;
    /* 边框样式 */
    /* 比如 solid (实线), dotted (点状线), dashed (虚线) */
    border-style: solid;
    /* 边框颜色 */
    border-color: black; 
    ```

4.  文本与字体

    ```css
    /* text-align: 设置文本的水平对齐方式，
    可选值有 left, right, center, justify (两端对齐) 。*/
    text-align: center;
    /* 设置或移除文本的装饰线。
    最常见的用法是 a { text-decoration: none; }，用来去掉链接默认的下划线 。*/
    text-decoration: underline;
    /* 设置字体。
    为了确保所有用户都能正常显示，我们通常会提供一个备选字体列表。*/
    font-family: Arial, Helvetica, sans-serif;
    /* 设置字体大小 */
    /* 为了更好的可访问性和响应式设计，
    推荐使用 相对单位，如 em 或 %，而不是 px 这样的固定单位。*/
    font-size: 1em;
    ```

5. 列表与表格样式

    列表：使用 `list-style-type` 属性可以更改列表项前面的标记。ex：`ul { list-style-type: square; }` (将无序列表的圆点变为方块) 。

    表格: 默认情况下，表格单元格的边框是分开的。使用 `border-collapse: collapse; `可以将它们合并为单一边框，看起来更整洁。

#### 盒子模型 (Box Model)

在 CSS 看来，页面上的 每一个 HTML 元素都是一个矩形的盒子 。无论是段落、标题，还是图片，它们都存在于自己的盒子里。

这个盒子由内到外分为四个层次：
1. 内容区域 (Content Area)：盒子的核心部分，显示实际内容（文本、图片等）。受 `width` 和 `height` 属性控制。
2. 内边距 (Padding)：内容区域与边框之间的空间。受 `padding` 属性控制。
3. 边框 (Border)：包围内边距和内容的线条。受 `border` 属性控制。
4. 外边距 (Margin)：盒子与其他元素之间的空间。受 `margin` 属性控制。

盒子实际占用的空间：

- 总宽度 = `width` + `左右padding` + `左右border` + `左右margin`
- 总高度 = `height` + `上下padding` + `上下border` + `上下margin`

盒子的类型 `display` 属性：

`display` 是控制布局最重要的 CSS 属性之一，它决定了盒子在页面上如何表现。

- `block`：块级元素。

    特点：会独占一行，宽度默认会撑满父容器的整个宽度 。`<div>` 和 `<p>` 都是典型的块级元素。

- `inline`：内联元素。

    特点：不会独占一行，会和其他内联元素在同一行内从左到右排列，直到排不下为止 。`<span>` 和 `<a>` 都是典型的内联元素。


```css
/* 让所有的 <div> 元素表现得像内联元素 */
div {
    display: inline;
}
```

::: tip
`display: none; ` 会让元素在页面上彻底消失，就好像它在 HTML 中从未存在过一样，并且不占用任何空间。
:::

## Flask 简介

Flask 是一个用 Python 编写的 “微框架” (micro-framework) 。

“微”意味着它非常轻量、简洁，只提供了 Web 开发最核心的功能。它不包含数据库访问层、用户认证系统等复杂功能，这些都需要我们根据需求自己添加。

::: tip
在开始写代码前，需要搭建一个干净、独立的环境。
:::

在激活了的虚拟环境中，使用 Python 的包管理工具 pip 来安装 Flask ：
```bash
(flaskenv) microblog> pip install flask
```

我们来看一个最简单的 Flask 应用长什么样。

```python [hello.py ]
# 1. 从 flask 库中导入 Flask 这个类
from flask import Flask

# 2. 创建一个 Flask 应用的实例 (instance)
app = Flask(__name__)

# 3. 定义一个路由 (Route)
@app.route("/")
# 4. 定义一个视图函数 (View Function)
def hello_world():
    # 5. 返回要显示在浏览器上的内容
    return "<p>Hello, World!</p>"
```

- 路由 `@app.route("/")`: 这是一个 装饰器。它的作用是建立 URL 和函数之间的关联。这行代码的意思是：当有用户访问网站的根目录 (`/`) 时，就执行它下面的那个函数。

- 视图函数 `def hello_world()`: 这个函数负责处理用户的请求，并生成要返回给浏览器的响应。函数的返回值就是用户将在浏览器上看到的内容。

接下来运行这个 Flask 应用：
1. 在命令行中，告诉 Flask 你的应用入口是哪个文件：

    ```bash
    export FLASK_APP=hello.py  # Mac/Linux
    set FLASK_APP=hello.py     # Windows
    ```

2. 运行 Flask 内置的开发服务器：
    ```bash
    flask run
    ```

3. 打开浏览器，访问[http://127.0.0.1:5000/](http://127.0.0.1:5000/)，你就能看到 "Hello, World!" 了。

## 模板 (Templates)

直接在 Python 函数里返回 HTML 字符串是一种非常糟糕的方式，难以阅读和维护 。为此，Flask 自带了一个强大的模板引擎，叫做 Jinja2 。

**Jinja2 模板语法**

在模板 `.html` 文件中，我们可以使用特殊的语法来嵌入动态数据和逻辑。

```python
# 变量: 使用 {{ ... }} 来显示从 Python 传过来的变量
# 示例: <h1>Hello, {{ user.username }}!</h1>
template_variable = "<h1>Hello, {{ user.username }}!</h1>"

# 控制结构: 使用 {% ... %} 来写逻辑，比如条件判断和循环
# 条件判断: {% if user %} ... {% else %} ... {% endif %}
template_condition = """
{% if user %}
    <p>欢迎, {{ user.username }}!</p>
{% else %}
    <p>请先登录</p>
{% endif %}
"""

# 循环: {% for post in posts %} ... {% endfor %}
template_loop = """
{% for post in posts %}
    <div>
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
    </div>
{% endfor %}
"""
```

**`render_template()` 函数**

在视图函数中，我们不再 `return` 一个字符串，而是使用 `render_template()` 函数来渲染模板。

```python
from flask import render_template

@app.route('/')
def index():
    user = {'username': 'Vivek'}
    # 第一个参数是模板文件名
    # 后面的参数是想传递给模板的数据
    return render_template('index.html', title='Home', user=user)
```

::: details

```html [templates/index.html]
<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ title }} - 我的博客</title>
</head>
<body>
    <h1>Hello, {{ user.username }}!</h1>
</body>
</html>
```

:::

**模板继承 (Template Inheritance)**

这是一个非常强大的功能，可以减少大量重复的 HTML 代码。

实现方式：
- 在 `base.html` 中，用 `{% block content %}{% endblock %}` 来定义一个“坑”，这个“坑”里的内容是每个页面自己独有的。
- 在其他的子模板中（如 `index.html`），首先用 `{% extends "base.html" %}` 来声明它继承自基础模板。
- 然后，将这个页面独有的内容写在 `{% block content %} ... {% endblock %}` 之间，Jinja2 会自动把这部分内容填到父模板的坑里。

::: code-group

```html [templates/base.html]
<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{% block title %}我的网站{% endblock %}</title>
</head>
<body>
    <header>
        <h1>欢迎来到我的网站</h1>
    </header>
    <nav>
        <a href="/">首页</a>
        <a href="/about">关于我们</a>
    </nav>
    <main>
        {% block content %}{% endblock %}
    </main>
    <footer>
        <p>版权所有 &copy; 2024</p>
    </footer>
</body>
</html>
```

```html [templates/index.html]
{% extends "base.html" %}

{% block title %}首页 - 我的博客{% endblock %}

{% block content %}
    <h2>最新文章</h2>
    <p>这里是首页的独有内容。</p>
{% endblock %}
```

:::