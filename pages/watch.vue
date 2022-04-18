<script setup lang="ts">
import { Video } from '~/lib/api';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';

const route = useRoute();
const id = route.query.v;

const info = ref<Video | null>(null);
const published = computed(
	() => info.value && format(new Date(info.value.metadata.publishDate), 'PPP')
);

const description = computed(() => {
	if (!info.value) {
		return '';
	}

	let description = info.value.metadata.description;
	description = DOMPurify.sanitize(description, { ALLOWED_TAGS: ['br', 'a'] });
	return description;
});

onMounted(async () => {
	info.value = await $fetch(`/api/video/${id}`);
});
</script>

<template>
	<!-- <div h="[56.25vw]" max-h="[90vh]">
		<Player />
	</div> -->

	<div v-if="info" container max-w-7xl mx-auto p="x-4 y-4">
		<div>
			<Player :video="info" />
		</div>
		<div py-4>
			<h1 font="semibold" text="lg">{{ info.metadata.title }}</h1>
			<p mt-1 text="gray-700">
				{{ info.metadata.views.toLocaleString('en-US') }} views - {{ published }}
			</p>
		</div>
		<hr border="gray-200" />
		<div py-4 display-flex flex="gap-4">
			<img
				:src="info.metadata.author.avatar"
				:alt="`${info.metadata.author.name}'s avatar`"
				w-12
				h-12
				border="rounded-full"
			/>
			<div>
				<div h-12 display="flex" flex="col" justify="center" href="/">
					<h1 font="semibold">
						{{ info.metadata.author.name }}
						<i
							v-if="info.metadata.author.verified"
							inline-block
							m="b-0.5"
							align="middle"
							i-ri-check-line
						/>
					</h1>
					<p text="sm gray-700">{{ info.metadata.author.subscribers }} subscribers</p>
				</div>
				<p class="description" mt-4 whitespace="pre-line" v-html="description"></p>
			</div>
		</div>
	</div>
</template>

<style>
.description a {
	@apply text-blue-600 hover:underline;
}
</style>
