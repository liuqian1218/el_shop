<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="40"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag :type="scope.row.level|getTagType">{{ scope.row.level|getLevel }}</el-tag>
          </template>
        </el-table-column>
      </el-table>

    </el-card>


  </div>
</template>

<script>
import {request} from '../../../network/index'

export default {
  name:"AuthorList",
  data(){
    return {
      type:"list",
      rightsList:[],
    }
  },
  created(){
    this.getRights();
  },
  methods:{
    getRights(){
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
        }
      })
    }
  },
  filters:{
    getLevel(val){
      return val == 0 ? "一级" : 
        val == 1? "二级" :"三级"
    },
    getTagType(val){
      return val == 0 ? "" : 
        val == 1? "success" :"warning"
    }
  }

}
</script>

<style lang="less" scoped>

</style>