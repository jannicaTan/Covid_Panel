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
      allData: null
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
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk')
      const initOption = {
        xAxis: { type: 'category' }, yAxis: { type: 'value' }, series: [{ type: 'bar' }]
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      const { data: res } = await this.$http.get('rank')
      this.allData = res
      console.log(this.allData)
      this.updateData()
    },
    updateData () {
      const dataOption = {}
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

<style>
</style>
