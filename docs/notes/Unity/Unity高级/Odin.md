
## Odin Inspector

- `Title`: 标题
- `ReadOnly`：限制从 Inspector 中修改值，但仍可见
- `LabelText`：替换在 Inspector 中显示的名称，可设置图标 [SdfIconType | API](https://odininspector.com/documentation/sirenix.odininspector.sdficontype)
- `GUIColor`：修改颜色，参数可传入 RGB ，字符串和 `nameof(返回Color的方法)`
- `Required`：不可为 null，参数为警告信息和警告类型（ex: Error, Warning）
- `AssetsOnly`：只可赋值 Assets 中的资源，不可用场景中的
- `Searchable`：可在集合中搜索

提示：

- `InfoBox`：提示信息
- `DetialedInfoBox`：比 `InfoBox` 多个展开框
- `ShowIf`/`HideIf`：需传入 `@***`，条件为 true 时会显示特性所指 `string`

分组：

- `BoxGrop`：划分组
- `FoldoutGroup`：将数个名字为 `FoldoutGroup名/xxx` 的 `BoxGrop` 或同类包裹到一个折叠组
- `HorizontaGroup`/`VerticlGroup`
- `TabGroup`：只能和自身组合

按钮（方法特性）：

- `Button`：会在 Inspector 上生成按钮，很多重载 [ButtonAttribute | API](https://odininspector.com/documentation/sirenix.odininspector.buttonattribute)
- `ButtonGroup`：排列按钮，可被 `FoldoutGroup` 包裹。会覆盖 Button 中的 `ButtonSize`

属性：

- `ShowInInspector`：在 Inspector 上显示

枚举：

- `EnumToggleButtons`：更好地展示多个枚举

字符串内特殊符号：

- `\`：分组中划分子级和父级
- `@`：跟 `bool` 表达式

其他：

- 很多特性都有 `VisibleIf`，接受 `@***` 参数

## Static Inspector