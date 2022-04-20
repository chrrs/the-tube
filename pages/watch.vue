<script setup lang="ts">
import { Video } from '~/lib/api';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import linkifyHtml from 'linkify-html';
import 'linkify-plugin-hashtag';
import RelatedVideo from '~/components/watch/RelatedVideo.vue';
import CommentSection from '~/components/watch/CommentSection.vue';

const route = useRoute();
let id = route.query.v?.toString();

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
		id = route.query.v?.toString();
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
			<hr border="gray-200" />
			<div mt-4>
				<CommentSection :video="info" />
			</div>
		</div>
		<div w="2xl:md sm" display="none lg:block">
			<RelatedVideo v-for="related in info.related" :key="related.id" :video="related" />
		</div>
	</div>
</template>

<style>
.description a {
	@apply text-blue-600 hover:underline;
}
</style>
