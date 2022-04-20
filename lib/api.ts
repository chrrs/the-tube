export interface Video {
	metadata: VideoMetadata;
	hls?: string;
	dash?: string;
	lbry?: string;
	formats: MediaFormat[];
	related: VideoMetadata[];
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

export type MediaFormat = HybridFormat | VideoFormat | AudioFormat;

export interface HybridFormat extends Omit<VideoFormat, 'type'>, Omit<AudioFormat, 'type'> {
	type: 'hybrid';
}

export interface VideoFormat {
	url: string;
	type: 'video';
	mimeType: string;
	width: number;
	height: number;
}

export interface AudioFormat {
	url: string;
	type: 'audio';
	mimeType: string;
}

export interface ChannelInfo {
	id: string;
	name: string;
	subscribers?: string;
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

export interface Image {
	url: string;
	width: number;
	height: number;
}

export function formatNumber(num: number): string {
	const formatter = Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumSignificantDigits: 10,
	});
	return formatter.format(num);
}

export function bestImage(images: Image[]): Image {
	return images.reduce((best, curr) => {
		if (curr.width > best.width) {
			return curr;
		}

		return best;
	}, images[0]);
}
