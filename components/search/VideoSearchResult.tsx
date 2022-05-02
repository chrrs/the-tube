import Link from 'next/link';
import tw, { styled } from 'twin.macro';
import { VideoResult } from '~/lib/search';
import { formatDuration, formatNumber } from '~/lib/util';
import ChannelName from '../ChannelName';

const Wrapper = tw.a`flex gap-4`;
const ThumbnailWrapper = styled.div({ ...tw`h-[202px] bg-gray-200 relative`, flex: '0 0 360px' });
const Thumbnail = tw.img`w-full h-full object-cover`;
const Duration = tw.span`absolute bottom-2 right-2 font-medium text-xs text-white bg-black bg-opacity-75 px-1 pb-0.5`;
const Title = tw.h1`text-lg font-medium`;
const LiveBadge = tw.span`uppercase font-medium text-white bg-red-500 px-2 pt-[0.0625rem] mr-2`;
const Subtitle = tw.h2`text-gray-700`;
const AuthorInfo = tw.p`py-2 text-gray-700`;
const AuthorAvatar = tw.img`mb-1 inline-block rounded-full overflow-hidden w-6 h-6 mr-2 bg-gray-200`;
const Description = tw.p`text-gray-700 line-clamp-2`;

const VideoSearchResult: React.FC<{ result: VideoResult }> = ({ result }) => {
	return (
		<Link href={`/watch?v=${result.id}`} passHref>
			<Wrapper>
				<ThumbnailWrapper>
					<Thumbnail loading="lazy" src={result.thumbnail} alt={result.title} />
					<Duration>{formatDuration(result.lengthSeconds)}</Duration>
				</ThumbnailWrapper>
				<div>
					<Title>{result.title}</Title>
					<Subtitle>
						{result.live && <LiveBadge>Live</LiveBadge>}
						{formatNumber(result.views)}
						{result.live ? ' viewers' : ` views - ${result.publishDate}`}
					</Subtitle>
					<AuthorInfo>
						<AuthorAvatar src={result.author.avatar} alt={result.author.name} />
						<ChannelName verified={result.author.verified}>
							{result.author.name}
						</ChannelName>
					</AuthorInfo>
					<Description>{result.description}</Description>
				</div>
			</Wrapper>
		</Link>
	);
};

export default VideoSearchResult;
