import { createApp } from "vue";
import App from "./App.vue";
import 'element-plus/dist/index.css'
import "@/css/import.scss"
import 'element-plus/theme-chalk/dark/css-vars.css'

import { createPinia } from 'pinia'
import StartUpUtil from "./core/services/StartUp.service";
import { LogService } from "./core/services";
import { MainRouter } from "./router/Router";
const app = createApp(App)
const store = createPinia();


app.use(store)
    .use(MainRouter)

StartUpUtil.startUp().then(() => {
    app.mount("#app");
}).catch(async (error) => {
    LogService.error(error)
    const appWindow = new Window()
    const r = window.confirm(`应用启动失败:${error},\n访问www.javat.cn获得技术支持`)
    if (r !== undefined) {
        appWindow.close();
    }
});

export default app
