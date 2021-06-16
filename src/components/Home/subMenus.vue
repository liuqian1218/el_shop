<template>
  <el-submenu :index="submenus.id+''">
    <template slot="title">
        <i class="el-icon-location"></i>
        <span>{{submenus.authName}}</span>
    </template>
    <MenuItem v-for="items in submenus.children" :menuitems="items" :key="items.id"></MenuItem>
    </el-submenu>
</template>

<script>
import MenuItem from './menuItem.vue'
export default {
    name:"SubMenu",
    components:{
        MenuItem,
    },
    props:{
        submenus:{
            type:Object,
            default(){
                return {}
            }
        },
    },
}
</script>

<style lang="less" scoped>

</style>