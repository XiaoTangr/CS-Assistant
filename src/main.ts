import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "@/css/import.scss"

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { MainRouter } from "./router/Router";
import { createPinia } from 'pinia'


import { dbConnUtil } from './DBA/Utils/DBConnUtil';

const app = createApp(App)

const store = createPinia();


try {
    await dbConnUtil.init();
    console.log("连接池初始化成功");
} catch (error) {
    console.error("连接池初始化失败:", error);
}

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)
    .use(store)
    .use(MainRouter)
    .mount("#app");