import { defineConfig } from 'vitepress';
import { genNav, genSidebar } from './theme/utils';
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
    nav: genNav(),

    sidebar: genSidebar(),

    search: {
      provider: 'local',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/keiseiTi' }],
  },
});
