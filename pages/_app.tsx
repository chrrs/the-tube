import type { AppProps } from 'next/app';
import { globalCss } from '@stitches/react';
import tw, { globalStyles, styled } from 'twin.macro';
import Header from '~/components/Header';
import NextNProgress from 'nextjs-progressbar';

const AppWrapper = styled.div({
	...tw`bg-gray-50 min-h-screen`,
});

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
