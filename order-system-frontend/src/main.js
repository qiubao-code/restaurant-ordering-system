import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import elementPlus from 'element-plus';
import 'element-plus/dist/index.css';

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next()
});

createApp(App)
    .use(store)
    .use(router)
    .use(elementPlus)
    .mount('#app');
