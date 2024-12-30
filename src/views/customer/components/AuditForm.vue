<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'

const props = defineProps<{
  rowData: Record<string, any>
}>()

interface AuditForm {
  id: number
  status: 1 | -1 // 1: 通过, -1: 不通过
  auditContent: string
}

const formRef = ref<FormInst | null>(null)

const formData = ref<AuditForm>({
  id: props.rowData.id,
  status: 1,
  auditContent: ''
})

// 计算审核意见是否必填（不通过时必填）
const auditContentRequired = computed(() => formData.value.status === -1)

// 表单验证规则
const rules = computed<FormRules>(() => ({
  status: {
    required: true,
    message: '请选择审核结果',
    trigger: ['blur', 'change'],
    type: 'number'
  },
  auditContent: {
    required: auditContentRequired.value,
    message: '请输入审核意见',
    trigger: ['blur', 'input']
  }
}))

// 审核状态选项
const statusOptions = [
  { label: '通过', value: 1 },
  { label: '不通过', value: -1 }
]

// 暴露给父组件的方法和数据
defineExpose({
  formRef,
  formData,
  validate: () => formRef.value?.validate()
})
</script>

<template>
  <div class="form-content">
    <NForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="left"
      label-width="100"
    >
      <NFormItem label="审核结果" path="status" required>
        <NRadioGroup v-model:value="formData.status">
          <NRadio
            v-for="option in statusOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </NRadio>
        </NRadioGroup>
      </NFormItem>

      <NFormItem 
        label="审核意见" 
        path="auditContent" 
        :required="formData.status === -1"
      >
        <NInput
          v-model:value="formData.auditContent"
          type="textarea"
          placeholder="请输入审核意见"
          :rows="3"
        />
      </NFormItem>
    </NForm>
  </div>
</template> 