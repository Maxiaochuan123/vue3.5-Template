<script setup lang="ts">
import { provide, ref, watch, computed, toRef } from 'vue'
import { NModal, NButton, type FormInst } from 'naive-ui'
import { useFormSubmit } from './hooks/useFormSubmit'

type FormType = 'add' | 'edit' | 'view'

interface CustomFormInst {
  validate: () => Promise<void>
  formData: Record<string, any>
  initialData?: Record<string, any>
}

interface Props {
  formRef?: FormInst | CustomFormInst | null
  addApi?: (...args: any[]) => Promise<any>
  editApi?: (...args: any[]) => Promise<any>
  formType?: FormType
  refreshList?: () => void
  extraFields?: string[]
  showFooter?: boolean
  submitText?: string
  cancelText?: string
  editData?: Record<string, any>
  width?: number | string
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
    const formInstance = props.formRef as CustomFormInst
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
        
        <NButton
          v-if="props.formType !== 'view'"
          type="primary"
          size="large"
          :loading="submitLoading"
          :disabled="submitDisabled"
          @click="handleFormSubmit"
        >
          {{ submitText }}
        </NButton>
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