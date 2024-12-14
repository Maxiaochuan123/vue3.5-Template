<template>
  <NDrawer
    v-model:show="modelValue"
    placement="top"
    :trap-focus="false"
    :block-scroll="false"
    height="100%"
    to=".n-card__content"
    @close="handleClose"
  >
    <NDrawerContent closable>
      <!-- Header Section -->
      <template #header>
        <div class="page-header">
          <div class="left-section">
            <NButton quaternary circle @click="handleClose">
              <template #icon>
                <NIcon>
                  <ArrowBack />
                </NIcon>
              </template>
            </NButton>
            <h2 class="page-title">{{ title }}</h2>
          </div>
        </div>
      </template>

      <!-- Content Section -->
      <div class="page-content">
        <slot></slot>
      </div>

      <!-- Footer Section -->
      <template #footer>
        <div v-if="showFooter" class="page-footer">
          <NButton :disabled="loading" size="large" @click="handleClose"> 取消 </NButton>
          <NButton type="primary" :loading="loading" size="large" @click="handleConfirm">
            {{ submitText }}
          </NButton>
        </div>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<script setup lang="ts">
import { NDrawer, NDrawerContent, NButton, NIcon } from 'naive-ui'
import { ArrowBack } from '@vicons/ionicons5'

interface Props {
  title: string
  submitText?: string
  loading?: boolean
  showFooter?: boolean
}

interface Emits {
  (e: 'submit'): void
  (e: 'cancel'): void
}

const modelValue = defineModel({ type: Boolean, default: false })

withDefaults(defineProps<Props>(), {
  title: '未知 Title',
  submitText: '提交',
  loading: false,
  showFooter: true,
})

const emit = defineEmits<Emits>()

// 打开抽屉
const open = () => {
  modelValue.value = true
}

// 关闭抽屉
const close = () => {
  modelValue.value = false
}

// 处理关闭
const handleClose = () => {
  modelValue.value = false
  emit('cancel')
  close()
}

// 处理确认
const handleConfirm = () => {
  emit('submit')
}

// 暴露方法给父组件
defineExpose({
  open,
  close,
})
</script>

<style scoped lang="less">
.page-header {
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
  min-height: 300px;
}

.page-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
