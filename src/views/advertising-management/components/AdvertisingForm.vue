<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { FormInst, FormItemRule } from 'naive-ui'
import { advertisementTypeOptions } from '@/enum/options'
import MediaUploader from '@/components/MediaUploader/index.vue'

interface FormState {
  adType: 'CMP' | 'CPC' | 'CPA'
  adIcon: string[]
  type: string
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
  adType: 'CMP',
  adIcon: [],
  type: '', 
  media: [], 
  title: '', 
  description: '',
  buttonText: '',
  landingUrl: '',
  androidUrl: '',
  iosUrl: ''
})

const rules = {
  adType: { required: true, message: '请选择广告类型', trigger: 'change' },
  media: {
    required: true,
    message: '请上传广告创意',
    trigger: ['change', 'blur'],
    validator: (rule: FormItemRule, value: string[]) => {
      if (!Array.isArray(value) || value.length === 0) {
        return new Error('请上传广告创意')
      }
    },
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
  adIcon: { required: true, message: '请上传广告图标', trigger: 'change' },
  buttonText: { required: true, message: '请输入按钮文案', trigger: 'blur' },
  landingUrl: { required: true, message: '请输入落地页URL', trigger: 'blur' },
  androidUrl: { required: true, message: '请输入安卓下载地址', trigger: 'blur' },
  iosUrl: { required: true, message: '请输入苹果下载地址', trigger: 'blur' }
}

watch(
  () => formData.media,
  (newVal) => {
    if (newVal && newVal.length > 0 && formRef.value) {
      formRef.value.validate(['media'])
    }
  },
  { deep: true },
)

defineExpose({
  formRef,
  formData,
  media: computed(() => formData.media[0]),
})
</script>

<template>
  <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="120">
    <p v-for="item in 100" :key="item">123</p>
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

      <n-form-item label="广告创意" path="media" class="media-uploader-container">
        <media-uploader
          v-model="formData.media"
          :max-count="1"
          max-size="2GB"
          :accept="['img', 'video']"
        />
        <div class="decriton">
          <span>视频大小不超过2GB，建议分辨率720p及以上；</span>
          <span>仅支持MP4等常见格式；</span>
          <span>视频和图片不能混合上传；</span>
          <span>图片支持.jpg等常见格式，最多1张。</span>
        </div>
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
      <n-form-item label="广告图标" path="adIcon">
        <media-uploader 
          v-model="formData.adIcon"
          accept="img"
        />
        <div class="decriton">
          <span>建议480*480尺寸</span>
        </div>
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
</template>

<style scoped lang="less">
  .media-uploader-container {
    .decriton {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      font-size: 12px;
      color: #999;
    }
  }
</style>
