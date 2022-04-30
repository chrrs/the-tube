import tw, { styled } from 'twin.macro';
import { RiCheckLine } from 'react-icons/ri';

const VerifiedBadge = styled(RiCheckLine, tw`inline-block align-middle ml-1 mb-[0.125em]`);

const ChannelName: React.FC<{
	verified?: boolean;
	children: string;
}> = ({ verified, children }) => {
	return (
		<>
			{children}
			{verified && <VerifiedBadge />}
		</>
	);
};

export default ChannelName;
