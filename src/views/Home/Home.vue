<template>
  <div>
    <el-card class="bg dock-window" style="height: 800px; position: relative;">
      <el-calendar v-model="date" style="width: 400px; position: absolute; right: 20px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)" />
      <div style="width: 70%;">

        <div style="display: flex">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; margin-right: 20px">常用入口</h1>
          <el-popover placement="bottom" title="选择常用标签" :width="200" trigger="click">
            <template #reference>
              <el-icon size="24" style="cursor: pointer">
                <Setting />
              </el-icon>
            </template>
            <el-checkbox-group v-model="checkList" @change="checkListChangeHandler">
              <el-checkbox v-for="(item, index) in menuRoutes" :key="index" :label="item.meta.title" v-model="item.path"></el-checkbox>
            </el-checkbox-group>
          </el-popover>
        </div>
        <!-- <div style="display: flex;flex-wrap: wrap;gap: 20px;">
          <router-link :to="getPath(item)" v-for="(item, index) in collectedMenu" :key="index">
            <el-button size="large" type="primary">{{ item }}</el-button>
          </router-link>
        </div> -->
        <el-form>
          <el-form-item label="数量">
            <el-select v-model="CommentChartDataNumber" placeholder="请选择" @change="getCommentChartData">
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <!-- <el-option label="30" value="30"></el-option> -->
            </el-select>
          </el-form-item>
        </el-form>
        <div ref="chart" style="width:100%;height: 600px;margin-top: -30px;"></div>
        <!-- <el-input style="width: 200px;margin-left: 20px;"></el-input> -->

      </div>
      <Dock :model="collectedMenu" position="bottom">
        <template #item="{ item }">
          <router-link :to="getPath(item)" class="p-dock-link">
            <!-- <img alt="item.label" :src="item.icon" style="width: 35px" /> -->
            <el-icon size="50" style="margin-left: 4px;">
              <component :is="getIcon(item)"></component>
            </el-icon>
          </router-link>
          <span>{{ item }}</span>
        </template>
      </Dock>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { reqCommentChartData } from "@/api/charts"
import type { CommentChartDataResponse, CommentChartData } from "@/api/charts/type"
import { ElMessage } from 'element-plus';
type EChartsOption = echarts.ComposeOption<
  GridComponentOption | BarSeriesOption
>;
const userStore = useUserStore()
const date = ref(new Date())
const menuRoutes = ref<any>([])
const checkList = ref<any>([])
const collectedMenuString = ref<string>()
const collectedMenu = ref<any[]>()
const chart = ref<any>()
const CommentChartDataNumber = ref<number>(10)
let option = reactive<EChartsOption | any>({
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: { interval: 0, rotate: 30 }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'bar'
    }
  ]
});
let myChart = ref<echarts.ECharts>()


onMounted(() => {
  initDock()
  getCommentChartData()
})
watch(
  () => collectedMenuString.value,
  (newVal) => {
    collectedMenu.value = newVal?.split(',')?.filter((item) => item)
    // console.log('collectedMenu.value: ', collectedMenu.value);
  },
  {
    immediate: true,
  },
)
const getRoutes = (routes: any) => {
  routes.forEach((item: any) => {
    if (!item.children && !item.meta.hidden) {
      menuRoutes.value.push(item)
    }
    if (item.children && item.children.length == 1 && !item.children[0].meta.hidden) {
      menuRoutes.value.push(item.children[0])
    }
    if (item.children && item.children.length > 1) {
      getRoutes(item.children)
    }
  })
  return menuRoutes.value
}
const checkListChangeHandler = (param: any) => {
  // console.log('param: ', param);
  localStorage.setItem('collectedMenuString', param)
  collectedMenuString.value = localStorage.getItem('collectedMenuString') as string
}
const getPath = (str: any) => {
  let arr = menuRoutes.value.filter((item: any) => {
    if (item.meta.title === str) return true
  })
  return arr[0] ? arr[0].path : '/'
}
const getIcon = (str: any) => {
  let arr = menuRoutes.value.filter((item: any) => {
    if (item.meta.title === str) return true
  })
  return arr[0] ? arr[0].meta.icon : 'Coin'
}
const initChart = () => {
  echarts.use([GridComponent, BarChart, CanvasRenderer]);
  myChart.value = echarts.init(chart.value);
  // opt && myChart.value.setOption(opt);
}
const initDock = () => {
  menuRoutes.value = getRoutes(userStore.menuRoutes)
  collectedMenuString.value = localStorage.getItem('collectedMenuString') as string
  checkList.value = localStorage.getItem('collectedMenuString')?.split(',')
}
const getCommentChartData = async (p: number = CommentChartDataNumber.value) => {
  try {
    const res: CommentChartDataResponse = await reqCommentChartData(p)
    if (res.code === 1) {
      option.xAxis.data = res.data.map((item: CommentChartData) => item.hotel_name)
      option.series[0].data = res.data.map((item: CommentChartData) => item.average_star_count)
      initChart()
      myChart.value?.setOption(option);
    } else {
      throw new Error(res.msg)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
// const changeHandler = (n: number) => {
//   getCommentChartData(n)
// }

</script>
<style lang="less">
.bg {
  /* background: url(../../assets/images/bg.webp) no-repeat; */
  background-size: 100% 100%;
}

.dock-window {
  width: 100%;
  height: 450px;
  position: relative;
  /* background-image: url("https://primefaces.org/cdn/primevue/images/dock/window.jpg"); */
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 1;
}

.dock-demo>.p-dock {
  z-index: 1000;
}

.p-dock-list-container {
  height: 100px;
  padding: 0 20px;
}

.p-dock-item {
  /* gap: 20px; */
  margin-right: 30px;
  text-align: center;

}

.p-dock-icon {
  background: #ebf91b;
}

.p-dock-link {
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);

}

.p-menuitem-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
</style>
