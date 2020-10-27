<template>
  <el-menu background-color="#20222A" 
  unique-opened
  :default-active='$route.path'>
    <h2>管理员管理</h2>
    <el-menu-item>
      <i class="el-icon-s-home"></i>
      <router-link to="/index">首页</router-link>
    </el-menu-item>
    <el-submenu v-for="(menu, index) in menus" :key="index" :index="(index+1).toString()">
      <template slot="title">
        <i :class="menu.icon"></i>
        <span>{{ menu.title }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          v-for="(item, index) in menu.children"
          :key="index"
          :index="item.url"
        >
          <i :class="item.icon"></i>
          <router-link :to="item.url">{{ item.title }}</router-link>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
export default {
  mounted() {
    // console.log(this.menus)
  },
  computed: {
    menus() {
      return this.$store.state.info.menus;
    },
  },
};
</script>
<style lang="less" scoped>
.el-menu {
  overflow-x: hidden;
  h2{
    color: #fff;
    margin: 20px auto;
    font-size: 16px;
    text-align: center;
  }
  a {
    color: #fff;
    text-decoration: none;
  }
  .el-submenu__title span {
    color: #fff;
  }
  .el-menu-item .is-active{
    color: rgb(255, 208, 75);
  }
  .is-active{
    .router-link-exact-active{
       color: rgb(255, 208, 75);
    }
  }
}
</style>