import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/Users.vue'
import Permissions from './components/power/Permissions.vue'
import Roles from './components/power/Roles.vue'
import Cate from './components/goods/Cate.vue'
import Params from './components/goods/Params.vue'
import List from './components/goods/List.vue'
import GoodsAdd from './components/goods/GoodsAdd.vue'

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}


Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },//路由重定向
        { path: '/login', component: Login },//登录路由
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/permissions', component: Permissions },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Cate },
                { path: '/params', component: Params },
                { path: '/list', component: List },
                { path: '/add/goods', component: GoodsAdd },

            ]
        }
    ]
})

//挂载路有导航守卫

router.beforeEach((to, from, next) => {
    //to 将要访问的路径
    //from 从哪个页面来
    //next 放行函数
    if (to.path == "/login") return next();
    //获取token
    const tokenStr = window.sessionStorage.getItem("token");
    if (!tokenStr) return next("/login");
    next();
})

export default router