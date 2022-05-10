import { GetServerSideProps, NextPage } from 'next';
import tw from 'twin.macro';
import ChannelName from '~/components/ChannelName';
import RelatedVideo from '~/components/RelatedVideo';
import { formatNumber, removeUndefined } from '~/lib/util';
import { getVideoInfo, VideoInfo } from '~/lib/video';
import { format } from 'date-fns';
import { useState } from 'react';
import CommentSection from '~/components/CommentSection';
import HtmlContent from '~/components/TextContent';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const Player = dynamic(() => import('~/components/Player'), { ssr: false });

const Container = tw.div`container mx-auto px-4 py-4 flex gap-4`;
const ContentWrapper = tw.div`flex-1`;
const VideoPlaceholder = tw.div`w-full pb-[56.25%] mb-4 bg-black`;
const Title = tw.h1`font-medium text-lg`;
const LiveBadge = tw.span`uppercase font-medium text-white bg-red-500 px-2 pt-[0.0625rem] mr-2`;
const Subtitle = tw.h2`text-gray-700 mt-1`;
const Separator = tw.hr`border-gray-200 my-4`;
const InfoBox = tw.div`flex gap-4`;
const ProfilePicture = tw.img`rounded-full overflow-hidden w-12 h-12 bg-gray-200 flex-none`;
const AuthorInfo = tw.div`flex flex-col justify-center h-12 mb-4`;
const AuthorName = tw.h1`font-medium`;
const AuthorSubtitle = tw.h2`text-sm text-gray-700`;

const RelatedVideos = tw.div`w-[26rem] flex flex-col gap-4`;

const Watch: NextPage<{ video: VideoInfo; time: number }> = ({ video, time }) => {
	const meta = video.metadata;
	const author = meta.author;

	const [ready, setReady] = useState(false);

	return (
		<Container>
			<Head>
				<title>{meta.title}</title>
			</Head>

			<ContentWrapper>
				{!ready && <VideoPlaceholder />}
				<div css={ready ? '' : tw`hidden`}>
					<Player time={time} video={video} onReady={() => setReady(true)} />
				</div>
				<Title tw="mt-4">{meta.title}</Title>
				<Subtitle>
					{meta.live && <LiveBadge>Live</LiveBadge>}
					{formatNumber(meta.views)}
					{meta.live ? ' viewers - Live since ' : ' views - '}
					{format(new Date(meta.publishDate), 'PPP')}
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
						<HtmlContent videoId={meta.id} html={meta.description ?? ''} />
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
			time: Number(context.query.t ?? 0),
		}),
	};
};
