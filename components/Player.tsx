import { useEffect, useState } from 'react';
import { VideoInfo } from '~/lib/video';
import { DefaultUi, Player as VimePlayer, Hls, Dash, Video } from '@vime/react';

interface PlayerSource {
	type: 'hls' | 'dash' | 'video';
	src: string;
	mimeType: string;
}

import '@vime/core/themes/default.css';

const Player: React.FC<{
	time: number;
	video: VideoInfo;
	onReady?: () => void;
}> = ({ time, video, onReady }) => {
	const [source, setSource] = useState<PlayerSource>();

	useEffect(() => {
		(async () => {
			if (video.metadata.live && video.hls) {
				setSource({
					type: 'hls',
					src: video.hls,
					mimeType: 'application/x-mpegURL',
				});
			} else if (video.lbry) {
				const type = await fetch(video.lbry).then((res) => res.headers.get('content-type'));

				if (type) {
					setSource({
						type: 'video',
						src: video.lbry,
						mimeType: type,
					});
				}
			} else if (video.dash) {
				setSource({
					type: 'dash',
					src: video.dash,
					mimeType: 'application/dash+xml',
				});
			} else if (video.hls) {
				setSource({
					type: 'hls',
					src: video.hls,
					mimeType: 'application/x-mpegURL',
				});
			}
		})();
	}, [video]);

	useEffect(() => {
		onReady?.();
	}, [onReady]);

	// TODO: Fix currentTime after reload.
	return (
		<VimePlayer playsinline autoplay currentTime={time}>
			{source?.type === 'dash' && (
				<Dash
					mediaTitle={video.metadata.title}
					poster={video.metadata.thumbnail}
					src={source.src}
				/>
			)}
			{source?.type === 'hls' && (
				<Hls
					config={{ liveDurationInfinity: true }}
					mediaTitle={video.metadata.title}
					poster={video.metadata.thumbnail}
				>
					<source data-src={source?.src} type={source?.mimeType} />
				</Hls>
			)}
			{source?.type === 'video' && (
				<Video mediaTitle={video.metadata.title} poster={video.metadata.thumbnail}>
					<source data-src={source?.src} type={source?.mimeType} />
				</Video>
			)}
			<DefaultUi></DefaultUi>
		</VimePlayer>
	);
};

export default Player;
