<script setup lang="ts">
import { PropType } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { VideoMetadata } from '~/lib/api';

const props = defineProps({
	video: { type: Object as PropType<VideoMetadata>, required: true },
});
</script>

<template>
	<NuxtLink :to="`/watch?v=${props.video.id}`" display="flex" flex="gap-2" h="auto" mb-4>
		<img
			v-lazy="props.video.thumbnail"
			:alt="props.video.title"
			flex="none basis-[168px]"
			h="[94px]"
			bg="gray-200"
			object-cover
		/>
		<div>
			<h1 font="semibold" text="sm" line-clamp-2>
				{{ props.video.title }}
			</h1>
			<p mt-1 text="sm gray-700">
				{{ props.video.author.name }}
				<i
					v-if="props.video.author.verified"
					i-ri-check-line
					align="middle"
					m="b-0.5"
					inline-block
				/>
			</p>
			<p text="sm gray-700">
				{{ props.video.views.toLocaleString() }} views -
				{{ formatDistanceToNow(new Date(props.video.publishDate), { addSuffix: true }) }}
			</p>
		</div>
	</NuxtLink>
</template>
