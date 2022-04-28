import tw, { styled } from 'twin.macro';
import DOMPurify from 'dompurify';
import linkifyHtml from 'linkify-html';
import 'linkify-plugin-hashtag';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Content = styled.p({
	...tw`whitespace-pre-line`,

	'a[href]': {
		...tw`text-blue-500 hover:underline`,
	},
});

const HtmlContent: React.FC<{ html: string }> = ({ html }) => {
	const router = useRouter();
	const [sanitized, setSanitized] = useState('');

	useEffect(() => {
		let content = html;
		content = DOMPurify.sanitize(content, { ALLOWED_TAGS: ['br', 'a'] });
		content = linkifyHtml(content, {
			formatHref: {
				hashtag: (href: string) =>
					'/results?search_query=' + encodeURIComponent(href.substring(1)),
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
	}, [html]);

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
