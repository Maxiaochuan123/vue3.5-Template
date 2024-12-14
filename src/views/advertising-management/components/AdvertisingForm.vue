<script setup lang="ts">
import { ref } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import MediaUploader from '@/components/MediaUploader/index.vue'

interface FormModel {
  type: string
  media: string[]
  title: string
  description: string[]
}

const formRef = ref<FormInst | null>(null)
const model = ref<FormModel>({
  type: '',
  media: [],
  title: '',
  description: [''],
})

const rules: FormRules = {
  type: {
    required: true,
    message: '请选择广告类型',
    trigger: 'change',
  },
  media: {
    required: true,
    message: '请上传广告创意',
    trigger: 'change',
  },
  title: [
    {
      required: true,
      message: '请输入广告标题',
      trigger: 'blur',
    },
    {
      max: 20,
      message: '标题最多20个字符',
      trigger: 'input',
    },
  ],
}

const typeOptions = [
  { label: 'CPM: 可展示广告', value: 'CPM' },
  { label: 'CPC: 可点击广告', value: 'CPC' },
  { label: 'CPA: 可下载广告', value: 'CPA' },
]

// 添加描述行
const addDescription = () => {
  if (model.value.description.length < 5) {
    model.value.description.push('')
  }
}

// 删除描述行
const removeDescription = (index: number) => {
  model.value.description.splice(index, 1)
}

defineExpose({
  formRef,
  model,
})
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="100">
    <NFormItem label="广告类型" path="type">
      <NSelect
        v-model:value="model.type"
        :options="typeOptions"
        placeholder="请选择广告类型"
        clearable
      />
    </NFormItem>

    <NFormItem label="广告创意" path="media">
      <MediaUploader
        v-model="model.media"
        :max-count="2"
        max-size="100mb"
        :accept="['img', 'video']"
      />
    </NFormItem>

    <NFormItem label="广告标题" path="title">
      <NInput
        v-model:value="model.title"
        placeholder="视频广告主要内容，建议6-20个字符"
        :maxlength="20"
        show-count
      />
    </NFormItem>

    <NFormItem label="广告描述">
      <div class="space-y-2">
        <div v-for="(desc, index) in model.description" :key="index" class="flex gap-2">
          <NInput
            v-model:value="model.description[index]"
            type="textarea"
            placeholder="请输入广告描述"
            :maxlength="200"
            show-count
          />
          <NButton v-if="index > 0" circle type="error" @click="removeDescription(index)">
            <div class="i-carbon-trash-can" />
          </NButton>
        </div>
        <NButton v-if="model.description.length < 5" dashed class="w-full" @click="addDescription"
          >添加描述</NButton
        >
      </div>
    </NFormItem>
  </NForm>
</template>
