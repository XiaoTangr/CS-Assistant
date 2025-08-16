import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from 'path'
import VueDevTools from 'vite-plugin-vue-devtools';
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano'

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
    plugins: [
        vue(),
        VueDevTools(),
        vueJsx()
    ],
    build: {
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
            output: {
                manualChunks(id: string) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/.pnpm/')[1].split('/')[0].toString();
                    }
                }
            }
        }
    },
    resolve: {
        alias: [
            {
                find: '@',
                replacement: resolve(__dirname, './src')
            }
        ]
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/css/variable.scss" as *;`
            }
        },
        postcss: {
            plugins: [
                autoprefixer({ // 自动添加前缀
                    overrideBrowserslist: [
                        'Android 4.1',
                        'iOS 7.1',
                        'Chrome > 31',
                        'ff > 31',
                        'ie >= 8',
                        'last 2 versions'
                    ],
                    flexbox: 'no-2009',
                    grid: false,

                }),
                cssnano({ // 压缩css
                    preset: 'default'
                })
            ]
        },
    },
    clearScreen: false,
    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host ? {
            protocol: "ws",
            host,
            port: 1421,
        } : undefined,
        watch: {
            ignored: ["**/src-tauri/**"],
        },
    },
});
