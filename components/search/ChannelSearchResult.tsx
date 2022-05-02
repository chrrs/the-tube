import tw, { styled } from 'twin.macro';
import { ChannelResult } from '~/lib/search';
import { formatNumber } from '~/lib/util';
import ChannelName from '../ChannelName';

const Wrapper = tw.div`flex gap-4`;
const AvatarWrapper = styled.div({ ...tw`flex justify-center`, flex: '0 0 360px' });
const Info = tw.div`flex flex-col justify-center`;
const Avatar = tw.img`w-32 h-32 rounded-full overflow-hidden bg-gray-200`;
const Name = tw.h1`text-lg font-medium`;
const Subtitle = tw.p`text-gray-700`;
const Description = tw.p`text-gray-700 mt-2 line-clamp-1`;

const ShelfSearchResult: React.FC<{ result: ChannelResult }> = ({ result }) => {
	return (
		<Wrapper>
			<AvatarWrapper>
				<Avatar loading="lazy" src={result.avatar} alt={result.name}></Avatar>
			</AvatarWrapper>
			<Info>
				<Name>
					<ChannelName verified={result.verified}>{result.name}</ChannelName>
				</Name>
				<Subtitle>
					{formatNumber(result.subscribers || 0, true)}
					{' subscribers'}
					{result.videos && ` - ${formatNumber(result.videos)} videos`}
				</Subtitle>
				{result.description && <Description>{result.description}</Description>}
			</Info>
		</Wrapper>
	);
};

export default ShelfSearchResult;
