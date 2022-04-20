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

const player = ref<HTMLVideoElement>(null as unknown as HTMLVideoElement);
const plyr = ref<Plyr>();
const hls = ref<Hls | null>(null);
const dash = ref<MediaPlayerClass | null>(null);

function loadHls(url: string) {
	hls.value = new Hls();
	hls.value.loadSource(url);
	hls.value.attachMedia(player.value);
}

async function updateVideo(video: Video) {
	hls.value?.destroy();
	hls.value = null;
	dash.value?.destroy();
	dash.value = null;

	if (video.metadata.live && video.hls && Hls.isSupported()) {
		loadHls(video.hls);
	} else if (video.lbry && Hls.isSupported()) {
		loadHls(video.lbry);
	} else if (video.dash) {
		const { MediaPlayer } = await import('dashjs');
		dash.value = MediaPlayer().create();
		dash.value.initialize(player.value, video.dash, true);
	} else if (video.hls && Hls.isSupported()) {
		loadHls(video.hls);
	}
}

watch(
	() => props.video,
	(video) => updateVideo(video)
);

onMounted(async () => {
	const Plyr = (await import('plyr')).default;
	plyr.value = new Plyr(player.value, {
		settings: ['quality', 'speed', 'captions'],
		tooltips: { controls: true },
		autoplay: true,
		// @ts-ignore
		markers: {
			enabled: true,
			points: props.video.chapters.map((chapter) => ({
				time: chapter.time,
				label: chapter.title,
			})),
		},
	});

	plyr.value.on('languagechange', () => {
		setTimeout(() => {
			if (hls.value && plyr.value) {
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
		'<span class="plyr__tooltip">Theatre mode</span>';
	button.onclick = () => {
		emit('theatre-toggle');
	};
	document
		.querySelector('.plyr__controls')
		?.insertBefore(button, document.querySelector('.plyr__control[data-plyr="fullscreen"]'));

	updateVideo(props.video);
});

onBeforeUnmount(() => {
	plyr.value?.destroy();
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
