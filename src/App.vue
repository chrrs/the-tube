<script setup lang="ts">
import { RouterView } from 'vue-router';

import Header from './components/Header.vue';
</script>

<template>
	<div h="screen" bg="gray-50">
		<Header />
		<RouterView />
	</div>
</template>
