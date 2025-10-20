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

标签由一些特殊的字符（ex: `<` 和 `>` ）和特殊的单词组成。

这些特殊的单词告诉浏览器这个标记应该做什么。例如，`<p>` 标签告诉浏览器：这里面的内容是一个段落。

**一个 HTML 文档由文本内容和 HTML 元素组成。**

- 元素（Elements）
    - 一个元素可以包含文本、其他元素，也可以是空的。它是由标签来标识的。
    - 结构通常是这样的：&lt;标签名&gt;内容&lt;/标签名&gt;
- 属性 (Attributes)
    - 属性可以为 HTML 元素提供更多的信息。
    - 它是一个 名称=值 的配对，写在元素的开始标签里。
    - 例如：&lt;a href="https://www.bilibili.com/video/BV1GJ411x7h7"&gt;这是一个链接&lt;/a&gt;

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

- `<!DOCTYPE html>`
    - 它不是一个 HTML 标签，而是一个 文档类型声明。
    - 它的作用是告诉浏览器，你接下来要处理的是一个 HTML 文档。
- `<html>`, `<head>`, 和 `<body>`
    - `<html>` 元素是 根元素，它包含了文档中所有其他的 HTML 元素。
    - 一个 HTML 页面被分为两个主要部分：头部 (`<head>`) 和身体 (`<body>`) 。头部包含了页面的元数据（metadata），而身体包含了页面的实际内容（ex：文本、图片等）。

#### Headings

标题是用来展示文档结构的。`<h1>`是最高级别的标题，`<h6>`是最低级别的。除了用于展示，Headings 对搜索引擎优化（SEO）也很有帮助。

浏览器会为不同级别的标题提供默认的样式（比如`<h1>`字号最大、字体最粗），不过这些样式后续都可以通过 CSS 来自由修改。

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

段落是 HTML 文档中最基本的文本单位。网页上的绝大部分正文内容，都应该放在`<p>`标签里。

`<p>`标签是一个容器，里面除了可以放文字，还可以嵌套包含其他的内联 HTML 元素（比如链接 `<a>` 和强调 `<strong>`）。

**输入**

```html
<html>
<body>
    <p>这是一个段落。</p>
    <p>这是另一个段落。</p>
</body>
</html>
```

**输出**

<p>这是一个段落。</p>
<p>这是另一个段落。</p>


#### Links

链接可以让用户从一个页面跳转到另一个页面，或者跳转到同一页面的不同位置。

一个链接包含两个主要部分：目标地址 (destination) 和 显示文本 (label) 。

```html
<a href="https://www.baidu.com">这是一个链接</a>
```

`<a>` 标签功能非常强大，可以创建多种链接 ：
- 链接到外部网站 
- 链接到自己网站内部的其他页面 
- 链接到当前页面的其他位置（页内跳转） 
- 触发邮件客户端 
- 触发执行 JavaScript 函数（一种运行在浏览器中的程序，后续会介绍）

在链接到外部网站时，需要使用绝对路径（absolute URL）。
```html
<a href="https://www.baidu.com">百度</a>
```

而在链接到自己网站内部的其他页面时，可以使用相对路径（relative URL） 。
```html
<!-- 会链接到同一目录下的 about.html -->
<a href="/about.html">关于我们</a>
```

#### Empty Elements

大部分 HTML 元素都是一个容器，可以嵌套其他内容。但有些元素不能嵌套任何东西，它们被称为空元素。

常见例如：
- `<br>`: 强制换行
- `<hr>`: 插入一条水平分割线
- `<img>`: 插入一张图片

#### Images

当图片是网页的实际内容时（ex: 产品图、照片）就应该使用`<img>`标签。如果图片仅仅是为了装饰（ex: 背景图案）那么更推荐用 CSS 来处理。

重要属性：
- `src`: 图片的路径（同样可以是绝对路径或相对路径）
- `alt`: 图片加载失败时显示的替代文本
- `title`: 鼠标悬停在图片上时显示的提示文字
- `width` / `height`: 设置图片的宽度和高度

```html
<img src="path/to/image.jpg" 
alt="描述图片内容" title="图片标题" width="600" height="400">
```

当你需要为一张图片配上标题说明时，推荐使用`<figure>`元素把它包裹起来，并用`<figcaption>`来写标题。这样做语义更清晰。

```html
<figure>
    <img src="path/to/image.jpg" alt="描述图片内容">
    <figcaption>图片标题</figcaption>
</figure>
```

::: tip
不是所有图片都需要用 `<figure>` 包裹，只有那些作为独立单元且需要标题说明的内容才适合使用 。
:::

#### Lists

当您需要列出一些项目时，使用列表可以让内容看起来更清晰。HTML 提供了三种类型的列表，我们主要学习最常用的两种。

**无序列表 (Unordered Lists)**

整个列表用 `<ul>` 标签包裹，每个列表项用 `<li>` 标签。


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

