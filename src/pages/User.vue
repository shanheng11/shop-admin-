<template>
  <div>
    <!-- 面包屑导航  -->
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- 表格 -->
    <el-table :data="userlist">
      <!-- :data绑定的数据 
         :label列的文本标题
         prop绑定列的数据-->
      <el-table-column
        label="用户编号"
        prop="uid"
        width="200"
      ></el-table-column>
      <el-table-column
        label="角色名称"
        prop="rolename"
        width="200"
      ></el-table-column>
      <el-table-column
        label="用户名"
        prop="username"
        width="200"
      ></el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status == 1"
            >启用</el-tag
          >
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.uid)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteFn(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      :current-page="page"
      @current-change="pagechange"
    >
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @open="openFn" @close="closeFn">
      <el-form
        label-width="100px"
        :model="formdata"
        ref="roleform"
        :rules="rules"
      >
        <el-form-item prop="rolename" label="角色">
          <el-select v-model="formdata.roleid" placeholder="请选择">
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="rolename" label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item prop="rolename" label="密码">
          <el-input v-model="formdata.password" type="password"></el-input>
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
      total: 0,
      userlist: [], //表格绑定的数据
      checkedkeys: [],
      dialogVisible: false,
      formdata: {
        //表单绑定的数据
        roleid: "",
        username: "",
        password: "",
        status: true,
      },
      rules: {
        rolename: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: blur,
          },
        ],
      },
      //角色列表
      rolelist: [],
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    pagechange(page) {
      this.page = page;
      this.getlist();
    },
    async getlist() {
      let res1 = await this.$http.get(this.$api.USERCOUNT);
      // console.log(res.list[0].total);
      if (res1.code == 200) {
        this.total = res1.list[0].total;
      }
      let role = await this.$http.get(this.$api.ROLELIST);
      // console.log(role);
      if (role.code == 200) {
        this.rolelist = role.list;
      }
      let res = await this.$http.get(this.$api.USERLIST, {
        page: this.page,
        size: this.size,
      });
      if (res.code == 200) {
        this.userlist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    async getmenulist() {},
    addFn() {
      this.dialogVisible = true;
    },
    async editFn(uid) {
      console.log(uid);
      this.dialogVisible = true;
      let res = await this.$http.get(this.$api.USERINFO, { uid });
      if (res.code == 200) {
        this.formdata = {
          ...res.list,
        };
        this.formdata.status = res.list.status == 1 ? true : false;
        console.log(res);
      }
    },
    async deleteFn(id) {
      let res = await this.$http.post(this.$api.USERDELETE, { id });
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.page=1
        this.getlist();
      } else {
        this.$message.error(res.msg);
      }
    },
    openFn() {},
    closeFn() {
      this.formdata = {
        //表单绑定的数据
        roleid: "",
        username: "",
        password: "",
        status: true,
      };
    },
    async submit() {
      let url = this.formdata.uid ? this.$api.USEREDIT : this.$api.USERADD;
      this.formdata.status = this.formdata.status ? 1 : 2;
      let str = this.$qs.stringify(this.formdata);
      let res = await this.$http.post(url, str);
      if (res.code == 200) {
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
      this.getlist();
    },
  },
};
</script>