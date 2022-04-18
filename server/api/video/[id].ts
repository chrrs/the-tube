import { Video, formatNumber, MediaFormat } from '~/lib/api';

// @ts-ignore
export default defineEventHandler(async (event) => {
	const id = event.context.params.id;
	const res: any = await $fetch(`${process.env.PIPED_API}/streams/${id}`);

	let lbry = undefined;
	const formats: MediaFormat[] = [];

	for (const stream of res.videoStreams) {
		if (stream.quality === 'LBRY') {
			lbry = stream.url;
			continue;
		}

		formats.push({
			url: stream.url,
			type: stream.videoOnly ? 'video' : 'hybrid',
			mimeType: stream.mimeType,
			width: stream.width,
			height: stream.height,
		});
	}

	for (const stream of res.audioStreams) {
		formats.push({
			url: stream.url,
			type: 'audio',
			mimeType: stream.mimeType,
		});
	}

	if (lbry) {
		const url = new URL(lbry);
		const proxiedUrl = new URL(url.pathname, res.proxyUrl);
		proxiedUrl.searchParams.set('host', url.host);
		lbry = proxiedUrl.toString();
	}

	return {
		metadata: {
			title: res.title,
			description: res.description,
			publishDate: res.uploadDate,
			views: res.views,
			lengthSeconds: res.duration,
			thumbnail: new URL(`/vi_webp/${id}/maxresdefault.webp`, res.proxyUrl).href,
			author: {
				id: res.uploaderUrl.split('/').pop(),
				name: res.uploader,
				subscribers: formatNumber(res.uploaderSubscriberCount),
				avatar: res.uploaderAvatar,
				verified: res.uploaderVerified,
			},
		},
		hls: res.hls || undefined,
		dash: res.dash || undefined,
		lbry,
		formats,
	} as Video;
});
