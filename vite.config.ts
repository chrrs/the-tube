import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import unocss from '@unocss/vite';
import mix, { vercelAdapter } from 'vite-plugin-mix';

import WindPreset from '@unocss/preset-wind';
import AttributifyPreset from '@unocss/preset-attributify';
import IconsPreset from '@unocss/preset-icons';

export default defineConfig({
	plugins: [
		unocss({ presets: [WindPreset(), AttributifyPreset(), IconsPreset()] }),
		vue(),
		mix({
			handler: './src/api/handler.ts',
			adapter: vercelAdapter(),
		}),
	],
});
