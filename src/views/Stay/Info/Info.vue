<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="查询入住人">
        <el-input placeholder="请输入入住人" v-model="checkInName" clearable @enter.prevent @clear="getData"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleSearch" :disabled="!checkInName">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" icon="delete" @click="handleDelete" :disabled="!selectedRecords.length">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="records" @selection-change="handleSelectionChange">
      <el-table-column label="多选" type="selection" width="80"></el-table-column>
      <el-table-column label="入住ID" prop="checkInId"></el-table-column>
      <el-table-column label="入住人数" prop="checkInNumber"></el-table-column>
      <el-table-column label="订单ID" prop="orderId"></el-table-column>
      <el-table-column label="房间号" prop="roomNumber"></el-table-column>
      <el-table-column label="入住人" prop="checkInName"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-popconfirm :title="`确定删除入住人: ${row.checkInName} 吗？`" width="250" @confirm="handleDelete(row.checkInId)">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, -> ,sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="getData"
      style="margin-top: 20px"
    />
  </el-card>
</template>
<script setup lang="ts">
import { reqGetCheckin, reqDeleteCheckin } from '@/api/stay'
import type { CheckInRecord, CheckInResponse, Response } from '@/api/stay/type'
import { ElMessage } from 'element-plus'
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const checkInName = ref('')
let records = ref<CheckInRecord[]>([])
const selectedRecords = ref<CheckInRecord[]>([])
onMounted(() => {
  getData()
})

/**
 * 获取入住记录
 */
const getData = async (page: number = currentPage.value) => {
  try {
    if (page) {
      currentPage.value = page
    }
    const res: CheckInResponse = await reqGetCheckin(currentPage.value, pageSize.value, checkInName.value)
    if (res.code === 1) {
      total.value = res.data.total
      records.value = res.data.records
      currentPage.value = res.data.current
      total.value = res.data.total
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
    total.value = 0
    records.value = []
    currentPage.value = 1
  }
}
/**
 * pageSize改变的回调
 * @param ps 每页条数
 */
const handleSizeChange = (ps: number) => {
  pageSize.value = ps
  getData()
}

/**
 * 查询按钮的回调
 */
const handleSearch = () => {
  getData()
}

/**
 * 表格选中改变的回调
 * @param record 选中的行
 */
const handleSelectionChange = (record: CheckInRecord[]) => {
  selectedRecords.value = record
}

/**
 * 删除按钮的回调
 */
const handleDelete = async (id?: number) => {
  try {
    let ids: number[]
    if (typeof id !== 'number') {
      ids = selectedRecords.value.map((r) => r.checkInId)
    } else {
      ids = [id as number]
    }
    if (ids) {
      const res: Response = await reqDeleteCheckin(ids)
      if (res.code === 1) {
        ElMessage.success('删除成功')
        getData()
      } else {
        throw new Error(res.msg)
      }
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
</script>
<style lang="less"></style>
