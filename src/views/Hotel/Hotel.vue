<template>
  <div>
    <el-card>
      <el-button type="primary" icon="plus" @click="addHotel">添加酒店</el-button>
      <el-button type="danger" icon="delete" @click="handleDeleteSelected" :disabled="!selectedHotels.length">删除选中</el-button>
      <el-table :data="hotelRecords" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="城市" prop="city" width="100"></el-table-column>
        <el-table-column label="ID" prop="hotelId" width="100"></el-table-column>
        <el-table-column label="名称" prop="hotelName">
          <template #default="{ row }">
            <el-tooltip class="box-item" effect="dark" :content="row.hotelDescription" placement="top">{{ row.hotelName }}</el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="地址" prop="addressInfo"></el-table-column>
        <el-table-column label="电话" prop="hotelPhone" width="200"></el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <!-- <el-tag :type="row.hotelState === 1 ? 'success' : 'danger'">{{ row.hotelState === 1 ? '正常' : '停业' }}</el-tag> -->
            <el-switch
              v-model="row.hotelState"
              width="60"
              :active-value="1"
              :inactive-value="0"
              inline-prompt
              active-text="营业"
              inactive-text="歇业"
              @change="changeState(row.hotelState, row.hotelId)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="showRoomType(row)">查看房型</el-button>
            <el-button type="warning" icon="edit" size="small" @click="editHotel(row)">编辑</el-button>
            <el-popconfirm :title="`你确定删除酒店: ${row.hotelName} 吗？`" width="250" @confirm="handleDeleteSelected(row.hotelId)">
              <template #reference>
                <el-button type="danger" icon="delete" size="small">删除</el-button>
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
    <!-- 添加/修改 酒店弹窗 -->
    <el-dialog v-model="addHotelDialogVisible" :title="`${addHotelForm.hotelId ? '编辑' : '添加'}酒店`" width="30%" :before-close="handleCloseDialog">
      <el-form :model="addHotelForm" label-width="80px">
        <el-form-item label="城市">
          <el-input placeholder="请输入城市" v-model="addHotelForm.city"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input placeholder="请输入地址" v-model="addHotelForm.addressInfo"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input placeholder="请输入名称" v-model="addHotelForm.hotelName"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input placeholder="请输入描述" v-model="addHotelForm.hotelDescription"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input placeholder="请输入电话" v-model="addHotelForm.hotelPhone"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="addHotelForm.hotelState" inline-prompt active-text="营业" inactive-text="停业" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addHotelDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddHotel">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-drawer v-model="isSHowDrawer" direction="rtl" title="查看房型" size="50%">
      <template #default>
        <el-table :data="allRoomTypes" border stripe>
          <el-table-column label="酒店" prop="hotelName" align="center"></el-table-column>
          <el-table-column label="房型" prop="typeName" align="center"></el-table-column>
          <el-table-column label="价格" prop="roomPrice" align="center"></el-table-column>
          <el-table-column label="床型" prop="bedSize" align="center"></el-table-column>
          <el-table-column label="床数" prop="bedNumber" align="center"></el-table-column>
          <el-table-column label="房间大小" prop="roomSize" align="center"></el-table-column>
          <el-table-column label="窗户" prop="windows" align="center"></el-table-column>
          <el-table-column label="剩余" prop="roomSurplus" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button type="warning" size="small" @click="edit(row)">修改</el-button>
              <el-popconfirm @confirm="deleteType([row.roomTypeId])" :title="`你确定删除房间类型: ${row.typeName} 吗？`" width="200">
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="add" style="margin-top: 20px">添加房型</el-button>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="isSHowDrawer = false">关闭</el-button>
          <!-- <el-button type="primary" @click="confirmClick">保存</el-button> -->
        </div>
      </template>
    </el-drawer>
    <el-dialog v-model="showDialog" title="添加房间类型" style="width: 500px">
      <el-form v-model="formData" label-width="100px">
        <el-form-item label="类型名称" required>
          <el-input v-model="formData.typeName" placeholder="请输入类型名"></el-input>
        </el-form-item>
        <!-- <el-form-item label="酒店ID">
                    <el-input v-model="formData.hotelId" placeholder="请选择酒店"></el-input>
                </el-form-item> -->
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
        <!-- <el-form-item label="房型">
                    <el-select v-model="formData.roomTypeId" placeholder="请选择房型">
                        <el-option v-for="item in allRoomTypes" :key="item.roomTypeId" :label="item.typeName" :value="item.roomTypeId"></el-option>
                    </el-select>
                </el-form-item> -->
        <el-form-item label="图片">
          <!-- <el-input v-model="formData.roomTypeId" placeholder="请选择房型"></el-input> -->
          <el-upload
            v-model:file-list="fileList"
            :action="`${prefix}/common/upload`"
            :limit="1"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
          >
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
    </el-dialog>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="预览图片" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reqAllHotels, reqAddOrUpdateHotel, reqDeleteHotel } from '@/api/hotel'
