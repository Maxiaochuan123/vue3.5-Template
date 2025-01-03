<script setup lang="ts">
import { ref } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'

const props = defineProps<{
  rowData: Record<string, any>
}>()

const formRef = ref<FormInst | null>(null)

const formData = ref<{ id: number }>({
  id: props.rowData.id,
})

// 表单验证规则
const rules: FormRules = {
}

// 暴露给父组件的方法和数据
defineExpose({
  formData,
  validate: () => formRef.value?.validate(),
})
</script>

<template>
  <div class="form-content">
    <NForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="left"
      label-width="100"
    >
      <NDescriptions :column="1" label-placement="left" label-align="right">
        <NDescriptionsItem label="清空对象">{{ rowData?.realName }}</NDescriptionsItem>
        <NDescriptionsItem label="公司名称">{{ rowData?.companyName }}</NDescriptionsItem>
        <NDescriptionsItem label="手机号">{{ rowData?.mobile }}</NDescriptionsItem>
        <NDescriptionsItem label="剩余本金">{{ rowData?.principalAmount }}</NDescriptionsItem>
        <NDescriptionsItem label="剩余赠送">{{ rowData?.giftAmount }}</NDescriptionsItem>
      </NDescriptions>
    </NForm>
  </div>
</template>

<style scoped lang="less">
.form-drawer-content {
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  
  .form-content {
    flex: 1;
  }
}
</style>