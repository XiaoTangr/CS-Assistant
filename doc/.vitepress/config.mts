import { defineConfig } from 'vitepress'
import { resolve } from 'path'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "CS Assistant ",
  description: "CS Assistant Document",
  srcDir: 'src',
  base: '/CS-Assistant/',
  outDir: "dist", rewrites: {
    'zh/:rest*': ':rest*'
  },
  locales: {
    root: {
      label: '中文',
      lang: 'zh'
    },
    fr: {
      label: 'English',
      lang: 'en', // 可选，将作为 `lang` 属性添加到 `html` 标签中
      link: '/en/' // 默认 /fr/ -- 显示在导航栏翻译菜单上，可以是外部的
    }
  },
  themeConfig: {
    i18nRouting: true,
    logo: '/favicon.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '下载', link: '/download' },
      { text: '指南', link: '/guide' }
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
