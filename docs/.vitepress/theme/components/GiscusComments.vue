<template>
  <div id="giscus-comments" class="giscus"></div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // https://giscus.app/zh-CN
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.dataset.repo = 'LimBoo233/LimBlog';  
  script.dataset.repoId = 'R_kgDOPABz2Q';  
  script.dataset.category = 'General';  
  script.dataset.categoryId = 'DIC_kwDOPABz2c4CtCvy';  
  script.dataset.mapping = 'pathname';
  script.dataset.strict = '0';
  script.dataset.reactionsEnabled = '1';
  script.dataset.emitMetadata = '0';
  script.dataset.inputPosition = 'bottom';
  script.dataset.theme = 'transparent_dark';     
  script.dataset.lang = 'zh-CN';
  script.crossorigin = 'anonymous';
  script.async = true;

  document.getElementById('giscus-comments').appendChild(script);
});
</script>

<style>
/* 在这里添加一些基础样式 */
.giscus {
  margin-top: 2rem; /* 评论区与上方内容的间距 */
}
</style>