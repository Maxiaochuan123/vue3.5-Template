<script setup lang="ts">
import { ref, computed, inject, type Ref, onMounted } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { useFormData } from '@/core/form/hooks/useFormData'
import type { Account, AccountFormState } from '@/core/api/modules/account'
import { type FormType } from '@/core/form/DrawerForm.vue'
import { md5 } from '@/utils/crypto'
import type { RoleOptions } from '@/core/api/modules/role'

const props = defineProps<{
  roleOptions: RoleOptions[]
}>()

// 是否为查看模式
const isViewMode = computed(() => formType.value === 'view')

// 注入响应式的 formType 和 editData
const formType = inject<Ref<FormType>>('formType')!
const editData = inject<Ref<Partial<Account>>>('editData')!

const formRef = ref<FormInst | null>(null)

const { formData, initialData } = useFormData<AccountFormState>({
  initialData: {
    nickname: '',
    userName: '',
    password: '',
    mobile: '',
    roleId: null
  },
  editData
})

// 表单验证规则
const rules: FormRules = {
  nickname: { required: true, message: '请输入昵称', trigger: 'blur' },
  userName: { required: true, message: '请输入用户名', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
  mobile: { required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入手机号', trigger: 'blur' },
  roleId: { 
    required: true, 
    type: 'number',
    message: '请选择角色', 
    trigger: 'change'
  }
}

// 暴露给父组件的方法和数据
defineExpose({
  get formData() {
    return {
      ...formData,
      password: md5(formData.password)
    }
  },
  initialData,
  validate: () => formRef.value?.validate(),
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
      :disabled="isViewMode"
    >
      <NFormItem label="昵称" path="nickname">
        <NInput v-model:value="formData.nickname" placeholder="请输入昵称" />
      </NFormItem>

      <NFormItem label="用户名" path="userName">
        <NInput v-model:value="formData.userName" placeholder="请输入用户名" />
      </NFormItem>

      <NFormItem v-if="!formData.id" label="密码" path="password">
        <NInput
          v-model:value="formData.password"
          type="password"
          placeholder="请输入密码"
          show-password-on="click"
        />
      </NFormItem>

      <NFormItem label="手机号" path="mobile">
        <NInput v-model:value="formData.mobile" placeholder="请输入手机号" />
      </NFormItem>

      <NFormItem label="角色" path="roleId">
        <NSelect
          v-model:value="formData.roleId"
          :options="props.roleOptions"
          placeholder="请选择角色"
        />
      </NFormItem>
    </NForm>
  </div>
</template>