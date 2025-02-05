<template>
  <n-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large" :show-label="false" class="login-form">
    <n-form-item path="userName">
      <n-input v-model:value="loginForm.userName" placeholder="用户名">
        <template #prefix>
          <n-icon><PersonOutline /></n-icon>
        </template>
      </n-input>
    </n-form-item>
    <n-form-item path="password">
      <n-input
        v-model:value="loginForm.password"
        type="password"
        placeholder="密码"
        show-password-on="click"
      >
        <template #prefix>
          <n-icon><LockClosedOutline /></n-icon>
        </template>
      </n-input>
    </n-form-item>
    <div class="form-footer">
      <a class="register-link" @click="handleRegisterClick">申请注册</a>
    </div>
    <n-button type="primary" size="large" block @click="handleLogin" :loading="loading">
      登录
    </n-button>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useAuthStore } from '@/core/stores/modules/auth'
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5'
import type { FormInst } from 'naive-ui'
import { md5 } from '@/utils/crypto'

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()
const loading = ref(false)
const loginFormRef = ref<FormInst | null>(null)
const loginForm = ref({
  // userName: '13111866988',
  // password: '123456',
  userName: '',
  password: '',
})

const loginRules = {
  userName: { required: true, message: '请输入用户名', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  try {
    loading.value = true
    await loginFormRef.value.validate()
    const encryptedPassword = md5(loginForm.value.password)
    await authStore.login(loginForm.value.userName, encryptedPassword)
    message.success('登录成功')
    router.push('/')
  } catch (error: any) {
    message.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['update:currentView'])
const handleRegisterClick = () => {
  emit('update:currentView', 'RegisterForm')
}
</script>

<style scoped>
.login-form {
    .form-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: -12px;
      margin-bottom: 12px;
    }
    
    .register-link {
      color: #2080f0;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
    
      &:hover {
        text-decoration: underline;
      }
    }
}

</style> 