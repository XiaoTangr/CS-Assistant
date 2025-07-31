import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "@/css/import.scss"
import 'element-plus/theme-chalk/dark/css-vars.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import StartUpUtil from "./core/services/StartUp.services";
import { LogServices } from "./core/services";
import { MainRouter } from "./router/Router";
const app = createApp(App)
const store = createPinia();

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus)
    .use(store)
    .use(MainRouter)

StartUpUtil.startUp().then(() => {
    app.mount("#app");
}).catch(async (error) => {
    LogServices.error(error)
    const appWindow = new Window()
    const r = window.confirm(`应用启动失败:${error},\n访问www.javat.cn获得技术支持`)
    if (r !== undefined) {
        appWindow.close();
    }
});

export default app