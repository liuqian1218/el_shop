<template>
  <div ref="userListRef">
    <bread-crumb class = "bread-crumb"></bread-crumb>
    
    <el-card class="box-card">
      <el-row :gutter="20">
          <el-col :span="7">
              <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers">
                  <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
              </el-input>
          </el-col>
          <el-col :span="4">
              <el-button type="primary" @click="adduserDia = true">添加用户</el-button>
          </el-col>
      </el-row>

      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="40"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮件" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mgstate" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserInfo(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete"  size="mini" @click="delUser(scope.row)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setUserRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

     
    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="adduserDia"
      width="50%"  @close="closeAddDialog">
      
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
        <el-button @click="closeAddDialog">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户弹出框 -->
    <el-dialog title="修改用户" :visible.sync="modUserDia" width="50%"  @close="closeModDialog">
      <el-form :model="modform" status-icon :rules="addFormRules" ref="modFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input type="text" v-model="modform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="modform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input type="text" v-model="modform.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModDialog">取 消</el-button>
        <el-button type="primary" @click="modUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="roleDia" width="50%"  @close="closeRoleDialog">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selRoleId" placeholder="请选择">
            <el-option
              v-for="item in allRoles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRoleDialog">取 消</el-button>
        <el-button type="primary" @click="alloRole">确 定</el-button>
      </span>
    </el-dialog>


  </el-card>


  </div>
</template>

<script>
import { request } from '../../../../network'

import BreadCrumb from './children/BreadCrumb.vue'

export default {
    name:"UserList",
    components:{
      BreadCrumb,
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
        userList:[],
        total:0,
        pagenum:0,
        queryInfo:{
          query:"",
          pagenum:1, //当前页
          pagesize:5 //一页条目数
        },
        adduserDia:false,//添加用户对话框是否显示
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
        modUserDia:false,//修改用户的对话框modUserDia
        modform:{},
        roleDia:false,//分配角色对话框
        userInfo:{},//需要被分配角色的用户信息
        allRoles:[],//所有角色
        selRoleId:"",//选中的角色id
      }
    },
    created(){
      this.getUsers();
    },
    methods:{
      getUsers(){
        request({
          url:"/users",
          methods:"get",
          params:this.queryInfo
        }).then(res => {
          // console.log(res);
          const {data,meta} = res ;
          if(meta.status != 200){
            return this.$message.error(meta.msg);
          }else{
            this.userList = data.users;
            this.total = data.total;
            this.pagenum = data.pagenum;
          }
        }).catch(err => console.log(err))
      },
      //pagesize发生改变时
      handleSizeChange(newsize){
        // console.log(newsize);
        this.queryInfo.pagesize = newsize;
        this.getUsers();
      },
      //页码发生改变时
      handleCurrentChange(newPage){
        // console.log(newPage);
        this.queryInfo.pagenum = newPage;
        this.getUsers();
      },
      //状态改变时
      userStateChange(newUserInfo){
        // console.log(newUserInfo);
        request({
          url:`/users/${newUserInfo.id}/state/${newUserInfo.mg_state}`,
          methods:"put"
        }).then(res => {
          console.log(res);
          const {data,meta} = res ;
          if(meta.status !=200){
            newUserInfo.mg_state = !newUserInfo.mg_state;
            return this.$message.error(meta.msg); 
          }else{
            return this.$message({
                message: '修改成功',
                type: 'success'
              });
          }
        })
      },
      closeAddDialog(){
          this.$refs.addFormRef.resetFields()
          this.adduserDia = false ;
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
                  this.adduserDia = false ;
                  this.getUsers();
              }
              })
          }
          })
      },
      editUserInfo(userinfo){
        this.modUserDia=true;
        this.modform = userinfo ;
      },
      closeModDialog(){
        this.$refs.modFormRef.resetFields()
        this.modUserDia = false ;
      },
      //确认修改用户信息
      modUserInfo(){
          this.$refs.modFormRef.validate((valid, obj) => {
              if (!valid) {
                  return ;
              }else{
                  // console.log(this.addform);
                  request({
                  url:`/users/${this.modform.id}`,
                  methods:"put",
                  params:{
                    id:this.modform.id,
                    email:this.modform.email,
                    mobile:this.modform.mobile 
                  }
                  }).then(res => {
                  console.log(res);
                  const {data,meta} = res ;
                  if(meta.status != 200){
                      return this.$message.error(meta.msg);
                  }else{
                      this.$message({
                      message: '修改成功',
                      type: 'success'
                      });
                      this.closeModDialog();
                      this.$emit('update:visible', false)
                      this.getUsers();
                  }
                  })
              }
          })
      },
      //删除用户
      delUser(userInfo){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return request({
            url:`/users/${userInfo.id}`,
            methods:"delete",
            params:{
              id:userInfo.id
            }
          });
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      //关闭分配角色对话框
      closeRoleDialog(){
        this.roleDia = false ;
        this.selRoleId = "";
        this.userInfo = {};
      },
      //弹出分配角色对话框
      setUserRole(userinfo){
        this.roleDia = true ;
        this.userInfo = userinfo;
        request({
          url:`/roles`,
          methods:"get"
        }).then(res => {
          const {data,meta} = res ;
          if(meta.status != 200){
            return this.$message.error(meta.msg);
          }else{
            this.allRoles = data;
          }
        })
      },
      //角色分配完成
      alloRole(){
        if(!this.selRoleId){
          return this.$message.error("请选择一个角色");
        }
        request({
          url:`/users/${this.userInfo.id}/role`,
          methods:"put",
          params:{
            rid:this.selRoleId
          }
        }).then(res => {
          // console.log(res);
          const {data,meta} = res ;
          if(meta.status != 200){
            return this.$message.error(meta.msg);
          }else{
            this.closeRoleDialog();
          }
        })
      },

    },
}
</script>

<style lang="less" scoped>

</style>