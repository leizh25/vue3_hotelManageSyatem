<template>
  <div>
    <el-card class="bg" style="width: 100%; height: 800px; position: relative">
      <el-calendar v-model="date" style="width: 500px; position: absolute; right: 20px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)" />
      <div style="width: 60%">
        <div style="display: flex">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; margin-right: 20px">常用入口</h1>
          <el-popover placement="bottom" title="选择常用标签" :width="200" trigger="click">
            <template #reference>
              <el-icon size="24" style="cursor: pointer">
                <Setting />
              </el-icon>
            </template>
            <el-checkbox-group v-model="checkList" @change="checkListChangeHandler">
              <el-checkbox v-for="(item, index) in menuRoutes" :key="index" :label="item.meta.title" v-model="item.path"></el-checkbox>
            </el-checkbox-group>
          </el-popover>
        </div>
        <router-link :to="getPath(item)" v-for="(item, index) in collectedMenu" :key="index" style="margin-right: 20px">
          <el-button size="large" type="primary">{{ item }}</el-button>
        </router-link>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
const date = ref(new Date())
const menuRoutes = ref<any>([])
const checkList = ref<any>([])
const collectedMenuString = ref<string>()
const collectedMenu = ref<any[]>()
onMounted(() => {
  menuRoutes.value = getRoutes(userStore.menuRoutes)
  collectedMenuString.value = localStorage.getItem('collectedMenuString') as string
  checkList.value = localStorage.getItem('collectedMenuString')?.split(',')
})
watch(
  () => collectedMenuString.value,
  (newVal) => {
    collectedMenu.value = newVal?.split(',')?.filter((item) => item)
    // console.log('collectedMenu.value: ', collectedMenu.value);
  },
  {
    immediate: true,
  },
)
const getRoutes = (routes: any) => {
  routes.forEach((item: any) => {
    if (!item.children && !item.meta.hidden) {
      menuRoutes.value.push(item)
    }
    if (item.children && item.children.length == 1 && !item.children[0].meta.hidden) {
      menuRoutes.value.push(item.children[0])
    }
    if (item.children && item.children.length > 1) {
      getRoutes(item.children)
    }
  })
  return menuRoutes.value
}
const checkListChangeHandler = (param: any) => {
  // console.log('param: ', param);
  localStorage.setItem('collectedMenuString', param)
  collectedMenuString.value = localStorage.getItem('collectedMenuString') as string
}
const getPath = (str: string) => {
  let arr = menuRoutes.value.filter((item: any) => {
    if (item.meta.title === str) return true
  })
  return arr[0] ? arr[0].path : '/'
}
</script>
<style>
.bg {
  /* background: url(../../assets/images/bg.webp) no-repeat; */
  background-size: 100% 100%;
}
</style>
