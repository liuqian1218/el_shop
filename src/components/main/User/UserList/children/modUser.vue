<template>
    <el-dialog title="修改用户" :visible.sync="dialogVisible" width="50%"  @close="closeDialog">
      <el-form :model="modform" status-icon :rules="modFormRules" ref="modFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input type="text" v-model="modform.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="modform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input type="text" v-model="modform.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="modUserInfo">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
    name:"ModUSer",
    props:{
        dialogVisible:{
            type:Boolean,
            default:false,
        },
        formInfo:{
            type:Object,
            default:{}
        },
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
            innerVisible:this.dialogVisible,
            modform:this.formInfo,
            modFormRules:{
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
          this.$refs.modFormRef.resetFields()
        },
        //确认修改用户信息
        modUserInfo(){
            this.$refs.addFormRef.validate((valid, obj) => {
                if (!valid) {
                    return ;
                }else{
                    // console.log(this.addform);
                    request({
                    url:"/users",
                    methods:"post",
                    params:this.modform
                    }).then(res => {
                    const {data,meta} = res ;
                    if(meta.status != 201){
                        return this.$message.error(meta.msg);
                    }else{
                        this.$message({
                        message: '修改成功',
                        type: 'success'
                        });
                        this.closeDialog();
                        this.$emit('update:visible', false)
                        this.$refs.userListRef.getUsers();
                    }
                    })
                }
            })
        }
    }
}
</script>

<style>

</style>