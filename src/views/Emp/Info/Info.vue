<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="name" clearable placeholder="请输入姓名" @clear="getData"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="deleteSelection()" :disabled="!selection.length">删除</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="empList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="ID" prop="empId" width="50" align="center"></el-table-column>
        <el-table-column label="姓名" prop="empName" width="100" align="center"></el-table-column>
        <el-table-column label="性别" prop="empSex" width="70" align="center">
          <template #default="{ row }">
            <div>{{ row.empSex === '1' ? '男' : '女' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="职位" prop="positions" align="center"></el-table-column>
        <el-table-column label="电话" prop="empPhone" align="center"></el-table-column>
        <el-table-column label="角色" prop="roleDep" align="center"></el-table-column>
        <el-table-column label="地址" prop="empAddress" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="edit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="del(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        @size-change="sizeChangeHandle"
        @current-change="getData"
        layout="prev, pager, next, ->, jumper, total, sizes"
        background
        style="margin-top: 20px"
      ></el-pagination>
    </el-card>
    <el-dialog v-model="dialogFormVisible" :title="`${formData.empId ? '编辑' : '新增'}员工`">
      <el-form :model="formData">
        <el-form-item label="头像" prop="empPhoto">
          <!-- <el-input v-model="formData.empPhoto" placeholder="请输入姓名" /> -->
          <!-- <el-avatar :src="formData.empPhoto" /> -->
          <el-upload
            class="avatar-uploader"
            :action="`${prefix}/common/upload`"
            :data="{ old_images: formData.empPhoto }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <el-tooltip class="box-item" effect="dark" content="点击上传头像" placement="top">
              <img v-if="formData.empPhoto" :src="formData.empPhoto" style="width: 50px; height: 50px; border-radius: 50%" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-tooltip>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名" prop="empName">
          <el-input v-model="formData.empName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="empSex">
          <el-radio-group v-model="formData.empSex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="职位" prop="positions">
          <el-input v-model="formData.positions" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="电话" prop="empPhone">
          <el-input v-model="formData.empPhone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" type="password" show-password />
        </el-form-item>
        <el-form-item label="地址" prop="empPhone">
          <el-input v-model="formData.empAddress" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="角色" prop="roleDep">
          <el-select v-model="formData.roleId" placeholder="请选择角色">
            <el-option v-for="item in roles" :key="item.roleId" :label="item.roleDep" :value="item.roleId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reqAllEmps, reqDelRmps, reqAddOrUpdateEmp } from '@/api/emp'
import type { AllEmpsResponse, Emp } from '@/api/emp/type'
import { Response } from '@/api/stay/type'
import { ElMessage } from 'element-plus'
import { reqAllRoles } from '@/api/role'
import type { AllRolesResponse, Role } from '@/api/role/type'
import _ from 'lodash'
// import { reqUpload } from "@/api/upload"

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const empList = ref<Emp[]>([])
const name = ref('')
const selection = ref<Emp[]>([])
const dialogFormVisible = ref(false)
const formData = ref<Emp>({})
const roles = ref<Role[]>([])
const prefix = import.meta.env.VITE_APP_BASE_API || ''

onMounted(() => {
  getData()
  getAllRoles()
  // console.log(import.meta.env.VITE_APP_BASE_API);
})
const getData = async (p: number = page.value, ps: number = pageSize.value, n: string = name.value) => {
  try {
    page.value = p
    const res: AllEmpsResponse = await reqAllEmps(p, ps, n)
    if (res.code === 1) {
      empList.value = res.data.records
      total.value = res.data.total
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error({ message: (error as Error).message })
  }
}

const handleSelectionChange = (emp: Emp[]) => {
  // console.log(emp)
  selection.value = emp
}

const sizeChangeHandle = (ps: number = pageSize.value) => {
  pageSize.value = ps
  getData()
}
const deleteSelection = async (emps: Emp[] = selection.value) => {
  try {
    const res: Response = await reqDelRmps(emps.map((item) => item.empId as number))
    if (res.code === 1) {
      ElMessage.success({ message: '删除成功' })
      getData()
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error({ message: (error as Error).message })
  }
}

const edit = (emp: Emp) => {
  // console.log(emp)
  dialogFormVisible.value = true
  formData.value = _.cloneDeep(emp)
}
const del = (emp: Emp) => {
  // console.log(emp)
  deleteSelection([emp])
}
const save = async () => {
  try {
    const res: Response = await reqAddOrUpdateEmp(formData.value)
    if (res.code === 1) {
      ElMessage.success({ message: `${formData.value.empId ? '更新' : '新增'}成功` })
      dialogFormVisible.value = false
      getData()
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error({ message: (error as Error).message })
  }
}
const getAllRoles = async () => {
  try {
    const res: AllRolesResponse = await reqAllRoles()
    if (res.code === 1) {
      roles.value = res.data.records
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error({ message: (error as Error).message })
  }
}

const handleAvatarSuccess = (res: any) => {
  // console.log('res: ', res);
  formData.value.empPhoto = res.data[0]
}
const beforeAvatarUpload = (rawFile: File) => {
  // console.log('rawFile: ', rawFile);
  if (['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].indexOf(rawFile.type) === -1) {
    ElMessage.error('图片格式错误')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片过大,2MB!')
    return false
  }
  return true
}

const add = () => {
  formData.value = {}
  dialogFormVisible.value = true
}
</script>
<style lang="less"></style>
