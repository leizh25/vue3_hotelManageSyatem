<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="roomId" placeholder="请输入房间ID" clearable :clear="getData()"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="search" type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="plus" type="primary" @click="addRoom">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="delete" type="danger" @click="delSelection()" :disabled="selections.length === 0">删除</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="roomList" @selection-change="(selection: Room[]) => (selections = selection)" border stripe>
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column prop="roomId" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="roomNumber" label="房号" width="100" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.roomState"
              width="60"
              active-value="0"
              inactive-value="1"
              inline-prompt
              active-text="空闲"
              inactive-text="有人"
              @change="changeState(row.roomId, row.roomState)"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column prop="typeName" label="类型"></el-table-column> -->
        <el-table-column prop="typeName" label="类型" align="center">
          <template #default="{ row }">
            <el-select v-model="row.roomTypeId" @change="changeState(row.roomId, row.roomState, row.roomTypeId)">
              <el-option v-for="item in allRoomType" :key="item.roomTypeId" :label="item.typeName" :value="item.roomTypeId"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="empName" label="员工姓名"></el-table-column> -->
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <!-- <el-button type="warning" size="small">编辑</el-button> -->
            <el-popconfirm :title="`确定删除${row.roomNumber}吗`" @confirm="delSelection([row.roomId])">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="pageSize"
        :current-page="page"
        :total="total"
        :page-sizes="[10, 20, 30]"
        @size-change="(ps: number) => getData(page, ps)"
        @current-change="getData"
        layout="prev, pager, next, ->, jumper, total, sizes"
        background
        style="margin-top: 20px"
      ></el-pagination>
    </el-card>
    <el-dialog v-model="showDialog" title="添加房间">
      <el-form v-model="formData">
        <el-form-item label="房号">
          <el-input v-model="formData.roomNumber" placeholder="请输入房号" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.roomState" inline-prompt active-text="空闲" inactive-text="有人" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="formData.roomTypeId" placeholder="请选择类型">
            <el-option v-for="item in allRoomType" :key="item.roomTypeId" :label="item.typeName" :value="item.roomTypeId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmAddroom">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { Response } from '@/api/hotel/type'
import { reqAllRooms, reqAddOrUpdateRoom, reqDelRooms, reqRoomById } from '@/api/room'
import type { AllRoomsResponse, RoomByIdResponse } from '@/api/room/type'
import type { Room } from '@/api/room/type'
import { ElMessage } from 'element-plus'
import { reqAllRoomType } from '@/api/roomType'
import { AllRoomTypeResponse, RoomType } from '@/api/roomType/type'

const page = ref<number>(1)
const pageSize = ref<number>(10)
const roomList = ref<Room[]>([])
const total = ref<number>(0)
const selections = ref<Room[]>([])
const showDialog = ref<boolean>(false)
const formData = ref<Room>({})
const roomId = ref<string>('')
const allRoomType = ref<RoomType[]>([])
onMounted(() => {
  getData()
  getAllRoomType()
})
const getData = async (p: number = page.value, ps: number = pageSize.value) => {
  try {
    const res: AllRoomsResponse = await reqAllRooms(p, ps)
    // console.log('res: ', res);
    if (res.code === 1) {
      roomList.value = res.data.records
      page.value = res.data.current
      pageSize.value = res.data.size
      total.value = res.data.total
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
const changeState = async (roomId: number, roomState?: number, roomTypeId?: number) => {
  try {
    const res: Response = await reqAddOrUpdateRoom({ roomId, roomState: roomState?.toString(), roomTypeId })
    if (res.code === 1) {
      ElMessage.success('修改成功')
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}

const addRoom = async () => {
  showDialog.value = true
  formData.value = {}
}
const confirmAddroom = async () => {
  try {
    const res: Response = await reqAddOrUpdateRoom(formData.value)
    if (res.code === 1) {
      ElMessage.success('添加成功')
      getData()
      showDialog.value = false
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
const delSelection = async (ids: number[] = selections.value.map((item) => item.roomId as number)) => {
  // console.log('ids: ', ids);
  try {
    const res: Response = await reqDelRooms(ids)
    if (res.code === 1) {
      ElMessage.success('删除成功')
      getData()
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}

const query = async () => {
  try {
    if (!roomId.value.trim()) return getData()
    const res: RoomByIdResponse = await reqRoomById(roomId.value.trim())
    if (res.code === 1) {
      roomList.value = [res.data]
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}

const getAllRoomType = async () => {
  try {
    const res: AllRoomTypeResponse = await reqAllRoomType()
    if (res.code === 1) {
      allRoomType.value = res.data
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
</script>
<style lang="less"></style>
