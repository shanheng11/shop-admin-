<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="memberlist">
      <el-table-column
        label="昵称"
        prop="nickname"
        width="200"
      ></el-table-column>
      <el-table-column
        label="手机号"
        prop="phone"
        width="200"
      ></el-table-column>
      <el-table-column
        label="注册日期"
        prop="addtime"
        width="200"
      ></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @open="openFn" @close="closeFn">
      <el-form label-width="100px" :model="formdata">
        <el-form-item label="昵称">
          <el-input v-model="formdata.nickname" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formdata.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password" type="password"></el-input>
          <span>不填写则不修改密码</span>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formdata.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      page: 1,
      size: 2,
      memberlist: [],
      dialogVisible: false, //对话框
      formdata: { //表单绑定数据
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      },
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    //获取列表
    async getlist() {
      let res = await this.$http.get(this.$api.MEMBERLIST, {
        page: this.page,
        size: this.size,
      });
      if (res.code == 200) {
        this.memberlist = res.list;
        this.memberlist.map(
          (item) => (item.addtime = this.timestampToTime(Number(item.addtime))) //时间戳转化成时间
        );
      }
    },
    openFn() {},
    closeFn() {},
    async edit(uid) {
      console.log(uid);
      this.dialogVisible = true;
      let res = await this.$http.get(this.$api.MEMBERINFO, { uid });
      if (res.code == 200) {
        this.formdata = {
          ...res.list,
        };
        this.formdata.status = res.list.status == 1 ? true : false;
      }
    },
    //提交
    async submit() {
        this.formdata.status = this.formdata.status ? 1 : 2;
        let res = await this.$http.post(this.$api.MEMBEREDIT,this.formdata)
        if(res.code==200){
            this.$message.success('修改成功')
        }else{
            this.$message.error(res.msg)
        }
        this.getlist()
        this.dialogVisible = false;
    },
    // 时间戳转换成时间
    timestampToTime(cjsj) {
      var date = new Date(cjsj); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
  },
};
</script>