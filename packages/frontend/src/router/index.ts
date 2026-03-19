import { createRouter, createWebHistory } from 'vue-router'
import HeroSection from '../views/Herosection.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HeroSection,
		},
	],
})

export default router
