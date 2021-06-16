<template>
  <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"  @close="closeDialog">
      
      <el-form :model="addform" status-icon :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input type="text" v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import {request} from '../../../../../network/index'
export default {
    name:"AddUser",
    props:{
        dialogVisible:{
            type:Boolean,
            default:false,
        }
    },
    data(){
        var checkEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('邮箱不能为空'));
        }
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if(regEmail.test(value)){
          return callback()
        }else{
          callback(new Error("请输入合法邮箱"))
        }
      };
      var checkMobile = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机不能为空'));
        }
        const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if(regMobile.test(value)){
          return callback()
        }else{
          callback(new Error("请输入合法手机号"))
        }
      };
        return {
          addform:{},//添加用户的表单信息
          addFormRules: {
              username: [
                  { required:true,messgae:"请输入用户名", trigger: 'blur' },
                  { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
              ],
              password:[
                  { required:true,messgae:"请输入密码", trigger: 'blur' },
                  { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
              ],
              email:[
                  { validator: checkEmail, trigger: 'blur' }
              ],
              mobile:[
                  { validator: checkMobile, trigger: 'blur' }
              ]
          },
        }
    },
  
    methods:{
        closeDialog(){
            this.$refs.addFormRef.resetFields()
            this.$emit('update:dialogVisible', false)
        },
        //添加用户
        addUserInfo(){
            this.$refs.addFormRef.validate((valid, obj) => {
            if (!valid) {
                return ;
            }else{
                // console.log(this.addform);
                request({
                url:"/users",
                methods:"post",
                params:this.addform
                }).then(res => {
                console.log(res);
                const {data,meta} = res ;
                if(meta.status != 201){
                    return this.$message.error(meta.msg);
                }else{
                    this.$message({
                    message: '保存成功',
                    type: 'success'
                    });
                    this.closeDialog();
                    this.$emit('update:dialogVisible', false)
                    this.$refs.userListRef.getUsers();
                }
                })
            }
            })
        },
    },
}
</script>

<style>

</style>