import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function hello(
    request: VercelRequest,
    response: VercelResponse,
) {
    response.status(200).json({
        body: "Hello!",
        query: request.query,
        cookies: request.cookies,
    });
}