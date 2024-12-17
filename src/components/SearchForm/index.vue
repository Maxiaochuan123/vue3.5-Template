<script setup lang="ts">
import { ref } from 'vue'
import type { FormInst } from 'naive-ui'

const props = defineProps<{
  model: Record<string, any>
  onSearch?: (values: any) => void
  onReset?: () => void
}>()

const formRef = ref<FormInst | null>(null)

// 搜索方法
const handleSearch = () => {
  props.onSearch?.(props.model)
}

// 重置方法
const handleReset = () => {
  formRef.value?.restoreValidation()
  props.onReset?.()
}
</script>

<template>
  <NForm
    ref="formRef"
    :model="model"
    inline
    :show-feedback="false"
    :label-width="80"
    size="medium"
  >
    <slot />
    <NFormItem>
      <NSpace>
        <n-button type="primary" @click="handleSearch">查询</n-button>
        <n-button @click="handleReset">重置</n-button>
      </NSpace>
    </NFormItem>
  </NForm>
</template> 