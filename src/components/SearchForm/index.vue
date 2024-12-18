<script setup lang="ts">
import { ref } from 'vue'
import type { FormInst } from 'naive-ui'
import { useSearch } from '@/hooks/useSearch'

const props = defineProps<{
  model: Record<string, any>
  onSearch?: (values: any) => void
}>()

const formRef = ref<FormInst | null>(null)

// 在组件内部使用 useSearch 创建独立的表单状态
const { searchForm, handleSearch, handleReset } = useSearch({
  defaultValues: props.model,
  onSearch: props.onSearch,
  searchFormRef: formRef
})
</script>

<template>
  <NForm 
    ref="formRef" 
    :model="searchForm"
    inline 
    :show-feedback="false" 
    :label-width="80" 
    size="medium"
  >
    <slot :form="searchForm" />
    <NFormItem>
      <NSpace>
        <n-button type="primary" @click="handleSearch">查询</n-button>
        <n-button @click="handleReset">重置</n-button>
      </NSpace>
    </NFormItem>
  </NForm>
</template>
