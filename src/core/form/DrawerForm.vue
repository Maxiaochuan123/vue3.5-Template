<script setup lang="ts">
import { provide, ref, watch, computed, toRef } from 'vue'
import { NDrawer, NDrawerContent, NButton, NIcon, type FormInst } from 'naive-ui'
import { useFormSubmit } from './hooks/useFormSubmit'
import { ArrowBack } from '@vicons/ionicons5'

type FormType = 'add' | 'edit' | 'view'

interface CustomFormInst {
  validate: () => Promise<void>
  formData: Record<string, any>
  initialData?: Record<string, any>
}

interface Props {
  formRef?: FormInst | CustomFormInst | null
  submitApi: (...args: any[]) => Promise<any>
  formType?: FormType
  refreshList?: () => void
  extraFields?: string[]
  showFooter?: boolean
  submitText?: string
  cancelText?: string
  editData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  formType: 'add',
  submitText: '提交',
  cancelText: '取消',
  showFooter: true,
  extraFields: () => []
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
const { submitLoading, submitDisabled, handleSubmit } = useFormSubmit()

// 处理提交
const handleFormSubmit = async () => {
  if (!props.formRef) return
  
  try {
    const formInstance = props.formRef as CustomFormInst
    const success = await handleSubmit({
      submitApi: props.submitApi,
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
  modelValue.value = false
  submitLoading.value = false
  submitDisabled.value = false
}

// 打开抽屉
const open = () => {
  modelValue.value = true
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
            <h2 class="page-title">{{ drawerTitle }}</h2>
          </div>
        </div>
      </template>

      <!-- Content Section -->
      <div class="page-content">
        <slot />
      </div>

      <!-- Footer Section -->
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
  gap: 40px;
}
</style>
