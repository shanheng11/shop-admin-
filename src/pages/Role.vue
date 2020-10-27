<template>
  <div>
    <!-- 面包屑导航  -->
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- 表格 -->
    <el-table :data="rolelist">
      <!-- :data绑定的数据 
         :label列的文本标题
         prop绑定列的数据-->
      <el-table-column
        label="角色名称"
        prop="rolename"
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
          <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteFn(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @open="openFn" @close="closeFn">
      <el-form
        label-width="100px"
        :model="formdata"
        ref="roleform"
        :rules="rules"
      >
        <el-form-item prop="rolename" label="角色名称">
          <el-input v-model="formdata.rolename"></el-input>
        </el-form-item>
        <el-form-item prop="menus" label="菜单权限">
          <el-tree
            ref="tree"
            :data="menulist"
            show-checkbox
            :default-checked-keys="checkedkeys"
            node-key="id"
            :props="{
              children: 'children',
              label: 'title',
            }"
          >
          </el-tree>
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
      rolelist: [], //表格绑定的数据
      checkedkeys: [],
      dialogVisible: false,
      formdata: {
        //表单绑定的数据
        rolename: "",
        menus: [],
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
      //树状组件使用的菜单数据
      menulist: [],
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    async getlist() {
      let res = await this.$http.get(this.$api.ROLELIST);
      if (res.code == 200) {
        // console.log(res);
        this.rolelist = res.list ? res.list : [];
        // console.log(this.rolelist);
      } else {
        this.$message.error(res.msg);
      }
    },
    async getmenulist() {
      let res = await this.$http.get(this.$api.MENULIST, { istree: true });
      if (res.code == 200) {
        this.menulist = res.list ? res.list : [];
      }
      console.log(this.menulist);
    },
    addFn() {
      this.dialogVisible = true;
      this.getmenulist();
    },
    async editFn(id) {
      this.dialogVisible = true;
      let res = await this.$http.get(this.$api.ROLEINFO, { id });
      if (res.code == 200) {
        this.formdata.menus = res.list ? res.list.menus.split(",") : [];
        this.checkedkeys = res.list ? res.list.menus.split(",") : [];
        this.formdata.rolename = res.list.rolename;
        this.formdata.status = res.list.status == 1 ? true : false;
        // 点击编辑添加id属性
        this.formdata.id = id;
      }
    },
    async deleteFn(id) {
      console.log(id);
      let res = await this.$http.post(this.$api.ROLEDELETE, { id });
      if (res.code == 200) {
        this.$message.success("删除成功");
      } else {
        console.log(res);
        this.$message.error(res.msg);
      }
      this.getlist();
    },
    openFn() {
      this.getmenulist()
    },
    closeFn() {
      this.formdata = {
        //表单绑定的数据
        rolename: "",
        menus: [],
        status: true,
      };
    },
    async submit() {
      this.formdata.menus = this.$refs.tree.getCheckedKeys().join(",");
      this.formdata.status = this.formdata.status ? 1 : 2;
      let url = this.formdata.id ? this.$api.ROLEEDIT : this.$api.ROLEADD;
      let str = this.$qs.stringify(this.formdata);
      let res = await this.$http.post(url, str);
      if (res.code == 200) {
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.getlist();
      this.dialogVisible = false;
    },
  },
};
</script>