<template>
  <div class="dashboard-container">
    <n-card title="欢迎">
      <n-space vertical>
        <n-statistic label="在线用户" :value="1234" />
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
// 这里可以添加首页的具体业务逻辑
</script>

<style scoped>
.dashboard-container {
  min-height: 100%;
}
</style>
