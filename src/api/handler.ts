import { Handler } from 'vite-plugin-mix';

export const handler: Handler = (req, res, next) => {
	if (req.path === '/api/hello') {
		return res.end('hello');
	}

	next();
};
