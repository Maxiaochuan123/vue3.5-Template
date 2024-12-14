import type { FileItem } from '../interface'

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

// 文件类型判断
export function isImage(file: FileItem | null) {
  // console.log(file)

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
