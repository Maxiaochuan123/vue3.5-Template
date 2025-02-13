import * as qiniu from 'qiniu-js'

/**
 * 文件上传状态类型
 * pending: 等待上传
 * uploading: 上传中
 * success: 上传成功
 * error: 上传失败
 */
type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

/**
 * 上传文件信息接口
 * @interface UploadFile
 * @property {string} id - 文件唯一标识
 * @property {File} file - 文件对象
 * @property {UploadStatus} status - 上传状态
 * @property {number} progress - 上传进度(0-100)
 * @property {string} [url] - 上传成功后的文件URL
 * @property {Error} [error] - 上传失败的错误信息
 */
interface UploadFile {
  id: string
  file: File
  status: UploadStatus
  progress: number
  url?: string
  error?: Error
}

/**
 * 上传配置接口
 * @interface UploadConfig
 * @property {string} domain - 文件服务器域名
 * @property {Object} uploadConfig - 七牛云上传配置
 * @property {boolean} uploadConfig.useCdnDomain - 是否使用CDN加速域名
 * @property {string} uploadConfig.region - 存储区域
 * @property {boolean} uploadConfig.forceDirect - 是否强制直传
 */
interface UploadConfig {
  domain: string
  uploadConfig: {
    useCdnDomain: boolean
    region: 'z0' | 'z1' | 'z2' | 'na0' | 'as0' | 'cn-east-2'
    forceDirect: boolean
  }
}

/**
 * 默认上传配置
 */
const DEFAULT_CONFIG: UploadConfig = {
  domain: 'https://file.moujiang.com/',
  uploadConfig: {
    useCdnDomain: true,
    region: 'z2', // 华南区域
    forceDirect: true,
  },
}

/**
 * 七牛云文件上传类
 * 提供文件上传、进度监听、状态管理等功能
 */
class QiniuUploader {
  private config: UploadConfig
  private fileList: UploadFile[] = []
  private subscribers: Set<(files: UploadFile[]) => void> = new Set()

  /**
   * 构造函数
   * @param {Partial<UploadConfig>} config - 可选的配置参数，会与默认配置合并
   */
  constructor(config: Partial<UploadConfig> = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      uploadConfig: {
        ...DEFAULT_CONFIG.uploadConfig,
        ...(config.uploadConfig || {}),
      },
    }
  }

  /**
   * 订阅文件列表变化
   * @param {Function} callback - 文件列表变化时的回调函数
   * @returns {Function} 取消订阅的函数
   */
  subscribe(callback: (files: UploadFile[]) => void) {
    this.subscribers.add(callback)
    callback([...this.fileList])
    return () => this.subscribers.delete(callback)
  }

  /**
   * 通知所有订阅者文件列表发生变化
   * @private
   */
  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback([...this.fileList]))
  }

  /**
   * 上传单个文件
   * @private
   * @param {UploadFile} uploadFile - 要上传的文件信息
   * @param {string} token - 上传凭证
   */
  private async uploadFile(uploadFile: UploadFile, token?: string): Promise<void> {
    try {
      // 生成唯一的文件名
      const key = `moujiang/${Date.now()}-${uploadFile.file.name}`

      // 上传额外参数配置
      const putExtra = {
        fname: uploadFile.file.name,
        params: {},
        mimeType: undefined,
      }

      // 初始化上传状态
      uploadFile.status = 'uploading'
      uploadFile.progress = 0
      this.notifySubscribers()

      // 创建上传观察者
      const observable = qiniu.upload(
        uploadFile.file,
        key,
        token || '',
        putExtra,
        this.config.uploadConfig
      )

      // 订阅上传状态
      observable.subscribe({
        // 上传进度回调
        next: (res: { total: { percent: number } }) => {
          uploadFile.status = 'uploading'
          uploadFile.progress = res.total.percent
          this.notifySubscribers()
        },
        // 上传错误回调
        error: (err) => {
          uploadFile.status = 'error'
          uploadFile.error = err
          this.notifySubscribers()
        },
        // 上传完成回调
        complete: (res) => {
          uploadFile.status = 'success'
          uploadFile.url = `${this.config.domain}${res.key}`
          uploadFile.progress = 100
          this.notifySubscribers()
        },
      })
    } catch (error) {
      uploadFile.status = 'error'
      uploadFile.error = error as Error
      this.notifySubscribers()
    }
  }

  /**
   * 上传文件（公共方法）
   * @param {File | File[]} files - 要上传的文件或文件数组
   */
  async upload(files: File | File[], token?: string) {
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
      await this.uploadFile(uploadFile, token)
    }
  }

  /**
   * 删除文件
   * @param {string} id - 要删除的文件ID
   */
  remove(id: string) {
    const index = this.fileList.findIndex((file) => file.id === id)
    if (index > -1) {
      this.fileList.splice(index, 1)
      this.notifySubscribers()
    }
  }

  /**
   * 清空文件列表
   */
  clear() {
    this.fileList = []
    this.notifySubscribers()
  }

  /**
   * 获取文件列表
   * @returns {UploadFile[]} 文件列表的副本
   */
  getFiles(): UploadFile[] {
    return [...this.fileList]
  }

  /**
   * 获取上传成功的文件URL列表
   * @returns {string[]} 上传成功的文件URL数组
   */
  getUrls(): string[] {
    return this.fileList
      .filter((file) => file.status === 'success' && file.url)
      .map((file) => file.url!)
  }
}

// 导出单例实例
export const qiniuUploader = new QiniuUploader()

/**
 * 创建新的上传器实例
 * @param {Partial<UploadConfig>} config - 上传配置
 * @returns {QiniuUploader} 新的上传器实例
 */
export function createUploader(config: Partial<UploadConfig> = {}) {
  return new QiniuUploader(config)
}
