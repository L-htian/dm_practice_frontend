import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/view/index'),
        children:[
            {
                path: '/KGEditor',
                name: 'KGEditor',
                component: () => import('@/view/KGEditor')
            }
        ]
    }
]

const createRouter = () => new VueRouter({
    mode: 'history',
    base: 'kojima-coin',
    routes: routes
})

const router = createRouter()

// reset router
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router