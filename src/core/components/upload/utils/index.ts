import type { FileItem } from '../interface'

export function parseBytes(str: string) {
  const units = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  }

  const match = str.toLowerCase().match(/^(\d+)\s*(b|kb|mb|gb)?$/)
  if (!match) return 0

  const [, num, unit = 'b'] = match
  return Number(num) * (units[unit as keyof typeof units] || 1)
}

// 文件类型判断
export function isImage(file: FileItem | null) {
  if (!file) return false

  // 如果有 file 对象，先检查 MIME 类型
  if (file.file?.type) {
    return file.file.type.startsWith('image/')
  }

  // 如果只有 URL，则检查文件扩展名
  if (file.url) {
    return /\.(jpg|jpeg|png|gif)$/i.test(file.url)
  }

  return false
}

export function isVideo(file: FileItem | null) {
  if (!file) return false

  // 如果有 file 对象，先检查 MIME 类型
  if (file.file?.type) {
    return file.file.type.startsWith('video/')
  }

  // 如果只有 URL，则检查文件扩展名
  if (file.url) {
    return /\.(mp4|webm|ogg|mov)$/i.test(file.url)
  }

  return false
}

export function getMediaType(url: string): 'image' | 'video' | null {
  if (!url) return null

  // 检查图片扩展名
  if (/\.(jpg|jpeg|png|gif)$/i.test(url)) {
    return 'image'
  }

  // 检查视频扩展名 
  if (/\.(mp4|webm|ogg|mov)$/i.test(url)) {
    return 'video'
  }

  return null
}

/**
 * 压缩图片
 * @param file - 图片文件
 * @param options - 压缩选项
 * @returns Promise<File>
 */
export function compressImage(file: File, options: { 
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 压缩质量，0-1
} = {}): Promise<File> {
  const startTime = Date.now()
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // 计算缩放比例
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // 转换为 Blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'))
            return
          }

          // 创建新的 File 对象
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })

          // 输出压缩信息
          console.log('Image compression result:', {
            // 原文件大小
            originalSize: (file.size / 1024).toFixed(2) + 'KB',
            // 压缩后文件大小
            compressedSize: (compressedFile.size / 1024).toFixed(2) + 'KB',
            // 压缩比例
            compressionRatio: ((compressedFile.size / file.size) * 100).toFixed(1) + '%',
            // 压缩宽度
            width: width + 'px',
            // 压缩高度
            height: height + 'px',
            // 压缩质量
            quality: quality * 100 + '%',
            // 压缩时间
            timeUsed: ((Date.now() - startTime) / 1000).toFixed(2) + 's'
          })

          resolve(compressedFile)
        }, file.type, quality)
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
  })
}
