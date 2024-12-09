<template>
  <div>
    <NUpload
      :max="props.maxCount"
      :accept="props.accept"
      :default-upload="false"
      :show-file-list="true"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      :on-update:file-list="handleChange"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      list-type="image-card"
    >
      <div>点击或者拖动文件到该区域来上传</div>
      <template #tip>
        支持 {{ props.accept }} 格式，单个文件不超过 {{ props.maxSize }}
      </template>
    </NUpload>

    <!-- 预览模态框 -->
    <NModal v-model:show="previewVisible" preset="card" style="width: 800px">
      <template v-if="currentPreviewUrl">
        <img
          v-if="isImage(fileList.find((f) => f.url === currentPreviewUrl)?.file || null)"
          :src="currentPreviewUrl"
          class="w-full"
        />
        <video
          v-else-if="isVideo(fileList.find((f) => f.url === currentPreviewUrl)?.file || null)"
          :src="currentPreviewUrl"
          controls
          class="w-full"
        />
      </template>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  NModal,
  NUpload,
  type UploadCustomRequestOptions,
  type UploadFileInfo,
  useMessage,
} from 'naive-ui'
import { commonApi } from '@/api/modules/common'

interface Props {
  maxCount?: number
  maxSize?: string // 支持 '1mb', '500kb' 等格式
  accept?: string
  modelValue?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: 1,
  maxSize: '10mb',
  accept: '.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi',
  modelValue: () => [],
})

const emit = defineEmits(['update:modelValue'])
const message = useMessage()

const fileList = ref<UploadFileInfo[]>([])
const previewVisible = ref(false)
const currentPreviewUrl = ref('')

// 计算最大文件大小（转换为字节）
const maxSizeBytes = computed(() => {
  const size = props.maxSize.match(/^(\d+)\s*(kb|mb|gb)?$/i)
  if (!size) return 10 * 1024 * 1024 // 默认10MB

  const [, num, unit = 'mb'] = size
  const multipliers = {
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  }

  return Number(num) * multipliers[unit.toLowerCase() as keyof typeof multipliers]
})

// 判断文件类型
const isImage = (file: File | null) => {
  return file?.type.startsWith('image/')
}

const isVideo = (file: File | null) => {
  return file?.type.startsWith('video/')
}

// 处理文件上传前的验证
const beforeUpload = ({ file }: { file: UploadFileInfo }) => {
  console.log('beforeUpload:', file)
  // 检查文件大小
  if (file.file?.size && file.file.size > maxSizeBytes.value) {
    message.error(`文件大小不能超过 ${props.maxSize}`)
    return false
  }

  // 检查文件类型
  const acceptedTypes = props.accept.split(',')
  const fileExt = `.${file.file?.name.split('.').pop()?.toLowerCase()}`
  if (!acceptedTypes.includes(fileExt)) {
    message.error(`只支持上传 ${props.accept} 格式的文件`)
    return false
  }

  return true
}

// 处理上传
const handleChange = (options: { fileList: UploadFileInfo[] }) => {
  console.log('handleChange:', options)
  fileList.value = options.fileList
}

// 自定义上传方法
const customRequest = async ({ file, onFinish, onError }: UploadCustomRequestOptions) => {
  console.log('customRequest:', file)
  const formData = new FormData()
  formData.append('file', file.file as File)

  try {
    const { data } = await commonApi.uploadFile(formData)
    if (data) {
      file.url = data.url
      file.status = 'finished'
      onFinish()
      message.success('上传成功')
      emit('update:modelValue', [...(props.modelValue || []), data.url])
    }
  } catch (err) {
    console.error('上传失败:', err)
    file.status = 'error'
    onError()
    message.error('上传失败，请检查网络连接')
  }
}

// 处理预览
const handlePreview = (file: UploadFileInfo) => {
  currentPreviewUrl.value = file.url || ''
  previewVisible.value = true
}

// 处理删除
const handleRemove = ({
  file,
  fileList: newFileList,
}: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) => {
  console.log('handleRemove:', file, newFileList)
  fileList.value = newFileList
  emit(
    'update:modelValue',
    newFileList.map((f) => f.url || ''),
  )
  return true
}
</script>

<style scoped>
.upload-trigger {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.preview-content {
  max-width: 100%;
  max-height: 80vh;
}
</style>
