import { useEffect, useRef } from 'react';
import tw from 'twin.macro';
import Spinner from '~/components/Spinner';
import Comment from '~/components/Comment';
import { useComments, useOnScreen } from '~/lib/hooks';
import { VideoInfo } from '~/lib/video';
import { formatNumber } from '~/lib/util';

const Notice = tw.p`text-center mt-4`;
const Wrapper = tw.div`flex flex-col gap-6`;
const Loader = tw.div`flex justify-center mt-8`;

const CommentSection: React.FC<{ video: VideoInfo }> = ({ video }) => {
	const spinner = useRef<HTMLElement>(null);
	const isVisible = useOnScreen(spinner);

	const { total, comments, loadMore, fetching, done } = useComments(video.metadata.id);

	useEffect(() => {
		if (isVisible && !fetching) {
			loadMore();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isVisible]);

	return (
		<Wrapper>
			{total && comments.length > 0 && <p>{formatNumber(total)} comments</p>}
			{done && comments.length == 0 && <Notice>No comments.</Notice>}
			{comments.map((comment) => (
				<Comment key={comment.id} video={video} comment={comment} />
			))}
			{!done && (
				<Loader>
					<Spinner ref={spinner} />
				</Loader>
			)}
		</Wrapper>
	);
};

export default CommentSection;
