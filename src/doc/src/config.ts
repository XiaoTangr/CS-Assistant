
import { defineConfig, type DefaultTheme } from 'vitepress'

export default defineConfig({
    description: 'Vite & Vue powered static site generator.',

    themeConfig: {
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
    }
})
