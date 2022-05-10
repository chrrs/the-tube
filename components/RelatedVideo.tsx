import Link from 'next/link';
import tw, { styled } from 'twin.macro';
import { formatDuration, formatNumber } from '~/lib/util';
import { VideoMetadata } from '~/lib/video';
import ChannelName from './ChannelName';
import { formatDistanceToNowStrict } from 'date-fns';

const Wrapper = tw.a`flex gap-2`;
const ThumbnailWrapper = styled.div({ ...tw`h-[94px] bg-gray-200 relative`, flex: '0 0 168px' });
const Thumbnail = tw.img`w-full h-full object-cover`;
const Duration = tw.span`absolute bottom-2 right-2 font-medium text-xs text-white bg-black bg-opacity-75 px-1 pb-0.5`;
const Title = tw.h1`text-sm font-medium line-clamp-2 mb-1`;
const Subtitle = tw.h2`text-sm text-gray-700`;

const RelatedVideo: React.FC<{ meta: VideoMetadata }> = ({ meta }) => {
	const author = meta.author;

	return (
		<Link href={`/watch?v=${meta.id}`} passHref>
			<Wrapper>
				<ThumbnailWrapper>
					<Thumbnail loading="lazy" src={meta.thumbnail} alt={meta.title} />
					{meta.lengthSeconds && (
						<Duration>{formatDuration(meta.lengthSeconds)}</Duration>
					)}
				</ThumbnailWrapper>
				<div>
					<Title>{meta.title}</Title>
					<Subtitle>
						<ChannelName verified={author.verified}>{author.name}</ChannelName>
					</Subtitle>
					<Subtitle>
						{formatNumber(meta.views)}
						{meta.publishDate ? ' views - ' : ' views'}
						{meta.publishDate &&
							formatDistanceToNowStrict(new Date(meta.publishDate), {
								addSuffix: true,
							})}
					</Subtitle>
				</div>
			</Wrapper>
		</Link>
	);
};

export default RelatedVideo;
