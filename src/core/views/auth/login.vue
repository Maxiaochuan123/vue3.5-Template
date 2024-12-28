<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>谋将广告联盟平台</h2>
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
  background: linear-gradient(
    -45deg,
    #ee7752,
    #e73c7e,
    #23a6d5,
    #23d5ab
  );
  background-size: 400% 400%;
  animation: gradientFlow 15s ease infinite;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

.login-box {
  position: relative;
  width: 100%;
  max-width: 440px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h2 {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
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
    height: 40px;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
  }

  :deep(.n-input) {
    .n-input__input-el {
      height: 40px;
    }
  }
}
</style>
