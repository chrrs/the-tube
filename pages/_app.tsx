import type { AppProps } from 'next/app';
import { globalCss } from '@stitches/react';
import tw, { globalStyles } from 'twin.macro';
import Header from '~/components/Header';
import NextNProgress from 'nextjs-progressbar';

import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';

const AppWrapper = tw.div`bg-gray-50 min-h-screen`;

function MyApp({ Component, pageProps }: AppProps) {
	globalCss(globalStyles as Record<any, any>)();
	globalCss({ '*:focus': { outline: 'none' } })();

	return (
		<AppWrapper>
			<NextNProgress />
			<Header />
			<Component {...pageProps} />
		</AppWrapper>
	);
}

export default MyApp;
