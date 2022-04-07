<template>
  <div class="com-container">
    <div class="title">
      <el-select v-model="dataType" placeholder="请选择" :popper-append-to-body="false">
        <el-option v-for="item in options" :key="item.key" :label="item.text" :value="item.key">
        </el-option>
      </el-select>
    </div>
    <div class="com-chart" ref='trend_ref'>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      dataType: 'map',
      options: null,
      titleFontSize: 0
    }
  },
  // created中注册回调函数
  created () {
    this.$socket.registerCallBack('trendData', this.getData)
  },
  watch: {
    dataType (val, oldval) {
      // 这里值修改后要进行重新update呀！！
      this.updateChart()
    }
  },
  mounted () {
    this.initChart()
    // this.getData()
    // 用socket发送数据给服务器
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    // 在组件销毁的时候, 进行回调函数的取消
    this.$socket.unRegisterCallBack('trendData')
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      const initOption = {
        xAxis: { type: 'category', boundaryGap: false },
        yAxis: { type: 'value' },
        grid: {
          top: '35%', left: '3%', right: '4%', bottom: '1%', containLabel: true
        },
        // 工具：悬浮提示
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '15%',
          left: 20
        },
        backgroundColor: '' // 设置无背景色
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      // 1.获取数据
      const { data: res } = await this.$http.get('trend')
      this.allData = res
      this.options = res.type
      console.log(this.allData.type)
      this.updateChart()
    },
    updateChart () {
      // 5.设置渐变色颜色
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)']
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // 2.处理x/y轴(series)对应数据
      const timeArrs = this.allData.common.month
      console.log(this.allData[this.dataType].data)
      // const valueArrs = this.allData.map.data
      const valueArrs = this.allData[this.dataType].data
      const seriesArr = valueArrs.map((item, index) => {
        return {
          type: 'line', // 折线图
          name: item.name,
          data: item.data,
          // 设置堆叠图效果
          stack: this.dataType,
          // 6.设置背景的渐变色 设置 this.$echarts.graphic.LinearGradient(x1,y1,x2,y2,[设置1,设置2])
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1,
              [
                {
                  offset: 0, color: colorArr1[index]
                }, {
                  offset: 1, color: colorArr2[index]
                }
              ])

          }
        }
      })
      // 4.设置图例数据
      const legendArr = valueArrs.map(item => {
        return item.name
      })
      // 3.定义数据设置
      const dataOption = {
        xAxis: {
          data: timeArrs,
          // 坐标轴是否距离间隔
          boundaryGap: false
        },
        series: seriesArr,
        legend: {
          data: legendArr
        }
      }
      this.chartInstance.setOption(dataOption)
      // console.log(this.allData)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: { fontSize: this.titleFontSize / 2 }

        }

      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang='less' scoped>
</style>
