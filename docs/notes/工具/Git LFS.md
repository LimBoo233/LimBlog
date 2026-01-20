
# Git LFS

## 什么情况需要使用 Git LFS

标准的 Git 是**分布式的**，这意味着每个人都要下载完整的历史记录。如果你提交了一个 500MB 的模型，然后删了它，这 500MB 依然永远存在于 `.git` 文件夹的历史记录里，导致仓库越来越大。

**Git LFS (Large File Storage)** 做了一件很聪明的事：

1. **拦截：** 当你 `git add` 一个大文件（比如 `Hero.psd`）时，LFS 会拦截这个操作。
    
2. **替换：** 它不会把这个 100MB 的文件塞进 Git 仓库，而是生成一个只有几百字节的**文本文件（指针文件 Pointer File）**。
    
3. **存储：** 真正的大文件被扔到了服务器上一个单独的 LFS 存储桶里。
    
4. **结果：** Git 仓库的历史记录里，只记录了那个微小的文本指针。


## 配置

**第一步：安装与初始化 (一次性工作)**

打开你的终端（PowerShell 或 Git Bash），输入：

```shell
# 1. 安装 LFS 钩子 (这会让 LFS 在你电脑上全局生效)
git lfs install
```

_看到 `Git LFS initialized.` 就说明环境装好了。_

**第二步：配置“白名单” (每个项目做一次)**

在你的 Unity 项目根目录下，你需要告诉 LFS 哪些文件是“大文件”。


```shell
# 比如，告诉 LFS 管理所有的 psd 文件
git lfs track "*.psd"

# 告诉 LFS 管理所有的 fbx 模型
git lfs track "*.fbx"
```

你运行这些命令后，你会发现根目录下多了一个名为 `.gitattributes` 的文件。
    
建议直接手动创建/编辑 `.gitattributes`与其一个个敲命令，不如直接在项目根目录新建 `.gitattributes` 文件。例如，Unity 配置参考：

```Plaintext
###############################################################################
# Git LFS (Large File Storage) 配置
# 告诉 Git 哪些文件是“大文件”，需要用 LFS 存，而不是直接塞进历史记录
###############################################################################

# --- 3D 模型 ---
*.fbx filter=lfs diff=lfs merge=lfs -text
*.obj filter=lfs diff=lfs merge=lfs -text
*.blend filter=lfs diff=lfs merge=lfs -text
*.dae filter=lfs diff=lfs merge=lfs -text
*.3ds filter=lfs diff=lfs merge=lfs -text
*.dxf filter=lfs diff=lfs merge=lfs -text
*.max filter=lfs diff=lfs merge=lfs -text

# --- 图片与纹理 ---
*.psd filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
*.bmp filter=lfs diff=lfs merge=lfs -text
*.tga filter=lfs diff=lfs merge=lfs -text
*.tiff filter=lfs diff=lfs merge=lfs -text
*.tif filter=lfs diff=lfs merge=lfs -text
*.exr filter=lfs diff=lfs merge=lfs -text
*.svg filter=lfs diff=lfs merge=lfs -text

# --- 音频 ---
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text
*.ogg filter=lfs diff=lfs merge=lfs -text
*.aif filter=lfs diff=lfs merge=lfs -text
*.aiff filter=lfs diff=lfs merge=lfs -text

# --- 视频 ---
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.mov filter=lfs diff=lfs merge=lfs -text
*.avi filter=lfs diff=lfs merge=lfs -text
*.webm filter=lfs diff=lfs merge=lfs -text

# --- Unity 特有二进制与打包文件 ---
*.unitypackage filter=lfs diff=lfs merge=lfs -text
*.dll filter=lfs diff=lfs merge=lfs -text
*.pdb filter=lfs diff=lfs merge=lfs -text
*.so filter=lfs diff=lfs merge=lfs -text
*.jar filter=lfs diff=lfs merge=lfs -text
*.zip filter=lfs diff=lfs merge=lfs -text
*.7z filter=lfs diff=lfs merge=lfs -text
*.rar filter=lfs diff=lfs merge=lfs -text

# --- 字体 ---
*.ttf filter=lfs diff=lfs merge=lfs -text
*.otf filter=lfs diff=lfs merge=lfs -text

# --- 烘焙数据 (如果你的场景很大，光照贴图可能很大) ---
*.exr filter=lfs diff=lfs merge=lfs -text
*.hdr filter=lfs diff=lfs merge=lfs -text

###############################################################################
# 文本设置 (解决 Windows/Mac 换行符冲突)
###############################################################################
* text=auto

# 强制 Unity 的 YAML 文件 (场景、预制体) 使用 LF 换行，防止冲突
*.cs text diff=csharp
*.cginc text
*.shader text

*.mat merge=unityyamlmerge eol=lf
*.anim merge=unityyamlmerge eol=lf
*.unity merge=unityyamlmerge eol=lf
*.prefab merge=unityyamlmerge eol=lf
*.physicsMaterial2D merge=unityyamlmerge eol=lf
*.physicMaterial merge=unityyamlmerge eol=lf
*.asset merge=unityyamlmerge eol=lf
*.meta merge=unityyamlmerge eol=lf
*.controller merge=unityyamlmerge eol=lf
```

