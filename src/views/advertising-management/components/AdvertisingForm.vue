<script setup lang="ts">
import { ref, watch, computed, inject, toRef } from 'vue'
import type { FormInst } from 'naive-ui'
import { advertisementTypeOptions, type AdvertisementType } from '@/enum/options'
import { useMediaUploaderValidator } from '@/core/form/hooks/useUploaderValidator'
import { useFormData } from '@/core/form/hooks/useFormData'
import MediaUpload from '@/core/upload/media-upload/MediaUpload.vue'
import MediaPreviewPhone from '@/core/upload/media-upload/preview/MediaPreviewPhone.vue'

export interface FormState {
  adType: AdvertisementType
  adIcon: string[]
  media: string[]
  title: string
  description: string
  buttonText: string
  landingUrl: string
  androidUrl: string
  iosUrl: string
}

interface Props {
  editData?: Partial<FormState>
}

const props = defineProps<Props>()

// 注入响应式的 formType
const formType = inject<Ref<'add' | 'edit' | 'view'>>('formType')!

const formRef = ref<FormInst | null>(null)

// 媒体文件最大数量
const mediaMaxCount = 1
const adIconMaxCount = 1

const { formData, initialData } = useFormData<FormState>({
  initialData: {
    adType: 'CPM',
    title: '',
    media: [],
    adIcon: [],
    description: '',
    buttonText: '',
    landingUrl: '',
    androidUrl: '',
    iosUrl: ''
  },
  editData: toRef(props, 'editData')
})

// 媒体验证器
const mediaValidator = useMediaUploaderValidator({
  formRef,
  key: 'media',
  required: true,
  message: '请上传广告创意',
  requiredCount: mediaMaxCount
})

// 图标验证器
const adIconMediaValidator = useMediaUploaderValidator({
  formRef,
  key: 'adIcon',
  required: computed(() => ['CPC', 'CPA'].includes(formData.adType)), 
  message: '请上传广告图标',
  requiredCount: adIconMaxCount
})

// 表单验证规则
const rules = {
  adType: { required: true, message: '请选择广告类型', trigger: 'change' },
  media: mediaValidator.rule,
  title: [
    { required: true, message: '请输入广告标题', trigger: 'blur' },
    { max: 20, message: '标题最多20个字符', trigger: 'input' },
  ],
  adIcon: adIconMediaValidator.rule,
  buttonText: { 
    required: computed(() => ['CPC', 'CPA'].includes(formData.adType)),
    message: '请输入按钮文案',
    trigger: 'blur'
  },
  landingUrl: {
    required: computed(() => formData.adType === 'CPC'),
    message: '请输入落地页URL',
    trigger: 'blur'
  },
  androidUrl: {
    required: computed(() => formData.adType === 'CPA'),
    message: '请输入安卓下载地址',
    trigger: 'blur'
  },
  iosUrl: {
    required: computed(() => formData.adType === 'CPA'),
    message: '请输入苹果下载地址',
    trigger: 'blur'
  }
}

// 暴露给父组件的方法和数据
defineExpose({
  formRef,
  formData,
  initialData,
  validate: () => formRef.value?.validate()
})

const isViewMode = computed(() => formType.value === 'view')
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
        <template v-if="['CPM', 'CPC', 'CPA'].includes(formData.adType)">
          <NFormItem label="广告类型" path="adType">
            <NSelect
              v-model:value="formData.adType"
              :options="advertisementTypeOptions"
              placeholder="请选择广告类型"
              clearable
            />
          </NFormItem>

          <NFormItem label="广告创意" path="media" class="uploader-container">
            <MediaUpload
              v-model="formData.media"
              :max-count="mediaMaxCount"
              :accept="['img', 'video']"
              max-size="2GB"
              direction="row"
              :is-delete="isViewMode"
              @upload-success="mediaValidator.revalidate"
            >
              <template #description>
                <div class="decriton">
                  <span>视频大小不超过2GB，建议分辨率720p及以上；</span>
                  <span>仅支持MP4等常见格式；</span>
                  <span>视频和图片不能混合上传；</span>
                  <span>图片支持.jpg等常见格式，最多1张。</span>
                </div>
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

          <NFormItem label="广告描述">
            <NInput
              v-model:value="formData.description"
              type="textarea"
              placeholder="请输入广告描述"
              :maxlength="200"
              show-count
            />
          </NFormItem>
        </template>

        <!-- CPC/CPA 共同组件 -->
        <template v-if="['CPC', 'CPA'].includes(formData.adType)">
          <NFormItem label="广告图标" path="adIcon" class="uploader-container">
            <MediaUpload 
              v-model="formData.adIcon"
              accept="img"
              direction="row"
              :max-count="adIconMaxCount"
              :is-delete="isViewMode"
              @upload-success="adIconMediaValidator.revalidate"
            >
              <template #description>
                <div class="decriton">
                  <span>建议480*480尺寸</span>
                </div>
              </template>
            </MediaUpload>
          </NFormItem>

          <NFormItem label="按钮文案" path="buttonText">
            <NInput
              v-model:value="formData.buttonText"
              placeholder="默认为直达官网"
            />
          </NFormItem>
        </template>

        <!-- CPC 特有组件 -->
        <template v-if="formData.adType === 'CPC'">
          <NFormItem label="落地页URL" path="landingUrl">
            <NInput
              v-model:value="formData.landingUrl"
              placeholder="请录入正确的外部落地页URL地址"
            />
          </NFormItem>
        </template>

        <!-- CPA 特有组件 -->
        <template v-if="formData.adType === 'CPA'">
          <NFormItem label="安卓下载地址" path="androidUrl">
            <NInput
              v-model:value="formData.androidUrl"
              placeholder="请录入正确的安卓应用下载URL地址"
            />
          </NFormItem>
          <NFormItem label="苹果下载地址" path="iosUrl">
            <NInput
              v-model:value="formData.iosUrl"
              placeholder="请录入正确的苹果应用下载URL地址"
            />
          </NFormItem>
        </template>
      </NForm>
    </div>
    <div class="preview-content">
      <MediaPreviewPhone :url="formData.media[0]" title="预览广告创意" />
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

  .uploader-container {
    .decriton {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      font-size: 12px;
      color: #999;
    }
  }
</style>