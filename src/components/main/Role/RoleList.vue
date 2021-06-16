<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="roleList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="['bdbottom',index1==0?'bdtop':'','vcenter']">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="[index2==0?'':'bdtop','bdtop','vcenter']">
                  <el-col :span="6" >
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable v-for="(item3,index3) in item2.children" :key="item3.id" type="warning" @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="40"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" >编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" >删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>


      </el-table>
    </el-card>

    <el-dialog title="分配权限" :visible.sync="showRightsDia" width="40%" @close="setRightsDialogClose">
      <el-tree :data="rightsList" :props="defaultProps" 
        @node-click="handleNodeClick" show-checkbox node-key="id" 
        default-expand-all :default-checked-keys="defKeys"
        ref="treeRef"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showRightsDia = false">取 消</el-button>
        <el-button type="primary" @click="alloRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {request} from '../../../network/index'
export default {
    name:"RoleList",
    data(){
      return {
        roleList:[],
        showRightsDia:false,
        type:"tree",
        rightsList:[],
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        defKeys:[],//默认选中的
        roleid:"",
      }
    },
    created(){
      this.getRoles()
    },
    methods:{
      getRoles(){
        request({
          url:`/roles`,
          methods:"get"
        }).then(res => {
          // console.log(res);
          const {data,meta} = res ;
          if(meta.status != 200){
            return this.$message.error(meta.msg);
          }else{
            this.roleList = data;
          }
        })
      },
      removeRightById(role,rightid){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return request({
            url:`/roles/${role.id}/rights/${rightid}`,
            methods:"delete"
          })
        }).then(res => {
          const {data,meta} = res ;
          if(meta.status != 200){
            return this.$message.error(meta.msg);
          }else{
            role.children = data ;
          }
        }).catch(err => {
          console.log(err);
        })
      },
      showSetRightDialog(roleInfo){
        this.showRightsDia = true;
        request({
          url:`/rights/${this.type}`,
          methods:"get"
        }).then(res => {
          // console.log(res);
          const {data,meta} = res ;
          if(meta.status != 200){
            this.$message.error(meta.msg)
          }else{
            this.rightsList = data ;
            this.getLeaveKeys(roleInfo,this.defKeys)
            this.roleid = roleInfo.id
          }
        })
      },
      //获取每个角色的权限
      getLeaveKeys(node,arr){
        if(!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(element => {
          this.getLeaveKeys(element,arr);
        });
      },
      //权限对话框关闭
      setRightsDialogClose(){
        this.defKeys = [];
      },
      //提交权限信息
      alloRights(){
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idstr = keys.join(',');
        request({
          url:`roles/${this.roleid}/rights`,
          methods:"post",
          params:{
            rids:idstr
          }
        }).then(res => {
          // console.log(res);
          const {data,meta} = res ;
          if(meta.status != 200){
            this.$message.error(meta.msg)
          }else{
            this.getRoles();
            this.showRightsDia = false ;
          }
        })
      },
      //tree的点击事件
      handleNodeClick(){

      },
    },
}
</script>

<style lang="less" scoped>
  .el-tag{
    margin:7px;
  }
  .bdtop{
    border-top:1px solid #eee;
  }
  .bdbottom{
    border-bottom:1px solid #eee;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>