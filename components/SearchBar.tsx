import { ChangeEvent, FormEvent, useState, Fragment, useEffect } from 'react';
import tw, { styled } from 'twin.macro';
import { useRouter } from 'next/router';
import { Combobox } from '@headlessui/react';
import { RiSearchLine } from 'react-icons/ri';
import { useDebouncedEffect } from '~/lib/hooks';

const Wrapper = tw.form`flex w-[48rem] relative`;
const input = tw`flex-1 border border-gray-300 focus-within:border-blue-300 px-2 py-1`;
const itemsWrapper = tw`absolute top-full left-0 w-full bg-white border border-t-0 border-gray-200 py-2 z-10`;
const SearchItem = styled.li({ ...tw`py-1 px-2`, variants: { active: { true: tw`bg-gray-100` } } });
const Button = tw.button`border border-l-0 border-gray-300 bg-gray-100 text-gray-700 hover:(bg-gray-200 text-black) px-6 py-1`;

const SearchBar: React.FC = () => {
	const router = useRouter();
	const [query, setQuery] = useState('');
	const [activeSuggestions, setActiveSuggestions] = useState<string[]>([]);
	const [fetchedSuggestions, setFetchedSuggestions] = useState<string[]>([]);

	useDebouncedEffect(async () => {
		if (query.length > 0) {
			const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`).then(
				(res) => res.json()
			);

			setFetchedSuggestions(res);
		}
	}, [query]);

	useEffect(() => {
		if (query.length > 0) {
			let suggestions = fetchedSuggestions.filter((suggestion) => suggestion.includes(query));
			suggestions.unshift(query);
			setActiveSuggestions(suggestions);
		} else {
			setActiveSuggestions([]);
		}
	}, [fetchedSuggestions, query]);

	function selectSuggestion(suggestion: string) {
		setQuery(suggestion);
		router.push(`/results?search_query=${suggestion}`);
	}

	function submitSearch(e: FormEvent) {
		e.preventDefault();
		router.push(`/results?search_query=${query}`);
	}

	return (
		<Wrapper onSubmit={submitSearch}>
			<Combobox value={query} onChange={selectSuggestion}>
				<Combobox.Input
					css={input}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
				/>
				{activeSuggestions.length > 0 && (
					<Combobox.Options css={itemsWrapper}>
						{activeSuggestions.map((e) => (
							<Combobox.Option key={e} value={e} as={Fragment}>
								{({ active }) => <SearchItem active={active}>{e}</SearchItem>}
							</Combobox.Option>
						))}
					</Combobox.Options>
				)}
			</Combobox>
			<Button type="submit">
				<RiSearchLine />
			</Button>
		</Wrapper>
		// 	<Input onChange={(e) => setQuery(e.target.value)} />
	);
};

export default SearchBar;
