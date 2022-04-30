import { GetServerSideProps, NextPage } from 'next';
import tw from 'twin.macro';
import SearchResult from '~/components/search/SearchResult';
import { getSearchResults, SearchResults } from '~/lib/search';
import { removeUndefined } from '~/lib/util';

const Container = tw.div`container max-w-5xl mx-auto px-4 py-4 flex flex-col gap-4`;

const Results: NextPage<{ results: SearchResults }> = ({ results }) => {
	return (
		<Container>
			{results.items.map((result, i) => (
				<SearchResult key={i} result={result} />
			))}
		</Container>
	);
};

export default Results;

export const getServerSideProps: GetServerSideProps = async (context) => {
	if (!context.query.search_query) {
		return {
			notFound: true,
		};
	}

	return {
		props: removeUndefined({
			results: await getSearchResults(context.query.search_query as string),
		}),
	};
};
