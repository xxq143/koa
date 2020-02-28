// 用户登录
let login = async (ctx, next) => {
    console.log('>>>>>>>>'+JSON.stringify(ctx.request.body));   //获取参数
    console.log(`路由名称>>>${JSON.stringify(ctx.params)}`);    //路由后缀
    let 
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || ''
    if( name && password ) {
        ctx.response.status = 200;
        ctx.response.body = {
            code: 'success',
            data: {
                name: name,
                password: password
            }
        }
    }else{
        ctx.response.status = 200;
        ctx.response.body = {
            code: 'fail',
            data: '账号或密码错误'
        }
    }
};

//用户注册
let register = async (ctx, next) => {
    let 
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
        console.log(`注册账号:${name}`);
        console.log(`注册密码:${password}`);
    ctx.response.body = {
        code: 'success',
        data: '请求成功'
    }
};

//到处路由对应的函数
module.exports = {
    'POST /login': login,
    'POST /register': register
}