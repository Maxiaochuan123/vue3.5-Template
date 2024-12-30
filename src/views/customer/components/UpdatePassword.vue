<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { md5 } from '@/utils/crypto'

const props = defineProps<{
  rowData: Record<string, any>
}>()

type ResetPasswordForm = {
  password: string
  id: number
}

const formRef = ref<FormInst | null>(null)

const formData = ref<ResetPasswordForm>({
  password: '',
  id: props.rowData.id
})

// 表单验证规则
const rules: FormRules = {
  password: { required: true, message: '请输入密码', trigger: 'blur' },
}


// 暴露给父组件的方法和数据
defineExpose({
  formRef,
  formData: computed(() => ({
    ...formData.value,
    password: formData.value.password ? md5(formData.value.password) : ''
  })),
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
      <NFormItem label="联系人" path="userName">
        <NInput
          v-model:value="props.rowData.userName"
          placeholder="请输入联系人"
          disabled
        />
      </NFormItem>

      <NFormItem label="用户账号" path="mobile">
        <NInput
          v-model:value="props.rowData.mobile"
          placeholder="请输入用户账号"
          disabled
        />
      </NFormItem>

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