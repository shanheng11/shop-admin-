<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="openFn()">添加</el-button>
    <el-table :data="goodslist">
      <el-table-column
        label="一级分类"
        prop="firstcatename"
        width="100"
      ></el-table-column>
      <el-table-column
        label="二级分类"
        prop="secondcatename"
        width="100"
      ></el-table-column>
      <el-table-column
        label="商品名称"
        prop="goodsname"
        width="100"
      ></el-table-column>
      <el-table-column
        label="销售价"
        prop="price"
        width="100"
      ></el-table-column>
      <el-table-column
        label="市场价"
        prop="market_price"
        width="100"
      ></el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="dele(scope.row.id)" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="pageChange"
      :current-page="page"
    ></el-pagination>
    <!-- 对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      @open="openFn"
      @opened="openedFn"
      @close="closeFn"
    >
      <el-form
        label-width="100px"
        :model="formdata"
        ref="roleform"
        :rules="rules"
      >
        <el-form-item label="一级分类">
          <el-select
            @change="selectfirst"
            v-model="formdata.first_cateid"
            placeholder="请选择"
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
          <el-select v-model="formdata.second_cateid" placeholder="请选择">
            <el-option
              v-for="item in secondlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="goodsname" label="商品名">
          <el-input v-model="formdata.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlepreview"
            :on-remove="handleremove"
            :file-list="filelist"
            :on-change="filechange"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="previsible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品规格">
          <el-select
            @change="selectspecs"
            v-model="formdata.specsid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in specslist"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格属性">
          <el-select
            multiple
            @change="selectfirst"
            v-model="formdata.specsattr"
            placeholder="请选择"
          >
            <el-option
              v-for="item in attrs"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="price" label="销售价">
          <el-input type="number" v-model="formdata.price"></el-input>
        </el-form-item>
        <el-form-item prop="market_price" label="市场价">
          <el-input type="number" v-model="formdata.market_price"></el-input>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio v-model="formdata.ishot" :label="1">是</el-radio>
          <el-radio v-model="formdata.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否新品">
          <el-radio v-model="formdata.isnew" :label="1">是</el-radio>
          <el-radio v-model="formdata.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="formdata.status" :label="1">上架</el-radio>
          <el-radio v-model="formdata.status" :label="2">下架</el-radio>
        </el-form-item>
        <el-form-item label="商品描述">
          <div id="editor"></div>
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
import E from "wangeditor";
export default {
  data() {
    return {
      page: 1,
      size: 2,
      total: 0,
      dialogVisible: false,
      previsible: false,
      dialogImageUrl: "",
      goodslist: [],
      formdata: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      filelist: [],
      rolelist: [],
      rules: {
        rolename: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: blur,
          },
        ],
      },
      firstlist: [],
      secondlist: [],
      specslist: [],
      attrs: [],
    };
  },
  mounted() {
    this.getgoodslist();
  },
  methods: {
    async edit(id) {
      this.dialogVisible = true;
      let res = await this.$http.get("/api/goodsinfo", { id });
      if (res.code == 200) {
        this.formdata = {
          ...res.list,
        };
        this.formdata.id = id;
      }
      this.selectfirst(this.formdata.first_cateid);
      this.attrs = this.formdata.specsattr.split(",");
      this.formdata.specsattr = this.formdata.specsattr.split(",");
      this.filelist = [{ name: "", url: this.$domain + this.formdata.img }];
    },
    dele() {},
    handleremove() {},
    handlepreview(file) {
      this.dialogImageUrl = file.url;
      this.previsible = true;
    },
    filechange(file) {
      this.formdata.img = file.raw;
    },
    async getgoodslist() {
      let res1 = await this.$http.get("/api/goodscount");
      this.total = res1.list[0].total;
      let res = await this.$http.get("/api/goodslist", {
        page: this.page,
        size: this.size,
      });
      if (res.code == 200) {
        this.goodslist = res.list;
      }
    },
    async selectfirst(i) {
      let res = await this.$http.get("/api/catelist", { pid: i });
      if (res.code == 200) {
        this.secondlist = res.list;
      }
    },
    async getfirstlist() {
      let res = await this.$http.get("/api/catelist", { pid: 0 });
      let res1 = await this.$http.get("/api/specslist");
      if (res.code == 200 && res1.code == 200) {
        this.specslist = res1.list;
        this.firstlist = res.list;
      }
    },
    async submit() {
      let url = this.formdata.id ? "/api/goodsedit" : "/api/goodsadd";
      this.formdata.specsattr = this.formdata.specsattr.join(",");
      let res = await this.$http.upload(url, this.formdata);
      if (res.code == 200) {
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
      this.getgoodslist();
    },
    selectspecs(id) {
      //通过触发选择后传入的id进行查找specslist选中的对应id的attrs赋值给attrs数组
      this.attrs = this.specslist.find((item) => item.id == id).attrs;
    },
    openFn() {
      this.getfirstlist();
      this.dialogVisible = true;
    },
    openedFn() {
      const editor = new E("#editor");
      editor.create();
    },
    closeFn() {
      this.formdata = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1,
        ishot: 1,
        status: 1,
      };
      this.filelist = [];
    },
    pageChange(page) {
      this.page = page;
      this.getgoodslist();
    },
  },
};
</script>