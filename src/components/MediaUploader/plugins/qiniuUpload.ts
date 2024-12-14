import * as qiniu from 'qiniu-js'
import commonApi from '@/api/modules/common'

// 在类的开头打印一下 qiniu 对象
// console.log('Qiniu SDK:', qiniu)

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

// 上传文件信息
interface UploadFile {
  id: string
  file: File
  status: UploadStatus
  progress: number
  url?: string
  error?: Error
}

// 上传配置
interface UploadConfig {
  domain?: string
}

// 默认配置
const defaultConfig: UploadConfig = {
  domain: 'https://file.moujiang.com/',
}

// 七牛云上传类
class QiniuUploader {
  private config: UploadConfig
  private fileList: UploadFile[] = []
  private subscribers: Set<(files: UploadFile[]) => void> = new Set()

  constructor(config: Partial<UploadConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  // 订阅文件列表变化
  subscribe(callback: (files: UploadFile[]) => void) {
    this.subscribers.add(callback)
    callback([...this.fileList])
    return () => this.subscribers.delete(callback)
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback([...this.fileList]))
  }

  private async uploadFile(uploadFile: UploadFile): Promise<void> {
    try {
      const key = `moujiang/${Date.now()}-${uploadFile.file.name}`

      const { data: uploadToken } = await commonApi.uploadToken()
      console.log('uploadToken: ', uploadToken)

      const putExtra = {
        fname: uploadFile.file.name,
        params: {},
        mimeType: null,
      }

      const config = {
        useCdnDomain: true,
        region: qiniu.region.z2,
      }

      const observable = qiniu.upload(uploadFile.file, key, uploadToken, putExtra, config)

      observable.subscribe({
        next: (res: { total: { percent: number } }) => {
          uploadFile.progress = res.total.percent
          uploadFile.status = 'uploading'
          this.notifySubscribers()
        },
        error: (err) => {
          uploadFile.status = 'error'
          uploadFile.error = err
          this.notifySubscribers()
        },
        complete: (res) => {
          uploadFile.status = 'success'
          uploadFile.url = `${this.config.domain}${res.key}`
          uploadFile.progress = 100
          this.notifySubscribers()
        },
      })
    } catch (error) {
      console.error('Upload error:', error)
      uploadFile.status = 'error'
      uploadFile.error = error as Error
      this.notifySubscribers()
    }
  }

  // 上传文件（公共方法）
  async upload(files: File | File[]) {
    const fileArray = Array.isArray(files) ? files : [files]

    for (const file of fileArray) {
      const uploadFile: UploadFile = {
        id: Math.random().toString(36).slice(2),
        file,
        status: 'pending',
        progress: 0,
      }

      this.fileList.push(uploadFile)
      this.notifySubscribers()
      await this.uploadFile(uploadFile)
    }
  }

  // 删除文件
  remove(id: string) {
    const index = this.fileList.findIndex((file) => file.id === id)
    if (index > -1) {
      this.fileList.splice(index, 1)
      this.notifySubscribers()
    }
  }

  // 清空文件列表
  clear() {
    this.fileList = []
    this.notifySubscribers()
  }

  // 获取文件列表
  getFiles(): UploadFile[] {
    return [...this.fileList]
  }

  // 获取上传成功的文件 URL
  getUrls(): string[] {
    return this.fileList
      .filter((file) => file.status === 'success' && file.url)
      .map((file) => file.url!)
  }
}

// 导出单例
export const qiniuUploader = new QiniuUploader()

// 导出工厂函数（如果需要多个实例）
export function createUploader(config: Partial<UploadConfig> = {}) {
  return new QiniuUploader(config)
}
