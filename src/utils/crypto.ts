import { createHash } from 'crypto-js/core'
import MD5 from 'crypto-js/md5'

/**
 * MD5加密
 * @param str 要加密的字符串
 * @returns 加密后的字符串
 */
export function md5(str: string): string {
  return MD5(str).toString()
} 