import tw, { styled } from 'twin.macro';
import { Comment as ApiComment, VideoInfo } from '~/lib/video';
import {
	RiPushpinLine,
	RiThumbUpLine,
	RiArrowUpSLine,
	RiArrowDownSLine,
	RiArrowRightLine,
} from 'react-icons/ri';
import ChannelName from './ChannelName';
import { formatNumber } from '~/lib/util';
import { useState } from 'react';
import { useComments } from '~/lib/hooks';
import Spinner from '~/components/Spinner';
import HtmlContent from './TextContent';

const Wrapper = tw.div`flex gap-4`;
const ProfilePicture = tw.img`rounded-full overflow-hidden w-10 h-10 bg-gray-200`;
const ContentWrapper = tw.div`flex-1`;
const Supertitle = tw.p`text-sm text-gray-700`;
const PinIcon = styled(RiPushpinLine, tw`inline-block align-middle mr-1 mb-1`);
const Title = tw.h1`font-medium mb-0.5`;
const Timestamp = tw.span`font-normal text-sm text-gray-700 ml-2`;
const LikeBar = tw.div`mt-2 text-sm text-gray-700`;
const LikeIcon = styled(RiThumbUpLine, tw`inline-block align-middle mr-2 mb-0.5`);
const RepliesButton = tw.button`mt-2 text-blue-700 font-medium`;
const ShowReplies = styled(RiArrowDownSLine, tw`inline-block align-middle mr-1 mb-0.5`);
const HideReplies = styled(RiArrowUpSLine, tw`inline-block align-middle mr-1 mb-0.5`);
const RepliesWrapper = tw.div`flex flex-col items-start gap-4 mt-4`;
const ArrowRight = styled(RiArrowRightLine, tw`inline-block align-middle mr-1 mb-0.5`);
const Loader = tw.div`w-full flex justify-center`;

const AuthorName = styled.span({
	variants: {
		owner: {
			true: tw`rounded-full px-2 pb-0.5 bg-gray-500 text-white`,
		},
	},
});

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
						<PinIcon />
						Pinned
					</Supertitle>
				)}
				<Title>
					<AuthorName owner={comment.owner}>
						<ChannelName verified={author.verified}>{author.name}</ChannelName>
					</AuthorName>
					<Timestamp>
						{comment.time} {comment.edited ? '(edited)' : ''}
					</Timestamp>
				</Title>
				<HtmlContent videoId={video.metadata.id} html={comment.text} />
				<LikeBar>
					<LikeIcon />
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
