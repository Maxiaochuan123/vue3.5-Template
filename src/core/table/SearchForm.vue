<script setup lang="ts">
import { ref, onMounted, nextTick, inject } from 'vue'
import type { FormInst } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import { useSearch } from './hooks/useSearch'
import { TABLE_HEIGHT_KEY } from './hooks/useTableHeight'
import { ChevronDown, ChevronUp } from '@vicons/ionicons5'

const props = defineProps<{
  model: Record<string, any>
  onSearch?: (values: any) => void
  transformParams?: (params: any) => any
}>()

const formRef = ref<FormInst | null>(null)
const formItemsRef = ref<HTMLDivElement | null>(null)
const isExpanded = ref(false)
const showExpandButton = ref(false)
const loading = ref(false)

// 在组件内部使用 useSearch 创建独立的表单状态
const { searchForm, handleReset } = useSearch({
  defaultValues: props.model,
  onSearch: props.onSearch,
  searchFormRef: formRef,
  transformParams: props.transformParams
})

// 处理搜索，添加loading状态
const handleSearch = async () => {
  loading.value = true
  try {
    await props.onSearch?.(props.transformParams ? props.transformParams(searchForm) : searchForm)
  } finally {
    // 确保loading状态至少显示300ms
    await new Promise(resolve => setTimeout(resolve, 200))
    loading.value = false
  }
}

// 获取表格高度更新函数
const updateTableHeight = inject(TABLE_HEIGHT_KEY, () => {})

// 切换展开/收起状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  // 使用 nextTick 等待 DOM 更新完成
  nextTick(() => {
    setTimeout(() => {
      updateTableHeight()
    }, 300) // 等待过渡动画完成
  })
}

// 检查是否需要显示展开按钮
const checkOverflow = () => {
  if (formItemsRef.value) {
    const containerHeight = formItemsRef.value.scrollHeight
    showExpandButton.value = containerHeight > 60 // 一行的高度
  }
}

// 监听DOM变化
const observeFormItems = () => {
  if (formItemsRef.value) {
    const observer = new ResizeObserver(() => {
      checkOverflow()
    })
    observer.observe(formItemsRef.value)
    return () => observer.disconnect()
  }
}

// 在挂载后检查是否需要展开按钮
onMounted(() => {
  checkOverflow()
  observeFormItems()
})
</script>

<template>
  <NForm 
    ref="formRef" 
    :model="searchForm"
    :show-feedback="false" 
    :label-width="80" 
    size="medium"
  >
    <div class="search-form-container">
      <div class="search-form-content">
        <div 
          ref="formItemsRef"
          class="search-form-items" 
          :class="{ 'is-expanded': isExpanded }"
        >
          <slot :form="searchForm" />
        </div>
        
        <div class="search-form-actions">
          <n-button 
            v-if="showExpandButton"
            text 
            @click="toggleExpand" 
            class="expand-button"
          >
            <template #icon>
              <n-icon>
                <ChevronDown v-if="!isExpanded" />
                <ChevronUp v-else />
              </n-icon>
            </template>
            {{ isExpanded ? '收起' : '展开' }}
          </n-button>
          <div class="action-buttons">

            <n-button 
              type="primary" 
              @click="handleSearch"
              :loading="loading"
            >
              <template #icon>
                <NIcon><Search /></NIcon>
              </template>
              查询
            </n-button>

            <n-button @click="handleReset">重置</n-button>
          </div>
        </div>
      </div>
    </div>
  </NForm>
</template>

<style scoped lang="less">
.search-form-container {
  width: 100%;

  .search-form-content {
    display: flex;
    align-items: end;
    gap: 16px;
    position: relative;
  }

  .search-form-items {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    transition: max-height 0.2s ease;
    overflow: hidden;
    max-height: 60px; // 默认显示一行
    padding-right: 200px; // 为操作栏预留空间

    &.is-expanded {
      max-height: 800px;
      transition: max-height 0.6s ease-in;
    }

    :deep(.n-form-item) {
      margin: 0;
      flex-shrink: 0;
      // 默认宽度
      &:not([data-width]) {
        width: 240px;
      }

      // 小尺寸
      &[data-width="sm"] {
        width: 180px;
      }

      // 中尺寸
      &[data-width="md"] {
        width: 240px;
      }

      // 大尺寸
      &[data-width="lg"] {
        width: 320px;
      }

      // 超大尺寸
      &[data-width="xl"] {
        width: 480px;
      }

      // 自定义宽度
      &[data-width^="w-"] {
        width: var(--form-item-width, 240px);
      }
    }
  }

  .search-form-actions {
    position: absolute;
    right: 0;
    top: 25px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 32px;

    .action-buttons {
      display: flex;
      gap: 12px;
    }
  }
}
</style>
