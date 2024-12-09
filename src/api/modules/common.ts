import { request } from '../server'

interface UploadFileResponse {
  url: string
  // 根据实际返回数据结构添加其他字段
}

export const commonApi = {
  uploadFile(file: FormData) {
    return request.post<UploadFileResponse>('/common/v1/mjActivity/uploadFile', file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default commonApi
