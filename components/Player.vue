<script setup lang="ts">
import type Plyr from 'plyr';
import { PropType } from 'vue';
import { Video } from '~/lib/api';
import Hls from 'hls.js';
import type { MediaPlayerClass } from 'dashjs';

import 'plyr/dist/plyr.css';

const props = defineProps({
	video: { type: Object as PropType<Video>, required: true },
});

const player = ref<HTMLVideoElement>(null as any);
const plyr = ref<Plyr>(null as any);
const hls = ref<Hls | null>(null);
const dash = ref<MediaPlayerClass | null>(null);

async function computeSource(video: Video) {
	hls.value?.destroy();
	hls.value = null;
	dash.value?.destroy();
	dash.value = null;

	// TODO: Handle livestreams.
	if (video.lbry && Hls.isSupported()) {
		hls.value = new Hls();
		hls.value.loadSource(video.lbry);
		hls.value.attachMedia(player.value);
	} else if (video.dash) {
		const { MediaPlayer } = await import('dashjs');
		dash.value = MediaPlayer().create();
		dash.value.initialize(player.value, video.dash, true);
	} else if (video.hls && Hls.isSupported()) {
		hls.value = new Hls();
		hls.value.loadSource(video.hls);
		hls.value.attachMedia(player.value);
	}
}

watch(
	() => props.video,
	(video) => computeSource(video)
);

onMounted(async () => {
	const Plyr = (await import('plyr')).default;
	plyr.value = new Plyr(player.value, {
		settings: ['quality', 'speed'],
		autoplay: true,
	});

	plyr.value.on('languagechange', () => {
		setTimeout(() => {
			if (hls.value) {
				hls.value.subtitleTrack = plyr.value.currentTrack;
			}
		}, 50);
	});

	computeSource(props.video);
});

onBeforeUnmount(() => {
	plyr.value.destroy();
});
</script>

<template>
	<video ref="player" controls crossorigin="true" playsinline autoplay></video>
</template>

<style>
.plyr {
	width: 100%;
	height: 100%;
}
</style>
