<template>
  <el-menu-item :index="menuitems.id+''" @click="saveNavState">
    <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{menuitems.authName}}</span>
    </template>
</el-menu-item>
</template>

<script>
export default {
    name:"MenuItem",
    props:{
        menuitems:{
            type:Object,
            default(){
                return {}            
            }
        },
    },
    methods:{
        saveNavState(){
            window.sessionStorage.setItem("activePath",this.menuitems.id);
        },
    },
}
</script>

<style lang="less" scoped>

</style>