整个列表用 `<ol>` 标签包裹，每个列表项用 `<li>` 标签。

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
        <td>歼灭型哥布林</td>
        <td>电话</td>
        <td>123456789</td>
    </tr>
    <tr>
        <td>佩佩</td>
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
        <td>歼灭型哥布林</td>
        <td>电话</td>
        <td>123456789</td>
    </tr>
    <tr>
        <td>佩佩</td>
        <td>Email</td>
        <td>lisi@example.com</td>
    </tr>
</table>

#### Forms

前面的所有标签都是为了展示信息，而表单则是为了收集信息，是让网页与用户进行交互的桥梁。

一个表单通常包含各种类型的输入控件，比如文本框、单选按钮、复选框、下拉菜单等。

表单让一个网页变得可以交互 。它包含两个部分：
- 前端：用 HTML 写的、用户能看到的表单界面
- 后端：是一种运行在服务器上的程序（比如用 Python, Java 等语言编写），负责接收和处理前端发来的数据

表单的核心标签：`<form>`

- 所有的表单控件都必须放在 `<form>` 标签内部。
- `action` 属性：这个属性至关重要，它指定了服务器上接收表单数据的程序的URL（地址）。

常见的表单控件：
- 单行文本输入框：`<input type="text">`

    这是最常用的输入框，用于输入单行的文本，比如用户名、搜索关键词等。

    `name` 属性：每个表单控件都应该有一个 `name` 属性，它相当于这个数据的标签，后端程序通过该属性来识别是哪个输入框的数据。

    `value` 属性：这个属性用来设置输入框的默认值。

- 提交按钮：`<input type="submit">`

    用于提交整个表单的按钮。当用户点击它时，表单数据就会被发送到 action 属性指定的地址。

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
    <textarea name="comments" rows="4" cols="50">输入评论...</textarea>
    ``` 

- 单选按钮：`<input type="radio">`

    用于提供多个选项，但只允许用户选择其中一个 。

    关键点：要让一组单选按钮成为互斥的整体，它们必须拥有 完全相同的 `name` 属性。

    ```html
    <input type="radio" name="gender" value="male">男
    <input type="radio" name="gender" value="female"> 女
    ```

- 复选框：`<input type="checkbox">`

    用于提供多个选项，允许用户 选择零个、一个或多个。

    ```html
    <input type="checkbox" name="hobby" value="reading">阅读
    <input type="checkbox" name="hobby" value="traveling">旅行
    <input type="checkbox" name="hobby" value="sports">运动
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

Flask 是一个用 Python 编写的微框架 (micro-framework) 。

“微”意味着它非常轻量、简洁，只提供了 Web 开发最核心的功能。它不包含数据库访问层、用户认证系统等复杂功能，这些都需要我们根据需求自己添加。

::: tip
在开始写代码前，最好搭建一个干净、独立的环境。
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

## WTForms

当 HTML 提交 `<form>` 表单时，后端需要做很多事：接收数据、检查数据是否有效、若无效则返回错误信息并重新显示表单等。手动处理这些逻辑繁琐又易错，因此我们可以借助 Flask-WTF 扩展来简化这些工作。

**安装 Flask-WTF**

```bash
pip install flask-wtf
```

**实现 CSRF 保护**

Flask-WTF 能自动帮我们抵御一种常见的网络攻击——CSRF (跨站请求伪造)。如果不清楚什么是 CSRF，你暂时只需要知道 Flask-WTF 能让表单更加安全。

为了实现 CSRF 保护，Flask-WTF 需要一个加密密钥 (Cryptographic Key)，你可以在应用配置中设置它：

```python [app.py]
from flask import Flask

app = Flask(__name__)
app.config['SECRET_KEY'] = '你自己的随机密钥'

# 同级目录下的 routes.py
from blogapp import routes
```

你也可以将配置和应用实例代码写在不同的 `.py` 中：

::: code-group

```python [__init__.py]
from flask import Flask
from config import Config # 或者： from .config import Config

app = Flask(__name__)
app.config.from_object(Config)

from blogapp import routes
```

```python [config.py]
import os

class Config:
    # 从环境变量中获取 SECRET_KEY
    SECRET_KEY = os.environ.get('SECRET_KEY') or '你自己的随机密钥'
```

:::

**在 Python 中定义表单**

我们通过一个 Python类 来定义表单的结构：

```python [forms.py]
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired

class LoginForm(FlaskForm):
    # 每个变量代表一个表单字段
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')
```

- `StringField`, `PasswordField` 等定义了输入框的类型。
- 第一个参数（ex: `'Username'`）是这个字段的标签 (label)。
- `validators=[DataRequired()]` 是一个 验证器，它告诉 WTForms，这个字段必须被填写，不能为空。

接着我们在在 HTML 模板中渲染表单：

::: code-group

