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
    <el-dialog :visible.sync="dialogVisible" @close="closeFn">
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
      specslist: [],  //商品规格数据
      dialogVisible: false,   //对话框，默认关闭
      formdata: {         //表单双向绑定的数据
        specsname: "",  
        attrs: "",
        status: true,
      },
      arrtsarr: [{ value: "" }],  //用对象方式代替数组，更改对象内容页面随之更新
    };
  },
  mounted() {
    //点击该页面即调用该方法，渲染于页面
    this.getspecslist();
  },
  methods: {
    //点击添加打开对话框
    addFn() {
      this.dialogVisible = true;
    },
    //获取商品规格数据赋值给specslist
    async getspecslist() {  
      let res = await this.$http.get(this.$api.SPECSLIST);
      if (res.code == 200) {
        this.specslist = res.list;
      }
    },
    //关闭对话框全部清除为原始数据
    closeFn() {
      this.formdata = {
        specsname: "",
        attrs: "",
        status: true,
      };
      this.arrtsarr = [{ value: "" }]; 
    },
    //根据是否存在id进行判断是添加还是编辑
    async submit() {
      this.formdata.attrs = this.arrtsarr.map((item) => item.value).join(",");//把属性值转换从字符串
      let url = this.formdata.id ? this.$api.SPECSEDIT : this.$api.SPECSADD;  //判断id是否存在
      this.formdata.status = this.formdata.status ? 1 : 2;
      let res = await this.$http.post(url, this.formdata);  
      // console.log(res);
      if (res.code == 200) {
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;   
      this.getspecslist();    //关闭对话框同时调用获取列表方法，更新渲染
    },
    //添加属性触发，并往arrtsarr数组里面添加值
    addattr() {
      this.arrtsarr.push({ value: "" });
    },
    //删除属性值，
    deleteattr(i) {
      this.arrtsarr.splice(i, 1);
    },
    //根据id删除该列
    async deleteFn(id) {
      let res = await this.$http.post(this.$api.SPECSDELETE, { id });
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getspecslist();
      } else {
        this.$message.error(res.msg);
      }
    },
    //编辑，同时往formdata里面添加id
    async editFn(id) {
      console.log(id);
      this.dialogVisible = true;
      let res = await this.$http.get(this.$api.SPECSINFO, { id });
      if (res.code == 200) {
        this.formdata = {
          ...res.list[0],
        };
        this.arrtsarr = res.list[0].attrs.map((item) => ({ value: item })); //把从后台请求到的数据添加到数组中
        this.formdata.status = res.list[0].status == 1 ? true : false;  //状态更改
      }
    },
  },
};
</script>