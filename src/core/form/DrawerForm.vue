<script setup lang="ts">
import { provide, ref, watch, computed } from 'vue'
import { NDrawer, NDrawerContent, NButton, NIcon, type FormInst } from 'naive-ui'
import { useFormSubmit } from './hooks/useFormSubmit'
import { ArrowBack } from '@vicons/ionicons5'

interface Props {
  submitText?: string
  showFooter?: boolean
  submitApi: (...args: any[]) => Promise<any>
  formRef?: FormInst | null | { validate: () => Promise<void>; formData: any }
  refreshList?: () => void
  formType?: 'add' | 'edit' | 'view'
  cancelText?: string
  extraFields?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  submitText: '提交',
  showFooter: true,
  formType: 'add',
  cancelText: '取消',
  extraFields: () => []
})

// 创建响应式的 formType
const currentFormType = ref(props.formType)

// 监听 props.formType 的变化
watch(
  () => props.formType,
  (newType) => {
    currentFormType.value = newType
  },
  { immediate: true }
)

// 提供响应式的 formType 给子组件
provide('formType', currentFormType)

// 抽屉标题
const drawerTitle = computed(() => {
  switch (currentFormType.value) {
    case 'edit':
      return '编辑'
    case 'view':
      return '详情'
    default:
      return '新增'
  }
})

const modelValue = defineModel({ type: Boolean, default: false })
// const emit = defineEmits(['cancel', 'submit'])
const { submitLoading, submitDisabled, handleSubmit } = useFormSubmit()

// 处理关闭
const handleClose = () => {
  modelValue.value = false
  // emit('cancel')
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
  if (!props.formRef) return

  const success = await handleSubmit({
    submitApi: props.submitApi,
    formRef: props.formRef,
    formData: props.formRef.formData,
    formType: currentFormType.value,
    initialData: (props.formRef as any).initialData,
    extraFields: props.extraFields,
    originalData: props.formRef.formData,
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
            <h2 class="page-title">{{ drawerTitle }}</h2>
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
          <NButton :disabled="submitLoading" size="large" @click="handleClose">
            {{ props.formType === 'view' ? '关闭' : cancelText }}
          </NButton>
          <NButton
            v-if="props.formType !== 'view'"
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
