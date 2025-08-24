export async function onRequest(context) {
    const { request, env } = context;

    const PASSWORD = env.PASSWORD;
    if (PASSWORD) {
        console.log(`检测到密码: ${PASSWORD}`);
        let AuthPassword = request.query.get('password');
        AuthPassword = decodeURIComponent(AuthPassword);
        if (AuthPassword !== PASSWORD) {
            return new Response(JSON.stringify({ "error": "密码错误" }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
    
    try {
        // 把请求体中的书签数据验证为JSON格式后存储到kv中
        const body = await request.json();
        const bookmarkData = JSON.stringify(body);
        await KvData.put('bookmarkData', bookmarkData);
        // 返回成功响应
        return new Response(JSON.stringify({ "success": true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    catch (error) {
        // 返回错误响应
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
