<template>
  <div class="com-container">
    <div class="com-chart" ref='stork_ref'></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      timerId: null,
      titleFontSize: 0
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
    clearInterval(this.timerId)
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.stork_ref, 'chalk')
      const centerPointers = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const initChart = {
        title: { text: '▎ 库存销售量', left: 20, top: 20 },
        series: [
          {
            type: 'pie',
            center: centerPointers[0],
            hoverAnimation: false,
            label: { show: true, position: 'center' },
            labelLine: { show: false }
          },
          {
            type: 'pie',
            center: centerPointers[1],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: { show: false }
          }, {
            type: 'pie',
            center: centerPointers[2],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: { show: false }
          },
          {
            type: 'pie',
            center: centerPointers[3],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: { show: false }
          },
          {
            type: 'pie',
            center: centerPointers[4],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: { show: false }
          }
        ]
      }
      this.chartInstance.setOption(initChart)
    },
    async getData () {
      const { data: res } = await this.$http.get('stock')
      this.allData = res
      console.log(this.allData)
      // 这里不要忘记更新数据
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      // 一次十个放不下 先放5个
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)
      // 5个圆环对应的圆心点[横坐标，纵坐标]
      const centerPointers = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      // 设置圆环颜色
      const colorArrs = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          // 饼图的圆心坐标
          center: centerPointers[index],
          // 环形图[内半径，外半径]
          radius: [110, 100],
          data: [
            {
              name: item.name + '\n\n' + item.sales,
              value: item.sales,
              itemStyle: {
                // 渐变色修改
                color: {
                  // 渐变种类：横向渐变
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: colorArrs[index][0] // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: colorArrs[index][1] // 100% 处的颜色
                    }
                  ]
                }
              }
            },
            {
              value: item.stock,
              itemStyle: { color: '#333843' }
            }

          ],
          // label放中间
          label: {
            show: true,
            position: 'center',
            color: colorArrs[index][0]
          },
          // 鼠标动画&指示线的移除
          hoverAnimation: false,
          labelLine: {
            show: false
          }
        }
      })
      const dataChart = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataChart)
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        // 记得更新图表！
        this.updateChart()
      }, 5000)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.stork_ref.offsetWidth / 100 * 3
      const innerRadius = this.titleFontSize * 2
      const outRadius = innerRadius * 1.125
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        // 这里能不能简洁一些
        series: [
          // 注意：几个图就要优化几遍
          {
            radius: [innerRadius, outRadius],
            label: {
              fontSize: this.titleFontSize / 2
            }
          },
          {
            radius: [innerRadius, outRadius],
            label: {
              fontSize: this.titleFontSize / 2
            }
          },
          {
            radius: [innerRadius, outRadius],
            label: {
              fontSize: this.titleFontSize / 2
            }
          },
          {
            radius: [innerRadius, outRadius],
            label: {
              fontSize: this.titleFontSize / 2
            }
          },
          {
            radius: [innerRadius, outRadius],
            label: {
              fontSize: this.titleFontSize / 2
            }
          }]

      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }

  }
}
</script>

<style>

</style>
