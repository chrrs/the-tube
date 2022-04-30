import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import tw from 'twin.macro';
import SearchResult from '~/components/search/SearchResult';
import { getSearchResults, SearchResults } from '~/lib/search';
import { formatNumber, removeUndefined } from '~/lib/util';

const Header = tw.p`py-2 border-b border-gray-200 text-gray-700 font-semibold`;
const Container = tw.div`container max-w-5xl mx-auto px-4 py-4 flex flex-col gap-4`;

const Results: NextPage<{ results: SearchResults; query: string }> = ({ results, query }) => {
	return (
		<Container>
			<Head>
				<title>{query}</title>
			</Head>

			{results.results && <Header>{formatNumber(results.results)} results</Header>}
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
			query: context.query.search_query as string,
		}),
	};
};
