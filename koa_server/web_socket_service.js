const WebSocket=require('ws')
const wss=new WebSocket.Server({
  port:9998
})
// 监听Websocket并导出
module.exports.listen=function(){
  wss.on('connection',ws=>{
    console.log("有客户端连接...")
    wa.on('message',msg=>{
      console.log("客户端发送数据过来了")
    })
  })
}