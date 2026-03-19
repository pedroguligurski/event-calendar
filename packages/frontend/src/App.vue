<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<template>
	<v-app>
		<Header />
		<v-main>
			<RouterView />
		</v-main>
	</v-app>
</template>