import { post } from '@/api/server'

interface UploadFileResponse {
  token: string
}

export const commonApi = {
  /**
   * 获取上传凭证
   */
  uploadToken() {
    return post<UploadFileResponse>('/api/upload/uploadToken')
  },
}

export default commonApi
