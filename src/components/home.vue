<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="logo">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="isCollapse ? '64px' : '200px' ">
        <div class="toggle-button" @click="toggleBtn">|||</div>
        <AsideNav :menus="menus" :collapse="isCollapse"></AsideNav>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { request } from '../network'
import AsideNav from './Home/asideNav.vue'
export default {
  name: 'Home',
  components:{
    AsideNav
  },
  data(){
    return {
      menus:[],
      isCollapse:false ,
    }
  },
  created(){
    this.getMenus();
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenus(){
      request({
        url:"menus",
        methods:"get"
      }).then(res => {
        // console.log(res);
        const {meta,data} = res ;
        if(meta.status != 200){
          return this.$message.error(meta.msg)
        }else{
          this.menus = data ;
        }
      }).catch(err => console.log(err))
    },
    toggleBtn(){
      this.isCollapse = !this.isCollapse;
    },
  }
}
</script>

<style lang="less" scoped>
  .el-header{
    background-color: #373d41;
    display:flex;
    justify-content: space-between;
    padding-left:0;
    align-items: center;
    color:#fff;
    font-size: 20px;
    img{
      height:50px;
      margin-right:10px;
    }
    >div{
      display:flex ;
      align-items: center;
    }
  }

  .el-aside{
    background-color: #333744;
  }
  .el-main{
    background-color: #eaedf1;
    height:calc( 100vh - 60px );
    overflow: scroll;
  }
  .home-container{
    height:100%;
  }
  .toggle-button{
    background-color: #4a5064;
    font-size:10px;
    line-height:24px;
    text-align: center;
    color:#fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
