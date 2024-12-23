<script setup lang="ts">
import { ref, computed, inject, toRef } from 'vue'
import type { FormInst } from 'naive-ui'
import { useFormData } from '@/core/form/hooks/useFormData'
import { NForm, NFormItem, NInput, NInputNumber, NRadioGroup, NRadio } from 'naive-ui'

export interface FormState {
  type: 'sync' | 'operation'
  name: string
  ip: string
  key: string
  maxInterval: number
  minInterval: number
}

interface Props {
  editData?: Partial<FormState>
}

const props = defineProps<Props>()

// 注入响应式的 formType
const formType = inject<Ref<'add' | 'edit' | 'view'>>('formType')!

const formRef = ref<FormInst | null>(null)

const { formData, initialData } = useFormData<FormState>({
  initialData: {
    type: 'sync',
    name: '',
    ip: '',
    key: '',
    maxInterval: 10,
    minInterval: 5,
  },
  editData: toRef(props, 'editData'),
})

// 表单验证规则
const rules = {
  type: { required: true, message: '请选择机器人类型', trigger: 'change' },
  name: { required: true, message: '请输入机器人名称', trigger: 'blur' },
  ip: { required: true, message: '请输入机器人IP地址', trigger: 'blur' },
  key: { required: true, message: '请输入机器人key', trigger: 'blur' },
  maxInterval: { required: true, message: '请输入最大时间间隔', trigger: 'blur' },
  minInterval: { required: true, message: '请输入最小时间间隔', trigger: 'blur' },
}

// 暴露给父组件的方法和数据
defineExpose({
  formRef,
  formData,
  initialData,
  validate: () => formRef.value?.validate(),
})

const isViewMode = computed(() => formType.value === 'view')
</script>

<template>
  <div class="form-drawer-content">
    <div class="form-content">
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        :disabled="isViewMode"
      >
        <NFormItem label="机器人类型" path="type">
          <NRadioGroup v-model:value="formData.type">
            <NRadio value="sync">同步</NRadio>
            <NRadio value="operation">运营</NRadio>
          </NRadioGroup>
        </NFormItem>

        <NFormItem label="机器人名称" path="name">
          <NInput v-model:value="formData.name" placeholder="自动获取或手动填写" />
        </NFormItem>

        <NFormItem label="机器人IP地址" path="ip">
          <NInput v-model:value="formData.ip" placeholder="自动获取或手动填写" />
        </NFormItem>

        <NFormItem label="机器人key" path="key">
          <NInput v-model:value="formData.key" placeholder="自动获取或手动填写" />
        </NFormItem>

        <NFormItem label="任务执行时间隔最大时间(s)" path="maxInterval">
          <NInputNumber v-model:value="formData.maxInterval" :min="1" />
        </NFormItem>

        <NFormItem label="任务执行时间隔最小时间(s)" path="minInterval">
          <NInputNumber v-model:value="formData.minInterval" :min="1" />
        </NFormItem>
      </NForm>
    </div>
  </div>
</template>

<style scoped lang="less">
.form-drawer-content {
  width: 100%;
  display: flex;
  gap: 24px;
  .form-content {
    flex: 1;
  }
}
</style>
