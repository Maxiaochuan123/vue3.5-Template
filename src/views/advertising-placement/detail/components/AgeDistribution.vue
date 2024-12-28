<template>
  <div class="age-distribution">
    <div class="chart-card">
      <div class="chart-title">年龄分布</div>
      <div ref="chartRef" class="chart"></div>
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
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 获取图表配置
const getChartOption = (data: { num: number[]; time: string[] }): EChartsOption => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const item = params[0]
        return `${item.name}: ${item.value}%`
      }
    },
    grid: {
      top: 40,
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.time,
      axisLabel: {
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        type: 'bar',
        data: data.num,
        barWidth: '40%',
        itemStyle: {
          color: themeVars.value.successColor
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%'
        }
      }
    ]
  }
}

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
  }
}

// 加载数据
const loadData = async () => {
  try {
    const { code, data } = await advertisingPlacementDataApi.getAgeDistribution({
      id: props.id
    })
    
    if (code === 200 && data && chart) {
      // 将百分比字符串转换为数字
      const chartData = {
        time: Array.isArray(data.time) ? data.time : [data.time],
        num: Array.isArray(data.num) 
          ? data.num.map((val: string) => parseFloat(val.replace('%', '')))
          : [parseFloat(data.num.replace('%', ''))]
      }
      chart.setOption(getChartOption(chartData))
      chart.resize()
    }
  } catch (error) {
    console.error('Failed to load age distribution data:', error)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  chart?.resize()
}

onMounted(async () => {
  await nextTick()
  initChart()
  await loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="less">
.age-distribution {
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

    .chart {
      height: 300px;
      width: 100%;
    }
  }
}
</style> 