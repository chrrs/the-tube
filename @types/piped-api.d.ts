export interface Stream {
	title: string;
	description: string;
	uploadDate: string;
	uploader: string;
	uploaderUrl: string;
	uploaderAvatar: string;
	thumbnailUrl: string;
	hls: string | null;
	dash: string | null;
	lbryId: string | null;
	uploaderVerified: boolean;
	duration: number;
	views: number;
	likes: number;
	dislikes: number;
	uploaderSubscriberCount: number;
	audioStreams: MediaStream[];
	videoStreams: MediaStream[];
	relatedStreams: never[];
	subtitles: never[];
	livestream: boolean;
	proxyUrl: string;
	chapters: never[];
}

export interface MediaStream {
	url: string;
	format: string;
	quality: string;
	mimeType: string;
	codec: string;
	videoOnly: boolean;
	bitrate: number;
	initStart: number;
	initEnd: number;
	indexStart: number;
	indexEnd: number;
	width: number;
	height: number;
	fps: number;
}

export interface RelatedStream {
	url: string;
	title: string;
	thumbnail: string;
	uploaderName: string;
	uploaderUrl: string;
	uploaderAvatar: string;
	uploadedDate: string;
	shortDescription: null;
	duration: number;
	views: number;
	uploaded: number;
	uploaderVerified: boolean;
}
