<script setup lang="ts">
import { PropType } from 'vue';
import { Comment, Comments, formatNumber, Video } from '~/lib/api';

import Reply from './Comment.vue';

const props = defineProps({
	comment: { type: Object as PropType<Comment>, required: true },
	video: { type: Object as PropType<Video>, required: true },
});

const expanded = ref(false);
const fetching = ref(false);
const replies = ref<Comments>();

async function fetchReplies() {
	if (fetching.value) {
		return;
	}

	fetching.value = true;
	if (!replies.value) {
		replies.value = await $fetch(
			`/api/video/${props.video.metadata.id}/comments?replies=${props.comment.replyToken}`
		);
	} else {
		const res = await $fetch<Comments>(
			`/api/video/${props.video.metadata.id}/comments?replies=${replies.value.continuation}`
		);

		replies.value.comments = replies.value.comments.concat(res.comments);
		replies.value.continuation = res.continuation;
	}
	fetching.value = false;
}

function toggleExpanded() {
	expanded.value = !expanded.value;

	if (expanded.value && !replies.value) {
		fetchReplies();
	}
}
</script>

<template>
	<div display-flex flex="gap-4">
		<img
			v-lazy="props.comment.author.avatar"
			:alt="`${props.comment.author.name}'s avatar`"
			w-12
			h-12
			bg="gray-200"
			border="rounded-full"
		/>
		<div>
			<p v-if="props.comment.pinned" text="sm gray-700">
				<i inline-block m="r-0.5 b-1" align="middle" i-ri-pushpin-line />
				Pinned
			</p>
			<h1 m="b-0.5" font="semibold">
				{{ props.comment.author.name }}
				<i
					v-if="props.comment.author.verified"
					inline-block
					m="b-0.5"
					align="middle"
					i-ri-check-line
				/>
				<span ml-2 text="sm gray-700" font="normal">
					{{ props.comment.time }}
					<template v-if="props.comment.edited">(edited)</template>
				</span>
			</h1>
			<p whitespace="pre-line">{{ props.comment.text }}</p>
			<div mt-2 text="sm gray-700">
				<i inline-block m="r-0.5 b-1" align="middle" i-ri-thumb-up-line />
				{{ formatNumber(props.comment.likes) }}
			</div>
			<div v-if="props.comment.replies != 0" mt-2>
				<button font="semibold" text="blue-700" @click="toggleExpanded">
					<i
						v-if="expanded"
						inline-block
						m="r-1 b-0.5"
						align="middle"
						i-ri-arrow-up-s-line
					/>
					<i v-else inline-block m="r-1 b-0.5" align="middle" i-ri-arrow-down-s-line />
					{{ expanded ? 'hide' : 'show' }} {{ props.comment.replies }} replies
					<template v-if="props.comment.ownerReplied">
						from {{ props.video.metadata.author.name }} and others
					</template>
				</button>

				<div v-if="expanded" mt-4>
					<template v-if="replies">
						<Reply
							v-for="reply in replies.comments"
							:key="reply.id"
							:comment="reply"
							:video="props.video"
							mb-4
						/>
					</template>
					<div v-if="!replies || fetching" display="flex" justify="center">
						<Spinner></Spinner>
					</div>
					<button
						v-if="replies && replies.continuation && !fetching"
						font="semibold"
						text="blue-700"
						@click="fetchReplies"
					>
						<i inline-block m="r-1 b-0.5" align="middle" i-ri-arrow-right-line />
						fetch more replies
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
