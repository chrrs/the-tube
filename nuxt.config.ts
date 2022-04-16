import { defineNuxtConfig } from 'nuxt3';

export default defineNuxtConfig({
	modules: ['@unocss/nuxt'],
	unocss: {
		wind: true,
		icons: true,
		attributify: true,
	},
	css: ['@unocss/reset/tailwind.css'],
});