```python [routes.py]
# 在视图函数（routes.py）中，我们实例化一个 LoginForm 类
from .forms import LoginForm

@app.route('/login')
def login():
    form = LoginForm()
    return render_template('login.html', form=form)
```

```html [login.html]
{% extends "base.html" %}

{% block title %}登录{% endblock %}

{% block content %}
    <h2>登录</h2>
    <form action="" method="post" novalidate>
        {{ form.hidden_tag() }}  {# CSRF 保护 #}
        <p>
            {{ form.username.label }}
            {{ form.username(size=32) }}  {# size 控制输入框宽度 #}
        </p>
        <p>
            {{ form.password.label }}
            {{ form.password(size=32) }}
        </p>
        <p>
            {{ form.remember_me() }} 
            {{ form.remember_me.label }}
        </p>
        <p>{{ form.submit() }}</p>
    </form>
{% endblock %}
```
::::

目前表单已经可以显示了，但程序还不能处理用户提交的数据，所以接下来需要修改 `login` 视图函数：

```python [routes.py]
from flask import flash, redirect

#  1. 允许POST请求
@app.route('/login', methods=['GET', 'POST']) 
def login():
    form = LoginForm()

     # 2. 验证并处理数据  
    if form.validate_on_submit():
        flash('Login requested for user {}'.format(form.username.data))
        return redirect('/index') # 3. 重定向到首页

    # 4. 如果是GET请求或验证失败，则正常显示表单
    return render_template('login.html', title='Sign In', form=form) 
```

- `methods=['GET', 'POST']`：默认路由只接受GET请求（即用户访问页面）。加上 POST 使其能接收用户提交的表单数据。
- `form.validate_on_submit()`
    - 当用户通过 GET 请求第一次访问 `/login` 页面时，这个函数会直接返回 `False`。
    - 当用户填写表单并点击提交（发送 POST 请求）时，这个函数会自动运行所有验证器。如果所有数据都有效，返回 `True`。
- `flash()` 和 `redirect()`：在成功处理数据后，我们使用 `flash()` 来显示一条成功消息，然后使用 `redirect()` 将用户重定向到另一个页面。

如果 `form.validate_on_submit()` 因为数据无效而返回 `False`，WTForms 会自动在 `form` 对象中填充错误信息。我们只需在模板中把它们显示出来：

```html [login.html]
{% extends "base.html" %}

{% block title %}登录{% endblock %}

{% block content %}
    <h2>登录</h2>
    <form action="" method="post" novalidate>
        {{ form.hidden_tag() }}  {# CSRF 保护 #}
        <p>
            {{ form.username.label }}
            {{ form.username(size=32) }}  {# size 控制输入框宽度 #}

            <!-- <span> 标签是 HTML 中最常用的行内容器元素，
                用于对文档中的小部分内容进行分组和样式化 -->
            {% for error in form.username.errors %}  <!-- [!code ++] -->
            <span style="color: red;">[{{ error }}]</span> <!-- [!code ++] -->
            {% endfor %} <!-- [!code ++] -->
        </p>
        <p>
            {{ form.password.label }}
            {{ form.password(size=32) }}

            {% for error in form.password.errors %} <!-- [!code ++] -->
            <span style="color: red;">[{{ error }}]</span> <!-- [!code ++] -->
            {% endfor %} <!-- [!code ++] -->
        </p>
        <p>
            {{ form.remember_me() }} 
            {{ form.remember_me.label }}
        </p>
        <p>{{ form.submit() }}</p>
    </form>
{% endblock %}
```

注意到类似于 `return redirect('/login')` 和 `<a href="/index">Home</a>` 会产生硬编码的问题。

::: info ex:
如果我们想要修改 `/login` 页面的 url 改为 `/auth/signin`，就不得不去项目里的每一个 文件中查找并修改这个链接。
:::

我们可以使用函数 `url_for()` 来解决这个问题：

::: code-group

```python
@app.route('/auth/signin', methods=['GET', 'POST'])
def login():
    # ...
    # url_for() 会根据视图函数自动生成 url 地址
    return redirect(url_for('index'))
```

```html [.html]
<a href="{{ url_for('index') }}">Home</a>
```
:::

## 在 Flask 中管理静态文件

在 Web 开发中，静态文件指的是那些内容固定、不需要由后端 Python 代码动态生成的文件。它们主要包括：

- CSS 样式表 (`.css` 文件)
- JavaScript 脚本 (`.js` 文件)
- 图片 (`.jpg`, `.png`, `.gif` 等)
- 字体文件
- 有时也包括一些无需修改的、纯粹展示用的 HTML 文件

**为了更好地组织项目，Flask 框架有一个约定：所有的静态文件，都应该放在一个名为 `static` 的文件夹里。**

接下来，我们就可以通过 `url_for()` 函数链接到静态文件。

基本语法：`url_for('static', filename='文件在static文件夹内的路径')`

