// 读取文件
const fs =require('fs')
module.exports.getFileJsonData=(filePath)=>{
  // 使用Promise，读取文件的内容进行返回，不可以用return
  return new Promise((reslove,reject)=>{
    fs.readFile(filePath,'utf-8',(error,data)=>{
      if(error){
        reject(error)
      }else{
        reslove(data)
      }
    })
  })
  
}