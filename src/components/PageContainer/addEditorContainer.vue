<template>
  <div class="page-container">
    <!-- 头部 -->
    <header class="page-header">
      <div class="left-section">
        <n-button quaternary circle @click="handleBack">
          <template #icon>
            <n-icon>
              <ArrowBack />
            </n-icon>
          </template>
        </n-button>
        <h2 class="page-title">{{ title }}</h2>
      </div>
    </header>

    <!-- 内容区域 -->
    <main class="page-content">
      <slot></slot>
    </main>

    <!-- 底部按钮 -->
    <footer class="page-footer">
      <n-button @click="handleCancel" size="large">取消</n-button>
      <n-button type="primary" :loading="loading" @click="handleSubmit" size="large">
        {{ submitText }}
      </n-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { ArrowBack } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'PageContainer',
})

interface Props {
  title: string
  submitText?: string
  loading?: boolean
}

interface Emits {
  (e: 'cancel'): void
  (e: 'submit'): void
}

withDefaults(defineProps<Props>(), {
  submitText: '提交',
  loading: false,
})

const emit = defineEmits<Emits>()
const router = useRouter()

const handleBack = () => {
  router.back()
}

const handleCancel = () => {
  emit('cancel')
}

const handleSubmit = () => {
  emit('submit')
}
</script>

<style scoped lang="less">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.page-header {
  flex-shrink: 0;
  border-bottom: 1px solid #f0f0f0;

  .left-section {
    display: flex;
    align-items: center;
    gap: 8px;

    .page-title {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  }
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 0;
}

.page-footer {
  flex-shrink: 0;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  display: grid;
  grid-auto-flow: column;
  gap: 20px;
  justify-content: center;
}
</style>
