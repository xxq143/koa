const   Koa = require('koa'), // 引入koa
        fs = require('fs'),   // 操作文件
        path = require('path'), //路径管理
        staticServer = require('koa-static'), //静态文件处理
        bodyParser = require('koa-bodyparser'), // 处理post请求
        router = require('koa-router')(), // 引入koa-router 处理url
        cors = require('koa2-cors'),    // cors跨域处理
        websockify  = require ('koa-websocket'), // websocke及时通讯
        sha1 = require('sha1'); //微信token使用
        // 微信token配置
const   config = {
            wechat: {
              appID: 'wx813d10758ed9cad8', //公众号里面取
              AppSecret: '73213b345a0b06523d32f354ed577e70', //公众号里面取
              token: 'xiaoxianqi' //自定义的token
            }
        };
const   app = websockify(new Koa());  // 生成实例,同时引入webSokect
const   ctxs = [];    // 初始化websocket接入成员
const   port = 3000;    // 接听端口

//解析post请求
app.use(bodyParser()); 

// 静态文件  git先不上传static
const staticPath = 'static'
app.use(staticServer(
    path.join(__dirname,staticPath)
));




// cors 设置跨域 start
app.use(cors({
    origin: function(ctx) {
        // if(ctx.url == '/login') {
        //     return '*';
        // }
        return 'http://localhost:8080';
        // return 'http://www.xiaoxianqi.online';     //上线后使用
        // return 'http://47.92.37.9';       // ip地址
    },
    maxAge: 5, // 指定本次预检请求的有效期，单位为秒。
    credentials: true, // 是否允许发送Cookie
    allowMethods: ['GET', 'POST'], // 设置所允许的HTTP请求方法, 'PUT', 'DELETE', 'OPTIONS'
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], // 设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] // 设置获取其他自定义字段
}));
// cors 设置跨域 end

// 测试  微信token的验证 start
app.use( async(ctx, next) => {
    // console.log(`ctx>>>>${JSON.stringify(ctx)}`);
    // console.log(`this>>>>${JSON.stringify(this)}`);
    // console.log(`query>>>${this.query}`);
    // const token = config.wechat.token;
    // const signature = this.query.signature;
    // const nonce = this.query.nonce;
    // const timestamp = this.query.timestamp;
    // const echostr = this.query.echostr;
    // let str = [token, timestamp, nonce].sort().join('');
    // let sha = sha1(str);
    // console.log(sha, signature);
    // if(sha == signature){
    //     ctx.body = echostr;
    // } else {
    //     ctx.body = 'wrong';
    // }
    await next();
})
// 测试  微信token的验证 end

// 引入js文件(routes)
const files = fs.readdirSync(__dirname+'/controller');
const js_files = files.filter( f => {
    return f.endsWith('.js');
});
// console.log('js_files>>>'+js_files)
for( let f of js_files ) {
    let routes = require(__dirname+'/controller/'+f);
    // 注册每个模块中导出的所有路由
    for (var url in routes) {
        if (url.startsWith('GET')) {
            let path = url.substring(4);
            router.get(path, routes[url]);
            console.log(`register URL routes GET: ${path}`);
        }else if(url.startsWith('POST')) {
            let path = url.substring(5);
            router.post(path, routes[url]);
            console.log(`register URL routes POST: ${path}`);
        }else{
            console.log('url无效');
        }
    }
};

// websoket   start
app.ws.use( async(ctx, next) => {
    return next(ctx);
});
app.ws.use((ctx) => {
    ctxs.push(ctx);     // 将新的连接添加至数组
    if( ctxs.length == 1 ) {
        ctx.websocket.send('空空如也的聊天室');
    }
    // 监听客户端发送的数据,将新连接的成员添加至聊天室
    ctx.websocket.on('message', (message) => {
        console.log(`messageID>>>${JSON.parse(message).id}`);
        console.log(`messageMSG>>>${JSON.parse(message).message}`);
        console.log(`messageMSG>>>${JSON.parse(message).name}`);
        let msg = JSON.parse(message);
        for( let i=0; i<ctxs.length; i++) {
            if( ctx == ctxs[i]) {
                continue;   // 如果是自己发送的消息就不返回
            }else{
                ctxs[i].websocket.send(`用户${msg.name},发送:${msg.message}`); // 返回出自己外所有成员发送的消息
            }
        }
    });
    // 监听关闭窗口,从聊天室中移除退出成员
    ctx.websocket.on('close', () => {
        let index = ctxs.indexOf(ctx);
        ctxs.splice(index,1);   // 移除退出成员
        console.log(`${JSON.stringify(ctx)}>>>退出`);

    })
});
// websoket   end

//注册路由
app.use(router.routes());

// 监听开启服务
app.listen(port, () => {
    console.log(`app started at port ${port}...`);
});
