const WebSocket = require('ws')
// 1.创建对象——require
const Koa=require('koa')
const app=new Koa()

// 2.响应函数——app.use(ctx,next)
// 2-1 第一层:总耗时中间件
const respDuration =  require('./middleware/koa_response_duration')
app.use(respDuration)
// 2-2 第二层
const respHeader=require('./middleware/koa_response_header')
app.use(respHeader)
// 2-3 第三层
const  respData =require('./middleware/koa_response_data')
app.use(respData)
// 3.指明端口号——app.listen
// app.listen(8888)

// 将koa和websoket端口合并：https://github.com/w3cways/w3cways
const webSocketService=require('./service/web_socket_service')
var server = require("http").createServer(app.callback());
const wss = new WebSocket.Server({// 同一个端口监听不同的服务
  server
});
webSocketService(wss)

// webSocketService.listen()
server.listen(9998)
console.log("服务启动成功，端口号:9998 ")