1. 在导航栏中添加一个指向静态页面的链接

    假设在 `blogapp/static/` 文件夹下，直接放了一个名为 `plain.html` 的文件。现在想在导航栏里加一个链接指向它。

    ```html
    <!-- url_for('static', ...): 
    第一个参数' static' 是一个特殊的指令，它告诉 Flask：
    我要找一个静态文件，到 static 文件夹里去定位。 -->

    <!-- filename='plain.htm': 
    第二个参数 filename 告诉 Flask 具体要找哪个文件。 -->
    <a href="{{ url_for('static', filename='plain.html') }}">Plain Page</a>
    ```

2. 在 `<head>` 中引入CSS样式表

    通常我们会把 CSS 文件放在 `static` 文件夹内部的一个子文件夹里，比如 `style`，这样结构更清晰。假设 CSS 文件路径是 `blogapp/static/style/mystyle.css`。

    ```html [base.html]
    <head>
        <link rel="stylesheet" href="{{ url_for('static', filename='style/mystyle.css') }}">
    </head>
    ```

相比硬编码的方式， `url_for()` 函数会自动生成正确的链接，确保您的网站在任何环境下都能正常工作。

## Flask 操作数据库

我们将使用一个流行的 Flask 扩展来操作数据库，叫做 Flask-SQLAlchemy。

其次我们将使用 SQLite 数据库。它的优点是极其简单，因为它不需要运行一个独立的服务器，整个数据库就是一个普通的文件。对于 Python 3 来说，它甚至是内置的，无需额外安装。

**安装 Flask-SQLAlchemy**

```bash
pip install flask-sqlalchemy
```

接下来在 `config.py` 中添加数据库配置：

```python [config.py]
import os
from pathlib import Path

"""
Path(__file__) 创建一个指向当前文件 (config.py) 的路径对象。
resolve() 将其转换为一个绝对路径，解决了所有符号链接等问题。
parent 直接获取该文件所在的父目录。
"""
BASE_DIR = Path(__file__).resolve().parent

class Config:
    """
    基础配置类，存放所有环境共用的配置。
    """
    SECRET_KEY: str = os.environ.get('SECRET_KEY') or '你自己的随机密钥'
    
    # 连接到 SQLite 数据库，先从环境变量中获取 DATABASE_URL
    # 如果没有设置该环境变量，则使用项目目录下的 blogdb.db 文件
    SQLALCHEMY_DATABASE_URI: str = os.environ.get('DATABASE_URL') or \
        f"sqlite:///{BASE_DIR / 'blogdb.db'}"

    # 关闭事件追踪功能节约性能，在新的 Flask-SQLAlchemy 中已被弃用
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
```

在 `__init__.py` 中进行初始化:

```python [__init__.py]
from flask import Flask
from blogapp.config import Config
from flask_sqlalchemy import SQLAlchemy # 1. 导入

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app) # 2. 创建数据库实例

from blogapp import routes, models # 3. 导入自己编写的 models
```

**ORM：用 Python 类定义数据库结构**

通过 ORM，我们不再需要写 SQL 的 CREATE TABLE 语句，而是通过 Python 类来定义数据表的结构。

```python [models.py]
from blogapp import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    # ... 稍后会添加关系 ...

    def __repr__(self):
        return '<User {}>'.format(self.username)
```

- `User(db.Model)`：所有的模型类都必须继承自 `db.Model` 。
- `db.Column(...)`：类中的每一个 `db.Column` 实例都代表表中的一个字段（一列）。
- `primary_key=True`：将 `id` 字段设置为主键，它是每一条记录的唯一标识。
- `unique=True`：保证了 `username` 和 `email` 字段在表中不能有重复值。
- `index=True`：为该字段创建一个索引，加快查询速度。

::: tip
`def __repr__(self):` 是 Python 中的一个特殊方法（魔术方法），用于定义对象的官方字符串表示。

相比 `__str__` 方法，`__repr__` 更侧重于为开发者提供调试信息，通常包含更多细节，便于识别对象的状态和属性。
::::

使用 `db.ForeignKey()` 方法可以建立表之间的关系：

```python [models.py]
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    # 1. 定义“一对多”关系
    posts = db.relationship('Post', backref='author', lazy='dynamic') # 懒加载

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True) 
    body = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    # 2. 定义外键
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Post {}>'.format(self.body)
``` 

`db.relationship(...)` 不是一个数据库中的真实字段。 它是SQLAlchemy提供的一个高层级关系视图：
- `posts = db.relationship(...)`：这行代码让我们可以通过一个 `User` 对象，用 `user.posts` 的方式轻松获取该用户发表的所有帖子。
- `backref='author'`：这是一个反向引用。它会自动为 `Post` 模型添加一个 `.author` 属性，让我们可以通过 `post.author` 的方式轻松获取发表该帖子的 `User` 对象。

