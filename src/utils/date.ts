/**
 * 格式化日期时间
 * @param timestamp 时间戳
 * @param format 格式化选项
 * @returns 格式化后的日期字符串
 */
export function formatDateTime(timestamp: number | string, format: 'datetime' | 'date' | 'time' = 'datetime') {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  switch (format) {
    case 'datetime':
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    case 'date':
      return `${year}-${month}-${day}`;
    case 'time':
      return `${hour}:${minute}:${second}`;
    default:
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
} 
