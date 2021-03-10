import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'app',
        component: () => import('@/App'),
        redirect: '/index',
        children: [
            {
                path: 'index',
                name: 'index',
                component: () => import('@/view/index'),
            },
            {
                path: 'KGEditor',
                name: 'KGEditor',
                component: () => import('@/view/KGEditor')
            }
        ]
    }
]

const createRouter = () => new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routes
})

const router = createRouter()

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to){
    return VueRouterPush.call(this, to).catch(err => err)
}

// reset router
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router