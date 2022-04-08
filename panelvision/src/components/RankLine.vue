<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0,
      endValue: 9,
      timerId: 0
    }
  },
  created () {
    this.$socket.registerCallBack('rankData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank'
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
    this.$socket.unRegisterCallBack('rankData')
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk')
      const initOption = {
        xAxis: { type: 'category' },
        yAxis: { type: 'value' },
        series: [{ type: 'bar' }],
        title: { text: '▎ 地区销售排行', left: 20, top: 20 },
        grid: { top: '30%', left: '5%', right: '5%', bottom: '10%', containLabel: true },
        tooltip: { show: true },
        backgroundColor: '' // 设置无背景色
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => { clearInterval(this.timerId) })
      this.chartInstance.on('mouseout', () => { this.startInterval() })
    },
    async getData () {
      const { data: res } = await this.$http.get('rank')
      this.allData = res
      // 将数据进行排序
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      this.updateData()
      this.startInterval()
    },
    updateData () {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      // 读值
      const nameArr = this.allData.map((item) => {
        return item.name
      })
      const valueArr = this.allData.map((item) => {
        return item.value
      })
      const dataOption = {
        xAxis: {
          data: nameArr
        },
        // 4.数据滑动展示dataZoom
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: {
          data: valueArr,
          // 3.UI变化:设置条形图渐变色,arg是形参,打印后arg.value对应每一个柱子的数值
          color: arg => {
            let targetColorArr = colorArr[0]
            if (arg.value > 300) {
              targetColorArr = colorArr[0]
            } else if (arg.value >= 200) {
              targetColorArr = colorArr[1]
            } else {
              targetColorArr = colorArr[2]
            }
            return {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: targetColorArr[0] // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: targetColorArr[1] // 100% 处的颜色
                }
              ]
            }
          }
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval () {
      this.timerId = setInterval(() => {
        // 缺陷：如何定位能让他无缝轮播呢？？
        // if (this.endValue > this.allData.length - 1) {
        //   console.log('1', this.startValue, this.endValue)
        //   this.startValue++
        //   this.endValue = 0
        //   console.log('2', this.startValue, this.endValue)
        // }
        // if (this.startValue > this.allData.length - 1) {
        //   console.log('3', this.startValue, this.endValue)
        //   this.endValue++
        //   this.startValue = 0
        //   console.log('4', this.startValue, this.endValue)
        // }
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.startValue++
        this.endValue++
        this.updateData()
      }, 2000)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: { textStyle: { fontSize: titleFontSize } },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: { barBorderRadius: [0.5 * titleFontSize, 0.5 * titleFontSize, 0, 0] }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style>
</style>
