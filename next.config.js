/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	webpack: (config) => {
		// TODO: This should be removed. Works around twin.macro issue #608.
		config.resolve.preferRelative = true;
		return config;
	},
};
