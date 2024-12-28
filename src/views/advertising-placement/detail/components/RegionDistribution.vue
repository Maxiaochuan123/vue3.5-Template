<template>
  <div class="region-distribution">
    <div class="chart-card">
      <div class="chart-title">地域分布</div>
      <div class="lists-container">
        <div class="list-section">
          <div class="list-title">省级分布</div>
          <n-data-table
            :columns="columns"
            :data="provinceData"
            :pagination="provincePagination"
            :loading="provinceLoading"
            @update:pageIndex="handleProvincePageChange"
          />
        </div>
        <div class="list-section">
          <div class="list-header">
            <div class="list-title">市级分布</div>
            <n-select
              v-model:value="selectedProvince"
              :options="provinceOptions"
              placeholder="请选择省份"
              class="province-select"
              clearable
              @update:value="handleProvinceChange"
            />
          </div>
          <n-data-table
            :columns="columns"
            :data="cityData"
            :pagination="cityPagination"
            :loading="cityLoading"
            @update:pageIndex="handleCityPageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NDataTable, NSelect } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { advertisingPlacementDataApi } from '@/api/modules/advertisingPlacement'
import type { RegionData, RegionParams, CityParams } from '@/api/modules/advertisingPlacement'

const props = defineProps<{
  id: number
}>()

// 表格列定义
const columns: DataTableColumns<RegionData> = [
  {
    title: '排名',
    key: 'rank',
    width: 80,
    align: 'center'
  },
  {
    title: '地区',
    key: 'name'
  },
  {
    title: '人数',
    key: 'num',
    align: 'right'
  },
  {
    title: '占比',
    key: 'percent',
    align: 'right',
    render: (row) => `${row.percent}%`
  }
]

// 省级数据
const provinceData = ref<RegionData[]>([])
const provinceLoading = ref(false)
const provincePagination = ref({
  pageIndex: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: false
})

// 市级数据
const cityData = ref<RegionData[]>([])
const cityLoading = ref(false)
const cityPagination = ref({
  pageIndex: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: false
})

// 省份选择
const selectedProvince = ref<string | null>(null)
const provinceOptions = ref([
  { label: '北京市', value: '北京市' },
  { label: '天津市', value: '天津市' },
  { label: '河北省', value: '河北省' },
  { label: '山西省', value: '山西省' },
  { label: '辽宁省', value: '辽宁省' },
  { label: '吉林省', value: '吉林省' },
  { label: '上海市', value: '上海市' },
  { label: '江苏省', value: '江苏省' },
  { label: '浙江省', value: '浙江省' },
  { label: '安徽省', value: '安徽省' },
  { label: '福建省', value: '福建省' },
  { label: '江西省', value: '江西省' },
  { label: '山东省', value: '山东省' },
  { label: '河南省', value: '河南省' },
  { label: '湖北省', value: '湖北省' },
  { label: '湖南省', value: '湖南省' },
  { label: '广东省', value: '广东省' },
  { label: '海南省', value: '海南省' },
  { label: '重庆市', value: '重庆市' },
  { label: '四川省', value: '四川省' },
  { label: '贵州省', value: '贵州省' },
  { label: '云南省', value: '云南省' },
  { label: '陕西省', value: '陕西省' },
  { label: '甘肃省', value: '甘肃省' },
  { label: '青海省', value: '青海省' },
  { label: '台湾省', value: '台湾省' },
  { label: '黑龙江省', value: '黑龙江省' },
  { label: '西藏自治区', value: '西藏自治区' },
  { label: '内蒙古自治区', value: '内蒙古自治区' },
  { label: '澳门特别行政区', value: '澳门特别行政区' },
  { label: '广西壮族自治区', value: '广西壮族自治区' },
  { label: '宁夏回族自治区', value: '宁夏回族自治区' },
  { label: '香港特别行政区', value: '香港特别行政区' },
  { label: '新疆维吾尔自治区', value: '新疆维吾尔自治区' }
])

// 加载省级数据
const loadProvinceData = async () => {
  provinceLoading.value = true
  try {
    const res = await advertisingPlacementDataApi.getProvinceDistribution({
      id: props.id,
      pageIndex: provincePagination.value.pageIndex,
      pageSize: provincePagination.value.pageSize
    } as RegionParams)
    
    if (res.data?.records) {
      provinceData.value = res.data.records
      provincePagination.value.itemCount = res.data.total
    }
  } catch (error) {
    console.error('Failed to load province data:', error)
  } finally {
    provinceLoading.value = false
  }
}

// 加载市级数据
const loadCityData = async () => {
  cityLoading.value = true
  try {
    const res = await advertisingPlacementDataApi.getCityDistribution({
      id: props.id,
      province: selectedProvince.value || '',
      pageIndex: cityPagination.value.pageIndex,
      pageSize: cityPagination.value.pageSize
    } as CityParams)
    
    if (res.data?.records) {
      cityData.value = res.data.records
      cityPagination.value.itemCount = res.data.total
    }
  } catch (error) {
    console.error('Failed to load city data:', error)
  } finally {
    cityLoading.value = false
  }
}

// 处理省级数据分页变化
const handleProvincePageChange = (pageIndex: number) => {
  provincePagination.value.pageIndex = pageIndex
  loadProvinceData()
}

// 处理市级数据分页变化
const handleCityPageChange = (pageIndex: number) => {
  cityPagination.value.pageIndex = pageIndex
  loadCityData()
}

// 处理省份选择变化
const handleProvinceChange = () => {
  cityPagination.value.pageIndex = 1
  loadCityData()
}

onMounted(() => {
  loadProvinceData()
  loadCityData()
})
</script>

<style scoped lang="less">
.region-distribution {
  margin-top: 24px;
  width: 100%;

  .chart-card {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    padding: 16px;
    box-sizing: border-box;

    .chart-title {
      font-size: 16px;
      color: #333;
      margin-bottom: 16px;
    }

    .lists-container {
      display: flex;
      flex-direction: column;
      gap: 80px;

      .list-section {
        width: 100%;

        .list-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 16px;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          .province-select {
            width: 200px;
          }
        }
      }
    }
  }
}
</style> 