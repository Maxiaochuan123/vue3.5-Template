<script setup lang="ts">
import { provide, ref, watch, computed, toRef } from 'vue'
import { NDrawer, NDrawerContent, NButton, NIcon, NScrollbar, type FormInst } from 'naive-ui'
import { useFormSubmit } from './hooks/useFormSubmit'
import { ArrowBack } from '@vicons/ionicons5'

export type FormType = 'add' | 'edit' | 'view' | 'detail'

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
  editData?: Record<string, any>
  extraFields?: string[]
  refreshList?: () => void
  addTitle?: string
  editTitle?: string
  showFooter?: boolean
  submitText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  formType: 'add',
  submitText: '提交',
  cancelText: '取消',
  showFooter: true,
  extraFields: () => [],
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

// addTitle 和 editTitle 是可选的，如果提供了，则优先使用这些标题，否则使用 drawerTitle
const computedTitle = computed(() => {
  if (currentFormType.value === 'add') {
    return props.addTitle || drawerTitle.value
  }
  if (currentFormType.value === 'edit') {
    return props.editTitle || drawerTitle.value
  }
  return props.addTitle || props.editTitle || drawerTitle.value
})

// 提供响应式的 formType 和 editData 给子组件
provide('formType', currentFormType)
provide('editData', toRef(props, 'editData'))

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
    
    if (!api) {
      console.error(`${currentFormType.value === 'edit' ? 'editApi' : 'addApi'} is not provided`)
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

// 关闭抽屉
const close = () => {
  visible.value = false
  submitLoading.value = false
  submitDisabled.value = false
}

// 打开抽屉
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
  <NDrawer
    v-model:show="visible"
    placement="top"
    :block-scroll="false"
    to=".n-card__content"
    height="100%"
    @close="close"
  >
    <NDrawerContent closable>
      <!-- Header Section -->
      <template #header>
        <div class="page-header">
          <div class="left-section">
            <div class="back-button" @click="close">
              <NIcon>
                <ArrowBack />
              </NIcon>
            </div>
            <h2 class="page-title">{{ computedTitle }}</h2>
          </div>
        </div>
      </template>

      <!-- Content Section -->
      <div class="page-content">
        <NScrollbar>
          <slot />
        </NScrollbar>
      </div>

      <!-- Footer Section -->
      <template #footer>
        <div v-if="showFooter" class="page-footer">
          <NButton :disabled="submitLoading" size="large" @click="close">
            {{ props.formType === 'view' || props.formType === 'detail' ? '关闭' : cancelText }}
          </NButton>
          
          <NButton
            v-if="props.formType !== 'view' && props.formType !== 'detail'"
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
  margin: 0 -24px;
  :deep(.n-scrollbar-container) {
    height: 100%;
  }
  :deep(.n-scrollbar-content) {
    padding: 0 16px;
  }
}

.page-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;

  .n-button {
    padding: 0 44px;
  }
}
</style>
