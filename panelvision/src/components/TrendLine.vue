<template>
  <div class="com-container">
    <el-select v-model="label" class="com-select">
      <!-- <el-option :label="" :value=""></el-option> -->
      <el-option v-for="item in selectTypes" :key="item.key" :value="item.key" :label="item.text">
      </el-option>
    </el-select>
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
      dataType: 'map'
    }
  },
  computed: {
    selectTypes () {
      if (!this.allData || !this.allData.type) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.dataType
        })
      }
    }
    // title () {
    //   if (!this.allData) {
    //     return ''
    //   } else {
    //     return this.allData[this.dataType].title
    //   }
    // }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
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
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      // 1.获取数据
      const { data: res } = await this.$http.get('trend')
      this.allData = res
      console.log(this.allData)
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
      const valueArrs = this.allData.map.data
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
    },
    screenAdapter () {
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang='less' scoped>
.com-select{
  height: 200px;
}
</style>
