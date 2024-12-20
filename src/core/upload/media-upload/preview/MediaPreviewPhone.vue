<script setup lang="ts">
import { ref, computed } from 'vue'
import { NIcon } from 'naive-ui'
import { PlayCircleOutline, PauseCircleOutline } from '@vicons/ionicons5'
import { isVideo, isImage } from '../../utils'
import type { FileItem } from '../../interface'
import { useThemeVars } from 'naive-ui'

interface Props {
  url: string | null
  title?: string
  showTitle?: boolean
  showShadow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  url: null,
  title: '预览',
  showTitle: true,
  showShadow: true,
})

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const themeVars = useThemeVars()

const fileItem = computed<FileItem>(() => ({
  url: props.url || '',
  status: 'success',
  progress: 100,
}))

const mediaType = computed(() => {
  if (!props.url) return null
  if (isVideo(fileItem.value)) return 'video'
  if (isImage(fileItem.value)) return 'image'
  return null
})

const showPlayButton = computed(() => {
  return mediaType.value === 'video' && props.url
})

const togglePlay = () => {
  if (!videoRef.value) return

  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const handleTimeUpdate = () => {
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime
}

const handleLoadedMetadata = () => {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration
}

const handleProgressClick = async (e: MouseEvent) => {
  if (!videoRef.value) return
  const progressBar = e.currentTarget as HTMLDivElement
  const rect = progressBar.getBoundingClientRect()
  const percentage = (e.clientX - rect.left) / rect.width

  // 设置新的播放时间
  videoRef.value.currentTime = duration.value * percentage

  // 如果视频正在播放，确保继续播放
  if (isPlaying.value) {
    try {
      await videoRef.value.play()
    } catch (error) {
      console.error('Failed to play video:', error)
    }
  }
}

// 格式化时间
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 格式化后的时间显示
const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))

// 添加视频结束处理函数
const handleVideoEnded = () => {
  // 重置播放状态
  isPlaying.value = false
  // 重置播放时间
  if (videoRef.value) {
    videoRef.value.currentTime = 0
    currentTime.value = 0
  }
}

// 添加 play 方法
const play = async () => {
  if (!videoRef.value) return
  try {
    await videoRef.value.play()
    isPlaying.value = true
  } catch (error) {
    console.error('Failed to play video:', error)
  }
}

// 暴露 play 方法给父组件
defineExpose({
  play
})
</script>

<template>
  <span class="preview-title" v-if="showTitle">{{ title }}</span>
  <div class="preview-container">
    <template v-if="url">
      <video
        v-if="mediaType === 'video'"
        ref="videoRef"
        :src="url"
        class="preview-media"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleLoadedMetadata"
        @ended="handleVideoEnded"
      />
      <img v-else-if="mediaType === 'image'" :src="url" class="preview-media" />

      <div v-if="showPlayButton" class="video-controls" @click="togglePlay">
        <div class="overlay" :class="{ 'is-playing': isPlaying }">
          <div class="play-button">
            <NIcon size="48">
              <PlayCircleOutline v-if="!isPlaying" />
              <PauseCircleOutline v-else />
            </NIcon>
          </div>
        </div>

        <div class="progress-container">
          <div class="time-display">{{ formattedCurrentTime }} / {{ formattedDuration }}</div>
          <div class="progress-bar" @click="handleProgressClick">
            <div class="progress" :style="{ width: `${(currentTime / duration) * 100}%` }" />
          </div>
        </div>
      </div>
    </template>
    <div v-else class="empty-state">上传后即可预览效果</div>
  </div>
</template>

<style scoped lang="less">
.preview-container {
  width: 300px;
  aspect-ratio: 9/16;
  background-color: #f0f0f0;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  box-shadow: v-bind('props.showShadow ? "20px 20px 40px #d1d1d1, -20px -20px 40px #ffffff" : "none"');
  border: none;
}

.preview-title {
  padding: 4px 16px;
  font-size: 14px;
  font-weight: 500;
  color: v-bind('themeVars.primaryColor');
  text-align: center;
  // background-color: #f5f7fa;
  border: 1px dashed v-bind('themeVars.primaryColor');
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 2;
}

.preview-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 14px;
  text-align: center;
  text-shadow: 1px 1px 2px #ffffff;
}

.video-controls {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  border-radius: 24px;

  .overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(240, 240, 240, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
    border-radius: 24px;

    &.is-playing {
      background-color: transparent;
      backdrop-filter: none;
      opacity: 0;
    }

    .play-button {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #666;
      cursor: pointer;
      opacity: 0.9;
      transition: all 0.2s;
      transform: scale(1);
      filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));

      &:hover {
        color: v-bind('themeVars.primaryColor');
      }
    }
  }

  .progress-container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(transparent, rgba(240, 240, 240, 0.3));
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-bottom-left-radius: 24px;
    border-bottom-right-radius: 24px;

    .time-display {
      color: rgba(0, 0, 0, 0.85);
      font-size: 12px;
      text-align: center;
      text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
      font-family: monospace;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background-color: #e0e0e0;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: 
        inset 2px 2px 4px rgba(0, 0, 0, 0.1),
        inset -2px -2px 4px rgba(255, 255, 255, 0.7);

      .progress {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background-color: v-bind('themeVars.primaryColor');
        border-radius: 4px;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      }

      &:hover {
        height: 8px;
        margin-top: -1px;
        margin-bottom: -1px;
      }
    }
  }

  &:hover {
    .progress-container {
      opacity: 1;
    }
  }
}
</style>
