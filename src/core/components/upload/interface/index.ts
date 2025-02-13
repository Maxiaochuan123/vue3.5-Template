export interface FileItem {
  url?: string
  file?: File
  status: 'uploading' | 'success' | 'error'
  progress: number
  _previewUrl?: string
}
