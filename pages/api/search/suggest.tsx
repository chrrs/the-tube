import { NextApiRequest, NextApiResponse } from 'next';
import { SearchSuggestionResponse } from '~/types/youtube-api';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string[] | { error: string }>
) {
	const query = req.query.q as string | undefined;

	if (!query) {
		res.status(400).json({ error: 'No query provided' });
		return;
	}

	const ytRes: SearchSuggestionResponse = await fetch(
		`http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&cp=1&format=5&alt=json&q=${encodeURIComponent(
			query
		)}`
	).then((res) => res.json());

	res.status(200).json(ytRes[1].map((item) => item[0]));
}
