import Vue from 'vue'
import Router from 'vue-router'

import auth from '@/utils/auth'

import homeRouter from './modules/home'
import goodsRouter from './modules/goods'
import financeRouter from './modules/finance'
import supplierRouter from './modules/supplier'
import warehouseRouter from './modules/warehouse'
import customerRouter from './modules/customer'
import systemRouter from './modules/system'
import releaseRouter from './modules/release'
import marketingRouter from './modules/marketing'
import orderRouter from './modules/order'
import paymentRouter from './modules/payment'
import purchaseRouter from './modules/purchase'
import BiddingPrice from './modules/biddingPrice'
import statisticsRouter from './modules/statistics'
import goodsCorrespondRouter from './modules/goodsCorrespondManage'
Vue.use(Router)
const routes = [{
	path: '/',
	name: 'HeaderTop',
	component:
		() => import('@/components/common/HeaderTop'),
	redirect: '/homepage/home/homeindex',
	children: [
		...homeRouter,
		...goodsRouter,
		...financeRouter,
		...supplierRouter,
		...warehouseRouter,
		...customerRouter,
		...systemRouter,
		...releaseRouter,
		...marketingRouter,
		...orderRouter,
		...paymentRouter,
		...BiddingPrice,
		...purchaseRouter,
		...statisticsRouter,
		...goodsCorrespondRouter
	]
},
{
	path: '*',
	name: '404',
	meta: {
		title: '404'
	},
	component:
		() => import('@/components/Err')
},
{
	path: '/login',
	name: 'Login',
	meta: {
		title: '登陆'
	},
	component:
		() => import('@/components/Login')
}]

const router = new Router({
	routes
})

// router.beforeEach((to, from, next) => {
// 	// 通过to.meta.auth判断当前页面是否授权
// 	if (to.name == "home" || !to.meta.auth) {
// 		next();
// 	} else if (to.meta.auth) {
// 		if (Object.prototype.toString.call(to.meta.auth) == "[object String]") {
// 			if (auth.user.authorities[to.meta.auth]) {
// 				next()
// 			} else {
// 				next('/homepage/home/homeindex');
// 				vm.$message({ type: "error", showClose: true, message: "当前用户未授权不能访问" })
// 			}
// 		} else {
// 			let isAuth = to.meta.auth.some(item => {
// 				return auth.user.authorities[item]
// 			})
// 			if (isAuth) {
// 				next()
// 			} else {
// 				next('/homepage/home/homeindex');
// 				vm.$message({ type: "error", showClose: true, message: "当前用户未授权不能访问" })
// 			}
// 		}

// 	} else {
// 		next('/homepage/home/homeindex');
// 		vm.$message({ type: "error", showClose: true, message: "当前用户未授权不能访问" })
// 	}
// })

export default router