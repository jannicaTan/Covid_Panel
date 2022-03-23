<template>
  <div class="com-container">
    <div class="com-chart" ref='seller_ref'>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null, // echarts实例对象
      allData: []
    }
  },
  mounted () {
    this.initChart()
    this.getData()
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
    },
    async getData () {
      // 通过this.$http.get() 引入axios
      const { data: res } = await this.$http.get('seller')
      this.allData = res
      this.updateChart()
    },
    updateChart () {
      // 处理数据并且更新界面图表
      const sellerNames = this.allData.map((item) => { return item.name })
      const sellerValues = this.allData.map((item) => { return item.value })
      const option = {
        xAxis: { type: 'value' },
        yAxis: { type: 'category', data: sellerNames },
        series: [{ type: 'bar', data: sellerValues }]

      }
      this.chartInstance.setOption(option)
    }
  }
}
</script>

<style>

</style>
