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
    let lineCharts = echarts.init(this.$refs.charts)
    // //配置数据
    let option = {
      xAxis: {
        show: false,
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        show: false,
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          //拐点的样式设置
          itemStyle: {
            opacity: 0
          },

        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }
    };
    lineCharts.setOption(option)
  }
}
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>