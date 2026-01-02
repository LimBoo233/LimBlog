---
title: LimBoo 的实验室
description: 这里是 LimBoo233 的实验室，切换主题、贴照片、收集友链，放点有趣的小玩意儿
head:
  - - meta
    - name: keywords
      content: 主题切换,照片墙,友链,Labs,LimBoo233
  - - meta
    - property: og:title
      content: Labs - 玩点杂货铺
  - - meta
    - property: og:description
      content: 这里是 LimBoo233 的实验室，切换主题、贴照片、收集友链，放点有趣的小玩意儿

layout: page
outline: false
sidebar: false
---

<div class="labs-wrapper">
  <div class="labs-hero">
    <div class="hero-content">
      <h1 class="gradient-text">LimBoo's Laboratory</h1>
      <p class="subtitle">探索 · 折腾 · 记录</p>
      <p class="description">这里存放着一些有趣的代码实验、生活碎片和奇思妙想。</p>
    </div>
  </div>

  <div class="labs-section">
    <h2 class="section-title">主题调色</h2>
    <div class="lab-feature">
      <div class="feature-header">
        <p class="feature-desc">在这里切换全站主题，预览不同配色方案下的阅读体验。</p>
        <div class="feature-control">
           <ThemePaletteSwitch />
        </div>
      </div>
    </div>
  </div>


  <div class="labs-section">
    <h2 class="section-title">友情链接</h2>
    <div class="friends-grid">
      <a href="https://github.com/LimBoo233" target="_blank" class="friend-card">
        <div class="friend-avatar">
          <img src="https://github.com/LimBoo233.png" alt="LimBoo233">
        </div>
        <div class="friend-info">
          <span class="friend-name">LimBoo233</span>
          <span class="friend-desc">本站作者</span>
        </div>
      </a>
      <!-- 示例友链 -->
      <a href="https://vitepress.dev/" target="_blank" class="friend-card">
        <div class="friend-avatar">
          <img src="https://vitepress.dev/vitepress-logo-mini.svg" alt="VitePress">
        </div>
        <div class="friend-info">
          <span class="friend-name">VitePress</span>
          <span class="friend-desc">Vite & Vue powered static site generator</span>
        </div>
      </a>
      <a href="https://blog-snowy-theta-58.vercel.app/" target="_blank" class="friend-card">
        <div class="friend-avatar">
          <img src="https://github.com/yukunliu110100001111.png" alt="Yishu">
        </div>
        <div class="friend-info">
          <span class="friend-name">Yishu</span>
          <span class="friend-desc">艺术的光辉</span>
        </div>
      </a>
      <a href="https://kachofugetsu09.github.io/" target="_blank" class="friend-card">
        <div class="friend-avatar">
          <img src="https://github.com/kachofugetsu09.png" alt="花月">
        </div>
        <div class="friend-info">
          <span class="friend-name">花月</span>
          <span class="friend-desc">Folding was never an option.</span>
        </div>
      </a>
       <div class="friend-card placeholder">
        <div class="friend-avatar">
           <span>?</span>
        </div>
        <div class="friend-info">
          <span class="friend-name">虚位以待</span>
          <span class="friend-desc">欢迎互换友链</span>
        </div>
      </div>
    </div>
  </div>

  <div class="labs-section">
    <h2 class="section-title">相册</h2>
    <div class="lab-feature no-border">
      <div class="feature-header">
        <p class="feature-desc">许多年之后，面对██时，LimBoo 将会回想起，███和他一起██████的那个遥远的██...... </p>
      </div>
      <div class="album-grid">
        <div class="album-item">
          <img src="https://l9nzkolcweredmr9.public.blob.vercel-storage.com/Pepe_in_Tianjin_1.webp" alt="Pepe in Tianjin" loading="lazy">
          <div class="album-caption">
            <span>Pepe in Tianjin</span>
            <span class="album-author">© Sirius α</span>
          </div>
        </div>
        <div class="album-item">
          <img src="https://l9nzkolcweredmr9.public.blob.vercel-storage.com/Amiya_onthe_Tree.webp" alt="Amiya on the Tree" loading="lazy">
          <div class="album-caption">
            <span>Amiya on the Tree</span>
            <span class="album-author">© Sirius α</span>
          </div>
        </div>
        <div class="album-item">
          <img src="https://l9nzkolcweredmr9.public.blob.vercel-storage.com/Kitty_between_Wall.webp" alt="Kitty between Wall" loading="lazy">
          <div class="album-caption">
            <span>Kitty between Wall</span>
            <span class="album-author">© LimBoo</span>
          </div>
        </div>
        <div class="album-item">
          <img src="https://l9nzkolcweredmr9.public.blob.vercel-storage.com/When_back_Home.webp" alt="When back Home" loading="lazy">
          <div class="album-caption">
            <span>When back Home</span>
            <span class="album-author">© LimBoo</span>
          </div>
        </div>
        <div class="album-item">
          <img src="https://l9nzkolcweredmr9.public.blob.vercel-storage.com/Car_and_Cloud.webp" alt="Car and Cloud" loading="lazy">
          <div class="album-caption">
            <span>Car and Cloud</span>
            <span class="album-author">© LimBoo</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
