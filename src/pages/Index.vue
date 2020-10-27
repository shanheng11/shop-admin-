<template>
  <div>
    <div id="main" style="width: 600px; height: 400px"></div>
  </div>
</template>
<script>
// import acharts from "echarts";
export default {
  mounted() {
    var myChart =this.$echarts.init(document.getElementById("main"));
    myChart.setOption({
      title: {
        text: "ECharts 入门示例",
      },
      tooltip: {},
      xAxis: {
        data: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期日"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "line",
          data: [5, 20, 36, 10, 10, 20,40],
        },
      ],
    });
  },
};
</script>

<style scoped lang='less'>
</style>