import { h } from 'vue'
import { NEllipsis } from 'naive-ui'
import VideoPreviewCard from '@/core/upload/media-upload/preview/VideoPreviewCard.vue'

export function renderAdvertisingInfo(row: Record<string, any>) {
  const videoUrl = row.media?.[0] || ''
  const title = row.title || ''
  const createTime = row.createTime || ''

  return h(
    'div',
    {
      style: 'display: flex; align-items: center; gap: 16px; width: 100%;'
    },
    [
      h(VideoPreviewCard, {
        videoUrl,
        style: 'width: 120px; flex-shrink: 0;'
      }),
      h('div', { 
        style: 'flex: 1; max-width: calc(100% - 136px);'
      }, [
        h(NEllipsis, {
          style: 'width: 100%;'
        }, {
          default: () => title
        }),
        h('div', { 
          style: 'font-size: 12px; color: #999; margin-top: 4px;'
        }, createTime)
      ])
    ]
  )
} 