import { FormEvent, useState } from 'react';
import tw from 'twin.macro';
import { RiSearchLine } from 'react-icons/ri';
import { useRouter } from 'next/router';

const Wrapper = tw.form`flex w-[48rem]`;
const Input = tw.input`flex-1 border border-gray-300 focus-within:border-blue-300 px-2 py-1`;
const Button = tw.button`border border-l-0 border-gray-300 bg-gray-100 text-gray-700 hover:(bg-gray-200 text-black) px-6 py-1`;

const SearchBar: React.FC = () => {
	const router = useRouter();
	const [query, setQuery] = useState('');

	function submitSearch(e: FormEvent) {
		e.preventDefault();
		router.push(`/results?search_query=${query}`);
	}

	return (
		<Wrapper onSubmit={submitSearch}>
			<Input onChange={(e) => setQuery(e.target.value)} />
			<Button type="submit">
				<RiSearchLine />
			</Button>
		</Wrapper>
	);
};

export default SearchBar;
