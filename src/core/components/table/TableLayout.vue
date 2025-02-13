<template>
  <div class="page-container">
    <NCard class="page-card">
      <!-- 搜索表单区域 -->
      <div class="search-form">
        <slot name="search"></slot>
      </div>

      <!-- 工具栏区域 -->
      <div class="table-header">
        <slot name="toolbar"></slot>
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <slot name="table"></slot>
      </div>

      <!-- 默认插槽 -->
      <slot></slot>
    </NCard>
  </div>
</template>

<style scoped lang="less">
.page-container {
  padding: 8px;
  width: 100%;
  height: calc(100vh - 64px);
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

  &:deep(.n-card__content) {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 500px;

    .search-form {
      margin-bottom: 16px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .table-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }

  :deep(.n-data-table) {
    flex: 1;
  }
}
</style>
