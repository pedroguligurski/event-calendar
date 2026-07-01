import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('../views/HomePage.vue'),
		},
		{
			path: '/auth/verify',
			name: 'auth-verify',
			component: () => import('../views/AuthVerifyView.vue'),
		},
	],
})

export default router
