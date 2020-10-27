<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <mytable :meunlist="meunlist" @change="changefn" @edit='editfn'></mytable>

    <el-dialog
      title="新增菜单"
      :visible.sync="dialogVisible"
      width="50%"
      @open="gettop"
      @close='reset'
    >
      <el-form
        label-width="100px"
        :model="formdata"
        :rules="rules"
        ref="menuform"
      >
        <el-form-item label="菜单名称">
          <el-select v-model="formdata.pid" @change="changemenu">
            <el-option :key="0" label="顶级菜单" :value="0"> </el-option>
            <el-option
              v-for="item in topmenu"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" v-if="formdata.type == 0">
          <el-input v-model="formdata.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址" v-else>
          <el-input v-model="formdata.url"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio
            v-model="formdata.type"
            :disabled="formdata.type != 1"
            :label="1"
            >目录</el-radio
          >
          <el-radio
            v-model="formdata.type"
            :disabled="formdata.type == 1"
            :label="2"
            >菜单</el-radio
          >
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formdata.status"> </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      meunlist: [],
      formdata: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: true,
      },
      topmenu: [],
      dialogVisible: false,
      rules: {
        title: [
          {
            required: true,
            message: "填写菜单名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    //重置formdata信息
    reset() {
      this.formdata = {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: true,
      };
    },
    //編輯
    editfn(row){
      // console.log(row)
      this.dialogVisible=true
      this.formdata={
        ...row
      }
      this.formdata.status=row.status==1?true:false
    },
    //进行添加和编辑操作
    submit() {
      let url = this.formdata.id?this.$api.MENUEDIT:this.$api.MENUADD  //进行依据点击的传值是否有id判断，添加是没有id的
      this.formdata.status = this.formdata.status ? 1 : 2;  //恢复status的状态
      this.$refs.menuform.validate((value) => {   //进行表单验证
        if (!value) {
          return false;
        }
        this.$http.post(url, this.formdata).then((res) => {
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.getlist();   
            this.dialogVisible = false;
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    changemenu(pid) {
      this.formdata.type = pid > 0 ? 2 : 1;
    },
    async getlist() {
      let res = await this.$http.get(this.$api.MENULIST, { istree: true });
      if (res.code == 200) {
        this.meunlist = res.list;
      } else {
        this.$message.error(res.msg);
      }
    },
    changefn(meun) {
      this.meunlist = meun; //删除成功同时接收新的数据
    },
    async gettop() {
      let res = await this.$http.get(this.$api.MENULIST, { pid: 0 });
      if (res.code == 200) {
        this.topmenu = res.list;
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>