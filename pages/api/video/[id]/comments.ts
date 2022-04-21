import { NextApiRequest, NextApiResponse } from 'next';
import { Comments, getComments, getReplies } from '~/lib/video';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Comments>) {
	const id = req.query.id as string;
	const replyToken = req.query.replies as string | undefined;
	const continuation = req.query.continuation as string | undefined;

	if (replyToken) {
		res.status(200).json(await getReplies(id, replyToken));
	} else {
		res.status(200).json(await getComments(id, continuation));
	}
}