import type { AllHotelsResponse, Hotel, AddHotelForm, Response } from '@/api/hotel/type'
import { ElMessage } from 'element-plus'
import type { RoomTypesByHotelIdResponse, RoomType, AllRoomTypeResponse } from '@/api/roomType/type'
import { reqAddOrUpdateType, reqAllRoomType, reqDeleteType, reqRoomTypesByHotelId } from '@/api/roomType'

const hotelRecords = ref<Hotel[]>()
const addHotelDialogVisible = ref(false)
const addHotelForm = reactive<AddHotelForm>({
  city: '',
  addressInfo: '',
  hotelName: '',
  hotelDescription: '',
  hotelPhone: '',
  hotelState: 1,
})
const selectedHotels = ref<Hotel[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const isSHowDrawer = ref(false)
const allRoomTypes = ref<RoomType[]>([])
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
const prefix = import.meta.env.VITE_APP_BASE_API || ''
const fileList = ref<{ name: string; url: string }[]>([])
const showDialog = ref<boolean>(false)
const dialogImageUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const selectedHotelId = ref<number>(0)
const allRoomType = ref<RoomType[]>([])
onMounted(() => {
  // console.log('onMounted');
  getData()
})
const handleSizeChange = (ps: number = 10) => {
  pageSize.value = ps
  getData()
}
const getData = async (page: number = 1) => {
  try {
    if (page) {
      currentPage.value = page
    }
    const res: AllHotelsResponse = await reqAllHotels(currentPage.value, pageSize.value)
    // console.log('res: ', res);
    if (res.code === 1) {
      // console.log('res: ', res);
      hotelRecords.value = res.data.records
      total.value = res.data.total
      currentPage.value = res.data.current
      pageSize.value = res.data.size
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}

const addHotel = () => {
  addHotelDialogVisible.value = true
  Object.assign(addHotelForm, {
    city: '',
    addressInfo: '',
    hotelName: '',
    hotelDescription: '',
    hotelPhone: '',
    hotelState: '',
    hotelId: 0,
  })
}
const handleCloseDialog = () => {
  addHotelDialogVisible.value = false
}
const confirmAddHotel = async () => {
  try {
    const res: Response = await reqAddOrUpdateHotel(Object.assign(addHotelForm, { hotelState: addHotelForm.hotelState ? 1 : 0 }))
    if (res.code === 1) {
      ElMessage.success(addHotelForm.hotelId ? '修改成功' : '添加成功')
      addHotelDialogVisible.value = false
      getData()
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
const handleSelectionChange = (record: Hotel[]) => {
  selectedHotels.value = record
}
const handleDeleteSelected = async (id: number) => {
  try {
    let ids: number[]
    if (typeof id !== 'number') {
      ids = selectedHotels.value.map((r) => r.hotelId)
    } else {
      ids = [id as number]
    }
    const res: Response = await reqDeleteHotel(ids)
    if (res.code === 1) {
      ElMessage.success(res.msg)
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
const editHotel = (hotel: Hotel) => {
  Object.assign(addHotelForm, hotel, { hotelState: hotel.hotelState ? true : false })
  addHotelDialogVisible.value = true
}
const changeState = async (flag: boolean, hotelId: number) => {
  try {
    const res: Response = await reqAddOrUpdateHotel({ hotelState: flag ? 1 : 0, hotelId })
    if (res.code === 1) {
      ElMessage.success('修改状态成功')
      addHotelDialogVisible.value = false
      getData()
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
// const confirmClick = () => { }
const showRoomType = (hotel: Hotel) => {
  isSHowDrawer.value = true
  allRoomTypes.value = []
  // Object.assign(addHotelForm, hotel, { hotelState: hotel.hotelState ? true : false });
  getRoomTypesByHotelId(hotel.hotelId)
  selectedHotelId.value = hotel.hotelId
}
const getRoomTypesByHotelId = async (id: number) => {
  try {
    const res: RoomTypesByHotelIdResponse = await reqRoomTypesByHotelId(id)
    if (res.code === 1) {
      allRoomTypes.value = res.data.records
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
      showDialog.value = false
      getRoomTypesByHotelId(param.hotelId as number)
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
const handleRemove = (uploadFile: any, uploadFiles: any) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview = (uploadFile: any) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
const handleSuccess = (res: any) => {
  formData.roomTypeImage = res.data[0]
}
const add = () => {
  showDialog.value = true
  Object.assign(formData, {
    bedNumber: '',
    bedSize: '',
    hotelId: selectedHotelId.value,
    roomPrice: '',
    roomSize: '',
    roomSurplus: '',
    roomTypeId: '',
    roomTypeImage: '',
    windows: '',
    typeName: '',
  })
  getAllRoomType()
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
const edit = (roomType: RoomType) => {
  // console.log('roomType: ', roomType);
  formData = roomType
  fileList.value = roomType.roomTypeImage ? [{ name: '', url: roomType.roomTypeImage as string }] : []
  showDialog.value = true
}
const deleteType = async (ids: number[]) => {
  try {
    const res: Response = await reqDeleteType(ids)
    if (res.code === 1) {
      ElMessage.success(res.msg)
      getRoomTypesByHotelId(selectedHotelId.value)
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
</script>
<style lang="less"></style>
