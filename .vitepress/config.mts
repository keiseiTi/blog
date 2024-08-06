import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'keiseiTi',
  description: 'keiseiTi 博客，低代码，可视化搭建，富文本编辑器',
  base: '/blog/',
  lastUpdated: true,
  vite: {
    server: {
      port: 7080,
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      {
        text: '文章',
        link: '/posts/解决 monaco editor 在 umi 下 icon 不显示的问题.md',
        activeMatch:
          '/posts/解决 monaco editor 在 umi 下 icon 不显示的问题.md/',
      },
      // { text: '分类', link: '/category' },
      // { text: '标签', link: '/tags' },
    ],

    sidebar: [
      {
        text: '文章',
        items: [
          {
            text: '解决 monaco editor 在 umi 下 icon 不显示的问题.md',
            link: '/posts/解决 monaco editor 在 umi 下 icon 不显示的问题.md',
          },
        ],
      },
    ],

    search: {
      provider: 'local',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/keiseiTi' }],
  },
});
