import NextDocument, {
	DocumentContext,
	DocumentInitialProps,
	Head,
	Html,
	Main,
	NextScript,
} from 'next/document';
import { getCssText } from '~/stitches.config';

export default class Document extends NextDocument {
	static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
		const initialProps = await NextDocument.getInitialProps(ctx);

		return {
			...initialProps,
			// @ts-ignore
			styles: (
				<>
					{initialProps.styles}
					<style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
				</>
			),
		};
	}

	render() {
		return (
			<Html>
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
