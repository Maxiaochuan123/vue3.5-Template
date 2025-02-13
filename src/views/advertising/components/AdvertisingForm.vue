<script setup lang="ts">
import { ref, computed, inject, type Ref } from 'vue'
import type { FormInst } from 'naive-ui'
import { advertisingTypeOptions, type AdvertisingType } from '@/enum/options'
import { useMediaUploaderValidator } from '@/core/components/form/composables/useUploaderValidator'
import { useFormData } from '@/core/components/form/composables/useFormData'
import MediaUpload from '@/core/components/upload/media-upload/MediaUpload.vue'
import MediaPreviewPhone from '@/core/components/upload/media-upload/preview/MediaPreviewPhone.vue'
import { type FormType } from '@/core/components/form/DrawerForm.vue'
import { type AdvertisingFormState } from '@/api/modules/advertising'

// 注入响应式数据
const formType = inject<Ref<FormType>>('formType')!
const editData = inject<Ref<Partial<AdvertisingFormState>>>('editData')!

const formRef = ref<FormInst | null>(null)

// 媒体文件最大数量
const mediaMaxCount = 1
const adIconMaxCount = 1

const { formData, initialData } = useFormData<AdvertisingFormState>({
  initialData: {
    type: 1,
    title: '',
    content: '',
    icon: '',
    descs: '',
    button: '',
    url: '',
    android: '',
    ios: ''
  },
  editData
})

// 媒体验证器
const mediaValidator = useMediaUploaderValidator({
  formRef,
  key: 'content',
  required: true,
  message: '请上传广告创意',
  requiredCount: mediaMaxCount
})

// 图标验证器
// const adIconMediaValidator = useMediaUploaderValidator({
//   formRef,
//   key: 'icon',
//   required: computed(() => [2, 3].includes(formData.type)), 
//   message: '请上传广告图标',
//   requiredCount: adIconMaxCount
// })

// 表单验证规则
const rules = {
  type: { type: 'number', required: true, message: '请选择广告类型', trigger: 'change' },
  content: mediaValidator.rule,
  title: [
    { required: true, message: '请输入广告标题', trigger: 'blur' },
    { max: 20, message: '标题最多20个字符', trigger: 'input' },
  ],
  // icon: adIconMediaValidator.rule,
  descs: { required: true, message: '请输入广告描述', trigger: 'blur' },
  button: { 
    required: computed(() => [2, 3].includes(formData.type)),
    message: '请输入按钮文案',
    trigger: 'blur'
  },
  url: {
    required: computed(() => formData.type === 2),
    message: '请输入落地页URL',
    trigger: 'blur'
  },
  android: {
    required: computed(() => formData.type === 3),
    message: '请输入安卓下载地址',
    trigger: 'blur'
  },
  ios: {
    required: computed(() => formData.type === 3),
    message: '请输入苹果下载地址',
    trigger: 'blur'
  }
}

const isViewMode = computed(() => formType.value === 'view')


// 暴露给父组件的方法和数据
defineExpose({
  formData,
  initialData,
  validate: () => formRef.value?.validate()
})
</script>

<template>
  <div class="form-drawer-content">
    <div class="form-content">
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="120"
        :disabled="isViewMode"
      >
        <!-- CPM/CPC/CPA 基础组件 -->
        <template v-if="[1, 2, 3].includes(formData.type)">
          <NFormItem label="广告类型" path="type">
            <NSelect
              v-model:value="formData.type"
              :options="advertisingTypeOptions"
              placeholder="请选择广告类型"
              clearable
            />
          </NFormItem>

          <NFormItem label="广告创意" path="content">
            <MediaUpload
              v-model="formData.content"
              :max-count="mediaMaxCount"
              :accept="['img', 'video']"
              max-size="2GB"
              direction="row"
              :is-delete="isViewMode"
              @upload-success="mediaValidator.revalidate"
            >
              <template #description>
                  <span>视频大小不超过2GB，建议分辨率720p及以上</span>
                  <span>仅支持MP4等常见格式</span>
                  <span>视频和图片不能混合上传</span>
                  <span>图片支持.jpg等常见格式，最多1张</span>
              </template>
            </MediaUpload>
          </NFormItem>

          <NFormItem label="广告标题" path="title">
            <NInput
              v-model:value="formData.title"
              placeholder="视频广告主要内容，建议6-20个字符"
              :maxlength="20"
              show-count
            />
          </NFormItem>

          <NFormItem label="广告描述" path="descs">
            <NInput
              v-model:value="formData.descs"
              type="textarea"
              placeholder="请输入广告描述"
              :maxlength="200"
              show-count
            />
          </NFormItem>
        </template>

        <!-- CPC/CPA 共同组件 -->
        <template v-if="[2, 3].includes(formData.type)">
          <NFormItem label="广告图标" path="icon">
            <MediaUpload 
              v-model="formData.icon"
              accept="img"
              max-size="2MB"
              direction="row"
              :max-count="adIconMaxCount"
              :is-delete="isViewMode"
              >
              <!-- @upload-success="adIconMediaValidator.revalidate" -->
              <template #description>
                  <span>建议480*480尺寸</span>
              </template>
            </MediaUpload>
          </NFormItem>

          <NFormItem label="按钮文案" path="button">
            <NInput
              v-model:value="formData.button"
              placeholder="默认为直达官网"
            />
          </NFormItem>
        </template>

        <!-- CPC 特有组件 -->
        <template v-if="formData.type === 2">
          <NFormItem label="落地页URL" path="url">
            <NInput
              v-model:value="formData.url"
              placeholder="请录入正确的外部落地页URL地址"
            />
          </NFormItem>
        </template>

        <!-- CPA 特有组件 -->
        <template v-if="formData.type === 3">
          <NFormItem label="安卓下载地址" path="android">
            <NInput
              v-model:value="formData.android"
              placeholder="请录入正确的安卓应用下载URL地址"
            />
          </NFormItem>
          <NFormItem label="苹果下载地址" path="ios">
            <NInput
              v-model:value="formData.ios"
              placeholder="请录入正确的苹果应用下载URL地址"
            />
          </NFormItem>
        </template>
      </NForm>
    </div>
    <div class="preview-content">
      <MediaPreviewPhone :url="formData.content" title="预览广告创意" :data="{ _type: 'advertising', ...formData }" />
    </div>
  </div>
</template>

<style scoped lang="less">
  .form-drawer-content {
    width: 100%;
    display: flex;
    gap: 24px;
    .form-content {
      flex: 1;
    }
    .preview-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }
  }
</style>