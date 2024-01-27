<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginFormData" :rules="rules" ref="loginForm">
          <h1>Hello</h1>
          <h2>欢迎来到酒店管理系统</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginFormData.empPhone"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" type="password" show-password v-model="loginFormData.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login_btn" type="primary" size="default" :loading="loading" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
//引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
//引入获取当前时间的函数
import { getTime } from '@/utils/time'
let userStore = useUserStore()
//获取路由器
let $router = useRouter()
//获取路由对象
const $route = useRoute()
//收集账号与密码的数据
let loginFormData = reactive({ empPhone: '18111111111', password: 'admin' })
//定义一个变量控制按钮按钮加载效果
let loading = ref(false)
//获取el-form组件
let loginForm = ref()
//登录按钮的回调
const login = async () => {
  //保证全局表单项校验通过再发请求
  await loginForm.value.validate()

  //加载效果:开始加载
  loading.value = true
  //点击登录按钮以后干什么?
  //通知仓库发登录请求
  //请求成功 -> 跳转到首页
  //请求失败 -> 弹出登录失败信息
  try {
    //保证登录成功
    await userStore.userLogin(loginFormData)
    //编程式导航跳转到展示数据首页
    //判断登录的时候, 路由路径当中是否有query参数,如果有就往query参数挑转, 没有就跳转到首页
    $router.push($route.query.redirect ? ($route.query.redirect as string) : '/')
    //登录成功提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi, ${getTime()}好`,
    })
    //登陆成功:加载效果消失
    loading.value = false
  } catch (error) {
    //登录失败:加载效果消失
    loading.value = false
    //登录失败提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
//自定义校验规则函数
const validateUsername = (_rule: any, value: any, callback: any) => {
  //rule 为数组校验规则对象
  // console.log('rule: ', rule);
  //value为表单元素文本内容
  // console.log('value: ', value);
  //callback:如果符合条件callback放行通过即可  如果不符合条件,callback方法注入错误提示信息
  // console.log('callback: ', callback);
  if (value.length >= 5) callback()
  else callback(new Error('账号长度至少5位'))
}
const validatePassword = (_rulea: any, value: any, callback: any) => {
  if (value.length >= 5) callback()
  else callback(new Error('密码长度至少5位'))
}

//定义表单对象需要的配置对象
const rules = {
  //规则对象属性的说明:
  //required,代表字段务必要校验的
  //min:文本的长度至少多少位
  //max:文本的长度最多多少位
  //message:错误的提示信息
  //trigger:触发校验表单的时机  change:文本发生变化  blur:失去焦点
  empPhone: [
    // { required: true, min: 6, max: 10, message: '账号长度应为6-10位', trigger: 'blur' }
    { trigger: 'change', validator: validateUsername },
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码长度应为6-15位', trigger: 'change' }
    { trigger: 'change', validator: validatePassword },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}
.login_form {
  width: 80%;
  position: relative;
  top: 30vh;
  background: url('@/assets/images/login_form.png') no-repeat;
  background-size: cover;
  padding: 40px;
  h1 {
    color: #fff;
    font-size: 40px;
  }
  h2 {
    color: #fff;
    font-size: 20px;
    margin: 20px 0;
  }
  .login_btn {
    width: 100%;
  }
}
</style>
