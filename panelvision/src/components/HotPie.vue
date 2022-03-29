<template>
  <div class="com-container">
    {{allData}}
    <div class="com-chart" ref="hot_ref"></div>
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
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref)
      const initOption = {

      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      const { data: res } = await this.$http.get('hotproduct')
      this.allData = res
      console.log(this.allData)
      this.updateData()
    },
    updateData () {
      const dataOption = {

      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {

    }
  }
}
</script>

<style>

</style>
