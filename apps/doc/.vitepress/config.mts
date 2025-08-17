import { defineConfig } from 'vitepress'
import { resolve } from 'path'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CS Assistant Document",
  description: "CS Assistant Document",
  srcDir: 'src',
  base: '/csa/',
  outDir: "dist",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  vite: {
    resolve: {
      // 设置文件./src路径为 @
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, './src')
        }
      ]
    },
  }
})
