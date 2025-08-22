export async function onRequest(context) {
    const { request, env } = context;

    // 从kv中获取书签数据
    const bookmarkData = await KvData.get('bookmarkData');

    let headers = {
        'Content-Type': 'application/json'
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
    return new Response(JSON.stringify(bookmarkData), {
        status: 200,
        headers
    });
}
