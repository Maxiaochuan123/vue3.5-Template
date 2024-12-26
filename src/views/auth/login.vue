<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="@/assets/logo.svg" alt="Logo" class="logo" />
        <h2>Vue 3.5 Template</h2>
      </div>
      <n-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
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
        <n-button type="primary" block @click="handleLogin" :loading="loading"> 登录 </n-button>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/modules/auth'
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5'
import type { FormInst } from 'naive-ui'
import { md5 } from '@/utils/crypto'

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()
const loading = ref(false)
const loginFormRef = ref<FormInst | null>(null)
  const loginForm = ref({
  userName: 'admin',
  password: 'bf04006d4d4054417a50c1ac6fa2e248',
})
// const loginForm = ref({
//   userName: '',
//   password: '',
// })

const loginRules = {
  userName: { required: true, message: '请输入用户名', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  try {
    loading.value = true
    await loginFormRef.value.validate()
    // const encryptedPassword = md5(loginForm.value.password)
    // await authStore.login(loginForm.value.userName, encryptedPassword)
    await authStore.login(loginForm.value.userName, loginForm.value.password)
    message.success('登录成功')
    router.push('/')
  } catch (error: any) {
    message.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e6f3ff 0%, #a0cfff 100%);
}

.login-box {
  width: 100%;
  max-width: 440px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.login-form {
  :deep(.n-form-item) {
    margin-bottom: 24px;
  }

  :deep(.n-button) {
    margin-top: 12px;
  }
}
</style>
