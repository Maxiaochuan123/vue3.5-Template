<script setup lang="ts">
import { provide, ref, watch, computed, toRef } from 'vue'
import { NModal, NButton, NPopconfirm } from 'naive-ui'
import { useFormSubmit } from './hooks/useFormSubmit'
  
export type FormType = 'add' | 'edit' | 'view'

interface Props {
  formRef?: any
  // 新增 API
  addApi?: (...args: any[]) => Promise<any>
  // 编辑 API
  editApi?: (...args: any[]) => Promise<any>
  // 表单类型
  formType?: FormType
  // 刷新列表
  refreshList?: () => void
  // 额外字段
  extraFields?: string[]
  // 是否显示底部
  showFooter?: boolean
  // 提交按钮文本
  submitText?: string
  // 取消按钮文本
  cancelText?: string
  // 编辑数据
  editData?: Record<string, any>
  // 宽度
  width?: number | string
  // 确认消息
  confirmMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  formType: 'add',
  submitText: '提交',
  cancelText: '取消',
  showFooter: true,
  extraFields: () => [],
  width: 600,
})

// 创建响应式的 formType
const currentFormType = ref<FormType>(props.formType)

// 监听 props.formType 的变化
watch(
  () => props.formType,
  (newType) => {
    if (newType) {
      currentFormType.value = newType
    }
  },
  { immediate: true }
)

// 提供响应式的 formType 和 editData 给子组件
provide('formType', currentFormType)
provide('editData', toRef(props, 'editData'))

// 对话框标题
const modalTitle = computed(() => {
  switch (currentFormType.value) {
    case 'edit':
      return '编辑'
    case 'view':
      return '详情'
    default:
      return '新增'
  }
})

const visible = ref(false)
const { submitLoading, submitDisabled, handleSubmit } = useFormSubmit()

// 处理提交
const handleFormSubmit = async () => {
  if (!props.formRef) return
  
  try {
    const formInstance = props.formRef
    if (currentFormType.value !== 'add' && currentFormType.value !== 'edit') {
      console.error('Invalid form type for submission')
      return
    }
    
    const api = currentFormType.value === 'edit' ? props.editApi : props.addApi
    
    // 如果是新增操作但没有提供 addApi，则不允许提交
    if (currentFormType.value === 'add' && !api) {
      console.error('addApi is not provided for add operation')
      return
    }

    // 如果是编辑操作但没有提供 editApi，则不允许提交
    if (currentFormType.value === 'edit' && !api) {
      console.error('editApi is not provided for edit operation')
      return
    }

    const success = await handleSubmit({
      submitApi: api,
      formRef: props.formRef,
      formData: formInstance.formData,
      formType: currentFormType.value,
      initialData: formInstance.initialData,
      extraFields: props.extraFields,
      originalData: formInstance.formData,
      onSuccess: () => {
        props.refreshList?.()
        close()
      }
    })

    if (!success) {
      submitDisabled.value = false
    }
  } catch (error) {
    submitDisabled.value = false
    console.error('Form submission error:', error)
  }
}

// 关闭对话框
const close = () => {
  visible.value = false
  submitLoading.value = false
  submitDisabled.value = false
}

// 打开对话框
const open = () => {
  visible.value = true
}

// 暴露方法给父组件
defineExpose({
  open,
  close,
})
</script>

<template>
  <NModal
    v-model:show="visible"
    :title="modalTitle"
    :style="{ width: typeof width === 'number' ? `${width}px` : width }"
    preset="card"
  >
    <!-- Content Section -->
    <div class="page-content">
      <slot />
    </div>

    <template #footer>
      <div v-if="showFooter" class="page-footer">
        <NButton :disabled="submitLoading" size="large" @click="close">
          {{ props.formType === 'view' ? '关闭' : cancelText }}
        </NButton>
        
        <template v-if="props.formType !== 'view'">
          <NPopconfirm v-if="confirmMessage" :show-icon="false" @positive-click="handleFormSubmit">
            <template #trigger>
              <NButton
                type="primary"
                size="large"
                :loading="submitLoading"
                :disabled="submitDisabled"
              >
                {{ submitText }}
              </NButton>
            </template>
            {{ confirmMessage }}
          </NPopconfirm>
          
          <NButton
            v-else
            type="primary"
            size="large"
            :loading="submitLoading"
            :disabled="submitDisabled"
            @click="handleFormSubmit"
          >
            {{ submitText }}
          </NButton>
        </template>
      </div>
    </template>
  </NModal>
</template>

<style scoped lang="less">
  .page-content {
    padding-top: 16px;
  }

.page-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;

  // .n-button {
  //   padding: 0 44px;
  // }
}
</style> 