**初始化数据库**

现在 `models.py` 里已经定义好了两个模型，但物理的数据库文件（`blogdb.db`）还不存在。我们需要一个命令来根据模型创建这个文件和里面的数据表。

我们使用 `flask shell` 命令进入一个特殊的交互式 Python 环境。这个环境会自动加载我们的 Flask 应用，让我们可以在其中执行命令。

```bash
(flaskenv) microblog> flask shell
>>> from blogapp import db
>>> db.create_all()  # 创建所有数据表
>>> exit()
```

发生了什么？

执行 `db.create_all()` 后，Flask-SQLAlchemy 会找到所有继承自 `db.Model` 的类（也就是 `User` 和 `Post`），并在 `config.py` 指定的位置创建一个名为 `blogdb.db` 的 SQLite 文件，同时在文件内根据我们的模型定义创建好 `user` 和 `post` 两张表。

**增加**

操作数据库也需要回到 `flask shell` 环境中进行。

写入操作需要依赖于 Session（会话）执行。

- 会话 (Session) ：您可以把 `db.session` 想象成一个暂存区，做的所有与写入有关的操作（增加、修改、删除）都先被放进这个暂存区。

- 只有当您执行 `db.session.commit()` 时，这些更改才会被一次性地、永久地写入到数据库文件中。

```bash
(flaskenv) microblog> flask shell
>>> from blogapp.models import User, Post
# 创建一个 User 对象
>>> u1 = User(username='vivek', email='vivek.nallur@ucd.ie') 
>>> db.session.add(u1)  # 把这个对象添加到会话中
>>> db.session.commit()  # 提交会话，写入数据库
```

**读取**

SQLAlchemy 为我们所有的模型类都提供了一个 `query` 属性，它是所有查询的入口点。

| 查询方法 | 说明 |
| --- | --- |
| `users = User.query.all()` |  返回一个包含所有 `User` 对象的列表 |
| `u = User.query.get(1)` | 根据主键获取单个 `User` 对象 |
| `peter = User.query.filter_by(username='peter').first()` | 简单的过滤查询，返回第一个匹配的 `User` 对象 |
| `User.query.order_by(User.username).all()` | 按照用户名排序，返回包含所有 `User` 对象的列表 |

**使用关系**

```bash
(flaskenv) microblog> flask shell
>>> from blogapp.models import User, Post
>>> u = User.query.get(1) # 获取 id=1 的用户
>>> p = Post(body='Flask!', author=u) # 创建一个 Post 对象，并指定作者
# 添加并提交
>>> db.session.add(p)
>>> db.session.commit()
```

反过来，我们也可以轻松地通过用户找到他的所有帖子：

```python
# u.posts 就是我们之前定义的 relationship
for p in u.posts.all():
    print(p.body)
```

**删除**

```bash
>>> u = User.query.get(1)
>>> db.session.delete(u)  # 删除该用户
>>> db.session.commit()
```

## 结合 Flask 表单和数据库

通过一个用户注册的例子，来展示如何将 Flask-WTF 表单和数据库操作结合起来。

首先定义一个表单，包含用户名、邮箱、密码、重复密码和同意规则的字段，并为它们都添加了 `DataRequired()` 验证器，确保用户必须填写所有项目：

```python [blogapp/forms.py]
# ...

# 在 forms.py 中新增
class SignupForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    password2 = PasswordField('Repeat Password', validators=[DataRequired()])
    accept_rules = BooleanField('I accept the site rules', validators=[DataRequired()])

    submit = SubmitField('Register')
```

接下来，我们需要一个 HTML 页面来向用户展示这个表单：

```html [blogapp/templates/signup.html]
{% extends "base.html" %}
{% block content %}
    <h1>Register a New User</h1>
    <form action="" method="post">
        <!-- CSRF 保护 -->
        {{ form.hidden_tag() }}

        <!-- 用户名 -->
        <p>
            {{ form.username.label }}<br>
            {{ form.username(size=32) }}

            <!-- 错误信息 -->
            {% for error in form.username.errors %}
            <span style="color: red;">[{{ error }}]</span>
            {% endfor %}
        </p>

        <!-- 省略重复部分 -->

        <!-- 重复密码 -->
        <p>
            {{ form.username.label }}<br>
            {{ form.username(size=32) }}

            {{ form.password2.label }}<br>
            {{ form.password2(size=35) }}

            <!-- 错误信息 -->
            {% for error in form.password2.errors %}
            <span style="color: red;">[{{ error }}]</span>
            {% endfor %}
        </p>

        <!-- 同意规则和提交 -->
        <p>{{ form.accept_rules() }} {{ form.accept_rules.label }}</p>
        <p>{{ form.submit() }}</p>
    </form>
{% endblock %}
```

我们需要创建一个新的视图函数来处理注册逻辑：

