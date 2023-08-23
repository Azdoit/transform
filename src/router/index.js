import { createWebHashHistory,createRouter } from "vue-router";
const routes = [
    {
        path: '/',
        name: 'main',
        component: () => import('@/views/main/index.vue'),
    },
    {
        path: '/demo',
        name: 'demo',
        component: () => import('@/views/demo/index.vue'),
    }
]
// 创建 vueRouter 实例
const router = createRouter({
    history: createWebHashHistory(),
    routes
  })
  export default router