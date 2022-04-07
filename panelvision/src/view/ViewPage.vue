<template>
  <div class="screen-container">
    <header>
      <h1>电商平台实时监控系统</h1>
      <div class="showTime">
        {{newTime}}
      </div>
    </header>
    <div class="screen-body">
      <div class="screen-left column">
        <div id="left-top"  :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <!-- 销量趋势图表 -->
          <TrendLine ref='trend'></TrendLine>
          <div class="resize">
            <span class='el-icon-full-screen' @click="changeSize('trend')"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
          <!-- 商家销售金额图表 -->
          <SellerBar ref='seller'></SellerBar>
          <div class="resize">
            <span class='el-icon-full-screen' @click="changeSize('seller')"></span>
          </div>
        </div>
      </div>
      <div class="screen-mid column">
        <div id="middle-top" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <!-- 地区销量排行图表 -->
          <RankLine ref='rank'></RankLine>
          <div class="resize">
            <span class='el-icon-full-screen' @click="changeSize('rank')"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
          <!-- 商家分布图表 -->
          <MapChina ref='map'></MapChina>
          <div class="resize">
            <span class='el-icon-full-screen' @click="changeSize('map')"></span>
          </div>
        </div>
      </div>
      <div class="screen-right column">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
          <HotPie ref='hot'></HotPie>
          <div class="resize">
            <span class='el-icon-full-screen' @click="changeSize('hot')"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <!-- 库存销量分析图表 -->
          <StockPie ref='stock'></StockPie>
          <div class="resize">
            <span class='el-icon-full-screen' @click="changeSize('stock')"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HotPie from '@/components/HotPie'
import MapChina from '@/components/MapChina'
import RankLine from '@/components/RankLine'
import SellerBar from '@/components/SellerBar'
import StockPie from '@/components/StockPie'
import TrendLine from '@/components/TrendLine'
let interval
export default {
  data () {
    return {
      year: null,
      month: null,
      date: null,
      hour: null,
      min: null,
      sec: null,
      fullScreenStatus: { trend: false, seller: false, map: false, rank: false, hot: false, stock: false }
    }
  },
  components: {
    HotPie,
    MapChina,
    RankLine,
    SellerBar,
    StockPie,
    TrendLine
  },
  created () {
    interval = setInterval(() => {
      const dt = new Date()
      this.year = dt.getFullYear()
      this.month = dt.getMonth() + 1
      this.date = dt.getDate()
      this.hour = dt.getHours()
      this.min = dt.getMinutes()
      this.sec = dt.getSeconds()
    }, 1000)
    // 注册全屏的回调函数
    this.$socket.registerCallBack('fullScreen', this.recvData)
  },
  computed: {
    newTime: function () {
      return '当前时间为:' + this.year + '年' + this.month + '月' + this.date + '日' + this.hour + '时' +
        this.min + '分' + this.sec + '秒'
    }
  },
  beforeDestroy () {
    clearInterval(interval)
  },
  // 消除获取数据的回调函数
  destroyed () {
    this.$socket.unRegisterCallBack('fullScreen')
  },
  methods: {
    changeSize (chartName) {
      // 先得到目标状态
      const targetValue = !this.fullScreenStatus[chartName]
      // // 设全部为非全屏
      // Object.keys(this.fullScreenStatus).forEach(item => {
      //   this.fullScreenStatus[item] = false
      // })
      // // 设独立为全屏
      // this.fullScreenStatus[chartName] = targetValue
      // // 设置个延迟
      // this.$nextTick(() => {
      //   this.$refs[chartName].screenAdapter()
      // })
      this.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: chartName,
        value: targetValue
      })
    },
    recvData (data) {
      // 设全部为非全屏
      Object.keys(this.fullScreenStatus).forEach(item => {
        this.fullScreenStatus[item] = false
      })
      // 设独立为全屏
      this.fullScreenStatus[data.chartName] = data.targetValue
    }
  }
}
</script>

<style lang="less" scoped>
* {
    // 初始化
    margin: 0;
    padding: 0;
    box-sizing: border-box;

}
.screen-container {
  position:fixed;
  width: 100%;
  height: 100%;
  min-width: 800px;
  background: url(../../public/static/img/bg.jpg) no-repeat top center;
  line-height: 1.15;
}
header {
    position: relative;
    height: 1.25rem;
    background: url(../../public/static/img/head_bg.png) no-repeat;
    background-size: 100% 100%;
    h1 {
        font-size: .475rem;
        padding-top: .25rem;
        text-align: center;
        line-height: .375rem;
        color: aliceblue;
    }
    .showTime {
        position: absolute;
        right: .125rem;
        top: 30px;
        line-height: .375rem;
        color: rgba(255, 255, 255, 0.7);
        font-size: .25rem;
    }
}
// flex布局
.screen-body{
  height:100%;
  overflow: hidden;
  display:flex;
  flex:1;
  .screen-mid{
    flex:1;
    max-width: 50%;
    min-width: 40%;
    margin:0 .25rem
  }
  .screen-left,.screen-right{
    flex:1;
    min-width:10%;
  }
}
#left-top { height: 40%; position: relative;}
#left-bottom {height: 45%;margin-top:.25rem;position: relative;}
#middle-top {width: 100%;height: 30%; position: relative;}
#middle-bottom {width: 100%;height: 50%; margin-top:.25rem;position: relative;}
#right-top {height: 40%; position: relative;}
#right-bottom {height: 50%; margin-top:.25rem;position: relative;}

.resize {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer; }
// 缩放样式
.fullscreen {
  position: fixed!important;
  background: url(../../public/static/img/bg.jpg) no-repeat;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

</style>
