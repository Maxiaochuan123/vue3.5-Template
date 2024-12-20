<script setup lang="ts">
  import { ref, watch, computed, defineModel, nextTick } from 'vue'
  import RotateLeftSVG from '../../icons/RotateLeft.svg'
  import RotateRightSVG from '../../icons/RotateRight.svg'
  // import DownloadSVG from '../../icons/Download.svg' 
  import CloseSVG from '../../icons/Close.svg'
  import { isImage as isImageUtil, isVideo as isVideoUtil } from '../../utils'
  import Phone from './MediaPreviewPhone.vue'

  interface Props {
    file?: {
      url: string
      file?: File
    }
  }

  const props = defineProps<Props>()

  const modelValue = defineModel({ type: Boolean, default: false })

  const rotation = ref(0)
  const scale = ref(1)

  const isImage = computed(() => {
    return (
      props.file?.file?.type?.startsWith('image/') ||
      props.file?.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    )
  })

  const isVideo = computed(() => {
    return (
      props.file?.file?.type?.startsWith('video/') || props.file?.url?.match(/\.(mp4|webm|ogg)$/i)
    )
  })

  const fileUrl = computed(() => props.file?.url || '')

  // 添加 ref 来引用 Phone 组件
  const phoneRef = ref<InstanceType<typeof Phone> | null>(null)

  // 监听 modelValue 变化，当打开预览时自动播放视频
  watch(
    () => modelValue.value,
    async (val) => {
      if (val) {
        document.body.style.overflow = 'hidden'
        // 如果是视频，等待下一个 tick 后自动播放
        if (isVideo.value) {
          await nextTick()
          phoneRef.value?.play()
        }
      } else {
        document.body.style.overflow = 'auto'
        rotation.value = 0
        scale.value = 1
      }
    },
  )

  const handleClose = () => {
    modelValue.value = false
    rotation.value = 0
    scale.value = 1
  }

  const rotateImage = (type: 'left' | 'right') => {
    if (type === 'left') {
      rotation.value -= 90
    } else {
      rotation.value += 90
    }
  }

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault() // 阻止默认滚动行为

    // 根据滚轮方向调整缩放比例
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newScale = scale.value + delta

    // 限制缩放范围在 0.5 到 3 之间
    if (newScale >= 0.5 && newScale <= 3) {
      scale.value = newScale
    }
  }

  // const downloadImage = () => {
  //   if (!fileUrl.value) return
  //   const a = document.createElement('a')
  //   a.href = fileUrl.value
  //   a.download = props.file?.file?.name || 'image'
  //   a.target = '_blank' // 确保在新标签页打开
  //   a.rel = 'noopener noreferrer' // 安全性考虑
  //   document.body.appendChild(a)
  //   a.click()
  //   document.body.removeChild(a)
  // }
</script>

<template>
  <div v-if="modelValue" class="preview-modal" @click="handleClose">
    <!-- 右上角关闭按钮 -->
    <n-icon size="48" class="close-icon" @click="handleClose">
      <CloseSVG />
    </n-icon>

    <div class="preview-content" @click.stop>
      <!-- <img v-if="isImage" :src="fileUrl" :style="{ transform: `rotate(${rotation}deg)` }" /> -->
      <img
        v-if="isImage"
        :src="fileUrl"
        :style="{
          transform: `rotate(${rotation}deg) scale(${scale})`,
        }"
        @wheel="handleWheel"
      />
      <Phone 
        v-else-if="isVideo" 
        ref="phoneRef"
        :url="fileUrl" 
        :showTitle="false" 
        :showShadow="false" 
      />

      <!-- 底部工具栏 -->
      <div class="preview-toolbar" v-if="isImage">
        <n-icon size="24" class="toolbar-icon" @click="rotateImage('left')">
          <RotateLeftSVG />
        </n-icon>
        <n-icon size="24" class="toolbar-icon" @click="rotateImage('right')">
          <RotateRightSVG />
        </n-icon>
        <!-- <n-icon size="24" class="toolbar-icon" @click="downloadImage">
          <DownloadSVG />
        </n-icon> -->
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    .close-icon {
      position: fixed;
      top: 20px;
      right: 20px;
      color: white;
      cursor: pointer;
      z-index: 1001;

      &:hover {
        color: #1890ff;
      }
    }

    .preview-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;

      img {
        max-width: 100%;
        max-height: 90vh;
        transition: transform 0.3s;
        transform-origin: center center;
      }

      video {
        max-width: 100%;
        max-height: 90vh;
      }
    }

    .preview-toolbar {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 16px;
      padding: 12px 24px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 24px;

      .toolbar-icon {
        color: white;
        cursor: pointer;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }
</style>
