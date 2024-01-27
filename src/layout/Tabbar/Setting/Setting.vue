<template>
  <el-button size="small" circle icon="Refresh" @click="updateRefresh"></el-button>
  <el-button size="small" circle icon="FullScreen" @click="fullScreen"></el-button>
  <el-button size="small" circle icon="Setting"></el-button>
  <img :src="userStore.avatar" style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.userName }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="updatePassword">修改密码</el-dropdown-item>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <Teleport to="body">
    <el-dialog v-model="dialogVisible" title="修改密码" width="30%">
      <el-form v-model="formData" label-width="80">
        <el-form-item label="原密码">
          <el-input v-model="formData.old_password" type="password" placeholder="请输入原密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="formData.new_password" type="password" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="formData.confirm_password" type="password" placeholder="请确认密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </Teleport>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
//过去layout小仓库
import useLayoutSettingStore from '@/store/modules/setting'
//获取用户相关小仓库
import useUserStore from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import type { Response } from '@/api/stay/type'
import { reqUpdatePassword } from '@/api/user'
import type { UpdatePasswordForm } from '@/api/user/type'

//获取路由器对象
const $router = useRouter()
const $route = useRoute()
const userStore = useUserStore()
const layoutSettingStore = useLayoutSettingStore()
const dialogVisible = ref(false)
const formData = reactive<UpdatePasswordForm>({
  old_password: '', //旧密码
  new_password: '', //新密码
  confirm_password: '', //确认密码
  empId: userStore.empId, //员工id
})
//刷新按钮点击的回调
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
//点击全屏按钮的回调
const fullScreen = () => {
  //DOM对象的一个属性, 可以用来判断当前是不是全屏模式[全屏:true,不是全屏:null]
  let full = document.fullscreenElement
  //切换全屏模式  文档根节点的方法requestFullscreen()实现全屏模式
  if (!full) document.documentElement.requestFullscreen()
  else document.exitFullscreen()
}
//退出登录点击的回调
const logout = () => {
  //1.向服务器发请求[退出登录接口]
  //2.仓库中关于用户相关的数据清空[token|userName|avatar]
  //3.跳转到登录页面
  userStore.userLogout()
  //跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
const updatePassword = () => {
  dialogVisible.value = true
}
const save = async () => {
  if (formData.old_password === formData.new_password) {
    ElMessage.error('新密码不能与旧密码相同')
    //1.修改用户密码
    //2.修改token
    //3.跳转到登录页面
    // userStore.updatePassword(password.value)
  } else if (formData.confirm_password !== formData.new_password) {
    ElMessage.error('确认密码不一致')
  } else {
    try {
      delete formData.confirm_password
      const res: Response = await reqUpdatePassword(formData)
      if (res.code === 1) {
        dialogVisible.value = false
        ElMessage.success('修改密码成功')
        userStore.userLogout()
        $router.push({ path: '/login', query: { redirect: $route.path } })
      } else {
        throw new Error(res.msg)
      }
    } catch (error) {
      ElMessage.error((error as Error).message)
    }
  }
}
</script>
<style scoped></style>
