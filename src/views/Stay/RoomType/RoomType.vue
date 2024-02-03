<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="formData.typeName" clearable placeholder="添加房间类型"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="confirmAdd()">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" icon="delete" @click="deleteType()" :disabled="selections.length === 0">删除</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="allRoomType" border stripe @selection-change="selectionHandler">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column prop="roomTypeId" label="ID" width="180" align="center" />
        <el-table-column prop="typeName" label="类型" align="center">
          <template #default="{ row, $index }">
            <span v-if="!row.isFocus" @click="toFocus(row, $index)">{{ row.typeName }}</span>
            <el-input v-else :ref="(vc: any) => (inputArr[$index] = vc)" v-model="row.typeName" @blur="save(row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row, $index }">
            <el-button type="warning" size="small" @click="toFocus(row, $index)">编辑</el-button>
            <el-popconfirm :title="`确定删除 ${row.typeName} 吗`" width="200" @confirm="deleteType([row.roomTypeId])">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { reqAllRoomType, reqDeleteType, reqAddOrUpdateType } from '@/api/roomType'
import type { AllRoomTypeResponse, RoomType } from '@/api/roomType/type'
import { ElMessage } from 'element-plus'
import type { Response } from '@/api/stay/type'
const allRoomType = ref<RoomType[]>([])
let formData = reactive<RoomType>({
  bedNumber: '',
  bedSize: '',
  hotelId: '',
  roomPrice: '',
  roomSize: '',
  roomSurplus: '',
  roomTypeId: '',
  roomTypeImage: '',
  windows: '',
  typeName: '',
})

const selections = ref<RoomType[]>([])
const inputArr = ref<any[]>([])
onMounted(() => {
  getAllRoomType()
})
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

const deleteType = async (ids: number[] = selections.value.map((item) => item.roomTypeId as number)) => {
  try {
    const res: Response = await reqDeleteType(ids)
    if (res.code === 1) {
      ElMessage.success('删除成功')
      getAllRoomType()
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}


const confirmAdd = async (param: RoomType = formData) => {
  try {
    const res: Response = await reqAddOrUpdateType(param)
    if (res.code === 1) {
      ElMessage.success(param.roomTypeId ? '修改成功' : '添加成功')
      // showDialog.value = false
      getAllRoomType()
      formData.typeName = ''
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}

const selectionHandler = (roomType: RoomType[]) => (selections.value = roomType)

const toFocus = (roomType: RoomType, index: number) => {
  roomType.isFocus = true
  nextTick(() => inputArr.value[index].focus())
}
const save = (roomType: RoomType) => {
  roomType.isFocus = false
  confirmAdd(roomType)
}
</script>
<style lang="less"></style>
