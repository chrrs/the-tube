import tw, { styled } from 'twin.macro';
import DOMPurify from 'dompurify';
import linkifyHtml from 'linkify-html';
import 'linkify-plugin-hashtag';
import '~/lib/linkify-timestamp';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { parseDuration } from '~/lib/util';

const Content = styled.p({
	'a[href]': {
		...tw`text-blue-500 hover:underline`,
	},
});

const HtmlContent: React.FC<{ html: string; videoId?: string }> = ({ html, videoId }) => {
	const router = useRouter();
	const [sanitized, setSanitized] = useState('');

	useEffect(() => {
		let content = html;
		content = DOMPurify.sanitize(content, { ALLOWED_TAGS: ['br', 'a'] });
		content = linkifyHtml(content, {
			nl2br: true,

			formatHref: {
				hashtag: (href: string) =>
					'/results?search_query=' + encodeURIComponent(href.substring(1)),
				timestamp: (timestamp: string) =>
					`/watch?v=${videoId}&t=${parseDuration(timestamp)}`,
			},
		});

		const base = location.origin;
		content = content
			.replace(/(?:http(?:s)?:\/\/)?(?:www.)?youtube.com(\/[a-zA-Z0-9?=&]*)/gim, `${base}$1`)
			.replace(
				/(?:http(?:s)?:\/\/)?(?:www.)?youtu.be\/([a-zA-Z0-9?=&]*)/gim,
				`${base}/watch?v=$1`
			);

		setSanitized(content);
	}, [html, videoId]);

	function onClick(event: Event) {
		// @ts-ignore
		const target: HTMLAnchorElement = event.target?.closest?.('a');
		if (!target) {
			return;
		}

		event.preventDefault();
		router.push(target.href);
	}

	return (
		<Content
			onClick={onClick}
			onKeyPress={onClick}
			dangerouslySetInnerHTML={{ __html: sanitized }}
		/>
	);
};

export default HtmlContent;
