<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { NIcon } from 'naive-ui'
  import { CaretForwardOutline, VideocamOffSharp, ImageOutline } from '@vicons/ionicons5'
  import MediaPreviewMask from './MediaPreviewMask.vue'
  import { getMediaType } from '../../utils'
  
  defineOptions({
    name: 'MediaPreviewCard',
  })
  
  interface Props {
    mediaUrl: string
  }
  
  const props = defineProps<Props>()
  const showPreview = ref(false)
  const videoRef = ref<HTMLVideoElement | null>(null)
  const mediaType = computed(() => getMediaType(props.mediaUrl))
  
  const handlePlay = () => {
    if (!props.mediaUrl) return
    showPreview.value = true
  }
</script>

<template>
  <div class="media-preview">
    <div class="preview-cover" @click="handlePlay">
      <div class="no-cover" v-if="!mediaUrl">
        <n-icon size="24" class="placeholder-icon">
          <VideocamOffSharp v-if="mediaType === 'video'" />
          <ImageOutline v-else />
        </n-icon>
      </div>
      <template v-else>
        <video
          v-if="mediaType === 'video'"
          ref="videoRef"
          :src="mediaUrl"
          class="media-background"
          preload="metadata"
        />
        <img
          v-else
          :src="mediaUrl"
          class="media-background"
        />
        <div class="play-button">
          <n-icon size="24" class="play-icon">
            <CaretForwardOutline v-if="mediaType === 'video'" />
            <ImageOutline v-else />
          </n-icon>
        </div>
      </template>
    </div>

    <MediaPreviewMask v-model="showPreview" :file="{ url: mediaUrl }" />
  </div>
</template>
  
<style scoped lang="less">
  .media-preview {
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
  
      .media-background {
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
  