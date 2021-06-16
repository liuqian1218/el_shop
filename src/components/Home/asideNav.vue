<template>
   <el-menu
      background-color="#373d41"
      text-color="#fff"
      active-text-color="#409fff" 
      unique-opened
      :collapse="collapse"
      :collapse-transition="false"
      router
      :default-active="activePath">
        <SubMenu v-for="item in menus" :submenus="item" :key="item.id"></SubMenu>
       
    </el-menu>
</template>

<script>
import SubMenu from './subMenus.vue'
export default {
    name:"AsideNav",
    components:{
        SubMenu,
    },
    data(){
        return {
            activePath:'',
        }
    },
    props:{
        menus:{
            type:Array,
            default(){
                return []
            }
        },
        collapse:{
            type:Boolean,
            default(){
                return false
            }
        },
    },
    created(){
         this.activePath = window.sessionStorage.getItem("activePath")
    },
}
</script>

<style lang="less" scoped>
.el-menu{
    border:0;
}
</style>