_注意：一定要把 `.gitattributes` 这个文件本身也 `git add` 上传上去！_

**第三步：正常使用 (完全无感)**

配置好之后，你平时的操作不需要任何改变。


```shell
git add .
git commit -m "Add Boss Model"
git push origin main
```

当你 Push 时，你会发现终端的进度条稍微有点不一样： 它会先上传 Git 对象（极快），然后开始上传 LFS 对象（大文件，速度取决于网速）。

## 验证


> 我怎么知道那个 500MB 的文件是真的进 LFS 了，还是不小心塞进普通 Git 仓库了？

**验证命令**

```shell
git lfs ls-files
```

这个命令会列出当前所有被 LFS 管理的文件。如果你刚上传了 `Boss.psd`，运行这个命令应该能看到它。如果列表里没有它，说明你配置漏了（赶紧去检查 `.gitattributes`）。

或者，你可以在 GitHub/Gitee 的网页端点开那个文件。

- **普通文件：** 会显示“Binary file”或者直接预览图片。
    
- **LFS 文件：** 通常会显示一行小字 "Stored with Git LFS" 和一个下载链接。

## 远程仓库

1. 流量限额 (Bandwidth Quota)

	- **GitHub 免费版：** LFS 存储空间只有 **1GB**，每月的下载流量也只有 **1GB**。
	    
	- **惨案现场：** 如果你把作业传上去，老师下载了一次，你自己下载了一次，可能流量就超标了。一旦超标，GitHub 会直接锁死你的 LFS 下载权限。
	    
	- **解法：**
	    
	    - 学生党做作业如果文件很大，建议用 **Gitee (码云)**，国内速度快且 LFS 限制相对宽松。
	        
	    - 或者自己搭 GitLab (太折腾，暂不推荐)。
        

2. 已经提交过的大文件 (Migration)

	- **场景：** 你之前的项目没配 LFS，已经把一个 200MB 的 `.psd` 提交了几次。现在你补配了 LFS。
	    
	- **问题：** 之后的版本虽然走了 LFS，但之前的历史记录里依然有那个 200MB 的实体文件。
	    
	- **解法：** 需要用到 `git lfs migrate` 命令来清洗历史记录。这属于高危操作（会修改 commit hash），初学者建议**直接删库重新 init**，或者忍受那个大文件直到它成为历史。

## 下载大文件

如果你换了台电脑拉取代码，发现图片都是损坏的（只有几KB），或者你之前只想下载代码但现在想把美术资源都下载下来，可以使用：

```bash
git lfs pull
```

这会强制下载当前版本对应的所有大文件。

如果只需要几个文件：

```shell
# 语法：git lfs pull --include="文件路径"
git lfs pull --include="Assets/Textures/Hero.psd"
```

或者你想下载所有的 PSD 文件，但不要模型：

```shell
git lfs pull --include="*.psd"
```