import { useEffect, useState, useRef, RefObject } from 'react';
import { Comments, Comment, getComments, getReplies } from '~/lib/video';

export function useOnScreen(ref: RefObject<HTMLElement>) {
	const [isOnScreen, setOnScreen] = useState(false);
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		observerRef.current = new IntersectionObserver(([entry]) =>
			setOnScreen(entry.isIntersecting)
		);
	}, []);

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		observerRef.current?.observe(ref.current);

		return () => {
			observerRef.current?.disconnect();
		};
	}, [ref]);

	return isOnScreen;
}

export function useComments(id: string, replyToken?: string) {
	const [total, setTotal] = useState<number>();
	const [fetching, setFetching] = useState(false);
	const [comments, setComments] = useState<Comment[]>();
	const [continuation, setContinuation] = useState<string>();

	const done = comments && continuation === undefined;

	useEffect(
		() => () => {
			setTotal(undefined);
			setFetching(false);
			setComments(undefined);
			setContinuation(undefined);
		},
		[id, replyToken]
	);

	return {
		total,
		comments: comments ?? [],
		async loadMore() {
			if (fetching || done) {
				return;
			}

			setFetching(true);

			let res: Response;
			if (replyToken) {
				res = await fetch(
					`/api/video/${id}/comments?replies=${continuation ?? replyToken}`
				);
			} else if (continuation) {
				res = await fetch(`/api/video/${id}/comments?continuation=${continuation}`);
			} else {
				res = await fetch(`/api/video/${id}/comments`);
			}

			const comments: Comments = await res.json();

			setTotal(comments.total);
			setComments((c) => [...(c ?? []), ...comments.comments]);
			setContinuation(comments.continuation);

			setFetching(false);
		},
		fetching,
		done,
	};
}
