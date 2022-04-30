import { SearchResult as ApiSearchResult } from '~/lib/search';
import ShelfSearchResult from './ShelfSearchResult';
import VideoSearchResult from './VideoSearchResult';

const SearchResult: React.FC<{ result: ApiSearchResult }> = ({ result }) => {
	if (result.type === 'video') {
		return <VideoSearchResult result={result} />;
	} else if (result.type === 'shelf') {
		return <ShelfSearchResult result={result} />;
	} else {
		return <></>;
	}
};

export default SearchResult;
