<template><div class="loader" /></template>

<style scoped>
.loader,
.loader:after {
	@apply rounded-full w-8 h-8;
}
.loader {
	@apply border-2 border-gray-600 border-b-gray-200 border-r-gray-200;
	animation: load8 0.75s infinite linear;
}

@keyframes load8 {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
