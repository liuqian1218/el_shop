<template>
  <div class="login-container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form
        class="login_form"
        :model="loginMsg"
        :rules="rules"
        ref="loginFormRef"
      >
        <el-form-item prop="name">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginMsg.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="psd">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginMsg.psd"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { request } from '../network/index'

export default {
  name: 'Login',
  data() {
    return {
      loginMsg: {
        name: 'admin',
        psd: '123456'
      },
      rules: {
        name: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        psd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate((valid, obj) => {
        if (!valid) {
          return
        } else {
          request({
            methods: 'post',
            url: 'login',
            params: {
              username: this.loginMsg.name,
              password: this.loginMsg.psd
            }
          })
            .then(res => {
              var { data, meta } = res
              if (meta.status != 200) {
                return this.$message.error(meta.msg)
              } else {
                this.$message({
                  message: '登录成功！',
                  type: 'success'
                })
                window.sessionStorage.setItem('token', data.token)
                this.$router.push('/home')
              }
            })
            .catch(err => console.log(err))
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    background-color: #eee;
    border-radius: 50%;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
