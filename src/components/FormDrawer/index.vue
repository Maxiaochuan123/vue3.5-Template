<script setup lang="ts">
import { NDrawer, NDrawerContent, NButton, NIcon, type FormInst } from 'naive-ui'
import { ArrowBack } from '@vicons/ionicons5'
import { useFormSubmit } from '@/hooks/useFormSubmit'

interface Props {
  title: string
  submitText?: string
  showFooter?: boolean
  submitApi: (...args: any[]) => Promise<any>
  formRef?: FormInst | null | { validate: () => Promise<void>; formData: any }
  refreshList?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '未知 Title',
  submitText: '提交',
  showFooter: true,
})

const modelValue = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['cancel', 'submit'])
const { submitLoading, submitDisabled, handleSubmit } = useFormSubmit()

// 处理关闭
const handleClose = () => {
  modelValue.value = false
  emit('cancel')
  close()
}

// 关闭抽屉
const close = () => {
  modelValue.value = false
  submitLoading.value = false
  submitDisabled.value = false
}

// 打开抽屉
const open = () => {
  modelValue.value = true
}

// 处理提交
const handleFormSubmit = async () => {
  if (!props.submitApi || !props.formRef) return

  if (!('validate' in props.formRef) || !('formData' in props.formRef)) {
    console.error('Invalid form reference')
    return
  }

  const success = await handleSubmit({
    submitApi: props.submitApi,
    formRef: props.formRef,
    formData: props.formRef.formData,
    onSuccess: () => {
      props.refreshList?.()
      close()
    }
  })

  if (!success) {
    submitDisabled.value = false
  }
}

// 暴露方法给父组件
defineExpose({
  open,
  close,
})
</script>

<template>
  <NDrawer
  v-model:show="modelValue"
  placement="top"
  :block-scroll="false"
  to=".n-card__content"
  height="100%"
  @close="handleClose"
  >
  <NDrawerContent closable>
    <!-- Header Section -->
    <template #header>
        <div class="page-header">
          <div class="left-section">
            <div class="back-button" @click="handleClose">
              <NIcon>
                <ArrowBack />
              </NIcon>
            </div>
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
          <NButton :disabled="submitLoading" size="large" @click="handleClose"> 取消 </NButton>
          <NButton
            type="primary"
            :loading="submitLoading"
            size="large"
            :disabled="submitDisabled"
            @click="handleFormSubmit"
          >
            {{ submitText }}
          </NButton>
        </div>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped lang="less">
.page-header {
  .left-section {
    display: flex;
    align-items: center;
    gap: 8px;

    .back-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.06);
      }
    }

    .page-title {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  }
}

.page-content {
  height: 100%;
}

.page-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