```python [blogapp/routes.py]
# ...

# 在 routes.py 中新增 (需要先导入 SignupForm, User, db, flash, redirect, url_for)
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()

    # 验证表单数据
    if not form.validate_on_submit():
        return render_template('signup.html', title='Register a new user', form=form)

    # 检查两次输入的密码是否一致
    if form.password.data != form.password2.data:
        flash('Passwords do not match!')
        return redirect(url_for('signup'))

    # 创建 User 对象并存入数据库
    user = User(username=form.username.data, email=form.email.data)
    # (注意：实际应用中需要对密码进行哈希处理，这里为简化省略了)
    db.session.add(user)
    db.session.commit()

    # 显示成功消息并重定向到登录页面
    flash('User registered with username: {}'.format(form.username.data))
    return redirect(url_for('login'))
```

最后一步，我们需要在网站的导航栏中添加一个链接，让用户能找到这个新的注册页面。

打开 `base.html`，在导航区添加一个指向 signup 页面的链接：
```html [blogapp/templates/base.html]
<nav>
    <a href="{{ url_for('index') }}">首页</a>
    <a href="{{ url_for('about') }}">关于我们</a>
    <a href="{{ url_for('signup') }}">注册</a> <!-- 新增 -->
</nav>
```

**结束！**

## Flask 记录用户状态

`session`（会话）是 Flask 提供的一个像字典一样的对象，可以在一次请求中往里面存入数据，然后在后续的该用户的其他请求中，再把这些数据取出来。

Flask 会在后台通过加密的 cookie 来安全地处理这些信息。

```python [blogapp/routes.py]
from flask import session

# ...

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        # 假设验证通过，记录用户登录状态
        session['username'] = form.username.data  # 存入用户名
        flash('Login requested for user {}'.format(form.username.data))
        return redirect(url_for('index'))

    return render_template('login.html', title='Sign In', form=form)
```

你可以创建不同的基础面板，给不同用户使用：
- `base.html`：给未登录的访客使用
- `base_logged_in.html`：给已登录的用户使用

## JavaScript 基础

JavaScript 是一种轻量级的脚本语言 (scripting language)，其语法类似 Python。JS 直接在用户的浏览器中运行，主要作用是让网页变得可交互 (interactive)，例如：
- 向 HTML 中插入动态文本
- 对用户的事件（如点击、鼠标移动）做出反应
- 在用户的电脑上执行计算

和 CSS 一样，将 JavaScript 代码应用到 HTML 页面主要有三种方式，推荐使用外部 JavaScript 文件：

```html
<head>
    <script src="filename.js" type="text/javascript"></script>
</head>
```

与从上到下顺序执行的后端脚本不同，前端 JavaScript 大部分时间都在等待等待用户或浏览器触发某个事件。

::: details 嵌入式和内联式

嵌入式：
```html
<script type="text/javascript">
  alert("Hello World!"); 
</script>
```

内联式：
```html
<button onclick="alert('You clicked me!')">Click me!</button>
```
:::

当用户使用对于不支持 JavaScript 的浏览器时，可以使用 `<noscript>` 标签进行提示，此处省略。

#### 变量

在现代 JavaScript中，我们使用 `let` 关键字来声明变量（旧的 JavaScript 代码会使用 `var`）：

```javascript
let name;
let age = 10;
let message = "Hello, World!";
```

JavaScript 的类型是动态的，像 Python 一样，变量可以随时被赋予不同类型的值：

```javascript
let myVar = 35;       // 此时 myVar 是一个数字
myVar = "Bob";        // 现在 myVar 变成了一个字符串
myVar = true;         // 现在 myVar 又变成了一个布尔值
```

#### 数据类型

JavaScript 的数据类型分为两大类：

- 原始数据类型 (Primitive Data Types)
    - `Number`：表示数字，不区分整数和浮点数
    - `String`：字符串
    - `Boolean`：布尔值，`true` 和 `false`

- 复合数据类型 (Composite Data Types)
    - `Array`：一个有序的数据集合
    - `Object`：一个无序的键值对集合

JavaScript 在处理不同类型数据混合运算时非常灵活，会自动进行类型转换。

#### 运算符

JavaScript 的运算符和大部分编程语言类似，这里只介绍两个特殊的运算符：
- 严格相等运算符 `===`：不仅比较值是否相等，还比较类型是否相同。
    ```javascript
    5 =='5'      // true
    5 === '5'    // false
    5 === 5      // true
    ```
- 严格不等运算符 `!==`：不仅比较值是否不等，还比较类型是否不同。
    ```javascript
    5 !='5'      // false
    5 !== '5'    // true
    5 !== 5      // false
    ```

虽然 `5 == '5'` 返回 `true`，但在对象的判断上，`==` 其实也是根据引用来返回结果而非内容的相等性：

```javascript
let a = [1, 2, 3];
let b = [1, 2, 3];
a == b      // false
```

#### Array（数组）

