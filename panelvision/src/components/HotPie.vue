<template>
  <div class="com-container">
    <!-- 相关元素的大小直接在行内进行写，使用computed进行计算监控 -->
    <span class='el-icon-d-arrow-left' @click="turnLeft()" :style="comStyle"></span>
    <span class='el-icon-d-arrow-right' @click="turnRight()" :style="comStyle"></span>
    <div class="com-chart" ref="hot_ref"></div>
    <span class="chart-name" :style="comStyle">{{chartName}}</span>

  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: 0
    }
  },
  computed: {
    chartName () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, 'chalk')
      const initOption = {
        title: {
          text: '▎ 热销商品销售金额占比统计', left: 20, top: 20

        },
        series: [{
          type: 'pie',
          // 将图表文字进行默认隐藏
          label: {
            // 隐藏文字
            show: false
          },
          labelLine: {
            // 隐藏线
            show: false
          },
          emphasis: {
            label: {
              // 高亮显示文字
              show: true
            }
          }
        }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      const { data: res } = await this.$http.get('hotproduct')
      this.allData = res
      this.updateData()
    },
    updateData () {
      //  设置index获取数据，后面进行切换index已达到切换数据
      const seriesData = this.allData[this.currentIndex].children.map(item => {
        return {
          value: item.value,
          name: item.name
        }
      })
      // 图标数据
      const legendData = this.allData[this.currentIndex].children.map(item => {
        return item.name
      })
      const dataOption = {
        legend: { data: legendData },
        series: [
          {
            data: seriesData
          }]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 改变标题/图表各个元素的大小
    screenAdapter () {
      // 获取图表容器的宽度,计算出标题字体大小,
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3
      const adapterOption = {
        title: {
          textStyle: { fontSize: this.titleFontSize }
        },
        series: [
          {
            redius: this.titleFontSize * 4.5
          }
        ],
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: { fontSize: this.titleFontSize / 2 }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 左右切换以改变图表的值
    turnLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateData()
    },
    turnRight () {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateData()
    }
  }
}
</script>

<style lang="less" scoped>
  ::v-deep .el-icon-d-arrow-left{
  z-index:10;
  position: absolute;
  color:#fff;
  left: 10%;
  top: 50%;
  transform:translateY(-50%);
  cursor: pointer;
}
::v-deep .el-icon-d-arrow-right{
  z-index:10;
  position: absolute;
  color:#fff;
  right: 10%;
  top: 50%;
  transform:translateY(-50%);
  cursor: pointer;
}
.chart-name{
position: absolute;
right:20%;
bottom: 20%;
font-weight: bold;
color:#fff;
}
</style>
