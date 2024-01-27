<template>
  <div>
    <el-card>
      <h1 style="text-align: center; font-weight: bolder; color: #f00; font-size: 24px">正在写</h1>
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
    <!-- <el-dialog v-model="showDialog" title="添加房间类型">
            <el-form v-model="formData" label-width="100px">
                <el-form-item label="类型名称" required>
                    <el-input v-model="formData.typeName" placeholder="请输入类型名"></el-input>
                </el-form-item>
                <el-form-item label="酒店ID">
                    <el-input v-model="formData.hotelId" placeholder="请选择酒店"></el-input>
                </el-form-item>
                <el-form-item label="床数">
                    <el-input v-model="formData.bedNumber" placeholder="请输入床数"></el-input>
                </el-form-item>
                <el-form-item label="床型">
                    <el-input v-model="formData.bedSize" placeholder="请输入类床型"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="formData.roomPrice" placeholder="请输入价格"></el-input>
                </el-form-item>
                <el-form-item label="房间面积">
                    <el-input v-model="formData.roomSize" placeholder="请输入房间面积"></el-input>
                </el-form-item>
                <el-form-item label="窗户数量">
                    <el-input v-model="formData.windows" placeholder="请输入窗户数量"></el-input>
                </el-form-item>
                <el-form-item label="剩余房间数">
                    <el-input v-model="formData.roomSurplus" placeholder="请输入剩余房间数"></el-input>
                </el-form-item>
                <el-form-item label="房型">
                    <el-select></el-select>
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload v-model:file-list="fileList" :action="`${prefix}/common/upload`" :limit="1" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="showDialog = false">取消</el-button>
                    <el-button type="primary" @click="confirmAdd()">确定</el-button>
                </span>
            </template>
        </el-dialog> -->
    <!-- <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="预览图片" />
        </el-dialog> -->
  </div>
</template>
<script setup lang="ts">
import { reqAllRoomType, reqDeleteType, reqAddOrUpdateType } from '@/api/roomType'
import type { AllRoomTypeResponse, RoomType } from '@/api/roomType/type'
import { ElMessage } from 'element-plus'
import type { Response } from '@/api/stay/type'
const allRoomType = ref<RoomType[]>([])
// const content = ref<string>("")
// const showDialog = ref<boolean>(false)
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
// const pictureCard = reactive<{ name: string, url: string }[]>([])
// const prefix = import.meta.env.VITE_APP_BASE_API || ""
// const dialogVisible = ref<boolean>(false)
// const dialogImageUrl = ref<string>("")
// const fileList = ref<{ name: string, url: string }[]>([])
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

// const add = () => {
//     Object.assign(formData, {
//         // bedNumber: "",
//         // bedSize: "",
//         // hotelId: "",
//         // roomPrice: "",
//         // roomSize: "",
//         // roomSurplus: "",
//         // roomTypeId: "",
//         // roomTypeImage: "",
//         // windows: "",
//         typeName: "",
//     })
//     // showDialog.value = true
// }

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
// const handleRemove = (uploadFile: any, uploadFiles: any) => {
//     console.log(uploadFile, uploadFiles)
// }

// const handlePictureCardPreview = (uploadFile: any) => {
//     dialogImageUrl.value = uploadFile.url!
//     dialogVisible.value = true
// }
// const handleSuccess = (res: any) => {
//     formData.roomTypeImage = res.data[0]
// }

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
