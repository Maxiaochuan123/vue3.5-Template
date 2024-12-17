<template>
  <div class="dashboard-container">
    <n-card title="欢迎">
      <n-space vertical>
        <n-statistic label="在线用户" :value="stats.onlineUsers" />
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface DashboardStats {
  onlineUsers: number;
}

const stats = ref<DashboardStats>({
  onlineUsers: 1234
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100%;
}
</style>
