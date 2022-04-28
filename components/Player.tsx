import { useEffect, useState } from 'react';
import { VideoInfo } from '~/lib/video';
import { DefaultUi, Player as VimePlayer, Hls, LiveIndicator } from '@vime/react';

import '@vime/core/themes/default.css';

const Player: React.FC<{
	time: number;
	video: VideoInfo;
	onReady?: () => void;
}> = ({ time, video, onReady }) => {
	const [source, setSource] = useState<{ src: string; type: string }>();

	useEffect(() => {
		(async () => {
			if (video.metadata.live && video.hls) {
				setSource({
					src: video.hls,
					type: 'application/x-mpegURL',
				});
			} else if (video.lbry) {
				const type = await fetch(video.lbry).then((res) => res.headers.get('content-type'));

				if (type) {
					setSource({
						src: video.lbry,
						type,
					});
				}
			} else if (video.dash) {
				setSource({
					src: video.dash,
					type: 'application/dash+xml',
				});
			} else if (video.hls) {
				setSource({
					src: video.hls,
					type: 'application/x-mpegURL',
				});
			}
		})();
	}, [video]);

	useEffect(() => {
		onReady?.();
	}, [onReady]);

	return (
		<VimePlayer playsinline autoplay currentTime={time}>
			<Hls config={{ liveDurationInfinity: true }} poster={video.metadata.thumbnail}>
				<source data-src={source?.src} type={source?.type} />
			</Hls>
			<DefaultUi></DefaultUi>
		</VimePlayer>
	);
};

export default Player;
