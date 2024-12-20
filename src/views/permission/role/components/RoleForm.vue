<script setup lang="ts">
import { ref, watch, computed, inject, toRef, reactive } from 'vue'
import type { Ref } from 'vue'
import { NForm, NFormItem, NInput } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'

export interface FormState {
  name: string
  code: string
  description: string
}

// 注入响应式的 formType 和 editData
const formType = inject<Ref<'add' | 'edit' | 'view'>>('formType')!
const editData = inject<Ref<Partial<FormState>>>('editData')!

const formRef = ref<FormInst | null>(null)
const formData = reactive<FormState>({
  name: '',
  code: '',
  description: '',
})

// 是否为查看模式
const isViewMode = computed(() => formType.value === 'view')

// 监听编辑数据变化
watch(
  editData,
  (newData) => {
    if (newData) {
      Object.assign(formData, newData)
    }
  },
  { immediate: true }
)

const rules: FormRules = {
  name: [
    { required: true, message: '请输入角色名称' },
  ],
  code: [
    { required: true, message: '请输入角色编码' },
  ],
}

defineExpose({
  formRef,
  formData,
})
</script>

<template>
  <NForm
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-placement="left"
    label-width="100"
    require-mark-placement="right-hanging"
    :disabled="isViewMode"
  >
    <NFormItem label="角色名称" path="name">
      <NInput v-model:value="formData.name" placeholder="请输入角色名称" />
    </NFormItem>

    <NFormItem label="角色编码" path="code">
      <NInput v-model:value="formData.code" placeholder="请输入角色编码" />
    </NFormItem>

    <NFormItem label="描述" path="description">
      <NInput
        v-model:value="formData.description"
        type="textarea"
        placeholder="请输入角色描述"
        :rows="3"
      />
    </NFormItem>
  </NForm>
</template> 