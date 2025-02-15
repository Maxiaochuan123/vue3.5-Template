<script setup lang="ts">
  import { ref, computed, onBeforeUnmount, onMounted, watch } from 'vue'
  import { useMessage, useThemeVars } from 'naive-ui'
  import { isImage, isVideo, parseBytes } from '../utils'
  import { qiniuUploader } from '../plugins/qiniuUpload'
  import type { FileItem } from '../interface'
  // import commonApi from '@/api/modules/common'
  import { useAuthStore } from '@/core/stores/modules/auth'
  import MediaPreviewMask from './preview/MediaPreviewMask.vue'
  import AddSVG from '../icons/Add.svg'
  import SeeSVG from '../icons/See.svg'
  import PlaySVG from '../icons/Play.svg'
  import DeleteSVG from '../icons/Delete.svg'
  import Rotate360SVG from '../icons/Rotate360.svg'

  const themeVars = useThemeVars()
  const authStore = useAuthStore()
  // 文件类型映射
  const ACCEPT_MAPPING = {
    img: '.jpg,.jpeg,.png,.gif',
    video: '.mp4,.mov,.avi',
  } as const

  type AcceptType = keyof typeof ACCEPT_MAPPING | (keyof typeof ACCEPT_MAPPING)[]

  interface Props {
    maxCount?: number
    maxSize?: string
    accept?: AcceptType
    direction?: 'row' | 'column'
    isDelete?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    maxCount: 1,
    maxSize: '10mb',
    accept: () => 'img' as const,
    direction: 'column',
    isDelete: false
  })

  const message = useMessage()

  // v-model
  const modelValue = defineModel<string | string[]>("modelValue", {  default: '' })

  // 定义 emit
  const emit = defineEmits<{
    'upload-success': []  // 添加上传成功事件
  }>()

  // 状态
  const fileInput = ref<HTMLInputElement | null>(null)
  const isDragover = ref(false)
  const fileList = ref<FileItem[]>([])
  const previewVisible = ref(false)
  const currentPreviewFile = ref<{ url: string; file?: File }>()

  // 获取上传凭证
  // const token = ref<string>('')
  // const getUploadToken = async () => {
  //   const { data: uploadToken  } = await commonApi.uploadToken()
  //   token.value = uploadToken 
  // }
  // getUploadToken()

  // 重置组件状态的方法
  const reset = () => {
    fileList.value = []
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  // 初始化或更新文件列表
  const initializeFileList = () => {
    if (modelValue.value) {
      if (props.maxCount === 1 && typeof modelValue.value === 'string') {
        fileList.value = [{
          url: modelValue.value,
          status: 'success' as const,
          progress: 100,
        }]
      } else if (Array.isArray(modelValue.value) && modelValue.value.length > 0) {
        fileList.value = modelValue.value.map((url) => ({
          url,
          status: 'success' as const,
          progress: 100,
        }))
      } else {
        reset()
      }
    } else {
      reset()
    }
  }

  // 监听 modelValue 的变化
  watch(modelValue, () => {
    initializeFileList()
  }, { immediate: true })

  // 计算实际接受的文件类型
  const actualAccept = computed(() => {
    if (Array.isArray(props.accept)) {
      return props.accept.map((type) => ACCEPT_MAPPING[type]).join(',')
    }
    return ACCEPT_MAPPING[props.accept]
  })

  // 触发文件选择
  const triggerUpload = () => {
    // 先清空文件输入框的值，这样选择相同文件时也会触发 change 事件
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    fileInput.value?.click()
  }

  // 添加文件类型验证函数
  const isValidFileType = (file: File): boolean => {
    const acceptedTypes = Array.isArray(props.accept)
      ? props.accept
      : props.accept
        ? [props.accept]
        : []

    return acceptedTypes.some((type) => {
      const allowedTypes = ACCEPT_MAPPING[type].split(',')
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
      const fileType = file.type.toLowerCase()

      return allowedTypes.some((allowed) =>
        allowed.startsWith('.')
          ? fileExt === allowed.toLowerCase()
          : fileType === allowed.toLowerCase(),
      )
    })
  }

  // 添加检查重复文件的函数
  const isDuplicateFile = (file: File): boolean => {
    // 如果是单文件模式，检查是否已有值
    if (props.maxCount === 1) {
      return modelValue.value !== '' && modelValue.value !== null && modelValue.value !== undefined
    }

    // 如果是多文件模式，检查当前已上传的文件数量
    const currentFiles = Array.isArray(modelValue.value) ? modelValue.value : []
    return currentFiles.length + fileList.value.length >= props.maxCount
  }

  // 处理文件选择
  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
      const files = Array.from(input.files)
      // 检查是否超过最大数量限制
      const remainingSlots = props.maxCount - fileList.value.length
      if (files.length > remainingSlots) {
        message.warning(`最多还能上传${remainingSlots}个文件`)
        return
      }

      const validFiles = files.filter((file) => {
        if (!isValidFileType(file)) {
          message.warning(`只支持上传 ${props.accept} 类型的文件`)
          return false
        }
        return true
      })
      uploadFiles(validFiles)
    }
  }

  // 处理拖拽
  const handleDragOver = () => (isDragover.value = true)
  const handleDragLeave = () => (isDragover.value = false)
  const handleDrop = (event: DragEvent) => {
    isDragover.value = false
    const files = Array.from(event.dataTransfer?.files || [])
    // 检查是否超过最大数量限制
    const remainingSlots = props.maxCount - fileList.value.length
    if (files.length > remainingSlots) {
      message.warning(`最多还能上传${remainingSlots}个文件`)
      return
    }

    const validFiles = files.filter((file) => {
      if (!isValidFileType(file)) {
        message.warning(`只支持上传 ${props.accept} 类型的文件`)
        return false
      }
      return true
    })
    uploadFiles(validFiles)
  }

  // 上传文件
  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      if (fileList.value.length >= props.maxCount) break

      if (file.size > parseBytes(props.maxSize)) {
        message.warning(`文件 ${file.name} 大小不能超过 ${props.maxSize}`)
        continue
      }

      const fileItem: FileItem = {
        file,
        status: 'uploading',
        progress: 0,
        url: URL.createObjectURL(file),
      }

      try {
        // 先订阅状态变化
        const unsubscribe = qiniuUploader.subscribe((files) => {
          // console.log('上传状态更新:', files)
          const uploadFile = files.find((f) => f.file === file)
          if (uploadFile?.status === 'success' && uploadFile.url) {
            URL.revokeObjectURL(fileItem.url!)
            fileItem.url = uploadFile.url
            fileItem.status = 'success'
            fileItem.progress = 100
            if (props.maxCount === 1) {
              modelValue.value = uploadFile.url
            } else {
              modelValue.value = [...(Array.isArray(modelValue.value) ? modelValue.value : []), uploadFile.url]
            }
            emit('upload-success')
            unsubscribe()
          } else if (uploadFile?.status === 'error') {
            URL.revokeObjectURL(fileItem.url!)
            fileItem.status = 'error'
            // 从 fileList 中移除失败的文件
            const index = fileList.value.indexOf(fileItem)
            if (index !== -1) {
              fileList.value.splice(index, 1)
            }
            message.error('上传失败，请重试')
            unsubscribe()
          } else if (uploadFile?.status === 'uploading') {
            fileItem.progress = uploadFile.progress
          }
        })

        // 添加到文件列表
        fileList.value.push(fileItem)
        
        // 开始上传，如果token过期会自动刷新重试
        let currentToken = authStore.uploadToken
        try {
          await qiniuUploader.upload(file, currentToken)
        } catch (error: any) {
          // 如果是token过期错误，尝试刷新token并重新上传
          if (error?.message?.includes('token expired') || error?.message?.includes('invalid token')) {
            try {
              currentToken = await authStore.getUploadToken()
              await qiniuUploader.upload(file, currentToken)
            } catch (refreshError) {
              throw refreshError
            }
          } else {
            throw error
          }
        }
      } catch (error) {
        URL.revokeObjectURL(fileItem.url!)
        // 从 fileList 中移除失败的文件
        const index = fileList.value.indexOf(fileItem)
        if (index !== -1) {
          fileList.value.splice(index, 1)
        }
        message.error('上传失败：' + (error as Error).message)
      }
    }
  }

  // 重试上传
  const retryUpload = async (file: FileItem) => {
    if (file.file) {
      const index = fileList.value.indexOf(file)
      fileList.value.splice(index, 1)
      await uploadFiles([file.file])
    }
  }
  // 处理删除
  const handleRemove = (file: FileItem) => {
    const index = fileList.value.findIndex((item) => item === file)
    if (index !== -1) {
      fileList.value.splice(index, 1)

      // 更新 modelValue，过滤掉被删除的文件
      if (file.url) {
        if (props.maxCount === 1) {
          modelValue.value = ''
        } else {
          const currentValue = modelValue.value
          if (Array.isArray(currentValue)) {
            modelValue.value = currentValue.filter((url: string) => url !== file.url)
          }
        }
      }

      // 清空文件输入框的值
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      // 如果有预览URL，需要释放
      if (file._previewUrl) {
        URL.revokeObjectURL(file._previewUrl)
        delete file._previewUrl
      }
    }
  }

  // 添加预览 URL 获取函数
  const getPreviewUrl = (file: FileItem) => {
    if (!file.file) return file.url
    if (!file._previewUrl) {
      file._previewUrl = URL.createObjectURL(file.file)
    }
    return file._previewUrl
  }

  // 打开预览
  const handlePreview = (file: FileItem) => {
    if (file.url) {
      currentPreviewFile.value = {
        url: file.url,
        file: file.file
      }
      previewVisible.value = true
    }
  }

  // 添加清理函数
  onBeforeUnmount(() => {
    fileList.value.forEach((file) => {
      if (file._previewUrl) {
        URL.revokeObjectURL(file._previewUrl)
        delete file._previewUrl
      }
    })
  })
