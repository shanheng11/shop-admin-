<template>
  <div>
    <!-- 面包屑导航  -->
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table :data="specslist">
      <!-- :data绑定的数据 
         :label列的文本标题
         prop绑定列的数据-->
      <el-table-column
        label="属性名称"
        prop="specsname"
        width="200"
      ></el-table-column>
      <el-table-column label="属性值" width="200">
        <template slot-scope="scope">
          <el-tag
            type="primary"
            v-for="(item, index) in scope.row.attrs"
            :key="index"
            >{{ item }}</el-tag
          >
        </template>
      </el-table-column>
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
      <el-form label-width="100px" :model="formdata" ref="roleform">
        <el-form-item prop="specsname" label="属性名称">
          <el-input v-model="formdata.specsname"></el-input>
        </el-form-item>
        <el-form-item label="属性值">
          <div v-for="(item, index) in arrtsarr" :key="index">
            <el-input v-model="item.value" :style="{ width: '60%' }"></el-input>
            <el-button v-if="index == 0" @click="addattr(index)"
              >添加属性</el-button
            >
            <el-button v-else type="danger" @click="deleteattr(index)"
              >删除属性</el-button
            >
          </div>
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
      specslist: [],
      dialogVisible: false,
      formdata: {
        specsname: "",
        attrs: "",
        status: true,
      },
      arrtsarr: [{ value: "" }],
    };
  },
  mounted() {
    this.getspecslist();
  },
  methods: {
    addFn() {
      this.dialogVisible = true;
    },
    async getspecslist() {
      let res = await this.$http.get("/api/specslist");
      if (res.code == 200) {
        this.specslist = res.list;
        // console.log(res.list);
      }
    },
    closeFn() {
      this.formdata = {
        specsname: "",
        attrs: "",
        status: true,
      };
      this.arrtsarr = [{ value: "" }];
    },
    async submit() {
      this.formdata.attrs = this.arrtsarr.map((item) => item.value).join(",");
      let url = this.formdata.id ? "/api/specsedit" : "/api/specsadd";
      this.formdata.status = this.formdata.status ? 1 : 2;
      let res = await this.$http.post(url, this.formdata);
      console.log(res);
      if (res.code == 200) {
        // console.log(res)
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
      this.getspecslist();
    },
    addattr() {
      this.arrtsarr.push({ value: "" });
    },
    deleteattr(i) {
      this.arrtsarr.splice(i, 1);
    },
    async deleteFn(id) {
      let res = await this.$http.post("/api/specsdelete", { id });
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getspecslist();
      } else {
        this.$message.error(res.msg);
      }
    },
    async editFn(id) {
      console.log(id);
      this.dialogVisible = true;
      let res = await this.$http.get("/api/specsinfo", { id });
      // this.formdata.id = res.list[0].id;
      if (res.code == 200) {
        this.formdata = {
          ...res.list[0],
        };
        this.arrtsarr = res.list[0].attrs.map((item) => ({ value: item }));
        this.formdata.status = res.list[0].status == 1 ? true : false;
      }
    },
  },
};
</script>