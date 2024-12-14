<template>
  <n-message-provider>
    <addEditorContainer
      :title="isEdit ? '编辑广告' : '新增广告'"
      :submit-text="isEdit ? '保存' : '提交'"
      :loading="loading"
      @cancel="handleCancel"
      @submit="handleSubmit"
    >
      <!-- 这里放表单内容 -->
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="100"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="广告标题" path="title">
          <n-input
            v-model:value="formData.title"
            placeholder="请输入广告标题"
            :maxlength="20"
            show-count
          />
        </n-form-item>
        <!-- 其他表单项 -->
      </n-form>
    </addEditorContainer>
  </n-message-provider>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NMessageProvider, NForm, NFormItem, NInput } from 'naive-ui'
import type { FormInst } from 'naive-ui'
import addEditorContainer from '@/components/PageContainer/addEditorContainer.vue'

defineOptions({
  name: 'AdvertisingAddEditor',
})

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)

// 是否是编辑模式
const isEdit = computed(() => !!route.params.id)

// 表单数据
const formData = ref({
  title: '',
  type: '',
  // ... 其他字段
})

// 表单校验规则
const rules = {
  title: {
    required: true,
    message: '请输入广告标题',
    trigger: ['blur', 'input'],
  },
  // ... 其他字段的校验规则
}

// 取消
const handleCancel = () => {
  router.back()
}

// 提交
const handleSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (errors) return

    loading.value = true
    try {
      // TODO: 调用接口保存数据
      router.back()
    } finally {
      loading.value = false
    }
  })
}
</script>
