<template>
  <div class="dashboard-wrapper">
    <n-scrollbar class="dashboard-scrollbar">
      <div class="dashboard-container">
        <!-- 左侧容器 -->
        <div class="left-container">
          <n-card class="card">
            <div class="card-header">
              <span class="title">广告主注册数据</span>
            </div>
            <div class="data-box">
              <data-card :value="advertiserData.num" name="总申请注册数" />
              <data-card :value="advertiserData.passNum" name="总审核通过数" />
              <data-card :value="advertiserData.waitNum" name="待审核广告主数" />
            </div>
          </n-card>

          <n-card class="card">
            <div class="card-header">
              <span class="title">广告投放数据</span>
            </div>
            <div class="data-box">
              <data-card :value="adData.num" name="总投放次数" />
              <data-card :value="adData.cpmNum" name="CPM投放次数" />
              <data-card :value="adData.cpcNum" name="CPC投放次数" />
              <data-card :value="adData.cpaNum" name="CPA投放次数" />
              <data-card :value="adData.showNum" name="总展示次数" />
              <data-card :value="adData.clickNum" name="总点击次数" />
              <data-card :value="adData.downloadNum" name="总下载次数" />
            </div>
          </n-card>
        </div>

        <!-- 右侧容器 -->
        <div class="right-container">
          <n-card class="card">
            <div class="card-header">
              <span class="title">充值数据</span>
            </div>
            <div class="data-box">
              <data-card :value="rechargeData.num" name="总充值人数" />
              <data-card :value="rechargeData.rechangeNum" name="总充值次数" />
              <data-card :value="rechargeData.principal" name="总充值金额" is-money-format />
              <data-card :value="rechargeData.amout" name="总赠送本金" is-money-format />
            </div>
          </n-card>

          <n-card class="card">
            <div class="card-header">
              <span class="title">消耗数据</span>
            </div>
            <div class="data-box">
              <data-card :value="consumeData.amout" name="总消耗金额" is-money-format />
              <data-card :value="consumeData.surplusNum" name="总剩余金额" is-money-format />
              <data-card :value="consumeData.principalAmout" name="总消耗本金" is-money-format />
              <data-card :value="consumeData.amout" name="总消耗赠金" is-money-format />
              <data-card :value="consumeData.surplusAmout" name="总剩余本金" is-money-format />
              <data-card :value="consumeData.surplusPrincipalAmout" name="总剩余赠金" is-money-format />
            </div>
          </n-card>
          <n-card class="card">
            <div class="card-header">
              <span class="title">公告</span>
            </div>
            <div class="textBox">
              <transition name="slide">
                <p
                  class="text"
                  :key="text.id"
                  @mouseenter="mouseenter"
                  @mouseleave="mouseleave"
                >{{text.val}}</p>
              </transition>
            </div>
          </n-card>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DataCard from './components/DataCard/index.vue'
import { dataOverviewApi } from '@/api/modules/dataOverview'
import type { AdvertiserData, AdData, RechargeData, ConsumeData } from '@/api/modules/dataOverview'
import { useThemeVars } from 'naive-ui'
import { NScrollbar } from 'naive-ui'
import { useSystemConfigStore } from '@/core/stores/modules/systemConfig'

const themeVars = useThemeVars()
const systemConfigStore = useSystemConfigStore()

const textArr = [
        '1 第一条公告',
        '2 第二条公告第二条公告',
        '3 第三条公告第三条公告第三条公告'
      ]
const number = ref(0)
const timer = ref(null)
const text = computed(() => ({ id: number.value, val: textArr[number.value] }))
onMounted(() => {
  startMove()
})
const mouseenter = () => {
  clearInterval(timer.value)
}
const mouseleave = () => {
  startMove()
}
const startMove = () => {
  timer.value = setTimeout(() => {
    if (number.value === 2) {
      number.value = 0
    } else {
      number.value += 1
    }
    startMove()
  }, 2000) // 滚动不需要停顿则将2000改成动画持续时间
}

