<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="layoutSettingStore.fold ? 'Expand' : 'Fold'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 动态展示路由名字和标题 -->
    <el-breadcrumb-item v-for="item in $route.matched" :key="item.path" v-show="item.meta.title" :to="item.path">
      <!-- 面包屑展示路由的图标 -->
      <el-icon style="margin: 0 2px">
        <component :is="item.meta.icon" v-if="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑展示路由的标题 -->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting.ts'
import { useRoute } from 'vue-router'
//获取layout配置相关的仓库
let layoutSettingStore = useLayoutSettingStore()
//获取路由对象
const $route = useRoute()
//点击图标的方法
const changeIcon = () => {
  //图标进行切换
  layoutSettingStore.fold = !layoutSettingStore.fold
}
</script>
<style scoped></style>
