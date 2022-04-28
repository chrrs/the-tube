import { useEffect, useRef, useState } from 'react';
import videojs, { VideoJsPlayer } from 'video.js';

import 'video.js/dist/video-js.css';
import { VideoInfo } from '~/lib/video';

const Player: React.FC<{
	time: number;
	video: VideoInfo;
	onReady?: () => void;
}> = ({ time, video, onReady }) => {
	const el = useRef<HTMLVideoElement>(null);
	const [player, setPlayer] = useState<VideoJsPlayer | null>(null);

	useEffect(() => {
		if (!el.current || player) {
			return;
		}

		let p: VideoJsPlayer = videojs(
			el.current,
			{
				controls: true,
				autoplay: true,
				responsive: true,
				fluid: true,
			},
			() => {
				p.volume(parseFloat(localStorage.getItem('_player_volume') || '1'));
				p.currentTime(time);
				onReady?.();
			}
		);
		setPlayer(p);

		p.on('volumechange', () => {
			localStorage.setItem('_player_volume', p.volume().toString());
		});
	}, [video, player, onReady, time]);

	useEffect(() => {
		(async () => {
			if (!player) {
				return;
			}

			player.poster(video.metadata.thumbnail);

			const src = [];
			if (video.metadata.live && video.hls) {
				src.push({
					src: video.hls,
					type: 'application/x-mpegURL',
				});
			} else if (video.lbry) {
				const type = await fetch(video.lbry).then((res) => res.headers.get('content-type'));

				if (type) {
					src.push({
						src: video.lbry,
						type,
					});
				}
			} else if (video.dash) {
				src.push({
					src: video.dash,
					type: 'application/dash+xml',
				});
			} else if (video.hls) {
				src.push({
					src: video.hls,
					type: 'application/x-mpegURL',
				});
			}

			player.src(src);
			player.currentTime(time);
		})();
	}, [player, video, time]);

	// TODO: Test if this is correct.
	if (process.env.NODE_ENV !== 'development') {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => () => player?.dispose(), [player]);
	}

	return (
		<div data-vjs-player>
			<video ref={el} className="video-js" playsInline />
		</div>
	);
};

export default Player;
