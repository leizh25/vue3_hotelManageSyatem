<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="查询类型">
          <el-select v-model="queryType">
            <el-option label="酒店" value="hotelId" />
            <el-option label="评论人" value="customerId" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="内容" v-model="content" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="deleteSelection" :disabled="!selection.length">删除</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="ID" prop="evaluationId" width="50"></el-table-column>
        <el-table-column label="酒店名称" width="170px">
          <template #default="{ row }">
            <div>{{ row.hotelName }}</div>
            <el-tag @click="toInput(1, row.hotelId)" style="cursor: pointer" size="small">输入ID</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评论人" width="70">
          <template #default="{ row }">
            <div>{{ row.customerName }}</div>
            <el-tag @click="toInput(2, row.customersId)" style="cursor: pointer" size="small">输入ID</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评分" prop="stars" width="180">
          <template #default="{ row }">
            <el-rate :model-value="Number(row.stars)" disabled :texts="rate" show-text />
          </template>
        </el-table-column>
        <el-table-column label="评论内容" prop="content"></el-table-column>
        <el-table-column label="评论时间" prop="createTime" width="110" align="center">
          <template #default="{ row }">
            <div>{{ dayjs(row.createTime).format('YYYY-MM-DD') }}</div>
            <div>{{ dayjs(row.createTime).format('HH:mm:ss') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm width="200" :title="`你确定要删除${row.customerName}吗?`" @confirm="handleDelete(row)">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
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
    <el-dialog v-model="dialogFormVisible" title="编辑">
      <el-form :model="formData" label-width="100">
        <!-- <el-form-item label="ID">
                    <el-input v-model="formData.evaluationId" disabled />
                </el-form-item> -->
        <el-form-item label="酒店名称">
          <el-input v-model="formData.hotelName" />
        </el-form-item>
        <el-form-item label="评论人">
          <el-input v-model="formData.customerName" />
        </el-form-item>
        <el-form-item label="评分">
          <el-rate v-model="formData.stars" :texts="rate" show-text />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="formData.content" type="textarea" />
        </el-form-item>
        <el-form-item label="时间">
          <!-- <el-input v-model="formData.createTime" /> -->
          <el-date-picker v-model="formData.createTime" type="datetime" placeholder="Select date and time" :default-time="formData.createTime" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reqAllComments, reqCommentByCustomerIdOrHotelId, reqDeleteCommentById, reqAddOrUpdateComment } from '@/api/order/comment'
import type { Comment, AllCommentsResponse } from '@/api/order/type'
import { Response } from '@/api/stay/type'
import { ElMessage } from 'element-plus'
import * as _ from 'lodash'
import * as dayjs from 'dayjs'

const current = ref(1)
const pageSize = ref(10)
const total = ref(0)
let list = ref<Comment[]>([])
const rate = ['一星', '二星', '三星', '四星', '五星']
const queryType = ref('')
const content = ref<number>()
let selection = ref<Comment[]>([])
let dialogFormVisible = ref<boolean>(false)
let formData = ref<Comment>({})
onMounted(() => {
  getData()
})
const getData = async (p: number = current.value, ps: number = pageSize.value) => {
  try {
    const res: AllCommentsResponse = await reqAllComments(p, ps)
    if (res.code === 1) {
      list.value = res.data.records
      total.value = res.data.total
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error({ message: (error as Error).message })
  }
}
const handleEdit = (cmt: Comment) => {
  // console.log(cmt);
  dialogFormVisible.value = true
  // formData = cmt
  // formData.value = JSON.parse(JSON.stringify(cmt))
  formData.value = _.cloneDeep(cmt)
  formData.value.stars = Number(formData.value.stars) || 0
  formData.value.createTime = new Date(formData.value.createTime as string)
}
const handleDelete = async (cmt?: Comment | Comment[]) => {
  // console.log(cmt);
  try {
    if (!Array.isArray(cmt)) cmt = [cmt] as Comment[]
    const res: Response = await reqDeleteCommentById(cmt.map((item) => item.evaluationId as number))
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
const deleteSelection = () => {
  handleDelete(selection.value)
}
const handleSelectionChange = (cmt: Comment[]) => {
  selection.value = cmt
}
const handleSizeChange = (ps: number = pageSize.value) => {
  pageSize.value = ps
  getData()
}
const query = async (t = queryType.value, id = content.value, p = current.value, ps: number = pageSize.value) => {
  try {
    if (!t || !id) {
      ElMessage.error({ message: '请输入完整查询条件' })
      return getData()
    }
    const res: AllCommentsResponse = await reqCommentByCustomerIdOrHotelId(t, id as number, p, ps)
    if (res.code === 1) {
      list.value = res.data.records
      total.value = res.data.total
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error({ message: (error as Error).message })
  }
}
const save = async () => {
  try {
    let tmpFormData = _.cloneDeep(formData.value)
    tmpFormData.createTime = dayjs(tmpFormData.createTime).format('YYYY-MM-DD HH:mm:ss')
    tmpFormData.stars = tmpFormData.stars?.toString()
    // @ts-ignore
    const res: Response = await reqAddOrUpdateComment(tmpFormData)
    if (res.code === 1) {
      dialogFormVisible.value = false
      ElMessage.success({ message: tmpFormData.evaluationId ? '修改成功' : '保存成功' })
      getData()
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error({ message: (error as Error).message || '保存失败' })
  }
}

const toInput = (t: number, id: number) => {
  // navigator.clipboard.writeText(id.toString())
  // ElMessage.success({ message: '复制成功' })
  if (t === 1) {
    queryType.value = 'hotelId'
  } else {
    queryType.value = 'customerId'
  }
  content.value = id
}
</script>
<style lang="less" scoped></style>
