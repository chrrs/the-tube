<template>
	<header display-flex justify-center p="2" bg="white">
		<div display-flex w="xl">
			<input
				type="text"
				flex="1"
				border="1 gray-300 focus-within:blue-300"
				p="x-2 y-1"
				placeholder="Search..."
			/>
			<button
				type="submit"
				border="1 l-0 gray-300"
				p="x-6 y-1"
				bg="gray-100 hover:gray-200"
				text="gray-700 hover:black"
			>
				<div i-ri-search-line />
			</button>
		</div>
	</header>
</template>

<style>
*:focus {
	outline: none;
}
</style>
