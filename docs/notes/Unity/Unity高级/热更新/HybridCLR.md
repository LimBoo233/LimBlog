# HybridCLR

HybridCLR 是成熟、高性能的热更新方案，开发者可以直接用热更 C# 代码，对语言特性几乎无限制，且不依赖虚拟机，更无需写繁琐的桥接代码。

项目需要由 IL2CPP 构建，最后的热更代码是 IL，由嵌入 IL2CPP 的 HybridCLR 解释执行。

> HybridCLR 以前叫华佗（Huatuo）

## 安装

git url: `https://gitee.com/focus-creative-games/hybridclr_unity.git` / `https://github.com/focus-creative-games/hybridclr_unity.git`

为了减少package自身大小，有一些文件需要从Unity Editor的安装目录复制。因此安装完插件后，还需要一个额外的初始化过程。点击菜单 `HybridCLR/Installer...`，弹出安装界面。

`com.code-philosophy.hybridclr` 中 `Data~/hybridclr_version.json` 中已经配置了当前 package 版本对应的兼容 hybridclr及il2cpp_plus 的分支或者 tag， Installer 会安装配置中指定的版本，不再支持自定义待安装的版本。

::: details 可能的配置示例
```json
{
    "versions": [
    {
        "unity_version":"2019",
        "hybridclr" : { "branch":"v2.0.1"},
        "il2cpp_plus": { "branch":"v2019-2.0.1"}
    },
    {
        "unity_version":"2020",
        "hybridclr" : { "branch":"v2.0.1"},
        "il2cpp_plus": { "branch":"v2020-2.0.1"}
    },
    {
        "unity_version":"2021",
        "hybridclr" : { "branch":"v2.0.1"},
        "il2cpp_plus": { "branch":"v2021-2.0.1"}
    }
    ]
}
```
:::

更详细或其他需求继续参考官方文档：
