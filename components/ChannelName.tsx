import tw, { styled } from 'twin.macro';
import VerifiedIcon from '~icons/ri/check-line.jsx';

const VerifiedBadge = styled(VerifiedIcon, tw`inline-block align-middle ml-1 mb-0.5`);

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