JavaScript 的数组类似 Python 的列表，长度可变，可以存放不同类型的数据：

```javascript
let fruits = ['apple', 'banana', 'orange'];
let numbers = [1, 2, 3, 4, 5];
let mixed = ['hello', 42, true];

// 使用构造函数
let colors = new Array('red', 'green', 'blue');
```

访问元素也通过：

```javascript
// 获取长度
let len = fruits.length;

// 通过索引访问元素
let firstFruit = fruits[0];

// 添加元素
fruits.push('kiwi');

// 删除最后一个元素
fruits.pop();

// 修改元素
fruits[1] = 'grape';

// 删除指定位置的元素
// 参数一：起始索引；参数二：删除的数量
fruits.splice(2, 1); 
```

#### if 语句 & 循环

**if 语句**

```javascript
if (condition) {
    // 条件为真时执行的代码
} else if (anotherCondition) {
    // 另一个条件为真时执行的代码
} else {
    // 所有条件都不为真时执行的代码
}
```

**循环**

```javascript
// for 循环
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// 遍历一个集合
let colors = ['red', 'green', 'blue'];
for (let color of colors) {
    console.log(color);
}

// while 循环
let i = 0;
while (i < 10) { 
    // ...
    i++; 
}
```

#### 函数

类似 Python，类型是动态的，函数不需要指定参数和返回类型：

```javascript
function sum(a, b) {
    return a + b;
}

// 或者将函数赋值给一个变量：
let sum = function(a, b) {
    return a + b;
};

// 或者使用箭头函数（ES6 语法）：
let sum = (a, b) => a + b;

// 调用函数
let result = sum(5, 10); 
```

#### 对象

JavaScript 中的对象是一个复合数据类型，由一系列的 “名称:值” (name: value) 对组成 。这些“名称:值”对也被称为对象的属性。

```javascript
let person = {
    // 属性
    name: "Alice",
    age: 30,
    // 方法
    greet: function() {
        console.log("Hello, " + this.name);
    },
    // 或者：
    sayGoodbye() {
        console.log("Goodbye, " + this.name);
    }
};

// 访问属性 -> 输出 "Alice"
alert(person.name); 

// 调用方法 -> 输出 "Hello, Alice"
person.greet();
```

如果属性名包含空格或特殊字符，必须使用方括号语法访问：

```javascript
let obj = {
    "first name": "John",
    "last-name": "Doe"
};

// 访问属性
alert(obj["first name"]); // 输出 "John"
```

JavaScript 自带了许多非常有用的内置对象，例如:
- `Date`：处理日期和时间
- `Math`：提供数学常量和函数
- `String`：处理字符串
- `Window`：表示浏览器窗口（其实 `alert()` 就是 `window.alert` 的简写）

## DOM

DOM（文档对象模型）是连接 JavaScript 和 HTML 的桥梁：

- 在 JavaScript 看来，这个文档（HTML）里的每一个部分——从整个 `<html>` 标签，到里面的 `<head>`、`<body>`，再到每一个 `<h1>`、`<p>`、`<div>`，甚至标签里的文字——都是一个对象。一个标签包裹一个标签，形成了一个树状结构。

- DOM是浏览器根据HTML文档创建的一个“实时、可交互的对象树”，它为 JavaScript 提供了一套 API 接口，让 JS 能够读取和修改这个树上的任何部分。

- 当 JavaScript 通过 DOM 修改了这个“对象树”时，浏览器会立刻将这些变化反映到用户看到的页面上。



浏览器为我们提供了三个重要对象：`Window`，`Navigator` 和 `document`。JS 通过 `document` 全局对象来访问和操作 DOM 树。


#### 增删改查

**查找元素**

现代方法：

```javascript
// （推荐）使用 CSS 选择器语法来查找第一个匹配的元素
let firstParagraph = document.querySelector('p');
let specialItem = document.querySelector('.special');
let mainDiv = document.querySelector('#main');
```

传统方法：

```javascript
// 通过 ID 查找单个元素
let header = document.getElementById('header');

// 通过标签名查找所有匹配的元素，返回一个 HTMLCollection 列表
let allParagraphs = document.getElementsByTagName('p');

// 使用 CSS 选择器语法来查找所有匹配的元素，返回一个 NodeList 列表
let allItems = document.querySelectorAll('.item');
```

::: info
- `getElementsByTagName()` 返回的是一个实时集合 (live collection) 。这意味着，在获取集合之后，再向页面中添加一个新的同类型标签时，这个集合的长度会自动更新。
- `querySelectorAll()` 返回的是一个静态集合 (static collection) 。在获取集合之后，即使再向页面添加的新元素，这个静态集合的长度也不会改变 。
:::

**修改元素内容**

一旦获取到了一个元素对象，就可以对它为所欲为。

