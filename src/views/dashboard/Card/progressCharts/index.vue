<template>
  <div class="charts" ref="charts">

  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: '',
  mounted() {
    //初始化echarts实例
    let barCharts = echarts.init(this.$refs.charts)
    // //配置数据
    let option = {
      xAxis: {
        type: 'value',
        max: 100,
        min: 0,

      },
      yAxis: {
        type: 'category',
        show: false,
      },
      series: [
        {
          data: [78],
          type: 'bar',
          barWidth: 10
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }
    };
    barCharts.setOption(option)
  }
}
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>