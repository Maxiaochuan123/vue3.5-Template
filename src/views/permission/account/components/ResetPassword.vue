<script setup lang="ts">
import { ref } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'

const props = defineProps<{
  id: number
}>()

type ResetPasswordForm = {
  password: string
  id: number
}

const formRef = ref<FormInst | null>(null)

const formData = ref<ResetPasswordForm>({
  password: '',
  id: props.id
})

// 表单验证规则
const rules: FormRules = {
  password: { required: true, message: '请输入密码', trigger: 'blur' },
}


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
      <span>ID: {{ formData.id }}</span>
      <NFormItem label="密码" path="password">
        <NInput
          v-model:value="formData.password"
          type="password"
          placeholder="请输入密码"
          show-password-on="click"
        />
      </NFormItem>
    </NForm>
  </div>
</template>