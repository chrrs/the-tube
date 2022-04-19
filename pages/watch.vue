<script setup lang="ts">
import { Video } from '~/lib/api';
import { format, formatDistanceToNow } from 'date-fns';
import DOMPurify from 'dompurify';
import linkifyHtml from 'linkify-html';
import 'linkify-plugin-hashtag';

const route = useRoute();
let id = route.query.v;

const theatre = ref(false);
const info = ref<Video | null>(null);
const published = computed(
	() => info.value && format(new Date(info.value.metadata.publishDate), 'PPP')
);

const description = computed(() => {
	if (!info.value) {
		return '';
	}

	let description = info.value.metadata.description || '';
	description = DOMPurify.sanitize(description, { ALLOWED_TAGS: ['br', 'a'] });
	description = linkifyHtml(description, {
		formatHref: {
			hashtag: (href: string) =>
				'/results?search_query=' + encodeURIComponent(href.substring(1)),
		},
	});

	const base = location.origin;
	description = description
		.replaceAll(/(?:http(?:s)?:\/\/)?(?:www.)?youtube.com(\/[a-zA-Z0-9?=&]*)/gim, `${base}$1`)
		.replaceAll(
			/(?:http(?:s)?:\/\/)?(?:www.)?youtu.be(\/[a-zA-Z0-9?=&]*)/gim,
			`${base}/watch?v=$1`
		);

	return description;
});

async function fetchVideo() {
	info.value = await $fetch(`/api/video/${id}`);
}

watch(
	() => route.query.v,
	() => {
		info.value = null;
		id = route.query.v;
		fetchVideo();
	}
);
onMounted(fetchVideo);
</script>

<template>
	<div id="theatre" h="[56.25vw]" max-h="[90vh]" :hidden="!theatre"></div>

	<div v-if="info" container mx-auto p="x-4 y-4" display="flex" flex="gap-4">
		<div flex-1>
			<div>
				<Teleport to="#theatre" :disabled="!theatre">
					<Player :video="info" @theatre-toggle="() => (theatre = !theatre)" />
				</Teleport>
			</div>
			<div :class="theatre ? 'pb-4' : 'py-4'">
				<h1 font="semibold" text="lg">{{ info.metadata.title }}</h1>
				<p mt-1 text="gray-700">
					{{ info.metadata.views.toLocaleString('en-US') }}
					{{ info.metadata.live ? ' watching now - Live since' : 'views -' }}
					{{ published }}
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
		<div w="2xl:md sm" display="none lg:block">
			<NuxtLink
				v-for="related in info.related"
				:key="related.id"
				:to="`/watch?v=${related.id}`"
				display="flex"
				flex="gap-2"
				h="auto"
				mb-4
			>
				<img
					v-lazy="related.thumbnail"
					:alt="related.title"
					flex="none basis-[168px]"
					h="[94px]"
					bg="gray-200"
					object-cover
				/>
				<div>
					<h1 font="semibold" text="sm" line-clamp-2>
						{{ related.title }}
					</h1>
					<p mt-1 text="sm gray-700">
						{{ related.author.name }}
						<i
							v-if="related.author.verified"
							i-ri-check-line
							align="middle"
							m="b-0.5"
							inline-block
						/>
					</p>
					<p text="sm gray-700">
						{{ related.views.toLocaleString() }} views -
						{{
							formatDistanceToNow(new Date(related.publishDate), { addSuffix: true })
						}}
					</p>
				</div>
			</NuxtLink>
		</div>
	</div>
</template>

<style>
.description a {
	@apply text-blue-600 hover:underline;
}
</style>
