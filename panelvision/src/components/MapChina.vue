<template>
  <div class="com-container" @dblclick="returnMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null
    }
  },
  created () {
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map'
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('mapData')
  },
  methods: {
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')
      const { data: mapData } = await axios.get('http://localhost:8999/static/map/china.json')
      this.$echarts.registerMap('china', mapData)
      const initOption = {
        title: { text: '▎ 商家分布', left: 20, top: 20 },
        backgroundColor: '', // 设置无背景色
        // 地图效果
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: { areaColor: '#2E72BF', borderColor: '#333' }
        },
        // 图例
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async arg => {
        const provinceInfo = getProvinceMapInfo(arg.name)
        const { data: res } = await axios.get('http://localhost:8999' + provinceInfo.path)
        this.$echarts.registerMap(provinceInfo.key, res)
        this.chartInstance.setOption({
          geo: {
            map: provinceInfo.key
          }
        })
      })
    },
    async getData () {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: ret } = await this.$http.get('map')
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      // 图标
      const legendData = this.allData.map(item => {
        return item.name
      })
      // 散点图数据
      const seriesArr = this.allData.map(item => {
        console.log(item.name)
        return {
          // UI 涟漪效果
          type: 'effectScatter',
          rippleEffect: { scale: 5, brushType: 'stroke' },
          coordinateSystem: 'geo',
          name: item.name,
          data: item.children,
          // 设置散点颜色
          itemStyle: {
            color: function (arg) {
              if (arg.seriesName === '黄金用户') {
                return 'yellow'
              } else if (arg.seriesName === '白金用户') {
                return 'blue'
              } else if (arg.seriesName === '砖石用户') {
                return 'red'
              }
            }
          }
        }
      })
      const dataOption = {
        legend: {
          data: legendData
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: { textStyle: { fontSize: titleFontSize } },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: { fontSize: titleFontSize / 2 }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    returnMap () {
      const returnOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(returnOption)
    }
  }

}
</script>

<style>

</style>
