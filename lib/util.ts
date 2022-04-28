export interface Image {
	url: string;
	width: number;
	height: number;
}

export function formatNumber(num: number, compact: boolean = false): string {
	if (!compact) {
		return num.toLocaleString('en-US');
	}

	const formatter = Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumSignificantDigits: 10,
	});
	return formatter.format(num);
}

export function bestImage(images: Image[]): Image {
	return images.reduce((best, curr) => {
		if (curr.width > best.width) {
			return curr;
		}

		return best;
	}, images[0]);
}

export function removeUndefined<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

function pad(n: number, length: number): string {
	return n.toString().padStart(length, '0');
}

export function formatDuration(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor(seconds / 60) % 60;
	seconds = seconds % 60;

	if (hours != 0) {
		return `${hours}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
	} else {
		return `${minutes}:${pad(seconds, 2)}`;
	}
}

export function removeNumberSuffix(str: string): number {
	let n = parseFloat(str);
	if (str.endsWith('K')) {
		n *= 1000;
	} else if (str.endsWith('M')) {
		n *= 1000000;
	}
	return n;
}

export function parseDuration(duration: string): number {
	return duration.split(':').reduce((prev, curr) => prev * 60 + parseInt(curr), 0);
}
