import { GetServerSideProps, NextPage } from 'next';
import tw, { styled } from 'twin.macro';
import ChannelName from '~/components/ChannelName';
import RelatedVideo from '~/components/RelatedVideo';
import { formatNumber, removeUndefined } from '~/lib/util';
import { getVideoInfo, VideoInfo } from '~/lib/video';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import linkifyHtml from 'linkify-html';
import 'linkify-plugin-hashtag';
import { useRouter } from 'next/router';
import Player from '~/components/Player';
import CommentSection from '~/components/CommentSection';

const Container = tw.div`container mx-auto px-4 py-4 flex gap-4`;
const ContentWrapper = tw.div`flex-1`;
const VideoPlaceholder = tw.div`w-full pb-[56.25%] mb-4 bg-black`;
const Title = tw.h1`font-semibold text-lg`;
const Subtitle = tw.h2`text-gray-700 mt-1`;
const Separator = tw.hr`border-gray-200 my-4`;
const InfoBox = tw.div`flex gap-4`;
const ProfilePicture = tw.img`rounded-full w-12 h-12 bg-gray-200`;
const AuthorInfo = tw.div`flex flex-col justify-center h-12`;
const AuthorName = tw.h1`font-semibold`;
const AuthorSubtitle = tw.h2`text-sm text-gray-700`;

const Description = styled.p({
	...tw`mt-4 whitespace-pre-line`,

	'a[href]': {
		...tw`text-blue-500 hover:underline`,
	},
});

const RelatedVideos = tw.div`w-[26rem] flex flex-col gap-4`;

const Watch: NextPage<{ video: VideoInfo }> = ({ video }) => {
	const meta = video.metadata;
	const author = meta.author;

	const router = useRouter();
	const [ready, setReady] = useState(false);

	const [description, setDescription] = useState('');
	useEffect(() => {
		let description = meta.description || '';

		description = DOMPurify.sanitize(description, { ALLOWED_TAGS: ['br', 'a'] });
		description = linkifyHtml(description, {
			formatHref: {
				hashtag: (href: string) =>
					'/results?search_query=' + encodeURIComponent(href.substring(1)),
			},
		});

		const base = location.origin;
		description = description
			.replace(/(?:http(?:s)?:\/\/)?(?:www.)?youtube.com(\/[a-zA-Z0-9?=&]*)/gim, `${base}$1`)
			.replace(
				/(?:http(?:s)?:\/\/)?(?:www.)?youtu.be\/([a-zA-Z0-9?=&]*)/gim,
				`${base}/watch?v=$1`
			);

		setDescription(description);
	}, [meta]);

	function onDescriptionClick(event: Event) {
		// @ts-ignore
		const target: HTMLAnchorElement = event.target?.closest?.('a');
		if (!target) {
			return;
		}

		event.preventDefault();
		router.push(target.href);
	}

	return (
		<Container>
			<ContentWrapper>
				{!ready && <VideoPlaceholder />}
				<div css={ready ? '' : tw`hidden`}>
					<Player video={video} onReady={() => setReady(true)} />
				</div>
				<Title tw="mt-4">{meta.title}</Title>
				<Subtitle>
					{formatNumber(meta.views)} views - {format(new Date(meta.publishDate), 'PPP')}
				</Subtitle>
				<Separator />
				<InfoBox>
					<ProfilePicture src={author.avatar} alt={author.name} />
					<div>
						<AuthorInfo>
							<AuthorName>
								<ChannelName verified={author.verified}>{author.name}</ChannelName>
							</AuthorName>
							<AuthorSubtitle>
								{formatNumber(author.subscribers ?? 0, true)} subscribers
							</AuthorSubtitle>
						</AuthorInfo>
						<Description
							onClick={onDescriptionClick}
							onKeyPress={onDescriptionClick}
							dangerouslySetInnerHTML={{ __html: description }}
						/>
					</div>
				</InfoBox>
				<Separator />
				<CommentSection video={video} />
			</ContentWrapper>
			<RelatedVideos>
				{video.related.map((related) => (
					<RelatedVideo key={related.id} meta={related} />
				))}
			</RelatedVideos>
		</Container>
	);
};

export default Watch;

export const getServerSideProps: GetServerSideProps = async (context) => {
	if (!context.query.v) {
		return {
			notFound: true,
		};
	}

	return {
		props: removeUndefined({
			video: await getVideoInfo(context.query.v as string),
		}),
	};
};
