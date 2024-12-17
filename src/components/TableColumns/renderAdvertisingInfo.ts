import { h } from 'vue'
import { NEllipsis } from 'naive-ui'
import VideoPreviewCard from '@/components/MediaUploader/preview/components/VideoPreviewCard.vue'

interface AdvertisingRecord {
  videoUrl: string
  coverUrl?: string
  title: string
  createTime: string
}

export function renderAdvertisingInfo(row: AdvertisingRecord) {
  return h(
    'div',
    {
      style: 'display: flex; align-items: center; gap: 16px; width: 100%;'
    },
    [
      h(VideoPreviewCard, {
        videoUrl: row.videoUrl,
        style: 'width: 120px; flex-shrink: 0;'
      }),
      h('div', { 
        style: 'flex: 1; max-width: calc(100% - 136px);'
      }, [
        h(NEllipsis, {
          style: 'width: 100%;'
        }, {
          default: () => row.title
        }),
        h('div', { 
          style: 'font-size: 12px; color: #999; margin-top: 4px;'
        }, row.createTime)
      ])
    ]
  )
} 