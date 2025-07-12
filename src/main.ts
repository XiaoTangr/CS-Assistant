import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "@/css/import.scss"
import 'element-plus/theme-chalk/dark/css-vars.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { MainRouter } from "./router/Router";
import { createPinia } from 'pinia'
import StartUpUtil from "./core/utils/StartUpUtil";




const app = createApp(App)
const store = createPinia();

// import { Window } from '@tauri-apps/api/window';


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)
    .use(store)
    .use(MainRouter)



StartUpUtil.startUp().then(() => {
    app.mount("#app");
}).catch(async (error) => {
    console.error(error)
    // const appWindow = new Window("main")
    // const r = await window.confirm(`应用启动失败:${error},\n访问www.javat.cn获得技术支持`)
    // if (r !== undefined) {
    //     appWindow.close();
    // }
});

export default app