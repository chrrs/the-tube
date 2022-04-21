import tw from 'twin.macro';
import SearchBar from './SearchBar';

const Wrapper = tw.header`flex justify-center bg-white p-2`;

const Header: React.FC = () => {
	return (
		<Wrapper>
			<SearchBar />
		</Wrapper>
	);
};

export default Header;
