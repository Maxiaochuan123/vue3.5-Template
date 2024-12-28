<template>
  <div class="distribution-charts">
    <div class="chart-row">
      <div class="chart-card">
        <div class="chart-title">性别</div>
        <div ref="genderChartRef" class="chart"></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">访问设备</div>
        <div ref="deviceChartRef" class="chart"></div>
      </div>
    </div>
    <div class="chart-card">
      <div class="chart-title">职业分布</div>
      <div ref="jobChartRef" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { advertisingPlacementDataApi } from '@/api/modules/advertisingPlacement'

const props = defineProps<{
  id: number
}>()

interface ChartDataItem {
  id: number | null
  createTime: string | null
  name: string | null
  num: number
  percent: string
}

interface ChartDisplayItem {
  name: string
  num: number
  value: number
}

const genderChartRef = ref<HTMLElement>()
const deviceChartRef = ref<HTMLElement>()
const jobChartRef = ref<HTMLElement>()
let genderChart: echarts.ECharts | null = null
let deviceChart: echarts.ECharts | null = null
let jobChart: echarts.ECharts | null = null

// 初始化图表
const initCharts = () => {
  if (genderChartRef.value) {
    genderChart = echarts.init(genderChartRef.value)
  }
  if (deviceChartRef.value) {
    deviceChart = echarts.init(deviceChartRef.value)
  }
  if (jobChartRef.value) {
    jobChart = echarts.init(jobChartRef.value)
  }
}

// 获取饼图配置
const getPieOption = (data: ChartDisplayItem[], title: string): EChartsOption => {
  // 计算总人数
  const total = data.reduce((sum, item) => sum + item.num, 0)
  
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%'
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10
        },
        data
      },
      {
        type: 'pie',
        radius: '30%',
        center: ['50%', '50%'],
        silent: true,
        label: {
          show: true,
          position: 'center',
          formatter: `总人数\n${total}人`,
          fontSize: 14,
          lineHeight: 20
        },
        tooltip: {
          show: false
        },
        itemStyle: {
          color: 'transparent',
          borderWidth: 0
        },
        emphasis: {
          scale: false,
          itemStyle: {
            color: 'transparent'
          }
        },
        data: [{
          value: 1,
          name: '',
          itemStyle: {
            color: 'transparent'
          }
        }]
      }
    ]
  }
}

// 加载数据
const loadData = async () => {
  try {
    const [genderRes, deviceRes, jobRes] = await Promise.all([
      advertisingPlacementDataApi.getGenderDistribution({ id: props.id }),
      advertisingPlacementDataApi.getDeviceDistribution({ id: props.id }),
      advertisingPlacementDataApi.getOccupationDistribution({ id: props.id })
    ])
    
    if (genderChart && genderRes.code === 200 && genderRes.data) {
      const genderData = genderRes.data.map((item: ChartDataItem): ChartDisplayItem => ({
        name: item.name || '未知',
        num: item.num,
        value: parseFloat(item.percent.replace('%', ''))
      }))
      genderChart.setOption(getPieOption(genderData, '性别'))
      genderChart.resize()
    }
    if (deviceChart && deviceRes.code === 200 && deviceRes.data) {
      const deviceData = deviceRes.data.map((item: ChartDataItem): ChartDisplayItem => ({
        name: item.name || '未知',
        num: item.num,
        value: parseFloat(item.percent.replace('%', ''))
      }))
      deviceChart.setOption(getPieOption(deviceData, '访问设备'))
      deviceChart.resize()
    }
    if (jobChart && jobRes.code === 200 && jobRes.data) {
      const jobData = jobRes.data.map((item: ChartDataItem): ChartDisplayItem => ({
        name: item.name || '未知',
        num: item.num,
        value: parseFloat(item.percent.replace('%', ''))
      }))
      jobChart.setOption(getPieOption(jobData, '职业分布'))
      jobChart.resize()
    }
  } catch (error) {
    console.error('Failed to load distribution data:', error)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  genderChart?.resize()
  deviceChart?.resize()
  jobChart?.resize()
}

onMounted(async () => {
  await nextTick()
  initCharts()
  await loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  genderChart?.dispose()
  deviceChart?.dispose()
  jobChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="less">
.distribution-charts {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
  width: 100%;

  .chart-row {
    display: flex;
    gap: 24px;

    .chart-card {
      flex: 1;
    }
  }

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

    .chart {
      height: 300px;
      width: 100%;
    }
  }
}
</style> 