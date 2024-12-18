<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import type { FormInst, FormItemRule } from 'naive-ui'
import { advertisementTypeOptions, type AdvertisementType } from '@/enum/options'
import MediaUploader from '@/components/MediaUploader/index.vue'
import { useMediaUploaderValidator } from '@/hooks/useUploaderValidator'
import FormDrawer from '@/components/FormDrawer/index.vue'
import Phone from '@/components/MediaUploader/preview/components/ImgVideoPreviewPhone.vue'
import { useFormSubmit } from '@/hooks/useFormSubmit'

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

const formRef = ref<FormInst | null>(null)

const formData = reactive<FormState>({
  adType: 'CPM',
  title: '', 
  adIcon: [],
  media: [], 
  description: '',
  buttonText: '',
  landingUrl: '',
  androidUrl: '',
  iosUrl: ''
})

// 媒体文件最大数量
const mediaMaxCount = 1
const adIconMaxCount = 1

const mediaValidator = useMediaUploaderValidator({
  formRef,
  key: 'media',
  required: true,
  message: '请上传广告创意',
  requiredCount: mediaMaxCount
})

const rules = {
  adType: { required: false, message: '请选择广告类型', trigger: 'change' },
  media: mediaValidator.rule,
  title: [
    { required: true, message: '请输入广告标题', trigger: 'blur' },
    { max: 20, message: '标题最多20个字符', trigger: 'input' },
  ],
  adIcon: useMediaUploaderValidator({
    formRef,
    key: 'adIcon',
    required: false, 
    message: '请上传广告图标',
    requiredCount: adIconMaxCount
  }),
  buttonText: { required: true, message: '请输入按钮文案', trigger: 'blur' },
  landingUrl: { required: true, message: '请输入落地页URL', trigger: 'blur' },
  androidUrl: { required: true, message: '请输入安卓下载地址', trigger: 'blur' },
  iosUrl: { required: true, message: '请输入苹果下载地址', trigger: 'blur' }
}

const drawerRef = ref<InstanceType<typeof FormDrawer> | null>(null)
const { handleSubmit, submitLoading } = useFormSubmit()

const props = defineProps<{
  onSuccess?: () => void
  formType?: 'add' | 'edit'
  data?: Record<string, any>
  extraFields?: string[]
}>()

// Add computed title
const drawerTitle = computed(() => {
  return props.formType === 'edit' ? '编辑广告' : '新增广告'
})

const show = () => {
  // 先打开抽屉
  drawerRef.value?.open()
  
  // 使用 nextTick 确保在 DOM 更新后执行数据回填
  nextTick(() => {
    // 重置表单验证
    formRef.value?.restoreValidation()
    
    if (props.formType === 'edit' && props.data) {
      // 编辑模式：使用 Object.assign 一次性更新所有数据
      Object.assign(formData, {
        adType: props.data.adType || 'CPM',
        title: props.data.title || '',
        media: Array.isArray(props.data.media) ? [...props.data.media] : [],
        adIcon: Array.isArray(props.data.adIcon) ? [...props.data.adIcon] : [],
        description: props.data.description || '',
        buttonText: props.data.buttonText || '',
        landingUrl: props.data.landingUrl || '',
        androidUrl: props.data.androidUrl || '',
        iosUrl: props.data.iosUrl || ''
      })
    } else {
      // 新增模式：确保完全重置所有字段为初始值
      Object.assign(formData, {
        adType: 'CPM',
        title: '',
        media: [], // 确保清空媒体数组
        adIcon: [],
        description: '',
        buttonText: '',
        landingUrl: '',
        androidUrl: '',
        iosUrl: ''
      })
    }
  })
}

const hide = () => {
  drawerRef.value?.close()
}

// Add submit handler
const onSubmit = async () => {
  const result = await handleSubmit({
    submitApi: async (data: any) => {
      // 合并额外字段
      const submitData = {
        ...data,
        ...(props.formType === 'edit' && props.extraFields 
          ? Object.fromEntries(
              props.extraFields.map(field => [field, props.data?.[field]])
            )
          : {})
      }
      console.log('提交的数据:', submitData)
      return Promise.resolve()
    },
    formRef: formRef.value,
    formData: formData,
    onSuccess: () => {
      hide()
      props.onSuccess?.()
    }
  })
  return result
}

// Modify expose
defineExpose({
  formRef,
  formData,
  media: computed(() => formData.media[0]),
  show,
  hide
})
</script>

<template>
  <FormDrawer
    ref="drawerRef"
    :title="drawerTitle"
    :submit-api="onSubmit"
    :form-ref="formRef"
  >
    <div class="form-drawer-content">
      <div class="form-content">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-placement="left"
          label-width="120"
        >
          <!-- CPM/CPC/CPA 基础组件 -->
          <template v-if="['CPM', 'CPC', 'CPA'].includes(formData.adType)">
            <n-form-item label="广告类型" path="adType">
              <n-select
                v-model:value="formData.adType"
                :options="advertisementTypeOptions"
                placeholder="请选择广告类型"
                clearable
              />
            </n-form-item>

            <n-form-item label="广告创意" path="media" class="uploader-container">
              <media-uploader
                v-model="formData.media"
                :max-count="mediaMaxCount"
                :accept="['img', 'video']"
                max-size="2GB"
                direction="row"
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
              </media-uploader>
            </n-form-item>

            <n-form-item label="广告标题" path="title">
              <n-input
                v-model:value="formData.title"
                placeholder="视频广告主要内容，建议6-20个字符"
                :maxlength="20"
                show-count
              />
            </n-form-item>

            <n-form-item label="广告描述">
              <n-input
                v-model:value="formData.description"
                type="textarea"
                placeholder="请输入广告描述"
                :maxlength="200"
                show-count
              />
            </n-form-item>
          </template>

          <!-- CPC/CPA 共同组件 -->
          <template v-if="['CPC', 'CPA'].includes(formData.adType)">
            <n-form-item label="广告图标" path="adIcon" class="uploader-container">
              <media-uploader 
                v-model="formData.adIcon"
                accept="img"
                direction="row"
                :max-count="adIconMaxCount"
              >
                <template #description>
                  <div class="decriton">
                    <span>建议480*480尺寸</span>
                  </div>
                </template>
              </media-uploader>
            </n-form-item>

            <n-form-item label="按钮文案" path="buttonText">
              <n-input
                v-model:value="formData.buttonText"
                placeholder="默认为直达官网"
              />
            </n-form-item>
          </template>

          <!-- CPC 特有组件 -->
          <template v-if="formData.adType === 'CPC'">
            <n-form-item label="落地页URL" path="landingUrl">
              <n-input
                v-model:value="formData.landingUrl"
                placeholder="请录入正确的外部落地页URL地址"
              />
            </n-form-item>
          </template>

          <!-- CPA 特有组件 -->
          <template v-if="formData.adType === 'CPA'">
            <n-form-item label="安卓下载地址" path="androidUrl">
              <n-input
                v-model:value="formData.androidUrl"
                placeholder="请录入正确的安卓应用下载URL地址"
              />
            </n-form-item>
            <n-form-item label="苹果下载地址" path="iosUrl">
              <n-input
                v-model:value="formData.iosUrl"
                placeholder="请录入正确的苹果应用下载URL地址"
              />
            </n-form-item>
          </template>
        </n-form>
      </div>
      <div class="preview-content">
        <Phone :url="formData.media[0]" title="预览广告创意" />
      </div>
    </div>
  </FormDrawer>
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