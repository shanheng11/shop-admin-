<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn()">添加</el-button>
    <el-table :data="bannerlist">
      <el-table-column
        label="轮播图名称"
        prop="title"
        width="200"
      ></el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="dele(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @close="closeFn">
      <el-form label-width="100px" :model="formdata">
        <el-form-item prop="catename" label="轮播图标题">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <el-form-item label="轮播图图片">
          <!-- 上传组件主题
                action:自动上传的地址
                auto-upload: 是否自动上传
                list-type:照片墙
                on-preview:设置预览时的 回调函数
                on-remove:设置移除时的 回调函数
                on-change:设置选择上传图片时的回调函数
           -->
          <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="fileChange"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 放大图片设置 
            visible：显示状态
            apped-to-body:多个对话框的堆叠顺序问题
          -->
          <el-dialog :visible.sync="preVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
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
      bannerlist: [], //banner数据
      formdata: {   //表单绑定
        title: "",
        img: "",
        status: 1,
      },
      dialogVisible: false,   //对话框
      preVisible: false,    //大图片预览
      dialogImageUrl: "", //存放图片放大的地址
      fileList: [],   //图片文件存放
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    //获取数据
    async getlist() {
      let res = await this.$http.get(this.$api.BANNERLIST);
      if (res.code == 200) {
        this.bannerlist = res.list;
      }
    },
    //添加
    addFn() {
      this.dialogVisible = true;
      this.formdata.status = this.formdata.status == 1 ? true : false;
    },
    //提交
    async submit() {
      let url = this.formdata.id?this.$api.BANNEREDIT:this.$api.BANNERADD
      this.formdata.status = this.formdata.status == true ? 1 : 2;
      let res = await this.$http.upload(url, this.formdata);
      if (res.code == 200) {
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
      this.getlist();   //关闭对话框并更新数据
    },
    //点击编辑触发
    async edit(id) {
      this.dialogVisible = true;
      let res = await this.$http.get(this.$api.BANNERINFO, { id });
      if (res.code == 200) {
        this.fileList = [
          {
            name: "",
            url: this.$domain + res.list.img,
          },
        ];
        this.formdata = {
          ...res.list,
        };
        this.formdata.id=id
        this.formdata.status = this.formdata.status == 1 ? true : false;
      }
    },
    //删除
    async dele(id) {
      let res = await this.$http.post(this.$api.BANNERDELETE, { id });
      if (res.code == 200) {
        this.$message.success("删除成功");
      } else {
        this.$message.error(res.msg);
      }
      this.getlist();
    },
    //关闭对话框重置原来数据
    closeFn() {
      (this.formdata = {
        title: "",
        img: "",
        status: 1,
      }),
        (this.fileList = []);
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.preVisible = true;
    },
    //移除图片
    handleRemove() {},
    fileChange(file) {
      this.formdata.img = file.raw;
    },
  },
};
</script>