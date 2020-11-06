<template>
  <div class="index-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="row-item">
          <el-row>
            <!-- <el-col :span="24">商品总览</el-col> -->
          </el-row>
          <el-row  class="goods-item">
            <el-col  :md="6" :sm="12">
                <div>100</div>
                <p>已下架</p>
            </el-col>
            <el-col  :md="6" :sm="12"><div>400</div><p>已上架</p></el-col>
             <el-col  :md="6" :sm="12"><div>400</div><p>已上架</p></el-col>
             <el-col  :md="6" :sm="12"><div>400</div><p>已上架</p></el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="row-item">
          <el-row>
            <el-col :span="24">用户总览</el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
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
        // text: "ECharts",
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

<style lang="less">
.index-container {
  width: 80%;
  margin: 0 auto;
  .row-item {
    border: 1px solid #000;
    text-align: center;
  }
}
</style>