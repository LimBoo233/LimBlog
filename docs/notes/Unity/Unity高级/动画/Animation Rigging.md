# Animation Rigging

**Coming soon...**

## 基础设置

1. 在携带 Animator 组件的模型物体上添加 Rig Builder 组件
2. 在模型上需要有一个携带 Rig 组件的空物体管理全部 IK
3. （Optional）在携带 Animator 的角色模型上添加 Bone Render 组件可视化骨骼
4. 将 Rig 对象拖拽到 Rig Builder 的列表当中（Rig Layer 0）

以上步骤也可通过选中一个带 Animator 的对象后，利用 Unity 最上方的选项快捷完成。

## 添加约束

在 Rig 下面新建一个空物体（例如：Head Aim），给这个物体添加一种 Constraint 组件，专门负责一种 IK。

- Constrained Object：角色身上需要应用 IK 的物体
- Source Objects：目标物体
- Aim Axis：正前方，部分情况需要根据 CConstrained Object 自身的旋转来调整
- Up Axis：上方，同上部分情况需要调整
- Weight：收 IK 影响的权重，最大为1

## 一些常用约束

- Two Bone IK Constraint：手臂或腿的 IK（弯曲两个骨头指向目标，比如手抓东西、脚踩地）

  需要设置：Root（肩膀/髋）、Mid（肘/膝）、Tip（手/脚）、Target（目标位置）、Hint（可选的弯曲方向提示）

- Chain IK Constraint：多骨链 IK（如脊椎、尾巴）
- Twist Correction：手臂扭转修正，避免旋转扭曲
- Override Transform：直接覆盖某个骨头的变换

## 注意

- 所有约束必须放在 Rig 层级下（或其子物体），Rig Builder 才会读取。
- 调试：在 Play 模式下修改约束参数会实时生效
- Bone Renderer 能帮你快速选中骨头。
- 可以在 Rig Builder 的 Layers 里调整多个 Rig 的权重和顺序，实现混合。
- 脚本控制：约束上的 Weight 属性可以被脚本修改，实现淡入淡出或条件触发。

详细推荐阅读官方文档。