</script>

<template>
  <div class="media-upload-wrapper" :class="{ 'direction-row': direction === 'row' }">
    <div class="media-upload">
      <!-- 上传区域 -->
      <div
        v-if="fileList.length < props.maxCount"
        class="upload-area"
        @click="triggerUpload"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        :class="{ 'is-dragover': isDragover }"
      >
        <input
          ref="fileInput"
          type="file"
          :accept="actualAccept"
          @change="handleFileChange"
          class="file-input"
          :multiple="props.maxCount > 1"
        />
        <div class="upload-icon">
          <n-icon size="30">
            <AddSVG />
          </n-icon>
        </div>
      </div>

      <!-- 文件列表 -->
      <div class="file-list" :style="{ 'margin-right': fileList.length > 0 ? '8px' : '0' }">
        <div v-for="(file, index) in fileList" :key="file.url || index" class="file-item">
          <!-- 上传中状态 -->
          <div v-if="file.status === 'uploading'" class="file-uploading">
            <div class="file-preview">
              <img v-if="isImage(file)" :src="getPreviewUrl(file)" alt="preview" />
              <video v-else-if="isVideo(file)" :src="getPreviewUrl(file)"></video>
            </div>
            <div class="upload-overlay">
              <n-spin size="small" />
            </div>
          </div>

          <!-- 上传失败状态 -->
          <div v-if="file.status === 'error'" class="file-error">
            <div class="error-actions">
              <n-icon size="30">
                <Rotate360SVG @click="retryUpload(file)" />
              </n-icon>
              <n-icon size="30">
                <DeleteSVG @click="handleRemove(file)" />
              </n-icon>
            </div>
          </div>
          <!-- 上传成功状态 -->
          <template v-else>
            <div class="file-preview">
              <img v-if="isImage(file)" :src="getPreviewUrl(file)" alt="preview" />
              <video v-else-if="isVideo(file)" :src="getPreviewUrl(file)"></video>
            </div>
            <!-- 添加类型标签 -->
            <div class="file-type-tag">
              <n-tag :type="isImage(file) ? 'success' : 'warning'" size="small">
                {{ isImage(file) ? '图片' : '视频' }}
              </n-tag>
            </div>
            <!-- 操作 -->
            <div class="file-actions">
              <n-icon size="30" v-if="isImage(file)" class="file-preview-icon">
                <SeeSVG @click="handlePreview(file)" />
              </n-icon>
              <n-icon size="30" v-if="isVideo(file)" class="file-preview-icon">
                <PlaySVG @click="handlePreview(file)" />
              </n-icon>
              <n-icon size="30" v-if="!props.isDelete" class="file-delete-icon">
                <DeleteSVG @click="handleRemove(file)" />
              </n-icon>
            </div>
          </template>
        </div>
      </div>

      <!-- 预览组件 -->
      <MediaPreviewMask v-model="previewVisible" :file="currentPreviewFile" />
    </div>
    
    <!-- 添加描述插槽 -->
    <div class="media-upload-description" v-if="$slots.description">
      <slot name="description"></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
  .media-upload-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &.direction-row {
      flex-direction: row;
      align-items: flex-end;

      .media-upload {
        .file-list:not(:empty) + .upload-area {
          margin-left: 8px;
        }
      }
    }

    &:not(.direction-row) {
      .media-upload {
        .file-list:not(:empty) + .upload-area {
          margin-top: 8px;
        }
      }
    }

    .media-upload {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;

      .upload-area {
        order: 2;
        width: 100px;
        height: 100px;
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        cursor: pointer;
        transition: border-color 0.3s;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #999;
        margin: 0;

        &:hover {
          border-color: v-bind('themeVars.primaryColor');
          color: v-bind('themeVars.primaryColor');
        }

        input {
          display: none;
        }
      }

      .file-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 8px;
        order: 1;
      }

      .file-item {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #d9d9d9;
        flex-shrink: 0;

        .file-type-tag {
          position: absolute;
          top: 2px;
          right: 2px;
          z-index: 2;

          :deep(.n-tag) {
            padding: 0 6px;
            font-size: 12px;
            border-radius: 2px;
          }
        }

        .file-preview {
          width: 100%;
          height: 100%;

          img,
          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .file-uploading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: #fff;

          .progress-text {
            margin-bottom: 8px;
            font-size: 14px;
          }

          .progress-bar {
            width: 80%;
            height: 2px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 1px;
            overflow: hidden;

            .progress {
              height: 100%;
              background: #fff;
              transition: width 0.3s ease;
            }
          }
        }

        .file-error {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;

          .error-actions {
            display: flex;
            gap: 8px;
            color: #fff;

            .n-icon {
              cursor: pointer;
              transition: transform 0.3s;

              &:hover {
                transform: scale(1.1);
              }
            }
          }
        }

        .file-actions {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.3s;

          .n-icon {
            color: #fff;
            cursor: pointer;
            transition: transform 0.3s;

            &:hover {
              transform: scale(1.1);
            }
          }

          .file-preview-icon:hover {
            color: v-bind('themeVars.primaryColor');
          }

          .file-delete-icon:hover {
            color: v-bind('themeVars.errorColor');
          }
        }

        &:hover {
          .file-actions {
            opacity: 1;
          }
        }
      }

      .upload-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
      }
    }

    .media-upload-description {
      // background-color: #ff6600;
      // flex-shrink: 0;

        display: flex;
        flex-direction: column;
        // margin-left: 10px;
        font-size: 12px;
        color: #999;
    }
  }
</style>
