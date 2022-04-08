// 业务逻辑中间件
const fileUtils=require('../utils/file_utils')
const path=require('path')
module.exports = async (ctx, next) => {
  // url重新整合
  const url = ctx.request.url // 调用接口的url：/api/sell
  let filePath = url.replace('/api', '')
  filePath = '../data' + filePath + '.json'
  //url整合
  filePath = path.join(__dirname, filePath)//引入path模块
  try{
    const respData=await fileUtils.getFileJsonData(filePath)
    ctx.response.body=respData
  }catch(error){
    const errorMsg={
      message:'failed',
      status:404
    }
    ctx.response.body=JSON.stringify(errorMsg)
  }
  await next()
}