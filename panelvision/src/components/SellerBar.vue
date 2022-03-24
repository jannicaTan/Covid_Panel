<template>
  <div class="com-container">
    <!-- <div class="pageNumber">
      {{currentPage}}-------{{totalPage}}
    </div> -->
    <div class="com-chart" ref='seller_ref'>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null, // echarts实例对象
      allData: [],
      currentPage: 1,
      totalPage: 0,
      timeId: null
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    // 在界面姐在完成时进行适配屏幕
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timerId)
    // 在组件销毁的时候, 需要将监听器取消掉
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 1.初始化图表
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timeId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval(this.timeId)
      })
      const initOption = {
        // 标题设置
        title: {
          text: '| 商家排行',
          left: 50,
          top: 50,
          textStyle: {
            color: '#fff'
          }
        },
        // 图表位置
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        // 柱状图内具体设置
        series: [
          {
            type: 'bar',
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            // 柱状修改
            itemStyle: {
              // 柱状圆角
              barBorderRadius: [0, 33, 33, 0],
              // 渐变色修改
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: '#5052EE' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#AB6EE5' // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              }
            },
            label: {
              show: true,
              position: 'right',
              textStyle: { color: '#fff' }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 2.获取数据
    async getData () {
      // 通过this.$http.get() 引入axios
      const { data: res } = await this.$http.get('seller')
      this.allData = res
      // 将data排序
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      this.updateChart()
      this.startInterval()
    },
    // 3.更新图表数据
    updateChart () {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      // 展示分割后的data
      const showData = this.allData.slice(start, end)
      // 处理数据并且更新界面图表
      const sellerNames = showData.map((item) => { return item.name })
      const sellerValues = showData.map((item) => { return item.value })
      // 单纯的data设置
      const dataOption = {
        xAxis: {
          // 固定x轴max
          max: this.allData[this.allData.length - 1].value
        },
        yAxis: {
          data: sellerNames
        },
        // 柱状图内具体设置
        series: [
          {
            data: sellerValues
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 实时变换定时器
    startInterval () {
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        // 这里要记得更新图
        this.updateChart()
      }, 3000)
    },
    screenAdapter () {
      // 获取宽度 并设置标题大小设置3.6是本次合适的值,不统一
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      // 和分辨率大小相关的配置项option
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize()
    }
  }

}
</script>

<style>

</style>
