<script setup lang="ts">
  import { ref } from 'vue'
  import { NIcon } from 'naive-ui'
  import { CaretForwardOutline, VideocamOffSharp } from '@vicons/ionicons5'
  import MediaPreviewMask from './MediaPreviewMask.vue'
  
  defineOptions({
    name: 'VideoPreview',
  })
  
  interface Props {
    videoUrl: string
  }
  
  const props = defineProps<Props>()
  const showPreview = ref(false)
  const videoRef = ref<HTMLVideoElement | null>(null)
  
  const handlePlay = () => {
    if (!props.videoUrl) return
    showPreview.value = true
  }
</script>

<template>
  <div class="video-preview">
    <div class="preview-cover" @click="handlePlay">
      <div class="no-cover" v-if="!videoUrl">
        <n-icon size="24" class="placeholder-icon">
          <VideocamOffSharp />
        </n-icon>
      </div>
      <template v-else>
        <video 
          ref="videoRef"
          :src="videoUrl"
          class="video-background"
          preload="metadata"
        />
        <div class="play-button">
          <n-icon size="24" class="play-icon">
            <CaretForwardOutline />
          </n-icon>
        </div>
      </template>
    </div>

    <MediaPreviewMask v-model="showPreview" :file="{ url: videoUrl }" />
  </div>
</template>
  
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
      background-color: #f5f5f5;
  
      .video-background {
        position: absolute;
        inset: 0;
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
        z-index: 1;
  
        &:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translate(-50%, -50%) scale(1.1);
        }
      }
    }
  }
</style>
  