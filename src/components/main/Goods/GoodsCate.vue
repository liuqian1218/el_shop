<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-button type="primary" @click="addCateClick">添加分类</el-button>

      <tree-table :data="categorys" :columns="columns" :selection-type="false"
        :expand-type="false" show-index index-text="#" border :show-row-hover="false"
        class = "tree-table">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-error" v-if="scope.row.cat_deleted" style="color:red;"></i>
          <i class="el-icon-success" v-else style="color:lightgreen;"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="options" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 页签导航 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="reqCateParm.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="reqCateParm.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

    </el-card>
    <!-- 添加分类弹出框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDia" width="50%" @close="addCateClose">
      <el-form :model="addCateInfo" status-icon :rules="addCateRules" ref="addCateRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name"> 
          <el-input type="text" v-model="addCateInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类"> 
          <el-cascader v-model="selectedCate" :options="fatherCates" :props="cascaderProps" 
            @change="handleChange" clearable change-on-select></el-cascader> 
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDia = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {request} from '../../../network/index'
export default {
    name:"GoodsCate",
    data(){
      return {
        categorys:[],
        reqCateParm:{
          type:3,
          pagenum:1,
          pagesize:5,
        },//请求参数
        total:0,
        columns:[
          {
            label:"分类名称",
            prop:"cat_name",
          },
          {
            label:"是否有效",
            type:"template",
            template:"isok"
          },
          {
            label:"排序",
            type:"template",
            template:"sort"
          },
          {
            label:"操作",
            type:"template",
            template:"options"
          }
        ],//表格列显示
        addCateDia:false,//添加分类弹出框是否显示
        addCateInfo:{
          cat_name:"",
          cat_pid:0,
          cat_level:0,
        },//添加分类的数据
        addCateRules:{
          cat_name:[
            { required:true,messgae:"请输入分类名称", trigger: 'blur' }
          ]
        },//添加数据表单验证
        fatherCates:[],//父级分类
        cascaderProps:{
          expandTrigger: 'hover',
          label:"cat_name",
          value:"cat_id",
          children:"children"
        },//级联菜单配置
        selectedCate:[],//选中的父级菜单
      }
    },
    created(){
      this.getCates();
    },
    methods:{
      getCates(){
        request({
          url:"categories",
          methods:"get",
          params:this.reqCateParm,
        }).then(res => {
          // console.log(res);
          const {data,meta} = res ;
          if(meta.status != 200){
            this.$message.error(meta.msg)
          }else{
            this.categorys = data.result ;
            this.total = data.total;
          }
        })
      },
      handleSizeChange(val){
        this.reqCateParm.pagesize = val ;
        this.getCates();
      },
      handleCurrentChange(val){
        this.reqCateParm.pagenum = val ;
        this.getCates();
      },
      //添加分类按钮点击
      addCateClick(){
        this.addCateDia = true ;
        request({
          url:"categories",
          methods:"get",
          params:{
            type:2,
          }
        }).then(res => {
          console.log(res);
          const {data,meta} = res ;
          if(meta.status != 200){
            this.$message.error(meta.msg)
          }else{
            this.fatherCates = data;
          }
        })
      },
      //级联菜单的选中事件
      handleChange(){
        if(this.selectedCate.length > 0){
          this.addCateInfo.cat_pid = this.selectedCate[this.selectedCate.length-1];
        }
        this.addCateInfo.cat_level = this.selectedCate.length;
      },
      //添加分类对话框关闭
      addCateClose(){
        this.$refs.addCateRef.resetFields()
        this.selectedCate=[];
        this.addCateInfo.cat_pid=0;
        this.addCateInfo.cat_level=0;
      },
      //点击确认按钮
      addCate(){
        this.$refs.addCateRef.validate(valid => {
          if(!valid) return ;
          request({
            url:"/categories",
            methods:"post",
            params:this.addCateInfo
          }).then(res => {
            // console.log(res);
            const {data,meta} = res ;
            if(meta.status !=200){
              newUserInfo.mg_state = !newUserInfo.mg_state;
              return this.$message.error(meta.msg); 
            }else{
              return this.$message({
                  message: '添加成功',
                  type: 'success'
                });
            }
          })
          this.addCateDia = false;
          this.getCates();
        })

        
      },
    }
}
</script>

<style lang="less" scoped>
  .tree-table{
    margin-top:15px;
  }
  .el-cascader{
    width:100%;
  }
</style>