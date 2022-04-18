import { defineNuxtConfig } from 'nuxt3';

import WindPreset from '@unocss/preset-wind';
import IconsPreset from '@unocss/preset-icons';
import AttributifyPreset from '@unocss/preset-attributify';
import DirectivesTransformer from '@unocss/transformer-directives';

export default defineNuxtConfig({
	modules: ['@unocss/nuxt'],
	unocss: {
		// @ts-ignore
		presets: [WindPreset(), IconsPreset(), AttributifyPreset()],
		// @ts-ignore
		transformers: [DirectivesTransformer()],
	},
	css: ['@unocss/reset/tailwind.css'],
});
