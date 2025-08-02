# Tilemap

Tilemap（瓦片地图）是 Unity 中用于创建 2D 关卡的强大工具，它允许你使用小的、可重复使用的 Sprite（称为 Tile）来构建游戏世界。 

## Tilemap 系统概述

Tilemap 就像是一个画布，你可以使用自定义的笔刷，自由地进行绘制。Tilemap 系统使得创建复杂的 2D 场景变得简单高效。

Unity 中的 Tilemap 系统主要由5个部分组成：
1. Sprite 精灵：2D 中纹理的容器。
2. Tile 瓦片：包含一个精灵，以及颜色和碰撞体类型。
3. Palette 调色板：保存 Tile，将它们绘制到网格上。
4. Brush 笔刷：用于将预制的笔刷绘制到画布上。
5. Tilemap 瓦片地图：画布。

## 使用 Tile Palette 进行绘制

在 Unity 中，Tilemap 的绘制可以分为以下几个步骤： 

1. **创建调色板（Palette）**  
   通过菜单栏选择 `Window > 2D > Tile Palette` 打开 Tile Palette 窗口。如果还没有调色板，Active Palette 会显示 `No Valid Palette`，点击 `Create New Palette` 创建一个新的调色板。创建时可设置 `Grid Type`（网格类型），常用类型有：
   - `Rectangular`：矩形瓦片
   - `Hexagonal`：六边形瓦片
   - `Isometric`：等距瓦片
   - `Isometric Z as Y`：等距瓦片，Z 轴作为 Y 轴

2. **添加 Tile 到调色板**  
   将准备好的 Sprite 拖拽到调色板窗口中，即可自动生成对应的 `Tile`。如需调整调色板内容，可点击右侧的 `Toggle Tile Palette Edit` 进入编辑模式。

3. **创建 Tilemap 画布**  
   在 Hierarchy 面板中右键，选择 `2D Object > Tilemap`，根据需要选择合适的 Tilemap 类型。Tilemap 就是我们实际绘制 2D 场景的画布。

4. **在 Tilemap 上绘制**  
   在 Tile Palette 窗口点击 `Toggle Tile Palette Edit` 进入编辑模式，使用吸色笔选择需要的 Tile，然后在 Scene 视图中点击或拖动鼠标，即可将 Tile 绘制到 Tilemap 上。

::: tip Tile Palette 绘制工具
![TilePalette工具](./images/TilePalette工具.png)
Tile Palette 面板上方提供了多种绘制工具：
- 选择工具
- 移动工具（可移动 Tile）
- 笔刷工具
- 框填工具
- 吸色笔
- 橡皮擦
- 填充工具
:::

注意事项：
- 如果 Tile 在调色板中未对齐网格中心，可勾选下方 `Can Change Z Position`，并在绘制时用 +、- 键调整 Z 轴位置。
- 精灵纹理的轴心点会影响 Tile 的显示效果。
- 使用等距瓦片时，Unity 默认用 z 轴决定前后关系，但等距瓦片游戏通常不需要 z 轴。为避免遮挡问题，可按如下方式调整排序：
    1. 进入 `Edit -> Project Settings -> Graphics -> Transparency Sort Mode`，将其设置为 `Custom Axis`，并将 `Transparency Sort Axis` 设置为 (0, 1, -0.26)。
    2. 将 `Tilemap Renderer` 组件的 `Mode` 设置为 `Individual`。

## `Grid` 组件

所有的 `Tilemap` 都需要一个 `Grid` 组件来定义网格的布局。如果是首次创建 Tilemap， Unity 会自动生成一个携带 `Grid` 组件的游戏对象（通常就叫做 `Grid`），就如同 UI 元素与 `Canvas` 的关系一样。

`Grid` 组件允许你设置与网格排列相关的属性：

| 属性名           | 说明 |
|------------------|------|
| `Cell Size`      | 网格单元的大小 |
| `Cell Gap`       | 网格单元之间的间距 |
| `Cell Layout`    | 网格的布局方式，如矩形、六边形等。Create Tile Palette 时不同类型的 Tilemap 的区别其实就在这里。|
| `Cell Swizzle`   | 将单元格坐标重新排序为选择类型。通常保持默认即可 |


如果美术资源太大或太小，可以通过修改 `Cell Size` 和图集的 `Pixels Per Unit` 来调整大小。

## `Tilemap` 组件

`Tilemap` 组件上的参数很少有情况需要去修改它，其包含了一些全局属性：

| 属性名           | 说明 |
|------------------|------|
| `Animation Frame Rate` | 瓦片动画播放速率 |
| `Color`    | 色调 |
| `Tile Anchor` | 瓦片的锚点偏移 |
| `Orientation` | 瓦片地图上瓦片的朝向。相当于 2D 平面使用的是 Unity 中的哪两个轴 |

## `Tilemap Renderer` 组件

`Tilemap Renderer` 组件挂载在 `Tilemap` 上，负责渲染瓦片内容。主要属性包括：

| 属性名           | 说明 |
|------------------|------|
| `Sort Order` | 所选瓦片在地图上的排序方向。可以视作设置画布原点 |
| `Mode` | 瓦片渲染模式。`Chunk` 会将精灵进行批处理渲染，`Individual` 则会逐个渲染 |
| `Detect Chunk Culling` | 渲染器渲染边界。`Auto` 模式下只会渲染摄像机内瓦片 |
| `Material` | 瓦片渲染使用的材质。默认使用 `Sprites-Default` 材质不受光照影响 |
| `Sorting Layer` | 瓦片渲染的排序层级 |
| `Order in Layer` | 瓦片渲染的层级顺序 |

## 添加碰撞器

为 Tilemap 添加碰撞器非常方便，只需要再 Tilemap 上添加一个 `Tilemap Collider 2D` 组件即可。该组件会自动为每个 Tile 生成碰撞器。

可以通过 `Composite Collider 2D` 组件来优化碰撞器的生成。该组件会将所有 `Tile` 的碰撞器合并为一个单一的碰撞器，从而提高性能。由于挂载 `Composite Collider 2D` 组件时还会自动添加 `Rigidbody 2D` 组件，如果不需要物理效果，可以将 `Rigidbody 2D` 的 `Body Type` 设置为 `Static`。

此外还可以在 Inspector 中修改 `Tile` 的 `Collider Type`：
| 瓦片碰撞器类型 | 说明 |
|------------------|------|
| `None` | 不生产碰撞器 |
| `Sprite`| 使用精灵的形状作为碰撞器（默认） |
| `Grid` | 将严格按照该瓦片所在的网格单元 (Grid Cell) 的形状来生成 |

