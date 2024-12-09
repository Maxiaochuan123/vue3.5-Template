<template>
  <div class="video-preview" @click="handlePlay">
    <div v-if="!isPlaying" class="preview-cover">
      <img v-if="coverUrl" :src="coverUrl" class="cover-image" />
      <div v-else class="no-cover">
        <n-icon size="24" class="play-icon">
          <VideocamOutline />
        </n-icon>
      </div>
      <div class="play-button">
        <n-icon size="24" class="play-icon">
          <CaretForwardOutline />
        </n-icon>
      </div>
    </div>
    <video
      v-show="isPlaying"
      ref="videoRef"
      :src="videoUrl"
      class="video-player"
      controls
      @ended="handleEnded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NIcon } from 'naive-ui'
import { CaretForwardOutline, VideocamOutline } from '@vicons/ionicons5'

defineOptions({
  name: 'VideoPreview',
})

interface Props {
  videoUrl: string
  coverUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  coverUrl: '',
})

const isPlaying = ref(false)
const videoRef = ref<HTMLVideoElement | null>(null)

const handlePlay = () => {
  if (!isPlaying.value) {
    isPlaying.value = true
    // 等待 DOM 更新后播放视频
    setTimeout(() => {
      if (videoRef.value) {
        videoRef.value.play()
      }
    })
  }
}

const handleEnded = () => {
  isPlaying.value = false
}
</script>

<style scoped lang="less">
.video-preview {
  width: 120px;
  height: 80px;
  position: relative;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;

  .preview-cover {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-cover {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
    }

    .play-button {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      transition: all 0.3s;

      &:hover {
        background: rgba(255, 255, 255, 0.9);
        transform: translate(-50%, -50%) scale(1.1);
      }
    }
  }

  .video-player {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
