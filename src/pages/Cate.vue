<template>
<div>
    <!-- 面包屑导航  -->
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- 表格 -->
    <el-table :data="catelist" row-key="id" :tree-props="{
        children: 'children',
        hasChildren: 'hasChildren'
      }">
        <!-- :data绑定的数据 
         :label列的文本标题
         prop绑定列的数据-->
        <el-table-column label="分类名称" prop="catename" width="200"></el-table-column>
        <el-table-column label="状态" width="200">
            <template slot-scope="scope">
                <el-tag effect="dark" type="success" v-if="scope.row.status == 1">启用</el-tag>
                <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteFn(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @close="closeFn">
        <el-form label-width="100px" :model="formdata" ref="roleform" :rules="rules">
            <el-form-item prop="catename" label="上级分类">
                <el-select v-model="formdata.pid" placeholder="请选择">
                    <el-option v-for="item in catelist" :key="item.id" :label="item.catename" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="catename" label="分类名称">
                <el-input v-model="formdata.catename"></el-input>
            </el-form-item>
            <el-form-item label="分类图片">
                <!-- 上传组件主题
                action:自动上传的地址
                auto-upload: 是否自动上传
                list-type:照片墙
                on-preview:设置预览时的 回调函数
                on-remove:设置移除时的 回调函数
                on-change:设置选择上传图片时的回调函数
           -->
                <el-upload action="#" :auto-upload="false" list-type="picture-card" :on-preview="handlePreview" :on-remove="handleRemove" :on-change="fileChange" :file-list="fileList">
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
import axios from "axios";
import LoginVue from "../../../demo4/src/pages/Login.vue";
export default {
    data() {
        return {
            catelist: [], //表格绑定的数据
            dialogVisible: false, //添加或编辑的对话框
            preVisible: false, //图片是否放大，默认false
            dialogImageUrl: "", //存放图片放大的地址
            formdata: {
                //表单绑定的数据
                pid: "",
                img: "",
                catename: "",
                status: true
            },
            rules: {
                rolename: [{
                    required: true,
                    message: "请填写角色名称",
                    trigger: blur
                }]
            },
            fileList: [],
            topCate: []
        };
    },
    mounted() {
        this.getlist();
    },
    methods: {
        fileChange(file) {
            this.formdata.img = file.raw;
        },
        handlePreview(file) {
            console.log(file);
            this.dialogImageUrl = file.url;
            this.preVisible = true;
        },
        handleRemove() {},
        async gettopcate() {
            let res = this.$http.get(this.$api.CATELIST, {
                istree: true,
                pid: 0
            });
            if (res.code == 200) {
                console.log(res);
                this.topCate = res.list;
            }
        },
        async getlist() {
            let res = await this.$http.get(this.$api.CATELIST, {
                istree: true
            });
            if (res.code == 200) {
                console.log(res);
                this.catelist = res.list;
            }
        },
        addFn() {
            this.dialogVisible = true;
        },
        async editFn(id) {
            this.dialogVisible = true;
            let res = await this.$http.get(this.$api.CATEINFO, {
                id
            });
            console.log(res.list);
            if (res.code == 200) {
                this.fileList = [{
                    name: "",
                    url: this.$domain + res.list.img
                }];
                this.formdata = {
                    ...res.list
                };
                this.formdata.id = id;
                this.formdata.status = res.list.status == 1 ? true : false;
            }
        },
        async deleteFn(id) {
            let res = await this.$http.post(this.$api.CATEDELETE, {
                id
            });
            if (res.code == 200) {
                this.$message.success("删除成功");
                this.getlist();
            } else {
                this.$message.error(res.msg);
            }
        },
        closeFn() {
            this.formdata = {
                //表单绑定的数据
                pid: "",
                img: "",
                catename: "",
                status: true
            };
            this.fileList = [];
        },
        async submit() {
            this.formdata.status = this.formdata.status ? 1 : 2;
            let url = this.formdata.id ? this.$api.CATEEDIT : this.$api.CATEADD;
            let res = await this.$http.upload(url, this.formdata);
            if (res.code == 200) {
                this.$message.success("操作成功");
                this.dialogVisible = false;
            } else {
                this.$message.error(res.msg);
            }
            this.getlist();
            /* let form1 = new FormData();
      for (let key in this.formdata) {
        form1.append(key, this.formdata[key]);
      }
      axios({
        method: "post",
        url,
        data: form1,
        headers: {
          Authorization: localStorage.getItem("token")
            ? localStorage.getItem("token")
            : "",
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.dialogVisible=false
          this.getlist()
        } else {
          this.$message.error(res.msg);
        }
      });
 */
        }
    }
};
</script>
