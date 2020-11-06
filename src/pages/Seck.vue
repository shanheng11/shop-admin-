<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn()">添加</el-button>
    <el-table :data="secklist">
      <el-table-column
        label="活动名称"
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
    <el-dialog :visible.sync="dialogVisible" @close="closeFn" @open="openfn">
      <el-form label-width="100px" :model="formdata">
        <el-form-item label="活动名称">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <el-form-item label="活动期限">
          <el-date-picker
            v-model="value1"
            @change="changefn"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="一级分类">
          <el-select
            @change="selectfirst"
            v-model="formdata.first_cateid"
            placeholder="请选择分类"
          >
            <el-option
              v-for="item in firstlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            @change="selectsecond"
            v-model="formdata.second_cateid"
            placeholder="请选择分类"
          >
            <el-option
              v-for="item in secondlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <el-select v-model="formdata.goodsid" placeholder="请选择商品">
            <el-option
              v-for="item in goodslist"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
      secklist: [],
      formdata: {
        title: "",
        begintime: "",
        status: 1,
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
      },
      firstlist: [],
      secondlist: [],
      goodslist: [],
      dialogVisible: false,
      value1: [],//存放时间（两个）
    };
  },
  mounted() {
    this.getlist();
    this.getfirstlist();
  },
  methods: {
      openfn(){
      },
    async getfirstlist() {
      let res = await this.$http.get(this.$api.CATELIST, {
        pid: 0,
      });
      if (res.code == 200) {
        this.firstlist = res.list;
        // console.log(res.list);
      }
    },
    async getlist() {
      let res = await this.$http.get(this.$api.SECKLIST);
      let res1 = await this.$http.get("/");
      if (res.code == 200) {
        this.secklist = res.list;
      }
    },
    changefn() {
      // console.log(i)
    },
    addFn() {
      this.dialogVisible = true;
      this.formdata.status = this.formdata.status == 1 ? true : false;
    },
    async submit() {
      let date1 = new Date(this.value1[0]);
      let date2 = new Date(this.value1[1]);
      this.formdata.begintime = date1.getTime();
      this.formdata.endtime = date2.getTime();
    //   console.log(this.formdata);
      let url = this.formdata.id ? this.$api.SECKEDIT :this.$api.SECKADD;
      this.formdata.status = this.formdata.status == true ? 1 : 2;
      let res = await this.$http.post(url, this.formdata);
      if (res.code == 200) {
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
      this.getlist();
    },
    async edit(id) {
        this.dialogVisible = true;
      let res = await this.$http.get(this.$api.SECKINFO, { id });
      if (res.code == 200) {
        this.formdata = {
          ...res.list
        };
        this.selectfirst(this.formdata.first_cateid)
        this.selectsecond(this.formdata.second_cateid)
        this.formdata.status=this.formdata.status==1?true:false
        this.formdata.begintime=this.timestampToTime(Number(this.formdata.begintime))
        this.value1.push(this.formdata.begintime)
        this.formdata.endtime=this.timestampToTime(Number(this.formdata.endtime))
        this.value1.push(this.formdata.endtime)
        this.formdata.id=id
      }
    },
    async dele(id) {
      let res = await this.$http.post(this.$api.SECKDELETE, {
        id
      });
      if (res.code == 200) {
        this.$message.success("删除成功");
      } else {
        this.$message.error(res.msg);
      }
      this.getlist();
    },
    closeFn() {
        this.value1=[],//存放时间（两个）
        this.formdata= { //表单绑定
        title: "",
        begintime: "",
        status: 1,
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
      }
    },

    async selectfirst(pid) {
      let res = await this.$http.get(this.$api.CATELIST, {
        pid
      });
    //   console.log(res);
      if (res.code == 200) {
        // console.log(pid);
        this.secondlist = res.list;
        this.formdata.first_cateid = pid;
      }
    },
    async selectsecond(pid) {
      this.formdata.second_cateid = pid;
      let res = await this.$http.get(this.$api.GOODSLIST, {
        fid: this.formdata.first_cateid,
        sid: this.formdata.second_cateid,
      });
    //   console.log(res);
      if (res.code == 200) {
        // console.log(res);
        this.goodslist = res.list;
      }
    },
    async getgoodslist() {},
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
