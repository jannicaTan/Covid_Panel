export default class SocketService {
  // 1.单例设计模式建立实例
  static instance =null
  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  ws = null
  // 标识是否连接成功
  connected = false
  // 记录重试的次数
  sendRetryCount = 0
  // 重新连接尝试的次数
  connectRetryCount = 0

  // 2.创建webSocket属性并连接监听事件
  connect () {
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持 WebSocket!')
    }
    this.ws = new WebSocket('ws://localhost:9998')
    // 监听事件：onopen/onclose/onmessage
    this.ws.onopen = () => {
      console.log('WebSocket 连接成功')
      this.connected = true
      this.connectRetryCount = 0
    }
    this.ws.close = e => {
      console.log('关闭服务器')
      // 这里优化！！设置延迟应对连接成功后服务器关闭的情况
      this.connected = false
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, 500 * this.connectRetryCount)
    }
    this.ws.onmessage = msg => {
      console.log('WebSocket 接收到数据')
      // msg为接受的数据
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      // 判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, recvData)
        } else if (action === 'themeChange') {
          this.callBackMapping[socketType].call(this, recvData)
        }
      }
    }
  }

  // 不太明白 ??
  // 3.调用回调函数：
  callBackMapping = {}
  registerCallBack (socketType, callBack) {
    // 往 callBackMap中存放回调函数
    this.callBackMapping[socketType] = callBack
  }

  unRegisterCallBack (socketType) { this.callBackMapping[socketType] = null }

  // 4.管理发送给后端的数据：
  send (data) {
    // 判断此时此刻有没有连接成功
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, this.sendRetryCount * 500)
    }
  }
}
