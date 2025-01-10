import { post } from '@/api/server'

export const commonApi = {
  /**
   * 获取上传凭证
   */
  uploadToken() {
    return post('/api/upload/uploadToken')
  },
}

export default commonApi
