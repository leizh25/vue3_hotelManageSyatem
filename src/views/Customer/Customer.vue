<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="姓名">
          <el-input placeholder="请输入姓名" v-model="name" clearable @clear="getData"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData(current, pageSize, name)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addCustomer">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="delSelections" :disabled="!selections.length">批量删除</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="customers" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="ID" prop="customersId"></el-table-column>
        <el-table-column label="姓名" prop="customersName"></el-table-column>
        <el-table-column label="手机号" prop="customersPhone"></el-table-column>
        <el-table-column label="身份证" prop="customersIdCar"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="warning" @click="edit(row)" icon="edit">编辑</el-button>
            <el-popconfirm :title="`你确定删除 ${row.customersName} 吗`" @confirm="del(row)" width="200">
              <template #reference>
                <el-button type="danger" icon="delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="current"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        :background="true"
        layout="prev, pager, next, ->, jumper,total, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="getData"
        style="margin-top: 30px"
      />
    </el-card>
    <el-dialog v-model="showDia" :title="`${formData.customersId ? '修改顾客信息' : '添加顾客'}`" width="500px">
      <el-form v-model="formData" label-width="100px">
        <el-form-item label="ID" v-if="formData.customersId">
          <el-input v-model="formData.customersId" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formData.customersName"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.customersPhone"></el-input>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="formData.customersIdCar"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDia = false">取消</el-button>
          <el-button type="primary" @click="addOrUpdateHandle">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reqAllCustomers, reqDeleteCustomer, reqAddOrUpdateCustomer } from '@/api/customer'
import type { AllCustomersResponse, Customer, Response } from '@/api/customer/type'
import { ElMessage } from 'element-plus'
const total = ref(1001)
const pageSize = ref(10)
const current = ref(1)
const name = ref('')
const customers = ref<Customer[]>([])
const selections = ref<Customer[]>([])
const showDia = ref(false)
let formData = reactive<Customer>({})
onMounted(() => {
  getData()
})
const getData = async (p: number = current.value, ps: number = pageSize.value, n: string = name.value) => {
  try {
    const res: AllCustomersResponse = await reqAllCustomers(p, ps, n)
    if (res.code === 1) {
      total.value = res.data.total
      customers.value = res.data.records
      // console.log(customers.value)
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
const edit = (row: Customer) => {
  showDia.value = true
  formData = row
}
const del = (row: Customer) => {
  delCustomer([row.customersId as number])
}
const handleSizeChange = (ps: number = pageSize.value) => {
  pageSize.value = ps
  current.value = 1
  getData()
}

const handleSelectionChange = async (selection: Customer[]) => {
  selections.value = selection
}
const delCustomer = async (ids: number[]) => {
  try {
    const res: Response = await reqDeleteCustomer(ids)
    if (res.code === 1) {
      ElMessage.success('删除成功')
      getData()
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message) || '系统错误'
  }
}
const delSelections = async () => {
  delCustomer(selections.value.map((item) => item.customersId as number))
}
const addOrUpdateHandle = async () => {
  try {
    const res: Response = await reqAddOrUpdateCustomer(formData)
    if (res.code === 1) {
      ElMessage.success('保存成功')
      showDia.value = false
      getData()
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
const addCustomer = () => {
  showDia.value = true
  Object.assign(formData, { customersId: '', customersName: '', customersPhone: '', customersIdCar: '' })
}
</script>
<style lang="less" scoped>
.el-input {
  --el-input-width: 200px;
}
</style>
