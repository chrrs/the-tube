import ytsr from 'ytsr';
import { ChannelInfo, VideoMetadata } from '~/lib/video';
import { parseDuration, removeNumberSuffix } from '~/lib/util';

export interface SearchResults {
	results?: number;
	items: SearchResult[];
	continuation?: object;
}

export type SearchResult = VideoResult | ChannelResult | ShelfResult;

export interface VideoResult extends VideoMetadata {
	type: 'video';
}

export interface ChannelResult extends ChannelInfo {
	type: 'channel';
}

export interface ShelfResult {
	type: 'shelf';
	title: string;
	items: SearchResult[];
}

function ytsrToSearchResult(item: ytsr.Item): SearchResult | undefined {
	if (item.type === 'video') {
		return {
			type: 'video',
			id: item.id,
			title: item.title,
			description: item.description || undefined,
			publishDate: item.uploadedAt || '1-1-1900',
			live: item.isLive,
			views: item.views || 0,
			lengthSeconds: (item.duration && parseDuration(item.duration)) || 0,
			thumbnail: item.bestThumbnail.url || '',
			author: {
				id: item.author?.channelID || '',
				name: item.author?.name || 'Unknown',
				avatar: item.author?.bestAvatar?.url || '',
				verified: item.author?.verified || false,
			},
		};
	} else if (item.type === 'channel') {
		return {
			type: 'channel',
			id: item.channelID,
			name: item.name,
			description: item.descriptionShort || undefined,
			subscribers: (item.subscribers && removeNumberSuffix(item.subscribers)) || undefined,
			avatar: item.bestAvatar.url || undefined,
			verified: item.verified,
		};
	} else if (item.type === 'shelf') {
		return {
			type: 'shelf',
			title: item.title,
			items: item.items
				.map((shelfItem) => ytsrToSearchResult(shelfItem))
				.filter((item) => item !== undefined) as SearchResult[],
		};
	}
}

export async function getSearchResults(query: string): Promise<SearchResults> {
	const res = await ytsr(query);

	return {
		results: res.results,
		items: res.items
			.map((item) => ytsrToSearchResult(item))
			.filter((item) => item !== undefined) as SearchResult[],
		continuation: res.continuation || undefined,
	};
}
