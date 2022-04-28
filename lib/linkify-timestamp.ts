import { registerPlugin } from 'linkifyjs';

// @ts-ignore
export const timestamp = ({ scanner, parser, utils }) => {
	const { COLON, NUM } = scanner.tokens;

	const Timestamp = utils.createTokenClass('timestamp', { isLink: true });

	const START_STATE = parser.start;
	const FINAL_STATE = START_STATE.tt(NUM).tt(COLON).tt(NUM, Timestamp);
	FINAL_STATE.tt(COLON).tt(NUM, FINAL_STATE);
};

registerPlugin('timestamp', timestamp);
