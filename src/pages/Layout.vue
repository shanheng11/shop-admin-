<template>
  <div class="layout">
    <el-container class="container">
      <el-aside class="el-aside" width="150px">
          <sidebar></sidebar>
      </el-aside>
      <el-container>
        <el-header class="header"> 
            <myheader :username='username'></myheader>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import myheader from "../components/myheader";
import sidebar from "../components/sidebar";
export default {
  components: {
      myheader,
      sidebar
  },
  computed: {
    username() {
      return this.$store.state.info.username;
    },
  }
};
</script>

<style lang="less">
.layout {
  height: 100%;
  .container {
    height: 100%;
    .header{
        background: #b3c0d1;
        line-height: 60px;
        text-align: right;
    }
    .el-aside{
      color: #333;
      background: #20222a;
    }
    .el-main{
      background: #e5e5e5;
    }

  }
}
</style>