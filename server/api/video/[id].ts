import { Stream } from '~/@types/piped-api';
import { Video, formatNumber, MediaFormat } from '~/lib/api';

// @ts-ignore
export default defineEventHandler(async (event) => {
	const id = event.context.params.id;
	const res = await $fetch<Stream>(`${process.env.PIPED_API}/streams/${id}`);

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
			id,
			title: res.title,
			description: res.description,
			publishDate: res.uploadDate,
			live: res.livestream,
			views: res.views,
			lengthSeconds: res.duration,
			thumbnail: new URL(`/vi/${id}/maxresdefault.jpg`, res.proxyUrl).href,
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		related: res.relatedStreams.map((related: any) => {
			const id = related.url.split('?v=').pop();

			return {
				id,
				title: related.title,
				publishDate: new Date(related.uploaded).toISOString(),
				live: false,
				views: related.views,
				lengthSeconds: related.duration,
				thumbnail: related.thumbnail,
				author: {
					id: related.uploaderUrl.split('/').pop(),
					name: related.uploaderName,
					avatar: related.uploaderAvatar,
					verified: related.uploaderVerified,
				},
			};
		}),
		chapters: res.chapters.map((chapter) => ({
			title: chapter.title,
			time: chapter.start,
		})),
	} as Video;
});
