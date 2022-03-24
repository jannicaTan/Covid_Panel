// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

// 使用vue-cli创建出来的vue工程, Webpack的配置是被隐藏起来了的
// 如果想覆盖Webpack中的默认配置,需要在项目的根路径下增加vue.config.js文件
module.exports = {
  lintOnSave: false,
  devServer: {
    host: 'localhost',
    port: 8999, // 端口号的配置
    open: true // 自动打开浏览器
  }
}
