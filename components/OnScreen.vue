<script setup lang="ts">
const el = ref<HTMLElement>();

const emit = defineEmits(['on-screen']);

function onScroll() {
	if (!el.value) {
		return;
	}

	const rect = el.value?.getBoundingClientRect();
	const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
	if (rect.bottom >= 0 && rect.top - viewHeight < 0) {
		emit('on-screen');
	}
}

onMounted(() => {
	document.addEventListener('scroll', onScroll);
	onScroll();
});

onUnmounted(() => {
	document.removeEventListener('scroll', onScroll);
});
</script>

<template>
	<div ref="el">
		<slot />
	</div>
</template>
