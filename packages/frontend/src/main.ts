import { vuetify } from './plugins/vuetify'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

createApp(App)
	.use(createPinia())
	.use(router)
	.use(vuetify)
	.mount('#app')
