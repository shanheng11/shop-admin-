<template>
  <el-dropdown @command="logout">
    <span>
      <span>{{ username }}</span
      ><i class="el-icon-setting el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>登出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {
  props: {
    username: {
      required: true,
      type: String,
    },
  },
  methods: {
    logout() {
      this.$store.commit("clearinfo");
      this.$router.replace("/login")
    },
  },
};
</script>