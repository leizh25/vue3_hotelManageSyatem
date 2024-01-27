<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="inpRoleId" placeholder="请输入角色ID" clearable @clear="getData"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="search" type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="delete" type="danger" @click="deleteSelection">删除</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="inpRoleInfo.roleDep" placeholder="请输入角色信息" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="plus" type="primary" @click="addRole">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="roleList" @selection-change="selectionChangeHandle" stripe border>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="roleId" label="ID" width="50"></el-table-column>
        <el-table-column prop="roleDep" label="角色">
          <template #default="{ row, $index }">
            <span @click="edit(row, $index)" v-if="!row.isFocus">{{ row.roleDep }}</span>
            <el-input :ref="(vc: any) => (inputArr[$index] = vc)" v-model="row.roleDep" v-else @blur="save(row)"></el-input>
            <!-- <el-select v-model="value" placeholder="Select" style="width: 240px">
                        </el-select> -->
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <!-- <el-button type="warning" size="small" @click="edit(row)">修改</el-button> -->
            <el-popconfirm :title="`确定删除 ${row.roleDep} 吗?`" width="200" @confirm="deleteRole(row.roleId)">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
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
    <!-- <el-dialog :visible="showDialog">
            <template #title>编辑角色</template>
            <el-form ref="form" :model-value="formdata" label-width="100px" label-position="right">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                </el-form-item>
            </el-form>
        </el-dialog> -->
  </div>
</template>
<script setup lang="ts">
import { reqRoles, reqRoleById, reqDeleteRoles, reqAddRole } from '@/api/role'
import type { AllRolesResponse, Role, RoleByIdResponse } from '@/api/role/type'
import { Response } from '@/api/stay/type'
import { reqUpdateRole } from '@/api/role'
import { ElMessage } from 'element-plus'

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const roleList = ref<Role[]>([])
const name = ref('')
const inputArr = ref<any>([])
const selections = ref<Role[]>([])
const inpRoleId = ref()
const inpRoleInfo = reactive({ roleDep: '' })
// const showDialog = ref(false)
// let formdata = reactive<Role>({
//     roleId: 0,
//     roleDep: ""
// })
onMounted(() => {
  getData()
})
const getData = async (p: number = page.value, ps: number = pageSize.value, n: string = name.value) => {
  try {
    p && (page.value = p)
    const res: AllRolesResponse = await reqRoles(p, ps, n)
    if (res.code === 1) {
      roleList.value = res.data.records
      total.value = res.data.total
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
const deleteRole = (id: number) => {
  // console.log(id);
  deleteSelection([id])
}
const edit = (role: Role, index: number) => {
  // formdata = role
  role.isFocus = true
  nextTick(() => inputArr.value[index].focus())
}
const save = async (role: Role) => {
  try {
    role.isFocus = false
    const res: Response = await reqUpdateRole(role)
    if (res.code === 1) {
      ElMessage.success('更新成功')
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
const selectionChangeHandle = (selection: Role[]) => {
  // console.log('selection: ', selection);
  selections.value = selection
}
const search = () => {
  // if (inpRoleId.value.trim() !== '') {
  // getData(1, pageSize.value, inpRoleId.value.trim() || "")
  // }
  inpRoleId.value.trim() ? getRoleById() : getData()
}
const getRoleById = async () => {
  try {
    const res: RoleByIdResponse = await reqRoleById(inpRoleId.value)
    if (res.code === 1) {
      roleList.value = [res.data]
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
const deleteSelection = async (ids: number[] = selections.value.map((item) => item.roleId)) => {
  try {
    const res: Response = await reqDeleteRoles(ids)
    if (res.code === 1) {
      ElMessage.success('删除成功')
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}

const addRole = async () => {
  try {
    const res: Response = await reqAddRole(inpRoleInfo)
    if (res.code === 1) {
      ElMessage.success('添加成功')
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}

const sizeChangeHandle = (ps: number) => {
  getData(page.value, ps)
}
</script>
<style lang="less"></style>
