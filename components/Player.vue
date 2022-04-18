<script setup lang="ts">
import type Plyr from 'plyr';
import { PropType } from 'vue';
import { Video } from '~/lib/api';
import Hls from 'hls.js';
import type { MediaPlayerClass } from 'dashjs';

import 'plyr/dist/plyr.css';

const emit = defineEmits(['theatre-toggle']);
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

	const button = document.createElement('button');
	button.className = 'plyr__controls__item plyr__control';
	button.setAttribute('type', 'button');
	button.setAttribute('data-plyr', 'theatre');
	button.innerHTML =
		'<svg width="18" height="18" style="fill: transparent">' +
		'<rect x="1" y="3" width="16" height="12" style="stroke: white; stroke-width: 2"></rect>' +
		'</svg>' +
		'<span class="plyr__sr-only">Theatre</span>';
	button.onclick = () => {
		emit('theatre-toggle');
	};
	document
		.querySelector('.plyr__controls')
		?.insertBefore(button, document.querySelector('.plyr__control[data-plyr="fullscreen"]'));

	computeSource(props.video);
});

onBeforeUnmount(() => {
	plyr.value.destroy();
});
</script>

<template>
	<div w-full h-full>
		<video ref="player" controls crossorigin="true" playsinline autoplay></video>
	</div>
</template>

<style>
.plyr {
	width: 100%;
	height: 100%;
}
</style>
