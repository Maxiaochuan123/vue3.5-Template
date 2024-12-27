<script setup lang="ts">
import { ref } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import MediaUpload from '@/core/upload/media-upload/MediaUpload.vue'
import { useMediaUploaderValidator } from '@/core/form/hooks/useUploaderValidator'

type SetAdvertAccountForm = {
  nickname: string
  backgroundImg: string
}

const formRef = ref<FormInst | null>(null)

const formData = ref<SetAdvertAccountForm>({
  nickname: '',
  backgroundImg: '',
})

const mediaMaxCount = 1
// 媒体验证器
const mediaValidator = useMediaUploaderValidator({
  formRef,
  key: 'backgroundImg',
  required: true,
  message: '请上传头像',
  requiredCount: mediaMaxCount
})

// 表单验证规则
const rules: FormRules = {
  backgroundImg: mediaValidator.rule,
  nickname: { required: true, message: '请输入昵称', trigger: 'blur' }
}

// 暴露给父组件的方法和数据
defineExpose({
  formRef,
  formData,
  validate: () => formRef.value?.validate()
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
      <NFormItem label="头像" path="backgroundImg">
        <MediaUpload
          v-model="formData.backgroundImg"
          :max-count="mediaMaxCount"
          :accept="['img']"
          max-size="2MB"
          direction="row"
        >
          <template #description>
              <span>建议480*480尺寸</span>
              <span>仅支持.jpg等常见格式</span>
          </template>
        </MediaUpload>
      </NFormItem>
      <NFormItem label="昵称" path="nickname">
        <NInput
          v-model:value="formData.nickname"
          placeholder="请输入昵称"
        />
      </NFormItem>
    </NForm>
  </div>
</template>