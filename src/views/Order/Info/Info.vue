<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="查询类型">
          <el-select v-model="queryType">
            <el-option label="订单ID" value="id" />
            <el-option label="用户名" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="content" placeholder="内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query()" @clear="getAllOrders()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrder">添加订单</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="deteleOrder(selection)" :disabled="!selection.length">删除选中</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="orders" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column label="订单ID" prop="orderId" width="80" align="center"></el-table-column>
        <el-table-column label="用户" prop="orderName" width="80" align="center"></el-table-column>
        <el-table-column label="手机号" prop="orderPhone" width="130" align="center"></el-table-column>
        <el-table-column label="房间类型" prop="roomTypeName" align="center"></el-table-column>
        <el-table-column label="酒店" prop="hotelName" align="center"></el-table-column>
        <el-table-column label="入住日期" prop="checkInDate" align="center"></el-table-column>
        <el-table-column label="退住日期" prop="checkOutDate" align="center"></el-table-column>
        <el-table-column label="下单时间" align="center">
          <template #default="{ row }">
            <div>{{ dayjs(row.createTime).format('YYYY-MM-DD') }}</div>
            <div>{{ dayjs(row.createTime).format('HH:mm:ss') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" prop="orderState" align="center">
          <template #default="{ row }">
            <el-tag :type="tagTypes[row.orderState] || 'danger'">{{ orderStates[row.orderState] || '异常' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单价格" prop="orderPrice" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="170">
          <template #default="{ row }">
            <el-button type="warning" icon="edit" size="small" @click="edit(row)">修改</el-button>
            <el-popconfirm :title="`您确定要删除订单${row.orderId}吗?`" width="200" @confirm="deteleOrder([row])">
              <template #reference>
                <el-button type="danger" icon="delete" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="pageSize"
        :page-sizes="[10, 20, 30]"
        :page="page"
        :total="total"
        :background="true"
        layout="prev, pager, next, ->, jumper,total, sizes"
        @size-change="handleSizeChange"
        @current-change="getAllOrders"
        style="margin-top: 30px"
      ></el-pagination>
    </el-card>
    <el-dialog v-model="dialogFormVisible" :title="`${formData.orderId ? '修改订单' : '添加订单'}`">
      <el-form :model="formData" label-width="100">
        <el-form-item label="用户">
          <el-input v-model="formData.orderName"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.orderPhone"></el-input>
        </el-form-item>
        <el-form-item label="房间类型">
          <el-select v-model="formData.roomTypeId" filterable placeholder="点我搜索房型">
            <el-option label="大床房" value="1" />
            <el-option label="豪华间" value="2" />
            <el-option label="标准间" value="3" />
            <el-option label="双床房" value="4" />
            <el-option label="单床房" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="入住酒店">
          <el-select v-model="formData.hotelId" filterable placeholder="点我搜索酒店">
            <el-option v-for="item in allHotels" :key="item.hotelId" :value="item.hotelId" :label="item.hotelName" />
          </el-select>
        </el-form-item>
        <el-form-item label="入住日期">
          <el-date-picker
            v-model="formData.dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input type="number" v-model="formData.orderPrice"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <!-- <el-select v-model="formData.orderState">
                        <el-option v-for="(item, index) in orderStates" :key="index" :label="item" :value="index"></el-option>
                    </el-select> -->
          <el-radio-group v-model="formData.orderState">
            <el-radio v-for="(item, index) in orderStates" :key="index" :label="index">{{ item }}</el-radio>
          </el-radio-group>
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
import { reqAllOrders, reqDeleteOrder, reqOrderByOrderId, reqAddOrUpdateOrder } from '@/api/order/info'
import type { Order, OrderResponse, OrderByOrderIdResponse } from '@/api/order/type'
import { reqAllHotels2 } from '@/api/hotel'
import type { AllHotelsResponse } from '@/api/hotel/type'
import { ElMessage } from 'element-plus'
import * as dayjs from 'dayjs'
import type { Response } from '@/api/stay/type'
import { Hotel } from '@/api/hotel/type'

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const content = ref<string | number>('')
const orders = ref<Order[]>([])
// const orderStates = ['待支付', '已支付', '已取消', '已退款', '已入住']
const orderStates = ['未入住', '已入住', '已退房']
const tagTypes = ['warning', 'success', 'info']
const selection = ref<Order[]>([])
const queryType = ref('id')
const allHotels = ref<Hotel[]>([])
const dialogFormVisible = ref(false)
const formData = ref<Order>({})
onMounted(() => {
  getAllOrders()
})
const getAllOrders = async (p: number = page.value, ps: number = pageSize.value, n: string = content.value as string) => {
  try {
    const res: OrderResponse = await reqAllOrders(p, ps, n)
    if (res.code === 1) {
      orders.value = res.data.records
      total.value = res.data.total
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error({ message: (error as Error).message || '加载失败' })
  }
}
const query = () => {
  if (content.value === '') {
    ElMessage.warning({ message: '请输入查询内容' })
    return getAllOrders()
  }
  if (queryType.value === 'user') {
    page.value = 1
    pageSize.value = 10
    getAllOrders(page.value, pageSize.value, content.value as string)
  } else if (queryType.value === 'id') {
    page.value = 1
    pageSize.value = 10
    getOrdersById(content.value as number)
  }
}
const handleSizeChange = (ps?: number) => {
  page.value = 1
  pageSize.value = ps as number
  getAllOrders(page.value, pageSize.value, content.value as string)
}
const deteleOrder = async (orders: Order[]) => {
  try {
    const res: Response = await reqDeleteOrder(orders.map((order) => order.orderId as number))
    if (res.code === 1) {
      ElMessage.success({ message: '删除成功' })
      getAllOrders()
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error({ message: (error as Error).message || '删除失败' })
  }
}
const handleSelectionChange = (rows: Order[]) => {
  selection.value = rows
}
const getOrdersById = async (id: number) => {
  try {
    const res: OrderByOrderIdResponse = await reqOrderByOrderId(id)
    if (res.code === 1) {
      orders.value = [res.data]
      page.value = 1
      pageSize.value = 1
      total.value = 1
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error({ message: (error as Error).message || '加载失败' })
  }
}
const addOrder = () => {
  dialogFormVisible.value = true
  formData.value = {}
  getAllHotels()
}
const getAllHotels = async () => {
  try {
    const res: AllHotelsResponse = await reqAllHotels2()
    if (res.code === 1) {
      allHotels.value = res.data.records
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error({ message: (error as Error).message || '加载酒店列表失败' })
  }
}
/* const dateRange = computed(() => {
    // const date = new Date()
    // const year = date.getFullYear()
    // const month = date.getMonth() + 1
    // const day = date.getDate()
    return [new Date(), new Date()]
}) */

const save = async () => {
  try {
    const dateRange = formData.value.dateRange
    formData.value.checkInDate = dateRange![0]
    formData.value.checkOutDate = dateRange![1]
    formData.value.orderState = formData.value.orderState?.toString()
    const res: Response = await reqAddOrUpdateOrder(formData.value)
    if (res.code === 1) {
      ElMessage.success({ message: '保存成功' })
      dialogFormVisible.value = false
      getAllOrders()
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error({ message: (error as Error).message || '保存失败' })
  }
}

const edit = (order: Order) => {
  dialogFormVisible.value = true
  formData.value = order
  formData.value.dateRange = [order.checkInDate as string, order.checkOutDate as string]
  formData.value.orderState = +order.orderState!
  getAllHotels()
}
</script>
<style lang="less"></style>
