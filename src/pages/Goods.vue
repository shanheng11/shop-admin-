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
    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="pageChange"
      :current-page="page"
    ></el-pagination>
        <!-- 分页器 
            background:设置背景
            layout:布局
            total:总条数
            page-size:每一页数据量
            current-change:当前页面发生变化触发的事件
            current-page:当前的页数
    -->
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
            :on-preview="handlepreview"
            :on-remove="handleremove"
            :file-list="filelist"
            :on-change="filechange"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 放大图片设置 
            visible：显示状态
            apped-to-body:多个对话框的堆叠顺序问题
          -->
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
      page: 1,  //页面
      size: 2,  //页数
      total: 0, //总数
      dialogVisible: false,   //对话框
      previsible: false,  //图片放大框
      dialogImageUrl: "", //存放图片地址
      goodslist: [],  //商品列表
      formdata: {     //添加数据
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
      filelist: [], //存放图片上传文件列表
      rules: {      //验证规则
        rolename: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: blur,
          },
        ],
      },
      firstlist: [],  //一级分类的数据
      secondlist: [], //二级分类的数据
      specslist: [],    //商品规格列表
      attrs: [],    //规格属性
    };
  },
  mounted() {
    //生命周期渲染页面
    this.getgoodslist();
  },
  methods: {
    //编辑
    async edit(id) {
      this.dialogVisible = true;
      let res = await this.$http.get(this.$api.GOODSINFO, { id });
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
      if(this.editor){
        this.editor.txt.html(this.formdata.description); 
      }   //进行判断，如果this.editor为true则表示文本框已经创建出来，创建完成则把请求数据重新放入文本框
    },
    //删除
    async dele(id) {
        let res = await this.$http.post(this.$api.GOODSDELETE,{id})
        if(res.code==200){
          this.$message.success('删除成功')
          this.page=1
          this.getgoodslist()
        }else{
          this.$message.error(res.msg)
        }
    },
    //图片移除
    handleremove() {},
    //图片预览时回调，存放图片地址，并放大图片
    handlepreview(file) {
      this.dialogImageUrl = file.url;
      this.previsible = true;
    },
    filechange(file) {
      this.formdata.img = file.raw;
    },
    async getgoodslist() {
      let res1 = await this.$http.get(this.$api.GOODSCOUNT);
      this.total = res1.list[0].total;
      let res = await this.$http.get(this.$api.GOODSLIST, {
        page: this.page,
        size: this.size,
      });
      if (res.code == 200) {
        this.goodslist = res.list;
      }
    },
    async selectfirst(pid) {
      let res = await this.$http.get(this.$api.CATELIST, { pid });
      if (res.code == 200) {
        console.log(res);
        this.secondlist = res.list;
      }
    },
    async getfirstlist() {
      let res = await this.$http.get(this.$api.CATELIST, { pid: 0 });
      let res1 = await this.$http.get(this.$api.SPECSLIST);
      if (res.code == 200 && res1.code == 200) {
        this.specslist = res1.list;
        this.firstlist = res.list;
      }
    },
    async submit() {
      let url = this.formdata.id ? this.$api.GOODSEDIT : this.$api.GOODSADD;
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
      this.editor = new E("#editor");

      // 设置监听输入操作的回调函数，newHtml ：输入的内容
      this.editor.config.onchange = newHtml => {
        // console.log("change 之后最新的 html", newHtml);
        this.formdata.description = newHtml;  //先将最新的内容保存于this.formdata.description
      };
      this.editor.create();
      this.editor.txt.html(this.formdata.description);  //然后将最新的内容赋值给编辑框
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
      this.editor = null; //将edito内容变为空，防止每次打开都会创建一个新的编辑框
       document.getElementById("editor").innerHTML = ""; //重置富文本编辑器的html内容
    },
    pageChange(page) {
      this.page = page;
      this.getgoodslist();
    },
  },
};
</script>