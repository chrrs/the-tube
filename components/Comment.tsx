import tw, { styled } from 'twin.macro';
import { Comment as ApiComment, VideoInfo } from '~/lib/video';
import PinIcon from '~icons/ri/pushpin-line.jsx';
import ChannelName from './ChannelName';
import LikeIcon from '~icons/ri/thumb-up-line.jsx';
import ChevronUpIcon from '~icons/ri/arrow-up-s-line.jsx';
import ChevronDownIcon from '~icons/ri/arrow-down-s-line.jsx';
import { formatNumber } from '~/lib/util';
import { useState } from 'react';
import { useComments } from '~/lib/hooks';
import Spinner from '~/components/Spinner';
import ArrowRightIcon from '~icons/ri/arrow-right-line.jsx';

const Wrapper = tw.div`flex gap-4`;
const ProfilePicture = tw.img`rounded-full w-10 h-10`;
const ContentWrapper = tw.div`flex-1`;
const Supertitle = tw.p`text-sm text-gray-700`;
const Pin = styled(PinIcon, tw`inline-block align-middle mr-1 mb-1`);
const Title = tw.h1`font-semibold mb-0.5`;
const Content = tw.p`whitespace-pre-line`;
const Timestamp = tw.span`font-normal text-sm text-gray-700 ml-2`;
const LikeBar = tw.div`mt-2 text-sm text-gray-700`;
const Like = styled(LikeIcon, tw`inline-block align-middle mr-2 mb-0.5`);
const RepliesButton = tw.button`mt-2 text-blue-700 font-semibold`;
const ShowReplies = styled(ChevronDownIcon, tw`inline-block align-middle mr-1 mb-0.5`);
const HideReplies = styled(ChevronUpIcon, tw`inline-block align-middle mr-1 mb-0.5`);
const RepliesWrapper = tw.div`flex flex-col items-start gap-4 mt-4`;
const ArrowRight = styled(ArrowRightIcon, tw`inline-block align-middle mr-1 mb-0.5`);
const Loader = tw.div`w-full flex justify-center`;

const Comment: React.FC<{ video: VideoInfo; comment: ApiComment }> = ({ video, comment }) => {
	const author = comment.author;

	const [expanded, setExpanded] = useState(false);
	const { comments, loadMore, fetching, done } = useComments(
		video.metadata.id,
		comment.replyToken
	);

	function toggleExpanded() {
		fetchMore();
		setExpanded((e) => !e);
	}

	function fetchMore() {
		if (!fetching && !done) {
			loadMore();
		}
	}

	return (
		<Wrapper>
			<ProfilePicture loading="lazy" src={author.avatar} alt={author.name} />
			<ContentWrapper>
				{comment.pinned && (
					<Supertitle>
						<Pin />
						Pinned
					</Supertitle>
				)}
				<Title>
					<ChannelName verified={author.verified}>{author.name}</ChannelName>
					<Timestamp>
						{comment.time} {comment.edited ? '(edited)' : ''}
					</Timestamp>
				</Title>
				<Content>{comment.text.replace(/<br>/g, '\n')}</Content>
				<LikeBar>
					<Like />
					{formatNumber(comment.likes, true)}
				</LikeBar>
				{comment.replies !== 0 && (
					<RepliesButton onClick={toggleExpanded}>
						{expanded ? <HideReplies /> : <ShowReplies />}
						{expanded ? 'hide' : 'show'} {comment.replies}
						{comment.replies === 1 ? ' reply' : ' replies'}
						{comment.ownerReplied
							? ` from ${video.metadata.author.name} and others`
							: ''}
					</RepliesButton>
				)}
				{expanded && (
					<RepliesWrapper>
						{comments.map((comment) => (
							<Comment key={comment.id} video={video} comment={comment} />
						))}
						{fetching && (
							<Loader>
								<Spinner />
							</Loader>
						)}
						{!fetching && !done && (
							<RepliesButton onClick={fetchMore}>
								<ArrowRight /> fetch more replies
							</RepliesButton>
						)}
					</RepliesWrapper>
				)}
			</ContentWrapper>
		</Wrapper>
	);
};

export default Comment;
