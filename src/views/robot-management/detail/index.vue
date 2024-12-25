<template>
  <div class="robot-detail">
    <div class="layout-container">
      <!-- 左侧信息 -->
      <div class="left-side">
        <n-card class="info-card" title="机器人信息">
          <template #header-extra>
            <n-tag
              size="small"
              :type="robotInfo.type === 'sync' ? 'info' : 'warning'"
              class="type-tag"
              round
            >
              {{ robotInfo.type === 'sync' ? '同步账号' : '运营账号' }}
            </n-tag>
          </template>
          <div class="robot-info">
            <div class="info-header">
              <div class="basic-info">
                <div class="avatar-wrapper">
                  <n-avatar round :size="48" class="avatar">
                    <n-icon><PersonOutline /></n-icon>
                  </n-avatar>
                  <n-tag
                    :type="robotInfo.status === 'online' ? 'success' : 'error'"
                    size="tiny"
                    class="status-tag"
                  >
                    {{ robotInfo.status === 'online' ? '在线' : '掉线' }}
                  </n-tag>
                </div>
                <div class="right-info">
                  <div class="text-item">{{ robotInfo.name }}</div>
                  <div class="text-item">{{ robotInfo.account }}</div>
                  <div class="text-item">{{ robotInfo.ip }}</div>
                </div>
              </div>
              <div class="extra-info">
                <div class="text-item">好友: {{ robotInfo.friends }}</div>
                <div class="text-item">当前执行: {{ robotInfo.currentTask }}</div>
                <div class="text-item">最近执行: {{ robotInfo.lastExecuteTime }}</div>
              </div>
            </div>

            <!-- 功能列表 -->
            <n-menu
              v-model:value="activeKey"
              :options="menuOptions"
              :indent="12"
              class="function-list"
            />

            <!-- 底部按钮 -->
            <div class="bottom-actions">
              <n-button class="action-btn" @click="handleWakeup">唤醒</n-button>
              <n-button class="action-btn" type="primary" @click="handleConfirmWakeup"
                >确认唤醒</n-button
              >
            </div>
          </div>
        </n-card>
      </div>

      <!-- 右侧表格 -->
      <div class="right-side">
        <component :is="currentTable" ref="tableRef" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'RobotDetailPage',
})

import { ref, computed, onMounted, h } from 'vue'
import type { Component } from 'vue'
import { PersonOutline, PeopleOutline, ListOutline } from '@vicons/ionicons5'
import { useRoute } from 'vue-router'
import { useMessage, NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import FriendTable from './components/FriendTable.vue'
import GroupTable from './components/GroupTable.vue'
import TaskTable from './components/TaskTable.vue'

const route = useRoute()
const message = useMessage()
const robotId = route.params.id as string

interface RobotInfo {
  name: string
  account: string
  ip: string
  friends: number
  status: 'online' | 'offline'
  currentTask: string
  lastExecuteTime: string
  type: 'sync' | 'operation'
}

const robotInfo = ref<RobotInfo>({
  name: '',
  account: '',
  ip: '',
  friends: 0,
  status: 'online',
  currentTask: '',
  lastExecuteTime: '',
  type: 'sync',
})

// 加载机器人信息
const loadRobotInfo = async () => {
  // 这里替换为实际的 API 调用
  const mockData: RobotInfo = {
    name: `小胡同步小助手${robotId}`,
    account: 'chegetongbu',
    ip: '172.16.20.174',
    friends: 2800,
    status: 'online',
    currentTask: '同步好友中',
    lastExecuteTime: '2024.07.02 15:30:30',
    type: 'sync',
  }
  robotInfo.value = mockData
}

const activeKey = ref<string>('friend')
const tableRef = ref(null)

// 根据路由参数设置当前标签页
onMounted(() => {
  loadRobotInfo()
  // 如果 URL 中有 tab 参数，切换到对应标签页
  if (route.query.tab) {
    activeKey.value = route.query.tab as string
  }
})

// 当前显示的表格组件
const currentTable = computed(() => {
  switch (activeKey.value) {
    case 'friend':
      return FriendTable
    case 'group':
      return GroupTable
    case 'task':
      return TaskTable
    default:
      return FriendTable
  }
})

// 唤醒机器人
const handleWakeup = () => {
  message.info('唤醒机器人')
}

// 确认唤醒
const handleConfirmWakeup = () => {
  message.success('确认唤醒')
}

// 渲染图标
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 菜单选项
const menuOptions = computed<MenuOption[]>(() => [
  {
    label: '好友列表',
    key: 'friend',
    icon: renderIcon(PersonOutline),
  },
  {
    label: '群列表',
    key: 'group',
    icon: renderIcon(PeopleOutline),
  },
  {
    label: '任务列表',
    key: 'task',
    icon: renderIcon(ListOutline),
  },
])
</script>

<style scoped lang="less">
.robot-detail {
  padding: 6px;
  height: calc(100vh - 64px);
  box-sizing: border-box;
  min-width: 900px;

  .layout-container {
    display: flex;
    gap: 8px;
    height: 100%;
    min-width: 100%;
  }

  .left-side {
    width: 300px;
    min-width: 300px;
    flex-shrink: 0;
    height: 100%;
  }

  .right-side {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.n-data-table) {
      flex: 1;
      min-width: 0;
    }

    :deep(.n-data-table-base-table-body) {
      height: calc(100% - 41px);
    }
  }

  .info-card {
    :deep(.n-card__content) {
      padding: 0;
    }

    :deep(.n-card-header) {
      padding: 8px 16px;
      border-bottom: 1px solid #eee;
    }

    :deep(.n-card__content) {
      padding: 16px;
    }
  }

  :deep(.n-card) {
    height: 100%;
  }

  .robot-info {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .info-header {
      .basic-info {
        display: flex;
        gap: 12px;
        margin-bottom: 8px;
        align-items: center;

        .avatar-wrapper {
          position: relative;
          width: fit-content;

          .avatar {
            background: #d9d9d9;
          }

          .status-tag {
            position: absolute;
            left: 8px;
            bottom: 0;
            padding: 0 4px;
            height: 18px;
            font-size: 12px;
            line-height: 18px;
            border-radius: 2px;
          }
        }

        .right-info {
          padding: 4px 0;
          .text-item {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 4px;
            color: #666;

            &:first-child {
              font-size: 16px;
              font-weight: 500;
              color: #333;
              margin-bottom: 6px;
            }
          }
        }
      }

      .extra-info {
        .text-item {
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 4px;
          color: #666;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .function-list {
      flex: 1;
      margin: 24px 0;
    }

    .bottom-actions {
      padding: 0 12px;
      display: flex;
      gap: 12px;

      .action-btn {
        flex: 1;
        min-width: 80px;
      }
    }
  }

  :deep(.page-container) {
    padding: 0;
  }
}
</style>
