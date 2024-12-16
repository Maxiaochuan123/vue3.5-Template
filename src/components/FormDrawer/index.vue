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
          <NButton :disabled="submitLoading" size="large" @click="handleClose"> 取消 </NButton>
          <NButton
            type="primary"
            :loading="submitLoading"
            size="large"
            :disabled="submitDisabled"
            @click="handleSubmit"
          >
            {{ submitText }}
          </NButton>
        </div>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NDrawer, NDrawerContent, NButton, NIcon, useMessage, type FormInst } from 'naive-ui'
import { ArrowBack } from '@vicons/ionicons5'

interface Props {
  title: string
  submitText?: string
  showFooter?: boolean
  submitApi: (...args: any[]) => Promise<any> // 提交接口
  formRef?: {
    formRef: FormInst
    formData: any
  } | null
  refreshList?: () => void // 刷新列表
}

const modelValue = defineModel({ type: Boolean, default: false })
const submitLoading = ref(false)
const submitDisabled = ref(false)
const message = useMessage()

const props = withDefaults(defineProps<Props>(), {
  title: '未知 Title',
  submitText: '提交',
  showFooter: true,
})

const emit = defineEmits(['cancel', 'submit'])

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
const handleSubmit = async () => {
  if (!props.submitApi || !props.formRef?.formRef) return
  
  try {
    submitLoading.value = true
    submitDisabled.value = true

    // 表单验证
    await props.formRef.formRef.validate()

    // 获取表单数据
    const formData = props.formRef.formData

    console.log('formData: ', formData)

    // 调用提交接口
    await props.submitApi(formData)

    // 提交成功提示
    message.success('提交成功')

    // 刷新列表
    props.refreshList?.()

    close()
  } catch (error: any) {
    message.error(error.message || '提交失败')
    submitDisabled.value = false
  } finally {
    submitLoading.value = false
  }
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
  // min-width: 1040px;
  // overflow-y: auto;
  // flex: 1;
  // overflow-y: auto;
  height: 100%;
}

.page-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