// 计算卡片阴影
const cardShadow = computed(() => {
  const isDark = systemConfigStore.themeMode === 'dark'
  return {
    normal: `0 2px 12px 0 ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'}`,
    hover: `0 4px 20px 0 ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'}`
  }
})

// 广告主注册数据
const advertiserData = ref<AdvertiserData>({
  num: 0,
  passNum: 0,
  waitNum: 0,
})

// 广告投放数据
const adData = ref<AdData>({
  num: 0,
  cpmNum: 0,
  cpcNum: 0,
  cpaNum: 0,
  showNum: 0,
  clickNum: 0,
  downloadNum: 0,
})

// 充值数据
const rechargeData = ref<RechargeData>({
  num: 0,
  amout: 0,
  principal: 0,
  rechangeNum: 0,
})

// 消耗数据
const consumeData = ref<ConsumeData>({
  consumNum: 0,
  surplusNum: 0,
  principalAmout: 0,
  amout: 0,
  surplusAmout: 0,
  surplusPrincipalAmout: 0,
})

// 添加一个过滤函数，将 null 值转换为 0
const filterNullValues = <T extends Record<string, any>>(data: T): T => {
  const result = { ...data }
  Object.keys(result).forEach((key: keyof T) => {
    if (result[key] === null) {
      result[key] = 0 as T[keyof T]
    }
  })
  return result
}

// 加载数
const loadData = async () => {
  try {
    // 加载广告主注册数据
    const advertiserRes = await dataOverviewApi.getAdvertiserRegisterData()
    if (advertiserRes.code === 200) {
      advertiserData.value = filterNullValues(advertiserRes.data)
    }

    // 加载广告投放数据
    const adRes = await dataOverviewApi.getAdData()
    if (adRes.code === 200) {
      adData.value = filterNullValues(adRes.data)
    }

    // 加载充值数据
    const rechargeRes = await dataOverviewApi.getRechargeData()
    if (rechargeRes.code === 200) {
      rechargeData.value = filterNullValues(rechargeRes.data)
    }

    // 加载消耗数据
    const consumeRes = await dataOverviewApi.getConsumeData()
    if (consumeRes.code === 200) {
      consumeData.value = filterNullValues(consumeRes.data)
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadData()
})

</script>

<style lang="less" scoped>
.textBox {
  width: 100%;
  height: 40px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  text-align: center;
}
.text {
  width: 100%;
  position: absolute;
  bottom: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s linear;
}
.slide-enter {
  transform: translateY(20px) scale(1);
  opacity: 1;
}
.slide-leave-to {
  transform: translateY(-20px) scale(0.8);
  opacity: 0;
}

.dashboard-wrapper {
  height: calc(100vh - 64px);
  overflow: hidden;
}

.dashboard-scrollbar {
  height: 100%;
}

.dashboard-container {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  gap: 24px;
  background-color: v-bind('themeVars.bodyColor');
  min-width: min-content;
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;

  .left-container,
  .right-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
  }

  .card {
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: v-bind('themeVars.cardColor');
    box-shadow: v-bind('cardShadow.normal');
    width: 100%;

    &:hover {
      transform: translateY(-2px);
      box-shadow: v-bind('cardShadow.hover');
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid v-bind('themeVars.dividerColor');

      .title {
        font-size: 18px;
        font-weight: 600;
        color: v-bind('themeVars.textColor1');
        position: relative;
        padding-left: 12px;

        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 16px;
          background: v-bind('themeVars.primaryColor');
          border-radius: 2px;
        }
      }
    }

    .data-box {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 16px;
      padding: 8px;
    }
  }
}

// 响应式布局优化
@media screen and (min-width: 1600px) {
  .card .data-box {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media screen and (max-width: 1400px) {
  .dashboard-container {
    flex-direction: column;
  }
}

@media screen and (max-width: 768px) {
  .dashboard-container {
    padding: 12px;
    gap: 16px;
  }

  .card {
    .card-header {
      margin-bottom: 16px;
      padding-bottom: 12px;

      .title {
        font-size: 16px;
      }
    }

    .data-box {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
      padding: 4px;
    }
  }
}
</style>
