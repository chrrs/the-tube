import { useState } from 'react';
import tw from 'twin.macro';
import { ShelfResult } from '~/lib/search';
import SearchResult from './SearchResult';

const Wrapper = tw.div`flex flex-col border-t border-b border-gray-200 gap-4 py-4`;
const Header = tw.h1`font-medium`;
const ShowMoreButton = tw.button`font-medium uppercase text-gray-700 text-center`;

const ShelfSearchResult: React.FC<{ result: ShelfResult }> = ({ result }) => {
	const n = result.items.length;
	const [expanded, setExpanded] = useState(false);

	return (
		<Wrapper>
			<Header>{result.title}</Header>
			{result.items.slice(0, expanded ? n : 2).map((result, i) => (
				<SearchResult key={i} result={result} />
			))}
			{!expanded && (
				<ShowMoreButton onClick={() => setExpanded(true)}>+ {n - 2} more</ShowMoreButton>
			)}
		</Wrapper>
	);
};

export default ShelfSearchResult;
