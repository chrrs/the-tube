import { Stream } from '~/types/piped-api';
import { formatNumber } from '~/lib/util';

export interface VideoInfo {
	metadata: VideoMetadata;
	hls?: string;
	dash?: string;
	lbry?: string;
	related: VideoMetadata[];
	chapters: Chapter[];
}

export interface VideoMetadata {
	id: string;
	title: string;
	description?: string;
	publishDate: string;
	live: boolean;
	views: number;
	lengthSeconds: number;
	thumbnail: string;
	author: ChannelInfo;
}

export interface ChannelInfo {
	id: string;
	name: string;
	subscribers?: number;
	avatar?: string;
	verified: boolean;
}

export interface Comments {
	comments: Comment[];
	continuation?: string;
}

export interface Comment {
	id: string;
	text: string;
	time: string;
	edited: boolean;
	author: ChannelInfo;

	likes: number;
	pinned: boolean;
	hearted: boolean;
	owner: boolean;

	replies: number;
	ownerReplied: boolean;
	replyToken?: string;
}

export interface Chapter {
	title: string;
	time: number;
}

export async function getVideoInfo(id: string): Promise<VideoInfo> {
	const res: Stream = await fetch(`${process.env.PIPED_API}/streams/${id}`).then((res) =>
		res.json()
	);

	let lbry = res.videoStreams.find((stream) => stream.quality === 'LBRY')?.url;
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
			thumbnail: res.thumbnailUrl,
			author: {
				id: res.uploaderUrl.split('/').pop()!,
				name: res.uploader,
				subscribers: res.uploaderSubscriberCount,
				avatar: res.uploaderAvatar,
				verified: res.uploaderVerified,
			},
		},
		hls: res.hls || undefined,
		dash: res.dash || undefined,
		lbry,
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
	};
}
