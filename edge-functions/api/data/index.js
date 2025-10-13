export async function onRequest(context) {
    try {
        const { request, env } = context;

        // 从kv中获取书签数据
        const bookmarkData = await KV_DEFAULT.get('bookmarkData');

        let headers = {
            'Content-Type': 'application/json',
            'cache-control': 'no-cache'
        };

        if (env.CORS_ORIGIN) {
            // 设置CORS头
            headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': `${env.CORS_ORIGIN}`,
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            };
        }

        // 处理OPTIONS请求
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 200, headers });
        }

        // 返回书签数据
        return new Response(bookmarkData, {
            status: 200,
            headers
        });
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
