<template>
  <n-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large" :show-label="false" class="register-form">
    <n-form-item path="userName">
      <n-input v-model:value="registerForm.userName" placeholder="您的姓名">
        <template #prefix>
          <n-icon><PersonOutline /></n-icon>
        </template>
      </n-input>
    </n-form-item>
    <n-form-item path="gender">
      <n-select v-model:value="registerForm.gender" :options="genderOptions" placeholder="性别" />
    </n-form-item>
    <n-form-item path="companyName">
      <n-input v-model:value="registerForm.companyName" placeholder="公司名称">
        <template #prefix>
          <n-icon><BusinessOutline /></n-icon>
        </template>
      </n-input>
    </n-form-item>
    <n-form-item path="mobile">
      <n-input-group>
        <n-input v-model:value="registerForm.mobile" placeholder="手机号">
          <template #prefix>
            <n-icon><PhonePortraitOutline /></n-icon>
          </template>
        </n-input>
        <n-button type="primary" @click="handleSendCode" :disabled="!isPhoneValid || codeSending">
          {{ codeSending ? `${countdown}s后重试` : '获取验证码' }}
        </n-button>
      </n-input-group>
    </n-form-item>
    <n-form-item path="code">
      <n-input v-model:value="registerForm.code" placeholder="验证码">
        <template #prefix>
          <n-icon><KeyOutline /></n-icon>
        </template>
      </n-input>
    </n-form-item>
    <div class="form-footer">
      <a class="back-to-login" @click="handleBackToLogin">返回登录</a>
    </div>
    <n-button type="primary" block @click="handleRegister" :loading="loading">
      申请注册
    </n-button>
    <div class="register-notice">平台将在1个工作日内与您电话联系</div>
  </n-form>
  <n-modal 
    v-model:show="showSuccessModal" 
    preset="dialog" 
    title="提示" 
    positive-text="知道了" 
    :auto-focus="false"
    style="width: 400px"
    @positive-click="handleSuccessConfirm"
  >
    <div class="success-modal-content">
      <div class="success-message">您的资料已提交</div>
      <div class="success-notice">平台将在1个工作日内与您电话联系</div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessage, NModal } from 'naive-ui'
import { PersonOutline, BusinessOutline, PhonePortraitOutline, KeyOutline } from '@vicons/ionicons5'
import type { FormInst } from 'naive-ui'
import { genderOptions } from '@/enum/options'
import { authApi } from '@/core/api/modules/auth'

const emit = defineEmits(['switch-to-login'])
const message = useMessage()
const loading = ref(false)
const codeSending = ref(false)
const countdown = ref(60)
const showSuccessModal = ref(false)
const registerFormRef = ref<FormInst | null>(null)

const registerForm = ref({
  userName: '',
  gender: null,
  companyName: '',
  mobile: '',
  code: '',
})

const phonePattern = /^1[3-9]\d{9}$/

const isPhoneValid = computed(() => {
  return phonePattern.test(registerForm.value.mobile)
})

const registerRules = {
  userName: { required: true, message: '请输入姓名', trigger: 'blur' },
  gender: { type: 'number', required: true, message: '请选择性别', trigger: 'change' },
  companyName: { required: true, message: '请输入公司名称', trigger: 'blur' },
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: phonePattern, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  code: { required: true, message: '请输入验证码', trigger: 'blur' },
}

const startCountdown = () => {
  codeSending.value = true
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      codeSending.value = false
      countdown.value = 60
    }
  }, 1000)
}

const handleSendCode = async () => {
  if (!registerForm.value.mobile) {
    message.error('请先输入手机号')
    return
  }
  if (!phonePattern.test(registerForm.value.mobile)) {
    message.error('请输入正确的手机号格式')
    return
  }
  try {
    await authApi.getVerificationCode({ phone: registerForm.value.mobile, type: '1' })
    startCountdown()
    message.success('验证码已发送')
  } catch (error: any) {
    message.error(error.message || '验证码发送失败')
  }
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  try {
    loading.value = true
    await registerFormRef.value.validate()
    await authApi.register(registerForm.value)
    message.success('注册成功')
    showSuccessModal.value = true
  } catch (error: any) {
    message.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}

const handleBackToLogin = () => {
  emit('switch-to-login')
}

const handleSuccessConfirm = () => {
  showSuccessModal.value = false
  emit('switch-to-login')
}
</script>

<style scoped>
.register-form {
    .register-notice {
        text-align: center;
        color: #666;
        font-size: 14px;
        margin-top: 16px;
    }

    .form-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: -12px;
        margin-bottom: 12px;
    }

    .back-to-login {
        color: #2080f0;
        cursor: pointer;
        font-size: 14px;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    .success-modal-content {
        padding: 20px 0;
        text-align: center;
    }

    .success-message {
        font-size: 16px;
        color: #333;
        margin-bottom: 8px;
    }

    .success-notice {
        font-size: 14px;
        color: #666;
    }
}
</style> 