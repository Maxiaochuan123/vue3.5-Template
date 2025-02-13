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
