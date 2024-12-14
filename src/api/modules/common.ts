import { post } from '@/api/server'

interface UploadFileResponse {
  token: string
}

export const commonApi = {
  uploadToken() {
    return post<UploadFileResponse>('/api/upload/uploadToken')
  },
}

export default commonApi
