const user = async (ctx, next) => {
    console.log(`url>>>>${JSON.stringify(ctx.request.url)}`);     //路由名称
    console.log(ctx.params) // 获取子路由名称
    ctx.response.status = 200;  //返回的状态码
    switch( ctx.params.id ) {
        case 'test':
           if( ctx.request.query.name ) {
            ctx.response.body = `<h1>test路由下返回>>>,${JSON.stringify(ctx.request.query.name)}</h1>`;  //返回结果
            }else{
                ctx.response.body = `<h1>test路由下返回>>>未传递指定参数参数>>>'name'</h1>`;  //返回结果
            };
            break;
        case 'test2':
            ctx.response.body = 'test22222222222';
            break;
        default:
             if( ctx.request.query.name ) {
            ctx.response.body = `<h1>${JSON.stringify(ctx.request.query.name)}</h1>`;  //返回结果
            }else{
                ctx.response.body = `<h1>未传递指定参数参数>>>'name'</h1>`;  //返回结果
        
            };
            break;
    }
};

module.exports = {
    'GET /user': user,
    'GET /user/:id': user
}