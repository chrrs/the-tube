import ytcm, { CommentsResponse } from '@freetube/yt-comment-scraper';
import { bestImage, Comments } from '~/lib/api';

// @ts-ignore
export default defineEventHandler(async (event) => {
	const id = event.context.params.id;
	const query = useQuery(event);
	const replyToken = query.replies?.toString?.();

	let res: CommentsResponse;
	if (replyToken) {
		res = await ytcm.getCommentReplies({ videoId: id, replyToken });
	} else {
		const continuation = query.continuation?.toString?.();
		res = await ytcm.getComments({ videoId: id, continuation });
	}

	return {
		comments: res.comments.map((comment) => ({
			id: comment.commentId,
			text: comment.text.replaceAll('<br>', '\n'),
			time: comment.time,
			edited: comment.edited,
			author: {
				id: comment.authorId,
				name: comment.author,
				avatar: bestImage(comment.authorThumb).url,
				verified: comment.isVerified || comment.isOfficialArtist,
			},
			likes: removeNumberSuffix(comment.likes),
			pinned: comment.isPinned,
			hearted: comment.isHearted,
			owner: comment.isOwner,
			replies: parseInt(comment.numReplies),
			ownerReplied: comment.hasOwnerReplied,
			replyToken: comment.replyToken || undefined,
		})),
		continuation: res.continuation || undefined,
	} as Comments;
});

function removeNumberSuffix(str: string): number {
	let n = parseFloat(str);
	if (str.endsWith('K')) {
		n *= 1000;
	} else if (str.endsWith('M')) {
		n *= 1000000;
	}
	return n;
}
