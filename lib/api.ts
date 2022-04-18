export interface Video {
	metadata: VideoMetadata;
	hls?: string;
	dash?: string;
	lbry?: string;
	formats: MediaFormat[];
}

export interface VideoMetadata {
	title: string;
	description: string;
	publishDate: string;
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
	subscribers: string;
	avatar: string;
	verified: boolean;
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
