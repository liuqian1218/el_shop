<template>
  <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-alert show-icon type="warning" title="注意：只允许为第三级分类设置相关参数！" :closable="false"></el-alert>
        <el-row class="cat_opt">
          <el-col>
            <span>选择商品分类：</span>
            <el-cascader v-model="selectedCate" :options="categorys" :props="cascaderProps" 
              @change="handleChange" clearable></el-cascader>
          </el-col>
        </el-row>
        <!-- 标签页 -->
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <!-- 动态参数页签 -->
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="btnDisabled" @click="AddData">添加参数</el-button>
            <el-table :data="manyTableData" border stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag :key="tag" v-for="tag in scope.row.attr_vals" closable :disable-transitions="false" 
                   class="data-tag" @close="removeData(scope.row,tag)">
                    {{tag}}
                  </el-tag>
                  <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue"
                  size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数信息" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="modData(scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="delData(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

          </el-tab-pane>
          <!-- 静态属性页签 -->
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="btnDisabled" @click="AddData">添加属性</el-button>
            <el-table :data="onlyTableData" border stripe>
              <el-table-column type="expand">

              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数信息" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="modData(scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="delData(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

          </el-tab-pane>
        </el-tabs>

      </el-card>

    <!-- 添加动态参数弹出框 -->
    <el-dialog :title="'添加'+getDiaTitle" :visible.sync="addDia" width="70%" @close="addDiaClose">
      <el-form :model="addInfo" status-icon :rules="addRules" ref="addRef" label-width="100px">
        <el-form-item :label="getDiaTitle" prop="attr_name"> 
          <el-input type="text" v-model="addInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDia = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改动态参数弹出框 -->
    <el-dialog :title="'添加'+getDiaTitle" :visible.sync="modDia" width="70%" @close="modDiaClose">
      <el-form :model="modInfo" status-icon :rules="addRules" ref="modRef" label-width="100px">
        <el-form-item :label="getDiaTitle" prop="attr_name"> 
          <el-input type="text" v-model="modInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modDia = false">取 消</el-button>
        <el-button type="primary" @click="submitMod">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {request} from '../../../network/index'
export default {
    name:"CateParam",
    data(){
      return {
        categorys:[],//商品分类
        selectedCate:[],//选中的商品分类
        cascaderProps:{
          expandTrigger: 'hover',
          label:"cat_name",
          value:"cat_id",
          children:"children"
        },//级联菜单的配置
        activeTab:"many",//活动的tab页签
        manyTableData:[],//动态参数
        onlyTableData:[],//静态属性
        addDia:false,//添加动态参数/静态属性弹出狂是否显示
        addInfo:{},//添加动态参数/静态属性信息
        addRules:{
          attr_name:[
            { required:true,messgae:"请输入"+this.getDiaTitle+"名称", trigger: 'blur' }
          ]
        },//添加动态参数/静态属性信息验证
        modDia:false,//修改弹出框的显示
        modInfo:{},//修改数据

        inputVisible:false ,
        inputValue:"",
      }
    },
    created(){
      this.getCate()
    },
    methods:{
      getCate(){
        request({
          url:"categories",
          methods:"get",
        }).then(res => {
          // console.log(res);
          const {data,meta} = res ;
          if(meta.status != 200){
            this.$message.error(meta.msg)
          }else{
            this.categorys = data ;
          }
        })
      },
      // 获取参数
      getParams(){
        request({
          url:`categories/${this.cateId}/attribute`,
          methods:"get",
          params:{
            sel:this.activeTab,
          }
        }).then(res => {
          // console.log(res);
          const {data,meta} = res ;
          // if(meta.status != 200){
          //   this.$message.error(meta.msg)
          // }else{
            
          // }
          if(this.activeTab === "many"){
            this.manyTableData = [
              {
                "attr_id":1,
                "attr_name":"cpu",
                "cat_id":22,
                "attr_sel":"only",
                "attr_write":"manual",
                "attr_vals" :"ffff a b c"
              },{
                "attr_id":2,
                "attr_name":"cpu2",
                "cat_id":22,
                "attr_sel":"only",
                "attr_write":"manual",
                "attr_vals" :"b c d"
              },{
                "attr_id":3,
                "attr_name":"cpu3",
                "cat_id":22,
                "attr_sel":"only",
                "attr_write":"manual",
                "attr_vals" :"e f g h j"
              },
            ]
            this.manyTableData.forEach(item => {
              item.attr_vals = item.attr_vals===""?[]:item.attr_vals.split(' ');
              item.inputVisible = false;
              item.inputValue = "";
            })
          }else{
            this.onlyTableData = [
              {
                "attr_id":1,
                "attr_name":"cpu",
                "cat_id":22,
                "attr_sel":"only",
                "attr_write":"manual",
                "attr_vals" :"ffff hhhh bbbb"
              },{
                "attr_id":2,
                "attr_name":"cpu2",
                "cat_id":22,
                "attr_sel":"only",
                "attr_write":"manual",
                "attr_vals" :"ffff jjj kkk"
              },{
                "attr_id":3,
                "attr_name":"cpu3",
                "cat_id":22,
                "attr_sel":"only",
                "attr_write":"manual",
                "attr_vals" :"ffff iii ooo"
              },
            ]
          }
        })
      },
      //级联菜单选中事件
      handleChange(){
        if(this.selectedCate.length !== 3){
          this.selectedCate=[];
          this.manyTableData=[];
          this.onlyTableData = [];
          return ;
        }
        this.getParams();
      },
      //点击tab页签
      handleTabClick(){
        this.getParams();
      },
      //添加动态参数按钮点击
      AddData(){
        this.addDia = true ;
      },
      //添加动态参数弹出狂关闭事件
      addDiaClose(){
        this.$refs.addRef.resetFields();
      },
      //添加的确认按钮
      submitAdd(){
        this.$refs.addRef.validate(valid => {
          if(!valid) return 
          request({
            url:`categories/${this.cateId}/attribute`,
            methods:"post",
            params:{
              attr_name:this.addInfo.attr_name,
              attr_sel : this.activeTab
            }
          }).then(res => {
            this.$message({
                message: '添加成功',
                type: 'success'
              });
            this.getParams();
          })
          this.addDia = false ;
        })
      },
      //修改按钮的点击
      modData(dataInfo){
        this.modDia = true ;
        this.modInfo = dataInfo;
        console.log(dataInfo);
      },
      //修改弹出框的关闭
      modDiaClose(){
        this.$refs.modRef.resetFields();
      },
      //修改提交
      submitMod(){
        this.$refs.modRef.validate(valid => {
          if(!valid) return 
          request({
            url:`/categories/${this.cateId}/attributes/${this.modInfo.attr_id}`,
            methods:"put",
            params:{
              attr_name:this.modInfo.attr_name,
              attr_sel:this.activeTab
            }
          }).then(res => {
            this.$message({
                message: '修改成功',
                type: 'success'
              });
            this.getParams();
          })
          this.modDia = false 
        })
      },
      //删除属性、参数
      delData(delInfo){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return request({
            url:`/categories/${this.cateId}/attributes/${delInfo.attr_id}`,
            methods:"delete",
          });
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getParams();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      //移除属性详情
      removeData(atrrInfo,tag){
        atrrInfo.attr_vals.splice(atrrInfo.attr_vals.indexOf(tag), 1);
        
      },
      //处理标签提交事件
      handleInputConfirm(attrInfo){
        let inputValue = this.inputValue;
        if (inputValue) {
          attrInfo.attr_vals.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      //添加按钮的点击
      showInput(attrInfo){
        // attrInfo.inputVisible = true;
        this.inputVisible = true; 
      },
    },
    computed:{
      btnDisabled(){
        return !(this.selectedCate.length===3 )
      },
      cateId(){
        if(this.selectedCate.length===3){
          return this.selectedCate[this.selectedCate.length-1]
        }else{
          return null;
        }
      },
      getDiaTitle(){
        if(this.activeTab === "many"){
          return "动态参数"
        }else{
          return "静态属性"
        }
      }
    },
    
}
</script>

<style lang="less" scoped>
  .cat_opt{
    margin:15px 0;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>