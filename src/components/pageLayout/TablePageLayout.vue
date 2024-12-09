<script setup lang="ts">
defineOptions({ name: 'TablePageLayout' })

defineProps<{
  // 是否显示hover效果，默认true
  hoverable?: boolean
}>()
</script>

<template>
  <div class="page-container">
    <NCard class="page-card" :class="{ 'hover-effect': hoverable !== false }">
      <slot></slot>
    </NCard>
  </div>
</template>

<style scoped lang="less">
.page-container {
  padding: 8px;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 64px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.page-card {
  height: 100%;
  background-color: var(--n-color) !important;
  transition:
    box-shadow 0.3s var(--n-bezier),
    background-color 0.3s var(--n-bezier);
  flex: 1;
  display: flex;
  flex-direction: column;

  &.hover-effect:hover {
    box-shadow: var(--n-box-shadow);
  }

  &:deep(.n-card__content) {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &:deep(.n-space) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