```javascript
// 修改标签内的内容
// 可以解析 HTML 标签
element.innerHTML = '<h1>新的HTML内容</h1>';  
// 更安全，直接成为目标元素的文本内容（忽略 HTML 标签）
element.textContent = '新的纯文本内容';  

// 修改属性 
// element.setAttribute('属性名', '属性值');
imageElement.setAttribute('src', 'new_image.jpg')
```

不推荐直接在 JS 中修改样式（`element.style.property = 'value';`），更专业的做法是通过添加/切换 CSS 类名来控制样式。

1. 预先定义好 CSS 类：

```css
.highlight {
    background-color: yellow;
    font-weight: bold;
}
```

2. 在 JS 中添加/切换类名：

```javascript
// 获取元素
let myElement = document.getElementById('myElement');
// 为它设置class属性为 'highlight'
myElement.classList.setAttribute('class', 'highlight');
```

这种做法保持了行为(JS)和表现(CSS)的分离。当你想修改高亮样式时，只需去修改 CSS 文件，而不用动任何 JavaScript 代码，维护起来非常方便。

**创建与添加元素**

```javascript
// document.createElement('tagName'): 创建一个新的、空的元素对象
let newParagraph = document.createElement('p');

// 将新元素添加到父元素的子元素列表末尾
// 如果 newElement 是一个已经存在于 DOM 树中的元素，则会进行移动
parentElement.appendChild(newElement)；

// 克隆一个元素（包括它的所有子元素）
let clonedElement = originalElement.cloneNode(true); // true 表示深度克隆
```

**删除元素**

```javascript
// 从父元素中删除子元素
parentElement.removeChild(childElement);
```

#### 事件处理

JS 可以监听用户在页面上的各种操作（事件），并对这些操作做出反应。例如：

```html
<h1 id="greeting">Hello!</h1>
<button id="changeBtn">Change Text</button>
```

在 JS 中监听：

```javascript
// 1. 先通过DOM找到我们需要操作的元素
const greetingElement = document.getElementById('greeting');
const changeButton = document.getElementById('changeBtn');

// 2. 为按钮添加一个 'click' 事件的监听器
changeButton.addEventListener('click', function() {
    // 3. 当按钮被点击时，通过 DOM 修改 h1 元素的内容
    greetingElement.textContent = 'Goodbye!';
    greetingElement.style.color = 'blue';
});
```

## JavaScript 中级

#### 函数

首先，函数可以在被声明之前调用，这是因为 JavaScript引擎在执行代码前，会先把所有的函数声明提升到作用域的顶部。例如：

```javascript
sayHello(); 

function sayHello() {
    console.log("Hello, World!");
}
```

但在使用函数表达式时，函数不会被提升：

```javascript
SayHello();   // 会报错

let SayHello = function() {
    console.log("Hello, World!");
};
```

函数可以作为变量的特性使用变得非常灵活：

```javascript
// yes 和 no 是回调函数
function ask(question, yes, no) {
    if (confirm(question)) {   // confirm 会弹出一个确认框
        yes();   // 如果用户点“确定”，就回调 yes 函数
    } else {
        no();   // 如果用户点“取消”，就回调 no 函数
    }
}

function showOk() {
    alert("You agreed.");
}

function showCancel() {
    alert("You canceled the execution.");
}

// 调用 ask，并把 showOk 和 showCancel 作为回调函数传进去
ask("Do you agree?", showOk, showCancel);
```

此外，如果你尝试打印一个函数对象，你会看到它的源代码：

```javascript
function greet() {
    alert("Hello!");
}

// 输出函数的源代码
alert(greet); 
```

#### 属性删除

JS 对象的属性是可以被删除的，使用 `delete` 关键字，例如：

```javascript
let user = {
    name: "John",
    age: 30
};

delete user.age; // 删除 age 属性
alert(user.age); // undefined
```

`delete` 方法还具有返回值，如果删除成功则返回 `true`。

#### 字符串

JS 里也有模板字符串，使用反引号 (`` ` ``) 包裹，并且可以通过 `${变量名}` 的方式插入变量：

```javascript
let name = "Alice";
let greeting = `Hello, ${name}!`; 
```

JS 里的字符串是不可变的，如果你想要修改字符串，必须创建一个新的字符串：

```javascript
let str = "Hello";
let newStr = str.replace("H", "J"); // newStr 现在是 "Jello"
```

你可以通过索引访问字符串中的单个字符：

```javascript
let str = "Hello";
let firstChar = str[0]; 
```

此外还有多行字符串：

```javascript
let multiLineStr = `Hello,
Amiya!
o.O
`;

```

可以使用 `str.match()` 和 `str.test()` 方法进行正则表达式匹配：

```javascript
let str = "The rain in SPAIN stays mainly in the plain";
let result = str.match(/ain/gi); // ['ain', 'AIN', 'ain', 'ain']

let pattern = /ain/gi;
let testResult = pattern.test(str); // true
```