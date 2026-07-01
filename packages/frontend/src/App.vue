<script setup lang="ts">
import Header from './components/Header.vue'
import LoginDialog from './components/LoginDialog.vue'
</script>

<template>
	<v-app>
		<Header />
		<LoginDialog />
		<v-main>
			<RouterView />
		</v-main>
	</v-app>
</template>