<template>
  <el-table
    :data="meunlist"
    style="width: 100%"
    row-key="id"
    :tree-props="{ children: 'children', haChildren: 'hasChildren' }">
    <el-table-column label="名称" width="180" prop="title"></el-table-column>
    <el-table-column label="图标" width="180">
      <template slot-scope="scope">
        <i :class="scope.row.icon"></i>
      </template>
    </el-table-column>
    <el-table-column label="类型" width="180">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.type == 1">目录</el-tag>
        <el-tag v-else-if="scope.row.type == 2" type="success">菜单</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="菜单URL" width="180" prop="url"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini" @click="$emit('edit',scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="delfn(scope.row.id)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    meunlist: {
      type: Array,
    },
  },
  methods: {
      //删除操作
    async del(id){
        let res =await this.$http.post(this.$api.MENUDELETE,this.$qs.stringify({id})); //安全
        if(res.code == 200){
            // console.log(res.list);
            this.$message.success("删除成功")
            this.$emit('change',res.list)   //删除成功同时触发自定义事件，重新传入删除后的数据渲染到页面
        }else{
            this.$message.error(res.msg)
        }
    },
    delfn(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
            this.del(id)
        }).catch(() => {});
    },
  },
};
</script>