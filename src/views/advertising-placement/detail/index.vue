<template>
  <div class="advertising-placement-detail">
    <div class="content-container">
      <n-scrollbar>
        <div class="header-card">
          <div class="stats-row">
            <n-tag :type="getStatusType()" size="small" class="status-tag">
            ● {{ getStatusText() }}
            </n-tag>
            <div class="stat-item">
              <span>展现次数：</span>
              <span class="value">{{ showCount }}</span>
            </div>
            <div class="stat-item">
              <span>点击次数：</span>
              <span class="value">{{ clickCount }}</span>
            </div>
            <div class="stat-item">
              <span>下载次数：</span>
              <span class="value">{{ downloadCount }}</span>
            </div>
          </div>
        </div>
        <TrendChart :id="id" />
        <DistributionChart :id="id" />
        <RegionDistribution :id="id" />
        <AgeDistribution :id="id" />
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AdvertisingPlacementDetailPage',
})

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { NTag, NScrollbar } from 'naive-ui'
import { advertisingPlacementDataApi } from '@/api/modules/advertisingPlacement'
import { advertPlacementStatusOptions, type AdvertPlacementStatusType } from '@/enum/options'
import TrendChart from './components/TrendChart.vue'
import DistributionChart from './components/DistributionChart.vue'
import RegionDistribution from './components/RegionDistribution.vue'
import AgeDistribution from './components/AgeDistribution.vue'

const route = useRoute()
const id = Number(route.params.id)
const type = Number(route.query.type) as AdvertPlacementStatusType

// 获取状态文本
const getStatusText = () => {
  const option = advertPlacementStatusOptions.find(opt => opt.value === type)
  return option?.label || '投放中'
}

// 获取状态类型
const getStatusType = () => {
  switch (type) {
    case 1: // 投放中
      return 'warning'
    case 2: // 已结束
      return 'error'
    default: // 待投放
      return 'default'
  }
}

const showCount = ref<string>('0')
const clickCount = ref<string>('0')
const downloadCount = ref<string>('0')

// 加载数据
const loadStats = async () => {
  try {
    const [showRes, clickRes, downloadRes] = await Promise.all([
      advertisingPlacementDataApi.getShowAcount({ id }),
      advertisingPlacementDataApi.getClickAcount({ id }),
      advertisingPlacementDataApi.getDownloadAcount({ id })
    ])
    
    showCount.value = showRes.data
    clickCount.value = clickRes.data
    downloadCount.value = downloadRes.data
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped lang="less">
.advertising-placement-detail {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;

  .content-container {
    position: relative;
    flex: 1;
    min-height: 0;

    :deep(.n-scrollbar-container) {
      height: 100%;
    }

    :deep(.n-scrollbar-content) {
      padding: 16px;
    }
  }

  .header-card {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    padding: 16px;
    margin-bottom: 16px;

    .stats-row {
      display: flex;
      align-items: center;
      gap: 80px;

      .stat-item {
        font-size: 14px;
        color: #666;

        .value {
          font-size: 14px;
          color: #333;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
