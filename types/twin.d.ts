import 'twin.macro';
import { css as cssImport } from '@stitches/react';
import styledImport from '@stitches/react';

type CSSProp<T = AnyIfEmpty<DefaultTheme>> = string | CSSObject;

declare module 'react' {
	interface HTMLAttributes<T> extends DOMAttributes<T> {
		css?: CSSProp;
		tw?: string;
	}

	interface SVGProps<T> extends SVGProps<SVGSVGElement> {
		css?: CSSProp;
		tw?: string;
	}
}

type StyledTags = {
	[Tag in keyof JSX.IntrinsicElements]: CreateStyledComponent<JSX.IntrinsicElements[Tag]>;
};

declare module 'twin.macro' {
	const styled: typeof StyledTags | typeof styledImport;
	const css: typeof cssImport;
}
