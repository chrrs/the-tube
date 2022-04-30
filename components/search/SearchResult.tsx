import { SearchResult as ApiSearchResult } from '~/lib/search';
import VideoSearchResult from './VideoSearchResult';

const SearchResult: React.FC<{ result: ApiSearchResult }> = ({ result }) => {
	if (result.type === 'video') {
		return <VideoSearchResult result={result} />;
	} else {
		return <></>;
	}
};

export default SearchResult;
