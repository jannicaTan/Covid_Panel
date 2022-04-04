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
app.listen(8888)


const webSocketService=require('./service/web_socket_service')
webSocketService.listen()
