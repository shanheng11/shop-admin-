<template>
  <div class="login_bg">
    <div class="login_contain">
      <el-form :model="ruleForm" ref="loginForm" :rules="rules">
        <h2>登录</h2>
        <el-form-item prop="username" lable=''>
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" lable>
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form>
          <el-button class="btnlogin" type="primary" @click="submit('loginForm')"
            >登录</el-button
          >
        </el-form>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapMutations,mapActions} from 'vuex'
export default {
  methods: {
    ...mapMutations(['setinfo']),
    // ...mapActions(['userlogin']),
    submit(form) {
      this.$refs[form].validate(value=>{
        if(!value){
          return false
        }
        // this.userlogin(this.ruleForm)
        this.$http.post(this.$api.USERLOGIN,this.ruleForm).then(res=>{
          if(res.code==200){
            console.log(res);
            this.setinfo({token:res.list.token,info:res.list})
            this.$router.replace('/index')
          }else{
            this.$message.error(res.msg);
          }
        })
      })
    },
  },
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入管理员名称",
            trigger: "blur",
          },
          {
            pattern: /^\S{4,8}$/g,
            message: "请输入4-8非空字符",
            trigger: "blur", //失去焦点时触发验证
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            max: 8,
            min: 5,
            message: "密码应该为5-8位数",
            trigger: "blur",
          },
        ],
      },
    };
  },
};
</script>

<style lang="less">
    .login_bg{
      background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);
      height: 100%;
      .login_contain{
        height: 250px;
        width: 300px;
        text-align: center;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        h2{
          margin: 20px 0;
          color: #fff;
        }
        .btnlogin{
          width: 100%;
        }
      }
    }
</style>