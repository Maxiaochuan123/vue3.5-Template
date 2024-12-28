<template>
  <div class="trend-charts">
    <div class="chart-card">
      <div class="chart-title">展现趋势</div>
      <div ref="showChartRef" class="chart"></div>
    </div>
    <div class="chart-card">
      <div class="chart-title">点击趋势</div>
      <div ref="clickChartRef" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useThemeVars } from 'naive-ui'
import { advertisingPlacementDataApi } from '@/api/modules/advertisingPlacement'

const props = defineProps<{
  id: number
}>()

const themeVars = useThemeVars()

const showChartRef = ref<HTMLElement>()
const clickChartRef = ref<HTMLElement>()
let showChart: echarts.ECharts | null = null
let clickChart: echarts.ECharts | null = null

// 初始化图表
const initCharts = () => {
  if (showChartRef.value) {
    showChart = echarts.init(showChartRef.value)
  }
  if (clickChartRef.value) {
    clickChart = echarts.init(clickChartRef.value)
  }
}

// 获取图表配置
const getChartOption = (data: any): EChartsOption => {
  // 处理数据格式
  const times = data?.time || []
  const values = data?.num || []

//   // 临时模拟一些数据
//   const mockValues = times.map((_: string, index: number) => {
//     // 生成100到1000之间的随机数
//     const base = Math.floor(Math.random() * 900 + 100)
//     // 添加一些波动
//     return base + Math.sin(index) * 50
//   })
//   const values = data?.from?.some((v: number) => v > 0) ? data.from : mockValues
  
  return {
    grid: {
      top: 30,
      left: '8%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: times,
      axisLabel: {
        interval: 'auto',
        rotate: 45,
        margin: 14
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        data: values,
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.1,
          color: themeVars.value.successColor
        },
        itemStyle: {
          color: themeVars.value.successColor
        },
        lineStyle: {
          color: themeVars.value.successColor
        }
      }
    ]
  }
}

// 加载数据
const loadData = async () => {
  try {
    const [showRes, clickRes] = await Promise.all([
      advertisingPlacementDataApi.getShowTrend({ id: props.id }),
      advertisingPlacementDataApi.getClickTrend({ id: props.id })
    ])
    
    if (showChart && showRes.data) {
      showChart.setOption(getChartOption(showRes.data))
      showChart.resize()
    }
    if (clickChart && clickRes.data) {
      clickChart.setOption(getChartOption(clickRes.data))
      clickChart.resize()
    }
  } catch (error) {
    console.error('Failed to load trend data:', error)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  showChart?.resize()
  clickChart?.resize()
}

onMounted(async () => {
  // 等待下一个 tick，确保 DOM 已经渲染
  await nextTick()
  initCharts()
  await loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  showChart?.dispose()
  clickChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="less">
.trend-charts {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
  width: 100%;

  .chart-card {
    width: 100%;
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