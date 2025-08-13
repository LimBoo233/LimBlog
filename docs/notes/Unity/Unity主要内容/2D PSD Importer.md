# `2D PSD Importer`

官方文档：[2D PSD Importer 11.0.1](https://docs.unity3d.com/Packages/com.unity.2d.psdimporter@11.0/manual/)

::: details `PSB` 和 `PSD` 
`PSD` 和 `PSB` 都是 Adobe Photoshop 的原生文件格式，它们是专业数字图像编辑领域的基石。其核心价值在于完整地记录了创作过程中的每一个可编辑细节，而不仅仅是最终的图像结果。

`PSB` 格式在功能上与 `PSD` 完全相同，它存在的唯一目的就是打破 `PSD` 的尺寸（30,000 x 30,000）和容量限制（2 GB），以应对超大规模的图像处理需求。

Unity 官方推荐使用 `PSB` 格式。
:::

## 概述

PSD Importer 是一个资源导入器（Asset importer），它可以将 Adobe Photoshop 的 `.psb` 文件导入到 Unity 中，并根据导入的源文件生成一个由精灵组成的预制体。

当使用 PSD Importer 将 `.psb` 文件导入 Unity 时，导入器会根据所导入文件的图像和图层数据生成一个预制体。为确保导入器能正确导入文件，请确保 Photoshop 文件在保存时启用了最大兼容性（Maximize Compatibility）。

PSD Importer 不支持 Photoshop 的所有图层、视觉效果或功能。在生成精灵和预制体时，PSD Importer 会忽略以下 Photoshop 的图层属性和视觉效果：
- 通道（Channels）
- 混合模式（Blend Modes）
- 图层不透明度（Layer Opacity）
- 效果（Effects）

如果您想为生成的精灵添加视觉效果，可以使用精灵编辑器（Sprite Editor）的第二纹理（Secondary Textures）模块为精灵添加额外的纹理。

::: info 重要提示（Unity 6.0+）
注意：从 Unity 6.0 版本开始，精灵库资源（Sprite Library Asset）不再能通过 2D 动画（2D Animation）的蒙皮编辑器（Skinning Editor）进行编辑，因为类别（`Category`）和标签（`Label`）选项已从精灵可见性（Sprite Visibility）面板中移除。但是，如果项目中存在来自先前版本的数据，PSD Importer 仍会自动生成精灵库资源。
:::

## PSD Importer 检视器属性

在您将 `.psb` 文件导入项目后，即可使用 PSD Importer 的设置。请选中该 `.psb` 资源文件，并将其纹理类型（`Texture Type`）设置为精灵`Sprite )(2D and UI)`。

通过 Settings 选项卡，您可以自定义 PSD Importer 导入文件的方式。这些设置被分类到各个可折叠的区域中。

### General

| 属性 | 描述 |
| ---- | ---- |
| `Texture Type` | 选择 `Sprite (2D and UI)` 以将纹理作为精灵导入。要开始将导入的纹理用于 `2D Animation` 包，此项为必需设置。 |
| `Sprite Mode` | 使用此属性指定 Unity 如何从图像中提取精灵图形。该属性默认为多个 `Multiple`。选项包括：<ul><li>`Single`：选择此项，Unity 会将导入的纹理视为一个单一的精灵资源，不包含多个独立部分。这对于在源文件中绘制在单个图层上而不是分散到多个图层上的角色来说非常理想。</li><li>`Multiple`：这是默认选项。选择此项，Unity 会为源文件中的每个图层创建一个精灵。这对于不同部分分散在源文件多个图层中的复杂美术作品非常理想，并能为使用 2D 动画包制作动画准备好导入的纹理。</li></ul> |
| `Pixels Per Unit` | 设置相当于一个 Unity 单位的像素数量。 |
| `Mesh Type` | 设置 Unity 类型。该属性默认为紧密 (Tight)。 |
| `Extrude Edges` | 使用滑块来确定从精灵边缘延伸出多少网格。 |
| `Generate Physics Shape` | 如果尚未定义自定义物理形状 (Custom Physics Shape)，启用此选项可根据精灵的轮廓生成一个默认的物理形状 (Physics Shape)。 |
| `Automatic Reslice` | 仅当 `Import Mode` 设置为 `Individual Sprites (Mosaic)` 时可用。启用此设置将从导入的图层重新生成精灵，并清除您对该精灵及其元数据所做的任何更改。 |


**自动重新切片（`Automatic Reslice`）**

启用此设置会丢弃用户对当前 `SpriteRect` 数据集所做的所有修改，并根据当前的源文件重新生成所有 `SpriteRect`。

如果额外的 `SpriteRect` 元数据（例如权重和骨骼数据）对于新生成的 `SpriteRect` 仍然有效，则这些数据会被保留。

### Layer Import

仅当 `Texture Type` 设置为 `Multiple` 时，以下部分才可用。

| 属性 | 描述 |
| ---- | ---- |
| `Include Hidden Layers` | 启用后在导入时包含 `.psb` 文件中的隐藏图层。这与在导入 Unity 前取消隐藏源文件中所有图层的效果相同。若仅导入可见图层，请取消勾选此选项。 |
| `Keep Duplicate Name` | 启用后 PSD Importer 生成的精灵将与其源图层同名，即使存在多个同名图层也是如此。 |
| `Use Layer Group` | 此设置仅在启用角色骨骼绑定（`Character Rig`）时可用。启用后将生成一个遵循所导入 `.psb` 文件图层与分组层级结构的预制体（Prefab）。 |
| `Layer Mapping` | 在 `.psb` 文件图层与生成的精灵之间建立映射关系的方法：<ul><li>`Use Layer ID`：使用 `.psb` 的内部 ID 进行映射；即使图层名称发生更改，映射仍然有效。</li><li>`Use Layer Name`：使用图层名称进行映射；为使其正常工作，每个图层名称必须唯一。</li><li>`Use Layer Name (Case Sensitive)`：使用区分大小写的图层名称进行映射；同样要求名称唯一。</li></ul> |
| `Import Mode` | 指定如何导入源文件中的图层，默认为 `Individual Sprites (Mosaic)`（单个精灵，马赛克模式）。选项包括：<ul><li>`Individual Sprites (Mosaic)`：从各图层生成独立精灵，并将它们组合到一张精灵表布局的单一纹理中。</li><li>`Merged`：生成一个合并了所有图层的纹理。</li></ul> |
| `Mosaic Padding` | 当导入模式为 `Individual Sprites (Mosaic)` 时，用于控制纹理中每个图层之间的填充空间。 |
| `Sprite Padding` | 当导入模式为 `Individual Sprites (Mosaic)` 时，用于增加纹理中每个精灵矩形区域大小。 |

### Character Rig

仅当 `Texture Type` 设置为 `Multiple`、`Import Mode` 设置为 `Individual Sprites (Mosaic)`，并且已安装 `2D Animation package` 时，此部分才可用。

| 属性 | 描述 |
| ---- | ---- |
| `Use as Rig` | 启用此属性可让 PSD Importer 根据导入的源文件生成一个预制体。PSD Importer 会从源文件的导入图层中生成精灵，并且这些精灵的层级结构和位置将基于它们在源文件中的图层层级和位置。 |
| `Main Skeleton` | 仅当启用 `Use as Rig` 时可用。请在此处分配此角色预制体的骨骼层级将要引用的骨架资源（Skeleton Asset）。如果未分配骨架资源，导入器将自动生成一个骨架资源作为此角色的子资源。骨架资源包含了在 2D 动画包的 Skinning Editor 中定义的骨骼层级结构（更多信息请参阅 Skeleton Sharing）。 |
| `Pivot` | 仅当启用 `Use as Rig` 时可用。选择精灵的轴心点。选项包括：<ul><li>`Custom`：定义自定义轴心点位置的 X 和 Y 坐标。</li><li>所有位置选项：从下拉菜单中选择您想在精灵上放置轴心点的位置。</li></ul> |

**用作骨骼绑定（Use as Rig）的详细说明**

启用此属性后，PSD Importer 会生成一个包含多个精灵的预制体，这些精灵基于所导入源文件的各个图层。PSD Importer 还会自动为这些精灵赋予一个 `Order in Layer` 值，该值会根据它们在源文件图层层级中的位置进行排序。因此，生成的预制体能够尽可能地再现原始源文件中素材的排列和外观。

预制体中每个精灵的名称与其源图层相同，除非发生名称冲突错误，这通常是由于源图层中存在重复名称所致。

如果精灵包含了骨骼或权重数据，PSD Importer 会自动为其添加 `Sprite Skin` 组件。这种情况通常发生在：该精灵已经在蒙皮编辑器中被绑定了骨骼和权重，然后源文件被重新导入；或者您手动复制并粘贴了骨骼和权重数据到精灵上。

**主骨架（`Main Skeleton`）的详细说明**

骨架资源  `.skeleton` 是一个包含了骨骼层级结构的资源，该结构可用于 2D 动画包进行动画制作。只有当您启用了 `Use As Rig` 导入器设置来导入 `.psb` 文件时，`Main Skeleton` 属性才可用。导入 `.psb` 文件后，将一个 `.skeleton` 资源分配给 `Main Skeleton` 属性，可让生成的预制体角色自动被绑定上该 `.skeleton` 资源中所包含的骨骼层级结构。

如果没有为导入器的 `Main Skeleton` 属性分配 `.skeleton` 资源，那么系统会自动生成一个 `.skeleton` 资源作为导入源文件的子资源，并将其命名为 [资源文件名] Skeleton。您可以通过在导入时将同一个 `.skeleton` 资源分配给不同预制体的 `Main Skeleton` 属性，从而在它们之间共享骨架资源。

当您在 2D 动画包的 Skinning Editor 中打开并编辑角色时，该模块将显示分配给 `Main Skeleton` 的骨架资源所提供的骨骼层级，以供您进行绑定操作。

**瓦片调色板（Tile Palette）**

以下部分允许您生成瓦片资源和瓦片调色板，其中源文件中的每个图层都将生成一个对应的瓦片资源。

### Layer Management Tab

Layer Management Tab 允许您自定义 `Importer` 从 `Photoshop` 文件中导入各个 `layer` 的方式。

**Layer hierarchy tree**

在 Layer Management Tab 的层级树中，`Photoshop` 的图层组会以一个可折叠的文件夹图标 📁 表示，而普通的 `Photoshop` `layer` 则仅显示其名称。

**Layer visibility**

相对于 `visible` 的 `group` 或 `layer`，在源文件中 `hidden` 的 `group` 或 `layer` 会以不同颜色的文本来表示。

**Layer Importing**

每个 `Group`/`Layer` 旁边的 `checkbox` 决定了该项是否会被导入。当 `checkbox` 被勾选时，对应的 `Group` 或 `Layer` 才会被导入。
- 如果在 Layer Management Tab 或 `Settings Tab` 中取消勾选 `Include Hidden Layers` 选项，那么只有 `visible` 的 `layer` 会被导入。
- 在此状态下，如果一个 `hidden` 的 `group` 或 `layer` 被勾选（标记为导入），旁边会出现一个警告图标 ⚠️。
- 要导入一个 `hidden` 的 `layer`，必须勾选 `Settings Tab` 或 Layer Management Tab 中的 `Include Hidden Layers` `checkbox`。
- 要进行批量操作，您可以使用 `Layer Importing` 列标题处的下拉菜单。其中的选项包括：`Select All Visible Layers`、`Deselect All Visible Layers`、`Select All Hidden Layers`、`Deselect All Hidden Layers`。


**Merge Groups**

`Photoshop` `Group` 中的多个 `layer` 可以在导入时被 `merge` 成一个单一的 `Sprite`。将鼠标悬停在一个 `Group Layer` 上，其左侧会出现 `Merge` 图标。

点击该图标，即可将此 `Group` 中的所有 `layer` 标记为合并导入，生成一个单一的 `Sprite`。

**Separate Groups**

将鼠标悬停在一个已 `Merge` 的 `Group layer` 上，会显示出 `Separate` 图标（箭头朝上）。

再次点击该图标，即可分离此 `Group layer`，使其内部的所有 `Layer` 作为独立的 `Sprite` 导入。

**Subgroups within Group layers**

- 如果一个 `Group` 包含了其他 `Group`（`subgroups`），并且它本身被 `Merge`，那么其 `subgroup` 中的所有 `layer` 也会被一并 `Merge` 成一个单一的 `Sprite`。

- 如果一个 `child Group` 当前被设置为 `Merge`，那么其 `parent Group` 上会显示出不同的图标，以表明其内部有 `child Group` 正被设置为 `Merge` 状态。

## Skeleton sharing

您可以在不同的导入 Asset 之间共享 `.skeleton`，只需将一个资产的 `.skeleton` 分配给另一个资产的 `Main Skeleton` 属性即可。此功能可与 `2D Animation` 包结合使用，以便在 Skinning Editor 中编辑 `.skeleton` 资产的骨骼。