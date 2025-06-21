# 我的第一篇笔记

你好，世界！

这是我用 VitePress 创建的第一篇真正的笔记。感觉太棒了！

- 我学会了如何初始化项目。
- 我学会了如何解决环境问题。
- 我学会了如何启动开发服务器。

## 下一步做什么？

我准备学习如何把这篇笔记添加到导航栏和侧边栏。

```csharp
private void Update()
{
    # region 1. 时间缩放比例
    // 时间速度
    // Time.timeScale = 1f;
    # endregion

    # region 2. 帧间隔时间（秒）
    // 主要是用来计算位移的
    // 根据需求选择
    // 1. 如果希望游戏暂停时候不动的，使用deltaTime
    // 2. 如果希望不受暂停影响，使用unscaledDeltaTime

    // 受scale影响的
    // Time.deltaTime;
    // 不受scale影响的
    // Time.unscaledDeltaTime;
    # endregion

    # region 3. 游戏开始到现在的时间
    // 它主要用来单机游戏的计时
    // 受scale影响的
    // Time.time;
    // 不受scale影响的
    // Time.unscaledTime;
    # endregion

    # region 5. 帧数
    // 从游戏到现在跑了多少帧
    // Time.frameCount;
    # endregion
}

private void FixedUpdate()
{
    # region 4. 物理时间间隔
    // 受scale影响
    // Time.fixedDeltaTime;
    // 不受scale影响
    // Time.fixedUnscaledDeltaTime;
    # endregion
}
```