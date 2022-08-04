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
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
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