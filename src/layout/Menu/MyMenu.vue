<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children && showRoute(item)">
      <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由但是只有一个子路由 -->
    <template v-if="item.children && item.children.length == 1 && showRoute(item)">
      <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta.hidden && showRoute(item)" @click="goRoute">
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由且个数不止1个 -->
    <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 1 && showRoute(item)">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <MyMenu :menuList="item.children"></MyMenu>
    </el-sub-menu>
  </template>
</template>
<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { useRouter } from 'vue-router'
//获取父组件传递过来的全部路由的数据
defineProps(['menuList'])
//获取路由器对象
const $router = useRouter()
const userStore = useUserStore()
let showRoute = (item: any) => {
  if (item.meta.access) {
    if (item.meta.access.includes(userStore.roleId)) return true
    else return false
  } else {
    return true
  }
}
//点击菜单的回调
const goRoute = (vc: any) => {
  //路由跳转
  $router.push(vc.index)
  // console.log('vc.index: ', vc.index);
}
</script>
<script lang="ts">
export default {
  name: 'MyMenu',
}
</script>
<style scoped></style>
