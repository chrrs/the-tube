<script setup lang="ts">
import { Comments, Video } from '~/lib/api';
import { PropType } from 'vue';
import Comment from '~/components/watch/Comment.vue';

const props = defineProps({
	video: { type: Object as PropType<Video>, required: true },
});

const comments = ref<Comments>();
const fetching = ref(false);

async function fetch() {
	if (fetching.value) {
		return;
	}

	fetching.value = true;

	if (!comments.value) {
		comments.value = await $fetch(`/api/video/${props.video.metadata.id}/comments`);
	} else {
		const res = await $fetch<Comments>(
			`/api/video/${props.video.metadata.id}/comments?continuation=${comments.value.continuation}`
		);

		comments.value.comments = comments.value.comments.concat(res.comments);
		comments.value.continuation = res.continuation;
	}

	fetching.value = false;
}
</script>

<template>
	<div>
		<Comment
			v-for="comment in comments?.comments || []"
			:key="comment.id"
			:comment="comment"
			:video="props.video"
			mb-6
		/>
		<p v-if="comments && comments.comments.length == 0" text="center">No comments.</p>
	</div>
	<OnScreen
		v-if="!comments || comments.continuation"
		display="flex"
		justify="center"
		@on-screen="fetch"
	>
		<Spinner mt-8 />
	</OnScreen>
</template>
