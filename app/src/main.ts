import { createApp } from "vue";
import App from "./App.vue";
import 'element-plus/dist/index.css'
import "@/css/import.scss"
import 'element-plus/theme-chalk/dark/css-vars.css'
import LogService from "@/core/service/logService";
import { createPinia } from 'pinia'
import { MainRouter } from "./router/Router";
const app = createApp(App)
const store = createPinia();


app.use(store)
    .use(MainRouter)

try {
    app.mount("#app");
} catch (error: any) {
    LogService.error(error)
    const appWindow = new Window()
    const r = window.confirm(`应用启动失败:${error},\n访问www.javat.cn获得技术支持`)
    if (r !== undefined) {
        appWindow.close();
    }
};

export default app
