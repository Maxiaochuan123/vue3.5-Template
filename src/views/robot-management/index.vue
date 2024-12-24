<template>
  <!-- 如果有子路由，显示子路由内容 -->
  <router-view v-if="$route.name === 'robot-detail'" />

  <!-- 否则显示机器人列表 -->
  <div v-else class="robot-management">
    <n-card>
      <n-tabs type="segment">
        <n-tab-pane name="all" tab="全部账号">
          <div class="robot-list">
            <div v-for="robot in robots" :key="robot.id" class="robot-card">
              <n-card>
                <div class="robot-info">
                  <div class="avatar-container">
                    <n-avatar round :size="48">
                      <n-icon><PersonOutline /></n-icon>
                    </n-avatar>
                    <n-tag type="success" size="small" class="status-tag">在线</n-tag>
                  </div>
                  <div class="robot-details">
                    <div class="robot-name">{{ robot.name }}</div>
                    <div class="robot-account">{{ robot.account }}</div>
                    <div class="robot-ip">{{ robot.ip }}</div>
                  </div>
                </div>
                <div class="robot-stats">
                  <div class="stat-item">
                    <div class="stat-label">好友:</div>
                    <div class="stat-value">{{ robot.friends }}</div>
                  </div>
                </div>
                <div class="robot-status">
                  <div class="status-item">
                    <div class="status-label">当前执行:</div>
                    <div class="status-value">{{ robot.currentTask }}</div>
                  </div>
                  <n-button size="small" type="primary" @click="showTaskList(robot)">
                    任务列表
                  </n-button>
                </div>
                <div class="robot-time">
                  <div class="time-label">最近执行:</div>
                  <div class="time-value">{{ robot.lastExecuteTime }}</div>
                </div>
              </n-card>
            </div>
            <div class="add-robot-card">
              <n-card hoverable @click="handleAddRobot">
                <div class="add-robot-content">
                  <n-icon size="48"><AddOutline /></n-icon>
                  <div class="add-text">新增机器人</div>
                </div>
              </n-card>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="sync" tab="同步账号">
          <div class="robot-list">
            <!-- 同步账号列表，结构同上 -->
          </div>
        </n-tab-pane>
        <n-tab-pane name="operation" tab="运营账号">
          <div class="robot-list">
            <!-- 运营账号列表，结构同上 -->
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>

    <!-- 扫码登录对话框 -->
    <n-modal
      v-model:show="showQrCodeModal"
      preset="dialog"
      title="新增机器人"
      :style="{ width: '400px' }"
      :mask-closable="false"
    >
      <div class="qrcode-content">
        <div class="qrcode-box">
          <qrcode-vue
            value="https://example.com/robot-login?code=123456"
            :size="180"
            level="H"
            render-as="svg"
          />
        </div>
        <div class="qrcode-tip">请使用机器人扫码登录</div>
        <div class="qrcode-actions">
          <n-button @click="closeQrCodeModal">取消</n-button>
          <n-button type="primary" @click="handleQrCodeLogin">确认登录</n-button>
        </div>
      </div>
    </n-modal>

    <!-- 机器人表单对话框 -->
    <DialogForm
      ref="dialogFormRef"
      :form-ref="robotFormRef"
      :add-api="submitApi"
      :edit-api="submitApi"
      :refresh-list="refreshList"
    >
      <RobotForm ref="robotFormRef" :edit-data="editData" />
    </DialogForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PersonOutline, AddOutline } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { NCard, NTabs, NTabPane, NAvatar, NIcon, NTag, NButton, NModal } from 'naive-ui'
import RobotForm from './components/RobotForm.vue'
import DialogForm from '@/core/form/DialogForm.vue'
import type { FormState } from './components/RobotForm.vue'
import QrcodeVue from 'qrcode.vue'

const message = useMessage()
const router = useRouter()
const showQrCodeModal = ref(false)
const robotFormRef = ref<InstanceType<typeof RobotForm> | null>(null)
const dialogFormRef = ref<InstanceType<typeof DialogForm> | null>(null)
const editData = ref<Partial<FormState>>()

// Mock API function
const submitApi = async (data: FormState) => {
  console.log('提交数据:', data)
  return Promise.resolve({ code: 200, data: 'success' })
}

interface Robot {
  id: string
  name: string
  account: string
  ip: string
  friends: number
  currentTask: string
  lastExecuteTime: string
}

const robots = ref<Robot[]>([
  {
    id: '1',
    name: '小胡同步小助手1',
    account: 'chegetongbu',
    ip: '172.16.20.174',
    friends: 2800,
    currentTask: '同步好友中',
    lastExecuteTime: '2024.07.02 15:30:30',
  },
  {
    id: '2',
    name: '小胡同步小助手2',
    account: 'chegetongbu2',
    ip: '172.16.20.174',
    friends: 2800,
    currentTask: '心跳',
    lastExecuteTime: '2024.07.02 15:30:30',
  },
  {
    id: '3',
    name: '运营客服-天天',
    account: 'kefu-tiantian',
    ip: '172.16.20.174',
    friends: 2800,
    currentTask: '发送消息',
    lastExecuteTime: '2024.07.02 15:30:30',
  },
])

const showTaskList = (robot: Robot) => {
  router.push(`/robot-management/${robot.id}`)
}

const handleAddRobot = () => {
  showQrCodeModal.value = true
}

const closeQrCodeModal = () => {
  showQrCodeModal.value = false
}

const handleQrCodeLogin = () => {
  closeQrCodeModal()
  dialogFormRef.value?.open()
}

const refreshList = () => {
  message.success('添加成功')
  // TODO: 刷新列表
}
</script>

<style scoped lang="less">
.robot-management {
  padding: 16px;
}

.robot-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.robot-card {
  .robot-info {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;

    .avatar-container {
      position: relative;

      .status-tag {
        position: absolute;
        bottom: -4px;
        right: -4px;
      }
    }

    .robot-details {
      flex: 1;

      .robot-name {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .robot-account,
      .robot-ip {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .robot-stats {
    margin-bottom: 12px;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .stat-label {
        color: #666;
      }

      .stat-value {
        font-weight: 500;
      }
    }
  }

  .robot-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .status-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .status-label {
        color: #666;
      }

      .status-value {
        font-weight: 500;
      }
    }
  }

  .robot-time {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #666;

    .time-value {
      font-weight: 500;
    }
  }
}

.add-robot-card {
  .add-robot-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 200px;
    color: #666;
    cursor: pointer;

    .add-text {
      margin-top: 8px;
    }
  }
}

.qrcode-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;

  .qrcode-box {
    margin-bottom: 16px;
  }

  .qrcode-tip {
    color: #666;
    margin-bottom: 24px;
  }

  .qrcode-actions {
    display: flex;
    gap: 12px;
  }
}
</style>
