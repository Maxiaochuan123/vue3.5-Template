<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img 
          src="https://file.moujiang.com/%E7%B4%A0%E6%9D%90/logo.png" 
          alt="谋将Logo" 
          class="login-logo"
        />
        <h2>谋将 - 广告联盟平台</h2>
      </div>
      <component 
        :is="currentView === 'RegisterForm' ? RegisterForm : LoginForm" 
        @update:current-view="handleViewChange"
        @switch-to-login="currentView = 'LoginForm'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'

const currentView = ref('LoginForm')

const handleViewChange = (view: string) => {
  currentView.value = view
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
    #184E77,  /* 深青蓝 */
    #1A759F,  /* 深青绿 */
    #34A0A4,  /* 青绿 */
    #76C893   /* 翠绿 */
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
  box-shadow: 0 8px 32px 0 rgba(24, 78, 119, 0.25);
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

.login-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-header h2 {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(
    -45deg,
    #184E77,  /* 深青蓝 */
    #1A759F,  /* 深青绿 */
    #34A0A4,  /* 青绿 */
    #76C893   /* 翠绿 */
  );
  background-size: 400% 400%;
  animation: gradientFlow 15s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
}
</style>
