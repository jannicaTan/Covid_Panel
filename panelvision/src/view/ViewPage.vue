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
        <div id="left-top">
          <!-- 销量趋势图表 -->
          <TrendLine></TrendLine>
        </div>
        <div id="left-bottom">
          <!-- 商家销售金额图表 -->
          <SellerBar></SellerBar>
        </div>
      </div>
      <div class="screen-mid column">
        <div id="middle-top">
          <!-- 地区销量排行图表 -->
          <RankLine></RankLine>
        </div>
        <div id="middle-bottom">
          <!-- 商家分布图表 -->
          <MapChina></MapChina>
        </div>
      </div>
      <div class="screen-right column">
        <div id="right-top">
          <!-- 热销商品占比图表 -->
          <HotPie></HotPie>
        </div>
        <div id="right-bottom">
          <!-- 库存销量分析图表 -->
          <StockPie></StockPie>
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
      sec: null
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
  methods: {

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
.screen-body{
  width: 100%;
  height: 100%;
  display: flex;
  .column {
    flex: 3;
    margin:.25rem .125rem
  }
  .column:nth-child(2) {
    flex: 4;
    overflow: hidden;
    }
}
#left-top { height: 40%; }
#left-bottom { height: 40%;margin-top:.25rem}
#middle-top {width: 100%;height: 40%; }
#middle-bottom {width: 100%;height: 50%; }
#right-top {height: 40%; }
#right-bottom {height: 50%; margin-top:.25rem}

</style>
