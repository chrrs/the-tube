declare module '@freetube/yt-comment-scraper' {
	export interface GetCommentsConfig {
		videoId: string;
		sortByNewest?: boolean;
		continuation?: string;
		mustSetCookie?: boolean;
		httpsAgent?: object;
	}

	export interface GetCommentRepliesConfig {
		videoId: string;
		replyToken: string;
		mustSetCookie?: boolean;
		httpsAgent?: object;
	}

	export interface CommentsResponse {
		total?: number;
		comments: Comment[];
		continuation?: string;
	}

	export interface Comment {
		commentId: string;
		authorId: string;
		author: string;
		authorThumb: Image[];
		edited: boolean;
		text: string;
		likes: string;
		time: string;
		numReplies: string;
		isOwner: boolean;
		isHearted: boolean;
		isPinned: boolean;
		isVerified: boolean;
		isOfficialArtist: boolean;
		hasOwnerReplied: boolean;
		isMember: boolean;
		memberIconUrl?: string;
		customEmojis: Emoji[];
		replyToken?: string;
	}

	export interface Image {
		url: string;
		width: number;
		height: number;
	}

	export interface Emoji {
		text: string;
		emojiThumbnails: Image[];
	}

	function getComments(config: GetCommentsConfig): Promise<CommentsResponse>;
	function getCommentReplies(config: GetCommentRepliesConfig): Promise<CommentsResponse>;
}
